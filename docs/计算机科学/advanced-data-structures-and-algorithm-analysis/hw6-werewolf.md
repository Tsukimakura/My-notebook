---
title: "HW6: Werewolf"
status: draft
tags: [cs, algorithms, programming]
created: 2026-11-16
updated: 2026-11-16
sources:
  - https://www.icourse163.org/course/ZJU1-1460402161
---

# HW6: Werewolf

[Course overview（课程目录）](index.md) · [Complete source（完整源码）](assets/hw6-werewolf.c)

## Problem（完整题意）

Werewolf（狼人杀） is a game in which the players are partitioned into two parties: the werewolves and the human beings. Suppose that in a game,

* player #1 said: "Player #2 is a werewolf.";
* player #2 said: "Player #3 is a human.";
* player #3 said: "Player #4 is a werewolf.";
* player #4 said: "Player #5 is a human."; and
* player #5 said: "Player #4 is a human.".

Given that there were 2 werewolves among them, at least one but not all the werewolves were lying, and there were exactly 2 liers. Can you point out the werewolves?

Now you are asked to solve a harder vertion of this problem: given that there were N players, with M werewolves among them, at least one but not all the werewolves were lying, and there were exactly L liers. You are supposed to point out the werewolves.

## Input Specification:

Each input file contains one test case. For each case, the first line gives three positive integer N (5 $\le $ N $ \le $ 100), M and L (2 $ \le $ M $ < $ N, 1 $ \le $ L $ < $ N). Then N lines follow and the i-th line gives the statement of the i-th player (1 $ \le $ i $ \le $ N), which is represented by the index of the player with a positive sign for a human and a negative sign for a werewolf.

## Output Specification:

If a solution exists, print in a line in descending order the indices of the M werewolves. The numbers must be separated by exactly one space with no extra spaces at the beginning or the end of the line. If there are more than one solution, you must output the largest solution sequence -- that is, for two sequences A = { a\[1\], ..., a\[M\] } and B = { b\[1\], ..., b\[M\] }, if there exists 0 $ \le $ k $ < $ M such that a\[i\] = b\[i\] (i $ \le $ k) and a\[k+1\]$ >$b\[k+1\], then A is said to be larger than B. In case there is no solution, simply print `No Solution`.

## Sample Input 1:

```text
5 2 2
-2
+3
-4
+5
+4
```

## Sample Output 1:

```text
4 1
```

## Sample Input 2:

```text
6 2 3
-2
+3
-4
+5
+4
-3
```

## Sample Output 2:

```text
6 4
```

## Sample Input 3:

```text
6 2 5
-2
+3
-4
+5
+4
+6
```

## Sample Output 3:

```text
No Solution
```

## Solution and limits（解法与边界）

Use `wolf[i]` to assign identities. A positive statement about t is a lie iff t is a wolf; a negative statement is a lie iff t is human. Count **all liars** and **liars who are wolves** separately. Accept exactly M wolves, exactly L liars and wolf-liars in `[1,M-1]`.

Search from index N downward, try wolf before human, and stop at the first valid complete assignment. This is the required lexicographically largest descending wolf list. Prune if `chosen + remaining < M`; once chosen=M, evaluate with all still-unassigned lower IDs human. Restore each failed wolf assignment before its human branch. Self-references are evaluated by the same rule.

Worst case $O(N\binom NM)$ time, O(N) space. N≤100 does **not** imply this enumeration is efficient for every M; the archived accepted code does not prove a polynomial bound. Stronger propagation can count forced true/false statements as identities are assigned and prune when the required liar counts become impossible. All three supplied samples are retained above.

Source: supplied HW archive in `~/ADS-docs/6`; the problem and samples are retained, submission metadata omitted.
