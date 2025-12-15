[[SSH(secure shell) | SSH详解]]
## 最基本的 SSH 连接

```bash
ssh 用户名@主机地址
```
**示例：**

```bash
ssh user@192.168.1.100
ssh admin@example.com
```
## 常用参数详解

### 1. 指定端口 `-p`

```bash
ssh -p 端口号 用户名@主机地址
```
**示例：**

```bash
ssh -p 2222 user@example.com    # 连接2222端口
ssh -p 10802 user@10.214.160.13 # 某个实际案例
```
### 2. 执行命令（不进入交互式shell）

```bash
ssh 用户名@主机地址 "命令"
```
**示例：**

```bash
ssh user@example.com "ls -la"          # 远程执行ls命令
ssh user@example.com "whoami; pwd"     # 执行多个命令
```
### 3. 使用密钥登录 `-i`

```bash
ssh -i 密钥文件路径 用户名@主机地址
```
**示例：**

```bash
ssh -i ~/.ssh/id_rsa user@example.com
ssh -i my_key.pem ubuntu@server.com
```
### 4. 建立 SOCKS 代理 `-D`（你在CTF中使用的）

```bash
ssh -D 本地端口 用户名@主机地址
```
**示例：**

```bash
ssh -D 10899 user@example.com    # 本地10899端口开启SOCKS代理
```
### 5. 不执行远程命令 `-N`

```bash
ssh -N 用户名@主机地址
```
**示例：**

```bash
ssh -N -D 10899 user@example.com  # 只建立隧道，不执行命令
```
### 6. 后台运行 `-f`

```bash
ssh -f 用户名@主机地址
```
**示例：**

```bash
ssh -f -N -D 10899 user@example.com  # 后台建立代理隧道
```
### 7. 详细输出 `-v`

```bash
ssh -v 用户名@主机地址
```
**示例：**

```bash
ssh -v user@example.com    # 显示连接详细信息
ssh -vv user@example.com   # 更详细的信息
ssh -vvv user@example.com  # 最详细的信息
```
## 实用组合

### 建立后台代理隧道

```bash
ssh -f -N -D 10899 user@example.com

- `-f`：后台运行
    
- `-N`：不执行远程命令
    
- `-D`：建立SOCKS代理
    
```
### 端口转发

```bash
# 本地端口转发
ssh -L 本地端口:目标主机:目标端口 用户名@跳板机

# 远程端口转发  
ssh -R 远程端口:本地主机:本地端口 用户名@远程服务器
```
**示例：**

```bash
ssh -L 8080:internal.server.com:80 user@gateway.com
```
## SSH 连接过程

### 1. 首次连接

第一次连接某个主机时，会显示：

```text

The authenticity of host 'example.com (1.2.3.4)' can't be established.
RSA key fingerprint is SHA256:xxxxxxxxxxxxxxxx.
Are you sure you want to continue connecting (yes/no/[fingerprint])?

输入 `yes` 后，主机的指纹会被保存到 `~/.ssh/known_hosts`
```
### 2. 认证方式

- **密码认证**：输入用户密码
    
- **密钥认证**：使用公钥/私钥对，无需密码
    

### 3. 连接成功

成功连接后，你会看到远程服务器的命令提示符：

```text

user@remote-server:~$
```
## 退出 SSH 连接

```bash
exit    # 退出连接
logout  # 退出连接
Ctrl+D  # 快捷键退出
```
## 配置文件 ~/.ssh/config

可以创建配置文件来简化常用连接：

```bash
# 编辑配置文件
nano ~/.ssh/config
```
**配置文件示例：**

```text
Host myserver
    HostName example.com
    User myusername
    Port 2222
    IdentityFile ~/.ssh/my_key

Host work
    HostName 192.168.1.100
    User admin
```
**使用配置文件中定义的主机：**

```bash
ssh myserver    # 代替 ssh -p 2222 myusername@example.com -i ~/.ssh/my_key
ssh work        # 代替 ssh admin@192.168.1.100
```
## 故障排查

### 连接被拒绝

```bash
ssh -v user@example.com  # 使用详细模式查看错误原因
```
### 忽略主机密钥检查（不推荐，仅用于测试）

```bash
ssh -o StrictHostKeyChecking=no user@example.com
```
### 连接超时设置

```bash
ssh -o ConnectTimeout=10 user@example.com  # 10秒超时

## 在CTF中的典型用法

基于你之前的题目，典型的SSH用法是：

bash

# 建立SOCKS5代理隧道
ssh user@10.214.160.13 -p 10802 -D 10899 -N

# 输入密码后，连接建立但不会进入shell
# 在另一个终端通过代理访问目标网络
```
## 总结

SSH 的基本语法模式：

```bash
ssh [选项] [用户名@]主机名 [命令]
```
最常用的选项：

- `-p`：指定端口
    
- `-i`：指定密钥文件
    
- `-D`：建立SOCKS代理
    
- `-N`：不执行远程命令
    
- `-v`：详细输出