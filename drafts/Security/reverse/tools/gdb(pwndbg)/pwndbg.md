# pwndbg

`pwndbg` 是基于 GDB 的一个插件，专为 **CTF Pwn 选手**、**漏洞利用开发者**和**逆向工程师**设计。它极大地增强了 GDB 的原生功能，提供了强大的上下文显示、堆分析工具和漏洞利用辅助功能。

以下是 `pwndbg` 的详细使用指南，按功能模块分类，涵盖常用指令、核心功能及高阶技巧。

---

## 一、 核心界面：Context（上下文）

这是 `pwndbg` 最显著的特征。每当程序暂停（断点或单步），它会自动显示四个面板：

1. **REGISTERS（寄存器）：** 显示当前寄存器的值。

    - **高亮逻辑：** 发生变化的寄存器会高亮显示。

    - **指针解引用：** 如果寄存器指向内存地址，pwndbg 会尝试解析该地址并显示其指向的数据（字符串、代码、堆栈值等）。

2. **DISASM（反汇编）：** 显示当前 RIP/EIP 指向的汇编指令及后续指令。

    - **流控制预测：** 会标注 `JUMP` 指令将跳转到哪里。

3. **STACK（堆栈）：** 显示 RSP/ESP 指向的栈内存。

4. **BACKTRACE（回溯）：** 显示函数调用链。

- **常用指令：**

    - `context`：如果你不仅想看自动弹出的，想手动刷新查看上下文，输入此命令。

    - `context regs` / `context disasm`：只查看特定部分的上下文。

---

## 二、 程序执行与控制 (Execution Control)

这部分大多继承自 GDB，但结合 pwndbg 的上下文显示会更直观。

---

## 三、 内存透视神器 (Memory Inspection)

### 1. Telescope (望远镜) —— **核心指令**

这是 pwndbg 的灵魂。它不仅打印内存值，还会**递归解引用**指针，告诉你这个地址到底是什么（字符串、代码段、堆块、栈变量）。

- `telescope [addr] [lines]` (简写 `tele`)

    - `tele`：默认显示 RSP 附近的栈数据。

    - `tele $rbp 20`：查看栈底附近的 20 行数据。

    - `tele 0xheap_addr`：查看堆上的数据结构。

### 2. Vmmap (内存映射)

- `vmmap`：显示进程的内存布局、权限（rwx）和映射文件。

    - **技巧：** 用来找 **Base Address**（基址），判断 **ASLR** 是否开启，以及寻找 **RWX**（可读可写可执行）段来放置 Shellcode。

### 3. Search (搜索)

- `search [pattern]`：在内存中搜索特定的字符串、数值或字节序列。

    - `search "/bin/sh"`：查找 libc 中的 shell 字符串。

    - `search -t dword 0xdeadbeef`：查找特定的整数值。

### 4. Hexdump

- `hexdump [addr]`：标准的十六进制打印，但格式比 GDB 原生的 `x/` 更友好。

---

## 四、 Pwn 漏洞利用辅助 (Exploit Development)

专门为缓冲区溢出、ROP 等攻击设计的工具。

### 1. Checksec (安全检查)

- `checksec`：显示二进制文件的保护机制。

    - **RELRO:** Partial/Full (GOT 表是否只读)

    - **Stack:** Canary (栈溢出保护)

    - **NX:** 堆栈不可执行

    - **PIE:** 地址随机化

### 2. Cyclic (计算溢出偏移)

缓冲区溢出的神器。

1. `cyclic [number]`：生成一个不重复的有序字符串（De Bruijn 序列）。

    - _操作：_ 复制生成的字符串输入程序，让程序崩溃。

2. `cyclic -l [crash_addr]`：根据崩溃时的地址（EIP/RIP 的值），自动计算出**偏移量 (Offset)**。

### 3. ROP (返回导向编程)

- `rop`：自动列出二进制文件中的 ROP gadgets。

- `rop --grep "pop rdi"`：搜索特定的 gadget。

- **注意：** 对于复杂的 ROP，建议使用外部工具 `ROpper` 或 `ROPgadget`，但简单的查找 pwndbg 足够。

### 4. Shellcode

- `shellcode`：列出或生成常见架构的 shellcode。

### 5. GOT/PLT 追踪

- `got`：查看 Global Offset Table 的状态，检查函数真实地址（用于 Ret2Libc）。

- `plt`：查看 Procedure Linkage Table。

---

## 五、 高阶技巧与常用 GDB 混搭

1. **动态修改内存/寄存器：**

    - `set $rax = 0`：修改寄存器。

    - `set *0x555555554000 = 0xdeadbeef`：修改内存值。

    - **场景：** 绕过某些 `if` 检查，或者强制程序跳转到后门函数。

2. **查看结构体 (Struct)：**

    - 如果你有源码或符号文件，pwndbg 可以漂亮地打印结构体。

    - `dt "struct name" [addr]` (Display Type)。

3. **Piebase (基址计算)：**

    - 在开启 PIE 的程序中，断点需要计算偏移。

    - `break *($base + 0x1234)`：直接基于程序基址下断点。

    - `piebase`：查看当前 PIE 基址。

4. **Dump 内存到文件：**

    - `dump memory output.bin 0xStart 0xEnd`：将一段内存保存出来，用于放入 IDA 静态分析（例如解密后的 Shellcode）。

5. **Python API 交互：**

    - 在 GDB 内部可以直接写 Python 脚本来控制调试流程。

    - `pi` (Python Interactive)：进入 Python 交互模式。

    - 例如：`pi print(hex(u64(gdb.selected_inferior().read_memory(0x400000, 8))))`
