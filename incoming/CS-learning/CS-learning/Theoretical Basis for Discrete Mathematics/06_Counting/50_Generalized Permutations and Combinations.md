## 1. Permutations and Combinations with Repetition

### Permutations with Repetition

When order matters and you can reuse items from your set, the product rule applies directly.

- **Theorem:** The number of $r$-permutations of a set of $n$ objects with repetition allowed is $n^r$.
    
- _Example:_ The number of strings of length $r$ that can be formed from the 26 uppercase English letters is $26^r$.
    

### Combinations with Repetition (Stars and Bars)

When order does not matter and repetition is allowed, we use the "stars and bars" method. Choosing $r$ items from $n$ distinct categories is equivalent to arranging $r$ "stars" (the items chosen) and $n-1$ "bars" (the dividers between the $n$ categories).

- **Theorem:** The number of $r$-combinations from a set with $n$ elements when repetition is allowed is:
    
    $$C(n + r - 1, r) = C(n + r - 1, n - 1)$$
    
- _Example:_ Choosing 6 cookies from a shop offering 4 kinds of cookies. Here $n = 4$ and $r = 6$. The number of ways is $C(4 + 6 - 1, 6) = C(9, 6) = 84$.
    

### Application: Solving Integer Equations

Combinations with repetition perfectly model finding the number of nonnegative integer solutions to equations of the form $x_1 + x_2 + \dots + x_n = r$.

- **Standard Case:** $x_1 + x_2 + x_3 + x_4 = 16$ (where $x_i \ge 0$).
    
    This is equivalent to choosing 16 items from 4 categories: $C(4 - 1 + 16, 16) = C(19, 16)$.
    
- **With Lower Bounds:** $x_1 + x_2 + x_3 + x_4 = 16$ (where $x_i \ge 2$).
    
    First, satisfy the minimum requirement by giving 2 to each of the 4 variables (using up 8 units). The equation becomes $y_1 + y_2 + y_3 + y_4 = 8$ (where $y_i = x_i - 2 \ge 0$).
    
    The solutions are $C(4 - 1 + 8, 8) = C(11, 8) = C(11, 3)$.
    
- **With Inequalities:** $x_1 + x_2 + x_3 + x_4 \le 16$ (where $x_i \ge 0$).
    
    Introduce a nonnegative auxiliary "slack" variable $x_5$ to absorb the difference, converting the inequality to an equation: $x_1 + x_2 + x_3 + x_4 + x_5 = 16$.
    
    The solutions are $C(5 - 1 + 16, 16) = C(20, 16) = C(20, 4)$.
    

### Summary of Basic Counting Formulas

|**Type**|**Repetition Allowed?**|**Formula**|
|---|---|---|
|$r$-permutations|No|$\frac{n!}{(n-r)!}$|
|$r$-combinations|No|$\frac{n!}{r!(n-r)!}$|
|$r$-permutations|Yes|$n^r$|
|$r$-combinations|Yes|$\frac{(n+r-1)!}{r!(n-1)!}$|

---

## 2. Permutations with Indistinguishable Objects

When arranging a set of objects where some items are identical to each other, you must divide out the redundant permutations of the identical items.

- **Theorem:** The number of different permutations of $n$ objects, where there are $n_1$ indistinguishable objects of type 1, $n_2$ of type 2, ..., and $n_k$ of type $k$, is:
    
    $$\frac{n!}{n_1!n_2!\dots n_k!}$$
    
- _Example (Word Scramble):_ How many distinct strings can be made using the letters in MISSISSIPPI?
    
    There are 11 letters total: 1 M, 4 I's, 4 S's, and 2 P's.
    
    The number of permutations is $\frac{11!}{4!4!2!1!}$.
    
- _Example (Mixed Group Selection):_ From 50 students, select 7 to form a group where 1 is the monitor, 1 is the vice-monitor, and 5 are regular members.
    
    First, choose 7 students: $C(50, 7)$. Then, arrange their roles (2 distinct, 5 identical): $\frac{7!}{1!1!5!}$.
    
    Total ways: $C(50, 7) \cdot \frac{7!}{5!} = \frac{50!}{43!7!} \cdot \frac{7!}{5!} = \frac{50!}{43!5!} = \frac{P(50, 7)}{5!}$.
    

---

## 3. Distributing Objects into Boxes

Many counting problems can be rephrased as placing objects into boxes. The solution method depends entirely on whether the objects and the boxes are **distinguishable** (labeled/unique) or **indistinguishable** (identical/unlabeled).

### Type 1: Distinguishable Objects & Distinguishable Boxes

- **Rule:** There are $\frac{n!}{n_1!n_2!\dots n_k!}$ ways to distribute $n$ distinguishable objects into $k$ distinguishable boxes such that box $i$ gets exactly $n_i$ objects.
    
- _Example:_ Dealing 5 cards each to 4 distinct players from a 52-card deck (leaving 32 cards undealt).
    
    Ways = $\frac{52!}{5!5!5!5!32!}$.
    

### Type 2: Indistinguishable Objects & Distinguishable Boxes

- **Rule:** This is identical to combinations with repetition (stars and bars). Distributing $n$ identical objects into $k$ labeled boxes is equivalent to finding integer solutions to $x_1 + x_2 + \dots + x_k = n$.
    
- **Formula:** $C(n + k - 1, n)$
    
- _Example:_ Placing 10 identical objects into 8 distinct boxes: $C(10 + 8 - 1, 10) = C(17, 10)$.
    

### Type 3: Distinguishable Objects & Indistinguishable Boxes

- **Rule:** There is no simple closed formula for this. It involves **Stirling numbers of the second kind**. You must break the problem down into cases based on how the objects can be partitioned.
    
- _Example:_ Placing 4 different employees (A, B, C, D) into 3 identical offices.
    
    - Case 1 (4, 0, 0): All 4 in one office = 1 way.
        
    - Case 2 (3, 1, 0): 3 in one, 1 in another = 4 ways.
        
    - Case 3 (2, 2, 0): 2 in one, 2 in another = 3 ways.
        
    - Case 4 (2, 1, 1): 2 in one, 1 in each of the others = 6 ways.
        
    - Total = $1 + 4 + 3 + 6 = 14$ ways.
        

### Type 4: Indistinguishable Objects & Indistinguishable Boxes

- **Rule:** This is equivalent to integer partitioning. Distributing $n$ identical objects into $k$ identical boxes equals $p_k(n)$, which is the number of ways to write $n$ as the sum of at most $k$ positive integers. No simple closed formula exists; you must enumerate the partitions.
    
- _Example:_ Pack 6 copies of the same book into 4 identical boxes.
    
    The partitions of 6 into at most 4 parts are: {6}, {5,1}, {4,2}, {4,1,1}, {3,3}, {3,2,1}, {3,1,1,1}, {2,2,2}, and {2,2,1,1}. Total = 9 ways.