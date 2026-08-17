# Lab1-2 report

**陈灵石 图灵2501 3250104863**

**SegDecoder.v**

```verilog
`timescale 1ns / 1ps

module SegDecoder (
	input wire [3:0] data,
	input wire point,
	input wire LE,
	output wire a,
	output wire b,
	output wire c,
	output wire d,
	output wire e,
	output wire f,
	output wire g,
	output wire p
);

  wire wire0, wire1, wire2, wire3;
  wire inv_wire0, inv_wire1, inv_wire2, inv_wire3;
  assign {wire3 ,wire2, wire1, wire0} = data;
  assign {inv_wire0, inv_wire1, inv_wire2, inv_wire3} = {~wire0, ~wire1, ~wire2, ~wire3};

  // minterms for number 0-f
  wire [15:0] and_gate;
  assign and_gate[0] = inv_wire0 & inv_wire1 & inv_wire2 & inv_wire3; // 0
  assign and_gate[1] = wire0 & inv_wire1 & inv_wire2 & inv_wire3; // 1
  assign and_gate[2] = inv_wire0 & wire1 & inv_wire2 & inv_wire3; // 2
  assign and_gate[3] = wire0 & wire1 & inv_wire2 & inv_wire3; // 3
  assign and_gate[4] = inv_wire0 & inv_wire1 & wire2 & inv_wire3; // 4
  assign and_gate[5]  = wire0 & inv_wire1 & wire2 & inv_wire3; // 5
  assign and_gate[6]  = inv_wire0 & wire1 & wire2 & inv_wire3; // 6
  assign and_gate[7]  = wire0 & wire1 & wire2 & inv_wire3; // 7
  assign and_gate[8]  = inv_wire0 & inv_wire1 & inv_wire2 & wire3; // 8
  assign and_gate[9]  = wire0 & inv_wire1 & inv_wire2 & wire3; // 9
  assign and_gate[10] = inv_wire0 & wire1 & inv_wire2 & wire3; // A
  assign and_gate[11] = wire0 & wire1 & inv_wire2 & wire3; // B
  assign and_gate[12] = inv_wire0 & inv_wire1 & wire2 & wire3; // C
  assign and_gate[13] = wire0 & inv_wire1 & wire2 & wire3; // D
  assign and_gate[14] = inv_wire0 & wire1 & wire2 & wire3; // E
  assign and_gate[15] = wire0 & wire1 & wire2 & wire3; // F
  // fill your code for remaining numbers

  // SegDecoder for a

  wire a_or, a_result;
  assign a_or = and_gate[1] | and_gate[4] | and_gate[11] | and_gate[13];
  assign a_result = a_or | LE
  assign a = a_result;

 // fill your code for decoder of b-g and p
  wire b_or
  assign b_or = and_gate[5] | and_gate[6] | and_gate[11] | and_gate[12] | and_gate[14] | and_gate[15];
  assign b = b_or | LE;

  wire c_or;
  assign c_or = and_gate[2] | and_gate[12] | and_gate[14] | and_gate[15];
  assign c = c_or | LE;

  wire d_or;
  assign d_or = and_gate[1] | and_gate[4] | and_gate[7] | and_gate[10] | and_gate[15];
  assign d = d_or | LE;

  wire e_or;
  assign e_or = and_gate[1] | and_gate[3] | and_gate[4] | and_gate[5] | and_gate[7] | and_gate[9];
  assign e = e_or | LE;

  wire f_or;
  assign f_or = and_gate[1] | and_gate[2] | and_gate[3] | and_gate[7] | and_gate[13];
  assign f = f_or | LE;

  wire g_or;
  assign g_or = and_gate[0] | and_gate[1] | and_gate[7] | and_gate[12];
  assign g = g_or | LE;

  assign p = (~point) | LE;

endmodule
```

按照实验报告中的原理图编写共阳极数码管的代码。`and_gate[15:0]` 相当于译码器的所有与门，与四位输入 `data[3:0]` 的 16 种可能一一对应（通过 wire 和 inv_wire 分别对应无/有反相器的导线）。每个或门根据真值表连接相应的几个与门作为输入。最后根据电路图，加入 LE （使能信号）的判别逻辑。

**仿真模拟结果：**

![[sys1-lab1-2-sim2.png]]

**Mux4T1_32.v**

```verilog
module Mux4T1_32(
	input [31:0] I0,
	input [31:0] I1,
	input [31:0] I2,
	input [31:0] I3,
	input [1:0] S,
	output [31:0] O
);

	//fill your code
	wire [31:0] I [3:0];
	assign I[0] = I0;
	assign I[1] = I1;
	assign I[2] = I2;
	assign I[3] = I3;
	assign O = I[S];

endmodule
```

选择 index 索引的方法编写复合多路选择器的代码。该方法**简洁且可读性强**（不需要 always 块、if-else/case 等复杂判断逻辑），可以很容易看出 S 的两位输入对应输出哪个总线的输入。

其它方法对比：

- “多个一位多路选择器组合” 的方法可以比较直观地看出复合多路选择器的工作原理（一个 S 同时按照相同逻辑选择所有位的输入进行输出），但是需要**提前封装**一位多路选择器的模块，且要了解模块内各参数的顺序和作用。在**大型项目多人协作**中已经封装了相应的小模块的情况下较有优势。

- “与或形式” 的方法，未简化的情况下代码重复性过高，可读性极差。简洁性和可读性都不错，但对编写者的逻辑要求较高，容易出错。

- “ ? : 语法” 的方法代码非常简洁，但是多层嵌套三目运算符可读性极差。并且完全是类似 C 语言的逻辑描述，**缺乏对电路底层原理的描述**，容易出错。

- if-else 语法 和 case 语法相当于展开了三目运算符，需要在 always 块中编写，简洁性较差，但可读性和逻辑相对清晰。二者相比，case 语法更加简洁易懂。但同样隐藏了电路底层原理，值保留了逻辑描述。

**vivado 综合实现：**

![[sys-lab1-2-vivado-state.png]]

![[sys-lab1-2-implementation.png]]

**repo/sys-project/lab1-2/sim/testbench.v**

```verilog
module Testbench;
	reg [3:0] data;
	reg point;
	reg LE;
	wire a,b,c,d,e,f,g,p;
	integer i;

	initial begin
		LE=1'b1;
		point=1'b1;
		data=4'h9;
		#5;
		LE=1'b0;
		for(i=0;i<8;i=i+1)begin
			data=i[3:0];
			#5;
		end
		point=1'b0;
		for(i=8;i<16;i=i+1)begin
			data=i[3:0];
			#5;
		end
		$finish;
	end

	SegDecoder dut(
		.data(data),
		.point(point),
		.LE(LE),
		.a(a),
		.b(b),
		.c(c),
		.d(d),
		.e(e),
		.f(f),
		.g(g),
		.p(p)
	);

	`ifdef VERILATE
		initial begin
			$dumpfile({`TOP_DIR,"/Testbench.vcd"});
			$dumpvars(0,dut);
			$dumpon;
		end
	`endif

endmodule
```

**“将 `for` 语句展开为初始化序列，然后写出你对 `for` 语句的理解”**

```verilog
// 原始 for 语句
for(i=0;i<8;i=i+1)begin
	data=i[3:0];
	#5;
end
point=1'b0;
for(i=8;i<16;i=i+1)begin
	data=i[3:0];
	#5;
end

// 展开为初始化序列

data = 4'b0000; #5;
data = 4'b0001; #5;
data = 4'b0010; #5;
data = 4'b0011; #5;
data = 4'b0100; #5;
data = 4'b0101; #5;
data = 4'b0110; #5;
data = 4'b0111; #5;

point = 1'b0;

data = 4'b1000; #5;
data = 4'b1001; #5;
data = 4'b1010; #5;
data = 4'b1011; #5;
data = 4'b1100; #5;
data = 4'b1101; #5;
data = 4'b1110; #5;
data = 4'b1111; #5;
```

**理解：** 当需要规律进行某些操作（比如这里给 data 赋值并设置 5 个时间单位的计时器），同时每次操作中的某个数据规律变化（比如这里给 data 的赋值恰好四位拼起来是一个数从 0 加到 15）时，可以使用 for 循环简化代码。

**多路选择器语法比较：**

结构化描述法：

- 面向对象，通过内置的 AND、OR、NOT 模块直接描述与或非门电路和连线的方法描述门级电路，可以和电路逻辑完美对应，但是编写较麻烦，可读性一般，对于电路功能的描述较差。

数据流描述法：

- 面向过程，相比结构化描述法，代码更简洁，逻辑更直观，但也因此对底层门电路的结构描述不如结构化描述法。

行为描述法：

- 非常简洁，逻辑直观。但几乎完全隐藏底层电路结构，需要在编写时注意，避免出错。

更多输入的多路选择器：方法和优缺点与前面 “复合多路选择器” 类似。

最喜欢行为描述法/index 索引。

**repo/sys-project/lab1-2/syn**

- **`clkdiv.v` (分频器)：降速。** 把 FPGA 的系统主时钟变慢，为数码管扫描提供合适的节拍。

- **`SegDriver.v` (数码管驱动)：动态扫描。** 把一长串数据切片，并极快地轮流给 8 个数码管通电供电，利用人眼的视觉暂留，达到同时显示的效果。

- **`top.v` (顶层模块)**

- **`nexysa7.xdc` (约束文件)**
