# NTFS ADS

> NTFS 交换数据流 (Alternate Data Streams, ADS)。

## 1. 概念

**核心概念**：

在 Windows 的 NTFS 文件系统中，一个“文件”并不仅仅是一堆数据，它实际上是一个**属性的集合**。

- 我们平时看到的文件内容，其实只是其中一个属性，叫做 **`$DATA`**（主数据流）。

- NTFS 允许一个文件拥有**多个** `$DATA` 属性。除了主数据流外，其他的 `$DATA` 属性就是**交换数据流 (ADS)**。

## 2. 功能来源

这个功能最初是为了**兼容性**而设计的。

- 早期的 Macintosh (Mac OS) 文件系统 (HFS) 使用“资源分支 (Resource Fork)”来存储图标、元数据等。

- 为了让 Windows NT 服务器能更好地存储和服务 Mac 文件，微软在 NTFS 中引入了 ADS 来模拟这种“双重数据”结构。

- 虽然现在很少用于 Mac 兼容，但这个特性被保留了下来，并被系统和恶意软件广泛利用。

## 3. ADS 的命名规则与语法

在 Windows 中，访问 ADS 的标准语法格式是：

$$
\text{文件名:流名称:流类型}
$$

- **文件名**：例如 `test.txt`。

- **流名称**：这是你给隐藏数据起的名字，例如 `hidden`。

- **流类型**：通常是 `$DATA`（表示数据），但在命令行中通常可以省略，系统默认就是 `$DATA`。

**示例**：

- `test.txt` -> 访问主数据流。

- `test.txt:secret.txt` -> 访问挂在 `test.txt` 背后的名为 `secret.txt` 的隐藏流。

## 4. 如何创建、读取和检测

直接打开 CMD。

### A. 创建 ADS (隐藏数据)

创建一个普通的文本文件，然后往它“背后”藏一段话。

```cmd
REM 1. 创建一个宿主文件
echo This is a normal file > host.txt

REM 2. 创建一个隐藏流 (把 secret data 写入 host.txt 的 hidden 流)
echo This is hidden data > host.txt:hidden.txt
```

此时，查看文件大小：

```cmd
dir host.txt
```

文件大小**完全没变**。这就是 ADS 最大的隐蔽性——它**不占用**宿主文件显示的逻辑大小（虽然它占用磁盘空间）。

### B. 读取 ADS

如果双击 `host.txt`，你只能看到 "This is a normal file"。

要看隐藏内容，必须指定流名称：

```cmd
notepad host.txt:hidden.txt
```

或者使用 PowerShell：

```powershell
Get-Content host.txt -Stream hidden.txt
```

### C. 检测 ADS

```cmd
dir /r
```

输出示例：

```text
2023/10/01  12:00                22 host.txt
                                 20 host.txt:hidden.txt:$DATA
```

## 5. 常见的应用场景

### A. 系统应用：Zone.Identifier (安全标记)

从互联网下载文件时，浏览器会在文件上加一个 ADS，名字叫 `Zone.Identifier`。

- **内容通常是**：

    ```text
    [ZoneTransfer]
    ZoneId=3
    ```

    `ZoneId=3` 代表“Internet区域”。

- **作用**：双击运行这个下载的程序时，Windows 检查到这个标记，就会弹出警告框：“此文件来自其他计算机，可能被阻止以帮助保护该计算机”。

### B. 恶意应用：隐藏 Webshell 或 恶意软件

黑客入侵服务器后，可能会利用 ADS 隐藏后门。

- **场景**：黑客把一个 PHP Webshell 写入到 `index.php:shell.php`。

- **隐蔽性**：管理员看 `index.php` 大小正常，内容也没变，很难发现异常。

- **利用**：在旧版 IIS 中，黑客可以通过特殊 URL 访问这个流并执行。

### C. CTF 考点 (Misc/Forensics)

- **隐写**：把 Flag 或关键图片藏在压缩包、图片或空文件的 ADS 里。

- **混淆**：利用 ADS 存储二进制数据，干扰常规的文件分析工具。

## 6. 重要特性与注意事项

1. **宿主依赖性**：ADS 必须依附于一个宿主文件（甚至可以是文件夹）。如果删除了 `host.txt`，它背后的 `hidden.txt` 也就随之消失了。

2. **文件系统敏感性**：**只有 NTFS 支持 ADS**。

    - 如果把带 ADS 的文件复制到 **FAT32** (如某些 U 盘) 或 **exFAT** 分区，**ADS 会直接丢失**，且系统通常会弹出警告：“文件属性 xxx 无法复制”。

    - 这在取证或解题时是大忌：不要通过不支持 ADS 的方式传输文件，否则证据/Flag 就没了。

3. **计算哈希**：对 `host.txt` 计算 MD5/SHA1 哈希值，**只计算主数据流**。也就是说，往文件里塞多少 ADS，它的哈希值都不会变。这也是病毒逃避哈希检测的一种手段。

## 7. 如何清除 ADS？

如果你发现文件被挂了奇怪的流（除了 `Zone.Identifier`），想要删除它：

**方法 1：复制到 FAT32 分区再复制回来**

这是最彻底的“清洗”方法。

**方法 2：使用 Sysinternals 工具 (Streams)**

微软官方提供的工具 `streams.exe`。

```cmd
streams -d filename.txt
```

这会删除该文件所有的 ADS。

**方法 3：PowerShell 删除**

```powershell
Remove-Item -Path host.txt -Stream hidden.txt
```
