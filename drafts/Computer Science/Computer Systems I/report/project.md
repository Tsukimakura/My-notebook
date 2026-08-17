陈灵石 3250104863

# Project

## 一、 数据通路模块

### 1. 寄存器堆 (RegFile.sv)

实现 32 个 64 位通用寄存器。要求 `x0` 寄存器恒为 0，在写入逻辑中增加 `write_addr != 5'b0` 的判断。为了匹配单周期 CPU 的时序，写入操作采用同步时序逻辑（`always_ff`，在时钟上升沿写入），而读取操作采用异步组合逻辑（`assign`）。

```verilog
module RegFile (
  input clk, rst, we,
  input CorePack::reg_ind_t  read_addr_1, read_addr_2, write_addr,
  input CorePack::data_t     write_data,
  output CorePack::data_t    read_data_1, read_data_2
);
  import CorePack::*;
  integer i;
  data_t register [1:31];

  always_ff @(posedge clk) begin
      if (rst) begin
          for (i = 1; i < 32; i = i + 1) register[i] <= 64'b0;
      end else if (we && write_addr != 5'b0) begin
          register[write_addr] <= write_data;
      end
  end

  assign read_data_1 = (read_addr_1 == 5'b0) ? 64'b0 : register[read_addr_1];
  assign read_data_2 = (read_addr_2 == 5'b0) ? 64'b0 : register[read_addr_2];
endmodule
```

### 2. 算术逻辑单元 (ALU.sv)

ALU 负责执行所有的算术、逻辑和移位运算。难点在于兼容 RV64 架构特有的 32 位运算指令（带 `W` 后缀，如 `ADDW`）。针对这类指令，截取操作数的低 32 位进行运算，并利用 Verilog 的 `$signed()` 函数强制将结果进行符号扩展至 64 位。针对 Verilator 编译器的隐式位宽扩展警告，使用了 `/* verilator lint_off WIDTHEXPAND */` 宏进行处理。

```verilog
module ALU (
  input  CorePack::data_t a, b,
  input  CorePack::alu_op_enum  alu_op,
  output CorePack::data_t res
);
  import CorePack::*;
  always_comb begin
      case(alu_op)
          ALU_ADD:  res = a + b;
          ALU_SUB:  res = a - b;
          ALU_AND:  res = a & b;
          ALU_OR:   res = a | b;
          ALU_XOR:  res = a ^ b;
          ALU_SLL:  res = a << b[5:0];
          ALU_SRL:  res = a >> b[5:0];
          ALU_SRA:  res = $signed(a) >>> b[5:0];
          ALU_SLT:  res = ($signed(a) < $signed(b)) ? 64'b1 : 64'b0;
          ALU_SLTU: res = (a < b) ? 64'b1 : 64'b0;
          /* verilator lint_off WIDTHEXPAND */
          ALU_ADDW: res = $signed(a[31:0] + b[31:0]);
          ALU_SUBW: res = $signed(a[31:0] - b[31:0]);
          ALU_SLLW: res = $signed(a[31:0] << b[4:0]);
          ALU_SRLW: res = $signed(a[31:0] >> b[4:0]);
          ALU_SRAW: res = $signed($signed(a[31:0]) >>> b[4:0]);
          /* verilator lint_on WIDTHEXPAND */
          default:  res = 64'b0;
      endcase
  end
endmodule
```

### 3. 比较器 (Cmp.sv)

专用于处理 B 型分支指令的条件判定。利用有符号操作符 `$signed()` 区分有符号比较（如 `blt`）和无符号比较（如 `bltu`）。

```verilog
module Cmp (
    input CorePack::data_t a, b,
    input CorePack::cmp_op_enum cmp_op,
    output logic cmp_res // 注意：必须显式声明为 logic，否则 Vivado 综合报错
);
    import CorePack::*;
    always_comb begin
        case(cmp_op)
            CMP_EQ:  cmp_res = (a == b);
            CMP_NE:  cmp_res = (a != b);
            CMP_LT:  cmp_res = ($signed(a) < $signed(b));
            CMP_GE:  cmp_res = ($signed(a) >= $signed(b));
            CMP_LTU: cmp_res = (a < b);
            CMP_GEU: cmp_res = (a >= b);
            default: cmp_res = 1'b0;
        endcase
    end
endmodule
```

### 4. 立即数生成器 (ImmGen.sv)

根据控制器传来的 `imm_op` 类型，从 32 位机器码的各个分散字段中拼装出立即数。利用 SystemVerilog 的 `{n{inst[31]}}` 语法实现符号扩展。

```verilog
module ImmGen(
    input CorePack::inst_t inst,
    input CorePack::imm_op_enum imm_op,
    output CorePack::data_t imm
);
    import CorePack::*;
    always_comb begin
        case (imm_op)
            I_IMM:  imm = {{52{inst[31]}}, inst[31:20]};
            S_IMM:  imm = {{52{inst[31]}}, inst[31:25], inst[11:7]};
            B_IMM:  imm = {{52{inst[31]}}, inst[7], inst[30:25], inst[11:8], 1'b0};
            U_IMM:  imm = {{32{inst[31]}}, inst[31:12], 12'b0};
            UJ_IMM: imm = {{44{inst[31]}}, inst[19:12], inst[20], inst[30:21], 1'b0};
            IMM6:   imm = {58'b0, inst[25:20]};
            IMM7:   imm = {57'b0, inst[26:20]};
            default: imm = 64'b0;
        endcase
    end
endmodule
```

## 访存对齐

由于数据总线为 64 位，而内存支持字节级寻址（Byte-addressing），需要解决 CPU 字长与访存颗粒度不对齐的问题。利用内存地址的低三位 `addr[2:0]` 计算 8 字节块内的偏移量。

### 1. 写入掩码生成 (MaskGen.sv)

生成 8 位的 `wmask` 以保护内存总线上的无关字节不被覆盖。首先根据指令类型（Byte, Half, Word, Double）生成基础掩码（如 `sb` 为 `00000001`），随后将其左移 `addr[2:0]` 位，对齐到总线物理位置。

```verilog
module MaskGen(
    input CorePack::mem_op_enum mem_op,
    input CorePack::addr_t dmem_waddr,
    output CorePack::mask_t dmem_wmask
);
  import CorePack::*;
  mask_t base_mask;
  always_comb begin
    case(mem_op)
      MEM_B, MEM_UB: base_mask = 8'b0000_0001;
      MEM_H, MEM_UH: base_mask = 8'b0000_0011;
      MEM_W, MEM_UW: base_mask = 8'b0000_1111;
      MEM_D:         base_mask = 8'b1111_1111;
      default:       base_mask = 8'b0000_0000;
    endcase
  end
  assign dmem_wmask = base_mask << dmem_waddr[2:0];
endmodule
```

### 2. 写入数据对齐 (DataPkg.sv)

寄存器中待写入的数据始终在最低位，需将其向左移动 `addr[2:0] * 8` 个比特，使其进入 64 位总线对应的正确比特位。

```verilog
module DataPkg(
    input CorePack::mem_op_enum mem_op,
    input CorePack::data_t reg_data,
    input CorePack::addr_t dmem_waddr,
    output CorePack::data_t dmem_wdata
);
  import CorePack::*;
  wire [5:0] shift_amount = {dmem_waddr[2:0], 3'b000};
  assign dmem_wdata = reg_data << shift_amount;
endmodule
```

### 3. 读取数据截断与扩展 (DataTrunc.sv)

从内存输出的 64 位原始数据中，根据地址偏移量右移回最低端。随后，根据是有符号读取（如 `lb`, `lh`）还是无符号读取（如 `lbu`），进行符号扩展或零扩展填充至 64 位。

```verilog
module DataTrunc (
    input CorePack::data_t dmem_rdata,
    input CorePack::mem_op_enum mem_op,
    input CorePack::addr_t dmem_raddr,
    output CorePack::data_t read_data
);
  import CorePack::*;
  wire [5:0] shift_amount = {dmem_raddr[2:0], 3'b000};
  wire [63:0] shifted_data = dmem_rdata >> shift_amount;

  always_comb begin
    case(mem_op)
      MEM_B:  read_data = {{56{shifted_data[7]}}, shifted_data[7:0]};
      MEM_H:  read_data = {{48{shifted_data[15]}}, shifted_data[15:0]};
      MEM_W:  read_data = {{32{shifted_data[31]}}, shifted_data[31:0]};
      MEM_UB: read_data = {56'b0, shifted_data[7:0]};
      MEM_D:  read_data = shifted_data;
      default: read_data = 64'b0;
    endcase
  end
endmodule
```

## 二、 控制单元设计 (Controller.sv)

采用二段译码:

- 第一段：提取 `opcode`，分类出 `is_load`, `is_store`, `is_reg` 等布尔类型线网。

- 第二段：基于逻辑或（`|`）和 `Case` 语法，拼装出 `we_reg`、MUX 选通端及 ALU 操作码。（`LUI` 指令不需要读取 `rs1`，为 `ALU_A` 分配了特殊的 `ASEL0` 通道。）

```verilog
module controller (
    input CorePack::inst_t inst,
    output logic we_reg, we_mem, re_mem, npc_sel,
    output CorePack::imm_op_enum immgen_op,
    // 其他输出定义
);
    import CorePack::*;

    // 第一段译码
    wire [6:0] opcode = inst[6:0];
    wire [2:0] funct3 = inst[14:12];
    wire [6:0] funct7 = inst[31:25];

    wire is_load = (opcode == LOAD_OPCODE);
    wire is_store = (opcode == STORE_OPCODE);
    wire is_reg = (opcode == REG_OPCODE);
    wire is_lui = (opcode == LUI_OPCODE);
    // 其他指令类别

    // 第二段译码：使能与路由
    assign we_reg = is_load | is_imm | is_immw | is_auipc | is_reg | is_regw | is_lui | is_jalr | is_jal;
    assign we_mem = is_store;
    assign re_mem = is_load;
    assign npc_sel = is_branch;

    always_comb begin
        case(1'b1)
            is_lui: alu_asel = ASEL0;
            is_auipc | is_branch | is_jal: alu_asel = ASEL_PC;
            default: alu_asel = ASEL_REG;
        endcase
    end

    // ALU 操作码译码 (通过 funct7[5] 区分加减)
    always_comb begin
        if (is_load | is_store | is_auipc | is_jal | is_jalr | is_branch | is_lui) begin
            alu_op = ALU_ADD;
        end else if (is_imm | is_reg) begin
            case (funct3)
                ADD_FUNCT3: alu_op = (is_reg && funct7[5]) ? ALU_SUB : ALU_ADD;
                // 其他运算
            endcase
        end
    end
endmodule
```

## 三、 CPU 顶层连线 (Core.sv)

按照经典五级流水线逻辑，将子模块实例化并互相连接。

1. **IF:** 使用 `pc[2]` 处理 64 位总线与 32 位指令的错位截取。

2. **ID/EX:** 根据 `Controller` 给出的 `_sel` 信号构建输入选择 MUX；计算分支跳转信号 `br_taken` 生成 `next_pc`。

3. **MEM/WB:** 利用 `Mem_ift` 接口结构体发起 Valid-Ready 总线握手。单周期环境将 `valid/ready` 全部常开（设为 1）。最后通过 `wb_sel` MUX 决定回写数据。

```verilog
    // IF 阶段：处理 PC 与指令截取
    always_ff @(posedge clk) begin
        if(rst) pc <= 64'b0;
        else pc <= next_pc;
    end
    wire [63:0] imem_rdata_full = imem_ift.r_reply_bits.rdata;
    assign inst = pc[2] ? imem_rdata_full[63:32] : imem_rdata_full[31:0];

    // EX 阶段：跳转逻辑与 Next PC 选择
    assign br_taken = (npc_sel & cmp_res) | (inst[6:0] == JAL_OPCODE) | (inst[6:0] == JALR_OPCODE);
    assign next_pc = br_taken ? alu_res : (pc + 64'd4);

    // MEM 阶段：内存总线 Valid-Ready 协议硬连线
    assign dmem_ift.r_request_valid = re_mem;
    assign dmem_ift.r_request_bits.raddr = alu_res;
    assign dmem_ift.r_reply_ready = 1'b1;

    // WB 阶段：写回选择 MUX
    always_comb begin
        case(wb_sel)
            WB_SEL_ALU: wb_val = alu_res;
            WB_SEL_MEM: wb_val = mem_out;
            WB_SEL_PC:  wb_val = pc + 64'd4;
            default:    wb_val = alu_res;
        endcase
    end
```

## 四、 仿真测试与结果分析

执行 `make TESTCASE=full` 进行协同仿真测试。

![[sys1-project-sim.png]]

**仿真结果解释：**

1. 日志中打印出 `>>>> test_1` 直至 `>>>> test_80` 且随后输出 `>>>> pass`，证明 CPU 完美通过了包含基础运算、跳转、逻辑移位、访存打包在内的全部 80 个极端测试用例，数据通路设计逻辑正确。

2. 最后的报错 `[error] PC SIM 0000000000000000, DUT 00000000000009b0` 及异常 `unimp` 是预期行为。程序执行结束后遇到未实现指令（`0xc0001073`），Spike 作为全功能模拟器触发了非法指令异常并使 PC 跳转至 `0x0`；而 CPU 未实现异常处理机制，因此停滞在 `0x9b0`，从而触发比对差异退出。

## 五、 下板

**硬件调试方法与结果解释：**

- **单步追踪验证：** 利用 `switch[15]` 进入单步模式，通过按压 `btn[0]` 手动触发时钟。

    观察发现，首条指令 `li gp, 1` 执行后，查阅 `rd_data` 数码管显示 `00000001`，证明控制器译码及写入状态在硬件层面连线正常。

- **运行验证：**

    将 `switch[15]` 拨下切换至全速模式，使用板载时钟运行完整测试。

    数码管最终稳定显示 `000009A8`，证明满足要求且测试用例在芯片内跑通。
