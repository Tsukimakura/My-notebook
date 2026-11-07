---
title: "概率论笔记图片来源与许可"
status: draft
tags: [math-physics, probability]
created: 2026-10-06
updated: 2026-11-03
sources:
  - "PS ch1-2026.pdf"
  - "第二节课 lecture-record-20/course_content.md 与补充截图"
  - "test1/PS ch2-2026(1).pdf、PS ch3-2026.pdf 与课堂识别材料"
  - "用户提供的教材习题图片与桌面 prob-exercises"
---

# 概率论笔记图片来源与许可

本目录的插图均为本笔记自绘教学图，没有复制课件图像、页面版式或原作者标识。图中概念、模型及例题来源见各篇笔记和本目录的 `source-manifest.json`。

| 图片 | 用途 | 来源依据 |
| --- | --- | --- |
| `event-operations.webp` | 并、交、差与补事件 | 主课件第 21–29 页 |
| `frequency-stability.webp` | 三组公平硬币模拟的累计频率 | 主课件第 37–40 页；数据为本次模拟 |
| `birthday-probability.webp` | 理想生日模型的人数与碰撞概率 | 主课件第 59–60 页 |
| `buffon-needle.webp` | 针的几何关系与参数空间相交区域 | 第二节课 `ppt_035`–`ppt_041` |
| `total-probability-tree.webp` | 交通方式、迟到与后验概率 | 主课件第 91 页 |
| `monty-hall.webp` | 三门问题按初始车位置的策略分类 | 主课件第 92 页；第二节课讲解 |
| `pairwise-independence.webp` | 两两独立而非相互独立的四结果模型 | 第一章课件第 99 页 |
| `discrete-models.webp` | 二项、泊松、几何分布的 PMF | 第二章课件第 17–34 页 |
| `cdf-and-density.webp` | PMF、CDF、密度与面积的区别 | 第二章课件第 39–52 页 |
| `normal-distribution.webp` | 正态分布位置、尺度及右尾面积 | 第二章课件第 66–82 页 |
| `transformation-branches.webp` | 绝对值及余弦变换的有效反解 | 第二章课件第 94–108 页；习题二 B33、B36 |
| `joint-support-and-marginals.webp` | 二维支撑的水平、竖直扫描 | 第三章课件第 43–48 页；习题三 B4 |
| `conditional-regions.webp` | 抛物线、三角支撑与事件交集 | 习题三 A20、B4、B5 |
| `bivariate-normal.webp` | 不同相关参数的二维正态等密度线 | 第三章课件第 63–69 页 |

展示图片采用 WebP；同名 SVG 为可编辑矢量版本。前六张的生成代码为 `figure-source.py`，其余八张为 `distribution-figures.py`，使用 Python、NumPy、Matplotlib、Pillow 与 Noto CJK 字体。随机模拟使用固定种子，其他图按公式绘制。源码在其所在目录输出文件。

习题文字根据用户提供的教材题图转述，公式与解析重新整理、核算。`exercise-sources.json` 记录题号、所在笔记、外部原图文件名及校验值，保留来源线索。

这些新绘制的图片及生成代码作为本笔记库的配套资源维护，未单独声明开放许可。课件、教材和课堂识别材料的原有权利仍归各自权利人；本目录不对这些原始资料授予许可。

模拟图只用于说明频率波动，不能解释为原始课堂数据或极限定理的证明；维恩图不是按照实际概率面积绘制；蒲丰投针示意图采用 $a=1,b=0.7$ 展示短针情形。
