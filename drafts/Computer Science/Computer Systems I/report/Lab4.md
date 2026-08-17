
**陈灵石**

**3250104863**

# Lab4-1

**ConvUnit.sv**

```verilog
`include"conv_struct.vh"
module ConvUnit (
	input clk,
	input rst,
	input Conv::data_t in_data,
	input Conv::data_vector kernel,
	input in_valid,
	output in_ready,

	output Conv::result_t result,
	output out_valid,
	input out_ready
);

	// fill the code
	Conv::data_vector shift_data;
	logic shift_valid;
	logic shift_ready;

	Shift shift_inst(
		.clk(clk),
		.rst(rst),
		.in_data(in_data),
		.in_valid(in_valid),
		.in_ready(in_ready),
		.data(shift_data),
		.out_valid(shift_valid),
		.out_ready(shift_ready)
	);

	ConvOperator conv_op_inst(
		.clk(clk),
		.rst(rst),
		.kernel(kernel),
		.data(shift_data),
		.in_valid(shift_valid),
		.in_ready(shift_ready),
		.result(result),
		.out_valid(out_valid),
		.out_ready(out_ready)
	);

endmodule
```

- **`Shift` 模块：** 负责接收上游零散的串行数据，通过移位寄存器将其拼装成能与卷积核对齐的并行数据滑动窗口（`shift_data`）。

- **`ConvOperator` 模块：** 接收拼装好的窗口数据和卷积核权重，执行高位宽的并行乘加运算，得出最终的卷积结果（`result`）。

**Shift.sv**

```verilog
`include"conv_struct.vh"
module Shift (
	input clk,
	input rst,
	input Conv::data_t in_data,
	input in_valid,
	output reg in_ready,

	output Conv::data_vector data,
	output reg out_valid,
	input out_ready
);

	typedef enum logic {RDATA, TDATA} fsm_state;
	fsm_state state_reg;
	Conv::data_t data_reg [Conv::LEN-1:0];

	// fill the code
	always_comb begin
		for(int i = 0; i < Conv::LEN; i++) begin
			data.data[i] = data_reg[i];
		end
	end

	always_comb begin
		case(state_reg)
			RDATA: begin
				in_ready = 1'b1;
				out_valid = 1'b0;
			end
			TDATA: begin
				in_ready = 1'b0;
				out_valid = 1'b1;
			end
			default: begin
				in_ready = 1'b0;
				out_valid = 1'b0;
			end
		endcase
	end

	always_ff @( posedge clk ) begin
		if(rst) begin
			state_reg <= RDATA;
			for(int i = 0; i < Conv::LEN; i++) begin
				data_reg[i] <= '0;
			end
		end else begin
			case(state_reg)
				RDATA: begin
					if(in_valid && in_ready) begin
						for(int i = 0; i < Conv::LEN-1; i++) begin
							data_reg[i] <= data_reg[i+1];
						end
						data_reg[Conv::LEN-1] <= in_data;
						state_reg <= TDATA;
					end
				end
				TDATA: begin
					if(out_valid && out_ready) begin
						state_reg <= RDATA;
					end
				end
			endcase
		end
	end
endmodule
```

- **`RDATA` (接收状态)：** 此时对外拉高 `in_ready`，准备接收新数据；同时拉低 `out_valid`，禁止下游接受数据。

- **`TDATA` (发送状态)：** 此时对外拉高 `out_valid`，使下游能够接受数据；同时拉低 `in_ready`，不接收上游数据。

当模块处于 `RDATA` 状态，并且成功接到了一个新数据（`in_valid && in_ready` 为真）时，执行移位动作：

- 把数组里原有的老数据，统一向前挪动一格（丢弃最旧的）。

- 把刚收到的新数据 `in_data` 塞进数组的最末尾（最高位 `[Conv::LEN-1]`）。

如果在 `TDATA` 状态下，下游`out_ready` 为 0，状态机就会卡在 `TDATA` 状态。这导致它传给上游的 `in_ready` 始终为 0，从而阻止上游继续传输数据，防止数据被覆盖或丢失。

**ConvOperator.sv**

```verilog
`include"conv_struct.vh"
module ConvOperator(
	input clk,
	input rst,
	input Conv::data_vector kernel,
	input Conv::data_vector data,
	input in_valid,
	output reg in_ready,

	output Conv::result_t result,
	output reg out_valid,
	input out_ready
);

	localparam VECTOR_WIDTH = 2*Conv::WIDTH;
	typedef struct packed {
		Conv::result_t data;
		logic valid;
	} mid_vector;

	mid_vector vector_stage1 [Conv::LEN-1:0];
	mid_vector vector_stage2;

	typedef enum logic [1:0] {RDATA, WORK, TDATA} fsm_state;
	fsm_state state_reg;

	// fill the code
	logic mul_start;
	wire [Conv::LEN-1:0] mul_finish;
	Conv::result_t mul_product [Conv::LEN-1:0];

	generate
		for(genvar i = 0; i < Conv::LEN; i = i + 1) begin : gen_mul
			Multiplier #(
				.LEN(Conv::WIDTH)
			) mul_inst (
				.clk(clk),
				.rst(rst),
				.multiplicand(data.data[i]),
				.multiplier(kernel.data[i]),
				.start(mul_start),
				.product(mul_product[i]),
				.finish(mul_finish[i])
			);
		end
	endgenerate

	Conv::result_t add_tmp [Conv::LEN-1:1] /* verilator split_var */;
	generate
		for(genvar i = 1; i < Conv::LEN; i = i + 1) begin : gen_add_tree
			if(i < Conv::LEN/2) begin
				assign add_tmp[i] = add_tmp[i*2] + add_tmp[i*2+1];
			end else begin
				assign add_tmp[i] = vector_stage1[(i-Conv::LEN/2)*2].data +
									vector_stage1[(i-Conv::LEN/2)*2+1].data;
			end
		end
	endgenerate

	always_comb begin
		in_ready = (state_reg == RDATA);
		out_valid = (state_reg == TDATA);
		result = vector_stage2.data;
	end

	always_ff @(posedge clk) begin
		if(rst) begin
			state_reg <= RDATA;
			mul_start <= 1'b0;
			vector_stage2.valid <= 1'b0;
			vector_stage2.data <= '0;
			for(int i = 0; i < Conv::LEN; i++) begin
				vector_stage1[i].valid <= 1'b0;
				vector_stage1[i].data <= '0;
			end
		end else begin
			case(state_reg)
				RDATA: begin
					vector_stage2.valid <= 1'b0;
					for(int i = 0; i < Conv::LEN; i++) begin
						vector_stage1[i].valid <= 1'b0;
					end
					if(in_valid && in_ready) begin
						state_reg <= WORK;
						mul_start <= 1'b1;
					end
				end
				WORK: begin
					mul_start <= 1'b0;
					if(!vector_stage1[0].valid) begin
						if(mul_finish[0]) begin
							for(int i = 0; i < Conv::LEN; i++) begin
								vector_stage1[i].data <= mul_product[i];
								vector_stage1[i].valid <= 1'b1;
							end
						end
					end else if (!vector_stage2.valid) begin
						vector_stage2.data <= add_tmp[1];
						vector_stage2.valid <= 1'b1;
						state_reg <= TDATA;
					end
				end
				TDATA: begin
					if(out_valid && out_ready) begin
						state_reg <= RDATA;
					end
				end
				default: state_reg <= RDATA;
			endcase
		end
	end

endmodule
```

1. 使用 `generate` 语句在空间上“批量复制”了 4 个移位乘法器模块（`Multiplier`）。这 4 个乘法器被同一个 `start` 信号同时触发，完全并行地执行乘法运算，提升吞吐率。

2. 并行加法树

仿真结果：

![[sysi-lab4-1-simsuccess.png]]

这些十六进制散列就是移位寄存器每滑动一次窗口算出的单次完整卷积结果。

综合实现：

![[sys1-lab4-1-syn.png]]

![[sys1-lab4-1-imp.png]]

## 仿真测试样例和下板的顶层结构为什么满足 valid-ready 握手协议

valid-ready 协议：发送方在拉高 Valid 后，必须保持数据稳定，直到接收方拉高 Ready 发生有效交接；接收方只在 Valid 和 Ready 同时为高时才采样数据。

### 1. 仿真测试 (Testbench)

Testbench 作为**发送方**，发数逻辑如下：

```verilog
in_valid = 1'b1;                     // 1. 拉高 valid 并给出数据
while(in_ready == 1'b0) @(posedge clk); // 2. 如果没 ready，就一直等待
in_valid = 1'b0;                     // 3. 握手成功后才撤销 valid
```

`while` 循环起到了阻塞挂起的作用。只要 `ConvUnit` 没准备好（`in_ready = 0`），激励端就会把数据和 `in_valid` 信号卡住，实现发送端的握手等待机制。

#### 2. 下板顶层结构 (Top)

`top.sv` 包含了发送端（DataGenerator）和接收端（result_reg）两头，它们都严格遵守了协议：

- 发送（DataGenerator）：

    ```verilog
    else if(next_test) valid <= 1'b1;       // 按键触发，拉高 valid
    else if(valid & ready) valid <= 1'b0;   // 只有握手成功，才撤销 valid
    ```

    这是基于时序逻辑的状态保持。一旦 Valid 被按键拉高，除非 `valid & ready` 同时为 1（即下游成功接收），否则 Valid 会一直保持为高，数据不会丢失。

- 接收（result_reg）：

    ```verilog
    assign out_ready = 1'b1;
    if(out_valid & out_ready) result_reg <= result;
    ```

    由于数码管可以一直显示，所以 `out_ready` 常高。但 `result_reg` 不能随意接收数据，它只在 `out_valid & out_ready` 成立的那个时钟沿，才接收有效计算结果，屏蔽了计算过程中的无效杂波。

## 对 `ConvOperator` 作模块分割和数据交换提升性能

可以将 `ConvOperator` 分为两个部分：**乘法阵列模块（MulArray）** 和 **加法树模块（AdderTree）**，并在它们中间也加上一套 Valid-Ready 握手协议。

### 分割与交互思路

- **MulArray 模块：** 只做乘法。接收 `Shift` 送来的数据和权重，经过几十个周期的计算得到 4 个乘积。算完后，拉高内部的 `mid_valid`，将 4 个乘积作为一组发送到下游。

- **AdderTree 模块：** 只做加法。平时拉高 `mid_ready` 等待。一旦收到乘积，经过组合逻辑加法树算出总和，存入结果寄存器，然后通过顶层的 `out_valid` 向外发送。

#### 性能提升

**提升吞吐量：**

- 目前的 `ConvOperator` 状态机是串行的（`WORK` -> `TDATA`）。乘法器工作时，加法树等待；加法树发送结果时，乘法器等待。

- 分割后： 实现了并行流水线，乘法器和加法树只要握手成功，就可以立刻接收 `Shift` 的下一组窗口数据开始新一轮乘法。

## Lab4-2

**UartLoop.sv**

```verilog
`include"uart_struct.vh"
module UartLoop(
    input clk,
    input rstn,
    Decoupled_ift.Slave uart_rdata,
    Decoupled_ift.Master uart_tdata,
    input UartPack::uart_t debug_data,
    input logic debug_send,
    output UartPack::uart_t debug_rdata,
    output UartPack::uart_t debug_tdata
);
    import UartPack::*;

    uart_t rdata;
    logic rdata_valid;

    uart_t tdata;
    logic tdata_valid;

    // fill the code
    assign rdata = uart_rdata.data;
    assign rdata_valid = uart_rdata.valid;
    assign tdata = debug_send ? debug_data : rdata;
    assign tdata_valid = debug_send ? 1'b1 : rdata_valid;
    assign uart_tdata.data = tdata;
    assign uart_tdata.valid = tdata_valid;
    assign uart_rdata.ready = debug_send ? 1'b0 : uart_tdata.ready;

    assign debug_rdata = rdata;
    assign debug_tdata = tdata;

endmodule
```

- 默认状态下，将接收接口（`uart_rdata`）的数据（`data`）和有效标志（`valid`）直接连给发送接口（`uart_tdata`），实现数据的接收即发送。

- 利用三元运算符构成了多路选择器。当检测到发送按键按下（`debug_send = 1`）时，切断正常的接收回环，将发送数据强制替换为拨码开关上的数据（`debug_data`），并主动拉高发送有效标志（`1'b1`）。

- 安全反压：

    - 正常回环时，将发送端 FIFO 的“就绪状态（`ready`）”原样传回给接收端。如果发送端满了，接收端就会随之暂停。

    - 调试发送时，主动向接收端输出 `1'b0`（不就绪），强行暂停接收外部数据，避免在调试占用通道时导致接收数据丢失。

- 始终将当前通道内的接收数据（`rdata`）和准备发送的数据（`tdata`）通过 `debug_*` 端口引出，供外部数码管实时显示。

![[sys1-lab4-2-simsuccess.png]]

- 验证了 FIFO 缓存与 UART 回环收发功能完全正常。

- 仿真显示，设备**发送**的数据序列（c4, 9c, 02...）与之前**接收**到的数据序列在内容和顺序上**完全一致**。这证明系统实现了**先入先出（FIFO）**，中间无丢包、无错序，最终达成 `success!!!`。

回环测试：

![[sys1-lab4-2-test.png]]

## `async_transmitter` 有限状态机与工作流程

**状态机设计:**

- **0000 (Idle/Wait):** 等待发送开始信号 (`TxD_start`)。如果收到 `TxD_start`，转移到 `0100`。

- **0100 (Start Bit):** 发送起始位 (0)。等待 `BitTick`，转移到 `1000`。

- **1000 - 1111 (Data Bits 0-7):** 依次发送数据的 8 个比特位。每个状态等待一个 `BitTick` 后转移到下一个状态。最高位由状态值的第三位 (`TxD_state[3]`) 控制移位逻辑。

- **0010 (Stop Bit):** 发送停止位 (1)。等待 `BitTick`，转移回 `0000`。

**工作流程:**

1. 发送器处于空闲状态 (`TxD_state = 0`)，`TxD_ready` 为高，`TxD_busy` 为低。

2. 当检测到 `TxD_start` 为高时，将输入的并行数据 (`TxD_data`) 锁存到移位寄存器 (`TxD_shift`) 中。

3. 状态机按时钟 (`BitTick`) 步进。依次输出起始位、8个数据位 (通过移位寄存器不断右移输出最低位) 和停止位。`TxD` 线路通过组合逻辑根据当前状态和移位寄存器的值输出对应的电平。

4. 发送完停止位后，状态机返回空闲状态，准备下一次发送。

## 2. `async_receiver` 规避毛刺的方法

1. 接收器使用高于波特率数倍的时钟 (`OversamplingTick`) 对 RxD 信号进行高频采样，而不是在每个比特位只采样一次。

2. 将外部输入的 RxD 信号通过两级寄存器 (`RxD_sync`) 同步到本地时钟域。

3. 使用一个计数器 (`Filter_cnt`) 对同步后的采样值进行累加/递减。只有当连续多次采样均为同一电平时 (例如连续多次为高或为低，计数器达到阈值)，才判定数据位 (`RxD_bit`) 发生翻转。有效滤除持续时间短于阈值的电平毛刺。

4. 状态机不立刻在电平跳变沿读取数据，而是等待过采样计数器达到中点位置 (`OversamplingCntUpper`) 时才触发 `sampleNow` 信号进行数据读取。此时信号电平最稳定。
