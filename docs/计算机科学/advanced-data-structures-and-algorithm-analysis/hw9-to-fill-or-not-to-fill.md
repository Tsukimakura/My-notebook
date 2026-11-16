---
title: "HW9: To Fill or Not to Fill"
status: draft
tags: [cs, algorithms, programming]
created: 2026-11-16
updated: 2026-11-16
sources:
  - https://www.icourse163.org/course/ZJU1-1460402161
---

# HW9: To Fill or Not to Fill

[Course overview（课程目录）](index.md) · [Complete source（完整源码）](assets/hw9-to-fill-or-not-to-fill.py)

## Problem（完整题意）

Find the cheapest fuel purchases along a fixed route; station prices vary, tank capacity is limited and initially empty. If unreachable, report the maximum travel distance.

## Input Specification:

One case: positive **Cmax≤100** (tank capacity), **D≤30000** (route length), **Davg≤20** (distance per fuel unit), **N≤500** stations. Each station gives nonnegative `(price,distance)`, with distance≤D. Values are space-separated and may be nonintegral.

## Output Specification:

Initially empty tank. Print minimum cost to **2 decimal places**, or `The maximum travel distance = X` with X to 2 decimals if unreachable.

## Sample Input 1:

```text
50 1300 12 8
6.00 1250
7.00 600
7.00 150
7.10 0
7.20 200
7.50 400
7.30 1000
6.85 300
```

## Sample Output 1:

```text
749.17
```

## Sample Input 2:

```text
50 1300 12 2
7.10 0
7.00 600
```

## Sample Output 2:

```text
The maximum travel distance = 1200.00
```

## Solution（解法）

Use Lecture 9’s greedy rule. The executable preserves residual fuel, coalesces duplicate positions and adds a destination sentinel. On failure output distance, not spending. Samples: **749.17**; **The maximum travel distance = 1200.00**.

Sorting O(N log N), reachable-station scans O(N²), O(N) memory. Prices and distances may be nonintegral; do not truncate fuel or round intermediate costs. The implementation assumes inputs obey the stated bounds.
