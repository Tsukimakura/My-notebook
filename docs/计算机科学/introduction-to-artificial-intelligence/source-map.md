---
title: "人工智能引论：资料对照与校订依据"
status: draft
tags: [cs, ai]
created: 2026-10-07
updated: 2026-10-07
sources:
  - "~/aid-docs/"
---

# 人工智能引论：资料对照与校订依据

## 原始资料覆盖

笔记的课程内容来自本地 `~/aid-docs/`，按主题重新组织。课件文字、公式、表格和课堂截图相互对照；口语识别中的同音词、断句与缺失符号按上下文恢复。原始资料没有随站点复制，下面的路径用于本地追溯。

| 原始资料 | 规模 | 知识用途 |
| --- | --- | --- |
| `计算机101计划《人工智能引论》教材课件-第一周.pptx` | 70 页 | 学科起源、发展阶段、方法与知识体系、AI 应用及素养 |
| `计算机“101计划”《人工智能引论》教材课件-第一章绪论.pptx` | 26 页 | 计算模型、形式化、智能计算方法与基本概念 |
| `计算机“101计划”《人工智能引论》教材课件-第二章知识表达与推理.pptx` | 61 页 | 命题逻辑、谓词逻辑、FOIL、PRA、概率图与因果推理 |
| `course_86447_sub_1966756/course_content.md` 与同目录截图 | 第一节；67 张图 | 绪论、计算方法及课程框架的课堂解释 |
| `course_86447_sub_1971196/course_content.md` 与同目录截图 | 第二节；98 张图 | 命题范式、归结练习、量词推理、绪论补充 |
| `course_86447_sub_1974265/course_content.md` 与同目录截图 | 第三节；55 张图 | 规则与路径学习、概率模型、因果推理、搜索入门 |

### 第二章课件与笔记对应

| 课件页码 | 内容 | 整理位置 |
| --- | --- | --- |
| 5—15 | 命题、联结词、等价与推理 | [命题逻辑与归结](03-propositional-logic.md)，并入第二节课堂练习 |
| 16—23 | 谓词、量词与推理 | [一阶逻辑](04-first-order-logic.md) |
| 24—34 | 知识图谱、FOIL、PRA | [知识图谱推理](05-knowledge-graph-reasoning.md) |
| 35—40 | 贝叶斯网络、马尔可夫逻辑 | [概率推理](06-probabilistic-reasoning.md) |
| 41—58 | 辛普森悖论、干预与反事实 | [因果推理](07-causal-reasoning.md) |
| 59—60 | 推理、计算与搜索的联系 | 上述主题的关系说明 |

第三节课的搜索入门不在所提供的第二章 PPTX 中，依据该课堂 `ppt_041.png`—`ppt_051.png` 及对应识别文本整理。搜索算法表、最短路径小图与部分严格条件是帮助理解框架的补充，不表示课堂已完整讲授后续算法。

## 关键校订

| 原资料易误解处 | 笔记采用的表述 |
| --- | --- |
| 将原始递归函数与图灵可计算能力并列为完全等价 | 等价模型中的递归类别是一般／部分递归；原始递归只是子类 |
| 用费马方程“枚举找不到解”解释不可计算 | 分开无解、算法不停机、问题不可判定 |
| 把不完全性用于所有知识体系 | 写出有效公理化、一致与足够表达算术等条件 |
| 全称、存在实例化与概括的限制未展开 | 补充任意对象、新鲜见证与变量捕获限制 |
| FOIL 某页正文中的负例数量与样本表不同 | 按完整表使用 1 个正例、4 个负例，保留真实计算 |
| PRA 路径方向与反向边约定未明确 | 写明逆关系、Couple 与 Sibling 的对称约定及样本集合差异 |
| 贝叶斯网络局部马尔可夫性误写主语为父节点 | 主语改为“该节点” |
| MLN 用权重总分直接比较概率 | 区分分数、指数质量、归一化概率和条件证据 |
| 灯光秀与室外活动规则 | 保留“灯光秀”（Light Show）事件含义，不改成光照强弱 |
| Berkeley 案例标为本科录取 | 校订为 1973 年研究生录取 |
| 条件概率口述分母不清 | 按定义使用条件事件概率作分母 |
| 干预表述为固定系统其他变量 | 固定被干预变量、保持其他机制；后代值可以变化 |
| 调整公式可能被理解为对所有变量成立 | 明确后门条件、充分混杂控制与正值性 |
| 辛普森例子先对恢复率取两位小数 | 使用人数分数计算，单列课件近似与差异 |
| 行星周期与轨道尺度的幂次混淆 | 采用开普勒第三定律 $T^2\propto a^3$ |

## 补充核验资料

补充只用于恢复严格定义、澄清条件与解释例题。课程中的人物轶事、教学安排、考核、机构与教材宣传内容没有编入知识笔记。

- [达特茅斯原始研究计划](https://www-formal.stanford.edu/jmc/history/dartmouth/dartmouth.html)：核对提出时间与研究议题。
- [Quinlan，Learning Logical Definitions from Relations（1990）](https://link.springer.com/article/10.1023/A:1022699322624)：FOIL 的一阶规则学习背景。
- [Lao 与 Cohen，Relational Retrieval Using a Combination of Path-constrained Random Walks（2010）](https://www.cs.cmu.edu/~wcohen/postscript/ecml-2010-ni.pdf)：PRA 的关系路径特征与可学习权重。
- [Richardson 与 Domingos，Markov Logic Networks（2006）](https://www-lrn.cs.umass.edu/lab-lunch/papers/markov-logic-nets.pdf)：MLN 的加权落地公式及概率分布。
- [Bickel、Hammel 与 O'Connell，Sex Bias in Graduate Admissions: Data from Berkeley（1975）](https://brenocon.com/science_1975_sex_bias_graduate_admissions_data_berkeley.pdf)：核对录取样本的范围。
- [Pearl，Causal Inference in Statistics: An Overview（2009）](https://escholarship.org/content/qt36w8n7pg/qt36w8n7pg.pdf)：干预、调整与反事实的框架。
- [Poole 与 Mackworth，Artificial Intelligence: Foundations of Computational Agents，第三版搜索章节](https://artint.info/3e/html/ArtInt3e.Ch3.S6.html)：启发式与搜索保证。

图示均是概念、图结构或课堂数值的原创绘制；没有复制课件截图作为发布图片。详见 [图示来源与复现](assets/README.md)。
