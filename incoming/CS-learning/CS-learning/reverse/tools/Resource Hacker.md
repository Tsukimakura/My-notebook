### 一、 左侧目录 -- 解剖 PE 文件

读取了文件里的一张“清单”。

Windows 的可执行文件（.exe, .dll）遵循 **PE (Portable Executable)** 格式。在这个格式中，有一个专门的区域叫 **`.rsrc` 段 (Resource Section)**，用来存放图片、图标、文本、对话框等“非代码数据”。

这个 `.rsrc` 段在磁盘上的存储方式，是一个严格的 **三层树状结构**。Resource Hacker 只是把这个树状结构画出来了。

#### 1. 第一层：资源类型 (Type)

PE 标准定义了一套“标准资源类型编号”。Resource Hacker 读取这些编号，然后翻译成你看到的英文文件夹名：

- **`RT_ICON` (3)** $\rightarrow$ 显示为 **Icon** (图标)
    
- **`RT_DIALOG` (5)** $\rightarrow$ 显示为 **Dialog** (对话框)
    
- **`RT_STRING` (6)** $\rightarrow$ 显示为 **String Table** (字符串表)
    
- **`RT_GROUP_ICON` (14)** $\rightarrow$ 显示为 **Icon Group**
    
- **`RT_MANIFEST` (24)** $\rightarrow$ 显示为 **Manifest** (配置清单)
    

**结论：** 左侧的一级目录（Dialog, Icon 等），就是 PE 文件头里写死的“类型分类”。

#### 2. 第二层：资源 ID (Name/ID)

在每个类型文件夹下面，是具体的资源名称或 ID。

- 比如在 `Dialog` 文件夹下，可能会看到 `101`、`102` 或者 `"MAINWINDOW"`。
    
- 这些 ID 是程序员在写代码时定义的（通常在 `.rc` 资源脚本里）。
    

#### 3. 第三层：语言 (Language)

Windows 支持多语言。同一个对话框 ID 下，可能有一个 `1033 (English)` 和一个 `2052 (Chinese)`。程序运行时会根据系统语言自动加载对应的那一份。

---

### 二、 GUI 的开发逻辑

#### 1. 代码 (Code) vs 资源 (Resource)

在 Windows 开发中，**“逻辑”**和**“界面”**通常是分开存储的：

- **`.text` 段（代码）**：存放 C++ 编译后的汇编指令（比如 `if (a == b) ...`）。
    
- **`.rsrc` 段（资源）**：存放界面的“蓝图”。
    

#### 2. 什么是 Dialog（对话框）？

在 MFC 或 Win32 编程中，**Dialog** 是最常用的“容器”。

**关键点：** 按钮（Button）、编辑框（Edit Control）等控件，**必须** 依附于一个父窗口存在。在 CTF 的小程序中，这个父窗口通常就是 **Dialog**。
