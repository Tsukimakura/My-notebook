---
title: "一阶逻辑与量词推理"
status: draft
tags: [cs, ai]
created: 2026-10-07
updated: 2026-10-07
sources:
  - "课程资料/人工智能引论/"
---

# 一阶逻辑与量词推理

## 为什么引入谓词

命题逻辑可以把“苏格拉底是人”记为 $p$，却不能直接表达“所有人都会死”如何作用于某一个人。一阶逻辑（First-order Logic，FOL）增加对象、谓词和量词，表达共同结构。

| 成分 | 英文 | 含义与例子 |
| --- | --- | --- |
| 个体域 | Domain of Discourse | 本次讨论的对象集合，通常约定非空 |
| 常量 | Constant | 特定对象，如 $\mathrm{Socrates}$ |
| 变量 | Variable | 域中可变的对象，如 $x,y$ |
| 函数 | Function | 将对象映射为对象，如 $\mathrm{FatherOf}(x)$ |
| 谓词 | Predicate | 对象的属性或关系，如 $\mathrm{Human}(x)$、$\mathrm{Sister}(x,y)$ |
| 量词 | Quantifier | $\forall$“所有”，$\exists$“至少存在一个” |

常量、变量，以及把函数应用于项所得的表达式都是项（Term）。项代入谓词构成原子公式；原子公式再通过联结词和量词形成更复杂公式。

例如 $\mathrm{King}(\mathrm{Richard})$、$\mathrm{Sister}(\mathrm{Lucy},\mathrm{Lily})$、$\mathrm{Capital}(\mathrm{Beijing},\mathrm{China})$。谓词的参数数量叫元数（Arity）；二元谓词并不意味着二阶逻辑。一阶量词作用于个体，二阶逻辑允许量化谓词或集合等更高层对象。

## 解释、自由变量与句子

一个解释需要指定域、常量所指对象、函数的映射与谓词的真值关系。带自由变量（Free Variable）的公式还依赖变量赋值。

在 $\forall x\,\mathrm{Likes}(x,y)$ 中，$x$ 受量词约束，是约束变量（Bound Variable）；$y$ 是自由变量。没有自由变量的公式称为句子／封闭公式（Sentence / Closed Formula），才可在一个解释下直接讨论真值。

替换变量要避免变量捕获（Variable Capture）：不能让原本自由的变量因替换而意外落入同名量词作用域。

## 全称与存在的正确表达

“所有国王都是人”：

$$
\forall x\bigl(\mathrm{King}(x)\to\mathrm{Human}(x)\bigr).
$$

不能改成 $\forall x(\mathrm{King}(x)\land\mathrm{Human}(x))$，后者说域中每个对象都是国王且是人。

“存在一个国王是人”：

$$
\exists x\bigl(\mathrm{King}(x)\land\mathrm{Human}(x)\bigr).
$$

不能改成存在量词下的蕴涵，因为任意非国王对象都可能让蕴涵真，从而无法保证存在国王。

全称条件并不自动保证相应对象存在：如果没有国王，“所有国王都是人”仍为真。存在性要另行表达。

## 量词顺序与否定

$$
\forall x\exists y\,R(x,y)
$$

表示每个 $x$ 都有某个对应 $y$，不同 $x$ 的 $y$ 可以不同。

$$
\exists y\forall x\,R(x,y)
$$

表示有一个共同的 $y$ 适用于所有 $x$。这通常更强，二者不等价。

否定量词时必须交换量词：

$$
\neg\forall x\,P(x)\equiv\exists x\,\neg P(x),\qquad
\neg\exists x\,P(x)\equiv\forall x\,\neg P(x).
$$

合法分配包括：

$$
\forall x(P(x)\land Q(x))\equiv(\forall xP(x))\land(\forall xQ(x)),
$$

$$
\exists x(P(x)\lor Q(x))\equiv(\exists xP(x))\lor(\exists xQ(x)).
$$

但全称不能一般地分配到析取，存在不能一般地分配到合取。令域为 $\{a,b\}$，只有 $P(a)$ 与 $Q(b)$ 为真：每个对象都满足 $P\lor Q$，却并非所有对象满足 $P$ 或所有对象满足 $Q$；分别存在 $P$、$Q$ 对象，也不表示存在同时满足两者的同一个对象。

## 四类量词推理规则

| 规则 | 英文 | 操作 | 必要条件 |
| --- | --- | --- | --- |
| 全称实例化 | Universal Instantiation | 从 $\forall xP(x)$ 得 $P(t)$ | $t$ 可合法替换 $x$，不发生变量捕获 |
| 全称概括 | Universal Generalization | 从任意对象 $a$ 的 $P(a)$ 得 $\forall xP(x)$ | $a$ 真正任意，不能依赖关于它的特殊未解除假设 |
| 存在引入 | Existential Introduction | 从 $P(t)$ 得 $\exists xP(x)$ | 使用合法项并正确替换 |
| 存在消去／实例化 | Existential Elimination / Instantiation | 从 $\exists xP(x)$ 引入新见证 $a$，在该分支假设 $P(a)$ | $a$ 必须新鲜；最终结论不能依赖它是某个预先指定对象 |

存在见证（Witness）是“某一个”，全称证明中的任意对象是“任意一个”；二者不能混用。不能从“有人聪明”选择某个已知人，再断言这个人聪明。

## 课堂例题一：三段论

前提：

$$
\forall x(\mathrm{Human}(x)\to\mathrm{Mortal}(x)),\qquad
\mathrm{Human}(\mathrm{Socrates}).
$$

对第一个前提实例化，得到 $\mathrm{Human}(\mathrm{Socrates})\to\mathrm{Mortal}(\mathrm{Socrates})$，再用假言推理得 $\mathrm{Mortal}(\mathrm{Socrates})$。

## 课堂例题二：传递一般规则

由 $\forall x(P(x)\to Q(x))$ 与 $\forall x(Q(x)\to R(x))$ 证明：

$$
\forall x(P(x)\to R(x)).
$$

取任意新对象 $a$，实例化两个前提。暂时假设 $P(a)$，连续两次假言推理得 $Q(a)$、$R(a)$。解除暂时假设，得 $P(a)\to R(a)$；因为 $a$ 任意且未依赖特殊条件，可以全称概括。

## 课堂例题三：至少有一架飞机在地面

前提：所有飞机都在地面或天空；并非所有飞机都在天空。

$$
\forall x\bigl(\mathrm{Plane}(x)\to(\mathrm{Ground}(x)\lor\mathrm{Sky}(x))\bigr),
$$

$$
\neg\forall x\bigl(\mathrm{Plane}(x)\to\mathrm{Sky}(x)\bigr).
$$

否定第二式、消去蕴涵，得到：

$$
\exists x\bigl(\mathrm{Plane}(x)\land\neg\mathrm{Sky}(x)\bigr).
$$

引入新见证 $a$，得 $\mathrm{Plane}(a)$ 和 $\neg\mathrm{Sky}(a)$。第一式实例化并假言推理，得 $\mathrm{Ground}(a)\lor\mathrm{Sky}(a)$；用单位归结得到 $\mathrm{Ground}(a)$。合取后存在引入，解除见证分支：

$$
\exists x\bigl(\mathrm{Plane}(x)\land\mathrm{Ground}(x)\bigr).
$$

结论必须用合取保证对象确实是飞机；不能写成 $\exists x(\mathrm{Plane}(x)\to\mathrm{Ground}(x))$。

## 从表达走向自动推理

一阶规则需要在变量与具体项之间匹配。合一（Unification）寻找使表达式一致的替换，如 $\mathrm{Father}(x,y)$ 与 $\mathrm{Father}(\mathrm{David},\mathrm{Ann})$ 可用 $\{x\mapsto\mathrm{David},y\mapsto\mathrm{Ann}\}$ 匹配。

前向推理（Forward Chaining）从已知事实出发应用规则；后向推理（Backward Chaining）从待证明目标出发寻找可支持它的前提。二者都要处理规则、变量与搜索，而非只做字符串替换。

[知识图谱与规则学习](05-knowledge-graph-reasoning.md)进一步研究：规则未知时，能否从关系样本中学到规则？

课程来源与公式校订见 [资料对照与校订依据](source-map.md)。
