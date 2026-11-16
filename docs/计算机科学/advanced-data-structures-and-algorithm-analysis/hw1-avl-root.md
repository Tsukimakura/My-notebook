---
title: "HW1: Root of AVL Tree"
status: draft
tags: [cs, avl, c, exercises]
created: 2026-10-06
updated: 2026-11-16
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

BST insert → update cached height on return → choose rotations by BF. Update the demoted node before the promoted one; return the new root. This implementation uses empty/leaf heights −1/0; the archived 0/1 convention is equivalent.

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

**Cost:** $O(N\log(N+1))$ time, $O(N)$ nodes, $O(\log(N+1))$ stack. Test LL/RR/LR/RL, deep repairs, singleton, sorted/reversed keys and N=20.

For sample 1, inserting 61 causes LL at 88 and inserting 120 causes RR at 88; root remains 70. In sample 2, inserting 90 causes RL at 70 and promotes 88; inserting 65 does not change the root.

## Week 2 discussion（第二周线下补充）

**Root-only tests are weak:** a median guess may pass cases, but AVL root depends on insertion order/rotations. For distinct BST keys, preorder determines shape; also check cached heights/BFs. Small/boundary cases or brute force can earn partial credit without establishing general correctness/complexity.
