# gdb

## 一、 启动与环境控制 (Startup & Context)

在调试开始前，了解如何加载程序至关重要。

| **指令**                         | **简写** | **描述**             | **场景**                                                |
| ------------------------------ | ------ | ------------------ | ----------------------------------------------------- |
| `gdb ./program`                | -      | 加载可执行文件。           | 基础启动。                                                 |
| `gdb attach [PID]`             | -      | 调试正在运行的进程。         | 调试死循环服务或 Docker 中的进程。                                 |
| `gdb core core_dump`           | -      | 分析崩溃转储文件。          | **事后分析**（Post-mortem analysis），定位 Segmentation Fault。 |
| `set args [arg1] ...`          | -      | 设置程序启动参数。          | 在 `run` 之前设定。                                         |
| `path [dir]`                   | -      | 添加源码搜索路径。          | 当源码移动了位置，GDB 找不到时使用。                                  |
| `set disassembly-flavor intel` | -      | **设置汇编格式为 Intel**。 | 原生默认是 AT&T 格式（很难读），逆向必改此项。                            |

---

## 二、 断点与观察点 (Breakpoints & Watchpoints)

这是调试的核心，决定了程序在何时停下。

### 1. 断点 (Breakpoints)

- **函数断点：** `b main` (在 main 函数入口停下)

- **行号断点：** `b 10` (在源码第 10 行停下)

- **地址断点：** `b *0x400500` (在特定内存地址停下，**逆向常用**)

- **条件断点：** `b 10 if i == 5` (仅当变量 i 等于 5 时停下，**调试循环常用**)

- **临时断点：** `tbreak main` (触发一次后自动删除)

- `brva *0x???` 可以再开启 PIE 的程序中根据基址通过相对偏移下断点

### 2. 观察点 (Watchpoints) —— **内存监控神器**

当不知道哪个指令修改了某个变量时使用。

- `watch var`：当 `var` 的值**发生变化**时暂停。

- `rwatch var`：当 `var` 被**读取**时暂停 (Read)。

- `awatch var`：当 `var` 被**读或写**时暂停 (Access)。

- _注意：硬件观察点依赖 CPU 调试寄存器，数量有限（通常 4 个）。_

### 3. 捕捉点 (Catchpoints)

- `catch syscall [name]`：在系统调用时暂停（如 `catch syscall open`）。

- `catch throw`：在 C++ 抛出异常时暂停。

### 4. 管理指令

- `info b`：列出所有断点。

- `delete [id]` / `d`：删除断点。

- `disable/enable [id]`：临时禁用/启用断点。

---

## 三、 执行控制 (Execution Control)

控制程序一步步运行，区分**源码级**和**指令级**非常重要。

| **指令**     | **简写** | **描述**                          | **区别**                 |
| ---------- | ------ | ------------------------------- | ---------------------- |
| `run`      | `r`    | 开始运行程序。                         | 遇到断点前不会停。              |
| `start`    | -      | 运行并在 main 入口自动暂停。（源码级）          | 比 `r` 更安全，适合初始化。       |
| `starti`   | -      | 运行并在绝对入口点（`_start`）暂停。（第一条汇编指令） | -                      |
| `continue` | `c`    | 继续执行，直到下一个断点。                   | -                      |
| `next`     | `n`    | **源码级**单步步过 (Step Over)。        | **不进入**函数调用。           |
| `step`     | `s`    | **源码级**单步步入 (Step Into)。        | **进入**函数调用。            |
| `nexti`    | `ni`   | **汇编级**单步步过。                    | 执行一条机器指令，遇到 `call` 不进。 |
| `stepi`    | `si`   | **汇编级**单步步入。                    | 执行一条机器指令，遇到 `call` 跟进。 |
| `finish`   | -      | 执行直到当前函数返回。                     | 快速跳出当前函数。              |
| `until`    | `u`    | 执行直到跳出循环体。                      | 避免在 `for` 循环中一直按 `n`。  |

---

## 四、 信息检视 (Inspection)

GDB 最强大的功能：查看内存、寄存器和变量。

### 1. 查看内存 (`x` 命令) —— **最核心指令**

格式：`x /<n><f><u> <addr>`

- **n (Number):** 显示的数量。

- **f (Format):** 显示格式 (`x`=hex, `d`=decimal, `s`=string, `i`=instruction)。

- **u (Unit):** 单位 (`b`=byte, `h`=halfword/2bytes, `w`=word/4bytes, `g`=giant/8bytes)。

**常用组合：**

- `x/10gx $rsp`：查看栈顶的 10 个 8 字节数据（64位调试最常用）。

- `x/s 0x400500`：查看该地址处的字符串。

- `x/5i $rip`：查看当前指令后的 5 条汇编指令（反汇编）。

- `x/wx &var`：以十六进制查看变量 `var` 的 4 字节原始值。

### 2. 查看变量与寄存器

- `print var` / `p var`：打印变量值。

- `p/x var`：以十六进制打印。

- `info registers` / `i r`：查看所有通用寄存器。

- `p $rax`：查看特定寄存器的值。

- `display var`：**自动显示**。每次程序暂停时，自动打印 `var` 的值（`undisplay` 取消）。

### 3. 查看堆栈与代码

- `bt` (backtrace)：查看函数调用栈（崩溃时第一件事就是输这个）。

- `bt full`：显示局部变量的调用栈。

- `frame [n]` / `f [n]`：切换到第 n 层栈帧（用于查看上层函数的局部变量）。

- `list` / `l`：查看源码（需要编译时带 `-g`）。

- `disassemble` / `disas`：查看当前函数的汇编代码。

---

## 五、 修改程序状态 (Modifying State)

GDB 允许你在运行时篡改程序，这在漏洞利用测试和逻辑绕过中非常有用。

1. **修改变量/内存：**

    - `set var x = 10`：将代码中的变量 `x` 改为 10。

    - `set {int}0x400500 = 0xdeadbeef`：强制修改内存地址的值。

2. **修改寄存器：**

    - `set $rip = 0x400600`：**强制跳转**。改变程序执行流（极其危险且强大）。

    - `set $rax = 0`：修改函数返回值（通常 rax 存返回值）。

3. **函数调用：**

    - `call function_name(args)`：在调试时强制调用程序内的某个函数。

---

## 六、 高级技巧与 TUI 模式

### 1. TUI 模式 (Text User Interface)

原生 GDB 自带一个简单的图形界面，显示源码和汇编。

- **启动：** `gdb -tui ./program` 或在 GDB 中按 `Ctrl + X` 然后按 `A`。

- **布局切换：**

    - `layout src`：显示源码。

    - `layout asm`：显示汇编（逆向常用）。

    - `layout regs`：显示寄存器。

    - `layout split`：同时显示源码和汇编。

- **焦点问题：** 如果按上下箭头变成了翻历史命令而不是滚屏，输入 `focus src` 或 `focus asm`。

### 2. 多进程/多线程调试

- `info threads`：查看线程。

- `thread [id]`：切换调试线程。

- `set follow-fork-mode [parent|child]`：`fork` 后调试父进程还是子进程。

### 3. 内存 Dump

- `dump memory output.bin 0xStart 0xEnd`：将内存段保存到文件（用于提取解密后的数据）。

### 4. 自动化脚本

你可以把 GDB 命令写在文件中，批量执行。

- `gdb -x script.gdb ./program`

- 或者在 GDB 内 `source script.gdb`。
