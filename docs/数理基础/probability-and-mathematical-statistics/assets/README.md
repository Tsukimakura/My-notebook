---
title: "概率论第一章图片来源与许可"
status: draft
tags: [math-physics, probability]
created: 2026-10-06
updated: 2026-10-06
sources:
  - "PS ch1-2026.pdf"
  - "第二节课 course_87789_sub_1973627/course_content.md 与补充截图"
---

# 概率论第一章图片来源与许可

本目录的六张插图均为本笔记新绘制的教学图，没有复制课件图像、页面版式或原作者标识。图中概念、模型及例题来源见各篇笔记和本目录的 `source-manifest.json`。

| 图片 | 用途 | 来源依据 |
| --- | --- | --- |
| `event-operations.webp` | 并、交、差与补事件 | 主课件第 21–29 页 |
| `frequency-stability.webp` | 三组公平硬币模拟的累计频率 | 主课件第 37–40 页；数据为本次模拟 |
| `birthday-probability.webp` | 理想生日模型的人数与碰撞概率 | 主课件第 59–60 页 |
| `buffon-needle.webp` | 针的几何关系与参数空间相交区域 | 第二节课 `ppt_035`–`ppt_041` |
| `total-probability-tree.webp` | 交通方式、迟到与后验概率 | 主课件第 91 页 |
| `monty-hall.webp` | 三门问题按初始车位置的策略分类 | 主课件第 92 页；第二节课讲解 |

展示图片采用 WebP；同名 SVG 为可编辑矢量版本。`figure-source.py` 保存生成代码，使用 Python、NumPy、Matplotlib、Pillow 与本地 Noto CJK 字体，固定随机种子，便于复现。源代码默认在其所在目录输出文件。

这些新绘制的图片及生成代码作为本笔记库的配套资源维护，未单独声明开放许可。课件、教材和课堂识别材料的原有权利仍归各自权利人；本目录不对这些原始资料授予许可。

模拟图只用于说明频率波动，不能解释为原始课堂数据或极限定理的证明；维恩图不是按照实际概率面积绘制；蒲丰投针示意图采用 $a=1,b=0.7$ 展示短针情形。
