---
title: "HW1: Root of AVL Tree"
status: draft
tags: [cs, avl, c, exercises]
created: 2026-10-06
updated: 2026-10-06
sources:
  - https://www.icourse163.org/course/ZJU1-1460402161
---

# HW1: Root of AVL Tree（AVL 树的根）

[返回 Lecture 1 笔记](lecture-01-avl-splay-amortized-analysis.md)

## Problem（题目）

**Task (11 points).** Read $N$ distinct integer keys, insert them into an initially empty AVL tree in the given order, and print the resulting root key. Input consists of a positive $N\le20$, followed by the $N$ keys. Output is one integer followed by a newline.

```text
Sample input 1:
5
88 70 61 96 120

Sample output 1:
70

Sample input 2:
7
88 70 61 96 120 90 65

Sample output 2:
88
```

## Implementation（实现）

**思路：**递归插入 → 回溯更新 height（高度）→ 根据 BF（平衡因子）选择单旋或双旋。 A rotation updates the **demoted** node first, then the promoted node, and returns the new subtree root. The supplied submission uses empty height 0 and leaf height 1, which is also valid if used consistently; the implementation below uses the lecture's −1/0 convention.

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int key, height;
    struct Node *left, *right;
} Node;

/* Empty height is -1; leaves have height 0. */
static int height(const Node *p) {
    return p ? p->height : -1;
}

static void update(Node *p) {
    int a = height(p->left), b = height(p->right);
    p->height = 1 + (a > b ? a : b);
}

static int balance(const Node *p) {
    return p ? height(p->left) - height(p->right) : 0;
}

/* Require y->left != NULL; preserve inorder order and return the new root. */
static Node *rotate_right(Node *y) {
    Node *x = y->left;
    y->left = x->right;
    x->right = y;
    update(y);                 /* Demoted node must be updated first. */
    update(x);
    return x;
}

/* Require x->right != NULL; symmetric to rotate_right. */
static Node *rotate_left(Node *x) {
    Node *y = x->right;
    x->right = y->left;
    y->left = x;
    update(x);
    update(y);
    return y;
}

/* Insert into an AVL set; duplicates leave the set unchanged. */
static Node *insert(Node *p, int key) {
    if (!p) {
        Node *q = malloc(sizeof *q);
        if (!q) {
            fputs("Allocation failed\n", stderr);
            exit(EXIT_FAILURE);
        }
        *q = (Node){key, 0, NULL, NULL};
        return q;
    }
    if (key < p->key) p->left = insert(p->left, key);
    else if (key > p->key) p->right = insert(p->right, key);
    else return p;

    update(p);
    if (balance(p) > 1) {
        if (balance(p->left) < 0) p->left = rotate_left(p->left);
        return rotate_right(p);
    }
    if (balance(p) < -1) {
        if (balance(p->right) > 0) p->right = rotate_right(p->right);
        return rotate_left(p);
    }
    return p;
}

static void destroy(Node *p) {
    if (!p) return;
    destroy(p->left);
    destroy(p->right);
    free(p);
}

int main(void) {
    int n, key;
    Node *root = NULL;
    if (scanf("%d", &n) != 1 || n < 1 || n > 20) return EXIT_FAILURE;
    /* Loop invariant: root is the AVL tree for all keys read so far. */
    for (int i = 0; i < n; ++i) {
        if (scanf("%d", &key) != 1) {
            destroy(root);
            return EXIT_FAILURE;
        }
        root = insert(root, key);
    }
    printf("%d\n", root->key);
    destroy(root);
    return EXIT_SUCCESS;
}
```

## Complexity and tests（复杂度与测试）

**Complexity:** $O(N\log(N+1))$ total insertion time, $O(N)$ allocated nodes, and $O(\log(N+1))$ recursion depth. Test LL, RR, LR, RL, rotations below the root, single-node input, ascending/descending keys, and the maximum $N=20$. The archived accepted submission explicitly covers all four rotation cases, deep LL/RL cases, and minimum/maximum input sizes.

For sample 1, inserting 61 causes LL at 88 and inserting 120 causes RR at 88; root remains 70. In sample 2, inserting 90 causes RL at 70 and promotes 88; inserting 65 does not change the root.

## Week 2 discussion（第二周线下补充）

**Why is printing only the root a weak test?（为何只输出根容易漏检？）** With at most 20 keys, guessing a value near the sorted median can pass some cases, but the AVL root depends on insertion order and rotations; the median is not a correctness rule. Requiring a **preorder traversal（前序遍历）** checks much more of the constructed shape without increasing input size. For distinct keys, BST order lets preorder determine the tree; additionally check cached heights and balance factors in implementation tests.

课堂用此讨论说明 partial credit（部分分）与 boundary cases（边界样例）：单元素等边界答案、只适用小规模的 brute force（暴力法）可能获得部分分，但不能证明一般算法正确或满足复杂度。练习应完成正确实现；测试应覆盖能区分“猜根”与真正旋转的输入。
