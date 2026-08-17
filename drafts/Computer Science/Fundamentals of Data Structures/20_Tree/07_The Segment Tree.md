# 07_The Segment Tree

## 1. Motivation

The Segment Tree is designed to solve problems where we need to perform frequent queries over intervals (ranges) of an array, alongside potential updates to the array elements.

**The Problem:** Given a large array `A[1000000]`, we need to frequently calculate the **sum** of the numbers in an arbitrary range $[L, R]$.

**The Naive Approach:**

```c
ElementType Query(ElementType A[], int L, int R) {
    ElementType sum = 0;
    for (int i = L; i <= R; ++i) {
        sum += A[i];
    }
    return sum;
}
```

- **Time Complexity:** $T(N) = O(N)$.

- **Flaw:** If we have to execute this query thousands or millions of times, $O(N)$ per query is far too slow. We need a data structure that can preprocess the array to answer these queries in logarithmic time.

---

## 2. Structure of a Segment Tree

A Segment Tree is a complete binary tree designed to store intervals or segments.

- **Nodes:**

	- **Leaf Nodes:** Represent individual elements of the original array (e.g., range $[0, 0]$ stores `A[0]`).

    - **Internal Nodes:** Represent the merged result (e.g., sum) of their children. If a node represents the range $[start, end]$, its left child represents $[start, mid]$ and its right child represents $[mid + 1, end]$.

- **Array Representation:** Because it is a complete binary tree, it can be efficiently stored in a flat array (similar to a binary heap).

- **Space Complexity:** $S(N) = O(2N - 1)$. For an array of size $N$, the segment tree will contain at most $2N - 1$ nodes.

```c
/* --- Global Setup and Helper Macros --- */
#define MAX_N 1000000

/**
 * The segment tree array needs to be 4 times the size of the original array
 * to safely guarantee it won't go out of bounds during complete binary tree mapping.
 */
int tree[4 * MAX_N];
int lazy[4 * MAX_N]; // Reserved for advanced range updates (Lazy Propagation)

/* Helper macros for clean tree navigation (Assuming 1-based indexing for the tree) */
#define LEFT_CHILD(node)  (2 * (node))
#define RIGHT_CHILD(node) (2 * (node) + 1)

/* Safe way to calculate mid-point to prevent integer overflow */
#define MID(start, end)   ((start) + ((end) - (start)) / 2)
```

---

## 3. Building the Tree

The tree is built recursively using a divide-and-conquer approach. We split the array into halves until we reach the base cases (single elements), and then compute the parent values on the way back up (merging).

**Algorithm:**

```c
void Build(int node, int start, int end, int A[]) {
    // Base Case: Leaf Node
    if (start == end) {
        tree[node] = A[start];
        return;
    }

    // Recursive Step: Split and Build Children
    int mid = MID(start, end);
    Build(LEFT_CHILD(node), start, mid, A);
    Build(RIGHT_CHILD(node), mid + 1, end, A);

    // Merge Logic: Sum of children (Pull up)
    tree[node] = tree[LEFT_CHILD(node)] + tree[RIGHT_CHILD(node)];
}
```

- **Time Complexity:** $T(N) = O(N)$.

- **Note:** This build process is an initial preprocessing step. It is $O(N)$, but it only needs to be run **once**.

---

## 4. Range Query Operation

To find the sum in an arbitrary range $[L, R]$, we traverse the tree starting from the root. At any given node (representing the range $[start, end]$), there are exactly three possible cases regarding how it overlaps with the query range $[L, R]$:

1. **Case 1: No Overlap.** The node's range is completely outside the query range (`R < start || end < L`). We simply return `0` (or a neutral value that doesn't affect the aggregation).

2. **Case 2: Total Overlap.** The node's range is completely inside the query range (`L <= start && end <= R`). We immediately return the pre-calculated value stored in `tree[node]` without traversing its children. This is where the time savings occur.

3. **Case 3: Partial Overlap.** The node's range partially covers the query range. We must split the query and recursively search both the left and right children, then combine their results.

**Algorithm:**

```c
int Query(int node, int start, int end, int L, int R) {
    // Case 1: No Overlap (Out of bounds)
    if (R < start || end < L) {
        return 0; // Return neutral element for summation
    }

    // Case 2: Total Overlap (Current segment is completely inside query range)
    if (L <= start && end <= R) {
        return tree[node];
    }

    // Case 3: Partial Overlap (We must split the query)
    int mid = MID(start, end);
    int left_sum = Query(LEFT_CHILD(node), start, mid, L, R);
    int right_sum = Query(RIGHT_CHILD(node), mid + 1, end, L, R);

    return left_sum + right_sum;
}
```

- **Time Complexity:** $T(N) = O(\log N)$. Because we stop traversing as soon as a node is completely covered by the query, we visit at most $O(\log N)$ nodes.

---

## 5. Point Update Operation

When a single element in the original array is modified (e.g., `A[idx] = val`), we must update the segment tree to reflect this change.

- **Mechanism:** We traverse down the tree specifically targeting the leaf node that holds `A[idx]`. Once updated, we backtrack up the recursive call stack, recalculating the sum for all ancestor nodes that contain `idx` in their range.

**Algorithm:**

```c
void PointUpdate(int node, int start, int end, int idx, int val) {
    // Base Case: Target leaf node found
    if (start == end) {
        tree[node] = val; // Apply the update
        return;
    }

    // Recursive Step: Traverse left or right based on target index 'idx'
    int mid = MID(start, end);
    if (idx <= mid) {
        PointUpdate(LEFT_CHILD(node), start, mid, idx, val);
    } else {
        PointUpdate(RIGHT_CHILD(node), mid + 1, end, idx, val);
    }

    // Backtracking Step: Recalculate sums on the way back up
    tree[node] = tree[LEFT_CHILD(node)] + tree[RIGHT_CHILD(node)];
}
```

- **Time Complexity:** $T(N) = O(\log N)$. The height of the segment tree is $O(\log N)$, and we only traverse one single path from the root to a leaf and back up.

---

## 6. Generalizations and Advanced Notes `(*)`

The Segment Tree is highly versatile. Its logic extends far beyond just finding range sums.

1. **Applicable to Any Aggregation:** The structure is not limited to `sum`. It can be applied to any **associative aggregation operator** over a range, such as:

    - **Min / Max:** Finding the minimum or maximum value in $[L, R]$.

    - **Average:** Can be derived by maintaining both the sum and the count of elements.

    - **Bitwise Operations:** Range XOR, AND, OR.

2. **Range Updates (Lazy Propagation):** The standard update function provided above is a _point update_ (updating one index). If you need to perform a **Range Update** (e.g., "Add 10 to all numbers from index 2 to 1000"), doing $O(\log N)$ point updates for every element in the range would degrade to $O(N \log N)$.

    - **Solution:** For efficient $O(\log N)$ range updates, an advanced technique called **Lazy Propagation** is used. Instead of updating all children immediately, updates are paused ("lazy") at the highest possible nodes and only pushed down to children when necessary during subsequent queries.

```c
/*
 * Core Logic of Lazy Propagation: "Push Down"
 * Instead of updating all children immediately, we store the pending update in a 'lazy' array.
 * We only push this accumulated update down to the immediate children when we are
 * absolutely forced to visit them during a future query or update.
 */
void PushDown(int node, int start, int end) {
    // If there is a pending update at this node
    if (lazy[node] != 0) {
        int mid = MID(start, end);

        // 1. Apply the pending update to the left child's actual value
        // The value added is: (lazy value) * (number of elements in the left segment)
        tree[LEFT_CHILD(node)] += lazy[node] * (mid - start + 1);
        // Pass the lazy tag down to the left child
        lazy[LEFT_CHILD(node)] += lazy[node];

        // 2. Apply the pending update to the right child's actual value
        tree[RIGHT_CHILD(node)] += lazy[node] * (end - mid);
        // Pass the lazy tag down to the right child
        lazy[RIGHT_CHILD(node)] += lazy[node];

        // 3. Clear the current node's lazy tag since it has been propagated
        lazy[node] = 0;
    }
}

```
