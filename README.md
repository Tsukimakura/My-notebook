# Tsukimakura's notebook

支持个人服务器部署与站内 AI 问答；迁移期间旧站：<https://Tsukimakura.github.io/My-notebook/>。

一个以计算机科学、信息安全与基础学科为主的学习知识库。已发布内容位于 `docs/`；`drafts/` 仅用于暂存尚未归类的材料，不会随网站发布。

## 本地开发

前置要求：Python 3.12+ 与 Node.js 22.13+（CI 使用 Node.js 22）。

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
- `main` 的检查通过后，构建并发布 GHCR 容器镜像，由个人服务器主动拉取更新。
- Python 和 Node 依赖分别固定在 `requirements.lock`、`package.json` 与 `package-lock.json`。
- 新笔记、公式和附件约定见 [CONTRIBUTING.md](CONTRIBUTING.md)。

笔记包含学习过程与 AI 辅助整理的内容；重要结论请以教材、标准和原始资料为准。欢迎通过 Issue 或页面编辑链接提出修正。

## 站内 AI 与自托管

访客自带 OpenAI、DeepSeek 或 Anthropic API key，通过后端扩展检索词、检索公开笔记并回答。key 仅在当前页面暂存，关闭面板后清除；后端不持久化，不写入应用日志。正常每次提问调用两次模型，费用由访客承担。

运行 `make ai-bootstrap` 安装后端依赖，使用 `make ai-serve` 预览完整功能。通用运行模板位于 `deploy/`；真实配置、凭据和运维记录不提交仓库。
