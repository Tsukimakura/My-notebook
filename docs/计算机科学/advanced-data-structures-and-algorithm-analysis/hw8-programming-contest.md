---
title: "HW8: Programming Contest"
status: draft
tags: [cs, algorithms, programming]
created: 2026-11-16
updated: 2026-11-16
sources:
  - https://www.icourse163.org/course/ZJU1-1460402161
---

# HW8: Programming Contest

[Course overview（课程目录）](index.md) · [Complete source（完整源码）](assets/hw8-programming-contest.c)

## Problem（完整题意）

Choose each problem once or skip it. Problem i costs `time[i]` and earns `score[i]` (no partial credit). Return minimum time to reach **at least happy_score**, or **−1** if impossible.

## Format of function:

```c++
int need_time(const int time[], const int score[], int happy_score, int n);
```

**Bounds:** 1≤n≤MAXN, 1≤happy_score≤MAXS; each time/score is 1..100. Sample judge: MAXN=10, MAXS=1000.

## Sample Input:

```text
6 121

84 87 78 16 94 38
87 93 50 22 63 28

```

## Sample Output:

```text
125
```

## Solution and invariant（解法与不变量）

`dp[s]` = minimum time for at least s points; dp[0]=0, others ∞. For each problem update s **downward**, using rest=max(0,s−score[i]); thus an item is used once and overshooting is retained.

The linked judge-compatible C uses MAXS=1000; enlarge/allocate dynamically for a different bound. Infinity=100n+1 exceeds all feasible time. O(n·happy_score) time/O(happy_score) space. Sample 125 = 87+38 time, for 93+28=121 points.
