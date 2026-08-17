# 20_The Pigeonhole Principle

## 1. The Basic Pigeonhole Principle

**Definition:** If a flock of pigeons roosts in a set of pigeonholes, and there are more pigeons than pigeonholes, then there must be at least one pigeonhole that has more than one pigeon in it.

**Formal Statement:** If $k$ is a positive integer and $k + 1$ objects are placed into $k$ boxes, then at least one box contains two or more objects.

- **Proof Approach:** By contraposition. Suppose none of the $k$ boxes has more than one object. Then the total number of objects would be at most $k \cdot 1 = k$. This contradicts the initial premise that there are $k + 1$ objects.

**Corollary for Functions:**

A function $f$ from a set with $k + 1$ elements to a set with $k$ elements cannot be one-to-one (injective).

- _Mapping:_ Elements of the domain are the "objects" ($k+1$), and elements of the codomain are the "boxes" ($k$).

### Direct Applications

Identifying the "pigeons" and the "holes" is the key to applying the principle.

- **Birthday Problem:** Among any group of 367 people, at least two share the same birthday. (Pigeons: 367 people; Holes: 366 possible birthdays).

- **Divisibility:** Among any group of 11 integers, there exist two integers $a$ and $b$ such that $10 \mid (a - b)$. (Pigeons: 11 integers; Holes: 10 possible remainders when divided by 10).

- **Mutual Friends:** In a party of $n$ people ($n \ge 2$), there are always at least two people with the exact same number of friends at the party. (Pigeons: $n$ people; Holes: possible number of friends $\{0, 1, \dots, n-1\}$. Note that a person having 0 friends and a person having $n-1$ friends cannot coexist, leaving at most $n-1$ valid holes for $n$ people).

---

## 2. The Generalized Pigeonhole Principle

**Theorem:** If $N$ objects are placed into $k$ boxes, then there is at least one box containing at least $\lceil N/k \rceil$ objects.

- _Proof intuition:_ If every box contained at most $\lceil N/k \rceil - 1$ objects, the maximum total number of objects would be strictly less than $N$, creating a contradiction.

### Examples of Generalized Application

- **Birth Months:** Among 100 people, what is the minimum number of people born in the same month?

    $\lceil 100 / 12 \rceil = 9$ people.

- **Card Selection:** How many cards must be selected from a standard 52-card deck to guarantee at least 3 cards of the same suit?

    We need $\lceil N/4 \rceil \ge 3$. The smallest integer $N$ satisfying this is $N = 2 \cdot 4 + 1 = 9$ cards.

- **Numbering Plans:** What is the least number of area codes needed to guarantee that 25 million phones in a state have distinct 10-digit numbers (format NXX-NXXX, where N = 2-9, X = 0-9)?

    Possible numbers per area code: $8 \times 10^6$.

    Area codes needed: $\lceil 25 \times 10^6 / (8 \times 10^6) \rceil = \lceil 3.125 \rceil = 4$.

---

## 3. Advanced & Elegant Applications

The Pigeonhole Principle can be used to prove the existence of specific structural patterns within sequences and sets.

### Application 1: Bounded Cumulative Sums (The Baseball Problem)

**Scenario:** A team plays at least 1 game a day for 30 days, but no more than 45 total games. Show there is a consecutive period where exactly 14 games are played.

**Proof Strategy:**

1. Let $a_j$ be the cumulative total of games played up to day $j$.

2. Because at least one game is played daily, the sequence is strictly increasing: $1 \le a_1 < a_2 < \dots < a_{30} \le 45$.

3. Let $b_j = a_j + 14$. The sequence $b_j$ is also strictly increasing: $15 \le b_1 < b_2 < \dots < b_{30} \le 45 + 14 = 59$.

4. We have 60 total numbers ($a_1 \dots a_{30}$ and $b_1 \dots b_{30}$) that must take integer values between 1 and 59.

5. By the Pigeonhole Principle, two of these 60 numbers must be equal. Since the $a$ sequence is distinct and the $b$ sequence is distinct, an $a_i$ must equal a $b_j$.

6. Therefore, $a_i = a_j + 14$, meaning exactly 14 games were played between day $j+1$ and day $i$.

### Application 2: Monotonic Subsequences

**Theorem:** Every sequence of $n^2 + 1$ distinct integers contains a subsequence of length $n + 1$ that is either strictly increasing or strictly decreasing.

**Proof Strategy:**

1. Let the sequence be $a_1, a_2, \dots, a_{n^2+1}$.

2. Associate a pair $(x_k, y_k)$ to each term $a_k$, where $x_k$ is the length of the longest increasing subsequence starting at $a_k$, and $y_k$ is the length of the longest decreasing subsequence starting at $a_k$.

3. Suppose, for contradiction, that no subsequence is of length $n+1$. Then $1 \le x_k \le n$ and $1 \le y_k \le n$.

4. There are exactly $n \cdot n = n^2$ possible unique pairs of $(x_k, y_k)$.

5. Since there are $n^2 + 1$ terms, the Pigeonhole Principle states at least two terms $a_i$ and $a_j$ (where $i < j$) must have the exact same pair: $(x_i, y_i) = (x_j, y_j)$.

6. Because the integers are distinct, either $a_i < a_j$ (which would make $x_i \ge x_j + 1$) or $a_i > a_j$ (which would make $y_i \ge y_j + 1$). Both cases contradict the claim that $(x_i, y_i) = (x_j, y_j)$. Thus, a sequence of length $n+1$ must exist.

---

## 4. Introduction to Ramsey Theory

Ramsey theory explores conditions under which order must appear within chaos, heavily relying on generalizations of the Pigeonhole Principle.

- **Ramsey Number $R(m,n)$:** The smallest number of people at a party necessary to guarantee that there are either $m$ mutual friends or $n$ mutual enemies.

- **Symmetry:** $R(m, n) = R(n, m)$ and $R(2, n) = n$.

- **The "Party Problem" Theorem:** $R(3,3) = 6$. Among any 6 people, there are either 3 mutual acquaintances or 3 mutual strangers.

- **Graph Theory Representation:** For a complete graph with 6 vertices ($K_6$) where edges are colored either red (acquainted) or blue (unacquainted), there must exist a monochromatic triangle ($K_3$). Validated mathematically as $K_6 \to K_3, K_3$. Exact values for larger Ramsey numbers are notoriously difficult to compute; currently, only 9 exact non-trivial values are known (for $3 \le m \le n$).
