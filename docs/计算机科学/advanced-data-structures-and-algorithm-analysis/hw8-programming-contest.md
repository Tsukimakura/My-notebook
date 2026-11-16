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

Bob will participate in a programming contest.  There are altogether `n` problems in the contest.  Unlike in PAT (Programming Ability Test), in a programming contest one can not obtain partial scores.  For problem `i`, Bob will need `time[i]` to solve it and obtains the corresponding `score[i]`, or he may choose not to solve it at all.  Bob will be happy when he obtains a total score no less than `happy_score`.  You are supposed to find the minimum time needed for Bob to be happy. The function `need_time` must return the minimum time, or `-1` if it is impossible for Bob to obtain a score no less than `happy_score`.

## Format of function:

```c++
int need_time(const int time[], const int score[], int happy_score, int n);
```

Here `n` (${1\le } $ `n`$\le $ `MAXN`) is the number of problems;
`happy_score` ($ {1 \le} $ `happy_score` $ \le $ `MAXS`) is the minimum score for Bob to be happy;
`time[]` is the array to store `time[i]` ($ {1 \le} $`time[i]`$ {\le 100} $) which is the time to solve problem `i`;
`score[]` is the array to store `score[i]` ($ {1 \le} $`score[i]`$ {\le 100}$) which is the score Bob gets for solving problem `i`.

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

`dp[s]` is minimum time to score **at least s** with processed problems; dp[0]=0 and other states start at infinity. Each transition takes a problem once or skips it. Decreasing s preserves the previous-item values, including rest=max(0,s−score[i]). The score cap is the target, so overshooting remains feasible rather than being discarded.

The linked C function matches the supplied judge signature. It uses MAXS=1000 from the sample judge; increase that bound or allocate dynamically if a different judge defines a larger MAXS. Infinity 100n+1 exceeds any attainable total time. Complexity O(n·happy_score) time/O(happy_score) space. The sample optimum is **125** (the 87-time/93-score and 38-time/28-score problems).

Source: supplied HW archive in `~/ADS-docs/8`; the problem and samples are retained, submission metadata omitted.
