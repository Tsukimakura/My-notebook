# 22.  emoclew -- Hidden Executable（reverse）

1. 根据题目提示（文件名为 stub）以及 DIE 检测结果 （`(Heur)保护: Generic[Custom DOS]` 意味着 DOS stub 被修改过了，里面包含了非标准的 16 位 DOS 代码）。尝试直接在 Windows 运行也确实没有结果。
2. 使用 **DOSBox** (一个 MS-DOS 模拟器)

```bash
# 挂载目录
mount c C:\Users\HP\Desktop\personal\CTF\reverse
# 切换目录
c:
# 运行程序
stub.exe
```

成功运行要求输入 flag，输入错误返回 wrong。得到程序基本逻辑并确定是隐藏在 DOS stub 中的 MS-DOS 程序。

3. 使用 IDA 进行静态分析。由于文件包含完整 PE 结构，会被自动识别为 PE 文件，在打开 IDA 时手动把 `Portable executable (PE)` 更改为 `MS-DOS executable (exe)`。然后分析 16 位汇编代码。
    	![[Pasted image 20260219153519.png]]

4. 在 Hex dump 视图下找到密文并编写脚本

```python
def solve():
    # 从 Hex Dump 中精确提取的 32 字节机器码及数据密文
    cipher = [
        0x07, 0xA1, 0xCF, 0x9C, 0x02, 0xED, 0x6A, 0x78,
        0x27, 0x61, 0x28, 0x86, 0x76, 0xFF, 0x29, 0xEF,
        0x50, 0x4B, 0xE5, 0x0A, 0xC3, 0x08, 0xEE, 0x70,
        0x83, 0x23, 0x64, 0x32, 0x8C, 0x71, 0xF4, 0xFA
    ]

    n = len(cipher)
    P = [0] * n     # 用于存放阶段一的中间状态 (前缀和)
    flag = [0] * n  # 用于存放最终解密的明文字符

    # 1. 逆推阶段二：从密文 S 还原出中间前缀和数组 P
    # 使用公式: P[k] = S[k] - S[k+1]
    for i in range(n - 1):
        P[i] = (cipher[i] - cipher[i+1]) & 0xFF

    # 处理最后一个元素的特殊累加情况 (cipher[31] = P[31] * 2 % 256)
    P[n-1] = cipher[n-1] // 2

    # 2. 逆推阶段一：从中间前缀和数组 P 还原出原始输入 I
    # 使用公式: I[k] = P[k] - P[k-1]
    flag[0] = P[0]
    for i in range(1, n):
        flag[i] = (P[i] - P[i-1]) & 0xFF

    # 格式化并输出最终解析结果
    flag_string = "".join(chr(c) for c in flag)
    print("解密成功, Flag 为:")
    print(flag_string)

if __name__ == '__main__':
    solve()
```

## 23.  ACTF 2020 -- babysignal（reverse）

## 一、静态分析

### 1. 核心概念解析：Signal, Handler, Alarm

- **Signal（信号）：** 信号是 Linux 操作系统用来通知进程发生了某种事件的一种机制。

    - **`SIGALRM` (信号 14)：** 闹钟信号。

    - **`SIGSEGV` (信号 11)：** 段错误信号（Segmentation Fault）。通常这会导致程序直接崩溃并退出。

- **Handler（处理函数）：** 默认情况下，很多信号（比如 `SIGSEGV`）一旦发生，操作系统就会强行杀死程序。但是，程序可以自己定义一个函数来拦截并处理这个信号，这就是 Handler。

- **注册处理函数：** 这就是指程序告诉操作系统：“如果接下来发生了 X 信号，不要执行默认操作，而是暂停当前工作，去执行指定的 Y 函数。执行完 Y 函数后，再回来继续工作。” 这通常通过调用 `signal()` 或 `sigaction()` 函数来实现。

- **Alarm（闹钟）：** `alarm(seconds)` 是一个系统调用。它相当于给操作系统定了一个倒计时器。当 `seconds` 秒倒计时结束时，操作系统就会准时向调用它的进程发送一个 `SIGALRM` 信号。

### 2. 分析 main

1. **收集输入：** `main` 函数首先打印提示语，并通过 `scanf` 将输入的 flag 存入 `unk_40E0` 这个全局变量中。

2. 注册信号处理函数并设定信号

    - 代码执行了 `signal(14, handler);`。**注册**一个处理函数。告诉操作系统，以后一旦收到信号 14（`SIGALRM`），就去执行名为 `handler` 的函数。

    - 紧接着执行了 `alarm(1u);`。设定了一个 1 秒钟的闹钟。

3. **假死：** 随后程序执行 `return 0LL;`。对于正常的线性程序，到这里就彻底结束了。题目里，1 秒钟后，闹钟会响起，强行打断程序的退出或休眠过程。

### 3. 分析 Handler

当 1 秒钟过去，操作系统发出 `SIGALRM`，程序控制权立刻转移到 `handler` 函数：

1. **倒计时打印：** `handler` 函数内部检查了一个全局变量 `dword_40A0`。如果它大于 0，就将其减 1，并在屏幕上打印一个点 `.`。这就是运行程序时看到的 `Please wait.....` 效果。

2. **切换轨道：** 当 `dword_40A0` 减到 0 时，代码进入了 `else` 分支。

    - 它执行了 `signal(14, sub_1360);`。**重新注册**了 `SIGALRM` 的处理函数。这意味着，下一次闹钟响起时，执行的将不再是当前的 `handler`，而是变成了 `sub_1360`。

3. **循环触发：** 函数最后再次调用 `alarm(1u);`。这保证了闹钟信号会连绵不绝地产生，推动程序状态的流转。

### 4. 分析 `sub_1360`

到 `sub_1360` 时，程序准备给出最终结果：

- 读取了一个名为 `status` 的全局变量。如果 `status` 的值为 0，说明校验通过，打印 "Right! Good job!"。否则打印 "Wrong! Nice try!"。

- 最后调用 `exit(status)` 彻底结束程序。

### 5. 寻找隐藏的异常处理函数

已经梳理出了 `main -> handler -> sub_1360` 这样一条由时间驱动的执行流。但 **在这个流程中，没有任何地方对输入的 flag (`unk_40E0`) 进行处理，也没有任何地方去修改 `status` 变量的值**

1. **寻找变量的交叉引用 (XREF)：**

    - 对 `status` 变量和 `unk_40E0` 按 `X` 键查看交叉引用。

2. **寻找隐藏的信号注册：**

    - 除了在 `main` 函数里，程序是否还在别的地方注册了异常处理？

    - 在导入表搜索 `signal` 或 `sigaction`（另一种更高级的注册信号的系统调用）。

### 6. 分析隐藏的异常处理函数

#### 前置知识

**1. `mmap` (Memory Map) - 动态内存分配**

可以把它当成强化版的 `malloc`。在正常编程中，`malloc` 是在堆区分配内存；而 `mmap` 是一个底层系统调用，它可以直接向操作系统申请一大块任意地址、**具有特定读/写/执行权限**的内存页。

在涉及到“动态解密代码并运行”（SMC）的题目中，程序必须有一块既能写入解密数据，又能当成指令来执行的内存。普通的栈和堆通常是没有执行权限（NX保护）的。

- 在 `sub_1130` 中，它调用 `mmap` 在硬编码的基址 `0x1337000` 处分配了内存。

- 在处理段错误的引擎 `sub_12F0` 中，代码执行了 `v6 = mmap(0LL, 0x1000uLL, 7, 34, 0, 0LL)`。

    - 这里的第三个参数 `7` 代表权限：`PROT_READ (1) | PROT_WRITE (2) | PROT_EXEC (4) = 7`。

    - 这说明它向系统要了一块**可读、可写、可执行 (RWX)** 的内存。随后它把这块内存传给 `sub_1CD0` 进行代码解密，解密完就直接执行。

**2. `__readfsqword` - 栈溢出保护(Stack Canary)**

这不是一个标准的 C 语言函数，而是 GCC/Clang 编译器生成的一个**内置指令（Intrinsic）**。

作用是**读取 `FS` 段寄存器中的某个偏移值**。在 64 位 Linux 中，`FS:0x28` 这个位置存放着一个由操作系统生成的、每次运行都不一样的随机数。这个随机数被称为 **Canary** 或栈保护区（Stack Guard）。

**3. `sigaction` - 专业版信号注册**

`signal(14, handler)` 是一种比较老式的、简单的注册信号处理函数的方法。而 `sigaction` 功能更强大，控制更精细。

**核心结构体 `struct sigaction`：**

它不仅仅需要一个处理函数，还需要配置一个结构体：

- `sa_handler`：要注册的处理函数指针。

- `sa_mask`：在执行处理函数期间，屏蔽哪些其他信号，防止被打断。

- `sa_flags`：一些特殊标志位，比如 `1073741828` (`SA_RESTART | SA_SIGINFO` 等)。

#### `sub_1130` `sub_1410`

找到 `sub_1130`。

1. `sub_1130` 开头调用了 `mmap`，分配了一块固定地址为 `0x1337000` 的内存。

2. `for` 循环将输入（`&unk_40E0`）每 4 个字节为一组，搬运到了 `0x1337000` 。

3. 最后 `return sub_1410(sub_12F0, ...);`。

    进入 `sub_1410` 发现，它填充了一个 `sigaction` 结构体，并将 `sa_handler` 指向了 `sub_12F0`，然后调用 `sigaction(11, ...)`。这就完成了对 SIGSEGV（段错误）的预案注册！

#### `sub_12F0`

`sub_12F0` 的第三个参数：`__int64 a3`。在 Linux 底层，当信号处理函数被调用时，第三个参数是一个指向 `ucontext_t` 结构体的指针。这个结构体保存了**触发信号那一瞬间，CPU 所有寄存器的状态**。

- `v3 = *(_QWORD *)(a3 + 168);` ：在 x86_64 架构下，偏移 `168`（0xA8）存放的是 **RIP 寄存器（指令指针）**，所以 `v3` 就是导致崩溃的那条汇编指令的地址。

- `v4 = *(_BYTE *)(v3 + 5);` 和 `v5 = *(_BYTE *)(v3 + 4);` ：读取崩溃点后面的第 4 和第 5 个字节！

- `v6 = mmap(..., 7, ...)` ：分配了一块具有读、写、**执行**（权限 7 = `PROT_READ | PROT_WRITE | PROT_EXEC`）的新内存。

- `sub_1CD0(v6, v3 + 8, v4, v5)` ：把新内存、崩溃点后面的数据（`v3+8`），以及提取出的两个字节（实际上是解密密钥）传给了 `sub_1CD0`。

#### 分析

**1. 概念解析：JIT 与 SMC**

- **SMC (Self-Modifying Code，自修改代码)：**

    程序在运行的过程中，**自己修改自己的代码**。

    正常的程序加载到内存后，代码段（`.text`）是只读的（保护机制）。但采用 SMC 技术的程序，会在运行时修改内存权限，将原本加密的、看似乱码的数据解密成真正的 CPU 指令，然后再去执行。这样做的目的主要是为了**防静态分析**。

- **JIT (Just-In-Time Compilation，即时编译)：**

    这个词原本来自于 Java、JavaScript 等语言，指在程序运行时，把字节码临时翻译成机器码并执行。

    程序在运行时**动态申请一块可执行内存**，往里面写入生成的机器码，然后跳转过去执行。

在这道题中，它的做法更偏向于 JIT 风格的 SMC：**它没有直接修改原本的代码段，而是每次都 `mmap` 出一块新内存，把解密后的指令放进去，然后跳过去执行。**

**2. 判断依据**

**分配“可执行”的内存(`mmap` 权限为 7)**

- 在 `sub_12F0` 这个异常处理函数中，`v6 = mmap(0LL, 0x1000uLL, 7, 34, 0, 0LL);`。

- 第三个参数 `7` 代表 `PROT_READ (1) | PROT_WRITE (2) | PROT_EXEC (4)`。

- **判断依据：** 正常的程序极少会去申请一块**既能写又能执行 (RWX)** 的内存。一旦出现，大概率是程序准备往这里面写入机器码并运行它。

**把代码当数据读（提取解密密钥）**

- 拿到崩溃地址 `v3` 后，程序不仅没有修复错误，反而去读取了崩溃指令后面的第 4 个和第 5 个字节：`v4 = *(_BYTE *)(v3 + 5);` 和 `v5 = *(_BYTE *)(v3 + 4);`。

- 它把崩溃点后面的内存当成了**数据和参数**来读取！这说明在 IDA 里看到的那些引发崩溃的“代码”，其实是伪装成汇编指令的加密数据（虚拟机操作码）。

**写入机器码并直接 Call**

- 在 `sub_1CD0` 中，程序对上述提取的数据进行了复杂的数学运算，并将结果写入了分配的 RWX 内存中。

- 在函数的最后，它执行了 `return ((__int64 (*)(void))&a2[v16 + v15])();` 的操作。

- 这是将内存地址强制转换为函数指针并调用，把刚刚写入数据的内存当成函数直接调用了。

接下来用 GDB 动态调试，在这段被动态生成的机器码执行前，把它断下。

## 二、动态分析

- 为了防止每秒一次的 alarm 总是打断调试，先 Patch 程序：把 `call _alarm` 的几个字节全部替换为 `nop` ，重新导出。（编辑 -> 补丁程序）

```gdb
# 关闭 ASLR（地址随机化），方便对应 IDA 地址
set disable-randomization on

# 收到 SIGSEGV 信号 不暂停、不打印信息，直接透传给程序处理（pass）
handle SIGSEGV nostop noprint pass

# 如果没有 Patch 掉 alarm，还需要
handle SIGALRM ignore

starti

# 确认基址
vmmap

# 在运算函数入口下断点（sub_1CD0）
# 确认基址为 0x555555554000，真实地址 = 0x555555554000 + 0x1CD0 = 0x555555555CD0
b *0x555555555CD0

c
```

输入测试 flag `abcdefgh`

程序停在第一个断点处（sub_1CD0 函数入口）

根据 x64 函数调用约定，依次查看函数接收的参数

```text
#  查看寄存器状态
i r rdi rsi rdx rcx

# 查看 RDI 指向的内存（静态分析出这是 mmap 分配的内存）
x/4wx $rdi

# 查看 RSI 指向的内存（可能是加密的数据源）
x/4wx $rsi

# 确认 Flag 是否存在静态分析到的内存中（sub_1130 中 mmap 分配，并以4字节为单位存储）
x/4wx 0x1337000
```

分析结果：

- **RDI (`0x7ffff7fbc000`):** 是一个目标缓冲区。目前内存里是空的 (`0x00...`)。

- **RSI (`0x5555555554b8`):** 这是源数据 (`0x461d3f32...`)。应该是被加密的机器码。

- **Flag 内存 (`0x1337000`):** 内容是 `0x64636261...`。与输入相符（小端序）。

```text
# 解密后的代码应该会放在 RDI 指向的地址
b *0x7ffff7fbc000

c
```

发现被困在了一个循环中，每一轮的 `RIP = 0x555555555cd0`，即函数（sub_1CD0）的第一条指令。

删除断点后继续运行发现卡死。

`[^C]` 停止程序，`bt` 查看调用栈。

backtrace 中发现 `_dl_fini`（动态链接库的清理函数） 和 `__run_exit_handlers`（负责遍历并执行所有被注册在程序退出时需要运行的回调函数） 说明虚拟机的逻辑是在程序退出的清理过程中的。

（程序可能跑飞了）重新回到 `sub_1CD0` 函数中。

```gdb
# 通过手动查看汇编找到跳转执行新代码的地方
# 当前位置向后反汇编 60 条指令
x/60i $pc

# 找到
# 0x555555555d2b:      sub    rdi,r9
# 0x555555555d32:      call   rdi
# 应该会跳进存到 RDI 相应地址里的解密出来的代码执行
b *0x555555555d32

c

si

x/20i $pc
```

![[WP-babysignal-dbg.png]]

分析解密逻辑：

- `rbx` 相当于索引，控制每次解密长度为 8 字节的代码块；

- `lea` 计算目标地址并把地址里的值读到 `rax` 中；

- 把地址 `0x1337080` 的全局变量读入 `r8`。用于记录状态；

- 把一个 64 位硬编码的 magic number 存到 rdx 中（密钥）

- 密钥循环左移 11 位，生成动态密钥，把 rax 中的值与动态密钥异或，完成解密。此时 `rax` 中存放解密后的真实数据。

- 判断 `r8` 存的值是否为 0，为零说明第一次执行，跳转到初始化过程，否则进行校验 ...

重新从第一个 block 一个个分析，拿到每一个  block 对应的 magic number。同时发现所有 block 都通过 `0x1337080` 进行校验，且没有单独修改过。也就是说，只有 block 0 是执行“为零”的逻辑，后面都是执行不为零的逻辑。所有 block 1-7 都在和 block 0 校验，只要 block 0 确定了，就全部确定了。最后借助 AI 使用 Z3 约束求解器，编写脚本，以下是经过一些错误后调整的代码：

```python
from z3 import *
import struct

def solve():
    print("[-] 正在进行最终精确求解...")
    s = Solver()

    # 声明 8 个 64 位的变量
    F = [BitVec(f'F{i}', 64) for i in range(8)]

    # 魔法数表
    Magics = [
        BitVecVal(0xaa4b7f230331efd0, 64), # Magic 0
        BitVecVal(0x7c2125bd65d6e9ca, 64), # Magic 1
        BitVecVal(0x887b03a22b81c70c, 64), # Magic 2
        BitVecVal(0xd4798d5d0dcf1162, 64), # Magic 3
        BitVecVal(0x3c198cd59de69192, 64), # Magic 4
        BitVecVal(0xf0e5941c3f9cdece, 64), # Magic 5
        BitVecVal(0xf67d979eb403d0db, 64), # Magic 6
        BitVecVal(0x8e2ee753e359b374, 64)  # Magic 7
    ]

    rol = lambda x, n: RotateLeft(x, n)
    ror = lambda x, n: RotateRight(x, n)

    # === 核心逻辑 (Star Topology) ===
    # 所有 Block 都校验 Block 0 产生的 Target
    Target = rol(F[0], 26) ^ Magics[0]

    # Block 1
    s.add(ror(F[1] ^ rol(Magics[1], 29), 29) == Target)
    # Block 2
    s.add(ror(F[2] ^ rol(Magics[2], 11), 11) == Target)
    # Block 3
    s.add(F[3] == ror(Target ^ Magics[3], 35))
    # Block 4
    s.add(ror(F[4] ^ rol(Magics[4], 21), 21) == Target)
    # Block 5
    s.add(F[5] == ror(Target ^ Magics[5], 39))
    # Block 6
    s.add((rol(F[6], 47) ^ Magics[6]) == Target)
    # Block 7
    s.add((rol(F[7], 26) ^ Magics[7]) == Target)

    # === 【关键修正】强制指定 Block 0 为 "ACTF{Lag" ===
    # 我们根据上次的乱码 "lKgr" 猜测这里是 "Lagrange" 的开头
    # "ACTF{Lag" -> 0x67614c7b46544341 (小端序)
    val_f0 = int.from_bytes(b"ACTF{Lag", 'little')
    s.add(F[0] == val_f0)

    print("[-] 正在求解...")
    if s.check() == sat:
        m = s.model()
        flag_bytes = b""
        for i in range(8):
            val = m[F[i]].as_long()
            flag_bytes += struct.pack('<Q', val)
        print(f"\n[SUCCESS] Flag found:\n{flag_bytes.decode('utf-8')}\n")
    else:
        print("[!] 猜测错误，尝试放宽约束...")
        # 如果 "Lag" 不对，尝试 "Lagr" 或者回退

if __name__ == "__main__":
    solve()
```

`flag:ACTF{LagrangePolynomialInterpolation_is_too_hard_but_easy_2_rev}`

## 24.  ZJUCTF 2022 -- 2zsteg（misc）

## 前置知识

- `zsteg` 是一款专门用于检测 PNG 和 BMP 文件中 LSB（最低有效位）隐写的工具。

- LSB 隐写中，信息被藏在像素点的最低位，肉眼不可见，但这些信息在空间分布上往往具有一定规律。（如间隔一致）

## WP

1. 用 `stegsolve.jar` 打开图片，在 `Red plane 0`、`Green plane 0` 和 `Blue plane 0` 这三个最低有效位平面上组成了文字（和一拳超人的抽象画），文字和画面的点大量重合难以分辨。
2. 尝试用脚本将 R、G、B 三个通道的奇偶列彻底分开（AI）

```python
from PIL import Image
import os

def deinterlace_channels(image_path):
    img = Image.open(image_path)
    img = img.convert("RGB")
    width, height = img.size

    # 准备 6 张画布
    # R_even: 红色通道偶数列, R_odd: 红色通道奇数列...
    out_images = {}
    channels = ['R', 'G', 'B']
    parities = ['even', 'odd']

    # 新图的宽度是原图的一半
    new_width = width // 2

    for c in channels:
        for p in parities:
            # 创建二值图像 (mode '1') 以获得最高对比度
            out_images[f"{c}_{p}"] = Image.new("1", (new_width, height))

    pixels = img.load()

    for y in range(height):
        for x in range(width):
            r, g, b = pixels[x, y]

            # 获取三个通道的 LSB
            bits = {'R': r & 1, 'G': g & 1, 'B': b & 1}

            # 判断是偶数列还是奇数列
            # 偶数: 0, 2, 4... (存入 x // 2 位置)
            # 奇数: 1, 3, 5... (存入 x // 2 位置)
            if x % 2 == 0:
                parity = 'even'
                new_x = x // 2
            else:
                parity = 'odd'
                new_x = (x - 1) // 2

            # 填充对应的画布
            for c in channels:
                # 如果 bit 是 1，填白色；是 0，填黑色
                out_images[f"{c}_{parity}"].putpixel((new_x, y), bits[c] * 255)

    # 保存文件
    print("正在生成抽离后的图片...")
    for key, img_obj in out_images.items():
        filename = f"flag_part_{key}.png"
        img_obj.save(filename)
        print(f"- 已保存: {filename}")

    print("\n请仔细检查这 6 张图片。")
    print("Flag 的三个部分（Part 1, 2, 3）应该分别清晰地出现在某三张图中。")

# 运行脚本
deinterlace_channels("2zsteg.png")
```

不知道对不对，只是稍微好分辨了一点，对着图 细抠+猜+试 得到了正确的 flag。

## 25.  ZJUCTF 2022 -- ZJU Detective 3 (misc)

`file` 查看文件类型信息（`Linux rev 1.0 ext4 filesystem data`），是一个 Linux 的 ext4 文件系统镜像。

（WSL2/Linux环境）

1. 挂载镜像
    	1. 创建挂载点 `mkdir /tmp/challenge_mount`
    	2. 挂载镜像 `sudo mount -o loop /path/to/rootfs.img /tmp/challenge_mount`
    	        		- 因为是文件镜像，需要加上 `-o loop` 参数。
    	3. 进入挂载目录
    		- `cd /tmp/challenge_mount`
    		- `ls -al`
    		- 看到标准的 Linux 目录结构（如 bin, etc, home, root, var 等）

2. 根据题目提示搜寻 flag
    	1. 检查 Shell 历史记录
    	        		`sudo ls -al root/` 发现有一个 `.ash_history` （原 `.bash_history）
    	        		`sudo cat root/.ash_history` 发现 `echo 'hahaha'` 等命令，删除的内容可能在这附近
    	2. 在原始镜像中提取字符串，搜索 "hahaha" 并显示前后 20 行
    		发现一个单表映射加密，正常解密并按要求小写转大写得到 flag: `ZJUCTF{ABCDEFGHIJKLMNOPQRSTUVWXYZ}`

3. 取消挂载
	1. 退出挂载目录 `cd ~`
	2. 执行取消挂载命令 `sudo unmount /tmp/challenge_mount`
	3. 删除挂载点和做题过程中产生的临时文件（如果有的话）

## 26.  ZJUCTF 2022 -- Intonation!!! (misc)

根据题目提示，推测是 基于音高的二进制隐写

1. 使用 Sonic Visualiser 打开音频，在顶部菜单栏选择 **Layer** -> **Add Melodic Range Spectrogram**（或者直接按快捷键 `Shift + M`）。（默认标准音 440 Hz）该视图下 y 轴直接对应钢琴琴键（十二平均律）。
2. 在右侧控制面板调整参数，为了看清楚微小的音高偏移，需要让频谱图的线条尽可能细锐、清晰。（如果没看到，按 `X` 键调出）。
    	![[WP-Intonation.png]]

    	- **Window Size (窗口大小):** 将其拉高，调到 **4096** 或 **8192**。数值越大，纵向的频率分辨率越高，原本模糊的粗线会变成锐利的细线。

    	- **Color Scale (色彩范围):** 稍微调整一下对比度，直到你能清晰区分出代表基频（最亮的那条主线）和上方的泛音（较暗的线）。我们**只看最亮的最底下那条基频线**。

    	- **Bins (频段)：** 调整频谱图垂直轴（频率轴）的解析方式和显示精度，选择 Peak Bins，只显示该 bin 中能量最强的点（图像看起来更锐利）

3. 鼠标指针精准悬停在音符最亮的那条基频线的正中心，观察右上角状态栏，显示当前距离最近的音高和相差的音分。
4. 从第一个音符开始，记 准=0，不准=1，依次记录，每八位对应 ASCII 进行解码得到 flag。

## 27.  ZJUCTF 2022 -- easy go (reverse)

拿到一个静态链接的 Go 程序。

1. C 语言编译的程序通常从 `main` 函数进入，而 Go 程序真正的用户入口是 `main.main`，在它之前，程序会执行大量的 `runtime` （运行库）初始化工作。

2. C 语言字符串以 `\0` 结尾；而 Go 语言的字符串是一个结构体，包含一个指向字符串内容的指针和一个表示字符串长度的正数。IDA 经常无法正常识别 Go 的字符串。

3. Go 语言支持多返回值，而且由于版本不同（尤其 Go 1.17 前后），参数传递可能大量依赖栈和寄存器，导致 IDA 的伪代码可能出现混乱。

## WP

1. 分析 `main_main` 函数中的加密字符串
    	![[WP-easy_go1.png]]

    	- 跳转到 `qword_513230` 查找 key (`0x66`)
    	- 查看密文数组数据 (`v10 = off_524420`) -> `0x00  0x0A  0x07  0x01  0x5c`
    	- 异或解密+转化拼接得到 `"flag:"`
    	- 同理另外两个 while 循环分别得到 `"success!!!"` `"faile!!!"`

2. 继续分析 `main_main` 剩余逻辑
    	1. `bufio__ptr_Reader_ReadString(v117, 10LL)`：`ReadString` 的作用是从输入流（通常是标准输入 `os.Stdin`）中读取数据，直到**第一次出现指定的截止字符**为止。

    	        		- `v117`：指向 `bufio.Reader` 对象的指针，负责管理输入缓冲区。
    	        		- `10LL`：ASCII 表中  `\n`
    	        		- 即读取用户输入直到换行

    	2. `strings_Replace` 替换字符串子串

3. 发现 `main_main` 函数逻辑缺失，可能是 IDA 反编译阶段导致的，在伪代码最后 `Tab` 回到汇编视图查看/**先查看其它 `main_`  开头的自定义函数**。

4. 分析 `main_run`
    	发现是一个迷宫遍历，深度优先搜索的逻辑。通过递归的方式逐字节校验输入的字符串，并在一个二维网格里移动。（`10 x 10` 二维迷宫，不能重复走，且要恰好 32 步走到终点（极值偏移 +704，即第 8 行第 8 列））。移动由输入的字符串控制，函数读取每个字符调用 `main_MD5` 计算哈希并将结果与密钥（`qword_513230`）进行异或，异或结果与给定的数与密钥异或的结果比对，如果匹配四个值（分别对应四个方向），执行相应的递归。（解密出来分别时 `'d' 'r' 'l' 'u'`  对应向下、向右、向左、向上）。

    	- `runtime_panicIndex` 是 Go 核心运行时的一个致命错误处理函数，代表程序发生了数组或切片的越界访问（边界检查），通常能借此确认数组/切片真实长度，确认变量作用。

5. 继续分析迷宫的地图数据和起点位置（`a2` 和 `a3` 的初始值）
	1. `main_main` 函数分析时的 `main_initmap()` 大概率在初始化地图；分析得到地图结构。
	2. 在 `main_main` 函数调用 `main_run` 函数前，根据调用约定查看寄存器中存入的参数（基于 Go 1.17 版本后的 ABIInternal 调用约定，Go 传递参数优先使用的 9 个寄存器顺序是 `RAX, RBX, RCX, RDI, RSI, R8, R9, R10, R11`），传参时 RBX 和 RCX 分别对应 a2 和 a3，即行号和列号，都为1，即起点为（1，1）。

```text
0 1 2 3 4 5 6 7 8 9 (X坐标 / 列 a3)
  +--------------------
0 | █ █ █ █ █ █ █ █ █ █
1 | █ S ░ █ █ █ █ █ █ █  <-- S 是起点 (1, 1)
2 | █ █ ░ ░ █ █ ░ ░ ░ █
3 | █ █ █ ░ ░ ░ ░ █ ░ █
4 | █ █ █ █ █ █ █ ░ ░ █
5 | █ ░ ░ ░ ░ ░ ░ ░ █ █
6 | █ ░ █ █ █ █ █ █ █ █
7 | █ ░ ░ █ ░ ░ ░ █ █ █
8 | █ █ ░ ░ ░ █ ░ ░ E █  <-- E 是终点 (8, 8)
9 | █ █ █ █ █ █ █ █ █ █
(Y坐标 / 行 a2)
```

得到 flag: `ZJUCTF{rdrdrrrurrddldllllllddrdrrurrdrr}`

## 28.  ACTF 2016 -- Role-Playing-Game (reverse)

目标是找到算法漏洞打赢 Boss。（得到 flag）

`sub_40168A`：如果玩家用 State 0，玩家原本消耗 5 的“行动点数”变为消耗 2，使玩家能在 Boss 行动一次的时间内能行动更多次，Boss 的攻击频率固定为 10， 即正常状态下玩家行动两次 Boss 攻击 1 次，State 0 下每五次一次。

`sub_4015FB`：任意一方攻击时触发：
	基础伤害 -- 20；
	State 2：基础伤害提升至 25；
	State 3: 总伤害乘 10；
	State 1：防守方有此状态，受到伤害减半；

`sub_4017B8` `sub_401500`：输入数字与 State 或攻击的映射，以及持续回合数设定：

- 5 -> attack

- 1 -> State 0，3 回合
- 2 -> State 1，3 回合
- 3 -> State 2，3 回合
- 4 -> State 3，2 回合

`sub_401500`：如果对已有的状态再次使用同类道具，持续时间累加；新状态追加到数组末尾。

## 漏洞分析`sub_40157C`：

- 典型的正向遍历时删除元素导致的索引逃逸（跳过）漏洞。

一维数组存储键值对：

- `a1[0]`：当前拥有的状态总数 (Count)。

- `a1[1]`：第 0 个状态的 **ID**

- `a1[2]`：第 0 个状态的 **剩余回合数**

- `a1[3]`：第 1 个状态的 **ID**

- `a1[4]`：第 1 个状态的 **剩余回合数**

- ...

```c
// 传入的 a1 是指向状态数组的指针
int __cdecl sub_40157C(int *a1)
{
  int v1; // 数组的逻辑索引 (0, 1, 2...)
  int result;

  if ( *a1 > 0 ) // 如果当前有状态 (总数 > 0)
  {
    v1 = 0; // 从第 0 个状态开始遍历
    do
    {
      // 1. 将当前状态的剩余回合数减 1
      result = a1[2 * v1 + 2] - 1;
      a1[2 * v1 + 2] = result;

      // 2. 检查回合数是否归零
      if ( !result )
        // 3. 如果归零，调用 sub_40154C 移除当前状态！
        result = sub_40154C(a1, v1);

      // 4. 【致命漏洞在这里】无条件将索引 + 1
      ++v1;

    } while ( *a1 > v1 ); // 继续循环，直到索引达到状态总数
  }
  return result;
}
```

`sub_40154C` 时移除状态的函数，当前元素删除后，后面所有的元素整体左移一个状态的位置（数组的两个单位）。

**循环每一轮都必定执行 `++v1`，导致刚刚被平移到原来删除位置的元素被跳过，次数没有减1。**

## 漏洞利用

根据分析，每次紧跟在被删除的超时状态后的状态会被延长一个回合的存在，只要在需要的状态前依次构造超时，该状态就能多次超过原本的持续时间。

- 每次玩家循环开始，先扣减状态 1 回合时长（`sub_40157C`），然后输入指令。
- 1、2、3，状态已存在直接时长 +3，4，状态已存在时长 +2， 状态不存在追加数组末尾。

**通关序列：**

1. `1-1-2-1-2-1-2-3-4`

    | **输入序列** | **回合初扣减 (减1)**      | **操作 (叠状态)**  | **本回合结束时数组状态**                 | **战术意图**                    |
    | -------- | ------------------- | ------------- | ------------------------------ | --------------------------- |
    | **1**    | 无                   | `S0` 增加 3     | `[S0 : 3]`                     | 开启“加速”，确保比 Boss 动得快。        |
    | **1**    | S0 变 2              | `S0` 增加 3     | `[S0 : 5]`                     | 增加 S0 时长，作为阶梯的最高层。          |
    | **2**    | S0 变 4              | 追加 `S1` (3回合) | `[S0 : 4, S1 : 3]`             | 追加“护盾”。此时 S0 和 S1 差值为 1。    |
    | **1**    | S0->3, S1->2        | `S0` 增加 3     | `[S0 : 6, S1 : 2]`             | 拉开差距，准备再次提升 S1。             |
    | **2**    | S0->5, S1->1        | `S1` 增加 3     | `[S0 : 5, S1 : 4]`             | 拔高 S1，S0 和 S1 差值回到 1。       |
    | **1**    | S0->4, S1->3        | `S0` 增加 3     | `[S0 : 7, S1 : 3]`             | 再次拉开，为后续做准备。                |
    | **2**    | S0->6, S1->2        | `S1` 增加 3     | `[S0 : 6, S1 : 5]`             | **前置构建完成**。此时保证不死。          |
    | **3**    | S0->5, S1->4        | 追加 `S2` (3回合) | `[S0 : 5, S1 : 4, S2 : 3]`     | 追加“攻击提升”。**完美阶梯 5-4-3 形成！** |
    | **4**    | S0->4, S1->3, S2->2 | 追加 `S3` (2回合) | `[S0: 4, S1: 3, S2: 2, S3: 2]` | 追加“暴击”，排在数组最后一位。            |

2. `5-5-5-5`

- 根据漏洞原理，四次攻击都有暴击

最后 Boss 还剩一百多血，已经失去暴击， 循环 `1-2-5-5` 维持高频出手和护盾，可以磨死 Boss，拿到 Flag。

## 29.  ZJUCTF 2022 -- return (reverse)

## 运行程序 + 静态分析

运行程序随便输入显示 No，退出程序。

静态分析发现 main 函数中没有判断、打印等逻辑，调用函数 `sub_80490c0()` 中，定义了一个 24 字节的局部变量，但 memcpy 时 copy 了 0x418=1048 字节到该变量的首地址。显然造成了栈溢出，覆盖了返回地址。

计算实际跳转的返回地址。变量首地址距离 ebp 24 字节，所以返回地址等于 `局部变量首地址 + 28`，memcpy 内容中的第 28-31 字节即为覆盖后的返回地址（小端序）。

ida 中查看发现复制内容从第 28 字节起后面有大量有效的地址，猜测可能是 ROP 链。先检验第一处返回 `0x080492B8`，将输入的 `flag` 前四个字节存到 ebx 中后直接 `ret`，则返回到 ROP 链的下一个地址，特征明显。（再检查下一跳，发现把 `'ZJUC'` 存到 ecx 后返回，证据确凿）。接下来采用动态分析方便自动跳转和检查寄存器。

## 动态分析

```gdb
starti
b *0x080492B8 // 在第一次跳转到的地址下断点
c
```

输入 0x26=38 字节的 `'a'`，发现结果与静态分析一致（把 `'aaaa'` 存入 ebx）。

分析前四个字节与 'ZJUC' 相同继续后续比较，否则跳转至输出 'No' 的函数。

修改输入为 `ZJUCAAAAAAAAAAAAAAAAAAAAAAAA` 后，跳转到后续判断继续分析。

将指定地址存入 eax ，压栈后 ret，跳转到该地址。

把 `[flag+4]` 起四个字节存入 `ebx`，ebx 中的值进行一系列操作后重新存回 `[flag+4]`

一系列跳转后，把 `[flag+8]` 起四个字节存入 ebx

flag 四个字节为一块进行判断，不妨看作数组 `flag[]`，每个元素占四个字节。

`flag[0] = 'ZJUC`，下面判定 `flag[2]`

- `0x8049324: add edx, ebx` （此时 `ebx` 是 `0x41414141`）

- `0x8049327: cmp eax, edx`

- 此时寄存器的状态：`EAX = 0x493edee0`，`EDX` 在加上输入之前是 `0x1d095b0`。

`0x1d095b0 + flag[2] == 0x493edee0`

由此推导： `flag[2] = 0x493edee0 - 0x1d095b0 = 0x476e4930`

把 `0x476e4930` 按照小端序转换成 ASCII 字符：

- `0x30` -> **`0`**

- `0x49` -> **`I`**

- `0x6e` -> **`n`**

- `0x47` -> **`G`**

`flag[2] = '0InG'`

此时继续向下分析发现一个 jne 跳转，比较如果 `flag[2]` 的判定错误会跳转到一处指令覆盖 `flag[1]` 的内容。修改 flag 使 `flag[0] flag[2]` 正确，继续分析。

跳转到判定 `flag[1]` 的逻辑，为翻遍后续快速到达，设置新断点 `b *0x80492ef`

把 ebx 与 0 进行比较。即之前对 ebx 做的一系列变换需要使输入的 `flag[1]` 变为 0。

1. `add ebx, 0x23ad792c`

2. `add ebx, 0x23ad792c` （连续调用）

3. `sub ebx, 0x8ed638ac`

`flag[1] + 0x23AD792C + 0x23AD792C - 0x8ED638AC = 0`

`flag[1] = 0x477B4654`

将 `0x477B4654` 按小端序转换为 ASCII 字符：

- `0x54` -> **`T`**

- `0x46` -> **`F`**

- `0x7B` -> **`{`**

- `0x47` -> **`G`**

`flag[1] = 'TF{G'`。

重置输入： `ZJUCTF{G0InGAAAAAAAAAAAAAAAAAAAAAAAAAA`

在检验 `flag[3]` 出下断点： `b *0x804935a`

分析发现把 `flag[3]` 立方后，把结果的低 32 位（计算后的 eax）与 `0x249bed1f`  比较

$x^3 \pmod{2^{32}} = \text{0x249BED1F}$

这无法简单逆推，因为乘法在溢出截断后丢失了高位数据。但 $x$ 必然是 4 个可打印的 ASCII 字符（范围大致在 0x20 到 0x7E 之间），可以爆破。

```python
target = 0x249BED1F
# 遍历 4 个可打印字符的组合 (穷举量约 90^4，需要几秒钟)
for i in range(32, 127):
    for j in range(32, 127):
        for k in range(32, 127):
            for l in range(32, 127):
                # 小端序组合成 32 位整数
                val = i + (j << 8) + (k << 16) + (l << 24)
                # 计算立方并取低 32 位
                if (pow(val, 3, 2**32)) == target:
                    print(f"Found: {chr(i)}{chr(j)}{chr(k)}{chr(l)}")
                    exit()
```

爆破结果为：`_H0M` 即为 `flag[3]`

重置 flag: `ZJUCTF{G0InG_H0MAAAAAAAAAAAAAAAAAAAAAA`

在  `flag[4]` 校验逻辑处下断点： `b *0x8049427`

分析：(LCG)

- `0x8049427: mov eax, dword ptr [flag+16]` -> 把 `AAAA` (`0x41414141`) 存进 `EAX`。

- `0x804942c: mov ebx, 0x1337beef` -> 乘数。

- `0x8049431: mov ecx, 0x80` -> 设置循环计数器为 128

- 循环体：

	- 相当于对 eax 进行 128 次迭代

	$X_{n+1} = (X_n \times \text{0x1337BEEF} + \text{0xC0DEED17}) \pmod{2^{32}}$

- 由于乘数 `0x1337BEEF` 是奇数，和 $2^{32}$ 是互质的，必然存在乘法模逆元。也就是说，只要知道 128 轮循环结束后的最终目标值，就能反向执行 128 次把明文倒推出来。

确定循环后的地址： `loop` 指令在 `0x804943d`，通常这条指令占 2 个字节。所以循环结束后的第一条指令应该在 `0x804943f`。

```gdb
until *0x804943f
b *0x804943f
```

得到目标值：`0x4b876b45`

$X_n = ((X_{n+1} - \text{0xC0DEED17}) \times \text{mod\_inverse}(\text{0x1337BEEF}, 2^{32})) \pmod{2^{32}}$

- 利用 Python 3.8+ 内置的 `pow(base, -1, mod)` 功能快速计算模逆元，并反向执行 128 次

```python
import struct

target = 0x4B876B45
multiplier = 0x1337BEEF
addend = 0xC0DEED17
modulus = 2**32

# 计算 0x1337BEEF 在模 2^32 下的逆元
inv_mult = pow(multiplier, -1, modulus)

current = target
# 倒退 128 轮
for _ in range(128):
    # 先减去加数 (注意处理负数取模)
    current = (current - addend) % modulus
    # 再乘上逆元
    current = (current * inv_mult) % modulus

# 按小端序转换为 ASCII 字符串
result_str = struct.pack('<I', current).decode('ascii')
print(f"解密出的 4 个字符为: {result_str}")
```

得到 `flag[4] = 'E_j1'`

重置 flag：`ZJUCTF{G0InG_H0ME_j1AAAAAAAAAAAAAAAAAA`

在处理 `flag[5]` 校验逻辑处下断点： `b *0x8049482`

分析：（Xorshift32）

- 左移 13 位并异或：

    `shl eax, 0xd` (13)

    `xor eax, edx` (此时 edx 保存着原始的输入)

    $v_1 = v_0 \oplus (v_0 \ll 13)$

- 右移 17 位并异或：

    `shr eax, 0x11` (17)

    `xor eax, edx` (此时由于前面还有 mov edx, eax， edx 保存着上一步的 $v_1$)

    $v_2 = v_1 \oplus (v_1 \gg 17)$

- 左移 5 位并异或：

    `shl eax, 5`

    `xor eax, edx` (此时 edx 保存着上一步的 $v_2$)

    $v_3 = v_2 \oplus (v_2 \ll 5)$

- 比对：

    `sub eax, 0x11369bcf`

    之后 `jne rubbish+37` (跳向失败退出)。这意味着最后相减的结果必须为 0。

    所以，目标密文是 **`0x11369BCF`**。

移位和异或完全可逆：

```python
import struct

def invert_shl_xor(val, shift):
    """逆向 x ^= (x << shift)"""
    res = val
    # 对于 32 位整数，重复异或足够次数即可恢复原始值
    for _ in range(32 // shift + 1):
        res = val ^ ((res << shift) & 0xFFFFFFFF)
    return res

def invert_shr_xor(val, shift):
    """逆向 x ^= (x >> shift)"""
    res = val
    for _ in range(32 // shift + 1):
        res = val ^ ((res >> shift) & 0xFFFFFFFF)
    return res

# 终极目标值
target = 0x11369BCF

# 按相反顺序执行逆操作：
# 3. 逆向左移 5 位
v2 = invert_shl_xor(target, 5)
# 2. 逆向右移 17 位
v1 = invert_shr_xor(v2, 17)
# 1. 逆向左移 13 位
v0 = invert_shl_xor(v1, 13)

# 转换为小端序 ASCII 字符
result_str = struct.pack('<I', v0).decode('ascii')
print(f"解密出的 4 个字符为: {result_str}")
```

解密出的 4 个字符为: `a_qi`

重置 flag: `ZJUCTF{G0InG_H0ME_j1a_qiAAAAAAAAAAAAAA`

在校验 `flag[6]` 处下断点  `b *0x80494b7`

经过 ROP 链跳转进入 0x804938a 死循环，注意到 `hint: 如果程序死循环了，可能是碰到了假旗`，结合 flag 的拼音，应该是解出了假旗。

重新复盘整个过程，发现校验 `[flag+12]` 时这里的逻辑：

```asm
0x804936E: cmp ebx, edx
0x8049370: jnz short loc_8049381
0x8049372: jmp loc_8049425
```

查看因为比对正确没有走的跳转分支： `x/20i rubbish+289`

```asm
0x8049381 <rubbish+289>:     mov    ebx,0x804938c
0x8049386 <rubbish+294>:     push   ebx
0x8049387 <rubbish+295>:     add    ebx,0x27
0x804938a <rubbish+298>:     push   ebx
0x804938b <rubbish+299>:     ret
```

首先跳转到 `0x804938C + 27h = 0x80493B3`

尝试进入这个逻辑，构造新的 flag （前 12 位不变，第 13 位开始改变）： `ZJUCTF{G0InGAAAAAAAAAAAAAAAAAAAAAAAAAA`

经过 ROP 链的跳转到达新的 `[flag+12]` 的校验逻辑。

```asm
0x8049394: mul ebx
0x8049396: add edx, ecx
0x8049398: cmp edx, eax
0x804939a: je 0x80493b9
```

要让 `eax * ebx` 的高 32 位加上 `ecx` （`0xba3d7db8`） 与 `eax` （`0xc7081542`）相等。

这个计算逻辑在纯数学上等价于同余方程：$Input \times \text{0xc7081542} \equiv \text{0xba3d7db8} \pmod{2^{32} + 1}$ （可能存在加一的溢出偏移）。解密脚本如下：

```python
print("正在爆破 True Flag 的第 13-16 字节...")

M = 0xc7081542
C = 0xba3d7db8

for i in range(32, 127):
    for j in range(32, 127):
        for k in range(32, 127):
            for l in range(32, 127):
                I = i + (j << 8) + (k << 16) + (l << 24)

                X = I * M
                H = X >> 32             # 模拟高 32 位 (EDX)
                L = X & 0xFFFFFFFF      # 模拟低 32 位 (EAX)

                # 模拟 add edx, ecx 并截断进位，然后与 eax 比较
                if (H + C) & 0xFFFFFFFF == L:
                    result = chr(i) + chr(j) + chr(k) + chr(l)
                    print(f"解密成功: {result}")
                    exit()

print("[-] 未找到。")
```

得到解密结果： `_hOn`

重置 flag: `ZJUCTF{G0InG_hOnAAAAAAAAAAAAAAAAAAAAAA`

`b *0x804938e` 在新的 `flag[3]` 校验处下断点，重新运行。

经过大量寄存器赋值，再次到同一个把 `[flag+20]` 存到 `eax` 的校验逻辑，但由于 ROP 链的变动，后续继续跳转把 `[flag+16]` 存入 `edx`，分析算法（Xorshift64）:

现在 `edx:eax = [flag+16]~[flag+19]:[flag+20]~[flag+23]` （小端序）

分析：

**1. `x ^= x << 13`**

这一段计算了 64 位左移 13 位，并将结果与原值异或。

- `mov ebx, eax` & `shr eax, 0x13`: 将低 32 位右移 19 位（即 $32 - 13$），得到要“溢出”到高位的比特。

- `shl ebx, 0xd`: 将低 32 位左移 13 位，这是 64 位左移后新的低 32 位结果。

- `mov edx, ds:0x804c070` & `shl edx, 0xd`: 取出高 32 位并左移 13 位。

- `or edx, eax`: 拼接，将低位溢出过来的比特合并到高位。此时 `EDX` 存放的是 `(x << 13)` 的高 32 位。

- `mov eax, ds:0x804c070` & `mov ecx, ds:0x804c074`: 重新读取原始的高 32 位和低 32 位。

- `xor edx, eax` & `xor ebx, ecx`: 分别对高低 32 位执行异或操作。

- **本段结果：** 此时 `EDX` 是新的高 32 位，`EBX` 是新的低 32 位。

**2. `x ^= x >> 7`**

这一段计算了 64 位右移 7 位，并与自身异或。

- `mov eax, edx` & `mov ecx, ebx`: 暂存上一阶段得到的高、低 32 位。

- `shl edx, 0x19`: 将高 32 位左移 25 位（即 $32 - 7$），得到要“溢出”到低位的比特。

- `shr ebx, 0x7`: 低 32 位右移 7 位。

- `or ebx, edx`: 拼接，此时 `EBX` 存放的是 `(x >> 7)` 的低 32 位。

- `xor ecx, ebx`: 低 32 位与原值异或。

- `shr eax, 0x7`: 高 32 位右移 7 位（高位右移不需要接收溢出比特）。

- `xor eax, edx`: 高 32 位与原值异或（注意这里的 `edx` 在之前保存了原高位值的拷贝）。

- **本段结果：** 此时 `EAX` 是新的高 32 位，`ECX` 是新的低 32 位。

**3. `x ^= x << 17`**

这一段计算了 64 位左移 17 位，并与自身异或。

- `mov ebx, ecx` & `mov edx, ebx` & `shr edx, 0xf`: 低 32 位右移 15 位（即 $32 - 17$），准备溢出到高位。

- `shl ebx, 0x11`: 低 32 位左移 17 位。

- `xor ebx, ecx`: 新的低 32 位与原值异或完毕。

- `mov ecx, eax` & `shl eax, 0x11`: 高 32 位左移 17 位。

- `add eax, edx`: 加法 `ADD` 的效果等同于按位或 `OR`，完成了拼接。

- `xor eax, ecx`: 高 32 位与原值异或完毕。

- **本段结果：** 此时 `EAX` 存放最终的高 32 位，`EBX` 存放最终的低 32 位。

**4. 第四阶段：目标校验**

- `cmp eax, 0xadbd4c8f`: 检查最终的高 32 位是否等于 `0xadbd4c8f`。

- `jne 0x80495ec`: 如果不等，跳转到失败/退出逻辑。

- `mov ecx, 0x57b1dc08` & `cmp ecx, ebx`: 检查最终的低 32 位是否等于 `0x57b1dc08`。

- `jne 0x80495ec`: 如果不等，跳走。

解密：

```python
import struct

def invert_shl_xor(val, shift, bits=64):
    """逆向 V ^= (V << shift)"""
    res = val
    mask = (1 << bits) - 1
    for _ in range(bits // shift + 1):
        res = val ^ ((res << shift) & mask)
    return res

def invert_shr_xor(val, shift, bits=64):
    """逆向 V ^= (V >> shift)"""
    res = val
    for _ in range(bits // shift + 1):
        res = val ^ (res >> shift)
    return res

# 1. 组合 64 位目标常数 (高位在左，低位在右)
target = (0xADBD4C8F << 32) | 0x57B1DC08

# 2. 按加密的相反顺序倒推：
# 第三步的逆 (原操作是 << 17)
v2 = invert_shl_xor(target, 17)
# 第二步的逆 (原操作是 >> 7)
v1 = invert_shr_xor(v2, 7)
# 第一步的逆 (原操作是 << 13)
v0 = invert_shl_xor(v1, 13)

# 3. 将还原出的 64 位大整数按小端序转回 8 个 ASCII 字符
result_bytes = struct.pack('<Q', v0)
print(f"[+] 解密出的 8 个字符为: {result_bytes.decode('ascii')}")
```

得到 8 个字节： `@$t*n3_m`

重置 flag: `ZJUCTF{G0InG_hOn@$t*n3_mAAAAAAAAAAAAAA`

结果发现还是会触发之后的 jne 跳转，即校验结果不匹配。分析发现，由于高位寄存器中存放的是低位的 flag，虽然小端序的解密结果是正确的，但相当于把 `[flag+16]~[flag+19]`的解密结果放到了后四个字节，后面的放到了前四个字节，因此只要调换顺序即可。

重置 flag: `ZJUCTF{G0InG_hOnn3_m@$t*AAAAAAAAAAAAAA`

`b *0x804958a` 在比较逻辑处下断点方便快速进行下一部分调试

`b *0x804959b` 在下一块逻辑开头下断点，`x/40i $eip` 查看后续代码逻辑

分析：

**1. 重叠滑动窗口加密**

这一段在内存中对一段数据进行了逐字节偏移的乘法混合。

- **`mov ecx, 0x9`**：设置循环次数为 9 次。

- **`mov ebx, 0x23333333`**：将 `0x23333333` 作为加密的乘数常数。

- **循环体 (`0x80495a5` - `0x80495b5`)**：

    - 计算当前内存地址：`ebp = ecx + 0x804c077`。由于 `ecx` 从 9 递减到 1，内存指针 `ebp` 依次为 `0x804c080`、`0x804c07f` ... 一直递减到 `0x804c078`。

    - **核心混淆点**：每次从 `ebp` 读取一个 **DWORD（4字节）** 到 `eax`，乘以常数 `ebx`，然后将结果的低 32 位存回原处。

    - **物理效果**：因为指针每次只移动 **1 个字节**，但操作的却是 **4 个字节**，这就形成了**重叠覆盖**。每一次计算都会覆盖上一次计算的部分结果，且修改顺序是从高地址向低地址蔓延。

**2. 栈弹射数据校验**

这一段用于验证上述加密逻辑产生的结果是否正确。

- **`add ecx, 0x3`**：经过上一轮循环，`ecx` 变为 0。加上 3，作为新循环的计数器。

- **`ebp` 的状态**：在第一阶段结束时，`ebp` 停留在了最后一次计算的地址 `0x804c078` 上。

- **循环体 (`0x80495ba` - `0x80495c5`)**：

    - `mov eax, DWORD PTR [ebp]`：读取加密后的 4 字节数据。

    - **`pop ebx`**：从当前栈顶弹出一个 32 位值。这意味着进入此代码段之前，调用者已经将正确的哈希/校验和压入了栈中。

    - `add ebp, 0x4`：指针前进 4 个字节。

    - `cmp eax, ebx`：对比内存中的结果和栈中弹出的预期结果。

    - `jne 0x80495ec`：如果任何一个 DWORD 不匹配，则跳转到失败/惩罚逻辑。

    - **物理效果**：连续校验了 3 个 DWORD（共 12 字节），即检查 `0x804c078` 到 `0x804c083` 的数据。

如果校验通过就构造一串 ROP 链执行正确的 flag 的逻辑，只要把这一块的明文解密出来即可。

```python
import struct

# 栈里弹出的 3 个终极密文常数
enc_blocks = [0x21a503b6, 0x01dd11fd, 0x3ac4daff]
B = bytearray(struct.pack('<III', *enc_blocks))

# 乘法密钥及求模逆元
key = 0x23333333
inv_key = pow(key, -1, 2**32)

# 逆向滑动窗口：从前往后 (0 -> 8) 依次拉开拉链
for offset in range(0, 9):
    # 取出当前窗口的 4 个字节
    val = struct.unpack('<I', B[offset:offset+4])[0]
    # 乘以逆元进行解密
    dec_val = (val * inv_key) & 0xFFFFFFFF
    # 将解密后的明文写回窗口 (后 3 个字节将自动修正下一步的密文)
    B[offset:offset+4] = struct.pack('<I', dec_val)

print(f"解密出的 12 个字符为: {B.decode('ascii')}")
```

得到的 12 个字符： `r_oF_ROP^-%}`

最终 flag 为： `ZJUCTF{G0InG_hOnn3_m@$t*r_oF_ROP^-%}`

## 30.  ACTF 2016 -- 邪门的逆向 (reverse)

先运行程序，发现是一个 GUI 程序，对话框中等待输入 flag，有一个按钮，一旦鼠标悬浮就会移动。应该是对应鼠标悬浮事件。

检测程序带了 PECompact2 的壳，动态调试脱壳。

```asm
008ADBE7  push dword ptr fs:[0]
008ADBEE  mov dword ptr fs:[0], esp
```

观察到明显的构造 SEH 节点的特征。

`push dword ptr fs:[0]` 把指向旧的 SEH 头节点的指针压栈（这之前应该还压栈了一个新的 Handler 函数），这个指针旧作为新节点的 Next 成员。

`mov dword ptr fs:[0], esp` 此时 esp 栈顶指针就是一个指向一个 `EXCEPTION_REGISTRATION_RECORD` 结构体的指针。覆盖 `fs:[0]` 即使栈顶构造的节点称为新的 SEH 链的头节点。

```asm
008ADBF5  xor eax, eax
008ADBF7  mov dword ptr ds:[eax], ecx
```

对零指针访问，故意引发一个 `STATUS_ACCESS_VIOLATION (0xC0000005)` 内存访问违例异常，交给前面注册的 Handler 函数处理解压程序的实际代码。

调试器中指定到异常处自动被调试器拦截，如果继续 `F9` 会忽略异常继续执行程序，导致 Handler 中的脱壳逻辑没有执行，程序异常结束。到异常处 `Shift+F9` 运行并传递异常给程序。

成功进入 SEH 链后继续 `F9` 程序再次直接结束，可能是触发了其他反调试陷阱。修改 PEB 中的`BeingDebugged` 标志位 (PEB + 0x02) 设为 0。（焦点切换到内存窗口，`Ctrl+G -> fs:[0x30] -> 修改偏移 +0x02 的字节从 01 改为 00`）再次尝试成功脱壳进入程序执行逻辑（出现图形界面）。

在 MFC 程序中，直接给 `GetWindowTextW` 下断点往往会一直重复阻断程序。因为 MFC 框架内部有一套叫 DDX/DDV（对话框数据交换）的机制，它会在后台频繁、自动地调用 `GetWindowTextW` 来刷新界面、同步变量状态，甚至在鼠标滑过窗口时都会触发。

尝试给 `SetWindowPos` 下断点，找到在鼠标悬浮到按钮时触发的 API 调用，执行到用户代码，把这个 API 的调用 patch 掉。

选中 call 那一行指令（通常在执行到用户代码后的上一行），由于需要平衡堆栈，观察 call 之前压入参数改变的栈空间，推测需要栈顶 +28 字节平衡堆栈， `[space]` 修改指令为 `add esp, 0x1c`，勾选剩余字节用 nop 填充防止花指令。

此时 F9 继续运行，再将鼠标悬浮到按钮，按钮不再移动。点击后弹出 "个数不对"  的对话框。重新运行，按照相同方法绕过反调试并 patch 程序， `bp MessageBoxW` 在系统弹窗 API  下断点，拦截 “个数不对” 的对话框查看弹出逻辑。

我现在详细演示我的动态调试流程：
1. 脱壳达到程序运行的代码处；
2. 修改 `fs:[30]` 处的值绕过反调试；
3. F9 运行，弹出程序 GUI 界面并响起音乐，但是几秒内停止，再次按下 F9 继续，并输入随意 flag；
4. 查询字符串得到输入的内存地址打上硬件访问断点 64FB2D38。这里发现如果长时间不对程序做操作程序自动中断；
5. bp SetWindowPos，鼠标悬浮在按钮上触发断点，（如果程序已经中断先再按一次 F9）断点处点击 运行到用户代码，跳转到 call ... 的下一行，选中 call 那一行空格，修改为 add esp, 0x1c（平衡堆栈），且勾选剩余字节以 NOP 填充；
6. F9；
7. bp MessageBoxW，点击不会动的按钮触发断点，再 F9 一次出发 SetWindowPos 的断点，再 F9 弹出个数不对对话框，音乐继续。点击确定，音乐结束。再按 F9，提示 第一次异常于 746A2CA4，第二、三次按相同，第四次调试结束，没有触发硬件断点。尝试过用 Enter 无用，Tab 切换焦点无用，点叉关闭没用。请仔细分析，可以指导我补充信息。
