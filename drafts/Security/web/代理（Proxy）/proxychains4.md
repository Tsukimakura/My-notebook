## 什么是 proxychains4？

**proxychains4** 是一个强制任何应用程序的 TCP 连接通过代理的工具（如 HTTP/SOCKS4/SOCKS5）。它通过预加载一个动态库来工作，该库会重写程序的网络连接函数。

## 工作原理

proxychains4 使用 `LD_PRELOAD` 技术来拦截程序的网络调用：

```text
应用程序 → proxychains 钩子 → 代理服务器 → 目标服务器
```
## 安装方法

### Ubuntu/Debian:

```bash
sudo apt update
sudo apt install proxychains4
```
### Kali Linux:

```bash
sudo apt install proxychains4
```
### 从源码编译：

```bash
git clone https://github.com/rofl0r/proxychains-ng.git
cd proxychains-ng
./configure --prefix=/usr --sysconfdir=/etc
make
sudo make install
```
## 配置文件

### 默认配置文件位置：

- `/etc/proxychains.conf`
    
- `~/.proxychains/proxychains.conf`
    

### 创建自定义配置文件：

```bash
# 创建简单配置
echo "socks5 127.0.0.1 10899" > my_proxy.conf

# 或者创建完整配置
cat > my_proxy.conf << 'EOF'
strict_chain
proxy_dns
remote_dns_subnet 224
tcp_read_time_out 15000
tcp_connect_time_out 8000
localnet 127.0.0.0/255.0.0.0

[ProxyList]
socks5 127.0.0.1 10899
EOF
```
## 基本使用方法

### 1. 基本语法

```bash
proxychains4 [选项] <命令> [参数]
```
### 2. 指定配置文件

```bash
proxychains4 -f 配置文件路径 命令
```
**示例：**

```bash
proxychains4 -f proxy.conf curl http://example.com
proxychains4 -f /home/user/my_proxy.conf nmap target.com
```
### 3. 常用选项

- `-f <file>`：使用指定的配置文件
    
- `-q`：安静模式（不显示 proxychains 信息）
    
- `-v`：详细模式
    

## 配置详解

### 代理链模式

1. **dynamic_chain**（动态链）：
    
    `dynamic_chain`
    
    - 按顺序尝试代理列表中的代理
        
    - 如果某个代理失败，跳过它继续尝试下一个
        
2. **strict_chain**（严格链）：
    
    `strict_chain`
    
    - 严格按照代理列表顺序使用
        
    - 所有代理必须可用
        
3. **random_chain**（随机链）：
    
    `random_chain`
    `chain_len = 2`
    
    - 随机选择代理
        
    - `chain_len` 指定使用的代理数量
        

### 代理类型语法

```text
type host port [user pass]
```
支持的类型：

- `http` - HTTP/HTTPS 代理
    
- `socks4` - SOCKS4 代理
    
- `socks5` - SOCKS5 代理
    

**示例：**

```text
socks5 127.0.0.1 10899
http 192.168.1.1 8080 username password
socks4 10.0.0.1 1080
```
## 实际使用示例

### 1. CTF 场景

```bash
# 建立 SSH SOCKS 代理
ssh user@10.214.160.13 -p 10802 -D 10899 -N

# 创建代理配置
echo "socks5 127.0.0.1 10899" > proxy.conf

# 通过代理扫描
proxychains4 -f proxy.conf nmap -sT -Pn -p9000-11000 192.168.192.3 -vv

# 通过代理访问网页
proxychains4 -f proxy.conf curl http://192.168.192.8:10822/
```
### 2. 网页浏览

```bash
# 通过代理启动 Firefox
proxychains4 firefox

# 通过代理启动 Chromium
proxychains4 chromium-browser
```
### 3. 软件下载和更新

```bash
# 通过代理更新系统
proxychains4 sudo apt update

# 通过代理下载文件
proxychains4 wget http://example.com/file.zip

# 通过代理使用 git
proxychains4 git clone https://github.com/user/repo.git
```
### 4. 网络扫描

```bash
# 通过代理进行端口扫描
proxychains4 nmap -sS target.com

# 通过代理进行目录爆破
proxychains4 gobuster dir -u http://target.com/ -w wordlist.txt

# 通过代理使用 Metasploit
proxychains4 msfconsole
```
## 高级用法

### 1. 多代理链

```bash
# 配置多个代理
cat > chain.conf << 'EOF'
strict_chain
proxy_dns

[ProxyList]
socks5 127.0.0.1 10899
http 192.168.1.100 8080
socks4 10.0.0.1 1080
EOF

proxychains4 -f chain.conf curl http://example.com
```
### 2. 环境变量方式

```bash
# 设置环境变量（临时）
export PROXYCHAINS_CONF_FILE=/path/to/proxy.conf
proxychains4 curl http://example.com
```
### 3. 调试模式

```bash
# 查看详细的连接信息
proxychains4 -f proxy.conf curl -v http://example.com
```
## 故障排除

### 常见问题及解决方案

1. **"error: no valid proxy found in config"**
    
    ```bash  
    # 确保配置文件包含 [ProxyList] 部分
    echo "[ProxyList]" > proxy.conf
    echo "socks5 127.0.0.1 10899" >> proxy.conf
    ```
1. **连接超时**
    
    ```bash  
    # 在配置文件中增加超时时间
    echo "tcp_connect_time_out 15000" >> proxy.conf
    echo "tcp_read_time_out 15000" >> proxy.conf
    ```
1. **DNS 解析问题**
    
    ```bash  
    # 启用代理 DNS
    echo "proxy_dns" >> proxy.conf
    ```
1. **权限问题**
    
    ```bash  
    # 如果遇到权限错误，检查文件权限
    chmod 644 proxy.conf
    ```

### 验证代理是否工作

```bash
# 测试代理连接
proxychains4 -f proxy.conf curl -I http://www.google.com

# 检查真实IP地址
proxychains4 -f proxy.conf curl http://ipinfo.io/ip
```
## 在脚本中使用

### 示例脚本：

```bash
#!/bin/bash

# 设置代理配置
PROXY_CONF="proxy.conf"

# 检查代理是否可用
check_proxy() {
    echo "检查代理连接..."
    proxychains4 -f $PROXY_CONF curl -s http://www.google.com > /dev/null
    if [ $? -eq 0 ]; then
        echo "✓ 代理工作正常"
        return 0
    else
        echo "✗ 代理连接失败"
        return 1
    fi
}

# 主函数
main() {
    if check_proxy; then
        echo "开始扫描..."
        proxychains4 -f $PROXY_CONF nmap -sT -Pn $1
    else
        echo "请先检查代理配置"
        exit 1
    fi
}

main "$@"
```
## 安全注意事项

1. **不要使用 root 运行**：除非必要，避免使用 sudo 运行 proxychains4
    
2. **配置文件权限**：确保代理配置文件权限正确（644）
    
3. **敏感信息**：如果配置中包含密码，确保文件安全
    
4. **日志记录**：注意 proxychains 可能会在系统日志中留下记录
    

## 性能优化

1. **调整超时设置**：
    
    ```bash
    tcp_connect_time_out 8000
    tcp_read_time_out 15000
    ```
1. **禁用 DNS 代理**（如果不需要）：
    
    ```bash  
    # proxy_dns
    ```
1. **使用更快的代理链模式**：
    
    ```bash  
    dynamic_chain
    ```