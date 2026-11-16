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

There are N players, exactly M wolves and exactly L liars. Each player states another (or their own) identity: positive index = human, negative = wolf. **At least one but not all wolves lie.** Find the lexicographically largest wolf-index sequence in descending order; otherwise print `No Solution`.

## Input Specification:

One case: **5≤N≤100, 2≤M<N, 1≤L<N**, then N statements. Statement i is a signed player index ±t (1≤t≤N): +t claims human, −t wolf.

## Output Specification:

Print the M wolf indices **descending**, separated by one space, no leading/trailing spaces. Among valid sequences choose lexicographically largest (first differing index larger); if none, print `No Solution`.

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

`wolf[i]` marks identities. Positive statement about t lies iff wolf[t]; negative lies iff human[t]. Require exactly M wolves, L liars, and wolf-liars in [1,M−1].

Descending-ID DFS, wolf-first, returns the required largest sequence. Prune if `chosen+remaining<M`; once chosen=M, lower unassigned IDs are human. Reset failed wolf branches; self-references use the same test.

Worst $O(N\binom NM)$ time/O(N) space; accepted tests do not imply a polynomial bound. Stronger propagation can prune when forced liar/wolf-liar counts cannot meet the constraints.
