---
title: "类型、位宽与表达式（Types and Expressions）"
status: draft
tags: [cs, verilog, systemverilog, lab]
created: 2026-10-08
updated: 2026-10-08
sources:
  - "~/sys1/sys1-sp26/src/lab1-2/submit/"
  - "~/sys1/sys1-sp26/src/lab2-1/"
  - "~/sys1/sys1-sp26/src/project/submit/"
  - "~/sys1/sys1-sp26/docs/lab3-1-appendix.md"
---

# 类型、位宽与表达式（Types and Expressions）

## 四态、二态与字面量

Verilog 的 `wire`、`reg` 与 SV 的 `logic` 通常使用四态（four-state）模型：`0`、`1`、`x`（未知，unknown）、`z`（高阻，high impedance）。传统四态仿真中，未初始化变量常为 X，无驱动线网常为 Z；真实硬件并不存在可以用作正常数据值的“X”。`bit` 是二态（two-state）类型，适合部分 testbench 数据，不能用它检查未知态传播。

字面量格式：`位宽'基数数值`；基数 `b/o/d/h` 分别表示二、八、十、十六进制，可用下划线分组。

| 示例 | 含义 |
| --- | --- |
| `4'b1010`、`8'hA5`、`32'd10` | 明确位宽的无符号数 |
| `8'shFF` | 8 位有符号数 −1；`s` 声明 signed |
| `-8'sd1` | 一元负号加有符号字面量，结果为 8 位 −1 |
| `4'bx001`、`1'bz` | 包含未知/高阻位 |
| `'0`、`'1` | 按目标上下文宽度填满 0 或 1，适合赋值 |
| `10` | 无尺寸十进制整数，通常为至少 32 位的 signed 整数 |

`int` / `integer` 通常是 32 位 signed 四态类型，`longint` 是 64 位，`shortint` 是 16 位；`int unsigned` 改为无符号。循环计数和仿真常用它们，数据通路优先声明明确位宽。

## 运算符：先分清逐位与逻辑

| 类别 | 运算符 | 结果与用途 |
| --- | --- | --- |
| 逐位（bitwise） | `~ & \| ^ ~^` / `^~` | 对每一位运算，门电路、掩码、异或求和 |
| 归约（reduction） | 一元 `&a`、`\|a`、`^a` | 整个向量归约为一位：全 1、任意 1、奇偶性 |
| 逻辑（logical） | `! && \|\|` | 把操作数按真假判断，结果一位 |
| 算术 | `+ - * / %` | 位宽有限的运算；运行时除法/取模可能很昂贵 |
| 比较 | `< <= > >= == !=` | 结果一位；大小比较受 signedness 影响 |
| 四态相等 | `=== !==` | 把 X/Z 当成可比较状态，常用于 testbench |
| 移位 | `<< >> <<< >>>` | 左移补 0；右算术移位仅在左操作数 signed 时补符号 |
| 条件 | `condition ? a : b` | mux；两分支也会发生位宽/符号类型协调 |

`~4'b0010 = 4'b1101`，`!4'b0010 = 1'b0`。对于一位握手信号，`valid & ready` 与 `valid && ready` 常得到相同结果，但两者的向量语义不同。

`==` 在无法确定相等时可能给出 X；testbench 用 `got !== expected` 可将未知结果也判为失败。不要用 `casex` 隐藏未知态：它把 X/Z 当作通配符，容易掩盖漏复位和连接错误。

运算符优先级不必靠记忆赌正确性：移位、比较、逻辑混用时加括号，例如 `(a == b) && en`、`(a & mask) != '0`。赋值中的 `<=` 是非阻塞赋值，表达式中的 `a <= b` 是比较，语境不同。

## 位选、切片、拼接与复制

```systemverilog
// 片段：假定 x、byte_offset、byte_data、result64 已声明。
assign bit0 = x[0];                   // bit-select
assign low_byte = x[7:0];             // 固定 part-select
assign selected = x[byte_offset*8 +: 8]; // 从起点向上取 8 位
assign selected_down = x[31 -: 8];    // 等价 x[31:24]
assign combined = {high_byte, low_byte}; // concatenation
assign sign_extended = {{56{byte_data[7]}}, byte_data};
assign {upper32, lower32} = result64; // 拆分同一向量
```

- 普通 `x[msb:lsb]` 的范围需为常量；indexed part-select 的起点可变，但宽度必须固定。
- `{a,b}` 将 a 放在高位、b 放在低位；`{N{a}}` 重复 a 共 N 次。
- 拼接和普通位选/部分选择结果按无符号处理；即使原向量是 signed，也应重新审视运算符号。
- 所有拼接宽度之和必须与目标一致。超宽赋值截去高位，窄值赋到宽目标时会按表达式类型扩展。

CPU 中 `{addr[2:0], 3'b000}` 等价于将字节偏移乘以 8，得到位偏移；立即数生成器用拼接重排指令位，再显式复制最高符号位。

## 数组：packed 与 unpacked

```systemverilog
logic [31:0] word;             // packed：一个 32 位向量
logic [31:0] bank [0:3];       // unpacked：4 个 32 位元素
logic [3:0][7:0] packed_bytes; // packed：共 32 位，分成四组
assign word = bank[index];    // 动态数组索引，对应读取/选择逻辑
```

类型名前后的位置决定组织方式：变量名左侧的维度是打包维度（packed dimensions），右侧是非打包维度（unpacked dimensions）。`bank[2][7:0]` 先取元素 2，再取其低 8 位；`[3:0]` 与 `[0:3]` 的遍历方向不同，声明与循环索引要一致。

SystemVerilog 支持数组端口以及兼容类型的整个非打包数组赋值，旧 Verilog 的支持受限。课程 `Mux4T1_32.v` 用 `I[0]...I[3]` 保存四路输入，再 `I[S]` 选择；寄存器组、移位窗口、FIFO 都使用非打包数组。

## 有符号运算必须同时检查宽度

`logic signed [31:0] s` 表示二进制补码（two's complement）。无 signed 的 `logic [31:0]` 默认 unsigned。混用 signed 和 unsigned 往往使表达式按 unsigned 处理，应在运算边界明确统一类型。

```systemverilog
// 片段：a、b 为 64 位无符号总线，shamt 为 6 位。
assign lt_signed = ($signed(a) < $signed(b));
assign right_arith = $signed(a) >>> shamt;
assign right_logic = a >> shamt;
```

`$signed(x)` / `$unsigned(x)` **改变解释方式，不改变位宽**。64 位变量的 `$signed(a[7:0])` 仍然只是 8 位；需要扩展时要用明确目标类型或拼接。

### 加法进位与乘法位宽

```systemverilog
// 片段：a、b 为 32 位。
logic [32:0] sum33;
logic [63:0] product64;
assign sum33 = {1'b0, a} + {1'b0, b};
assign product64 = {32'b0, a} * {32'b0, b};
```

N 位无符号相加要 N+1 位才能保存进位；两个 N 位数的完整乘积要 2N 位。表达式有上下文决定宽度（context-determined）和自身决定宽度（self-determined）的差别，不能仅凭“左边更宽”判断复杂子表达式不会溢出。显式扩展操作数或设置中间信号，最容易检查。

### RV64 的 32 位运算

`ADDW/SUBW/SLLW/SRLW/SRAW` 都先产生 **32 位结果，再符号扩展到 64 位**：

```systemverilog
// 片段：a、b 为 64 位，addw 为 64 位。
logic [31:0] word_sum;
assign word_sum = a[31:0] + b[31:0];
assign addw = {{32{word_sum[31]}}, word_sum};
```

这样即使低 32 位加法发生溢出，扩展也以截断后的 bit 31 为准。不要仅依靠 `$signed(a[31:0] + b[31:0])` 猜测外层赋值对表达式宽度的影响。64 位移位量用低 6 位，32 位运算用低 5 位。

### 三种容易混淆的“溢出”

| 情形 | 判断方法 |
| --- | --- |
| unsigned 加法 carry | 扩展为 N+1 位，读最高位 |
| unsigned 减法 borrow | `a < b`；补码加法器的 carry-out 通常是 **no borrow** |
| signed 加法 overflow | 输入符号相同且结果符号不同 |

signed overflow 与 carry-out 不是同一个信号。N 位结果始终按模 $2^N$ 截断；是否允许截断取决于模块规格。

## 常见源码用法

- `SegDecoder.v`：`{D,C,B,A} = data`、逐位布尔式、低有效段信号。
- `DataTrunc.sv`：先移位选择字节，再分别符号扩展或零扩展。
- `MaskGen.sv`：`8'b00000001 << addr[2:0]` 选择字节写使能。
- `ImmGen.sv`：立即数并不是一个连续指令切片，B/J 型需重排位并在最低位补 0。
- `$random` 返回有符号值；给随机总线赋值会截断/扩展，参考模型必须按同样的位宽和符号规则计算。
