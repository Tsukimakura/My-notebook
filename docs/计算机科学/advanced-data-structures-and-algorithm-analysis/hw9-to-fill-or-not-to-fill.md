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

[Course overview（课程目录）](index.md) · [C source](assets/hw9-to-fill-or-not-to-fill.c) · [Python source](assets/hw9-to-fill-or-not-to-fill.py)

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

**Invariant（不变量）：** on reaching station i, `fuel` is remaining fuel and `cost` is total spending. Sort stations by distance, breaking ties by price; append destination `(price=0, distance=D)`.

| Reachable next stations | Target fuel before leaving | Next stop |
| --- | --- | --- |
| At least one has price ≤ current | Distance to the **first** such station / Davg | That first non-more-expensive station |
| All cost more | Cmax | Cheapest reachable station |
| None | — | Report current distance + Cmax × Davg |

Buy `max(0, target − fuel)` units, then subtract fuel consumed by travel. With no station at distance 0, report 0.00 immediately. Equal-price stops allow buying later at no extra cost. **Do not empty the tank at each stop, buy negative fuel, or jump to an unreachable globally cheapest station.**

### C implementation（C 实现）

[Complete C source](assets/hw9-to-fill-or-not-to-fill.c), adapted from the newly supplied saved answer; input checks and a small reachability tolerance are added. It uses selection sort and a direct next-station scan: **O(N²) time, O(N) space**. The progress export records a saved answer, not a judge result.

```sh
cc -std=c11 -O2 -Wall -Wextra -Wpedantic \
  hw9-to-fill-or-not-to-fill.c -o fill
./fill < input.txt
```

[Python implementation](assets/hw9-to-fill-or-not-to-fill.py) sorts in O(N log N), coalesces duplicate positions and scans in O(N²) overall. It stops at the first **strictly cheaper** station; the C version also stops at equal prices. Either tie rule gives the same minimum cost.

**Checks:** both samples; no origin station; an unreachable gap; exact full-tank range; same-price/duplicate-position stations; free fuel; residual fuel and nonintegral inputs. Do not round intermediate fuel/cost values.
