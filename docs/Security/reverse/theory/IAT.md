# IAT

> 导入表（Import Table）及导入地址表（Import Address Table, 简称 **IAT**）是 PE（Portable Executable）文件格式中最关键的结构之一。

## 一、 核心概念与作用

**1. 动态链接机制**

Windows 操作系统广泛使用动态链接库（DLL）。许多基础功能（如文件操作 `ReadFile`、弹窗 `MessageBoxA`）并不直接编译进目标可执行文件中，而是存放在 `kernel32.dll`、`user32.dll` 等系统文件中。可执行文件在运行时，需要一种机制来定位并调用这些外部函数。

**2. 为什么需要 IAT？**

由于操作系统的版本差异以及 ASLR（地址空间布局随机化）机制，DLL 每次加载到内存中的基址（Base Address）是不固定的。因此，编译器无法在编译时将外部函数的绝对内存地址硬编码到程序中。

**IAT 的本质**：它是一个函数指针数组。程序调用外部 API 时，实际上是去查询这个表格，获取该 API 在当前内存中的真实绝对地址，然后再进行跳转（Call）。

---

## 二、 关键数据结构与“双桥”模型

在 PE 结构中，导入表的核心信息位于可选头（Optional Header）的数据目录（Data Directory）的第二项。理解 IAT，必须掌握以下三个核心结构（定义于 `<winnt.h>`）：

### 1. IMAGE_IMPORT_DESCRIPTOR (IID)

这是导入表的目录项。程序每依赖一个外部 DLL，就会生成一个 IID 结构体。多个 IID 组成一个以全 0 结尾的数组。

**核心字段：**

- `OriginalFirstThunk`：指向 **导入名称表（INT, Import Name Table）** 的相对虚拟地址（RVA）。

- `Name`：指向当前依赖的 DLL 名称字符串（如 "USER32.dll"）的 RVA。

- `FirstThunk`：指向 **导入地址表（IAT, Import Address Table）** 的 RVA。

### 2. “双桥”结构：INT 与 IAT

这是导入表最精妙的设计，通常被称为“双桥结构”。

- **在磁盘文件中（静态）**：`OriginalFirstThunk` (INT) 和 `FirstThunk` (IAT) 是完全平行的两个指针数组。它们指向相同的数据结构——`IMAGE_IMPORT_BY_NAME`。此时，IAT 中存放的**不是**函数地址，而是指向函数名字符串的 RVA。

- **在内存中（动态加载后）**：当操作系统装载 PE 文件时，装载器（PE Loader）会遍历 INT 找到需要的函数名，利用类似 `GetProcAddress` 的机制获取该函数在当前内存中的真实地址，并**将这个真实地址覆写到 IAT (`FirstThunk`) 对应的位置**。

- **结论**：装载完成后，INT 依然指向函数名，而 IAT 则被替换成了真正的函数内存地址。

### 3. IMAGE_IMPORT_BY_NAME

当按名称导入函数时，INT（以及装载前的 IAT）指向的就是这个结构。

- `Hint`：函数的导出序号（供系统快速查找，有时可能为空或不准确）。

- `Name`：以空字符 `\0` 结尾的 ASCII 函数名字符串（例如 "MessageBoxA"）。

---

## 三、 操作系统装载 IAT 的全过程

当双击运行一个 PE 文件时，操作系统的装载器完成 IAT 初始化的标准流程如下：

1. 读取 PE 头部，定位到数据目录表，找到导入表（Import Table）的起始 RVA。

2. 遍历 `IMAGE_IMPORT_DESCRIPTOR` 数组。对于每一个 IID（即每一个 DLL）：

    - 读取 `Name` 字段，调用 `LoadLibrary` 将该 DLL 映射到当前进程的虚拟内存中。

3. 通过 `OriginalFirstThunk` 遍历 INT 数组，获取每一个要导入的函数名或序号。

4. 根据函数名或序号，在已加载的 DLL 导出表中查找，获取该函数的真实内存绝对地址。

5. 将获取到的真实地址，按顺序填入 `FirstThunk` (IAT) 对应的内存槽位中。

6. 循环执行，直到所有 DLL 的所有函数地址均被正确解析并填入 IAT。

---

## 四、 逆向工程与 CTF 中的 IAT 应用场景

在 CTF 逆向题目或恶意软件分析中，IAT 通常是攻防博弈的焦点：

### 1. IAT Hooking（导入表劫持）

恶意代码或安全软件为了监控程序的 API 调用，会直接修改内存中的 IAT。

- **原理**：将 IAT 中某个 API（如 `WriteFile`）的真实地址替换为攻击者自定义函数的地址。

- **效果**：当程序尝试调用 `WriteFile` 时，会先跳转到攻击者的代码，执行完记录或拦截逻辑后，再由攻击者决定是否跳回真实的 `WriteFile`。

### 2. 壳与 IAT 重建 (IAT Reconstruction)

加壳程序为了保护原始代码，在打包时会**彻底破坏或清空**原始的导入表。

- **加壳后的行为**：壳代码在运行时，会自己实现一套类似操作系统装载器的逻辑，调用 `LoadLibrary` 和 `GetProcAddress` 动态获取 API 地址，并申请一块新的内存空间来模拟 IAT。

- **脱壳者的任务**：在使用调试器找到 OEP（原始入口点）并 Dump 出内存镜像后，此时 Dump 文件的 IAT 是被破坏的（或者是指向壳代码分配的随机内存）。必须使用 **Scylla** 或 **ImportREC** 等工具，根据内存中现存的有效指针，反向推导出引入的函数名，并生成一个新的、结构完好的 PE 导入表写入修复后的文件中。

---

> ELF 同样需要解决动态链接的问题（即调用 `libc.so` 等外部共享库中的函数）。为了实现与 PE 文件中 IAT 相同的目标，ELF 采用了一套名为 **PLT（过程链接表）** 和 **GOT（全局偏移表）** 的机制。

## 一、 核心概念对标：PE vs ELF

在宏观作用上，可以将 ELF 的机制与 PE 的机制进行如下粗略对标，以辅助理解：

- **ELF 的 GOT 表（Global Offset Table）** $\approx$ **PE 的 IAT（Import Address Table）**：两者最终都在内存中存放着外部函数的真实绝对地址。

- **ELF 的 PLT 表（Procedure Linkage Table）**：存放着用于跳转到 GOT 表的一小段存根（Stub）代码。由于 ELF 默认采用延迟绑定策略，PLT 承担了调度动态链接器的重任。

## 二、 关键数据结构解析

### 1. GOT (全局偏移表, Global Offset Table)

- **位置**：存在于数据段（`.got` 和 `.got.plt` 区段），通常是**可读可写**的（除非开启了 Full RELRO 保护）。

- **作用**：这是一个指针数组。程序运行起来后，这里最终会被填入外部函数（如 `printf`、`system`）在当前内存中的真实绝对地址。

### 2. PLT (过程链接表, Procedure Linkage Table)

- **位置**：存在于代码段（`.plt` 区段），是**可读可执行**的。

- **作用**：当程序在代码中调用一个外部函数时（例如 `call printf`），实际上并没有直接跳到 `printf` 的真实地址，而是先跳到了 PLT 表中对应的条目（例如 `printf@plt`）。

## 三、 核心机制：延迟绑定（Lazy Binding）

这是 ELF 与 PE（默认情况下）最大的不同点。PE 装载器在程序启动时，会把 IAT 全部解析并填满；而 ELF 为了加快程序的启动速度，默认采用**延迟绑定**：**只有当外部函数第一次被调用时，才会去解析它的真实地址。**

**完整的调用流转过程（以第一次调用 `puts` 为例）：**

1. **发起调用**：主程序执行 `call puts@plt`，跳转到 PLT 表中 `puts` 对应的代码块。

2. **PLT 跳转 GOT**：PLT 里的第一条指令通常是 `jmp QWORD PTR [puts@got.plt]`，即跳转到 GOT 表中存放的地址。

3. **GOT 的初始状态（关键点）**：由于是第一次调用，真实地址尚未解析。此时 GOT 表里存放的指针，**指向的是 PLT 表中紧接着刚才那条 `jmp` 指令的下一条指令**。

4. **回跳至 PLT 并压参**：程序又跳回了 PLT 表，执行后续指令（通常是 `push` 一个该函数在重定位表中的索引号）。

5. **调用动态链接器**：跳到 PLT 表的头部（`PLT[0]`），最终调用系统的动态链接器解析函数（如 `_dl_runtime_resolve`）。

6. **解析与覆写**：动态链接器根据传入的索引号，在共享库中找到 `puts` 的真实内存地址，并**将这个真实地址覆写到 `puts@got.plt` 中**。随后，调用该真实地址，完成本次函数执行。

**第二次及以后的调用：**

- 执行 `call puts@plt` -> 执行 PLT 里的 `jmp QWORD PTR [puts@got.plt]`。

- 由于 GOT 表中的地址在第一次调用时已经被替换成了 `puts` 的真实地址，程序将**直接跳转到真实的 `puts` 函数执行**，不再经过动态链接器。

---

## 四、 在 CTF 中的实战应用

### 1. Pwn：GOT 表劫持（GOT Hijacking）

由于 `.got.plt` 区段在默认情况下是**可写**的，攻击者可以利用任意地址写漏洞（如格式化字符串漏洞、UAF 等）：

- **攻击手法**：将 GOT 表中某个常用函数（例如 `puts` 或 `printf`）的指针，覆写为 `system` 函数的地址或 One Gadget（一键 getshell 的地址）。

- **效果**：当程序后续正常调用 `puts("/bin/sh")` 时，实际上执行的是 `system("/bin/sh")`，从而直接获取系统 Shell。

### 2. Pwn：Ret2dlresolve（高级利用）

当程序没有提供可以泄露 libc 基址的输出函数，且开启了 ASLR 时，攻击者可以通过伪造动态链接器 `_dl_runtime_resolve` 所需的数据结构（如符号表、字符串表），强迫链接器解析出任意恶意函数的地址并执行。

### 3. 安全防护机制：RELRO (Relocation Read-Only)

为了防御 GOT 表劫持，现代 Linux 引入了 RELRO 保护编译选项：

- **Partial RELRO（部分保护，常见默认状态）**：GOT 表依然可写，依然可以使用 GOT 表劫持。

- **Full RELRO（全保护）**：程序在启动时，强制取消延迟绑定，**在装载阶段一次性解析所有外部函数地址并填入 GOT 表，随后将整个 GOT 表所在内存页设置为只读（Read-Only）。** 此时，任何尝试覆盖 GOT 表的攻击都会导致程序崩溃（Segmentation Fault）。
