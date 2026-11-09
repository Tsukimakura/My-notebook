# 附件与笔记配图

问答输入框的“附件”支持上传和拖放 PNG、JPEG、WebP、PDF、DOCX、UTF-8 TXT／Markdown；图片也可直接粘贴。附件保留在当前标签页的对应对话中，后续问题会继续发送，移除后停止发送。刷新、关闭页面后须重选。附件文件不会写入会话记录或导出；文件名及包含附件信息的问答文字仍会保存。

“更多 → 读取相关笔记配图”默认关闭。开启后，后端从本轮检索到的小节中选择最多 4 张公开本站原图发送给模型；回答只能展示这批已验证的图片。SVG、外部图片地址、任意远程文件地址和模型生成的可执行内容不被接入。

图片与 PDF 可使用 OpenAI／Anthropic 接口，但所选模型必须支持相应输入。DOCX 只提取正文和表格文字，不读取其中的配图；需要图文一起分析时请转成 PDF。当前 DeepSeek 接口仅接入文字附件（含 DOCX 正文）。模型拒绝附件时不会自动换模型或重复生成。支持扫描 PDF 的能力由所选视觉模型决定；本站不运行 OCR 服务。

## 限额与部署

- 每次最多 4 个附件；单个最多 4 MiB，合计最多 8 MiB；同一标签页各对话暂存总量最多 16 MiB。
- 图片最多 800 万像素，边长最多 8,192；重新编码后长边最多 1,600，去掉原图元数据。
- PDF 每份最多 30 页、合计最多 40 页；不接受加密 PDF。DOCX／TXT／Markdown 每份最多 60,000 字符。DOCX 不解压到磁盘，不执行宏或字段，不加载外部资源。
- JSON 请求硬上限 12 MiB；纯文字请求仍为 20,000 bytes。API 保留原有同源校验、密钥认证、速率及并发限制。
- 解析器在独立子进程中运行，限制地址空间为 192 MiB、CPU 时间为 6 秒、墙钟时间为 10 秒。每个服务实例同时只解码一批附件，最多接收 4 个并发问题。
- 上传文件不写入磁盘。模型调用及其短时任务状态仅驻留内存；文件内容不写入访问日志或错误信息。

已有部署须同步将 Caddy 的请求体上限改为 `12MB`，参照 [Caddyfile.container.example](Caddyfile.container.example)。否则较大的附件会在到达应用前被代理拒绝。更新后的 Compose 将容器内存上限从 384 MiB 调为 768 MiB；附件解析库固定在 `backend/requirements.txt`。自定义代理、容器覆盖配置也需同步调整。

输入附件可能用于检索词提取和回答两个模型调用，PDF 页图会增加输入用量。开启笔记配图也会增加输入用量，费用由当前供应商账户承担。

## 接口依据

- [OpenAI 图片输入](https://developers.openai.com/api/docs/guides/images-vision)
- [OpenAI 文件输入](https://developers.openai.com/api/docs/guides/file-inputs)
- [Anthropic 图片输入](https://platform.claude.com/docs/en/build-with-claude/vision)
- [Anthropic PDF 输入](https://platform.claude.com/docs/en/build-with-claude/pdf-support)

生成新图片、执行代码、联网搜索和外部工具调用仍需独立接入及各自的权限、费用和结果处理，未随附件功能启用。
