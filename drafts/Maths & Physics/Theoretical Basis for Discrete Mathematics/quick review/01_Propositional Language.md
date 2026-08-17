# 01_Propositional Language

## 一、 命题逻辑基础

- **命题 (Proposition)**: 命题是能够明确判断真（$\mathbf{T}$）或假（$\mathbf{F}$）的陈述句。

- **变量与真值表**: 有 $n$ 个命题变量的真值表包含 $2^n$ 行，可构造出 $2^{2^n}$ 种互不相同的复合命题。

### 逻辑连接词

- **否定 (Negation, $\neg p$)**: 翻转真值。

- **合取 (Conjunction, $p \wedge q$)**: 仅当两者均为真时为真（AND）。

- **析取 (Disjunction)**:

    - **包含或 ($p \vee q$)**: 至少有一者为真即为真（Inclusive OR）。

    - **排他或 ($p \oplus q$)**: 仅当两者真值不同时为真（Exclusive OR/XOR）。

- **蕴含式 (Implication, $p \rightarrow q$)**: 仅当假设真且结论假（$T \rightarrow F$）时为假。

    - **相关条件句**: 逆命题为 $q \rightarrow p$，否命题为 $\neg p \rightarrow \neg q$，逆否命题为 $\neg q \rightarrow \neg p$。

    - **等价性**: 条件语句始终与其**逆否命题**逻辑等价，但与其逆命题和否命题不等价。

- **双条件式 (Biconditional, $p \leftrightarrow q$)**: 当且仅当两者真值相同时为真（IFF）。

### 运算符优先级

从高到低依次为：$\neg$ (1), $\wedge$ (2), $\vee$ (3), $\rightarrow$ (4), $\leftrightarrow$ (5)。

---

## 二、 命题的分类与应用

- **命题分类**:

    - **永真式/重言式 (Tautology)**: 任何情况下真值始终为真。

    - **矛盾式 (Contradiction)**: 任何情况下真值始终为假。

    - **偶然式 (Contingency)**: 真值取决于变量的取值。

- **可满足性 (Satisfiability)**: 只要存在至少一种真值分配使得命题为真，该命题就是可满足的。当且仅当命题是矛盾式时，它是不可满足的。

- **系统规范一致性 (Consistency)**: 如果可以为命题变量分配真值，使得系统规范列表中的每一个命题同时为真，则称这些规范是一致的。

---

## 三、 逻辑等价与定律

**逻辑等价定义**: 如果双条件语句 $p \leftrightarrow q$ 是一个永真式，则称 $p$ 和 $q$ 逻辑等价，记作 $p \equiv q$。

### 核心逻辑定律

- **恒等律 (Identity Laws)**: $p \wedge T \equiv p$, $p \vee F \equiv p$。

- **支配律 (Domination Laws)**: $p \vee T \equiv T$, $p \wedge F \equiv F$。

- **幂等律 (Idempotent Laws)**: $p \vee p \equiv p$, $p \wedge p \equiv p$。

- **双重否定律 (Double Negation Law)**: $\neg(\neg p) \equiv p$。

- **否定律 (Negation Laws)**: $p \vee \neg p \equiv T$, $p \wedge \neg p \equiv F$。

- **德·摩根定律 (De Morgan's Laws)**: $\neg(p \wedge q) \equiv \neg p \vee \neg q$, $\neg(p \vee q) \equiv \neg p \wedge \neg q$。

- **吸收律 (Absorption Laws)**: $p \vee (p \wedge q) \equiv p$, $p \wedge (p \vee q) \equiv p$。

- **条件句转换**:

    - 蕴含律: $p \rightarrow q \equiv \neg p \vee q$。

    - 等价律: $p \leftrightarrow q \equiv (p \rightarrow q) \wedge (q \rightarrow p)$。

### 对偶式 (Dual)

对于仅包含 $\vee$, $\wedge$, 和 $\neg$ 的复合命题 $S$，将其中的 $\vee$ 与 $\wedge$ 互换，$T$ 与 $F$ 互换，即可得到对偶式 $S^*$。如果 $s \leftrightarrow t$ 成立，当且仅当 $s^* \leftrightarrow t^*$ 成立。

### 函数完备集 (Functional Completeness)

如果一个运算符集合能够重写并等价表达所有可能的复合命题，则该集合是函数完备的。常见的完备集包括 $\{\neg, \vee\}$, $\{\neg, \wedge\}$, $\{|\}$ (NAND 单独完备), 和 $\{\downarrow\}$ (NOR 单独完备)。

---

## 四、 命题范式 (Normal Forms)

- **文字 (Literal)**: 命题变量或其否定形式。

- **析取范式 (DNF)**: 严格写为合取子句的析取（即多个 AND 组合进行 OR 操作）。

- **合取范式 (CNF)**: 严格写为析取子句的合取（即多个 OR 组合进行 AND 操作）。

- **代数转换步骤**: (1) 消除条件运算符；(2) 利用德·摩根定律将否定符内移；(3) 利用分配律展开成对应范式。

### 极小项 (Minterms) 与极大项 (Maxterms)

- **极小项 ($m_j$)**:

    - 包含每一个变量精确一次的合取式（AND）。

    - 性质：仅对唯一一种特定的真值分配结果为真；任意两个不同极小项的合取必定为假 ($m_i \wedge m_k = F$)；所有可能极小项的析取为永真式。

- **极大项 ($M_i$)**:

    - 包含每一个变量精确一次的析取式（OR），且等于对应极小项的否定 ($M_i = \neg m_i$)。

    - 性质：仅对唯一一种特定的真值分配结果为假；任意两个不同极大项的析取必定为真 ($M_i \vee M_k = T$)；所有可能极大项的合取为矛盾式。

### 主范式 (Full Normal Forms)

- **主析取范式 (Full DNF)**: 完全由极小项构成的析取式，记为 $f = \sum m(j, k, \dots)$。代数求法中，若子句缺少变量 $r$，需乘以 $(r \vee \neg r)$ 展开。

- **主合取范式 (Full CNF)**: 完全由极大项构成的合取式。它等价于完整索引集剔除 Full DNF 对应极小项索引后，剩余索引对应的极大项的乘积（$\prod$）。转换公式为 $f = \prod M( \{0, 1, 2, \dots, 2^n - 1\} - \{j, k, \dots, l\} )$。
