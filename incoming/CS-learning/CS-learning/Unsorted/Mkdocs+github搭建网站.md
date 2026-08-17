### 一、 核心概念与工作流机制

**1. 问题：执行 gh-deploy 后，GitHub 上有网站，但源码分支（main）是空的。**

- **原因**：混淆了“编译发布”与“源码提交”。mkdocs gh-deploy 只是把编译好的 HTML 丢到了 gh-pages 分支，不会管你的 Markdown 源码。
    
- **解决方案**：建立双重提交习惯——**“源码归源码，网页归网页”**。
    
- **关键操作**：
    
    1. **忽略垃圾文件**：防止编译产物污染源码。
        
        codeBash
        
        ```
        echo "site/" >> .gitignore
        ```
        
    2. **提交源码（日常备份）**：
        
        codeBash
        
        ```
        git add .
        git commit -m "更新笔记内容"
        git push origin main
        ```
        
    3. **发布网站（对外展示）**：
        
        codeBash
        
        ```
        mkdocs gh-deploy
        ```
        

**2. 问题：本地生成了大量 site/ 文件，Git 提示几百个更改。**

- **解决方案**：通过 .gitignore 告诉 Git 忽略该文件夹。
    
- **补救命令**（如果已经不小心暂存了）：
    
    codeBash
    
    ```
    git restore --staged site/
    ```
    

---

### 二、 仓库连接与认证（Token）

**1. 问题：重新连接仓库时，Push 失败或 mkdocs gh-deploy 报 Exit status 128。**

- **原因**：
    
    - 本地残留了旧的 gh-pages 分支记录，与新仓库冲突。
        
    - mkdocs 脚本在后台运行，无法弹出密码输入框，导致权限验证失败。
        
- **解决方案**：
    
    - 清理旧分支：git branch -D gh-pages 和 rm -rf site。
        
    - **使用 Token 进行认证**（最核心的解决方案）。
        

**2. 问题：忘记 Token 或不知道如何配置。**

- **解决方案**：
    
    1. 在 GitHub 生成新 Token（权限勾选 repo）。
        
    2. 将 Token 嵌入到远程仓库地址中，让 Git 自带“钥匙”。
        
- **关键命令**：
    
    codeBash
    
    ```
    # 格式：https://用户名:Token@github.com/用户名/仓库名.git
    git remote set-url origin https://Tsukimakura:ghp_AbC123...@github.com/Tsukimakura/My-page.git
    ```
    

---

### 三、 网络与 Git 传输故障

**1. 问题：GnuTLS recv error (-110) / TLS connection non-properly terminated。**

- **原因**：WSL 环境下 Git 使用的 GnuTLS 库与 HTTP/2 协议兼容性不好，或者国内网络连接 GitHub 不稳定。
    
- **解决方案**：降级协议或配置代理。
    
- **关键命令**（按顺序尝试）：
    
    - **降级协议（最有效）**：
        
        codeBash
        
        ```
        git config --global http.version HTTP/1.1
        ```
        
    - **设置代理**（如果你开了 VPN，假设端口 7890）：
        
        codeBash
        
        ```
        git config --global http.proxy http://127.0.0.1:7890
        ```
        
    - **忽略 SSL 验证**（救急用）：
        
        codeBash
        
        ```
        git config --global http.sslVerify false
        ```
        

**2. 问题：fatal: 'Tsukimakura/My-notebook' does not appear to be a git repository。**

- **原因**：误把仓库路径当成了 Git 的远程代号。Git push 后面跟的应该是代号（如 origin）。
    
- **解决方案**：理解 origin 就是那个长 URL 的别名。
    
- **正确命令**：
    
    codeBash
    
    ```
    git push origin main
    ```
    

---

### 四、 跨平台（Windows/WSL）协作流程

**1. 问题：Obsidian 无法打开 WSL 中的文件夹（报错 EISDIR）。**

- **原因**：Obsidian（Electron应用）的文件监控机制无法稳定支持 WSL 的网络路径（\\wsl.localhost\...）。
    
- **解决方案**：**“双克隆策略”** —— Windows 负责写，WSL 负责发。
    

**2. 问题：Windows 终端无法识别 git 命令。**

- **原因**：Git 安装后未添加到 Windows 环境变量 Path 中。
    
- **解决方案**：将 C:\Program Files\Git\cmd 添加到用户环境变量 Path 中。
    

**3. 最终确定的最佳工作流**：

1. **Windows 端**：
    
    - 在 C:\Users\HP\Documents 下 git clone 仓库。
        
    - 用 **Obsidian** 打开此文件夹，享受丝滑的写作体验。
        
    - 写完后，在 Windows 终端执行：
        
        codeCmd
        
        ```
        git add .
        git commit -m "work from windows"
        git push
        ```
        
2. **WSL 端（VS Code）**：
    
    - 在 ~/projects/notes 下保留仓库。
        
    - 每次需要发布网站时，先同步 Windows 的修改：
        
        codeBash
        
        ```
        git pull
        ```
        
    - 然后部署：
        
        codeBash
        
        ```
        mkdocs gh-deploy
        ```
        

---

### 五、 常用命令速查表（建议保存）

|                    |                                                             |
| ------------------ | ----------------------------------------------------------- |
| 场景                 | 命令                                                          |
| **日常提交源码**         | git add . <br> git commit -m "备注" <br> git push origin main |
| **发布网站**           | mkdocs gh-deploy                                            |
| **强制重新发布**         | mkdocs gh-deploy --force (解决冲突时用)                           |
| **拉取最新代码**         | git pull                                                    |
| **查看远程地址**         | git remote -v                                               |
| **修改远程地址(含Token)** | git remote set-url origin https://User:Token@...            |
| **修复网络报错**         | git config --global http.version HTTP/1.1                   |
