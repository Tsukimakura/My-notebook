这是一个非常专业的要求。在 Python 开发中，使用**虚拟环境 (Virtual Environment)** 是最佳实践，它可以隔离不同项目的依赖，避免“依赖地狱”。

这份指南将**把虚拟环境的配置完全融入到流程中**，并重点讲解如何管理它。

---

### 全流程指南：MkDocs + Material + GitHub (含虚拟环境配置)

#### 第一阶段：建立大本营 (Project & Venv Setup)

我们要先创建文件夹，并在里面建立一个独立的 Python 环境。

1.  **创建项目文件夹**
    打开终端（WSL 或 PowerShell），执行：
    ```bash
    mkdir my-notebook
    cd my-notebook
    ```

2.  **创建虚拟环境**
    执行以下命令，这会在当前目录下生成一个名为 `.venv` 的文件夹，里面包含了一套独立的 Python：
    ```bash
    python -m venv .venv
    ```

3.  **激活虚拟环境 (关键步骤)**
    *   **如果你在 WSL / Linux / macOS 下：**
        ```bash
        source .venv/bin/activate
        ```
    *   **如果你在 Windows PowerShell 下：**
        ```powershell
        .venv\Scripts\activate
        ```
        *(注：如果 Windows 报错“禁止运行脚本”，请先以管理员身份运行 PowerShell 输入 `Set-ExecutionPolicy RemoteSigned` 然后选 Y)*

    **成功标志**：你的终端提示符前面会出现一个绿色的 `(.venv)` 字样。

---

### 第二阶段：安装与初始化 (Install & Init)

**注意：** 接下来的所有操作，都必须确保终端前有 `(.venv)` 标志。

1.  **安装 MkDocs 和主题**
    此时安装的库只会存在于 `.venv` 文件夹里，不会污染你的系统。
    ```bash
    pip install mkdocs mkdocs-material mkdocs-git-revision-date-localized-plugin
    ```

2.  **初始化 MkDocs**
    因为我们已经在文件夹里了，所以用 `.` 代表当前目录：
    ```bash
    mkdocs new .
    ```

---

### 第三阶段：配置主题 (Configuration)

1.  **修改 `mkdocs.yml`**
    使用 VS Code 打开 `mkdocs.yml`，填入以下标准配置：

    ```yaml
    site_name: 我的学习笔记
    site_url: https://你的用户名.github.io/my-notebook/

    theme:
      name: material
      language: zh
      features:
        - navigation.tabs
        - navigation.top
      palette: 
        - scheme: default
          primary: indigo
          accent: indigo
          toggle:
            icon: material/weather-sunny
            name: Switch to dark mode
        - scheme: slate
          primary: indigo
          accent: indigo
          toggle:
            icon: material/weather-night
            name: Switch to light mode

    plugins:
      - search
      - git-revision-date-localized # 显示最后更新时间

    markdown_extensions:
      - admonition
      - pymdownx.highlight
      - pymdownx.superfences
    ```

---

### 第四阶段：版本控制 (Git & .gitignore)

**这一步至关重要**，我们绝对不能把虚拟环境上传到 GitHub，因为它太大了且通用性差。

1.  **创建 `.gitignore` 文件**
    在项目根目录创建 `.gitignore`，**务必包含以下内容**：
    ```text
    # 忽略虚拟环境 (千万别上传这个)
    .venv/
    
    # 忽略编译生成的网站
    site/
    
    # 忽略 Python 缓存
    __pycache__/
    ```

2.  **初始化并提交源码**
    ```bash
    git init
    git add .
    git commit -m "初始化项目 (含虚拟环境配置)"
    ```

---

### 第五阶段：连接 GitHub 与部署 (Deploy)

1.  **连接仓库**
    ```bash
    # 替换你的 Token 和仓库地址
    git remote add origin https://用户名:Token@github.com/用户名/my-notebook.git
    git branch -M main
    git push -u origin main
    ```

2.  **部署网站**
    ```bash
    mkdocs gh-deploy
    ```

---

### ❓ 重点解答：重新启动后，原来的虚拟环境如何使用？

当你关闭终端、重启电脑或 VS Code 后，那个绿色的 `(.venv)` 标志会消失，这意味着你回到了系统的全局 Python 环境。如果你此时直接运行 `mkdocs`，它会报错说“找不到命令”。

**你不需要重新安装，只需要“重新激活”。**

#### 日常回归工作的标准动作：

1.  **打开项目文件夹**
    在终端里 `cd` 进入你的 `my-notebook` 文件夹。

2.  **重新激活环境**
    *   **WSL / Linux**:
        ```bash
        source .venv/bin/activate
        ```
    *   **Windows**:
        ```powershell
        .venv\Scripts\activate
        ```

3.  **确认状态**
    看到终端前面出现 `(.venv)` 后，你就可以正常执行 `mkdocs serve` 或 `mkdocs gh-deploy` 了。

#### 💡 高手技巧：VS Code 自动激活

如果你用 VS Code 打开了这个文件夹：
1.  按 `Ctrl + Shift + P`。
2.  输入 `Python: Select Interpreter`。
3.  在列表中选择带有 `('.venv': venv)` 字样的那个选项（通常标有星星或推荐）。
4.  **效果**：以后你在 VS Code 里新建终端（Ctrl + `~`）时，VS Code 会**自动**帮你运行激活命令，你一打开终端就能直接用了！