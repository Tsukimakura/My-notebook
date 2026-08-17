## 1. Fundamentals of Recurrence Relations

- **Definition:** A recurrence relation for a sequence $\{a_n\}$ is an equation that expresses $a_n$ in terms of one or more of the previous terms ($a_0, a_1, \dots, a_{n-1}$) for all integers $n \ge n_0$.
    
- **Solution:** A sequence is considered a solution of a recurrence relation if its terms satisfy the given equation. Note that there are typically infinitely many sequences that can satisfy a single recurrence relation.
    
- **Initial Conditions:** To uniquely identify a specific sequence, initial conditions (the values of $a_0, a_1, \dots$) must be provided. These specify the values of the terms before the recurrence relation takes effect.
    
- **Degree:** The degree of a recurrence relation is determined by how far back in the sequence it references. For example, $a_n = a_{n-1} + a_{n-8}$ is a recurrence relation of degree 8.
    

**Verifying a Solution:**

To determine if a sequence solves a relation, substitute the sequence definition into the recurrence relation.

- _Example:_ Is $a_n = 3n$ a solution to $a_n = 2a_{n-1} - a_{n-2}$?
    
    Substitute $3n$ into the right side: $2[3(n-1)] - [3(n-2)] = 6n - 6 - 3n + 6 = 3n = a_n$. Yes, it is a valid solution.
    

---

## 2. Application: Population Growth (Fibonacci Numbers)

**The Problem:** Model the population of rabbits on an island. A new pair of rabbits is placed on the island. Rabbits do not breed until they are 2 months old. After reaching 2 months of age, each pair produces another pair every month. Rabbits never die.

**The Recurrence Relation:**

Let $f_n$ be the number of pairs of rabbits after $n$ months.

- **Initial Conditions:** $f_1 = 1$ (the initial pair) and $f_2 = 1$ (they have not bred yet).
    
- **Recursive Step:** For $n \ge 3$, the total pairs equal the pairs from the previous month ($f_{n-1}$) plus the newborn pairs. The number of newborn pairs equals the number of pairs that are at least two months old ($f_{n-2}$).
    
- **Formula:** $f_n = f_{n-1} + f_{n-2}$
    

---

## 3. Application: The Tower of Hanoi

**The Problem:** A puzzle consisting of 3 pegs and $n$ disks of varying sizes. The goal is to move all disks from peg 1 to peg 2. Rules: Move only one disk at a time, and a larger disk can never be placed on top of a smaller disk.

**The Recurrence Relation:**

Let $H_n$ denote the minimum number of moves needed to solve the puzzle with $n$ disks.

1. Move the top $n-1$ disks from peg 1 to peg 3 (requires $H_{n-1}$ moves).
    
2. Move the largest disk (the $n$-th disk) from peg 1 to peg 2 (requires $1$ move).
    
3. Move the $n-1$ disks from peg 3 onto peg 2 (requires $H_{n-1}$ moves).
    

- **Formula:** $H_n = 2H_{n-1} + 1$
    
- **Initial Condition:** $H_1 = 1$ (moving a single disk takes 1 move).
    

**Iterative Solution:**

By repeatedly substituting the relation into itself, we can find a closed-form solution:

$H_n = 2H_{n-1} + 1$

$H_n = 2(2H_{n-2} + 1) + 1 = 2^2H_{n-2} + 2 + 1$

$H_n = 2^3H_{n-3} + 2^2 + 2 + 1$

... continuing this pattern yields a geometric series:

$H_n = 2^{n-1}H_1 + 2^{n-2} + \dots + 2 + 1$

Since $H_1 = 1$, the sum of this geometric series is **$H_n = 2^n - 1$**.

---

## 4. Application: Counting Bit Strings

**The Problem:** Find the number of bit strings of length $n$ that do not contain two consecutive 0s.

**The Recurrence Relation:**

Let $a_n$ be the number of valid bit strings of length $n$. A valid string of length $n$ can end in either a 1 or a 0. We partition by these two cases:

1. **Ends in 1:** The preceding $n-1$ bits can be any valid bit string of length $n-1$. There are $a_{n-1}$ such strings.
    
2. **Ends in 0:** To avoid consecutive 0s, the preceding bit _must_ be a 1. Therefore, the string ends in `10`. The preceding $n-2$ bits can be any valid bit string of length $n-2$. There are $a_{n-2}$ such strings.
    

- **Formula:** $a_n = a_{n-1} + a_{n-2}$ for $n \ge 3$.
    
- **Initial Conditions:** $a_1 = 2$ (strings `0`, `1`), and $a_2 = 3$ (strings `01`, `10`, `11`).
    
- _Note:_ The sequence $\{a_n\}$ follows the Fibonacci pattern, shifted by two: $a_n = f_{n+2}$.
    

---

## 5. Application: Counting Ways to Parenthesize a Product

**The Problem:** Find a recurrence relation for $C_n$, the number of ways to parenthesize the product of $n+1$ numbers ($x_0 \cdot x_1 \dots x_n$) to specify the order of multiplication.

**The Recurrence Relation:**

Regardless of how parentheses are placed, there is always one final multiplication operator "$\cdot$" that remains outside all parentheses, splitting the sequence into two parts: a left sub-product and a right sub-product.

- Suppose the final operator occurs between $x_k$ and $x_{k+1}$.
    
- The left part ($x_0 \dots x_k$) contains $k+1$ numbers. There are $C_k$ ways to parenthesize it.
    
- The right part ($x_{k+1} \dots x_n$) contains $n-k$ numbers. There are $C_{n-k-1}$ ways to parenthesize it.
    
- By the product rule, for a fixed $k$, there are $C_k C_{n-k-1}$ ways.
    
    To find the total, sum over all possible positions $k$ for the final operator ($0 \le k \le n-1$):
    
- **Formula:** $C_n = \sum_{k=0}^{n-1} C_k C_{n-k-1}$
    
- **Initial Conditions:** $C_0 = 1, C_1 = 1$.
    
- _Note:_ This sequence $\{C_n\}$ generates the **Catalan Numbers**.
    

---

## 6. Application: Codeword Enumeration

**The Problem:** A system considers a string of decimal digits (0-9) to be a valid codeword if it contains an _even_ number of 0 digits. Let $a_n$ be the number of valid $n$-digit codewords.

**The Recurrence Relation:**

An $n$-digit string is formed by appending a single digit to an $(n-1)$-digit string. We partition based on the value of this appended $n$-th digit:

1. **The $n$-th digit is NOT 0 (9 choices, digits 1-9):** For the new string to be valid, the preceding $(n-1)$ digits must also form a valid codeword (maintaining the even count of 0s). This yields $9 \cdot a_{n-1}$ strings.
    
2. **The $n$-th digit IS 0 (1 choice):** For the new string to be valid (even number of 0s), the preceding $(n-1)$ digits must have contained an _odd_ number of 0s (i.e., an invalid codeword). The total number of all possible decimal strings of length $n-1$ is $10^{n-1}$. The number of invalid ones is $10^{n-1} - a_{n-1}$.
    

- **Formula:** $a_n = 9a_{n-1} + (10^{n-1} - a_{n-1})$
    
- **Simplified:** $a_n = 8a_{n-1} + 10^{n-1}$