# 03_Proof

## 一、 有效论证与推理规则

**论证 (Argument)** 是逻辑中由一系列前提最后推导出结论的语句序列。

**有效性 (Validity)**：当且仅当所有前提的合取蕴含结论的条件语句 $(p_1 \wedge p_2 \wedge \dots \wedge p_n) \rightarrow q$ 是一个永真式时，论证才是有效的。数学证明本质上就是有效论证。

### 1. 命题逻辑推理规则

- **假言推理 (Modus Ponens)**: 前提 $p \rightarrow q$ 与 $p$，结论 $\therefore q$。

- **取拒式 (Modus Tollens)**: 前提 $p \rightarrow q$ 与 $\neg q$，结论 $\therefore \neg p$。

- **假言三段论 (Hypothetical Syllogism)**: 前提 $p \rightarrow q$ 与 $q \rightarrow r$，结论 $\therefore p \rightarrow r$。

- **析取三段论 (Disjunctive Syllogism)**: 前提 $p \vee q$ 与 $\neg p$，结论 $\therefore q$。

- **附加律 (Addition)**: 前提 $p$，结论 $\therefore p \vee q$。

- **化简律 (Simplification)**: 前提 $p \wedge q$，结论 $\therefore p$ 或 $q$。

- **合取律 (Conjunction)**: 前提 $p$ 与 $q$，结论 $\therefore p \wedge q$。

- **消解律 (Resolution)**: 前提 $\neg p \vee r$ 与 $p \vee q$，结论 $\therefore q \vee r$。

### 2. 谓词逻辑（量词）推理规则

- **全称实例化 (UI)**: 若 $\forall x P(x)$ 为真，则对于定义域内特定元素 $c$，$P(c)$ 成立。

- **全称泛化 (UG)**: 若对于任意元素 $c$，$P(c)$ 均成立，则推导得出 $\forall x P(x)$。

- **存在实例化 (EI)**: 若 $\exists x P(x)$ 为真，则必定存在特定元素 $c$ 使得 $P(c)$ 成立。

- **存在泛化 (EG)**: 若对于某个特定元素 $c$，$P(c)$ 成立，则推导得出 $\exists x P(x)$。

- **全称假言推理 (Universal Modus Ponens)**: 结合了 UI 和假言推理，前提为 $\forall x(P(x) \rightarrow Q(x))$ 与特定元素的 $P(a)$，推导结论为 $Q(a)$。

---

## 二、 基础证明方法

### 1. 条件语句 ($p \rightarrow q$) 的证明

- **平凡证明 (Trivial Proof)**: 若已知结论 $q$ 恒真，则蕴含式必然为真，无需考虑 $p$ 的真假。

- **空虚证明 (Vacuous Proof)**: 若已知前提 $p$ 恒假，则蕴含式在逻辑上直接成立（空虚真）。

- **直接证明 (Direct Proof)**: 假设前提 $p$ 为真，通过逻辑推导得出结论 $q$ 必定为真。

- **逆否证明/间接证明 (Proof by Contraposition)**: 证明原命题等价的逆否命题 $\neg q \rightarrow \neg p$。即假设 $\neg q$ 为真，推导出必定导致 $\neg p$。

### 2. 反证法 (Proof by Contradiction)

为了证明命题 $p$ 为真，先假设其否定形式 $\neg p$ 为真。随后通过逻辑推导得出一个矛盾现象，从而证明假设 $\neg p$ 是错误的，原命题 $p$ 成立。

### 3. 双条件语句 ($p \leftrightarrow q$) 的证明

将“当且仅当”拆分为两个方向的证明：首先证明必要性（$p \rightarrow q$），然后证明充分性（$q \rightarrow p$）。

---

## 三、 结构化证明与解题策略

### 1. 结构化分类证明

- **分情况证明 (Proof by Cases)**: 当无法单步证明完毕时，需将问题穷尽拆分为所有可能的情况（$p_1 \vee p_2 \vee \dots \vee p_n$），并逐一证明 $p_i \rightarrow q$ 均成立。

- **不失一般性 (WLOG)**: 仅在“分情况证明”中使用。当多种情况在逻辑上存在完全对称性（仅变量名互换）时，可以只证明其中一种情况，并声明“不失一般性”，表明其他情况的证明逻辑完全相同。

### 2. 存在性、唯一性与证伪

- **存在性证明 ($\exists x P(x)$)**:

    - **构造性证明**: 显式地寻找或构造出一个具体的对象 $c$，使得 $P(c)$ 为真。

    - **非构造性证明**: 仅通过逻辑证明满足条件的对象必然存在，但无法指出确切的值或位置。

- **唯一性证明 ($\exists! x P(x)$)**: 严格包含两步：(1) **存在性**：证明存在一个元素满足性质；(2) **唯一性**：证明若任意元素 $y$ 也满足该性质，则必然有 $y = x$。

- **反例证伪 (Disproof by Counterexample)**: 用于推翻全称量词命题 $\forall x P(x)$，只需利用逻辑等价性 $\neg \forall x P(x) \equiv \exists x \neg P(x)$，找到一个使命题为假的反例即可。

### 3. 推理策略 (Reasoning Strategies)

对于复杂命题，优先尝试直接证明，受阻时转向间接证明（如逆否证明）。

- **正向推理 (Forward Reasoning)**: 从公理、已知定理和给定前提条件出发，逐步推演直到得出结论。

- **逆向推理 (Backward Reasoning)**: 若正向推演陷入僵局，可从目标结论开始反向推导，寻找能够必然导致该结论的充分条件。

### 4. 其他重要证明工具

- **全称命题证明**: 若要证明全称量词命题 $\forall x P(x)$，标准方法是假设 $x$ 为定义域中任意一个元素，证明 $P(x)$ 成立，随后应用全称泛化 (UG) 得出结论。

- **数学归纳法 (Mathematical Induction)**: 专用于证明定义域为所有正整数的命题 $\forall n P(n)$。

- **结构归纳法 (Structural Induction)**: 用于证明递归定义的集合与数据结构（如计算机科学中的树）的属性。

- **康托尔对角线法 (Cantor Diagonalization)**: 用于证明关于无限集合相对基数大小的问题（例如实数多于整数）。

- **组合证明 (Combinatorial Proofs)**: 通过计数论证的方式来证明两个代数表达式必然相等。
