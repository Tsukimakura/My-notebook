---
title: "仿真与调试（Simulation and Debugging）"
status: draft
tags: [cs, verilog, systemverilog, lab]
created: 2026-10-08
updated: 2026-10-08
sources:
  - "~/sys1/sys1-sp26/src/lab0-3/sim/testbench.v"
  - "~/sys1/sys1-sp26/src/lab2-1/sim/"
  - "~/sys1/sys1-sp26/src/lab3-3/sim/"
  - "~/sys1/sys1-sp26/src/lab4-1/sim/"
  - "~/sys1/sys1-sp26/src/project/Makefile"
  - "~/sys1/sys1-sp26/repo/sys-project/sim/"
  - "https://verilator.org/guide/latest/exe_verilator.html"
  - "https://verilator.org/guide/latest/languages.html"
  - "https://verilator.org/guide/latest/warnings.html"
---

# 仿真与调试（Simulation and Debugging）

## testbench 与 RTL 的边界

测试平台（testbench, TB）实例化被测设计（Design Under Test, DUT），提供时钟、复位与输入，并比较结果。TB 中的 `#delay`、`wait`、动态队列、文件输出等为仿真服务，不能照搬成可综合电路。

| 写法 | 仿真含义 |
| --- | --- |
| `initial begin ... end` | 仿真开始时执行一次 |
| `always #5 clk = ~clk;` | 每 5 个时间单位翻转，完整周期为 10 |
| `@(posedge clk)` | 等待下一次上升沿 |
| `repeat (N) @(posedge clk);` | 等待 N 个边沿 |
| `wait (finish);` | 条件为真时继续，没有自动超时 |
| `$display(...)` | 输出一行，格式符如 %h / %d / %0t |
| `$fatal(1, ...)` | 失败并停止仿真 |
| `$finish` | 正常结束仿真 |

``timescale 1ns/1ps` 声明时间单位/精度，SV 可在模块中写 `timeunit 1ns; timeprecision 1ps;`。`#5` 在此为 5 ns，`#1ps` 是 1 ps。它们改变仿真时间，不是综合后的真实延迟。

## 一个可以运行的自检示例

保存[接口章的 StreamBuffer](06-interfaces-and-handshakes.md)为 `stream-buffer.sv`，以下保存为 `testbench.sv`。它检查复位、背压保持、同时消费和替换、清空：

```systemverilog
module Testbench;
    timeunit 1ns;
    timeprecision 1ps;
    logic clk = 0;
    logic rst_n = 0;
    logic [7:0] in_data = 0;
    logic in_valid = 0, in_ready;
    logic [7:0] out_data;
    logic out_valid, out_ready = 0;

    always #5 clk = ~clk;
    StreamBuffer #(.W(8)) dut (
        .clk(clk), .rst_n(rst_n),
        .in_data(in_data), .in_valid(in_valid), .in_ready(in_ready),
        .out_data(out_data), .out_valid(out_valid), .out_ready(out_ready)
    );

    task automatic expect_output(input logic valid, input logic [7:0] data);
        if (out_valid !== valid || (valid && out_data !== data))
            $fatal(1, "output mismatch: valid=%b data=%h", out_valid, out_data);
    endtask

    initial begin
        $dumpfile("wave.vcd");
        $dumpvars(0, dut);
        repeat (2) @(posedge clk);
        #1ps;
        expect_output(0, 0);

        @(negedge clk);
        rst_n = 1;
        in_valid = 1;
        in_data = 8'hA5;
        @(posedge clk);
        #1ps;
        expect_output(1, 8'hA5);

        // 输出不 ready 时，输入的新值不能覆盖 A5。
        @(negedge clk);
        in_data = 8'h3C;
        repeat (2) begin
            @(posedge clk);
            #1ps;
            if (in_ready !== 1'b0) $fatal(1, "backpressure broken");
            expect_output(1, 8'hA5);
        end

        // 取走 A5 的同一边沿，接收 3C。
        @(negedge clk);
        out_ready = 1;
        @(posedge clk);
        #1ps;
        expect_output(1, 8'h3C);

        @(negedge clk);
        in_valid = 0;
        @(posedge clk);
        #1ps;
        expect_output(0, 0);
        $display("PASS");
        $finish;
    end

    initial begin
        #1000;
        $fatal(1, "timeout");
    end
endmodule
```

task 可以包含多条语句和时间动作，适合封装驱动/检查；function 不能消耗时间。上例在下降沿改变输入，在上升沿后的短延时检查 NBA 更新结果，避免与 DUT 的上升沿过程竞争。复杂 TB 可用 clocking block 管理采样/驱动时区；课程主要使用直接事件控制。

不要在 `@(posedge clk)` 后用阻塞赋值立即改 DUT 输入，又假定 DUT 一定看到旧值或新值。课程部分乘法 TB 有这种写法，移植时应消除竞态。

## 编译、运行和波形

在放置上述两个文件的目录运行：

```bash
verilator --lint-only --timing --timescale 1ns/1ps -sv --top-module Testbench \
  stream-buffer.sv testbench.sv
verilator --binary --timing --timescale 1ns/1ps --trace -sv --top-module Testbench \
  --Mdir obj_dir stream-buffer.sv testbench.sv
./obj_dir/VTestbench
gtkwave wave.vcd
```

这些是支持 `--binary` 的 Verilator 版本的独立示例命令。原工程使用 `--cc --exe --main --timing` 并自行构建/链接 C++，其 DPI 差分模型还需附加库。参数含义以[安装版本的帮助和官方参数文档](https://verilator.org/guide/latest/exe_verilator.html)为准；`--timing` 处理 TB 时间控制，`--timescale` 为未声明时间单位的 RTL 提供默认值，`--trace` 启用波形，`-I` 指定 include 目录。

波形任务：

```systemverilog
// 片段：dut 必须是实际存在的实例名。
$dumpfile("wave.vcd");
$dumpvars(0, dut); // 深度 0：向下记录全部层级
$dumpon;
```

`$dumpoff` 暂停记录，`$dumpon` 恢复记录；它们只控制波形输出，不暂停 DUT 或仿真时间。

如果 DUT 实例叫 `mul` 或 `conv_unit`，`$dumpvars(0,dut)` 就不是正确目标。课程几个局部 testbench 存在这一名称不一致，不能直接沿用。路径宏 `` `TOP_DIR `` 展开为字符串后可通过 `` {`TOP_DIR,"/Testbench.vcd"} `` 拼接字符串；shell 传入宏时还要正确保留引号。

波形优先看 clk/reset、请求 fire、状态、关键寄存器、响应 fire，再追踪组合中间信号。确定“第一个错误边沿”，比只看最后一个错误结果有效。

## 穷举、随机与自检

- 小输入空间使用穷举：四位输入可循环 0…15，赋 `{i3,i2,i1,i0}=i[3:0]`，等待组合结果稳定后比较。
- 宽输入使用边界与随机组合：0、全 1、最高位、符号边界、进位/借位、最大移位、最大乘积。
- `$random` 为有符号 32 位，`$urandom` 为无符号 32 位；更宽数据需拼接多个随机值。为了重现失败，应记录随机种子和失败输入。
- 随机数据之外，还要随机 ready、插入 valid 空隙和中途复位，检查等待和恢复路径。
- 每个等待都设置 watchdog/最大周期数；`wait(finish)` 若永不完成，会让仿真永久挂起。

自检参考模型（reference model）应独立表达预期语义，而不是复刻 DUT 错误。比较 N 位加法时显式扩展为 N+1；C++ 计算 32×32 乘积时先转换为 64 位再相乘。

## 队列与 scoreboard

SV 动态队列（queue）`type q[$]` 可用于保存待比较结果。它与硬件 FIFO 不同，通常只用于 TB：

```systemverilog
logic [31:0] expected[$];
logic [31:0] want;
// 片段：在双方共同的采样事件执行，golden 为参考结果。
if (in_valid && in_ready)
    expected.push_back(golden);
if (out_valid && out_ready) begin
    if (expected.size() == 0) $fatal(1, "unexpected output");
    want = expected.pop_front();
    if (out_data !== want) $fatal(1, "result mismatch");
end
```

`push_back/pop_front/size` 管理动态容器。两条独立 if 允许同周期输入输出；写成 `if ... else if ...` 会漏掉一侧事件。对于零延迟通路，同周期先入队再出队；不同延迟协议应按明确采样规则维护 scoreboard，且在结束时确认没有未返回项。

卷积参考模型还需要保持自己的窗口，按输入 fire 更新；输出比较按输出 fire 执行，不能只比较 `out_valid` 为 1 的每个周期。背压期间要单独检查载荷稳定，不能因为没有 fire 就完全跳过。

课程 `lab4-1/sim/judge.sv` 用队列保存窗口和期望结果，是该模式的例子；其条件优先级与固定 out_ready 激励不能代替对所有握手组合的测试。

## DPI-C 与提交级差分测试

直接编程接口（Direct Programming Interface, DPI-C）允许 SV 调用 C/C++ 参考函数：

```systemverilog
import "DPI-C" function int mul_judge(
    input int unsigned a,
    input int unsigned b,
    input longint unsigned product
);
```

```cpp
#include <svdpi.h>
extern "C" int mul_judge(unsigned int a, unsigned int b,
                         unsigned long long product) {
    const auto expected = static_cast<unsigned long long>(a) * b;
    return product == expected;
}
```

- `extern "C"` 保持可链接的 C 符号名，避免 C++ 名字修饰。
- SV 的 `int unsigned / longint unsigned` 分别是 32/64 位；函数签名以工具生成的 DPI 头文件为准，复杂类型不能凭 C++ 类型名猜布局。
- 原输入在 start/请求 fire 时保存，finish/结果 fire 时调用判定，避免外部输入早已变化。
- DPI 调用是仿真辅助，不会成为 FPGA 上的 C++ 运算单元。

框架 `cosim.v` / `dpi.cpp` 在 CPU 指令提交（commit）时推进软件 RISC-V 模型，并比较 PC、寄存器等架构状态。这是差分测试（differential testing / difftest），不要求逐时钟与软件同步；等待内存的周期没有新指令提交。错误时应打印本次 PC、instruction、写回寄存器和结果，定位首次分歧。

## lint：先修宽度和驱动，再看功能

| 诊断类型 | 优先检查 |
| --- | --- |
| WIDTH / WIDTHTRUNC / WIDTHEXPAND | 参数常量、符号扩展、切片、目标与表达式位宽 |
| LATCH | 组合块是否对所有目标覆盖所有路径 |
| MULTIDRIVEN | 是否两个过程/实例驱动同一变量 |
| UNDRIVEN / 隐式线网 | 漏接端口、拼写、条件编译遗漏 |
| UNOPTFLAT / 组合依赖 | 是否真有环路，或数组粒度分析产生误判 |

具体诊断按[官方 warnings 文档](https://verilator.org/guide/latest/warnings.html)和本机版本处理。不要用关闭宽度告警代替明确宽度；`/* verilator lint_off ... */` 是工具注释，对其他工具不一定有效。Verilator 常见配置采用二态/对 X 的简化，四态与时序支持随版本/选项变化，见[语言支持说明](https://verilator.org/guide/latest/languages.html)；一次通过不能证明未知态传播和物理时序正确。

## 从仿真到 FPGA

XDC 通常至少定义引脚（PACKAGE_PIN）、电平（IOSTANDARD）和时钟：

```tcl
# 示例：周期 10 ns，即 100 MHz；端口名需匹配顶层。
create_clock -period 10.000 [get_ports clk]
```

派生时钟需要与实际结构相符的约束；`set_false_path` 只是排除指定 STA 路径，不会添加同步器。不要机械复制框架的调试时钟约束到修改后的时钟结构。

综合后检查锁存器、RAM/寄存器资源与意外组合反馈，实现后检查时序和 CDC。仿真 PASS 表示已运行的激励通过；它不能替代 reset 覆盖、协议检查、STA 与板级电气配置。

## 移植课程代码时的具体检查点

| 现象 | 应检查的来源 |
| --- | --- |
| package Conv / conv_struct.vh 找不到 | 当前扫描目录中缺少该头文件；lab4-1-appendix 有类型教学定义，补齐并先编译包 |
| Core / MultiFSM 重复定义 | Core2.sv 与 submit/Core.sv 同时加入编译 |
| 波形任务找不到 dut | 真实实例名为 add_sub、mul、conv_unit 等 |
| 程序存储全零/加载失败 | FILE_PATH 宏、hex 文件位置、运行工作目录 |
| 乘法最后一步错一位或晚一周期 | 旧 count 判断、计数范围、加法临时进位、不同版本延迟 |
| 串口 debug 数据偶发丢失 | debug_send 脉冲遇到 ready=0，未保存 pending |
| 仿真偶发不同结果 | TB 在采样边沿阻塞更新输入，或参考模型宽度/符号不一致 |

这些是阅读当前源码时需要处理的边界，不代表框架中所有实现都已通过完整功能验证。
