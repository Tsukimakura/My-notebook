---
title: "命题逻辑与归结"
status: draft
tags: [cs, ai]
created: 2026-10-07
updated: 2026-10-07
sources:
  - "课程资料/人工智能引论/"
---

# 命题逻辑与归结

## 命题与真值

命题（Proposition）是在给定解释下具有真或假值的陈述。命题不要求我们已经知道其真值。例如一个尚未解决但表述确定的数学断言仍可作为命题；命令、提问，以及尚未指定 $x$ 的开放式 $x<8$，不能直接当作确定真值的命题。

原子命题（Atomic Proposition）用 $p,q,\alpha,\beta$ 等符号表示。复合命题通过逻辑联结词（Logical Connective）构造：否定 $\neg$、合取 $\land$、析取 $\lor$、蕴涵 $\to$、双条件 $\leftrightarrow$。

| $p$ | $q$ | $\neg p$ | $p\land q$ | $p\lor q$ | $p\to q$ | $p\leftrightarrow q$ |
| --- | --- | --- | --- | --- | --- | --- |
| T | T | F | T | T | T | T |
| T | F | F | F | T | F | F |
| F | T | T | F | T | T | F |
| F | F | T | F | F | T | T |

析取是允许两者同时为真的“或”。实质蕴涵（Material Implication）只在前件真、后件假时为假：

$$
p\to q\equiv\neg p\lor q.
$$

因此前件为假时，蕴涵式为真。这是形式逻辑约定，不是说前件导致后件，也不是说它们在现实中必有关联。

## 语义、证明与符号层次

解释／真值赋值（Interpretation / Valuation）给每个原子命题指定真值。满足公式的赋值是它的模型（Model）。

- 可满足式（Satisfiable Formula）：至少存在一个模型。
- 永真式／重言式（Tautology）：所有赋值都满足它。
- 矛盾式（Contradiction）：没有模型。
- $\Gamma\models\varphi$：所有满足前提集合 $\Gamma$ 的赋值都满足 $\varphi$。
- $\Gamma\vdash\varphi$：按给定规则存在从 $\Gamma$ 推出 $\varphi$ 的形式证明。

对象语言中的 $\to$ 是联结词；元语言中的 $\models$ 描述逻辑后果，$\equiv$ 描述公式在所有赋值下真值相同。语义蕴涵也可理解为模型集合的包含：$\mathrm{Mod}(\Gamma)\subseteq\mathrm{Mod}(\varphi)$。

## 常用等价变形

| 名称 | 等价式 |
| --- | --- |
| 双重否定 | $\neg\neg p\equiv p$ |
| 德摩根律（De Morgan's Laws） | $\neg(p\land q)\equiv\neg p\lor\neg q$；$\neg(p\lor q)\equiv\neg p\land\neg q$ |
| 蕴涵消去 | $p\to q\equiv\neg p\lor q$ |
| 逆否等价 | $p\to q\equiv\neg q\to\neg p$ |
| 双条件展开 | $p\leftrightarrow q\equiv(p\to q)\land(q\to p)$ |
| 分配律 | $p\lor(q\land r)\equiv(p\lor q)\land(p\lor r)$；$p\land(q\lor r)\equiv(p\land q)\lor(p\land r)$ |

合取和析取还满足交换律、结合律。把蕴涵与其逆命题混同是常见错误：$p\to q$ 不等价于 $q\to p$。

## 基本推理规则

假言推理／肯定前件（Modus Ponens）：由 $p$ 和 $p\to q$ 推出 $q$。

否定后件（Modus Tollens）：由 $p\to q$ 和 $\neg q$ 推出 $\neg p$。

合取消去：由 $p\land q$ 得到 $p$ 或 $q$；合取引入：由分别证明的 $p$、$q$ 得到 $p\land q$。

“肯定后件”无效：由 $p\to q$ 与 $q$ 不能推出 $p$。例如下雨会使地面湿，但地面湿还可能来自洒水。“否定前件”同样无效：$\neg p$ 不保证 $\neg q$。

## 合取范式与析取范式

文字（Literal）是原子命题或其否定。子句（Clause）是若干文字的析取。合取范式（Conjunctive Normal Form，CNF）是子句的合取；析取范式（Disjunctive Normal Form，DNF）是若干文字合取项的析取。

转换的常用步骤是：消去 $\to,\leftrightarrow$；用德摩根律把否定移到原子前；消去双重否定；按目标范式使用分配律。

课堂例式：

$$
\neg(\alpha\to\beta)\lor\neg\gamma
\equiv(\alpha\land\neg\beta)\lor\neg\gamma.
$$

右侧已是 DNF，进一步分配得到 CNF：

$$
(\alpha\lor\neg\gamma)\land(\neg\beta\lor\neg\gamma).
$$

等价转换保留所有赋值下的真值，但朴素分配可能大幅增加公式长度。工程中的引入辅助变量方法可保持可满足性，不能无条件把“等可满足”说成原变量上的逐字等价。

## 归结规则

归结（Resolution）消去两个子句中的互补文字：

$$
\frac{A\lor p\qquad B\lor\neg p}{A\lor B}.
$$

这里 $A,B$ 代表其余文字的析取。若 $A$ 为空，规则退化为单位归结（Unit Resolution）。必须消去一对相同原子的一正一负文字，不能任意删除两个文字。

### 课堂例题：两种情况都导向同一结论

已知 $\alpha\lor\beta$、$\alpha\to\gamma$、$\beta\to\gamma$，证明 $\gamma$。

将后两个前提改写为 $\neg\alpha\lor\gamma$ 与 $\neg\beta\lor\gamma$：

1. 将 $\alpha\lor\beta$ 与 $\neg\alpha\lor\gamma$ 归结，得 $\beta\lor\gamma$。
2. 将其与 $\neg\beta\lor\gamma$ 归结，得 $\gamma\lor\gamma$。
3. 利用幂等律，得到 $\gamma$。

这里并不需要额外假设 $\alpha,\beta$ 同时为真。

### 归结反驳（Resolution Refutation）

证明 $\Gamma\models\varphi$，可以转而证明 $\Gamma\land\neg\varphi$ 不可满足。将前提与否定结论化成子句集合，反复归结，若得到空子句 $\square$，即产生矛盾。

对上例加入 $\neg\gamma$：分别与两个蕴涵子句归结得到 $\neg\alpha,\neg\beta$；再与 $\alpha\lor\beta$ 归结，最终得到 $\square$。

### 课堂例题：五个子句的矛盾

给定：

$$
\begin{aligned}
C_1&=\alpha\lor\gamma,& C_2&=\neg\beta\lor\gamma,\\
C_3&=\neg\gamma\lor\alpha,& C_4&=\neg\alpha\lor\beta,\\
C_5&=\neg\alpha\lor\neg\gamma.
\end{aligned}
$$

| 步骤 | 使用的子句 | 归结结果 |
| --- | --- | --- |
| 1 | $C_1,C_3$，消去 $\gamma$ | $\alpha$ |
| 2 | $\alpha,C_4$ | $\beta$ |
| 3 | $\beta,C_2$ | $\gamma$ |
| 4 | $\gamma,C_5$ | $\neg\alpha$ |
| 5 | $\alpha,\neg\alpha$ | $\square$ |

所以五个子句不能同时为真。命题归结具有反驳完备性（Refutation Completeness）：不可满足的子句集合可以通过适当的归结推出空子句。具体算法还需要控制重复子句和搜索顺序。

## 继续阅读

命题逻辑把完整陈述视作不可再分的原子。[一阶逻辑](04-first-order-logic.md)进一步表示陈述中的对象、属性与关系。

课程来源与公式校订见 [资料对照与校订依据](source-map.md)。
