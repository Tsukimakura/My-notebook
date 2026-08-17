## 一、 核心逻辑与界面基础

Wireshark 的核心工作流是：**捕获流量 -> 剔除噪音 -> 定位特征 -> 提取数据**。

主界面分为三个高频交互区：

- **Packet List（数据包列表）：** 纵览全局。每行代表一个包，高亮颜色提示了不同的协议和状态（如黑色通常代表 TCP 重传或错误包）。
    
- **Packet Details（协议树）：** 庖丁解牛。遵循 OSI 七层模型，从 Frame（物理层）到 Ethernet（链路层）到 IP（网络层）再到 TCP/UDP（传输层）及应用层协议，逐层解析。
    
- **Packet Bytes（字节视图）：** 底层真相。左侧为十六进制代码，右侧为 ASCII 码。CTF 中经常需要直接在此处观察文件头（Magic Number）或明文 Flag。
    

## 二、 过滤器：捕获 vs 显示

这是新手最容易混淆的概念。Wireshark 存在两套完全独立的过滤引擎，语法**互不通用**。

### 1. 捕获过滤器 (Capture Filters)

**作用在抓包引擎 (WinPcap/Npcap) 上，决定哪些包能进入内存。** 一旦丢弃，无法找回。语法基于 BPF (Berkeley Packet Filter)。

- **语法核心：** 使用 `host`, `port`, `net`, `src`, `dst` 配合 `and`, `or`, `not`。
    
- **常用速查：**
    
    - 只抓特定 IP：`host 192.168.1.1`
        
    - 只抓特定网段：`net 192.168.1.0/24`
        
    - 抓取 HTTP/HTTPS：`port 80 or port 443`
        
    - 排除 SSH 干扰：`not port 22`
        

### 2. 显示过滤器 (Display Filters)

**作用在已经捕获或打开的数据包上，仅仅是视图层面的隐藏。** CTF 流量分析 99% 都在使用这个过滤器。

**常用逻辑运算符：**

|**含义**|**符号 / 英文**|**示例**|
|---|---|---|
|等于|`==` 或 `eq`|`tcp.port == 80`|
|不等于|`!=` 或 `ne`|`ip.src != 10.0.0.1`|
|包含|`contains`|`http contains "flag"`|
|正则匹配|`matches`|`http.host matches "\.com$"`|
|逻辑与|`&&` 或 `and`|`tcp.port == 80 && ip.src == 192.168.1.1`|
|逻辑或|`||

**高频显示过滤语句 (Cheat Sheet)：**

- **MAC/IP/端口层过滤：**
    
    - `eth.addr == 00:11:22:33:44:55` (过滤 MAC 地址)
        
    - `ip.addr == 192.168.1.1` (无论源或目的)
        
    - `tcp.port in {80 443 8080}` (多端口集合过滤)
        
- **TCP 状态过滤：**
    
    - `tcp.flags.syn == 1 && tcp.flags.ack == 0` (寻找 TCP 握手的第一步)
        
    - `tcp.analysis.retransmission` (寻找网络拥塞或攻击导致的重传)
        
- **HTTP 协议过滤：**
    
    - `http.request.method == "POST"` (寻找表单提交、文件上传)
        
    - `http.response.code == 200` (寻找成功的响应)
        
    - `http.file_data contains "password"` (在 HTTP 响应体中搜关键词)
        

## 三、 分析与追踪利器

不要逐个看包，善用统计面板和宏观分析工具。

### 1. 统计面板 (Statistics)

- **协议分级 (Protocol Hierarchy)：** 拿到未知 pcap 的第一步。快速评估流量构成，如果突然出现大量的 `Data` 或非常见协议，往往是突破口。
    
- **端点 / 对话 (Endpoints / Conversations)：** 查看谁和谁通信最密集。按 `Bytes` 或 `Packets` 排序，排第一的往往是核心业务流或攻击流。
    
- **I/O 图表 (I/O Graphs)：** 按时间线绘制流量趋势。在应对 DDoS 流量分析或具有时间规律的信道隐蔽传输题型时非常直观。
    

### 2. 追踪数据流 (Follow Stream)

将零散的包重组成连续的对话流。

- **TCP/UDP Stream：** 还原裸 Socket 通信，常用于木马远控流量、自定义协议。
    
- **HTTP Stream：** 自动处理 HTTP 的 Chunked 编码和 Gzip 压缩，直接呈现人类可读的网页请求与响应。
    
- **TLS Stream：** 如果配置了密钥（见下文），可以解密并查看 HTTPS 流量。
    

## 四、 CTF 实战技巧与隐蔽流量提取

在 CTF Misc 和 Web 方向中，通常需要从流量里提取关键数据。

### 1. 文件提取

- **自动化提取：** `File` -> `Export Objects` -> 选择 `HTTP / SMB / FTP`。这是提取被下载的压缩包、图片、甚至可执行文件（ELF/PE）最快的方法。
    
- **手动提取 (Raw 导出)：** 追踪 TCP 流后，将底部显示格式切换为 `Raw`，点击 `Save as`。注意：如果是 HTTP 传输的文件，需手动用 16 进制编辑器（如 010 Editor）剔除头部的 HTTP 响应头，保留文件本身的 Magic Number。
    

### 2. TLS/HTTPS 流量解密

遇到全加密的 TLS 流量，直接看毫无意义。如果题目给定了私钥或密钥日志：

- **导入 SSLKEYLOGFILE：** `Edit` -> `Preferences` -> `Protocols` -> `TLS` -> 在 `(Pre)-Master-Secret log filename` 导入 `.txt` 密钥文件。
    
- **导入 RSA 私钥：** 同上路径，在 `RSA keys list` 导入 `.pem` 或 `.key` 文件，填入对应的 IP 和端口（通常是 443）。
    

### 3. 常见异常协议隧道分析

- **DNS 盲注/隧道：** 攻击者将数据分块编码在 DNS 查询的子域名中。
    
    - _特征：_ 大量的 TXT 或 A 记录查询，域名极长且杂乱无章。
        
    - _操作：_ 使用 `dns.qry.name` 或配合 `tshark` 命令行提取所有查询域名，再用脚本拼接解码（Base64/Hex）。
        
- **ICMP (Ping) 隧道：** 数据隐藏在 ping 包的 Data 字段中。
    
    - _过滤：_ `icmp && data.len > 0`
        
    - _操作：_ 观察 `Packet Details` 中的 `Data` 字段，很多简单的木马会直接把明文指令放在这里。
        
- **USB 协议流量：** 将鼠标或键盘的操作抓取为 pcap。
    
    - _过滤：_ 键盘 `usb.capdata` 长度常为 8 字节；鼠标常为 4 字节。
        
    - _操作：_ 利用 `tshark` 将 `usb.capdata` 字段批量导出，写 Python 脚本映射键盘按键或绘制鼠标轨迹图。