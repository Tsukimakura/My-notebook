# Valgrind

Valgrind 是 Linux 平台下用于内存调试、内存泄漏检测以及性能分析的工具集合。它通过构建合成 CPU 来仿真执行程序，从而监控内存访问和程序行为。

## 1. 编译准备

为了让 Valgrind 输出精确到代码行号的错误信息，编译源代码时必须满足以下条件：

- **开启调试信息**：添加 `-g` 标志。

- **关闭或降低优化**：使用 `-O0`（推荐）或 `-O1`。高级优化（如 `-O2` 或 `-O3`）会重排代码，导致 Valgrind 报告的行号与实际代码不符。

**编译示例：**

```bash
gcc -g -O0 source.c -o my_program
g++ -g -O0 source.cpp -o my_program
```

## 2. 核心工具：Memcheck（内存检测）

Memcheck 是 Valgrind 的默认工具，主要用于检测 C/C++ 中的内存管理错误。

### 2.1 常用执行命令

```bash
valgrind --tool=memcheck --leak-check=full --show-leak-kinds=all --track-origins=yes --log-file=valgrind.log ./my_program [参数]
```

### 2.2 核心参数解析

|**参数**|**说明**|
|---|---|
|`--tool=memcheck`|指定使用 Memcheck 工具（默认值，可省略）。|
|`--leak-check=full`|启用详细的内存泄漏检测，列出每次泄漏的具体代码位置。|
|`--show-leak-kinds=all`|报告所有类型的内存泄漏（包含 definitely, indirectly, possibly, still reachable）。|
|`--track-origins=yes`|追踪未初始化变量的来源。会增加执行开销，但对排查未初始化错误至关重要。|
|`--log-file=<file>`|将 Valgrind 的输出写入指定文件，避免与程序的标准输出混淆。|
|`--trace-children=yes`|跟踪并检测 `fork()` 或 `exec()` 产生的子进程。|

### 2.3 常见错误类型及原因

Memcheck 在日志中会报告具体的错误类型，常见分类如下：

1. **Invalid read / Invalid write of size X**

    - **含义：** 越界读写或访问已释放的内存（Use-After-Free）。

    - **原因：** 数组越界、指针运算错误、访问已经被 `free()` 或 `delete` 释放的堆内存。

2. **Conditional jump or move depends on uninitialised value(s)**

    - **含义：** 程序的条件判断依赖了未初始化的变量。

    - **排查：** 配合 `--track-origins=yes` 参数，Valgrind 会指出该未初始化变量的具体声明位置。

3. **Use of uninitialised value of size X**

    - **含义：** 使用了未初始化的值（如将其传递给系统调用或用于计算）。

4. **Invalid free() / delete / delete[] / realloc()**

    - **含义：** 释放内存的方式或地址非法。

    - **原因：** 重复释放（Double free）、释放未分配的堆地址、用 `free()` 释放 `new` 分配的内存（API 不匹配）。

### 2.4 内存泄漏分类（Leak Summary）

程序退出时，Memcheck 会按以下四种状态汇总堆内存：

|**类型**|**说明**|**修复建议**|
|---|---|---|
|**Definitely lost**|内存已泄漏，且程序中没有任何指针指向该内存块。|必须修复。找到分配该内存的代码，补充 `free`/`delete`。|
|**Indirectly lost**|内存已泄漏，指向该内存的指针本身所在的内存块也泄漏了（如二叉树丢失了根节点，子节点即为间接丢失）。|优先修复 Definitely lost，此项通常会自动解决。|
|**Possibly lost**|仍有指针指向该内存块的内部（非起始地址）。可能是复杂的指针偏移，也可能是泄漏。|结合业务逻辑检查指针运算是否合法。|
|**Still reachable**|程序结束时内存未释放，但仍有全局或静态指针指向它。|操作系统在进程退出时会回收，通常可忽略，除非有严格的清理要求。|

## 3. 其他分析工具

通过更改 `--tool=<name>` 参数，可以调用 Valgrind 的其他专用工具。

### 3.1 Callgrind（函数调用与性能分析）

用于分析程序中各个函数的调用次数、执行时间占比及调用关系。

**执行命令：**

```bash
valgrind --tool=callgrind ./my_program
```

_执行结束后会生成 `callgrind.out.<PID>` 文件。_

**查看结果：**

使用可视化的 `kcachegrind`（Linux）或 `qcachegrind`（Windows/Mac）打开该文件，可直观查看火焰图和函数调用图。

### 3.2 Massif（堆内存占用分析）

用于分析程序运行期间堆内存的分配情况，生成内存占用峰值图。

**执行命令：**

```bash
valgrind --tool=massif --time-unit=B ./my_program
```

_执行结束后会生成 `massif.out.<PID>` 文件。_

**查看结果：**

使用命令行工具读取：

```bash
ms_print massif.out.<PID>
```

### 3.3 Helgrind（多线程并发检测）

用于检测 POSIX Pthreads 程序中的数据竞争（Data Race）、死锁和线程同步错误。

**执行命令：**

```bash
valgrind --tool=helgrind ./my_program
```

## 4. 忽略误报 (Suppressions)

第三方库（如 glibc、某些图形驱动）经常会引发 Valgrind 的误报。为避免干扰，可以使用 suppression 机制屏蔽特定的警告。

**生成 suppression 规则：**

执行时添加 `--gen-suppressions=all`，Valgrind 会在日志中输出拦截规则块。

**使用 suppression 文件：**

将需要的规则块复制到一个文本文件（如 `ignore.supp`），执行时引入：

```bash
valgrind --suppressions=ignore.supp ./my_program
```

## 5. 性能与局限性

- **性能损耗：** Memcheck 会使程序运行速度降低 10 倍到 50 倍，内存占用显著增加。Callgrind 和 Helgrind 同样会带来巨大的性能开销。

- **内存越界检测盲区：** 默认的 Memcheck 只能检测堆内存（Heap）**的越界。对于**栈内存（Stack）数组越界或全局变量越界，Memcheck 无法直接检测（需依赖 GCC 的 `-fsanitize=address`）。

- **平台支持：** 主要支持 Linux 环境。macOS 支持有限（对较新版本的 macOS 兼容性不佳），Windows 需要通过 WSL 运行。
