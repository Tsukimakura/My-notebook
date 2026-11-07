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

访客自带 OpenAI、DeepSeek 或 Anthropic API key，通过后端扩展检索词、检索公开笔记并回答。供应商、模型 ID、密钥及保存时间集中在对话栏的“设置”中。模型 ID 按供应商记住，支持账户可用的任意合法 ID，不固定容易过时的模型列表。

key 默认在当前标签页临时保存，最多 2 小时；用户可主动选择在此浏览器记住 7 天或 30 天。期限从保存时计算，不随浏览或提问延长，到期后停止使用并在页面运行或下次打开时清除；可随时清除已保存 key。长期保存使用 localStorage，同源脚本和设备使用者可能读取，不应在公共设备上启用。后端不持久化 key、问题或回答，也不写入应用日志。

桌面端对话位于右侧独立栏，手机端位于下半屏，等待回答时仍可阅读笔记。站内笔记与引用通过 Material 的局部页面跳转加载，保留对话及进行中的请求；刷新或离开本站会清除内存对话并结束浏览器等待。对话最多显示最近 20 轮，后续问题携带最近最多 3 轮、受长度限制的历史重新检索。切换供应商或模型并保存会开始新对话，避免向新供应商自动发送旧记录。

正常每次提问调用两次模型，费用由访客承担；“停止等待”不保证供应商停止计费。

回答支持 Markdown 和 KaTeX 公式；原始 HTML 按文字显示，链接限制在本站。浏览器依赖随站点提供，更新依赖后使用 `npm run vendor:sync` 同步，并由 `make check` 检查一致性。

运行 `make ai-bootstrap` 安装后端依赖，使用 `make ai-serve` 预览完整功能。通用运行模板位于 `deploy/`；真实配置、凭据和运维记录不提交仓库。

默认访问 `http://127.0.0.1:8000`。端口占用时可运行 `make ai-serve PORT=8001`，并访问对应端口；`make serve` 仅提供静态预览。
