---
title: "参数化与数据组织（Parameterization and Data Organization）"
status: draft
tags: [cs, verilog, systemverilog, lab]
created: 2026-10-08
updated: 2026-10-08
sources:
  - "~/sys1/sys1-sp26/docs/lab2-1-appendix.md"
  - "~/sys1/sys1-sp26/docs/lab4-1-appendix.md"
  - "~/sys1/sys1-sp26/src/lab2-1/submit/adders.v"
  - "~/sys1/sys1-sp26/repo/sys-project/include/"
  - "~/sys1/sys1-sp26/repo/sys-project/general/async.v"
---

# 参数化与数据组织（Parameterization and Data Organization）

## parameter、localparam 与常量计算

`parameter` 可以在实例化时覆盖；`localparam` 是模块/包内部派生常量，不能由实例覆盖。两者在 elaboration 时确定，不是寄存器。

```systemverilog
module Counter #(
    parameter int unsigned LIMIT = 10
) (
    input  logic clk, rst_n, en,
    output logic [((LIMIT <= 1) ? 1 : $clog2(LIMIT))-1:0] count
);
    localparam int unsigned CW = (LIMIT <= 1) ? 1 : $clog2(LIMIT);
    localparam logic [CW-1:0] LAST = CW'(LIMIT-1);
    always_ff @(posedge clk) begin
        if (!rst_n) count <= '0;
        else if (en) begin
            if (count == LAST) count <= '0;
            else count <= count + 1'b1;
        end
    end
endmodule
```

此例要求 `LIMIT >= 1`。`$clog2(N)` 返回 $\lceil\log_2N\rceil$，为 0…N−1 编码时常用；若要表示 N 本身，要按 N+1 个值计算。例如数到 LEN 的乘法器要比数到 LEN−1 的版本多考虑一个值。`$clog2(1)=0`，应把位宽至少限制为 1，不能直接生成 `logic [-1:0]`。

`CW'(expr)` 是 SV 的尺寸转换（sized cast），明确保留 CW 位。常量 `INITIAL/10`、`INITIAL%10` 会在 elaboration 求值；它们不会自动形成运行时除法器。

参数也有合法范围：数组长度、计数终值、字节数、FIFO 深度等都应在模块规格中说明。课程 `ConvOperator` 的树形索引要求 LEN 是不小于 2 的二次幂，`AsyncFifo` 的现有切片要求深度至少 4 且为二次幂。

## generate：展开硬件

```systemverilog
module RippleAdder #(
    parameter int unsigned W = 32
) (
    input  logic [W-1:0] a, b,
    input  logic cin,
    output logic [W-1:0] sum,
    output logic cout
);
    wire [W:0] carry /* verilator split_var */;
    assign carry[0] = cin;
    for (genvar i = 0; i < W; i++) begin : g_bit
        wire p = a[i] ^ b[i];
        wire g = a[i] & b[i];
        assign sum[i] = p ^ carry[i];
        assign carry[i+1] = g | (p & carry[i]);
    end
    assign cout = carry[W];
endmodule
```

`genvar` 是展开用索引，不是运行时计数器；这里生成 W 份组合逻辑。命名块 `g_bit` 提供稳定层级名，如 `u_adder.g_bit[3].p`。可使用显式 `generate/endgenerate`，SV 也允许省略这层包装。

此处 `split_var` 提示 Verilator 按 carry 的独立位分析依赖，避免旧版本将整个向量误判为自依赖；从 carry[0] 到 carry[W] 是单向链，并没有反馈。其他工具将该注释忽略。

模块层级的 `if/case` generate 依据常量选择硬件版本；过程内部的 `if/case` 根据当前信号选择运行时行为：

```systemverilog
// 片段：FIFO_KIND 是参数；接口和信号已声明。
generate
    if (FIFO_KIND == "async") begin : g_async
        // AsyncFifo ...;
    end else begin : g_sync
        // SyncFifo ...;
    end
endgenerate
```

这里不会综合出一个运行时选择两种 FIFO 的 mux，而是只保留被选中的结构。字符串参数适合这类配置，需明确非法配置如何处理。

## 过程循环与函数

`for` 在可综合 RTL 中通常被静态展开，不意味着每次迭代占一个周期。例如在一次时钟事件内用 `for` 清零整个寄存器数组，硬件是同时更新多个寄存器；要用一个加法器逐周期执行 N 次，必须设计计数器和 FSM。

```systemverilog
// 片段：W、N 为常量，data 是 N 个 W 位元素。
logic [W+$clog2(N)-1:0] total;
always_comb begin
    total = '0;
    for (int i = 0; i < N; i++) begin
        total = total + {{($clog2(N)){1'b0}}, data[i]};
    end
end
```

这描述组合累加链，可能有较长关键路径。循环边界必须可综合、可确定；testbench 中的 `while/wait` 可以等待运行时事件，但不能用这种等待来描述普通同步硬件。

函数（function）将无时间消耗的计算封装，可在表达式中调用。它不是共享硬件实例，综合器可能复制或优化调用逻辑。

```systemverilog
function automatic logic [7:0] select_byte(
    input logic [63:0] word,
    input logic [2:0] index
);
    return word[index*8 +: 8];
endfunction
```

`automatic` 让每次调用有独立局部变量，适合可重入的辅助函数。旧 Verilog 函数通过给函数名赋值返回，如 `add_judge = condition;`；函数不能用 `#delay`、事件等待等消耗仿真时间。需要带时间动作的仿真封装使用 task，见[仿真章](08-simulation-and-debugging.md)。

框架 BaudTickGen 的自定义 `log2` 使用 `while` 计算参数常量；其返回值是正整数的二进制位数，未必等于 `$clog2`，例如 8 的位数是 4，而 `$clog2(8)=3`。移植时不能机械替换。

## typedef、enum 与 struct

```systemverilog
package DemoPack;
    parameter int unsigned W = 32;
    typedef logic [W-1:0] data_t;
    typedef enum logic [1:0] {
        IDLE, WORK, DONE
    } state_t;
    typedef struct packed {
        logic  valid;
        data_t data;
    } packet_t;
    typedef struct {
        data_t lane [0:3];
    } window_t;
endpackage
```

- `typedef` 为类型命名，`data_t` 可以直接用于端口、变量和数组声明。
- `enum` 为有限取值命名，自动编码从 0 递增，也可显式赋编码。位宽需足够，两个不同包的枚举类型不能当作随意互换的整数。
- `struct packed` 把字段拼成连续位向量，首字段在高位，适合总线载荷和序列化；访问用 `packet.data`。
- 普通 `struct` 为非打包聚合，能够容纳非打包数组，适合窗口、阶段信息；不能默认把它当作一个任意位向量切片。
- `struct` 只是数据布局，本身不产生存储；用 `always_ff` 写入才描述寄存器化数据。

赋值模式（assignment pattern）与拼接不同：

```systemverilog
// 片段：DemoPack 已编译。
DemoPack::packet_t packet;
assign packet = '{valid: 1'b1, data: 32'h1234};
// packed packet 也可以写成 {1'b1, 32'h1234}，
// 但字段命名的赋值模式更容易维护。
```

`'{...}` 的单引号不能漏；数组/结构体可以使用 `'{default:'0}` 等默认模式，但嵌套结构应按其元素类型设置，遇到工具兼容性问题就逐字段明确赋值。

## package、import 与 include

`package` 是共享类型/常量的命名空间，不是一份硬件，也没有每个实例独立的参数覆盖。课程 `CorePack` 定义数据宽度和 ALU 操作枚举，`PipelinePack` 定义流水寄存器束，`Conv` 定义窗口与结果类型。

```systemverilog
// 片段：包先编译，再使用。
import DemoPack::*;
state_t state;
DemoPack::data_t word;  // 用作用域解析符 :: 显式引用
```

`import` 让名字可见，不会读取文件；`` `include "file.vh" `` 是预处理时文本插入。两个操作经常一起用：include 提供包定义，import 提供短名称。避免重复定义同一个包，通常单独编译包文件或通过一致的头文件方案管理。

## 宏与条件编译

```systemverilog
`ifndef DEMO_DEFINES_VH
`define DEMO_DEFINES_VH
`define DATA_WIDTH 32
`define DECL_BUS(prefix, width) logic [width-1:0] prefix``_data;
`endif

// 调用时：
`DECL_BUS(tx, `DATA_WIDTH)
```

- 宏以反引号调用，是文本替换，不具备类型和命名空间。
- `` `ifndef / `define / `endif `` 构成 include guard；保护范围依赖工具编译单元，并非任意工程内的全局防重定义机制。
- `` `ifdef VERILATE `` 等条件编译选择不同仿真/综合内容，与运行时 `if` 无关。
- 函数式宏参数可替换文本；两个连续反引号用于 token concatenation，将 `prefix` 和 `_data` 拼成标识符。
- 多行宏用行末反斜杠延续；最后一行不续行。宏如果隐式依赖 `clk/rstn`，调用处必须提供同名信号。

框架 `mem_ift.vh` 用宏生成接口声明、连接和握手状态。阅读时先定位宏定义再看展开结果，复杂问题可用 `verilator -E` 查看预处理文本。优先用参数、类型和接口表达结构，减少依赖调用处局部名称的宏。

源码的 `initial_file.vh` / `initial_mem.vh` 用宏选择内存初始化文件路径。绝对路径只在原机器有效，移植时应修改路径配置，并核对仿真进程的工作目录。
