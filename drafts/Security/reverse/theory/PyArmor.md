# PyArmor

简单来说，**PyArmor 是一个专门用来混淆和加密 Python 脚本的强大工具。** 它的主要目的是保护 Python 程序的源代码和核心逻辑，防止被轻易逆向工程或篡改。因为 Python 是解释型语言，默认编译出的 `.pyc` 文件非常容易被 `uncompyle6` 等工具还原成毫无保留的 `.py` 源码，所以开发者会使用 PyArmor 这样的工具来加壳。

## 1. 核心原理

PyArmor 并不是简单地对代码进行 Base64 编码或字符串替换，它是**在 Python 字节码（Bytecode）和 Python 虚拟机（PVM）层面**进行深度干预的。

- **字节码加密 (Bytecode Encryption):** PyArmor 会读取你的 Python 源代码，将其编译成代码对象（Code Object），然后使用复杂的加密算法（如 AES）对这些字节码进行加密。

- **定制运行时环境 (Custom Runtime):** 经过 PyArmor 处理后的项目，通常会带有一个名为 `pytransform` 的核心动态链接库（在 Windows 上是 `.dll`，Linux 上是 `.so`，Mac 上是 `.dylib`）。这个库是 PyArmor 的“心脏”。

- **内存中动态解密 (Dynamic Decryption in Memory):** 当你运行被保护的脚本时，`pytransform` 库会被加载，它会接管 Python 解释器的执行流程。加密的字节码不会在硬盘上解密，而是在即将被 CPU 执行的前一刻，在**内存中**动态解密，并直接喂给 Python 解释器。

- **底层结构修改:** 为了防止别人轻易写个脚本把内存里的代码 Dump（转储）出来，PyArmor 会修改 Python 内部的 C 结构体（比如拦截或修改 `PyFrameObject`、`PyCodeObject` 等），甚至打乱 Python 默认的操作码（Opcode）映射表。

## 2. PyArmor 的版本差异

在解题前，识别 PyArmor 的版本非常重要，因为不同版本的破解难度天差地别：

- **PyArmor 7 及以前版本:** 这类版本主要依赖上述的 `pytransform` 动态库。它的特征是生成的文件目录中通常有一个 `pytransform` 文件夹。这种版本在 CTF 中较为常见，通常的解题思路是通过修改 CPython 解释器源码或使用 Hook 技术（如 GDB、Frida），在代码运行时从内存中 Dump 出原始的 Code Object，然后修复并反编译。

- **PyArmor 8+ (新版本):** 引入了极其强大的 **BCC (Bypass CPython Compiler) 模式**。它甚至可以直接将 Python 函数转换成 C 语言级别的机器码执行，不再依赖传统的 Python 字节码引擎。如果遇到开了 BCC 的 PyArmor 8，逆向难度会直线上升，几乎等同于逆向底层的 C/C++ 二进制程序。

## 3. 常规解题思路

面对 PyArmor 题目，直接静态看被混淆的 Python 文件通常是一串乱码（或者一堆底层的调用包装）。常规的攻击面通常集中在**动态分析**：

1. **确定环境：** 确定题目使用的 Python 版本（如 3.8, 3.10），因为 Python 每个版本的字节码指令集都不一样，PyArmor 强依赖于具体的 Python 版本。

2. **寻找执行入口：** 找到 `PyEval_EvalFrameDefault` 或类似的 Python 底层字节码执行函数。

3. **内存 Dump：** 利用调试器在上述函数处下断点，当 PyArmor 在内存中完成解密，准备把 Code Object 交给解释器执行的瞬间，将其拦截并保存到本地。

4. **字节码修复与反编译：** Dump 下来的数据通常需要修复头部结构（Magic Number 等），使其成为标准的 `.pyc` 文件，最后再尝试反编译。
