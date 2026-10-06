---
title: "Advanced Data Structures and Algorithm Analysis"
status: draft
tags: [cs, algorithms, data-structures, course]
created: 2026-10-06
updated: 2026-10-06
sources:
  - https://www.icourse163.org/course/ZJU1-1460402161
---

# Advanced Data Structures and Algorithm Analysis

**高级数据结构与算法分析 · CHEN Yue（陈越）, Zhejiang University**

Advanced data structures + algorithm analysis: invariants（不变量）, correctness（正确性）, complexity proofs（复杂度证明）, implementation（实现）, and experiments（实验）.

## Notes（笔记）

- [Lecture 1: AVL Trees, Splay Trees, and Amortized Analysis](lecture-01-avl-splay-amortized-analysis.md)：英中对照笔记、小测与 HW1 解析。
- [Lecture 2: Red-Black Trees and B+ Trees](lecture-02-red-black-bplus-trees.md)：红黑树、B+ 树、第二周小测／HW2 与线下讨论解析。
- [HW1: Root of AVL Tree](hw1-avl-root.md)：完整题目、样例与 C 实现。

**Prerequisites（前置知识）：**BST、递归、指针树、渐近记号与对数。第二课时沿用 BST 顺序与渐近分析，新增黑高和多路树的占用约束。

## Reading（阅读）

| Book | Lecture 1 |
| --- | --- |
| Weiss, *Data Structures and Algorithm Analysis in C*, 2nd ed. | Ch. 4 pp. 106–128; Ch. 11 pp. 447–451. Code: Figs. 4.42–4.48; splay examples: Figs. 4.52–4.60. |
| Cormen et al., *Introduction to Algorithms*, 3rd ed., 2009 | pp. 451–478: amortized analysis（摊还分析）. |
| Kleinberg & Tardos, *Algorithm Design*, 2005 | General reference（通用参考）; no first-lecture page range specified. |

中文参考：《“101计划”核心教材〈数据结构〉》《数据结构与算法分析（C语言版）》《数据结构学习与实验指导》。页码按课件指定版本。

## Course record（课程安排记录）

以下为所提供线下课的记录，具体执行以课程公告为准。

**Flipped classroom（翻转课堂）：**首课三节，后续两节，留一节时间预习；记录上课时段为 10:00–11:35。课前看慕课、完成驻点题并总结；课上约 15–20 分钟提纲，再讨论。慕课含驻点题与教师制作的字幕，B 站英文字幕由学生制作。主授课语言为英语，重点可用中文解释。

| Assessment（考核） | 分值与规则 |
| --- | --- |
| Homework（作业） | 5 分，PTA。 |
| Quiz（小测） | 5 分；10:00–10:15，复习上周并检查本周预习；独立完成，使用公告指定的 OMS 监考设置。 |
| Discussion（讨论） | 10 分；三人组，组长提交，记录截止时间 13:00，可在讨论和教师总结后修改；相关发言按质量加 0.5–2 分，偏题不加；不发言仍可获得基础分。 |
| Project + peer review（项目与互评） | 30 分：report 20、presentation 6、review participation 4。八个主题，每组正式完成一个；每题至多选三组，超额抽签。额外报告按 report score / 20 加分，每个最多 1 分。 |
| Midterm（期中） | 10 分；期末更好时替代期中，期中更好时按公布规则补偿。 |
| Final exam（期末） | 40 分；平时封顶 60；期末卷面低于 40/100 不能及格。 |

### Project（项目）

- **流程：**初稿 1 周 → 互评 2 天 → 修改并交 TA 2 天 → 最终评分。
- **互评：**所有组参加八轮，每轮评两份；report 分数由 TA、同伴各占 50%。每轮 review 满分 40，八轮总和 / $(8\times10)$，折为最多 4 个课程分。
- **展示：**10–12 分钟；首组介绍背景，后组不重复，重点讲算法差异、测试、结果及依据。三人随机选一人主讲，人人必须理解。评分考察材料、表达、组织、问答和时间，听众与 TA 各占 50%。
- **报告：**背景 → 数据结构／算法、伪代码、正确性与复杂度 → 代表性输入／预期输出／实测结果 → 分析、比较和改进 → 源码附录 → 参考文献与贡献分工。遵守文件命名、提交与评分规范。
- **注释：**函数功能、参数含义与合法范围；可给调用例。循环解释目标／不变量，分支解释处理原因。源码附录要求至少 30% 注释，教师强调有效解释而非机械计数。
- **评价：**按 rubric（评分细则）给具体依据；“很好”不足以支持满分或扣分。漏评、敷衍扣分；争议先向 TA、再向教师申诉。

### Integrity（学术诚信）

诚信测试须满分才能参加期末。记录规则：学术不端取消期末资格、课程成绩为 0。讨论提交须体现小组自己的推理；项目的 AI 使用范围由教师具体宣布。学习目标是独立思考，并能判断工具输出的正确性。
