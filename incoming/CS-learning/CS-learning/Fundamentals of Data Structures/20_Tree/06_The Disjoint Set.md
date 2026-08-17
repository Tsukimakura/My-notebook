## 1. Equivalence Relations

- **Relation Definition:** A relation $R$ is defined on a set $S$ if, for every pair of elements $(a, b)$ where $a, b \in S$, $a\ R\ b$ evaluates to either true or false. If $a\ R\ b$ is true, we say that $a$ is related to $b$.
    
- **Equivalence Relation:** A relation (denoted by $\sim$) over a set $S$ is considered an equivalence relation if and only if it satisfies three properties:
    
    1. **Reflexive:** $a \sim a$ for all $a \in S$.
        
    2. **Symmetric:** $a \sim b$ implies $b \sim a$.
        
    3. **Transitive:** $a \sim b$ and $b \sim c$ implies $a \sim c$.
        
- **Equivalence Class:** Two members $x$ and $y$ of a set $S$ are in the same equivalence class if and only if $x \sim y$.
    

## 2. The Dynamic Equivalence Problem

**The Problem:** Given an equivalence relation $\sim$, decide for any arbitrary elements $a$ and $b$ whether $a \sim b$. This is considered "Dynamic" (or on-line) because the relations are read and processed sequentially, and equivalence queries must be answered on the fly.

**Mathematical Model:**

- **Elements:** $1, 2, 3, ..., N$
    
- **Sets:** $S_1, S_2, ...$ where the sets are mutually disjoint ($S_i \cap S_j = \emptyset$ if $i \neq j$).
    

**Core Operations:**

1. **Union(i, j):** Replaces sets $S_i$ and $S_j$ with their union $S = S_i \cup S_j$.
    
2. **Find(i):** Finds the set $S_k$ that contains the element $i$. (Returns the "root" or "identifier" of the set).
    

**Algorithm (Union/Find) General Structure:**

``` c
/* Step 1: Read the relations */
Initialize N disjoint sets;
while (read in a ~ b) {
    if (Find(a) != Find(b)) {
        Union the two sets;
    }
}

/* Step 2: Decide if a ~ b */
while (read in a and b) {
    if (Find(a) == Find(b)) 
        output(true);
    else 
        output(false);
}
```

### Tree / Forest Representation

The standard way to represent disjoint sets is using a forest of trees.

- **Key Distinction:** Unlike standard trees, the pointers in a disjoint set tree point from **children to parents**.
    
- The root of a tree acts as the "name" or identifier of the set.
    

## 3. Basic Data Structure

### Array Implementation

```c
#define MAX_SIZE 1000

/* Define types for clarity and semantic meaning */
typedef int ElementType;
typedef int SetName;

/**
 * The disjoint set forest is represented by an array.
 * S[X] represents the parent of element X.
 * If S[X] <= 0, then X is a root, and the absolute value 
 * of S[X] represents either the size or the height of the tree.
 * Note: 1-based indexing is typically used.
 */
typedef ElementType DisjSet[MAX_SIZE + 1];

/* Initialize the disjoint set */
void Initialize(DisjSet S) {
    for (int i = 1; i <= MAX_SIZE; i++) {
        /* Initialize all elements as roots with size/height of 1 */
        S[i] = -1; 
    }
}
```

Instead of explicitly allocating tree nodes with pointers, the most efficient implementation utilizes a simple array.

- **Structure:** Let array `S` represent the forest. `S[element] = parent_of_element`.
    
- **Roots:** If an element is a root, `S[root]` is typically set to `0` (or a negative number, which will be useful later). The set's name is the root's index.
    

**Example Implementation (Basic):**

```c
/**
 * Basic Union: Make the tree of Root2 a subtree of Root1.
 * Warning: This basic approach does not balance the trees.
 * Assumes Root1 and Root2 are distinct roots.
 */
void SetUnion(DisjSet S, SetName Root1, SetName Root2) {
    S[Root2] = Root1; 
}

/**
 * Basic Find: Traverse up parent pointers to find the root.
 * Returns the SetName (root index) of the given element.
 */
SetName Find(ElementType X, DisjSet S) {
    while (S[X] > 0) {
        X = S[X]; // Move up to the parent
    }
    return X;
}
```

### Analysis and Worst-Case Scenario

Practically, `Union` and `Find` are always paired. Thus, we analyze the performance of an _intermixed sequence_ of operations.

**The Worst-Case Flaw:** If we perform simple unions blindly (e.g., always making the second tree a child of the first), we can easily create a degenerate, heavily unbalanced tree (a linked list).

- _Example Sequence:_ `Union(2,1), Find(1)`, `Union(3,2), Find(1)` ... `Union(N, N-1), Find(1)`.
    
- _Consequence:_ The tree becomes a single chain. A `Find` operation will take $O(N)$ time. For $N$ unions and $M$ finds, the worst-case time complexity degrades to $\Theta(M \times N)$ or $\Theta(N^2)$ if $M \approx N$.
    

## 4. Smart Union Algorithms

To prevent worst-case chain formations, we must optimize the `Union` operation by keeping the trees shallow.

### 4.1 Union-by-Size

```c
/**
 * Union-by-Size: Always attach the smaller tree to the larger tree.
 * S[Root] contains the negative of the tree's size.
 */
void UnionBySize(DisjSet S, SetName Root1, SetName Root2) {
    // Note: S[Root] is negative, so a smaller value means a larger size
    if (S[Root2] < S[Root1]) { 
        // Root2 is larger (more negative). Make Root2 the new root.
        S[Root2] += S[Root1]; // Update the size of the new root
        S[Root1] = Root2;     // Attach Root1 to Root2
    } else { 
        // Root1 is larger or equal. Make Root1 the new root.
        S[Root1] += S[Root2]; // Update the size of the new root
        S[Root2] = Root1;     // Attach Root2 to Root1
    }
}
```

- **Strategy:** Always make the smaller tree a subtree of the larger tree.
    
- **Implementation Trick:** Initialize the array values of roots to `-1`. When performing a union, update the root's value to the negative of the tree's size (`S[Root] = -size`).
    
- **Lemma:** Let $T$ be a tree created by union-by-size with $N$ nodes. The maximum height of the tree is bounded: $height(T) \le \lfloor \log_2 N \rfloor + 1$.
    
    - _Proof intuition:_ The depth of a node increases only when its tree is joined to a larger tree. When this happens, the size of the resulting tree at least doubles. An element's tree can double in size at most $\log_2 N$ times.
        
- **Time Complexity:** For $N$ Union and $M$ Find operations, the time complexity drops significantly to $O(N + M \log_2 N)$.
    

### 4.2 Union-by-Height (Union-by-Rank)

```c
/**
 * Union-by-Height (Rank): Always attach the shallower tree to the deeper tree.
 * S[Root] contains the negative of the tree's height.
 */
void UnionByHeight(DisjSet S, SetName Root1, SetName Root2) {
    // Note: S[Root] is negative, so a smaller value means a deeper tree
    if (S[Root2] < S[Root1]) { 
        // Root2 is deeper. Attach shallower Root1 to Root2.
        // Height of Root2 does not change.
        S[Root1] = Root2; 
    } else { 
        // Root1 is deeper or they are equal height.
        if (S[Root1] == S[Root2]) {
            // If heights are equal, the new tree's height increases by 1
            S[Root1]--; 
        }
        S[Root2] = Root1; // Attach Root2 to Root1
    }
}
```

- **Strategy:** Always make the shallower tree a subtree of the deeper tree.
    
- **Mechanism:** Maintain the height of the tree at the root (stored as a negative number). The height only increases when two trees of the _same_ height are united.
    

## 5. Path Compression

While smart unions optimize the trees from the top down, **Path Compression** optimizes from the bottom up during the `Find` operation.

- **Concept:** When `Find(X)` is called, the algorithm traverses the path from $X$ up to the root. Path compression takes every node on that path and updates its parent pointer to point _directly_ to the root.
    
- **Trade-off:** It makes a single `Find` slightly slower due to the extra overhead, but drastically accelerates subsequent sequence of `Find` operations by flattening the tree.
    

```c
/**
 * Find with Path Compression (Recursive version).
 * Elegant and concise, but uses O(log N) stack space in worst case.
 */
SetName FindRecursive(ElementType X, DisjSet S) {
    if (S[X] <= 0) {
        return X; // Base case: X is the root
    }
    // Compress the path while returning from the recursion
    return S[X] = FindRecursive(S[X], S); 
}

/**
 * Find with Path Compression (Iterative version).
 * Avoids call stack overhead. Requires two passes.
 */
SetName FindIterative(ElementType X, DisjSet S) {
    ElementType Root = X;
    ElementType Trail, Lead;

    // Pass 1: Find the root
    while (S[Root] > 0) {
        Root = S[Root];
    }

    // Pass 2: Collapse the path
    Trail = X;
    while (Trail != Root) {
        Lead = S[Trail];  // Temporarily store the parent
        S[Trail] = Root;  // Point current node directly to the root
        Trail = Lead;     // Move up the tree
    }

    return Root;
}
```

_Note on Compatibility:_ Path compression is perfectly compatible with Union-by-Size. However, it is fundamentally incompatible with strict Union-by-Height because path compression alters the heights of the trees without a feasible way to update the exact height at the root. Thus, when combined, we treat the height as an _estimated_ height, known as **Rank**.

## 6. Worst Case for Union-by-Rank and Path Compression

When combining Union-by-Rank and Path Compression, the disjoint set forest reaches optimal, near-constant amortized time bounds.

- **Tarjan's Lemma:** Let $T(M, N)$ be the maximum time required to process an intermixed sequence of $M \ge N$ finds and $N-1$ unions. Then the bounds are defined by:
    
    $$k_1 M \alpha(M, N) \le T(M, N) \le k_2 M \alpha(M, N)$$
    
    for some positive constants $k_1$ and $k_2$.
    

**Understanding the Bounds:**

- $\alpha(M, N)$ is related to the inverse of **Ackermann's Function** $A(i, j)$.
    
- Ackermann's function grows explosively fast (e.g., $A(2,4) = 2^{65536}$).
    
- Consequently, the inverse Ackermann function, $\alpha(M, N)$, grows unimaginably slowly.
    
- For all practical computational purposes across the known universe, $\alpha \le 4$. We can practically approximate the upper bound by $\log^* N$ (the iterated logarithm, which represents the number of times the logarithm is applied to $N$ until the result is $\le 1$).
    
- **Conclusion:** The amortized time complexity is effectively $O(1)$ per operation.