# Tsukimakura's notebook

<https://Tsukimakura.github.io/My-notebook/>

一个以计算机科学、信息安全与基础学科为主的学习知识库。已发布内容位于 `docs/`；`drafts/` 仅用于暂存尚未归类的材料，不会随网站发布。

## 本地开发

前置要求：Python 3.12+ 与 Node.js 20+。

```bash
make bootstrap  # 首次安装 Python 与 Node 依赖
make serve      # 启动 http://127.0.0.1:8000/
make format     # 自动统一 Markdown 格式
make check      # 严格构建与链接检查
```

不用 `make` 时，也可执行：

```bash
.venv/bin/mkdocs serve
.venv/bin/mkdocs build --strict
```

## 发布与质量控制

- 对 `main` 的提交和 Pull Request 会自动执行严格构建。
- `main` 的构建成功后，会自动更新 `gh-pages` 分支。
- Python 和 Node 依赖分别固定在 `requirements.lock`、`package.json` 与 `package-lock.json`。
- 新笔记、公式和附件约定见 [CONTRIBUTING.md](CONTRIBUTING.md)。

笔记包含学习过程与 AI 辅助整理的内容；重要结论请以教材、标准和原始资料为准。欢迎通过 Issue 或页面编辑链接提出修正。
