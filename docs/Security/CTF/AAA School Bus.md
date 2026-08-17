# 1. welcome -- SQL-injection(web)

使用sqlmap获取数据库信息：
1. 获取当前数据库名称:
    	python3 sqlmap.py -u "http://...?id=1" --current-db
2. 列出指定数据库的所有表:
    	python3 sqlmap.py -u "http://...?id=1" -D your_database_name --tables
3. 列出指定表的所有列:
    	python3 sqlmap.py -u "http://...?id=1" -D your_database_name -T your_table_name --columns
4. 导出列数据:
	python3 sqlmap.py -u "http://...?id=1" -D your_database_name -T your_table_name -C your_column_name --dump

## 2. welcome -- EasyWeb(web)

- F12打开开发工具查看源码（Elements）（Ctrl + U查看HTML源代码）
- 检查网页备份文件 -- 直接访问尝试：在已知文件（如`index.php`）后添加`.bak`等后缀尝试访问下载
	适用条件：开发者手动创建或压缩工具生成，有时编辑器也会自动生成带`~`的备份
- 检测XSS注入点：`<script>alert("CTF")</script>`插入JS检查是否弹出警告框
	通过推断使用XSS跳转网页（曾以the2nd.php作为第二关，尝试
	`<script>window.location = "3rd.php"</script>`等）
- 看请求返回的header:
	1. F12→Network
	2. F5刷新
	3. 选择Name中第一个.php文件
	4. headers中找到Response Headers查看
	5. 按照提示跳转下一关
- 已知flag位置，但鼠标悬停时消失→判断为JS设置
	F1：Ctrl + Shift + P打开命令面板禁用JS(Disable JavaScript)

## 3. welcome -- QR Code(misc)

- 二维码三个回字形缺失，使用图片编辑补全后扫码获得flag
二维码最常见、最简单的修改：
1. **定位图案**：
    - **问题**：三个角落的“回”字形定位图案是否被破坏、遮挡或修改？
    - **解决**：用画图工具（如Photoshop, GIMP）将其修复成标准样式。这是二维码扫描器能够定位图像的关键。

2. **安静区**：
    - **问题**：二维码四周的空白区域（安静区）是否足够？是否被添加了边框、文字或图案？
    - **解决**：确保四周有至少4个模块宽度的空白区域。清除任何干扰项。

3. **颜色反转**：
    - **问题**：是否是反色的二维码（浅底深码）？
    - **解决**：用图片编辑工具进行颜色反转，或者直接用扫描APP的反色功能尝试。

4. **格式信息**：
    - **问题**：围绕定位图案的格式信息区域可能被破坏，导致扫描器无法识别纠错等级和掩码模式。
    - **解决**：使用专门的QR分析工具（如 [QRazyBox](https://merri.cx/qrazybox/)）来手动修复格式信息。你可以尝试所有可能的组合（8种掩码模式 x 4个纠错等级），直到能正确解码

## 4. welcome -- git leak(web)

1. 确认是否存在git leak：
    	访问 `http://target.com/.git/`，如果服务器返回403（Forbidden）而不是404（Not Found），则很有可能存在。返回403说明这个目录是存在的，只是目录列表被禁止了。如果返回404，则可能不存在。

    	更可靠的方法是使用工具扫描，或者尝试下载一个Git核心文件来确认：
    	`http://target.com/.git/HEAD`。这个文件通常存在且内容为 `ref: refs/heads/master`。如果能成功下载，则100%确认存在Git泄露。

2. 下载整个.git文件夹
    	- 尝试了**使用githacker**（一个python工具），但较新版本的Ubuntu系统禁止直接使用pip安装系统级的安装包（`pip install githacker`），以防止破坏系统依赖。**可以尝试使用python虚拟环境解决。**
    	- **使用GitHack**：从github上下载工具：[[commands#git clone|参见github笔记]]
    ```bash
    	# 下载工具
    	git clone https://github.com/lijiejie/GitHack.git
    	cd GitHack

    	# 使用
    	python3 GitHack.py http://target.com/.git/
    ```
3. 搜索下载的git仓库
	- 查看当前文件`cd` `ls`
	- 查看提交历史`git log`或更详细`git log --oneline --graph --all`
	- ......
 4. 根据文件找到flag，题中为一串MD5加密([[MD5 | 参见MD5笔记]])的内容，通过cmd5.com在线解密
 5. **继续学习**：运维的基本素养--怎么配置Apache或者Nginx防止出现git leak

## 5. welcome -- Scan(web)

1. 根据提示通过本地运行`ssh user@10.214.160.13 -p 10802 -D 10899 -N`，并输入密码来开启在本机 10899 端口的 SOCKS5 代理服务([[ssh| 什么是SSH]])([[SOCKS5 | 什么是SOCKS5]])（[[ssh | ssh命令基础用法]]）
    （[[端口（Port）| 什么是端口]])
2. 题目提示： 以下所有域名均应在 SOCSK5 代理后才可访问(可以使用 proxychains4 等工具)
    	注：由于ssh命令中 -N 只建立隧道，而不执行远程命令，接下来的命令需要再打开一个终端执行。

    	配置proxychains4 （使后续nmap、curl等可通过代理工作）：[[SOCKS5#Proxychains 配置 | 关于proxychains配置]]

    ```bash
    	# 创建并编辑配置文件
    	nano proxy.conf #或使用echo "" > proxy.conf等等效命令

    	# 配置文件内容
    	[ProxyList]
    	socks5 127.0.0.1 10899
    	# socks5指定代理协议类型为SOCKS5
    	# 127.0.0.1为本地回环地址（localhost），表示本机（本地代理开在自己电脑上）
    	# 10899是端口号，这是SSH命令中"-D 10899"指定的端口,即指定一个创建好的代理使用
    ```
3. 使用nmap 按照题目要求扫描zju.tools(192.168.192.3)在9000-11000范围内的SSH端口：[[proxychains4#基本使用方法 | proxychains4使用方法]] [[端口扫描与nmap]]
```bash
# 使用proxychains通过代理扫描
proxychains4 -f proxy.conf nmap -sT -p9000-11000 192.168.192.3 -vv
```
此时终端返回
`Note: Host seems down. If it is really up, but blocking our ping probes,try -Pn`
原因是nmap 默认会先发送 ping 请求来确认主机是否存活。但在这个网络环境中：
- 目标主机 `192.168.192.3` 可能配置为不响应 ping 请求
- 或者由于代理环境，ping 请求无法正常工作
- 但主机实际上是存活的
解决可使用 `-Pn` 参数告诉 nmap **跳过主机发现，直接扫描端口**，即
```bash
proxychains4 -f proxy.conf nmap -sT -Pn -p9000-11000 192.168.192.3 -vv
```
注：如果一种扫描方式失败可以尝试其它扫描方式重新扫描，如SYN扫描（`-sS`）在某些网络环境下可能被干扰
扫描结果：
- **`10822/tcp open unknown`**：发现一个开放的TCP端口 **10822**
- **状态**：`open`（端口开放且可访问）
- **服务**：`unknown`（nmap无法自动识别服务类型）
- **原因**：`syn-ack`（收到了SYN-ACK响应，这是端口开放的典型标志）
其它信息：
- **`2000 closed tcp ports`**：其他2000个端口都是关闭的
- **`conn-refused`**：连接被拒绝，这是端口关闭的明确信号
4. 根据题意访问` http://192.168.192.8:[part1扫描出来的端口号]`
    ```bash
    proxychains4 -f proxy.conf curl http://192.168.192.8:10822/
    ```
    得到part1的flag和part2入口（目录爆破）[[目录爆破（Directory Brute-forcing）]]
5. 使用DirBuster进行目录爆破
    	DirBuster使用**Java语言**编写,这类程序需要Java运行环境(JRE,Java Runtime Environment)才能执行。首先配置JRE（或JDK）
    		`sudo apt install default-jre -y`
    	在官网上下载相应文件后进入对应目录，运行
    		`java -jar ~/path/DirBuster.jar`
    		由于需要配置SOCKS5代理，实际运行
    		`proxychains4 -f proxy.conf java -jar ~/path/DirBuster.jar`
    		打开DirBuster GUI界面
    		①在Target URL指定执行目录爆破发URL
    		②设置Number Of Threads(线程数)，指同时执行的扫描任务的数量
    		线程数增加可加快扫描速度，但线程数过高会对目标服务器造成过大压力/大量占用本地CPU和网络资源/出发网站防护机制，导致IP被封锁。
    		速度与稳定性的平衡通常设置线程数为20~30
    		③按照题目要求选择相应字典
    		④根据题意爆破html文件--设置File extension为html
    		⑤start!(耐心等待~)
6. 对爆破出的隐藏文件逐一尝试找到flag并提交

## 6. ZJU School-Bus welcome -- apk01baby(reverse)

1. `file apk01_LeadroyaL.apk`确认文件类型
2. `apktool d your_app.apk -o output_dir`反编译资源文件和`classes.dex`
    	作用：解包APK，得到`smali`代码（Dalvik字节码的汇编语言）、`AndroidManifest.xml`（可读格式）、资源文件（`res`）和原生库（`lib`）。
3. 查看`AndroidManifest.xml`：重点关注入口Activity（`<action android:name="android.intent.action.MAIN" />`），说明应用启动时首先运行哪个界面。
4. `unzip -l your_app.apk`解压并检查基础结构
    	重点关注以下文件：
    	- `classes.dex`：包含Java/Kotlin代码编译后的Dalvik字节码。
    	- `lib/`：目录，包含针对不同CPU架构（armeabi-v7a, arm64-v8a, x86等）的本地库（`.so`文件）。**CTF题目经常把关键逻辑藏在原生层。**
    	- `resources.arsc`：编译后的资源文件。
        - `assets/`：目录，存放原始资源文件，可能藏有数据、配置文件甚至另一个可执行文件。
        - `META-INF/`：存放签名信息。
5. 反编译DEX文件获取Java代码
	- `smali`代码可读性差，需要更高级的反编译工具（Jadx）获取近似的Java源代码
	- `jadx-gui apk01_LeadroyaL.apk`

## 7. welcome -- Reverse1(reverse)

1. 外部探测
    	首先使用 **Detect It Easy (DIE)** 工具对文件进行扫描：
    	*   **文件格式**：PE32 (32位 Windows 可执行程序)。
    	*   **编译环境**：MinGW / GCC。
    	*   **加壳情况**：无壳 (No packer found)。

    	**结论**：由于没有加壳，且是标准的 C 语言编写，我们可以直接使用 **IDA Pro** 进行静态分析。
2. 静态分析
    	- IDA 的反编译功能（F5）可以将汇编转为伪代码。
    	- 定位主函数
    		打开 **IDA Pro** 载入文件。在左侧函数列表中搜索 `main` 并双击进入。空格键切换图形视图。
    		![[Pasted image 20260125072848.png]]
    	- 逻辑拆解
    		观察主函数的汇编流图，我们可以将逻辑分为三个阶段：
    	- 初始化目标数组
    		程序开头出现了一长串类似下面的代码：
    		```assembly
    		mov [esp+32h], 4Dh ; 'M'
    		mov [esp+33h], 4Dh ; 'M'
    		mov [esp+34h], 4Dh ; 'M'
    		...
    		```
    		这表示程序在**栈 (Stack)** 上开辟了一块空间，并存入了一组预设好的十六进制字节。这组数据就是经过加密后的“密文”。
    	- 获取用户输入
    		程序调用了 `_printf` 输出提示语 `"Please input flag: "`，随后调用 `_scanf` 接收用户的输入，并将其存入内存地址 `[esp+14h]`。
    	- 循环加密与对比
    		这是程序的判断逻辑：
    		- **循环控制**：通过 `cmp eax, 1Ah`（0x1Ah = 十进制 26）判断，说明 Flag 的长度是 **26** 位。
    		- **核心算法**：
    		    ```assembly
    		    movzx eax, byte ptr [eax]  ; 取出输入字符的第 i 位
    		    xor eax, 0Ch               ; 【关键】将该字符与 0x0C 进行异或运算
    		    ```
    		- **结果对比**：将异或后的结果与第一阶段存入栈中的“密文”逐位对比。
    		- **分支走向**：
    		    *   如果完全匹配，走向 `You are right!` 分支。
    		    *   如果不匹配，程序直接退出。
3. 算法还原
    - 异或 (XOR) 的特性
    	在本题中，加密公式为：`输入字符 ^ 0x0C = 密文`。
    	由于异或运算具有自反性（即 `A ^ B = C` 等同于 `C ^ B = A`），我们可以推导出：
    	**`Flag = 密文 ^ 0x0C`**。

    	- 提取密文数据
    	从汇编代码中依次提取出 `[esp+32h]` 到 `[esp+4Bh]` 的数值：
    	`4D, 4D, 4D, 77, 6A, 61, 75, 60, 53, 5D, 5D, 53, 7D, 79, 62, 53, 3F, 34, 3A, 3B, 35, 3A, 3C, 34, 3C, 71`
4. 编写脚本
	使用 Python 编写自动化解密脚本：

	```python
	# 提取自 IDA 汇编的密文数据
	cipher = [
	    0x4D, 0x4D, 0x4D, 0x77, 0x6A, 0x61, 0x75, 0x60,
	    0x53, 0x5D, 0x5D, 0x53, 0x7D, 0x79, 0x62, 0x53,
	    0x3F, 0x34, 0x3A, 0x3B, 0x35, 0x3A, 0x3C, 0x34,
	    0x3C, 0x71
	]

	# 汇编中发现的 Key
	key = 0x0C

	# 逆运算逻辑
	flag = ""
	for x in cipher:
	    flag += chr(x ^ key)

	print("得到的 Flag 为: " + flag)
	```

## 8. emoclew -- apk02 守望起来(reverse)

1. 准备阶段
    	*   **工具选择**：使用 **jadx-gui**，将 APK 反编译为 Java 源代码。
2. 第一步：定位入口点
    	安卓应用的逻辑通常从 `MainActivity`（主界面）开始。
    	*   在左侧文件树中找到包名（如本题中的 `leadroyal.aaa.com.apk02`）。
    		包名：包名是安卓应用的唯一标识符。全球数以百万计的应用，包名都不能重复。
    		- **命名规则**：通常采用“**反向域名**”格式（如 com.公司名.项目名）。
    	    - 其中 android.support、androidx 或 google 开头的通常是**系统库代码**，并非解题关键。
    	*   打开 `MainActivity`，这是分析的起点。
3. 第二步：代码逻辑分析
    	在 `MainActivity` 中，寻找与用户交互相关的代码（如按钮点击）。
    	![[Pasted image 20260125091726.png]]
    	(1) 触发逻辑
    	发现了一个按钮点击事件监听器：
    	```java
    	this.button.setOnClickListener(new View.OnClickListener() {
    	    public void onClick(View v) {
    	        String s = MainActivity.this.editText.getText().toString(); // 获取用户输入的字符串
    	        MainActivity.this.check(s); // 调用 check 函数验证输入
    	    }
    	});
    	```
    	- 密码验证的核心就在 `check(s)` 函数里。
    	(2) 深入 `check(String s)` 函数
    	![[Pasted image 20260125092009.png]]
    	分析 `check` 函数的代码：
    	1. **长度检查**：`if (len % 2 != 0)`。说明输入的密码长度必须是**偶数**。
    	2. **核心循环**：
    	    ```java
    	    for (int i = 0; i < len; i += 2) {
    	        int tp = Integer.parseInt(s.substring(i, i + 2)); // 每2位数字取出来，转成整数 tp
    	        result = result + this.a[tp]; // 以 tp 为下标，去数组 a 中找字符，拼接到 result 中
    	    }
    	    ```
    	3. **判断标准**：
    	    ```java
    	    if (result.equals("鎏金哇卡呀库列")) { // 如果拼出来的字符串等于这句话
    	        // 提示 Correct! 并播放 win 的音效
    	    }
    	    ```
    	**结论**：这是一个**查表加密**。我们需要找到“鎏、金、哇、卡、呀、库、列”这 7 个字在数组 `a` 中的位置（下标）。
4. 第三步：寻找线索（Unicode 与 数组）
    	在 `MainActivity` 的开头，我们找到了定义的数组 `char[] a`：
    	`char[] a = {22269, 27668, 20256, 24517, ... 37775, ... 37329, ...};`
    	这些数字是字符的 **Unicode 编码**。
5. 第四步：推导答案
	现在，我们在数组 `a` 中逐个计数，寻找这些编码出现的**下标位置**（从 0 开始计）：

	1. 找到 `37775` (鎏)：位于数组第 **12** 个位置。
	2. 找到 `37329` (金)：位于数组第 **34** 个位置。
	3. 找到 `21703` (哇)：位于数组第 **53** 个位置。
	4. 找到 `21345` (卡)：位于数组第 **86** 个位置。
	5. 找到 `21568` (呀)：位于数组第 **79** 个位置。
	6. 找到 `24211` (库)：位于数组第 **60** 个位置。
	7. 找到 `21015` (列)：位于数组第 **80** 个位置。

	因为代码是 `substring(i, i + 2)` 取两位，所以我们将这些下标按顺序拼接：
	`12` + `34` + `53` + `86` + `79` + `60` + `80` = **`12345386796080`**

## 9. welcome -- Simple RSA (crypto)

Hint: Textbook RSA，信息没有任何 padding！

已知密文 c、模数 n、公钥 e

```python
import gmpy2
from Crypto.Util.number import long_to_bytes

# 1. 填入题目中的数据

# 密文
c = 431396049519259356426983102577521801906916650819409770125821662319298730692378063287943809162107163618549043548748362517694341497565980142708852098826686158246523270988062866178454564393347346790109724455155942667492571325721344535616869

# 模数
n = 0x6270470b5e45bb464233683c38eeb03d17d54e0127038c9d286b00ac54946cfa1aa05c33610ec439c449b31f705c9e470ab6443cd090f9d88fab68f016c41bc00b9a1def40e77d836252ff03db2a525742e49b824d375216370d1cd810a60e2eac1824f306205c144b54c5f010ae17c8c88e76d1b41f13313cbd7e1b37822a0d

# 公钥
e = 3

# 2. 直接对 c 开三次方根
# iroot(x, n) 返回 (结果, 是否完全开方成功)
m, exact = gmpy2.iroot(c, e)

if exact:
    print("开方成功！")
    # 3. 将大整数转换为字节字符串 (Flag)
    print("Flag:", long_to_bytes(int(m)).decode())
else:
    # 如果直接开方不成功，尝试枚举 k
    print("尝试枚举 k...")
    for k in range(1, 100000):
        m, exact = gmpy2.iroot(c + k * n, e)
        if exact:
            print(f"找到 k={k}")
            print("Flag:", long_to_bytes(int(m)).decode())
            break
```

- 低加密指数 $e=3$ ，正常情况下加密 $c=m^e (\mod n)$ 。如果 $m$ 不够大，$m^3$ 没有超过 $n$ ，取余就是多余的。即 $c=m^e$
- 那么解密就不需要 私钥指数 $d$ ，不用分解 $n$ （不需要 $p,q$ ），只需要直接进行逆运算 $m = \sqrt[3]{c}$ .

```python
m, exact = gmpy2.iroot(c, e)
```

- 利用 `gmpy2` 库的高精度数学功能，计算密文 $c$ 的 $e$ 次方根（这里 $e=3$）。

- **`iroot(x, n)` 的返回值**：它返回一个包含两个元素的“元组” `(root, boolean)`。

    - `m` (root)：计算出的整数方根（向下取整）。

    - `exact` (boolean)：这是一个布尔值（True/False）。如果 $c$ 能够被**完美开方**（即 $c$ 恰好是某个整数的 $e$ 次方，没有余数），它就是 `True`；否则是 `False`。

```python
long_to_bytes(int(m)).decode()
```

- **背景**：在 RSA 中，所有的文本（Flag）在加密前都被转换成了一个巨大的整数。现在算出了这个整数 $m$，需要把它变回人能读懂的字符串。

- **`long_to_bytes(int(m))`**：这是 `Crypto` 库的函数。它把大整数 $m$ 按照 16 进制切分，转换回字节串（Bytes）。例如，整数 `0x616263` 会被转成字节串 `b'abc'`。

- **`.decode()`**：将字节串（Bytes）解码为字符串（String），默认使用 UTF-8 编码。

```python
for k in range(1, 100000):
    m, exact = gmpy2.iroot(c + k * n, e)
```

- **背景**：如果第一步的 `if exact:` 没有通过，说明直接开方失败了。这意味着 $m^3$ 比 $n$ 大，发生了“取模”操作。

- **数学原理**：

    根据 RSA 公式：$m^e \equiv c \pmod n$

    这意味着 $m^e$ 实际上等于 $c$ 加上若干倍的 $n$。写成等式就是：

    $$
m^e = c + k \times n
    $$

- **代码逻辑**：

    - 因为 $e=3$ 很小，所以 $k$ 通常也不会很大。

    - 代码写了一个循环，让 $k$ 从 1 开始尝试（假设 $m^3$ 超过了 $n$ 一倍、两倍、三倍...）。

    - 每次循环都计算 $\sqrt[3]{c + k \times n}$。

    - **判断标准**：一旦某次计算发现 `exact` 为 `True`（能开尽方），说明我们猜对了 $k$ 值，此时算出的 $m$ 就是真正的明文！

## 10.  emoclew -- find me out (reverse)

1. 使用 DIE 检测题目文件 `find_me_out_update.o` ，发现是 ELF64 类型，有 UPX 壳。
2. `sudo apt install upx-ucl` `upx -d find_me_out_update.o` 利用官方工具脱壳。
3. IDA 打开脱壳的文件，`Shift + F12` 找到一个字符串 `Please input your flag: ` 双击跳转找到对应位置。
4. 跳转到 .rodata 段，通过交叉引用 (XREF) 找到使用它的 .text 段的函数，即处理输入的函数 `sub_404ADD` 。
5. 查看 `sub_404ADD` 函数汇编和伪代码，发现有 int3 反调试断点在输入 Flag 后；发现输入数据的内存地址 `unk_5B1680` （改名称 `User Input` 进行标记）；
6. 进一步分析函数 `sub_404ADD`
    	![[Pasted image 20260208000122.png]]
    	（图中笔误，v1 数组和输入都是32字节，不是32位，QWORD 64 位，DWORD 32 位）
    	v2 数组可能是加密算法的密钥，先命名为 `Key`，v1 数组就是加密后应该得到的密文。4 个 32位整数作为密钥，且通常用于加密 64位（8字节）的数据块，这非常符合 **TEA / XTEA / XXTEA** 系列算法的特征（64位数据块 + 128位密钥（4个32位整数））。
7. 分析加密函数 `sub_40490D`
    	![[Pasted image 20260208104726.png]]
    	判断是 XXTEA 加密，且 Delta 值就是常用的 `0x9E3779B9` 没有改变，即标准 XXTEA 加密。
8. 提取 Key（v2 数组）: `[0xDEAD, 0xBEEF, 0xABCD, 0x0001]` ，提取 Ciphertext（v1 数组）
9. 编写脚本解密
    	```python
    	import struct

    	def decrypt(v, k):
    	    n = len(v)
    	    delta = 0x9e3779b9
    	    # 轮数计算：52/n + 6
    	    rounds = 6 + 52 // n
    	    sum_val = (rounds * delta) & 0xffffffff

    	    y = v[0]
    	    for _ in range(rounds):
    	        e = (sum_val >> 2) & 3
    	        # 从后往前逆推
    	        for p in range(n - 1, 0, -1):
    	            z = v[p - 1]
    	            # MX 逻辑的逆运算
    	            mx = (((z >> 5 ^ y << 2) + (y >> 3 ^ z << 4)) ^ ((sum_val ^ y) + (k[(p ^ e) & 3] ^ z)))
    	            v[p] = (v[p] - mx) & 0xffffffff
    	            y = v[p]

    	        # 处理第一个元素
    	        z = v[n - 1]
    	        mx = (((z >> 5 ^ y << 2) + (y >> 3 ^ z << 4)) ^ ((sum_val ^ y) + (k[(0 ^ e) & 3] ^ z)))
    	        v[0] = (v[0] - mx) & 0xffffffff
    	        y = v[0]

    	        sum_val = (sum_val - delta) & 0xffffffff
    	    return v

    	# 1. 整理密文 (从 64 位拆分为 32 位 LE 格式)
    	# 原始 64 位：0xB65DC90D7BE6ABF3, 0x6AB542A95A162FC7, 0x377D273DDCAA804C, 0x44C0F3ECDE449E62
    	cipher_64 = [
    	    0xB65DC90D7BE6ABF3, 0x6AB542A95A162FC7,
    	    0x377D273DDCAA804C, 0x44C0F3ECDE449E62
    	]

    	v = []
    	for c in cipher_64:
    	    v.append(c & 0xffffffff)
    	    v.append(c >> 32)

    	# 2. 密钥
    	key = [0xDEAD, 0xBEEF, 0xABCD, 1]

    	# 3. 解密
    	res = decrypt(v, key)

    	# 4. 转换为字符串
    	flag = b""
    	for x in res:
    	    flag += struct.pack("<I", x)

    	print(f"解密结果: {flag.decode(errors='ignore')}")
    	```
    	得到一个假 Flag `ACTF{Thls_1s_@_F@ke_f1Ag_Hahaha}`
10. 由于真 Flag 的判定也会用到输入内容，找到输入缓冲区的内存地址（已标记 User_Input）查看交叉引用，找到除 `sub_50D3D0` 外的另一个函数 `sub_404BB4`
11. 进入 `sub_404BB4` 函数分析
    	![[Pasted image 20260208131404.png]]
12. 函数太多太复杂，静态分析困难，已知可能是置换密码一类，尝试动态调试。
13. 用 pwndbg 动态调试

	```bash
	gdb ./find_me_out_update.o
	r

	# 尝试输入 0123456789abcdefghijklmnopqrstuv 32位测试数据寻找乱序规律
	# 程序会停在 int3 断点 (0x404B13)

	# 通过修改 rip 强制跳转执行隐藏函数
	set $rip = 0x404BB4

	# 设置断点在调用 sub_40555E 函数的地址
	b *0x404D8D

	ni # 进入 sub_404BB4 函数
	c  # 继续运行知道断点
	ni # 单步执行断点处的 call 0x40555e

	# 查看寄存器 RDI 和 RSI，分别对应两个参数 密文 和 加密后的输入（根据x64 架构的函数调用约定）
	# *RDI  0x5c9690 ◂— '_8eF48211A73!1}NC03T3u_s_91{F47T'
	# *RSI  0x5c9730 ◂— 'lmhi21jkcdu950tag4368bvnopqrse7f'

	# 尝试按照输入反推还原正确的输入，发现是乱码
	# 已知 Flag 格式是 ACTF{...}，尝试输入 ACTF{abcdefghijklmnopqrstuvwxyz}（32位）
	# 发现 A C T F { }的位置都能对应，尝试按顺序还原括号内的内容成功得到 Flag
	# 再次尝试发现只要前缀 ACTF{ 正确即可。可能加密函数的逻辑具有格式依赖性或上下文依赖性
	# Keep the Format, Fuzz the Content.
	```

## 11.  emoclew -- what's in RAR（misc）

1. 虽然得到的是 `.zip` 文件，但 `file droste.zip` 发现文件类型是 RAR，修改后缀为 `.rar`
2. 解压发现需要密码。已知是六位纯数字密码，在 `123456` 附近，纯手动爆破也不用太久得到密码 `123465` ，或者使用工具如下
3. 访问 John the Ripper 官网下载 Windows 的“Jumbo”版（社区增强版）
4. 在 John 工具的目录下的 `run` 目录 ，地址栏输入 CMD 在当前目录打开 CMD
5. `rar2john.exe .../droste.rar > hash.txt` 提取出 RAR 的 Hash 值（加密指纹）
    	如果在 PowerShell 运行会有后续问题。
6. `john.exe --mask=?d?d?d?d?d?d hash.txt`
    	- `Error: UTF-16 BOM seen in input file.` 因为 PowerShell 的 `>` 重定向输出默认把文件保存成 UTF - 16 编码（带 BOM 头）而 John the Ripper 只认普通的 ANSI 或 UTF-8 (无 BOM) 编码。此时只需另存为并修改文件编码即可。
    	- 如果 droste.rar 不在当前文件夹下，即调用 rar2john.exe 的指令中含有一些路径，会带入 `hash.txt` 中 。如果含有 `C:` 等盘符带有冒号，会识别错误（误认 C 是文件名），把 `hash.txt` 中的路径删除只保留文件名即可，如 `droste.rar:$rar5$16$b88bf6af86a80d90ed93be9f8563888d$15$1ebb4c99d15a1e77053dbb72398da417$8$60e7fa02ac1fe26e`
7. 拿到密码解压成功后，得到一个图片文件和一个压缩包，压缩包解压后的结构也与此相同，发现是一个循环嵌套的结构（Droste 效应）。
8. 根据题目提示，查看隐藏流文件。在加压得到的文件夹目录中打开 CMD， `dir /r`
    	![[Pasted image 20260208161232.png]]
    	`Zone.Identifier:$DATA` 是 Windows 给下载文件加的安全标记（告诉系统“这文件来自互联网”），这是无关信息，可以忽略。

    	真正的目标是这个流：`droste.zip:droste.jpg:$DATA` (大小 6,409 字节)，发现是图片文件。

9. `mspaint droste.zip:droste.jpg` 尝试用画图打开，失败。（notepad 用记事本打开）
10. 尝试提取文件，输入 powershell 打开 powershell ，
	`Get-Content -Path droste.zip -Stream droste.jpg -Encoding Byte -ReadCount 0 | Set-Content -Path flag.jpg -Encoding Byte`
	成功提取出图片文件，直接查看图片中的 Flag。

## 12.  ACTF 2016 -- easy reversing（reverse）

1. 得到 PE32 无壳的 `.exe` 文件，直接进入 IDA 找到主函数恰好也是处理输入的函数分析：
    	![[Pasted image 20260209094654.png]]
    	以此类推，得到输入的 Flag 第一步交换的规律
2. 继续分析输入的后续处理和判断逻辑
    	![[Pasted image 20260209102029.png]]
    	是变异凯撒密码
3. 分析解密逻辑
    	- **逆向移位:**

    	    - 遍历目标字符串，如果是字母，则执行：**明文 = 密文 - 当前索引**。

    	    - 如果结果小于 'A' (或 'a')，则加 26。

    	    - 非字母字符保持不变。

    	- **逆向置换:**

    	    - 对上一步得到的结果，按照相同的下标对再次进行交换（交换操作是可逆的，再交换一次就还原了顺序）。
4. 编写脚本

	```python
	# 目标比较字符串
	target_str = "AskdEjyzIe_j{_s}"
	target = list(target_str)

	# ====================
	# 第一步：逆向移位 (Un-Shift)
	# 逻辑：char = char - index
	# ====================
	temp_step1 = []
	for i in range(16):
	    char = target[i]
	    val = ord(char)

	    # 处理小写字母
	    if 'a' <= char <= 'z':
	        new_val = val - i
	        while new_val < ord('a'):
	            new_val += 26
	        temp_step1.append(chr(new_val))
	    # 处理大写字母
	    elif 'A' <= char <= 'Z':
	        new_val = val - i
	        while new_val < ord('A'):
	            new_val += 26
	        temp_step1.append(chr(new_val))
	    # 非字母保持不变
	    else:
	        temp_step1.append(char)

	print(f"After Un-Shift: {''.join(temp_step1)}")

	# ====================
	# 第二步：逆向置换 (Un-Swap)
	# 交换下标: (1,4), (2,8), (3,12), (6,9), (7,13), (11,14)
	# ====================
	flag_list = list(temp_step1)

	def swap(arr, i, j):
	    arr[i], arr[j] = arr[j], arr[i]

	swap(flag_list, 1, 4)
	swap(flag_list, 2, 8)
	swap(flag_list, 3, 12)
	swap(flag_list, 6, 9)
	swap(flag_list, 7, 13)
	swap(flag_list, 11, 14)

	final_flag = "".join(flag_list)
	print(f"Final Flag: {final_flag}")
	```

## 13.  emoclew -- Reverse2（reverse）

1. PE32 **GUI** 8.97MiB
2. IDA 打开发现大量静态链接的库函数，字符串搜索也很困难。
3. 用 ResourceHacker 打开程序，在 Dialog 文件夹中找到运行程序时看到的主界面，鼠标选中，查看验证 Flag 的按钮的 ID 为 1001
4. 在 IDA 中 `Alt+I` 查询 1001 （0x3E9）
5. 找到 .rdata 段的消息映射表中的对应位置，查看触发点击按钮事件时执行的函数
6. 结构如下：
    	![[Pasted image 20260209121724.png]]
    	两次出现的 1001 （0x3E9）分别是起始控件 ID 和结束空间 ID，而这相同说明只针对一个控件。
7. 顺着函数 `sub_70BBAB` 顺利找到 Flag。

## 14.  emoclew -- Reverse3（reverse）

1. 检测目标为 .NET 托管程序，编译产物为微软中间语言（MSIL）而非原生汇编代码。采用专用的 .NET 反编译工具 **dnSpy**，还原了高可读性的 C# 源代码。
2. 找到 Program 类进入 Main 函数分析。得知 Flag 长度为36，格式为 `AAA{...}`  。
3. 容易分析 Flag 的判定逻辑：把括号内的内容分为两半：后17位先做累积异或，得到异或总和 `c` 作为密钥，在用密钥和后17位逐位异或，转化为 Base64 字符串判定是否与明文相同。（已知 `c` 只有一个字节，可以 0-255 进行爆破）；构建一个14维列向量填入前14位的数，并包装成矩阵对象 rhs，判定 rhs 右乘 `Program.GetSquare()` 方法得到的矩阵是否与目标矩阵相等。
4. 不妨先破解前14个字符：只要分析 `Program.GetSquare()` 方法得到什么矩阵，使其逆矩阵左乘目标矩阵即可。由于方法得到矩阵的方式涉及 ,NET 底层比较难逆，尝试注入打印代码（hook）。但发现由于 Main 先判断后17个字符，不正确直接抛出异常到程序末尾捕获并结束程序了。所以还是先破解后半比较好）。但还可以尝试把 Main 方法中的 `throw new Exception()` 注释掉，确保 `Program.GetSquare()` 方法执行。但我不知道为什么失败了（。只能尝试算法剥离。

```c#
using System;
using System.IO;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text;

public class Program
{
	public static void Main()
	{
		// 1. 完美复刻截图中的字符串
		// 注意：\n 是换行，\t 是制表符，这直接影响序列化后的字节流
		string graph = "女儿悲，青春已大守空闺。\n女儿愁，悔教夫婿觅封侯。\n女儿喜，对镜晨妆颜色美。\n女儿乐，秋千架上春衫薄。\n\t——《红楼梦》";

		// 2. 复刻序列化过程
		MemoryStream memoryStream = new MemoryStream();
		BinaryFormatter binaryFormatter = new BinaryFormatter();

		try
		{
			binaryFormatter.Serialize(memoryStream, graph);
		}
		catch (Exception e)
		{
			// 如果在线编译器不支持 BinaryFormatter (如 .NET 8)，会报错
			Console.WriteLine("环境错误: " + e.Message);
			return;
		}

		byte[] array = memoryStream.ToArray();

		// 3. 计算并输出矩阵 (格式化为 Python 列表)
		Console.WriteLine("# 复制下面的内容到 Python 脚本中");
		Console.WriteLine("square_raw = [");

		int dimension = 14;

		for (int i = 0; i < dimension; i++)
		{
			Console.Write("    [");
			for (int j = 0; j < dimension; j++)
			{
				// 截图中的核心公式:
				// index = 7 * (i + j * 14) % 195
				// value = array[index] % 127
				int index = (7 * (i + j * 14)) % 195;

				int val = 0;
				// 安全检查，防止索引越界 (虽然原程序没做，但我们加上以防万一)
				if (index < array.Length) {
					val = array[index] % 127;
				}
				else {
					 // 如果这行被打印，说明序列化长度不够，环境有问题
					 Console.WriteLine("ERROR");
				}

				Console.Write(val);
				if (j < dimension - 1) Console.Write(", ");
			}
			Console.WriteLine("],");
		}
		Console.WriteLine("]");

		// 4. 清理资源
		memoryStream.Close();
	}
}
```

	得到方法返回的矩阵，然后用 python 脚本解密

```python
from sympy import Matrix

# 1. 模数
MOD = 127

# 2. 目标列向量 (Target) - 来自之前的 Main 截图
target_values = [45, 77, 7, 109, 112, 98, 11, 14, 70, 77, 16, 26, 1, 106]

# 3. Square 矩阵 (Input)
# ==========================================
# 请将 C# 运行结果粘贴在这里！！！
# ==========================================
square_raw = [
	# 在这里粘贴你从 DotNetFiddle 跑出来的二维数组
	# 例如: [1, 2, ...],
]

def solve():
	if not square_raw:
		print("错误：请先填入 square_raw 矩阵数据！")
		return

	print("正在计算...")
	T = Matrix(target_values)
	S = Matrix(square_raw)

	try:
		# 求逆矩阵并解密: Flag = S逆 * T
		S_inv = S.inv_mod(MOD)
		result = S_inv * T
		result = result.applyfunc(lambda x: x % MOD)

		flag_part1 = ""
		for i in range(result.rows):
			flag_part1 += chr(int(result[i]))

		print(f"成功解密 Part 1: {flag_part1}")

	except Exception as e:
		print(f"解密失败: {e}")

if __name__ == "__main__":
	solve()
```

5. 拿到前14个字符，解密后17个字符。只要一路逆推：先 Base64 解密，然后爆破 `c` ，逐位异或后按照交换方法再交换一遍找到所有可能的 Flag，最后找到最像 Flag 的真 Flag。

```python
import base64

def decrypt_part2():
    # ---------------------------------------------------------
    # 1. 准备密文
    # ---------------------------------------------------------
    # 这是 C# 代码第 31 行硬编码的 Base64 字符串
    # 对应变量: array
    target_b64 = "d3l5d3ldRncbEB4fER4YEBg="

    # 将 Base64 解码回原始字节数组 (byte[])
    # 对应 C# 中的: byte[] array
    cipher_bytes = base64.b64decode(target_b64)

    print(f"密文 (Hex): {cipher_bytes.hex()}")
    print("-" * 30)

    # ---------------------------------------------------------
    # 2. 爆破 XOR 密钥 (c)
    # ---------------------------------------------------------
    # 原理：C# 代码中 c 是所有明文字符的异或和。
    # 我们不知道明文，所以不知道 c。
    # 但 c 只是一个 char (0-255)，我们可以尝试每一种可能性。

    found_flags = []

    for key in range(256):
        # 尝试用当前的 key 进行解密
        # 解密公式: 明文 = 密文 ^ Key
        # (因为 A ^ B = C  =>  C ^ B = A)
        try_chars = []
        is_readable = True

        for byte_val in cipher_bytes:
            plain_val = byte_val ^ key

            # 过滤：Flag 肯定由可打印字符组成 (ASCII 32-126)
            if 32 <= plain_val <= 126:
                try_chars.append(chr(plain_val))
            else:
                is_readable = False
                break

        # 如果解出来的字符全是人话，就打印出来
        if is_readable:
            candidate = "".join(try_chars)
            print(f"Key = {key} ({hex(key)}) -> 解密结果: {candidate}")
            found_flags.append(candidate)

    # ---------------------------------------------------------
    # 3. 结果分析
    # ---------------------------------------------------------
    print("-" * 30)
    if found_flags:
        print("推荐结果 (最像 Flag 的):")
        for flag in found_flags:
            # 结合 Part 1 (C#_Is_The_Best)，这一段通常以下划线开头
            if flag.startswith("_"):
                print(f"{flag}")
    else:
        print("未找到可读结果，请检查 Base64 字符串是否抄错。")

if __name__ == "__main__":
    decrypt_part2()
```

## 15.  ACTF 2016 -- 眼见为虚（reverse）

1. 用 jadx-gui 分析，发现 `leadroyal.aaa.com.apk04` 包下有 `MainActivity` 类，还有 `MainAcvitity` 类，查看 `AndroidManifest.xml` ，发现同时带有 `<action android:name="android.intent.action.MAIN"/>` 和 `<category android:name="android.intent.category.LAUNCHER"/>` 的是 MainActivity，说明 MainActivity 是程序的入口。但毕竟“眼见为虚”，于是分析 MainAcvitity（。
2. 分析 Acvitity
    	![[Pasted image 20260212182224.png]]
3. 查看 class a 中静态方法 a 的逻辑，发现是返回传入数组的每一位与数组 a 相同位异或的结果，哪只要确定数组 a （Key），于是分析赋值给 a 的 `getKeyFromJNI()` 方法。
4. 直接从 jadx 里导出，或修改后缀解压找到 libcracked-lead.so (x86 便于分析)，进入 IDA Pro 进行分析寻找 Key。直接搜索 getKeyFromJNI 。根据 JNI 规范，Native 函数的名字必须按照格式拼接： `Java` + `_` + `包名（用下划线分割）` + `_` + `类名` + `_` + `方法名` ，于是找到 `Java_leadroyal_aaa_com_apk04_MainAcvitity_getKeyFromJNI()` 函数，顺着找到存储 Key 的内存地址，得到 Key 的值。（在 Java 中，`char` 是 **UTF-16** 编码，占用 **2 个字节**，要两个字节两个字节地看）
5. 编写脚本解密得到 Flag

```python
# 1. 从 MainAcvitity.java 提取的密文 (Encrypted Data)
# 对应代码：new char[]{185, 7, 'c', 182, ...}
# 将字符转为 ASCII 数字
encrypted_arr = [
    185, 7, 99, 182, 62, 116, 93, 174,
    161, 101, 241, 91, 179, 160, 57, 137,
    107, 10, 253, 52, 180, 192, 45, 228,
    161, 62, 74
]

# 2. 从 IDA Pro 提取的密钥 (Key)
# 对应地址 0x2C004 开始的数据，每隔一个字节取一个有效值
key_arr = [
    0xF8, 0x46, 0x22, 0xCD, 0x47, 0x1B, 0x28, 0xFC,
    0xFE, 0x0B, 0x9E, 0x2C, 0xEC, 0x96, 0x0F, 0xBF,
    0x5D, 0x3C, 0xA2, 0x05, 0xD8, 0xAC, 0x1C, 0xBA,
    0xFE, 0x60, 0x37
]

# 3. 解密过程 (XOR)
flag = ""
for i in range(len(encrypted_arr)):
    # 算法原理：明文 = 密文 ^ 密钥
    decrypted_char_code = encrypted_arr[i] ^ key_arr[i]
    flag += chr(decrypted_char_code)

print("恭喜！Flag 是：")
print(flag)
```

## 16.  ACTF 2016 -- Stack Mess（reverse）

**1. 静态分析受阻**

- 打开 JADX，发现 `MainActivity` 的 `d` 方法无法正常反编译，开启不一致模式后，看到一个巨大的 `while(true)` 包裹着 `switch(c)`。

- **分析**：这是典型的 **控制流平坦化（Control Flow Flattening）** 混淆。开发者把正常的代码逻辑打碎成了无数个小块（case 0, 1, 2...），并通过状态机（变量 `c`）来控制跳转。

**2. UI 提示突破**

- APP 界面提示“运行过程长”、“可以先输小数字试试”。

- **分析**：

    - “运行长”暗示算法复杂度高（可能是 $O(n^2)$ 或递归模拟），需要找出 $O(1)$ 或 $O(\log n)$ 的数学公式。

    - “输小数字”暗示这是一个**确定性算法**，输入输出之间存在数学规律。

- 转为**黑盒测试**。把 APP 当作一个函数 $f(x)$，通过观察输入 $x$ 和输出 $y$ 来反推逻辑。

**3. 第一次假设：比特逆序（Bit Reversal）—— 证伪_**

**4. 第二次假设：循环左移（Cyclic Shift）—— 证明_**

**5. 建立数学模型**

这个操作在数学上被称为 **约瑟夫环问题 (Josephus Problem)** 的特解（步长 $k=2$），或者叫 **循环左移 1 位 (Rotate Left)**。

公式为：

$$
f(n) = (n - 2^L) \times 2 + 1
$$

其中 $L = \lfloor \log_2 n \rfloor$，即 $n$ 的二进制最高位的权重。

**6. 计算 Flag**

- **目标**：计算 $f(999999)$。

- **步骤 1：找最高位**。

    $2^{19} = 524288$，$2^{20} = 1048576$。

    所以 $999999$ 的二进制最高位权重是 $524288$。

- **步骤 2：去头**。

    $999999 - 524288 = 475711$。

- **步骤 3：移位补尾**。

    $475711 \times 2 + 1 = 951422 + 1 = 951423$。

## 17.  ACTF 2016 -- songmingti（misc）

1. 确定图片格式 -- 文件头 `FF D8` 是 `.jpg` 文件
2. 图上只显示了一般的 flag，看起来是被边缘截断了 -- 尝试修改图片显示宽高。在 JPEG 文件格式中，需要找到 **SOF0 (Start Of Frame 0)** 标记段，它定义了图像的宽和高。
    	![[Pasted image 20260212212339.png]]
    	修改图片宽高发现无效
3. 想到两个方向 -- **检查文件尾部附加数据** 和 **隐写工具提取**。先检查尾部附加数据，
	![[Pasted image 20260212213013.png]]
	JPEG 文件以 `FF D9` 结尾，后面再次出现 `FF D8` JPEG 文件头，且检查文件末尾还是 `FF D9` ，推测在文件尾部附加了一张 JPEG 图片，选中后一张图的数据保存选区，得到含有另一半 flag 的图片文件。

## 18.  201706 -- hegengming's secret（misc）

1. 根据题目描述，文件是一个 TrueCrypt 加密容器，选用 VeraCrypt 1.25.9（支持 TrueCrypt）进行破解。
2. 破解容器密码：提示密码在文件名内 `hegengming_secret.!xDxxDbfaF XwW8t.truecrypt` 且空格要特殊处理。URL 传输中 `+` `%20` 被解码为空格，用 `+` 替代空格尝试，成功挂载外层卷。
3. 在挂载的逻辑卷中进行信息搜集：
    	- 三个文件 `secret.docx` `qidanhegengmingliucansecwest2017-170315171957.pdf` `我的白帽学习路线--20170325.pdf`
    	- 首先查看 `secret.docx` ，检查隐写：在软件中勾选显示隐藏文字 或 解压并在  `word/document.xml` 中寻找 `<w:vanish/>` 标签，紧随其后的 `<w:t>...</w:t>` 标签内的内容就是隐藏文字。找到背景色的文字 `Password (key files needed):` 和隐藏文字 `893F2yB9MwCn74x1` 推测存在以这个为密码，并需要 Keyfile 的一个隐藏卷。
    	- 找 Keyfile -- secret.docx 提示：我的另一半在哪呢？题目叫做 `hegengming's secret`，在文件名 `qidanhegengmingliucansecwest2017-170315171957.pdf` 中两个人名恰好各取一半（根据 pdf 内容确定），推测该文件就是 Keyfile
4. 成功挂载隐藏卷后，里面只显示一个普通文本文件写着夏目友人帐的一些语录。使用专业软件分析这个 “卷” -- winhex
5. 在卷的根目录中成功找到了 flag。

## 19.  ACTF 2020 -- start（reverse）

1. 分析是 Ubuntu gcc 编译的 ELF64 （AMD64）
2. 在 IDA 中搜索 main 函数，发现 `main()` `main1()` `main2()` 三个可能的 “入口” 函数。结合题目名字推测解题逻辑重点要寻找程序入口。
3. 在 C/C++ 程序中，真正的入口点并不是 `main` 函数，而是 `_start` 函数（由编译器和 C 运行时库提供）。程序的启动流程通常是： `_start` -> `__libc_start_main` -> **真正的 main 函数**。于是搜索定位到 `_start` 符号，查看在 `call __libc_start_main` 之前，**第一个参数**（在 64 位程序中是 **`RDI` 寄存器**，32 位程序中是压栈的参数）是指向哪里的 -- 即程序真正运行时的主函数。发现的确是 `main()` ，虽然很奇怪但先分析一下 main 函数。
4. 逻辑很好分析，直接写脚本解密

```python
# 从第二张截图提取的 c0 数组数据
c0 = [
    0x72, 0x71, 0x65, 0x76, 0x4C, 0x75, 0x54, 0x5A, 0x64, 0x43, 0x56,
    0x4D, 0x60, 0x58, 0x54, 0x52, 0x47, 0x7D, 0x55, 0x48, 0x42, 0x79,
    0x51, 0x56, 0x5E, 0x4F, 0x76, 0x4E, 0x43, 0x4F, 0x4A, 0x13, 0x6E
]

flag = ""

# 遍历数组进行解密
for j in range(len(c0)):
    # 逆向算法: flag[j] = c0[j] ^ (j ^ 0x33)
    key = j ^ 0x33
    decoded_char = c0[j] ^ key
    flag += chr(decoded_char)

print("Flag is:", flag)
```

ACTF{Can_you_find_the_true_flag?} 不出意外确实是个假 flag。

5. 理论上来讲应该重新深入分析程序入口，但偷懒直接分别分析 `main2()` 和 `main3()` 。（导致工作量平白多了一大截，实际后面证明全部是假的23333）
6. `main2()` 看起来是一个简单的 Base64 加密，但解出来是乱码，于是进入 `Base64Encode()` 函数查看加密逻辑
    	![[Pasted image 20260214030012.png]]

7. 写解码脚本

```python
import base64

# 密文 c2
c2 = "OSLSP1rSYBDxVxDxV0Dqa07dWT7EKErjV0XqWUb7"

# 标准 Base64 表
std_table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"

# 还原标准 Base64 字符串
# 逻辑：题目由 Standard -> Cipher 是 Index - 2
# 所以我们由 Cipher -> Standard 是 Index + 2
restored_b64 = ""

for char in c2:
    # 1. 找到字符在标准表中的索引
    curr_idx = std_table.find(char)

    # 2. 索引 +2 (注意处理循环，比如 + 和 /)
    # 题目逻辑推测是循环移位，所以是 (i + 2) % 64
    new_idx = (curr_idx + 2) % 64

    # 3. 映射回标准字符
    restored_b64 += std_table[new_idx]

# 添加 Padding (Base64 需要 4 的倍数)
missing_padding = len(restored_b64) % 4
if missing_padding:
    restored_b64 += '=' * (4 - missing_padding)

print(f"Restored Base64: {restored_b64}")

# 解码
try:
    flag = base64.b64decode(restored_b64).decode('utf-8')
    print(f"Flag: {flag}")
except Exception as e:
    print(f"Error decoding: {e}")
```

得到 `ACTG{Th1s_1s_also_a_F0ke_flag}` 依然是个假 flag，看着格式不太对可能脚本哪里有错但没有改的必要了）。

10. 孤注一掷地分析 `main1()` ，虽然最后还是个假 flag （。从函数名（x）得知是 3-Way 加密（其实是超级魔改版），目前能力不足以逆出来，看看AI。

```python
import struct

# --- 1. 基础工具 ---
def HIBYTE(n): return (n >> 24) & 0xFF
def HIWORD(n): return (n >> 16) & 0xFFFF
def rol(x, n): return ((x << n) & 0xFFFFFFFF) | (x >> (32 - n))
def ror(x, n): return ((x >> n) | (x << (32 - n))) & 0xFFFFFFFF

# --- 2. 核心函数复刻 (完全对应截图) ---

# 复刻题目中的 Custom Theta (image_c442d9)
def custom_theta_fwd(state):
    x, y, z = state[0], state[1], state[2]

    v2 = HIBYTE(x) ^ (y << 16) ^ HIWORD(x) ^ (y << 24) ^ (x >> 8) ^ (x << 8) \
         ^ HIBYTE(z) ^ (x << 16) ^ HIWORD(z) ^ (z << 16) ^ y ^ HIWORD(y) ^ (y << 8)
    v2 &= 0xFFFFFFFF

    v3 = HIBYTE(y) ^ (z << 16) ^ HIWORD(y) ^ (z << 24) ^ (y >> 8) ^ (y << 8) \
         ^ HIBYTE(x) ^ (y << 16) ^ HIWORD(x) ^ (x << 16) ^ z ^ HIWORD(z) ^ (z << 8)
    v3 &= 0xFFFFFFFF

    delta_x = HIBYTE(z) ^ (x << 16) ^ HIWORD(z) ^ (x << 24) ^ (z >> 8) ^ (z << 8) \
            ^ HIBYTE(y) ^ (z << 16) ^ HIWORD(y) ^ (y << 16) ^ HIWORD(x) ^ (x << 8)
    new_x = x ^ delta_x
    new_x &= 0xFFFFFFFF

    return [new_x, v2, v3]

# 动态生成 Gamma 逆表 (对应 image_c4c65a)
gamma_fwd_map = {}
for val in range(8):
    x, y, z = (val >> 2) & 1, (val >> 1) & 1, val & 1
    # 题目逻辑：v2 = y ^ (z | ~x); v3 = z ^ (~y | x); new_x = x ^ (~z | y)
    ny = y ^ (z | (~x & 1))
    nz = z ^ ((~y & 1) | x)
    nx = x ^ ((~z & 1) | y)
    gamma_fwd_map[val] = (nx << 2) | (ny << 1) | nz
gamma_inv_map = {v: k for k, v in gamma_fwd_map.items()}

# 自动计算 Theta 的逆矩阵 (线性代数法)
def build_inverse_theta():
    matrix = []
    # 构建 96x96 的变换矩阵
    for i in range(96):
        inp = [0, 0, 0]
        inp[i // 32] = 1 << (i % 32)
        out = custom_theta_fwd(inp)
        row = []
        for val in out:
            for b in range(32): row.append((val >> b) & 1)
        matrix.append(row)

    # 高斯消元求逆
    n = 96
    inv = [[0]*n for _ in range(n)]
    for i in range(n): inv[i][i] = 1
    for i in range(n):
        pivot = i
        while pivot < n and matrix[pivot][i] == 0: pivot += 1
        if pivot == n: raise ValueError("Theta不可逆，检查代码")
        matrix[i], matrix[pivot] = matrix[pivot], matrix[i]
        inv[i], inv[pivot] = inv[pivot], inv[i]
        for j in range(n):
            if i != j and matrix[j][i] == 1:
                for k in range(i, n): matrix[j][k] ^= matrix[i][k]
                for k in range(n): inv[j][k] ^= inv[i][k]
    return inv

INV_THETA_MATRIX = build_inverse_theta()

# --- 3. 逆函数实现 ---

def inv_theta(state):
    bits = []
    for val in state:
        for b in range(32): bits.append((val >> b) & 1)
    res_bits = [0] * 96
    for i in range(96):
        if bits[i]:
            for j in range(96): res_bits[j] ^= INV_THETA_MATRIX[i][j]
    new_state = [0, 0, 0]
    for i in range(96):
        if res_bits[i]: new_state[i // 32] |= (1 << (i % 32))
    state[0], state[1], state[2] = new_state[0], new_state[1], new_state[2]

def inv_gamma(a):
    x_out, y_out, z_out = 0, 0, 0
    for i in range(32):
        bit_x, bit_y, bit_z = (a[0] >> i) & 1, (a[1] >> i) & 1, (a[2] >> i) & 1
        val = (bit_x << 2) | (bit_y << 1) | bit_z
        orig = gamma_inv_map[val]
        x_out |= ((orig >> 2) & 1) << i
        y_out |= ((orig >> 1) & 1) << i
        z_out |= (orig & 1) << i
    a[0], a[1], a[2] = x_out, y_out, z_out

def inv_pi_1(a): # 逆转: a[0] ROL 10, a[2] ROR 1
    a[0] = rol(a[0], 10)
    a[2] = ror(a[2], 1)

def inv_pi_2(a): # 逆转: a[0] ROR 1, a[2] ROL 10
    a[0] = ror(a[0], 1)
    a[2] = rol(a[2], 10)

def generate_constants():
    consts, x = [], 0xB0B
    for _ in range(12):
        consts.append(x)
        x <<= 1
        if x & 0x10000: x ^= 0x11011
        x &= 0xFFFF
    return consts
CONSTANTS = generate_constants()

# --- 4. 解密主逻辑 ---

def decrypt_block(ciphertext_block, key_block):
    state = list(struct.unpack('<3I', ciphertext_block))
    key = list(struct.unpack('<3I', key_block))

    # 【关键修正】先进行 InvTheta，再进行异或！
    # 对应加密末尾： AddKey -> Theta
    inv_theta(state)

    state[0] ^= key[0] ^ (CONSTANTS[11] << 16)
    state[1] ^= key[1]
    state[2] ^= key[2] ^ CONSTANTS[11]

    # 循环逆推
    for i in range(10, -1, -1):
        # 逆 Rho: InvPi2 -> InvGamma -> InvPi1 -> InvTheta
        inv_pi_2(state)
        inv_gamma(state)
        inv_pi_1(state)
        inv_theta(state) # 每一轮开头都有 Theta

        # 逆 AddKey
        state[0] ^= key[0] ^ (CONSTANTS[i] << 16)
        state[1] ^= key[1]
        state[2] ^= key[2] ^ CONSTANTS[i]

    return struct.pack('<3I', *state)

# --- 主程序 ---
c1_hex = [
    0x95, 0xA3, 0xDA, 0xC5, 0x95, 0xEB, 0x2F, 0x27, 0xEE, 0x67,
    0xD6, 0xF2, 0x60, 0x86, 0xAF, 0xBD, 0x97, 0xEE, 0xF4, 0x67,
    0xA3, 0x59, 0xDE, 0x59, 0x0F, 0xCA, 0x5E, 0x46, 0x24, 0xC8,
    0x88, 0x53, 0xDA, 0xBE, 0x63, 0x0F, 0x2D, 0x5F, 0xA1, 0x29,
    0x1D, 0xC1, 0x95, 0xE6, 0xC1, 0x17, 0x7F, 0x12
]
c1_bytes = bytes(c1_hex)
key_bytes = b"_is_this_the" # 前 12 字节

decrypted = b""
print("正在解密...")
for i in range(0, len(c1_bytes), 12):
    decrypted += decrypt_block(c1_bytes[i : i+12], key_bytes)

print("\n--- 最终 Flag ---")
try:
    print(decrypted.rstrip(b'\x00').decode('utf-8'))
except:
    print(decrypted)
```

`ACTF{hint:is_main_the_first_function_called_?}` 然后又得到一个假 flag 23333。

11. 所以还是被打回去看 `_start` 。回顾 C/C++ 程序（ELF64） 的启动流程，再次检查 `__libc_start_main` 函数中是否有认为写入的代码，检查 TLS Callbacks （TLS 回调函数会在线程创建时（也就是程序刚启动瞬间）执行，早于 entry point）。
    	- 检查 TLS 回调函数：- 在 IDA 中按下快捷键 **`Ctrl + E`** (Entry Points / 入口点)。看列表中有没有 **`TlsCallback_0`** 或者类似带有 `TLS` 字样的函数。有时候 IDA 识别不出 TLS。请直接去 **`.rdata`** 或 **`.data`** 段搜索。（按下 **`Ctrl + S`**，寻找 **`.tls`** 段。）

    然后发现还是找不到线索hhh。

12. 既然程序运行时的确会显示 `"Welcome to ACTF2020!"` 等字符串，那真正的执行逻辑也必然会引用这个字符串，直接通过交叉引用追踪。早该想到的hhh。找到了 .text 段的代码。得到算法后解密即得到 flag。(注意 Base64 的加密函数与 main2 是相同的，自定义版；内存小端序存储)。

```python
import base64

# 1. 目标密文
target_cipher = "4sh95bBs1a5D7NRyv3pHwNRW16pX19VFw6NC7adJy9VGx9VHuqtCxa9Mzu=="

print(f"Target Cipher: {target_cipher}")

# 2. 逆向 Custom Base64 (索引 + 2)
std_table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
restored_b64 = ""

for char in target_cipher:
    if char == '=':
        restored_b64 += '='
        continue
    curr_idx = std_table.find(char)
    new_idx = (curr_idx + 2) % 64
    restored_b64 += std_table[new_idx]

print(f"Restored B64:  {restored_b64}")

# 3. Base64 解码
try:
    decoded_bytes = bytearray(base64.b64decode(restored_b64))
except Exception as e:
    print("Base64 decode error:", e)
    exit()

# 4. 逆向分段异或 (XOR 0xAB / 0xAA)
length = len(decoded_bytes)
half_len = length // 2

flag = ""
for i in range(length):
    byte = decoded_bytes[i]
    # 汇编逻辑：i <= len/2 用 0xAB，否则用 0xAA
    if half_len < i:
        key = 0xAA
    else:
        key = 0xAB
    flag += chr(byte ^ key)

print("\n" + "="*50)
print(f"FINAL FLAG: {flag}")
print("="*50)
```

`ACTF{Even___l1bc_start_main_may_be_changed}` 终于拿到 flag 了呜呜呜。

## 20.  ACTF 2016 -- miaomiaomiao（misc）

1. 遭遇弹窗地狱 -- 利用 JavaScript 的 `alert()` 循环来阻止进行 F12 调试。解决：
    	- 在浏览器地址栏前面加上 `view-source:`
    	- 用命令行 `curl`
    	- 禁用浏览器 JS
2. 在网页源码中找到一张猫咪图片。根据题目名称推断 flag 在图中。下载图片。
3. 检查纯文本追加 -- `strings` 命令；检查视觉隐藏 -- `StegSolve` 工具切换不同图层，都没有发现明显类似 flag 的内容。
4. 题目描述中强调 `[hide]` 可能是提示使用 `Steghide` 隐写工具。于是寻找密码 -- 使用 010 Editor 或者 `hexdump` 查看文件头尾

```bash
# 查看文件头和末尾，看看有没有多余的文件签名
hexdump -C miao.jpg | head -n 20
hexdump -C miao.jpg | tail -n 20
```

- 找到了密码： `key:m1a0@888`

5. 提取隐藏文件

    ```bash
    steghide extract -sf miao.jpg -p m1a0@888
    ```

    输出 `wrote extracted data to "secret_file.txt".`

6. 查看 `secret_file.txt` ，发现一段二进制文本，根据二进制编码，每 8 位转换为 ASCII，成功得到 flag。 `AAA{D0_Y0u_L1ke_Ste9H1de_M1a0}`

## 21.  ACTF 2019 -- Picture Lock（misc）

1. 用 `file`  检测拿到的两个文件的类型。

    `output.jpg: data` ;

    `picture_lock: ELF 64-bit LSB executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, for GNU/Linux 2.6.32, BuildID[sha1]=945a955cc523ef7773852008ef314f590204ed24, stripped`

    - `output.jpg` 被识别为 `data` 而不是 JPEG 图片，说明它的文件头被破坏了，或者整个文件都被加密了。而 `picture_lock` 是一个去除了符号表（stripped）的 64 位 ELF 文件，这意味着无法直接看到函数名（如 `main`），这应该是一个用于生成或处理 `output.jpg` 数据的可执行文件。

2. 静态分析与预处理：
    	1. `xxd output.jpg | head -n 10` 正常的 JPG 文件头通常以 `FF D8 FF` 开头，查看文件头发现被加密了。
    	2. 提取字符串，可以初步猜测程序逻辑。`flag.jpg` `Open file error!` `[E]ncrypt` `[D]ecrypt` `output.jpg` `Create file error!` `Encryption finished!` 推测程序可能要打开文件，可能含有加密、解密操作，可能会创建文件，相关文件有 `flag.jpg` `output.jpg` 。

3. 动态行为分析
    	1. 赋予执行权限并尝试运行 `chmod +x picture_lock` `./picture_lock` 观察运行或报错结果。
    	2. 使用 `ltrace` 或 `strace` 跟踪。因为程序是动态链接的，可以跟踪库函数调用。`strace` 捕获并记录进程发起的**系统调用**（system call）以及接收到的**信号**。系统调用是用户态程序请求内核服务的方式，例如读写文件、创建进程、网络通信等；`ltrace` 捕获并记录进程调用的**动态库函数**（library call），特别是 C 库函数（如 `printf`、`malloc`、`strcpy` 等）。它也可以显示系统调用（通过 `-S` 选项），但主要关注用户态的库函数。

4. 反编译与逆向。IDA 打开文件。

    ![[Pasted image 20260214162153.png]]

    推测这个程序是题目作者用来加密 flag.jpg 的程序，要通过加密结果 `output.jpg` 和加密逻辑 `sub_400D1D` 推断算法利用脚本还原 flag.jpg。

5. 分析 `sub_400D1D` ，暂时无能为力，跟着 AI 学点概念（。这是一个小型的、典型的代换-置换网络 (SPN) 加密算法。函数内部先输入 Key，依次调用了 `sub_400B5A` `sub_4009A1` `sub_400B5A` 处理 Key 和文件数据。是经典的“**混淆-扩散-混淆**”结构。`sub_400B5A` 负责将密钥混入数据（依赖密钥），`sub_4009A1` 负责将数据打散（不依赖密钥）。`sub_4009A1` 中调用的两个数学小函数，异或加法 (`sub_400936`) 和 有限域乘法 (`sub_40094D`) （是一个标准的 $GF(2^8)$ 乘法器）。在加密过程中，**没有任何一个非线性操作（比如 AES 里的 S-Box）**。所有的**移位、异或、矩阵乘法**，全都是**线性运算**， 意味着不管经过了多少轮操作，都可以利用**矩阵的逆运算**和 **约束求解器（如 Z3）** 在极短的时间内解开方程，算出 Key。

```python
from z3 import *
import struct

# ==========================================
# 1. 在 Z3 中定义数学运算 (修复版)
# ==========================================

def z3_gf_mul(a, b):
    """ 在 Z3 中实现 Galois Field (2^8) 乘法, Poly = 0x11D """
    # [修复点] 如果 b 是 Python 整数(例如 3 或 7)，强制转换为 Z3 的 8位 BitVector
    if isinstance(b, int):
        b = BitVecVal(b, 8)

    p = BitVecVal(0, 8)
    a_vec = a

    # 模拟 Peasant's Algorithm
    for i in range(8):
        # 如果 b 的最低位是 1，则 p ^= a
        # 提取 b 的最低位: b & 1
        # 注意: Z3 中比较必须用 == 1，不能直接用 if (b&1)
        p = If((b & 1) == 1, p ^ a_vec, p)

        # 检查 a 的最高位 (第8位, 0x80)
        # a_vec & 0x80 结果是 0 或 0x80
        hi_bit = (a_vec & 0x80) == 0x80

        # 左移 a
        a_vec = (a_vec << 1) & 0xFF

        # 如果最高位原本是1，则异或多项式 0x1D
        a_vec = If(hi_bit, a_vec ^ 0x1D, a_vec)

        # b 右移一位
        b = LShR(b, 1)

    return p

def z3_mix_columns(data_vecs):
    """ 符号执行 MixColumns """
    # Matrix: [1 3 3 7] (Circulant)
    # 这里的 3 和 7 之前会导致报错，现在 z3_gf_mul 会自动处理它们

    res = []

    # 处理两个 4 字节块
    for i in range(0, 8, 4):
        c0, c1, c2, c3 = data_vecs[i], data_vecs[i+1], data_vecs[i+2], data_vecs[i+3]

        # Row 0: 1 3 3 7
        r0 = c0 ^ z3_gf_mul(c1, 3) ^ z3_gf_mul(c2, 3) ^ z3_gf_mul(c3, 7)
        # Row 1: 7 1 3 3
        r1 = z3_gf_mul(c0, 7) ^ c1 ^ z3_gf_mul(c2, 3) ^ z3_gf_mul(c3, 3)
        # Row 2: 3 7 1 3
        r2 = z3_gf_mul(c0, 3) ^ z3_gf_mul(c1, 7) ^ c2 ^ z3_gf_mul(c3, 3)
        # Row 3: 3 3 7 1
        r3 = z3_gf_mul(c0, 3) ^ z3_gf_mul(c1, 3) ^ z3_gf_mul(c2, 7) ^ c3

        res.extend([r0, r1, r2, r3])

    return res

def rotate_left_4(data):
    # 交换前后4字节
    return data[4:] + data[:4]

def rotate_left_2(data):
    # 循环左移2字节
    return data[2:] + data[:2]

# ==========================================
# 2. 求解逻辑
# ==========================================
def solve():
    print("[*] Creating Z3 Solver...")
    solver = Solver()

    # 1. 定义未知数 Key (8个字节的 BitVector)
    K = [BitVec(f'k_{i}', 8) for i in range(8)]

    # 2. 准备已知数据
    # 密文头 (Output.jpg)
    cipher_bytes = bytes.fromhex("E6 87 F0 17 1B 6C 6C 5E")
    C = [BitVecVal(b, 8) for b in cipher_bytes]

    # 明文头 (Standard JPG)
    # 如果解不出来，请取消注释下面的一行试试 E1 或 DB
    plain_bytes  = bytes.fromhex("FF D8 FF E0 00 10 4A 46")
    # plain_bytes  = bytes.fromhex("FF D8 FF E1 00 10 4A 46")

    P = [BitVecVal(b, 8) for b in plain_bytes]

    # 3. 构建方程
    # 原始流程: Output = R2( Mix( R4(P) ^ K ) ) ^ K
    # 线性优化: Output = R2( Mix( R4(P) ) ) ^ R2( Mix(K) ) ^ K
    # 移项得到: R2( Mix(K) ) ^ K == Output ^ R2( Mix( R4(P) ) )

    print("[*] Building constraints...")

    # 计算右边 (Target) - 这部分是全已知常数
    step_a = rotate_left_4(P)   # R4(P)
    step_b = z3_mix_columns(step_a) # Mix(...)
    step_c = rotate_left_2(step_b)  # R2(...)

    target = []
    for i in range(8):
        target.append(C[i] ^ step_c[i])

    # 计算左边 (Symbolic Key) - 这部分包含未知数 K
    mix_k = z3_mix_columns(K)
    rot_k = rotate_left_2(mix_k)

    lhs = []
    for i in range(8):
        lhs.append(rot_k[i] ^ K[i])

    # 4. 添加约束 (Left == Right)
    for i in range(8):
        solver.add(lhs[i] == target[i])

    # 5. 可选：限制 Key 为可见字符 (32-126) 或 0 (padding)
    # 为了保险起见，这部分先注释掉。如果解出来是乱码，可以取消注释再试
    # for i in range(8):
    #     solver.add(Or(
    #         And(K[i] >= 32, K[i] <= 126), # Printable
    #         K[i] == 0                     # Null padding
    #     ))

    # 6. 求解
    print("[*] Solving system of linear equations...")
    if solver.check() == sat:
        model = solver.model()
        key_int = [model[K[i]].as_long() for i in range(8)]
        key_bytes = bytearray(key_int)

        print(f"\n[+] SUCCESS! Key Found (Hex): {key_bytes.hex()}")
        try:
            # 尝试解码为字符串，去除空字节
            key_str = key_bytes.replace(b'\x00', b'').decode('utf-8')
            print(f"[+] Key String: {key_str}")
        except:
            print("[!] Key contains binary data.")

        return key_bytes
    else:
        print("[-] UNSAT. No solution found.")
        print("    Possible causes:")
        print("    1. The JPEG header is not 'FF D8 FF E0 00 10 4A 46'")
        print("    2. Try changing E0 to E1 or DB in 'plain_bytes'.")
        return None

if __name__ == "__main__":
    solve()
```

6. 写脚本还原 `flag.jpg` 文件

```python
import struct
from z3 import *

# ==========================================
# 0. 配置信息
# ==========================================
INPUT_FILE = "output.jpg"
OUTPUT_FILE = "flag.jpg"
# 你刚刚跑出来的 Key (Hex)
KEY_HEX = "6062687b345f4f30"
KEY = bytes.fromhex(KEY_HEX)

print(f"[*] Key: {KEY} (Hex: {KEY_HEX})")

# ==========================================
# 1. 数学工具 (GF 2^8)
# ==========================================
# 为了速度，我们将使用查表法进行乘法
MUL_TABLE = {} # { (val, factor): result }

def make_mul_tables():
    """预计算 GF(2^8) 乘法表 (Poly 0x11D)"""
    for factor in range(256):
        for val in range(256):
            a = val
            b = factor
            p = 0
            for i in range(8):
                if (b & 1): p ^= a
                hi_bit = (a & 0x80)
                a = (a << 1) & 0xFF
                if hi_bit: a ^= 0x1D
                b >>= 1
            MUL_TABLE[(val, factor)] = p

make_mul_tables()

def gf_mul_fast(a, b):
    return MUL_TABLE[(a, b)]

# ==========================================
# 2. 计算逆矩阵 (使用 Z3)
# ==========================================
def get_inverse_matrix():
    print("[*] Calculating Inverse Matrix using Z3...")
    # 正向矩阵: [1 3 3 7] (循环矩阵)
    # 我们需要找到 [x y z w] 使得 [1 3 3 7] * [x y z w]^T = [1 0 0 0]^T
    # 由于是循环矩阵，只需算出第一行即可

    s = Solver()
    inv = [BitVec(f'inv_{i}', 8) for i in range(4)]

    # 定义 GF 乘法 (Z3版)
    def z3_mul(a, b_int):
        # 只要 b 是常数，我们可以复用 Python 的逻辑生成异或链
        res = BitVecVal(0, 8)
        for i in range(8):
            if (b_int >> i) & 1:
                # 如果 b 的第 i 位是 1，则累加 (a << i)
                # 但这是有限域，不能直接移位。
                # 简单办法：直接用我们预计算的逻辑，或者让 Z3 跑一遍结构
                # 为了简单，这里直接用“逆向乘法”太麻烦。
                # 既然我们已经有了 gf_mul_fast 表，我们直接穷举逆矩阵系数吧！
                # 4个字节的穷举比写 Z3 逻辑还要快。
                pass
        return None

    # ----------------------------------------------------
    # 既然 Z3 写乘法逻辑有点啰嗦，直接暴力搜逆矩阵系数
    # 搜索空间仅 256^4 ? 不，矩阵是循环的。
    # 我们只需要解 M * V = [1 0 0 0]
    # 使用 numpy 或者简单的 Python 循环求解
    # ----------------------------------------------------

    # 目标：找到 inv_row 使得 dot(row_0, inv_row) = 1, 其他为 0
    # Row 0: 1 3 3 7
    # Col 0 of Inv: [x, w, z, y] (因为是循环的)
    # 让我们直接通过测试找到逆变换的 Output

    # 构建 4x4 矩阵
    M = [[1,3,3,7], [7,1,3,3], [3,7,1,3], [3,3,7,1]]

    # 高斯消元求逆 (GF 2^8)
    # 偷懒办法：直接爆破每一列的解
    inv_matrix = []

    targets = [[1,0,0,0], [0,1,0,0], [0,0,1,0], [0,0,0,1]]

    for t_col in targets:
        # 求解 M * x = t_col
        # 既然维度只有4，我们可以随机尝试 x? 不，太慢。
        # 让我们用查表法反推。
        # 其实，对于 [1 3 3 7]，逆矩阵系数是固定的。
        # 经过计算（或者常见题目套路），系数通常也是小整数。
        # 让我们用 Z3 快速解一下线性方程组
        s = Solver()
        x = [BitVec(f'x_{i}', 8) for i in range(4)]

        # 矩阵乘法约束
        for r in range(4):
            val = BitVecVal(0, 8)
            for c in range(4):
                # 实现 z3_mul_const
                coeff = M[r][c]
                term = BitVecVal(0, 8)
                # 模拟 coeff * x[c]
                temp_x = x[c]
                for bit in range(8):
                    if (coeff >> bit) & 1:
                        term ^= temp_x
                    # x[c] * 2
                    hi = (temp_x & 0x80) == 0x80
                    temp_x = (temp_x << 1) & 0xFF
                    temp_x = If(hi, temp_x ^ 0x1D, temp_x)
                val ^= term

            s.add(val == t_col[r])

        if s.check() == sat:
            m = s.model()
            col_sol = [m[x[i]].as_long() for i in range(4)]
            inv_matrix.append(col_sol)
        else:
            print("[-] Error: Matrix not invertible!")
            exit()

    # 转置 inv_matrix (因为我们上面算的是列向量)
    final_inv = [[inv_matrix[c][r] for c in range(4)] for r in range(4)]
    print("[+] Inverse Matrix Calculated:")
    for row in final_inv:
        print(f"    {row}")
    return final_inv

INV_MATRIX = get_inverse_matrix()

# ==========================================
# 3. 解密逻辑 (Reverse)
# ==========================================

def inv_mix_columns(data):
    # data: 8 bytes
    out = bytearray(8)
    for i in range(0, 8, 4): # Process 4 bytes
        chunk = data[i:i+4]
        for r in range(4):
            val = 0
            for c in range(4):
                val ^= gf_mul_fast(INV_MATRIX[r][c], chunk[c])
            out[i+r] = val
    return out

def rotate_right(data, n):
    # Rotate Right n bytes (== Rotate Left 8-n)
    # n is small (2 or 4)
    return data[8-n:] + data[:8-n]

def xor_block(data, key):
    return bytes([d ^ k for d, k in zip(data, key)])

def decrypt_block(block):
    # 对应 sub_400D1D 的逆过程
    # Forward:
    # 1. RotL 4, XOR
    # 2. Mix
    # 3. RotL 2, XOR

    # Reverse:
    # 1. Reverse Step 3
    #    XOR, then RotR 2
    tmp = xor_block(block, KEY)
    state2 = rotate_right(tmp, 2)

    # 2. Reverse Step 2
    #    InvMix
    state1 = inv_mix_columns(state2)

    # 3. Reverse Step 1
    #    XOR, then RotR 4
    tmp2 = xor_block(state1, KEY)
    plain = rotate_right(tmp2, 4)

    return plain

# ==========================================
# 4. 主程序
# ==========================================
def main():
    with open(INPUT_FILE, "rb") as f:
        data = f.read()

    print(f"[*] Decrypting {len(data)} bytes...")

    decrypted = bytearray()

    # 按照 8 字节块处理
    # 注意：如果文件末尾不满 8 字节，根据逆向分析，尾部数据只进行了 XOR，未进行 Rotate/Mix
    # (或者 Mix 逻辑跳过了它)。为了保险，我们只解密完整的 8 字节块。

    full_blocks_len = (len(data) // 8) * 8

    for i in range(0, full_blocks_len, 8):
        block = data[i : i+8]
        decrypted += decrypt_block(block)

    # 处理尾部 (Tail)
    # 根据 C 代码逻辑，尾部只进行了 simple XOR (在 sub_400B5A 中)
    # 具体是：Tail 被 XOR 了 Key，但没有 Rotate (因为长度不够)，也没有 Mix
    if full_blocks_len < len(data):
        print("[*] Processing tail bytes...")
        tail = data[full_blocks_len:]
        # Reverse XOR
        tail_dec = bytearray()
        for j, b in enumerate(tail):
            tail_dec.append(b ^ KEY[j]) # Use Key[0..len]
        decrypted += tail_dec

    with open(OUTPUT_FILE, "wb") as f:
        f.write(decrypted)

    print(f"\n[+] Decryption Done! Saved to: {OUTPUT_FILE}")
    print("[+] Enjoy your flag!")

if __name__ == "__main__":
    main()
```

先贴一点相关的学习资料补补密码学再回来看（：

现代对称密码学（特别是分组密码）的设计深度依赖于严密的数学基础与结构学原理。本节将详细、客观地对代换-置换网络（SPN）、香农（Shannon）提出的“混淆与扩散”原则，以及相关的有限域数学基础进行专业级别的拆解。

## 一、 密码学基本设计原则：混淆与扩散

克劳德·香农（Claude Shannon）在 1949 年的经典论文中提出了设计安全密码系统的两个基本原则：**混淆（Confusion）**和**扩散（Diffusion）**。这也是现代分组密码（如 AES）的核心设计哲学。

### 1. 混淆 (Confusion)

混淆的目的是使得密文的统计特性与密钥的值之间的关系变得极其复杂。即使攻击者获取了密文的某些统计规律，也无法轻易推导出密钥的任何部分。

- **实现方式**：在现代密码学中，混淆主要通过引入**非线性**部件来实现，最典型的代表是**代换盒（S-Box）**。此外，轮密钥加（将数据与密钥进行异或）也提供了基础的混淆作用。

- **在本题算法中的体现**：本题算法**缺失**了非线性的 S-Box，其混淆层仅仅依赖于数据与密钥的按位异或（$\oplus$）。这种纯线性的混淆是极度脆弱的。

### 2. 扩散 (Diffusion)

扩散的目的是将明文的统计特性散布到整个密文中去。具体而言，明文中哪怕只有一个比特发生改变（或密钥中一个比特发生改变），都应当导致密文中大约一半的比特发生不可预测的改变。这种特性被称为**雪崩效应（Avalanche Effect）**。

- **实现方式**：扩散通常通过线性的置换运算来实现，例如位移（Shift/Permutation）和矩阵乘法（Matrix Transformation）。

- **在本题算法中的体现**：算法通过循环移位（对应数据块位置的调换）和矩阵乘法（实现 4 字节内部数据的混合）提供了较好的扩散效果。

### 3. “混淆-扩散-混淆”结构

为了构建安全的密码，通常需要将混淆和扩散交替进行，形成多轮操作。典型的单轮结构即“混淆层 $\rightarrow$ 扩散层 $\rightarrow$ 混淆层”。

- 本题算法的宏观骨架采用了这种结构：

    1. **第一层（混淆与初步置换）**：通过循环移位并与密钥异或。

    2. **第二层（核心扩散）**：无密钥参与的 $4 \times 4$ 矩阵线性变换。

    3. **第三层（混淆与最终置换）**：再次进行循环移位并与密钥异或。

---

## 二、 代换-置换网络 (Substitution-Permutation Network, SPN)

代换-置换网络（SPN）是现代分组密码最常用的架构之一，高级加密标准（AES）便是基于 SPN 结构设计的。

### 1. SPN 的标准组成部分

一个标准的 SPN 每一轮（Round）通常包含三个子层：

- **代换层（Substitution, S-层）**：将输入的数据分割成小的块，通过非线性的 S-Box 映射为新的数据。这是打破线性特征的唯一组件。

- **置换层（Permutation, P-层）**：将 S-层的输出位进行重新排列或线性混合，确保某一局部的变化能够扩散到全局。

- **密钥混合层（Key Mixing）**：将轮密钥（Round Key）与数据状态进行异或运算。

### 2. 本题算法的 SPN 特征评估

本算法是一个**不完整的、纯线性的 SPN 变体**。

- **置换层（P-层）存在**：使用了循环字节移位和类似 AES `MixColumns` 的操作。

- **密钥混合层存在**：使用了按位异或。

- **代换层（S-层）缺失**：算法没有使用任何非线性映射表。这是算法设计的致命缺陷，导致整个加密过程可以被表示为一系列仿射变换。

---

## 三、 有限域 $GF(2^n)$ 及其数学基础

在密码学中，为了保证所有运算的结果都能固定在特定的比特长度（如 8 比特）内，且不存在精度丢失，所有的算术运算都在**有限域（Galois Field）**中进行。本题涉及的是 $GF(2^8)$。

### 1. 域的定义与元素表示

在 $GF(2^8)$ 中，任何一个 8 比特（1 字节）的数值都被视为一个最高次为 7 的多项式。其系数只能是 0 或 1。

例如，十六进制数 `0x53`（二进制 `0101 0011`）表示为：

$$
x^6 + x^4 + x + 1
$$

### 2. 加法与减法

在 $GF(2^n)$ 中，加法和减法是等价的，运算规则为对应多项式系数的模 2 加法，即**按位异或（XOR, $\oplus$）**。

$$
A + B \equiv A - B \equiv A \oplus B
$$

### 3. 乘法与不可约多项式

$GF(2^8)$ 中的乘法是多项式相乘，然后对一个预先定义的**不可约多项式（Irreducible Polynomial）**取模。

- **不可约多项式**：作用类似于素数，无法被任何次数低于它的多项式整除。

- 本题代码中，当最高位溢出时，程序选择异或 `0x1D`。`0x1D` 的二进制为 `0001 1101`，它代表的实际上是 9 比特的不可约多项式（省略了最高位的 $x^8$）：

    $$
P(x) = x^8 + x^4 + x^3 + x^2 + 1
    $$

    （十六进制表示为 `0x11D`）。相比之下，AES 标准使用的不可约多项式是 `0x11B`。

### 4. 乘法的程序实现（Peasant's Algorithm）

由于硬件和软件执行多项式除法效率极低，通常采用“移位-异或”算法实现乘法。核心逻辑如下：

1. 判断乘数最低位是否为 1，若为 1，则将当前被乘数累加（异或）到结果中。

2. 将被乘数左移 1 位（相当于乘以 $x$）。

3. 如果被乘数在左移前最高位（第 7 位）为 1，说明左移后产生了 $x^8$ 项，必须减去（异或）不可约多项式以完成取模运算。

4. 乘数右移 1 位，循环 8 次。

---

## 四、 线性扩散层：循环矩阵乘法

算法的中间扩散层采用了一个 $4 \times 4$ 的矩阵变换。这在概念上完全等同于 AES 中的列混淆（MixColumns）。

### 1. 矩阵变换的原理

该层将 4 个字节视为一个列向量 $V$，并左乘一个固定的常数矩阵 $M$。所有的乘法和加法都在 $GF(2^8)$ 中进行。

$$
V' = M \cdot V
$$

本题中提取出的常数矩阵为循环矩阵（Circulant Matrix）：

$$
\begin{bmatrix} 1 & 3 & 3 & 7 \\ 7 & 1 & 3 & 3 \\ 3 & 7 & 1 & 3 \\ 3 & 3 & 7 & 1 \end{bmatrix}
$$

### 2. 矩阵的设计要求

在密码学中，作为扩散层的矩阵必须满足以下条件：

- **可逆性**：矩阵的行列式在 $GF(2^8)$ 下不能为 0。只有可逆，密文才能被解密还原。

- **最大距离可分（MDS）或强扩散性**：输入的任何一个字节发生改变，输出的多个字节（最好是全部 4 个字节）都会发生改变。矩阵中避免出现全 0 元素。

---

## 五、 算法的代数弱点与 SMT 求解

最后，必须指出这种算法结构在密码分析学下的致命弱点。

因为算法中**所有的组件**（异或、循环移位、有限域矩阵乘法）都具有**线性（或仿射）性质**。即满足叠加原理：

$$
F(A \oplus B) = F(A) \oplus F(B)
$$

这意味着，整个加密算法 $E_{k}(P)$ 可以被严格地展开为一个巨大的线性方程组系统：

$$
C = M \times P \oplus K_{equivalent}
$$

其中 $C$ 是密文，$P$ 是明文，$M$ 是所有位移和矩阵乘法的复合线性算子，$K_{equivalent}$ 是密钥经过线性变换后的等效密钥向量。

在已知 $P$（如明文文件头）和 $C$（密文文件头）的情况下，破解该密码不再需要穷举（Brute-force）密钥空间，而是直接求解由该加密网络构建的多元一次线性方程组。使用约束求解器（如基于 SMT 理论的 Z3 Solver），由于方程组纯线性且规模极小（64 变量），求解器使用高斯消元法或其他代数化简方法，可在常数时间（毫秒级）内直接计算出未知的密钥 $K$。这是密码学设计中缺乏非线性组件所导致的必然结果。

![[Pasted image 20260215000057.png]]

![[Pasted image 20260218054507.png]]
