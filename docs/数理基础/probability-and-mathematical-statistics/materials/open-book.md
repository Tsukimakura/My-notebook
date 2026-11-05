---
title: "开卷资料：知识讲解与重点题解"
status: draft
tags: [math-physics, probability, review, printable]
created: 2026-11-05
updated: 2026-11-05
sources:
  - "本课程第一章至第三章 §3.4 的 14 篇章节笔记"
  - "第一次小测：重点题目与标准解答，12 道主练题"
  - "黄炜：PS ch1–ch3；课堂记录与原始课件"
---

# 开卷资料：知识讲解与重点题解

两份独立的 A4 打印材料，均为黑白双栏、正文 11 磅。PDF 只使用纸面页码和题号，不依赖链接。

## 知识讲解（12 页）

[下载知识讲解 PDF](assets/open-book/probability-knowledge.pdf)

按概念含义、公式、适用条件和计算方法组织，不穿插题解；第 1 页有目录。

| 页码 | 内容 |
| --- | --- |
| 1–2 | 随机事件、概率公理、计数、抽样与几何概型 |
| 3–4 | 条件概率、全概率、贝叶斯、独立性与可靠性 |
| 5–6 | 随机变量、常用离散分布、CDF、密度与混合型 |
| 7–8 | 均匀、指数、泊松与几何的联系、正态标准化 |
| 9 | 随机变量函数、有效反解与概率积分变换 |
| 10–11 | 联合、边际、条件、联合 CDF、二维密度与区域积分 |
| 12 | 随机变量独立性、二维正态及条件正态 |

## 重点题目与标准解答（6 页，12 题）

[下载重点题目与标准解答 PDF](assets/open-book/probability-exercises.pdf)

选自[此前整理的重点题目](quiz-1-key-problems.md)的 12 道主练题。每页两题，每题保留完整题意、标准解答与应用提示。

| 页码 | 题号与考点 |
| --- | --- |
| 1 | 1–2：无放回计数、全概率与贝叶斯 |
| 2 | 3–4：条件独立、二项、超几何与截断等待 |
| 3 | 5–6：泊松计数、密度归一化、CDF 与重复试验 |
| 4 | 7–8：指数寿命混合、正态标准化与反求参数 |
| 5 | 9–10：变量变换、联合表与条件分布 |
| 6 | 11–12：二维区域积分、边际与条件密度 |

## 打印与源码

打印选 **A4、实际大小／100%**；双面选**长边翻转**。知识册需 6 张纸，题目册需 3 张纸。

| 材料 | 离线 HTML | Markdown 排版源码 |
| --- | --- | --- |
| 知识讲解 | [打开](assets/open-book/knowledge.html) | [下载](assets/open-book/knowledge.md.txt) |
| 题目与解答 | [打开](assets/open-book/exercises.html) | [下载](assets/open-book/exercises.md.txt) |

保留了[生成脚本](assets/open-book/build.py)。在仓库已安装 Python Markdown 与 KaTeX 依赖的环境，分别运行 `python3 build.py knowledge`、`python3 build.py exercises`；生成的 HTML 可在浏览器按 A4、无页边距、100% 比例打印，关闭浏览器自带页眉页脚。

题意依据已有教材作业转述，权利归原权利人；题号与原始题图对应关系见[习题来源](../assets/exercise-sources.json)。知识册示意图为本册自绘。
