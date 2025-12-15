## 1. SOCKS5 协议基础

### 1.1 什么是 SOCKS5？

**SOCKS** = Socket Secure  
**SOCKS5** 是 SOCKS 协议的第五个版本，是一种**网络传输协议**。

### 1.2 协议特性

-  **工作在会话层**（OSI 第5层）
    
-  **支持 TCP 和 UDP 协议**
    
-  **支持多种认证方式**
    
-  **支持 IPv4 和 IPv6**
    
-  **不解析应用数据**，只是转发
    
-  **协议无关**，可代理任何网络应用
    

### 1.3 与其他代理的对比
[[代理（Proxy）| 什么是代理？]]

|代理类型|工作层级|支持协议|性能|适用场景|
|---|---|---|---|---|
|**SOCKS5**|会话层|TCP/UDP|高|通用代理、游戏、P2P|
|**HTTP 代理**|应用层|HTTP/HTTPS|中|网页浏览|
|**HTTPS 代理**|应用层|HTTPS|中|安全网页访问|

---

## 2. SOCKS5 工作原理详解

### 2.1 连接建立流程

```text
客户端 ↔ SOCKS5 服务器 ↔ 目标服务器
    1. 认证协商
    2. 连接请求  
    3. 建立连接
    4. 数据传输
```
### 2.2 详细握手过程

#### 阶段1：认证协商

```text
客户端 → 服务器：
    +----+----------+----------+
    |VER | NMETHODS | METHODS  |
    +----+----------+----------+
    | 5  |    1     | 0x00     |  # 0x00 = 无认证
    +----+----------+----------+

服务器 → 客户端：
    +----+--------+
    |VER | METHOD |
    +----+--------+
    | 5  |  0x00  |  # 选择无认证
    +----+--------+
```
#### 阶段2：连接请求

```text
客户端 → 服务器：
    +----+-----+-------+------+----------+----------+
    |VER | CMD |  RSV  | ATYP | DST.ADDR | DST.PORT |
    +----+-----+-------+------+----------+----------+
    | 5  | 0x01|   0   | 0x01 |  IPv4    |   端口    |
    +----+-----+-------+------+----------+----------+

服务器 → 客户端：
    +----+-----+-------+------+----------+----------+
    |VER | REP |  RSV  | ATYP | BND.ADDR | BND.PORT |
    +----+-----+-------+------+----------+----------+
    | 5  | 0x00|   0   | 0x01 |  IPv4    |   端口    |
    +----+-----+-------+------+----------+----------+
```
### 2.3 支持的认证方法

- `0x00`：无认证
    
- `0x01`：GSSAPI
    
- `0x02`：用户名/密码认证
    
- `0x03` - `0x7F`：IANA 分配
    
- `0x80` - `0xFE`：私有方法保留
    

### 2.4 地址类型 (ATYP)

- `0x01`：IPv4 地址
    
- `0x03`：域名（第一个字节是域名长度）
    
- `0x04`：IPv6 地址
    

---

## 3. SOCKS5 代理配置方法

## 3.1 使用 SSH 创建 SOCKS5 代理

### 基本命令

```bash
# 创建本地 SOCKS5 代理
ssh -D 1080 user@remote-server.com

# 指定端口和后台运行
ssh -D 1080 -p 2222 -N -f user@remote-server.com

# 绑定到所有接口（允许其他设备使用）
ssh -D 0.0.0.0:1080 -N user@remote-server.com

### 参数说明

- `-D 1080`：在本地 1080 端口启动 SOCKS5 代理
    
- `-p 2222`：SSH 服务器端口
    
- `-N`：不执行远程命令
    
- `-f`：后台运行
    
```
## 3.2 专用 SOCKS5 代理软件

### Shadowsocks 配置

```json
// config.json
{
    "server": "your-server.com",
    "server_port": 8388,
    "local_port": 1080,
    "password": "your-password",
    "method": "chacha20-ietf-poly1305",
    "timeout": 300,
    "fast_open": true
}
```
### 启动命令

```bash
# 客户端
sslocal -c config.json

# 服务端
ssserver -c config.json
```
### V2Ray 配置

```json
// config.json
{
    "inbounds": [{
        "port": 1080,
        "protocol": "socks",
        "settings": {
            "auth": "noauth",
            "udp": true
        }
    }],
    "outbounds": [{
        "protocol": "vmess",
        "settings": {
            "vnext": [{
                "address": "your-server.com",
                "port": 443,
                "users": [{"id": "your-uuid"}]
            }]
        }
    }]
}
```
---

## 4. 客户端配置详解

## 4.1 浏览器配置

### Firefox 配置

1. **打开设置**：菜单 → 设置
    
2. **网络设置**：向下滚动 → 网络设置 → 设置
    
3. **手动代理配置**：
    
    - **SOCKS 主机**：`127.0.0.1`
        
    - **端口**：`1080`
        
    - **SOCKS v5**：选择
        
    - **远程 DNS**：勾选（重要！防止 DNS 泄漏）
        
4. **确定保存**
    

### Chrome 配置

#### 命令行启动

```bash
# Windows
chrome.exe --proxy-server="socks5://127.0.0.1:1080" --host-resolver-rules="MAP * ~NOTFOUND , EXCLUDE 127.0.0.1"

# macOS
open -a "Google Chrome" --args --proxy-server="socks5://127.0.0.1:1080"

# Linux
google-chrome --proxy-server="socks5://127.0.0.1:1080"
```
#### 使用 SwitchyOmega 扩展

1. 安装 SwitchyOmega 扩展
    
2. 新建情景模式 → SOCKS5
    
3. 配置：
    
    - 服务器：`127.0.0.1`
        
    - 端口：`1080`
        
4. 设置自动切换规则
    

## 4.2 系统级配置

### Windows 系统代理

```bash
# 使用 netsh 设置代理
netsh winhttp set proxy proxy-server="socks=127.0.0.1:1080" bypass-list="localhost;127.0.0.1"

# 重置代理
netsh winhttp reset proxy

# PowerShell 设置
Set-ItemProperty -Path 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Internet Settings' -Name ProxyEnable -Value 1
Set-ItemProperty -Path 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Internet Settings' -Name ProxyServer -Value "socks=127.0.0.1:1080"
```
### macOS 系统代理

```bash
# 设置 SOCKS 代理
networksetup -setsocksfirewallproxy "Wi-Fi" 127.0.0.1 1080
networksetup -setsocksfirewallproxystate "Wi-Fi" on

# 查看状态
networksetup -getsocksfirewallproxy "Wi-Fi"

# 关闭代理
networksetup -setsocksfirewallproxystate "Wi-Fi" off
```
### Linux 系统代理

```bash
# 环境变量设置
export ALL_PROXY=socks5://127.0.0.1:1080
export HTTP_PROXY=socks5://127.0.0.1:1080
export HTTPS_PROXY=socks5://127.0.0.1:1080
export SOCKS_PROXY=socks5://127.0.0.1:1080

# 永久生效，添加到 ~/.bashrc 或 ~/.profile
echo 'export ALL_PROXY=socks5://127.0.0.1:1080' >> ~/.bashrc
```
## 4.3 应用程序配置

### 命令行工具配置

```bash
# curl
curl --socks5 127.0.0.1:1080 https://example.com
curl --socks5-hostname 127.0.0.1:1080 https://example.com  # 远程DNS解析

# wget (需要 proxychains)
proxychains wget https://example.com

# git
git config --global http.proxy socks5://127.0.0.1:1080
git config --global https.proxy socks5://127.0.0.1:1080

# ssh (通过代理连接)
ssh -o ProxyCommand="nc -x 127.0.0.1:1080 %h %p" user@remote-host
```
### Proxychains 配置
[[proxychains4 | 关于proxychains4]]

```bash
# 安装
sudo apt install proxychains4  # Ubuntu/Debian
sudo yum install proxychains   # CentOS/RHEL

# 配置 /etc/proxychains.conf
[ProxyList]
socks5 127.0.0.1 1080

# 使用
proxychains4 curl https://example.com
proxychains4 wget https://example.com
proxychains4 npm install
```
### 编程语言配置

#### Python

```python
import socket
import socks
import requests

# 方法1：使用 socks 库
socks.set_default_proxy(socks.SOCKS5, "127.0.0.1", 1080)
socket.socket = socks.socksocket

# 方法2：使用 requests 库
proxies = {
    'http': 'socks5://127.0.0.1:1080',
    'https': 'socks5://127.0.0.1:1080'
}
response = requests.get('https://example.com', proxies=proxies)

# 方法3：使用 urllib
import urllib.request
proxy_handler = urllib.request.ProxyHandler({
    'http': 'socks5://127.0.0.1:1080',
    'https': 'socks5://127.0.0.1:1080'
})
opener = urllib.request.build_opener(proxy_handler)
urllib.request.install_opener(opener)
```
#### Node.js

```javascript
// 使用全局代理环境变量
// 或者在代码中设置
const { SocksProxyAgent } = require('socks-proxy-agent');

const proxyAgent = new SocksProxyAgent('socks5://127.0.0.1:1080');

// 使用 axios
const axios = require('axios');
axios.get('https://example.com', {
    httpAgent: proxyAgent,
    httpsAgent: proxyAgent
});

// 使用 fetch
const fetch = require('node-fetch');
fetch('https://example.com', {
    agent: proxyAgent
});
```
#### Java

```java
System.setProperty("socksProxyHost", "127.0.0.1");
System.setProperty("socksProxyPort", "1080");

// 或者为特定连接设置
Socket socket = new Socket(Proxy.Type.SOCKS, new InetSocketAddress("127.0.0.1", 1080));
socket.connect(new InetSocketAddress("example.com", 80));
```
---

## 5. 高级配置和优化

## 5.1 多服务器负载均衡

### 使用 HAProxy 负载均衡

```bash
# haproxy.cfg
frontend socks5-frontend
    bind *:1080
    mode tcp
    default_backend socks5-servers

backend socks5-servers
    mode tcp
    balance roundrobin
    server server1 192.168.1.100:1080 check
    server server2 192.168.1.101:1080 check
    server server3 192.168.1.102:1080 check
```
## 5.2 访问控制

### 使用 iptables 限制访问

```bash
# 只允许本地访问
iptables -A INPUT -p tcp --dport 1080 -s 127.0.0.1 -j ACCEPT
iptables -A INPUT -p tcp --dport 1080 -j DROP

# 允许特定网段访问
iptables -A INPUT -p tcp --dport 1080 -s 192.168.1.0/24 -j ACCEPT
iptables -A INPUT -p tcp --dport 1080 -j DROP
```
## 5.3 性能优化

### SSH SOCKS5 优化

```bash
# 使用压缩和连接复用
ssh -D 1080 -C -o ControlMaster=auto -o ControlPersist=1h -N user@server

# 使用更快的加密算法
ssh -D 1080 -c aes128-ctr -N user@server
```
---

## 6. 安全配置

## 6.1 认证配置

### 用户名密码认证

```bash
# 支持认证的 SOCKS5 服务器配置
# 在服务器端配置要求用户名密码
ssh -D 1080 -o PreferredAuthentications=password user@server
```
### 防火墙规则

```bash
# 只允许特定IP访问SOCKS5端口
iptables -A INPUT -p tcp --dport 1080 -s 192.168.1.100 -j ACCEPT
iptables -A INPUT -p tcp --dport 1080 -j DROP
```
## 6.2 防止 DNS 泄漏

### 确保远程 DNS 解析

```bash
# 在浏览器中启用"远程DNS"
# 或者使用以下方法：

# 使用 curl 的远程DNS
curl --socks5-hostname 127.0.0.1:1080 https://example.com

# 系统级DNS配置
echo "nameserver 8.8.8.8" > /etc/resolv.conf
```
### DNS 泄漏检测

```bash
# 检测 DNS 泄漏
curl --socks5 127.0.0.1:1080 http://checkip.dyndns.org
# 或者访问：https://dnsleaktest.com
```
---

## 7. 监控和调试

## 7.1 连接状态检查

```bash
# 检查端口监听
netstat -tlnp | grep 1080
ss -tlnp | grep 1080
lsof -i :1080

# 测试代理连通性
curl --socks5 127.0.0.1:1080 -v https://httpbin.org/ip
```
## 7.2 流量监控

```bash
# 实时监控 SOCKS5 连接
tcpdump -i any -n port 1080
# 或者使用更友好的工具
sudo apt install nethogs
nethogs
```
## 7.3 日志调试

### SSH SOCKS5 调试

```bash
# 详细日志输出
ssh -vv -D 1080 user@server.com

# 记录到文件
ssh -D 1080 -E ssh.log -v user@server.com
```
---

## 8. 故障排除

## 8.1 常见问题解决

### 连接被拒绝

```bash
# 检查服务是否运行
ps aux | grep ssh
netstat -tlnp | grep 1080

# 检查防火墙
sudo ufw status  # Ubuntu
sudo firewall-cmd --list-all  # CentOS
```
### 认证失败

```bash
# 检查 SSH 密钥
ssh-add -l
# 重新添加密钥
ssh-add ~/.ssh/id_rsa
```
### DNS 解析问题

```bash
# 测试 DNS 解析
nslookup example.com
dig example.com

# 使用远程 DNS
curl --socks5-hostname 127.0.0.1:1080 https://example.com
```
---

## 9. 实际应用场景

## 9.1 开发测试

```bash
# 测试地域限制功能
proxychains4 python test_geoip.py

# 模拟不同地区访问
curl --socks5 127.0.0.1:1080 https://ifconfig.co/country
```
## 9.2 网络爬虫

```python
import requests
from itertools import cycle

proxies_list = [
    'socks5://127.0.0.1:1080',
    'socks5://127.0.0.1:1081',
    'socks5://127.0.0.1:1082'
]

proxy_pool = cycle(proxies_list)

for i in range(10):
    proxy = next(proxy_pool)
    try:
        response = requests.get('https://httpbin.org/ip', 
                              proxies={'http': proxy, 'https': proxy})
        print(f"成功使用代理: {proxy}")
    except:
        print(f"代理失败: {proxy}")
```