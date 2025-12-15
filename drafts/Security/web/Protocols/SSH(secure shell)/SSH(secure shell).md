## 1. SSH 基础概念

### 1.1 什么是 SSH？

- **SSH** = Secure Shell（安全外壳协议）
    
- 一种**网络协议**，用于通过不安全网络安全地访问远程计算机
    
- 提供**加密的通信会话**，替代不安全的 Telnet、rlogin、rsh 等协议
    
- 最初由 Tatu Ylönen 于 1995 年开发
    

### 1.2 为什么需要 SSH？

-  **安全性**：所有传输数据都经过加密
    
-  **完整性**：防止数据在传输过程中被篡改
    
-  **身份验证**：确保连接对方的真实身份
    
-  **灵活性**：支持多种应用场景
    

### 1.3 SSH 协议版本

- **SSH-1**：原始版本，存在安全漏洞，已废弃
    
- **SSH-2**：当前标准版本，完全重写，更安全
    
- **注意**：SSH-2 与 SSH-1 不兼容
    

---

## 2. SSH 架构和工作原理

### 2.1 SSH 协议分层结构

```text

┌─────────────────────────────────────────┐
│           连接层 (Connection Layer)       │ ← 多路复用通道管理
├─────────────────────────────────────────┤
│           用户认证层 (User Auth Layer)    │ ← 身份验证
├─────────────────────────────────────────┤
│           传输层 (Transport Layer)        │ ← 加密、完整性验证
├─────────────────────────────────────────┤
│               TCP/IP 网络层               │
└─────────────────────────────────────────┘
```
### 2.2 连接建立过程

#### 步骤 1：TCP 连接

```bash

客户端 → TCP 三次握手 → 服务器端口 22
```
#### 步骤 2：协议版本协商

```bash

客户端: "SSH-2.0-OpenSSH_8.2"
服务器: "SSH-2.0-OpenSSH_8.2"
# 双方协商使用 SSH-2 协议
```
#### 步骤 3：密钥交换（Diffie-Hellman）

```bash

# 非对称加密建立共享密钥
1. 客户端和服务器交换密钥材料
2. 各自计算得到相同的共享密钥
3. 后续通信使用对称加密
```
#### 步骤 4：服务器认证

```bash
# 客户端验证服务器身份
1. 服务器发送主机公钥
2. 客户端检查 ~/.ssh/known_hosts
3. 首次连接会显示指纹，用户确认
```
#### 步骤 5：用户认证

```bash
# 服务器验证用户身份
方法：
- 密码认证
- 公钥认证（推荐）
- 键盘交互认证
- 基于主机的认证
```
#### 步骤 6：会话通道建立

```bash

# 创建加密的通信通道
客户端 ↔ 加密隧道 ↔ 服务器

---
```
## 3. SSH 加密技术详解
[[对称加密与非对称加密 | 参考笔记]]
### 3.1 非对称加密（密钥交换）

```bash
# 用于初始密钥交换和身份验证
- RSA（传统，仍广泛使用）
- ECDSA（椭圆曲线，更安全高效）
- Ed25519（最新，性能最好）
```
### 3.2 对称加密（数据传输）

```bash
# 用于加密会话数据
- AES（高级加密标准，最常用）
- ChaCha20（移动设备性能好）
- 3DES（传统，逐渐淘汰）
```
### 3.3 哈希算法（完整性验证）

```bash
# 用于验证数据完整性
- SHA-256/SHA-512
- HMAC（基于哈希的消息认证码）
```
---

## 4. SSH 身份验证方式

### 4.1 基于密码认证

```bash

ssh username@hostname
# 然后输入密码

**优点**：简单易用  
**缺点**：易受暴力破解，需要强密码
```
### 4.2 基于公钥认证（推荐）

#### 生成密钥对

```bash
# 使用 Ed25519 算法（推荐）
ssh-keygen -t ed25519 -C "your_email@example.com"

# 或者 RSA 4096位
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```
#### 密钥文件说明

```bash

~/.ssh/
├── id_ed25519      # 私钥 (权限必须为 600)
├── id_ed25519.pub  # 公钥 (可以自由分发)
└── known_hosts     # 已知主机列表
```
#### 上传公钥到服务器

```bash
# 自动上传
ssh-copy-id -i ~/.ssh/id_ed25519.pub username@hostname

# 手动上传
cat ~/.ssh/id_ed25519.pub | ssh username@hostname "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```
#### 服务器端授权文件

```bash
# ~/.ssh/authorized_keys 权限设置
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```
### 4.3 其他认证方式

- **证书认证**：大规模环境使用
    
- **双因素认证**：密码 + 动态令牌
    
- **Kerberos**：企业环境集成
    

---

## 5. SSH 客户端详细使用

### 5.1 基本命令语法

```bash
ssh [选项] [用户@]主机名 [命令]
```
### 5.2 常用选项详解

#### 连接选项

```bash
-p port          # 指定端口（默认22）
-l username      # 指定登录用户名
-i identity_file # 指定私钥文件
```
#### 功能选项

```bash
-X               # 启用 X11 转发
-L [bind_address:]port:host:hostport    # 本地端口转发
-R [bind_address:]port:host:hostport    # 远程端口转发
-D [bind_address:]port                  # 动态 SOCKS 代理
-N               # 不执行远程命令
-f               # 后台运行
-v[vv]           # 详细输出（调试）
```
#### 会话控制选项

```bash
-o option        # 设置配置选项
-T               # 禁用伪终端分配
-t               # 强制伪终端分配
```
### 5.3 高级用法示例

#### X11 转发（图形界面）

```bash
ssh -X username@hostname
# 然后在远程执行：firefox  # 会在本地显示Firefox窗口
```
#### 本地端口转发

```bash
# 将本地端口映射到远程服务
ssh -L 8080:localhost:80 username@webserver
# 访问本地 http://localhost:8080 = 访问远程的 80 端口
```
#### 远程端口转发

```bash
# 将远程端口映射到本地服务
ssh -R 9090:localhost:3000 username@remoteserver
# 在远程访问 localhost:9090 = 访问本地的 3000 端口
```
#### SOCKS 代理
[[SOCKS5 | 参考笔记]]

```bash
# 建立本地 SOCKS5 代理
ssh -D 1080 -N username@remoteserver
# 配置浏览器使用 SOCKS5 127.0.0.1:1080
```
#### 执行复杂远程命令

```bash
# 多命令执行
ssh username@hostname "cd /var/log && tail -f system.log"

# 带环境变量的命令
ssh username@hostname "PATH=/usr/local/bin:\$PATH; python3 script.py"

# 远程 sudo 执行
echo "password" | ssh username@hostname "sudo -S command"
```
---

## 6. SSH 配置文件详解

### 6.1 客户端配置文件

位置：`~/.ssh/config`

### 6.2 配置语法示例

```bash
# 全局配置
Host *
    User known_user
    ServerAliveInterval 60
    ServerAliveCountMax 3
    TCPKeepAlive yes
    Compression yes
    IdentitiesOnly yes

# 特定服务器配置
Host myserver
    HostName example.com
    User myusername
    Port 2222
    IdentityFile ~/.ssh/id_ed25519_myserver
    ForwardAgent yes
    LocalForward 3306 localhost:3306

Host github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_github
    IdentitiesOnly yes

Host *.internal.company.com
    User admin
    ProxyJump jumpserver.company.com
    IdentityFile ~/.ssh/id_rsa_company
```
### 6.3 常用配置选项

```bash
# 连接保持
ServerAliveInterval 60    # 每60秒发送保活包
ServerAliveCountMax 3     # 最多3次无响应后断开

# 性能优化
Compression yes          # 启用压缩
CompressionLevel 6       # 压缩级别 (1-9)
ControlMaster auto       # 连接共享
ControlPath ~/.ssh/%r@%h:%p
ControlPersist 4h

# 安全设置
StrictHostKeyChecking ask # 严格主机密钥检查
UserKnownHostsFile ~/.ssh/known_hosts
HashKnownHosts yes       # 哈希已知主机文件
```
---

## 7. SSH 服务器配置

### 7.1 服务器配置文件

位置：`/etc/ssh/sshd_config`

### 7.2 重要安全配置

```bash
# 基本设置
Port 2222                        # 修改默认端口
Protocol 2                       # 只使用 SSH-2

# 访问控制
PermitRootLogin no               # 禁止 root 登录
AllowUsers user1 user2           # 只允许特定用户
DenyUsers baduser                # 拒绝特定用户
AllowGroups sshusers             # 只允许特定组

# 认证设置
PasswordAuthentication no        # 禁用密码认证
PubkeyAuthentication yes         # 启用公钥认证
PermitEmptyPasswords no          # 禁止空密码

# 其他安全设置
MaxAuthTries 3                   # 最大认证尝试次数
ClientAliveInterval 300          # 客户端保活间隔
ClientAliveCountMax 2            # 保活无响应次数
LoginGraceTime 2m                # 登录宽限时间
```
### 7.3 重启 SSH 服务

```bash
# Ubuntu/Debian
sudo systemctl restart ssh
sudo systemctl restart sshd

# CentOS/RHEL
sudo systemctl restart sshd

# 检查状态
sudo systemctl status sshd
```
---

## 8. SSH 密钥管理和安全

### 8.1 密钥生命周期管理

```bash
# 生成新密钥
ssh-keygen -t ed25519 -f ~/.ssh/new_key -C "new key"

# 更改密钥密码
ssh-keygen -p -f ~/.ssh/id_rsa

# 查看密钥指纹
ssh-keygen -lf ~/.ssh/id_ed25519.pub

# 从 known_hosts 中删除旧密钥
ssh-keygen -R hostname
```
### 8.2 SSH 代理

```bash
# 启动 SSH 代理
eval "$(ssh-agent -s)"

# 添加密钥到代理
ssh-add ~/.ssh/id_ed25519

# 列出已加载密钥
ssh-add -l

# 删除特定密钥
ssh-add -d ~/.ssh/id_rsa

# 清空所有密钥
ssh-add -D
```
### 8.3 安全最佳实践

```bash
# 1. 文件权限设置
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
chmod 600 ~/.ssh/id_*
chmod 644 ~/.ssh/*.pub
chmod 644 ~/.ssh/known_hosts
chmod 644 ~/.ssh/config

# 2. 使用强密码保护私钥
ssh-keygen -t ed25519 -o -a 100

# 3. 定期轮换密钥
# 4. 使用非标准端口
# 5. 配置防火墙限制访问
```
---

## 9. 高级功能和技巧

### 9.1 SSH 连接共享

```bash
# 在 ~/.ssh/config 中配置
Host *
    ControlMaster auto
    ControlPath ~/.ssh/%r@%h:%p
    ControlPersist 4h

# 第一个连接建立主连接
ssh username@hostname

# 后续连接复用现有连接，速度更快
ssh username@hostname
```
### 9.2 跳板机配置

```bash
# 通过跳板机连接内网服务器
Host internal-server
    HostName 192.168.1.100
    User internal-user
    ProxyJump jumpserver-user@jumpserver.com:22
    IdentityFile ~/.ssh/id_internal

# 或者使用 ProxyCommand
Host internal-server
    HostName 192.168.1.100
    User internal-user
    ProxyCommand ssh -W %h:%p jumpserver-user@jumpserver.com
```
### 9.3 远程文件传输

#### SCP (Secure Copy)

```bash
# 复制文件到远程
scp file.txt username@hostname:/path/to/destination/

# 从远程复制文件
scp username@hostname:/path/to/file.txt ./

# 递归复制目录
scp -r directory/ username@hostname:/path/

# 保留文件属性
scp -p file.txt username@hostname:/path/
```
#### SFTP (SSH File Transfer Protocol)

```bash
# 交互式 SFTP 会话
sftp username@hostname

# SFTP 常用命令
sftp> ls                    # 列出文件
sftp> cd directory         # 切换目录
sftp> lcd /local/path      # 切换本地目录
sftp> put localfile        # 上传文件
sftp> get remotefile       # 下载文件
sftp> mkdir newdir         # 创建目录
```
#### Rsync over SSH

```bash
# 同步文件（增量传输）
rsync -avz -e ssh /local/path/ username@hostname:/remote/path/

# 排除文件
rsync -avz -e ssh --exclude='*.tmp' /local/ username@hostname:/remote/

# 删除目标多余文件
rsync -avz -e ssh --delete /local/ username@hostname:/remote/

---
```
## 10. 故障排除和调试

### 10.1 连接问题诊断

```bash
# 详细输出诊断信息
ssh -vvv username@hostname

# 测试特定端口连通性
telnet hostname 22
nc -v hostname 22

# 检查 DNS 解析
nslookup hostname
dig hostname
```
### 10.2 常见错误和解决方案

#### 权限错误

```bash
# 修复 SSH 目录权限
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
chmod 600 ~/.ssh/id_*
chmod 644 ~/.ssh/*.pub
chmod 644 ~/.ssh/known_hosts
chmod 644 ~/.ssh/config
```
#### 主机密钥变更

```bash
# 删除旧的主机密钥
ssh-keygen -R hostname

# 或者手动编辑 known_hosts
vim ~/.ssh/known_hosts
```
#### 认证失败

```bash
# 检查认证方式
ssh -o PreferredAuthentications=publickey username@hostname

# 强制使用密码认证
ssh -o PreferredAuthentications=password username@hostname
```
### 10.3 服务器端日志检查

```bash
# 查看 SSH 连接日志
sudo tail -f /var/log/auth.log          # Debian/Ubuntu
sudo tail -f /var/log/secure            # CentOS/RHEL

# 查看失败登录尝试
sudo grep "Failed password" /var/log/auth.log
```
---

## 11. SSH 在自动化中的应用

### 11.1 在脚本中使用 SSH

```bash
#!/bin/bash

# 执行远程命令并获取结果
result=$(ssh username@hostname "uname -a")
echo "系统信息: $result"

# 批量执行命令
for server in server1 server2 server3; do
    ssh username@$server "sudo systemctl restart nginx"
done

# 带条件判断的执行
if ssh username@hostname "test -f /path/to/file"; then
    echo "文件存在"
else
    echo "文件不存在"
fi
```
### 11.2 自动化部署示例

```bash
#!/bin/bash

DEPLOY_HOST="user@production-server"
DEPLOY_PATH="/var/www/myapp"

echo "开始部署..."
ssh $DEPLOY_HOST "mkdir -p $DEPLOY_PATH"
rsync -avz -e ssh --delete ./dist/ $DEPLOY_HOST:$DEPLOY_PATH/
ssh $DEPLOY_HOST "chmod -R 755 $DEPLOY_PATH"
echo "部署完成"
```
---

## 12. 安全注意事项

### 12.1 安全加固措施

1. **禁用 root 登录**
    
2. **使用非标准端口**
    
3. **禁用密码认证**
    
4. **使用防火墙限制源 IP**
    
5. **定期更新 SSH 软件**
    
6. **监控登录尝试**
    
7. **使用 Fail2Ban 防护**
    

### 12.2 Fail2Ban 配置示例

```bash
# /etc/fail2ban/jail.local
[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600
```