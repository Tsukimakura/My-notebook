# 更新现有部署

本仓库提交不会立即更新服务器；推送到 `main` 后，CI 会发布 GHCR 镜像，服务器上的 `notebook-update.timer` 默认每 5 分钟检查一次。下面先暂停自动更新，完成配置后再启用。没有安装此定时器的部署可跳过对应命令。

## 1. 暂停自动更新

在服务器执行：

```bash
sudo systemctl stop notebook-update.timer
```

## 2. 推送代码并准备配置

本地执行 `git push origin main`，等待 GitHub Actions 的检查和镜像发布通过。把本仓库的 `deploy/compose.yml` 同步到服务器原部署目录（服务模板使用 `/opt/notebook`）。保留服务器现有 `.env`、`compose.override.yml` 和 `.state/`。

本次 Compose 内存上限为 `768m`。若服务器的覆盖配置另设了更低上限，也需同步调整。

在实际使用的 Caddy 站点配置中，将请求体限制改为：

```caddyfile
request_body {
    max_size 12MB
}
```

保留其他站点配置；[Caddy 模板](Caddyfile.container.example)供对照。容器化 Caddy 可按实际容器名和配置挂载路径校验、重载：

```bash
docker exec <Caddy容器名> caddy validate --config /etc/caddy/Caddyfile
docker exec <Caddy容器名> caddy reload --config /etc/caddy/Caddyfile
```

## 3. 更新并验证

在服务器原部署目录执行：

```bash
cd /opt/notebook
bash update.sh
docker compose --env-file .env --env-file .state/current.env -f compose.yml -f compose.override.yml ps
sudo systemctl start notebook-update.timer
```

`update.sh` 会等待健康检查，失败时恢复上一版本。访问站点后刷新页面，试一次普通提问和一张不在笔记中的截图，检查图片问答、配图、公式与“继续生成”。

## 问答与附件约定

- 选择模型并填写 key 即可提问；支持图片的模型会自动读取相关笔记原图，最多 4 张，无需开关。`deepseek-flash` 支持图片；当前 DeepSeek PDF 输入尚未接入，PDF 可换模型或转截图。
- 上传、粘贴、拖放的图片无需存在于笔记中。支持 PNG、JPEG、WebP、PDF、UTF-8 TXT／Markdown；未接入 DOCX。附件仅在当前标签页暂存，移除后停止发送，刷新后须重选；问答文字和文件名仍保存在浏览器会话中。
- 每次最多 4 个附件，单个 4 MiB、合计 8 MiB；PDF 每份最多 30 页、合计 40 页。图片会校验像素并重新编码；解析子进程受内存、CPU 和时间限制。服务器不保存上传文件，也不执行模型脚本或抓取任意远程文件。
- 单次生成预算为 32,768 tokens，含模型思考。未完成时，“继续生成”会沿用原题与资料，补到同一回答；这是一次新的模型调用，不是读取尚未生成的隐藏正文。
