> 很多网站为减少服务器端压力，在后台方面减少验证，只在 Web 前端用 JavaScript 进行验证，大大增加安全隐患。渗透测试中，常通过 HTTP 请求的截取来发现一些隐秘的漏洞，如绕过 JS 验证、发现隐藏标签内容等。

# 1. Burp Suite Proxy 初体验

> Burp Suite 是用于 Web 应用安全测试工具的集成平台，为许多包含的工具设计了接口。所有工具共享一个能处理并显示 HTTP 消息、持久性、认证、代理、日志、警报的一个强大的可扩展的框架。

Burp Suite 功能预览

| **工具**        | **说明**                                                           |
| ------------- | ---------------------------------------------------------------- |
| **Proxy**     | 一个拦截 HTTP/S 的代理服务器，作为一个在浏览器和目标应用程序之间的中间人，允许拦截、查看、修改在两个方向上的原始数据包。 |
| **Spider**    | 一个应用智能感应的网络爬虫，它能完整地枚举应用程序的内容和功能。                                 |
| **Scanner**   | 是一个高级工具，执行后，它能自动发现 Web 应用程序的安全漏洞。                                |
| **Intruder**  | 是一个定制的高度可配置的工具，对 Web 应用程序进行自动化攻击，如：枚举标识符、表单破解和信息搜集。              |
| **Repeater**  | 是一个靠手动操作来补发单独的 HTTP 请求，并分析应用程序响应的工具。                             |
| **Sequencer** | 是一个用来分析那些不可预知的应用程序会话令牌和重要数据项的随机性的工具。                             |
| **Decoder**   | 是一个极为方便的解码/编码工具。                                                 |
| **Comparer**  | 是一个实用的工具，通常是通过一些相关的请求和响应得到两项数据的一个可视化的“差异”。                       |

以下进行一次实际的绕过 JavaScript 验证用户输入。

## 1.1 配置网络代理

- 选择 “Proxy”选项卡，在 Proxy settings 选项卡中有三个按钮 Add、Edit、Remove。单击“Add”按钮，在 “Bind to port” 框中输入端口号 xxxx，注意输入的端口是未开启状态。

- 在 “Bind to address” 单选框中三个选项中选择“Loopback only"

	- Loopback only（仅回环），只有这台电脑上的浏览器能把流量发给 Burp，适合调试本机上的网页应用，安全性最高，完全隔绝外部网络的访问；

	- All interfaces（所有接口），绑定到电脑当前所有网卡（Wi-Fi、有线、虚拟网卡等）的 IP 地址，只要在同一个局域网，别人设置代理指向你的 IP 就能连接，适用于需要拦截手机 App 流量，或在渗透测试中拦截另一台虚拟机/物理机的流量，安全性较低；

	- Specific address（特定地址），指定绑定到电脑某一个特定的 IP 地址（如局域网固定 IP `192.168.1.10`），只允许特定网络段的流量进入，适用于电脑有多个网卡（比如同时连着内网和外网），只想监听特定网络流向的请求，安全性中等。

- 配置浏览器代理设置，手动配置代理为本地回环地址的响应端口。

## 1.2 查看拦截信息

- 发起目标 HTTP 请求，Burp 会拦截 HTTP 请求，浏览器处于阻塞状态。

- Intercept 模块中
	- Intercept on/off 用于控制拦截开关
	- Forward 跳转到下一步，单机后服务器接收到浏览器发送的请求
	- Drop 放弃本次请求

- HTTP history 模块显示拦截的历史记录，包括 Request 和 Response 信息
	- Burp Suite 默认只开启 Request 拦截，如果要拦截特定 Request 对应的 Response，可以在拦截到的 Request 信息处右键 -> Do intercept -> Response to this request；
	- 全局拦截 Response 可以在 Proxy Settings 中设置。

## 1.3 拦截输入信息，并进行修改

先输入正规字符通过前端 JS 检测提交。Burp 拦截到请求后，修改该 POST 请求的请求正文为 JS 规定的非法内容，再单击 Forward 向服务器发送请求。

- 比如把请求正文的内容修改为 `<script>...</script>` 如果用户输入直接放入 HTML 中，就会造成 XSS 漏洞。

> 在 Burp suite 中直接点击 `Open browser`，Burpsuite 会直接对这个浏览器中的请求开启代理，更加方便。

- 前端 JavaScript 验证是为了防止用户输入错误，服务器端验证是为了防止恶意攻击。

---

## 2. Fiddler

> Fiddler 是一优秀的 Web 调试工具，可以记录所有浏览器与服务器之间的通信信息（HTTP 和 HTTPS），并且允许设置断点、修改输入/输出数据。在 Web 开发和渗透测试中，都有很大作用。

https://www.telerik.com/download/fiddler

## 2.1 拦截 HTTP(S) 请求

> Burp 默认“拦截”所有请求（点 Forward 才会走），而 Fiddler 默认“放行”所有请求（只记录日志）。

> Fiddler 启动即自动设置系统代理，关闭自动还原

- 开启 HTTPS 解密：菜单栏 Tools -> Options -> HTTPS -> 勾选 Capture HTTPS CONNECTs 和 Decrypt HTTPS traffic -> 弹窗询问是否信任 Fiddler 生成的根证书，选择“Yes”/“是”，并将证书安装到系统信任区 -> 重启 Fiddler

拦截请求（打断点）：

### A. 全局拦截（类似 Burp 的 Intercept on）

- 点击菜单栏 **Rules -> Automatic Breakpoints**。

- 选择 **Before Requests**（在请求发送给服务器前拦截）。

- 此时，发出的任何请求都会在左侧列表中显示为一个红色 `T` 图标，表示“暂停中”。

### B. 精准拦截

比 Burp 的过滤更快捷。使用左下角的 **QuickExec** 命令行（黑色小长条输入框）：

- **拦截特定网站的请求：** 输入 `bpu www.example.com` 然后回车。

    - _效果：_ 只有发往 `www.example.com` 的请求会被拦截，其他网站（如百度、谷歌）正常通过。

    - _取消：_ 再次输入 `bpu`（不带参数）并回车。

- **拦截特定网站的响应：** 输入 `bpafter www.example.com`。

    - _效果：_ 请求会发出去，但服务器回包时会被拦截，方便你修改 Response。

	- 取消： 再次输入 `bpafter` （不带参数）并回车。

- 点击拦截到的条目，在右侧 **Inspectors** 修改数据，然后点击 **Run to Completion**（放行）或 **Break on Response**（拦截响应）。

- Inspectors 中可以切换多种查看方式。

- 修改 Headers 可以在 ”Headers“ 模块中鼠标右键请求头单击 -> Edit Header

- 表单信息可以选择 WebForms 模块，对 Name 或  Value 进行修改。

- 修改响应同理，注意设置好过滤信息方便找到响应信息。

## 2.2 Fiddler 功能简介

![[Pasted image 20260202122300.png]]

- 监控进程类型主要分为：所有类型、Web 浏览器、非浏览器。“Hide All”隐藏所有。对特定进程监控可以通过任务栏 “Any process" 选择指定的进程。

- QuickExec 命令行工具允许输入命令进行操作，如：
	- cls，清除会话列表；
	- select，选择会话；
	- bpu，拦截 Request；
	- bpafter，拦截 Response；
	- help，打开官网查看命令帮助页面。

## 2.3 过滤器

Filters 选项卡

## 2.4 编码/解码器

单击菜单栏 TextWizard 启动编码器。

目前 Fiddler 支持的编码和解码种类有： Base64、URL、JS、HTML、UTF-7、默认的 SAML 编码。

## 2.5 请求构建器

菜单栏”Composer“，可以针对单个 URL 的会话进行分析。在会话列表中选中指定的 URL 会话，拖进 ”Composer“ 模块内，编辑器会自动分析请求并填写到输入框中。

单击 Execute 发送请求，发送后 Fiddler 会继续记录本次会话。如果需要查看会话的详细信息，只需双击会话进入 Inspectors 模块查看。

### A. Parsed 模式（图形化拼接）

- **Method：** 下拉选择请求方法（GET, POST, PUT 等）。

- **URL：** 输入目标地址。

- **HTTP Version：** 选择协议版本（通常是 HTTP/1.1）。

- **Request Headers：** 手动输入头信息（如 `Cookie`, `User-Agent`）。

- **Request Body：** 如果是 POST 请求，在这里输入传输的数据（如表单内容 `username=admin` 或 JSON）。

### B. Raw 模式（原始文本）

- 一个空白的文本框，在这里直接书写纯文本的 HTTP 请求包。

- 可以完全控制每一个字节，比如故意构造畸形的 HTTP 头来测试服务器的容错性，这在 Parsed 模式下可能被自动纠正。

### 使用场景/方法：

- API 接口测试（越权漏洞/IDOR）：

    - 把一个正常用户的请求拖入 Composer。

    - 修改请求体中的 `user_id`，点击 Execute。

    - 观察右侧返回结果，看是否获取了其他用户的数据。

- **SQL 注入测试：**

    - 拖入登录请求。

    - 在 Body 的 `username` 字段后手动添加 `' OR 1=1 --`。

    - 发送并观察响应。

- **文件上传绕过：**

    - 在 Raw 模式下，精细修改 `Content-Type` 或文件内容的二进制数据，试图绕过服务器的文件类型检查。

## 2.6 插件支持

https://www.telerik.com/fiddler/add-ons

- Intruder 21 -- 针对 Web 应用程序的 Fuzzing 工具。与 Burp 的 Intruder 模块类似。
	- Fuzzing 工具：，模糊测试工具，一种自动化安全测试技术，通过向 Web 应用程序输入大量非预期、随机或半随机的数据（模糊数据），检测目标系统的异常行为（如错误响应、崩溃、安全漏洞等），从而发现潜在的安全缺陷。
	- ["intruder21" - a web application fuzzing tool [Fiddler2 Extension] by yamagata21](http://yamagata.int21h.jp/tool/intruder21/)
- x5s -- 快速发现跨站脚本漏洞，主要目标是找出最可能出现跨站脚本的地点。
- Ammonite -- 一款 Web 应用程序的安全扫描插件，可以有效检测 SQL 注入、OS 命令行注入、本地文件包含、缓冲区溢出和 XSS 漏洞。
