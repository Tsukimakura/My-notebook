---
title: "Lecture 5: Binomial Queues（二项队列）"
status: draft
tags: [cs, algorithms, course]
created: 2026-11-16
updated: 2026-11-16
sources:
  - https://www.icourse163.org/course/ZJU1-1460402161
---

# Lecture 5: Binomial Queues（二项队列）

[Course overview（课程目录）](index.md)

## 1. Structure（结构）

**A binomial queue is a forest（森林）, not one binary heap.** It contains at most one heap-ordered binomial tree of each rank. Heap order means parent ≤ child; it does not order siblings by key.

- $B_0$ is one node. Link two $B_k$ trees by making the larger root a child of the smaller root → $B_{k+1}$, in **$O(1)$**.
- $B_k$ has **height $k$, root degree $k$, $2^k$ nodes**, and $\binom{k}{d}$ nodes at depth $d$. Its root's child subtrees are $B_{k-1},\ldots,B_0$.
- The present ranks are precisely the **1-bits of $N$（二进制表示）**. Thus the rank set is unique, but key assignments/tree labels need not be unique.
- Root count is **popcount$(N)$**, bounded by $\lfloor\log_2N\rfloor+1$, not exactly $\log N$. The slide's ceiling-only bound fails at $N=1$ and $N=2^k-1$.

![Binomial tree construction and depth counts; supplied slide 2](assets/lecture-05-slide-02.png)

**Checkpoints 5.1–5.2:** root degree $k$; size $2^k$; root count logarithmically bounded. **Quiz 5.1 / HW5 MC1:** $42=101010_2=2^5+2^3+2$ → **B: $B_1,B_3,B_5$** (other rank sets represent 63, 34 and 20).

## 2. Operations and representation（操作与表示）

| Operation | Method | Bound |
| --- | --- | --- |
| FindMin | Scan roots; cache and maintain the minimum if required. | $O(\log N)$; cached $O(1)$. |
| Merge | Binary addition of rank slots with a carry tree. | $O(\log(N_1+N_2+1))$. |
| Insert | Carry a singleton through consecutive occupied low ranks; **stop at the first empty slot**. | Worst $O(\log N)$, amortized $O(1)$. |
| DeleteMin | Find winning root, detach its tree, remove root, form child forest, merge back. | $O(\log N)$ worst/amortized bound. |
| Find arbitrary key | Traverse candidates; prune a subtree whose root exceeds the key. | Worst $O(N)$, not logarithmic. |

**Implementation（实现）：** array `TheTrees[k]` stores the root of $B_k$; `CurrentSize` counts all nodes, not trees. Each node has `Element, LeftChild, NextSibling`. Children are linked in **decreasing rank/size（按规模递减）**, not increasing size or key order. Linking the new largest child at the list front is constant time:

```c
/* Preconditions: nonnull disjoint trees of equal rank. */
BinTree CombineTrees(BinTree a, BinTree b) {
    if (a->Element > b->Element) { BinTree t = a; a = b; b = t; }
    b->NextSibling = a->LeftChild;
    a->LeftChild = b;
    return a;
}
```

![Root array and left-child-next-sibling representation; supplied slide 7](assets/lecture-05-slide-07.png)

### Merge = full adder（合并就是全加器）

At rank $i$, let `A,B,C` denote the two input trees and carry. Each tree represents $2^i$ nodes. The eight cases are:

| Present trees | Output at rank $i$ | Carry to $i+1$ |
| --- | --- | --- |
| none | empty | none |
| A only / B only / C only | that tree | none |
| A+B / A+C / B+C | empty | link the pair |
| A+B+C | one tree (course code keeps C) | link the other two |

![Complete eight-case merge code; supplied slide 10](assets/lecture-05-slide-10.png)

Stop only after all ranks capable of contributing to the total size are processed. Clear moved slots and the consumed input's size, check capacity, and avoid overflowing `1<<rank` or doubling counters. An unconditional scan of a large fixed-capacity array would defeat the **constant amortized Insert** implementation. Destructive merge requires disjoint ownership.

**DeleteMin details:** removing $B_k$ exposes child ranks $k-1,\ldots,0$. Detach **every sibling link** and put each root into the matching rank slot; the child queue has size $2^k-1$. Remove $2^k$ from the old queue's size before merging it back; final size is old size − 1. Free the removed root and temporary collection header, not the transferred subtrees.

## 3. Why Insert is amortized constant（插入摊还分析）

If the lowest empty rank is $i$, insertion makes $i$ links and costs $c=i+1$ units. It replaces $i$ trees by one, so for potential **$\Phi=$ number of trees**:

$$
\Delta\Phi=1-i=2-c,\qquad \widehat c=c+\Delta\Phi=2.
$$

Starting empty, $N$ insertions cost $2N-\Phi_N\le2N=O(N)$; reading/allocating nodes gives $\Theta(N)$. Equivalently, total links are **$N-\operatorname{popcount}(N)$**; carries of length $k$ occur with geometrically decreasing frequency. This is a deterministic sequence bound, not a probabilistic average.

**Offline comparison:** pairwise leftist BuildHeap is also linear; binary-tree linking and right-path merging have different constants. No universal timing ratio follows from the asymptotic bounds. Ordinary binary heaps offer locality; binomial queues offer efficient meld and amortized insertion. Fibonacci heaps defer consolidation and use cuts/cascading cuts: Insert/Meld/DecreaseKey amortized $O(1)$, DeleteMin $O(\log N)$; this is supplementary comparison from the heap presentations, not an implementation requirement. Distinguish true DecreaseKey from lazy duplicate insertion in Dijkstra tests, and compare the same workloads, allocation policy and correctness checks.

## 4. Exercises（小测与作业）

| Source | Question | Answer / reason |
| --- | --- | --- |
| WK5 TF1, TF2 | DeleteMin / Merge are constant on average. | **Both False** as general guarantees; only optimized insertion gets the stated constant amortized bound. |
| Quiz 5.3 / WK5 TF4 | First-child/next-sibling? Increasing child sizes? | **True / False**: decreasing ranks allow front insertion. |
| Quiz 5.4 / WK5 TF5 / WK6 TF5 | $N$ insertions from empty take $O(N)$, or $\Theta(N\log N)$? | First **True**, second **False**. |
| Quiz 5.2 / WK5 TF8 | Insert into size 15 costs less than size 19. | **False**: `1111` has 4 carries; `10011` has 2. |
| WK6 TF1 | Insert into size 11 costs more than size 17. | **True** in the carry model: 2 links versus 1. |
| HW5 MC2 | Which is constant amortized: merge, find-max, delete-min, insertion? | **D: insertion**. |
| Quiz 5.4 | Merge sizes 12 and 13: potential change? | **C: −2**, popcount$(25)-$popcount$(12)-$popcount$(13)=3-2-3$. |
| WK5 MC4 | Same question for 22 and 13. | **D: −3**, $3-3-3$. |
| Quiz 5.2 / WK5 MC2 | Insert 20 into size 6, keys 12,13,14,23,24,35: which is impossible? A 20.LeftChild null; B 20.NextSibling null; C 14.NextSibling=20; D 12.LeftChild=14. | **C**. $6\to7$ fills vacant $B_0$; node 20 remains a separate root, not a sibling in a child list. |
| WK5 MC3 | Delete 14 from size 5, keys 12,13,14,23,24: impossible relation among A 12.LeftChild null; B 12.NextSibling null; C 13.NextSibling=23; D 24.LeftChild null? | **A** under a valid normalized queue: remaining size 4 is $B_2$, rooted at minimum 12, which must have children. C is possible: root 12 has child 13 (itself with child 24) followed by sibling 23. The archive's selected C is not a valid structural conclusion. |

### Pictured merge · Quiz 5.2 / HW5 MC3

![Original two binomial queues for the merge problem](assets/lecture-05-1320673575-question-002.jpg)

**Which must be false?** A result has $B_2,B_4$; B 4 has children 13 and 15; C if 23 is child of 2 then 12 is another child; D if 4 is child of 2 then 23 is another child. **D.** Total size $13+7=20=10100_2$. In the three-tree carry case, retaining a different same-rank tree gives different valid shapes: 4 can become a child of 2 while the tree rooted at 23 is retained separately as $B_2$. Trace ranks before key comparisons; the result is not uniquely labeled.

### Pictured deletion · Quiz 5.2 / HW5 MC4; WK6 MC4 variant

![Original queue before deleting minimum 2](assets/lecture-05-1320673575-question-001.jpg)

A result has $B_1,B_2$; B 11 and 15 can be children of 4; C 29 can never be a result root; D if 29 is child of 4 then 15 roots $B_1$. **False: C**. Removing 2 leaves six nodes; among three rank-0 trees, one can be kept as carry/result so that 29 later roots a $B_1$ tree. Different permissible three-tree choices matter.

![WK6 variant replaces 11,29 with 16,9](assets/ads-question-33eada418c.png)

**WK6 MC4:** A “9 can never be root”; B “16 and 15 can be children of 4”; C “if 9 child of 4, 15 roots $B_1$”; D ranks $B_1,B_2$. **A is false** for the same reason; this is a different labeled input.

### Code completions（程序填空）

**WK5 Insert:** `Carry = CombineTrees(Carry, H->TheTrees[i]);` then clear that slot and advance; after the loop **`H->TheTrees[i] = Carry`**. Initialize singleton links to NULL, N increments once, check allocation/capacity first.

**HW5 / WK6 Find:** archived blanks are **`>= T->Element`** and **`T->NextSibling != NULL`**. The supplied caller lacks a null-root check. A safe version is:

```c
BinTree Recur_Find(BinTree t, ElementType x) {
    for (; t != NULL; t = t->NextSibling) {
        if (x == t->Element) return t;
        if (x > t->Element) {
            BinTree found = Recur_Find(t->LeftChild, x);
            if (found != NULL) return found;
        }
    }
    return NULL;
}
/* For each occupied root slot call Recur_Find(root, x).
   Alternatively test root != NULL && x >= root->Element first. */
```

Do not prune an entire sibling list because its first key is too large: sibling keys are unordered. Worst-case search remains $O(N)$.

**WK6 “Legal Binomial Queue”:** export contains only a sample placeholder, explicitly saying **C (28)**, with options 6/26/28/1041; its actual predicate/figure is absent. Preserve this as **incomplete source**, not an invented exercise.

## 5. Sources（来源）

Based on `~/ADS-docs/5`: merged and lesson MOOC notes/quizzes, PDF, video captures, offline `downloads/course_87216_sub_1978951`, HW5/WK5; later binomial-only WK6 review is integrated above. Images are supplied course/PTA figures, retained for study with attribution here. Reading: adapted Weiss C 2nd ed. Ch.5 pp.170–180, Ch.11 pp.430–435; CLRS 3rd ed. Ch.19 pp.505–530 (Fibonacci heaps, distinguish the structure). `draft`: no claim of instructor approval.
