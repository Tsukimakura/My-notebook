# 公共工具

| 工具 | 用途 |
| --- | --- |
| `format_notes.py` | 整理或检查 Markdown 格式 |
| `check_math.mjs` | 检查公式能否由 KaTeX 渲染 |
| `check_attachments.mjs` | 检查笔记图片链接 |
| `check_privacy.py` | 检查发布文件中的凭据与私有路径 |
| `build_retrieval_index.py` | 从构建后的公开笔记生成检索索引 |
| `sync_browser_assets.mjs` | 同步、校验浏览器依赖 |
| `subset_heading_font.py` | 根据笔记文字更新标题字体子集 |
| `figure_tools.py` | 通用画布、文字、箭头、方框及 SVG／PNG／WebP 导出 |

构建、检查命令见根目录 `Makefile`。新增笔记无需添加课程专属脚本。

## 配图工具

仅在本地制作配图时安装可选依赖，不需要加入网站运行环境：

```bash
python -m pip install matplotlib Pillow
```

在仓库根目录运行自己的绘图代码，显式指定输出位置：

```python
from scripts.figure_tools import arrow, box, canvas, save_figure

fig, ax = canvas(figsize=(8, 4), xlim=(0, 8), ylim=(0, 4))
box(ax, (2, 2), "Input")
box(ax, (6, 2), "Output")
arrow(ax, (3.4, 2), (4.6, 2))
save_figure(fig, "/tmp/figure.svg")
save_figure(fig, "/tmp/figure.webp")
```

文字可通过 `text_options={"font_family": "已安装的字体名称"}` 指定字体；工具不绑定操作系统字体文件路径。SVG 保留可编辑文字，发布时可使用 WebP 避免读者缺少字体。

具体图形的参数和计算由调用者提供，工具中不保存课程内容。原有配图保留；笔记中提到的旧生成脚本可从 Git 历史查看：

```bash
git log --all -- path/to/old-script.py
git show COMMIT:path/to/old-script.py
```
