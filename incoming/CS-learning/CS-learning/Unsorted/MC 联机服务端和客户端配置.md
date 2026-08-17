这份教程汇集了我们之前解决的所有问题，是**针对4GB内存Ubuntu主机 + Windows客户端（HMCL）** 的终极配置方案。

请严格按照顺序执行。

---

### 📝 核心配置清单
*   **游戏版本：** Minecraft 1.16.5 (Java版)
*   **服务端核心：** Paper (高性能，省内存)
*   **客户端核心：** Fabric + Sodium (钠) + FerriteCore (内存优化)
*   **Java环境：**
    *   服务端 (Ubuntu): OpenJDK 11
    *   客户端 (Windows): BellSoft Liberica JDK 17 Full (含JavaFX)
*   **内存分配策略：**
    *   系统预留 + Swap：约 0.8GB + 4GB虚拟内存
    *   服务端分配：1.2GB
    *   客户端分配：2GB

---

### 第一阶段：Ubuntu 系统底层准备 (地基)

打开终端 (Terminal) 执行：

#### 1. 救命的虚拟内存 (Swap)
4GB物理内存不够用，必须向硬盘借空间。
```bash
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

#### 2. 安装 Java 11 环境
服务端运行的最佳环境。
```bash
sudo apt update
sudo apt install openjdk-11-jre-headless -y
```
*验证：输入 `java -version` 应显示 11.0.x。*

#### 3. 开放防火墙端口
允许别人连接你的 25565 端口。
```bash
sudo ufw allow 25565/tcp
```

#### 4. 固定局域网 IP (防止断连)
*   打开 Ubuntu **设置** -> **网络/Wi-Fi** -> 点击齿轮图标。
*   **IPv4** 选项卡 -> 改为 **手动 (Manual)**。
*   **地址 (Address):** 填入你的固定IP (如 `192.168.1.105`，请先用 `ip addr` 确认你的网段)。
*   **掩码:** `255.255.255.0`
*   **网关:** 你的路由器地址 (如 `192.168.1.1`)。
*   应用并重启网络。

---

### 第二阶段：部署服务端 (造房子)

#### 1. 创建文件夹并下载核心
```bash
mkdir -p ~/mc_server
cd ~/mc_server
# 下载 Paper 1.16.5 核心
wget https://api.papermc.io/v2/projects/paper/versions/1.16.5/builds/794/downloads/paper-1.16.5-794.jar -O server.jar
```

#### 2. 首次运行生成文件
```bash
/usr/lib/jvm/java-11-openjdk-amd64/bin/java -jar server.jar nogui
```
*运行会停止，提示 EULA 错误。*

#### 3. 同意协议
```bash
nano eula.txt
```
*   将 `eula=false` 改为 `eula=true`。
*   Ctrl+O 保存，Ctrl+X 退出。

#### 4. 关键配置 (server.properties)
这是能否连上的关键。
```bash
nano server.properties
```
*   **online-mode=false** (关闭正版验证，**必改！**)
*   **view-distance=4** (视距调小，节省内存，**必改！**)
*   **max-players=10** (限制人数)
*   **server-ip=** (这里留空，不要填东西)
*   保存退出。

#### 5. 编写启动脚本 (start.sh)
```bash
nano start.sh
```
复制粘贴以下内容（已指定绝对路径Java 11）：
```bash
#!/bin/bash
/usr/lib/jvm/java-11-openjdk-amd64/bin/java -Xms1024M -Xmx1200M -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -jar server.jar nogui
```
保存退出后赋予权限：
```bash
chmod +x start.sh
```

---

### 第三阶段：Windows 客户端配置 (朋友的电脑)

#### 1. 清洗 Java 环境 (解决 JavaFX 报错)
*   卸载电脑里现有的所有 Java/JDK。
*   下载 **BellSoft Liberica JDK 17 (Full JDK)**。
    *   [下载地址](https://bell-sw.com/pages/downloads/#/java-17-lts)
    *   必须选 **Full JDK** (Package选项)。
*   一路默认安装。

#### 2. 配置 HMCL
*   下载 HMCL (Windows版)。
*   **添加账户：** 必须选 **离线模式**。
*   **用户名：** 必须是 **纯英文+数字** (如 `Friend01`)，**严禁**使用曾经登录过受限微软账号的名字。

#### 3. 安装游戏与 Mod (低配必做)
*   HMCL -> 下载 -> 1.16.5 -> **安装 Fabric**。
*   安装完成后，点击“模组管理”，下载以下 Mod：
    *   **Sodium (钠)**
    *   **Lithium (锂)**
    *   **Phosphor (磷)**
    *   **FerriteCore (内存优化)**
*   **内存设置：** HMCL 设置 -> 全局最大内存 -> **2048 MB**。

#### 4. 联机地址
*   **朋友填：** `192.168.1.105` (你在第一阶段固定的那个IP)。

---

### 第四阶段：Ubuntu 本机客户端 (你自己玩)

如果你的服务器电脑也要同时玩，配置与 Windows 类似，区别在于：
1.  下载 **HMCL jar包** (`wget ... -O hmcl.jar`)。
2.  运行命令：`java -jar hmcl.jar`。
3.  **连接地址填：** `127.0.0.1`。

---

### 第五阶段：日常操作流程 (说明书)

#### 1. 开服 (每天第一件事)
打开 Ubuntu 终端：
```bash
cd ~/mc_server
./start.sh
```
*等待出现 `Done` 或 `Timings Reset`，**不要关闭窗口**，最小化即可。*

#### 2. 管理员操作 (在终端窗口输入)
*   给自己权限：`op 你的名字`
*   改创造模式：(游戏里) `/gamemode creative`
*   踢人：`kick 名字`

#### 3. 关服 (不玩了)
**严禁直接点 X 关闭终端！**
在终端输入：
```bash
stop
```
等待保存完毕回到命令行 `$` 提示符，再关闭窗口。

---

### ⚠️ 常见故障排除
1.  **朋友提示 "Multiplayer disabled" / 多人游戏已禁用：**
    *   HMCL 没切干净。**方案：** 删除 HMCL 所有账号 -> 重启 HMCL -> 新建纯英文离线账号。
2.  **提示 "Not Authenticated" / 验证失败：**
    *   服务端 `server.properties` 里的 `online-mode` 没改成 `false`，或者改完没重启服务端。
3.  **服务器运行一会崩溃 (Out of Memory)：**
    *   把 `server.properties` 里的 `view-distance` 改成 `3`。
    *   检查 Swap 依然存在 (`free -h`)。

祝你开服顺利，享受创造的乐趣！