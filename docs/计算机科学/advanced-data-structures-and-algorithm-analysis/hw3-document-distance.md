---
title: "HW3: Document Distance"
status: draft
tags: [cs, algorithms, information-retrieval, programming]
created: 2026-10-06
updated: 2026-10-06
sources:
  - https://www.icourse163.org/course/ZJU1-1460402161
  - https://tartarus.org/martin/PorterStemmer/index.html
---

# HW3: Document Distance（文档距离）

[Lecture 3（对应课时）](lecture-03-inverted-file-index.md) · [Course overview（课程信息）](index.md)

## 1. Problem（完整题意）

**HW3 programming 7-1 · 10 points · 周振坤.** Compare documents using word-frequency vectors（词频向量）, as a simplified plagiarism-checking metric（查重度量）.

- A **word（词）** is a maximal continuous sequence of **alphanumeric characters（字母或数字）**, at most **20 characters**. Punctuation/whitespace separates words. For example, `the course data structure is fun` has six distinct words.
- **Word frequency（词频）** $F_D(w)$ is the number of occurrences of normalized word $w$ in document $D$.
- **Case-insensitive（大小写不敏感）stemming（词干提取）** must handle `es`, `ed`, `ing`, `ies`.
- **Retain stop words（保留停用词）** as ordinary words. This differs from the optional stop-word filter in a search index.
- Form vectors over the union of all normalized words; missing coordinates have frequency 0. The inner product（内积）and requested **angle metric（夹角度量）** are

$$
\mathbf F_1\cdot\mathbf F_2=\sum_w F_1(w)F_2(w),\qquad
\|\mathbf F_D\|_2=\sqrt{\sum_w F_D(w)^2},
$$

$$
\theta(D_1,D_2)=\arccos\frac{\mathbf F_1\cdot\mathbf F_2}
{\|\mathbf F_1\|_2\|\mathbf F_2\|_2}\in[0,\pi/2].
$$

Output the **angle in radians（弧度）**, rather than cosine similarity. Smaller angle means more similar frequency proportions; 0 for proportional nonzero vectors, $\pi/2$ for disjoint vocabularies. Word order is ignored, so this is a **bag-of-words（词袋）** model, not proof of plagiarism.

**题面勘误：**the supplied statement calls the inner product a “projection”; a scalar projection actually divides by the target vector's norm. It also says “any norm”, then specifies the 2-norm: the angle formula requires the **Euclidean 2-norm（欧几里得二范数）**. Neither shorthand changes the required computation above.

### Input and output（输入与输出）

One test case per input:

1. Positive integer **$N\le100$**, the number of documents.
2. $N$ document blocks: a title of **at most 6 characters without spaces**, followed by article text; a line containing only `#` ends the document.
3. Positive integer **$M\le100000$**, then $M$ inquiries, each containing two document names separated by a space.

The largest input is about **1 MB**. For each inquiry, print `Case k: value`, numbered from 1, with the distance to **3 decimal places（保留三位小数）**.

### Sample（样例）

```text
3
A00
A B C
#
A01
B C D
#
A02
A C
D A
#
2
A00 A01
A00 A02
```

```text
Case 1: 0.841
Case 2: 0.785
```

In vocabulary order `(a,b,c,d)`, the vectors are $(1,1,1,0)$, $(0,1,1,1)$, $(2,0,1,1)$:

$$
\theta_{00,01}=\arccos(2/3)\approx0.841,\qquad
\theta_{00,02}=\arccos\frac{3}{\sqrt3\sqrt6}=\pi/4\approx0.785.
$$

## 2. Solution（解题思路）

**Normalize once → sparse counts → sorted-vector intersection → cache pair distances.** 先统一词形，再统计；同一个词必须在所有文档里使用同一个 ID。

1. **Tokenize and normalize（分词与归一化）：** collect ASCII letters/digits, lowercase, then stem. Flush a pending token both at a separator and at the document terminator/EOF.
2. **Shared dictionary（共享词典）：** hash normalized strings to integer IDs; resolve collisions by comparing complete strings. Per-document `seen[id]` / `pos[id]` arrays find an existing count without clearing a full vocabulary array for each document.
3. **Sparse vector（稀疏向量）：** each document stores only `(termID, count)` for its distinct terms. Sort by ID, and compute its norm once. 重复词增加 count，而不是新增坐标。
4. **Dot product by two pointers（双指针内积）：** advance the smaller ID; multiply frequencies only when IDs agree. Time $O(u_i+u_j)$ for $u_i,u_j$ distinct terms; no dense vocabulary scan.
5. **Precompute（预计算）：** store all $N(N+1)/2$ pair angles and mirror them. Repeated/reversed inquiries reuse the same result. Title lookup in the supplied implementation is linear in $N$; a name→index map can make it expected $O(1)$.

**Stemming is not blind suffix deletion（不是直接删后缀）：** `processing → process`, `cities → citi`, `ponies → poni`; the stem need not be an English word. The archive's accepted C solution uses the **original Porter stemmer**, including its measure, vowel and consonant checks; the implementation linked below retains those rules. The problem names required suffixes but does not fully specify a normalization algorithm, so arbitrary suffix rules need not match its tests. [Porter's official description and implementations](https://tartarus.org/martin/PorterStemmer/index.html).

### Core calculation（核心计算）

For sorted sparse arrays `a,b` and precomputed norms:

```text
i = j = 0; dot = 0
while i < len(a) and j < len(b):
    if a[i].termID == b[j].termID:
        dot += a[i].count * b[j].count
        i += 1; j += 1
    else if a[i].termID < b[j].termID:
        i += 1
    else:
        j += 1
if either norm is zero: angle is undefined
cosine = clamp(dot / (norm(a) * norm(b)), 0, 1)
return acos(cosine)
```

Use `double` **before multiplication（乘法前转换）** to avoid integer overflow. Clamp only to absorb floating-point rounding; do not round cosine before `acos`. **零向量没有定义夹角**：the task does not specify an empty-document answer; this implementation reports an error rather than inventing one.

### Complexity（复杂度）

Let $S$ be total input text length, $V$ the vocabulary size and $u_i$ the distinct-word count of document $i$.

| Stage | Cost |
| --- | --- |
| Tokenization / hash counting | Expected $O(S)$ with bounded 20-character tokens; hashing worst case depends on collisions. |
| Sparse-vector sorting | $O(\sum_i u_i\log(u_i+1))$. |
| All pair distances | $O(N\sum_i u_i)$; norms add $O(\sum_i u_i)$. |
| $M$ inquiries | $O(MN)$ with this source's linear name lookup; expected $O(M)$ with a hash map. |
| Space | $O(V+\sum_i u_i+N^2+H)$, including the dictionary, sparse counts, cache and $H$ hash buckets. |

With $N\le100$ and potentially 100000 inquiries, cached pair distances avoid repeatedly scanning document terms. A dense frequency matrix would unnecessarily allocate $N\times V$ entries.

## 3. Complete C implementation（完整 C 实现）

[Download / inspect hw3-document-distance.c](assets/hw3-document-distance.c). The full tokenizer, dictionary, Porter stemmer, sparse counting, pair cache and I/O are included. This version adapts the supplied accepted submission with EOF/token-boundary handling, allocation/capacity checks, the short-`ion` stemming boundary fix, cosine clamping and buffer cleanup.

```sh
cc -std=c11 -O2 -Wall -Wextra -Wpedantic \
  hw3-document-distance.c -lm -o document-distance
./document-distance < input.txt
```

**检查点：**大小写混用；标点与换行；`#` 前尚未入表的词；20 字符上界；词频而非出现与否；保留 `a/the`；不相交文档；相同或比例相同文档；词干变化；多次与反向查询。The supplied archive records this algorithm as accepted; the adapted implementation is checked locally, not resubmitted to PTA.
