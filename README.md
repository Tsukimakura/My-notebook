# Tsukimakura's notebook

计算机科学、信息安全与数理基础笔记。

[在线阅读](https://notes.tsukimakura.com/) · [编写约定](CONTRIBUTING.md)

发布内容在 `docs/`，未发布草稿在 `drafts/`。

## 本地维护

需要 Python 3.12+、Node.js 22.13+。

```bash
make bootstrap  # 安装依赖
make serve      # 预览笔记
make format     # 整理 Markdown 格式
make check      # 检查公式、附件并严格构建
```

问答调试：先运行 `make ai-bootstrap`，再运行 `make ai-serve`；测试使用 `make test`。

## 发布

CI 检查笔记、构建检索索引并运行测试。`main` 检查通过后发布 GHCR 镜像，服务器拉取更新；部署模板见 [deploy/](deploy/)。凭据与服务器配置不提交仓库。

## 站内问答

问答使用访客提供的 API key，调用费用由访客承担。对话记录保存在浏览器；后端不将密钥与对话写入日志或磁盘。
