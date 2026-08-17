> A **Priority Queue** is a specialized data structure designed to efficiently locate and remove the element with the highest (or lowest) priority, rather than following a strict First-In-First-Out (FIFO) or Last-In-First-Out (LIFO) order.

## 1. ADT

- **Objects:** A finite, ordered list of zero or more elements, where each element has a "priority" or "key" associated with it.
    
- **Core Operations:**
    
    - `Initialize(int MaxElements)`: Creates an empty priority queue.
        
    - `Insert(ElementType X, PriorityQueue H)`: Inserts a new element $X$ into the priority queue.
        
    - `DeleteMin(PriorityQueue H)`: Finds, removes, and returns the element with the minimum key (highest priority).
        
    - `FindMin(PriorityQueue H)`: Returns the element with the minimum key without removing it.
        

---

## 2. Simple Implementations & Trade-offs

Before utilizing a heap, we can evaluate how standard data structures perform for Priority Queue operations.

|**Data Structure**|**Insertion Complexity**|**Deletion (Min) Complexity**|**Rationale**|
|---|---|---|---|
|**Unordered Array**|$\Theta(1)$|$\Theta(N)$|Insert at the end is instant. Finding the minimum requires scanning the entire array, plus shifting elements to fill the gap.|
|**Unordered Linked List**|$\Theta(1)$|$\Theta(N)$|Insert at the front is instant. Finding the minimum requires traversing the list.|
|**Ordered Array**|$O(N)$|$\Theta(1)$|Insertion requires finding the correct position and shifting elements. Deletion simply removes the last/first element.|
|**Ordered Linked List**|$O(N)$|$\Theta(1)$|Insertion requires traversing to find the right sorted position. Deletion removes the head/tail node.|

### The "Balanced Tree" Dilemma

A balanced Binary Search Tree (like an **AVL Tree**) guarantees $O(\log N)$ for both insertion and deletion. However, it is **overkill** for a Priority Queue:

1. We only ever need to access the _minimum_ or _maximum_ element, not any arbitrary element. Maintaining total order is unnecessary overhead.
    
2. Trees require pointers, which consume extra memory and are slower to access due to poor cache locality (pointer chasing).
    

**The Solution:** A **Binary Heap**, which gives us $O(\log N)$ performance without the overhead of pointers.

---

## 3. The Binary Heap

A Binary Heap is the standard implementation of a Priority Queue. To qualify as a Binary Heap, a tree must satisfy two distinct properties: the **Structure Property** and the **Heap Order Property**.

### 3.1 Structure Property

A binary heap is a **Complete Binary Tree**.

- **Definition:** A binary tree of height $h$ is complete if it is perfectly filled down to height $h-1$, and at height $h$, all leaves are filled from left to right without any gaps.
    
- **Mathematical Bounds:** A complete binary tree of height $h$ has between $2^h$ and $2^{h+1} - 1$ nodes. Therefore, the height $h = \lfloor \log_2 N \rfloor$.
    

Because the tree is complete, it is completely predictable. We do not need pointers to represent it; we can simply use a **1-D Array**.

**Array Mapping Rules (1-based indexing):**

If a node is located at array index $i$ ($1 \le i \le N$):

1. **Parent:** `Parent(i)` = $\lfloor i/2 \rfloor$ (Returns `None` if $i=1$)
    
2. **Left Child:** `Left_Child(i)` = $2i$ (Returns `None` if $2i > N$)
    
3. **Right Child:** `Right_Child(i)` = $2i + 1$ (Returns `None` if $2i + 1 > N$)
    

_Note: Index 0 is intentionally left empty to make the math simpler and to store a "sentinel" value._

### 3.2 Heap Order Property

The order property ensures fast access to the minimum element.

- **Min Heap:** The key value in every node is less than or equal to ($\le$) the key values in its children. The absolute minimum element is always at the root.
    
- **Max Heap:** The key value in every node is greater than or equal to ($\ge$) the key values in its children. The absolute maximum element is always at the root.
    

### 3.3 Basic Operations

#### A. Initialization (The Sentinel Trick)

When initializing the heap array `H->Elements`, we set `H->Elements[0]` to a **Sentinel value** (e.g., `-Infinity` for a min-heap).

- **Logical Purpose:** This creates a definitive lower bound. During insertion, it prevents the need for an explicit boundary check (`while i > 1`) in the `while` loop, making the loop run faster.
    

```c
#include <stdlib.h>
#include <stdio.h>

/* Assuming ElementType is defined elsewhere in the program */
typedef int ElementType; 

#define MIN_PQ_SIZE 10
#define MIN_DATA_SENTINEL -32767 /* A value smaller than any valid ElementType */

/* Type definitions for the Priority Queue */
typedef struct HeapStruct {
    int capacity;
    int size;
    ElementType *elements;
} *PriorityQueue;

/**
 * Initializes an empty priority queue (min-heap).
 * Allocates memory for the heap structure and the internal array.
 */
PriorityQueue Initialize(int max_elements) {
	// Validate that the requested capacity meets the minimum requirement.
    if (max_elements < MIN_PQ_SIZE) {
        fprintf(stderr, "Error: Priority queue capacity must be at least %d.\n", MIN_PQ_SIZE);
        return NULL;
    }

    PriorityQueue h = (PriorityQueue)malloc(sizeof(struct HeapStruct));

    /* Allocate array of size max_elements + 1 (index 0 is reserved for the sentinel) */
    h->elements = (ElementType *)malloc((max_elements + 1) * sizeof(ElementType));
    h->capacity = max_elements;
    h->size = 0;
    
    /**
     * Initialize the Sentinel: 
     * The value at index 0 must be smaller than any possible element inserted.
     * This prevents the need for bounds checking during the "percolate up" process.
     */
    h->elements[0] = MIN_DATA_SENTINEL; 

    return h;
}
```

- `MIN_PQ_SIZE` is not necessary, but for a small amount of data, the binaray heap is also not necessary...

#### B. Insertion: "Percolate Up"

**Time Complexity:** $O(\log N)$

1. Create a "hole" at the next available position in the complete binary tree (the end of the array) to maintain the Structure Property.
    
2. Compare the new item $X$ with the hole's parent.
    
3. If $X$ is smaller, push the parent down into the hole (moving the hole up to the parent's position).
    
4. Repeat until $X$ is greater than the parent of the hole, then insert $X$ into the hole.
    
	_Note: This shifting is faster than swap because swapping requires 3 assignments per level, whereas percolating only requires 1 assignment per level._
    

```c
/**
 * Inserts a new element into the priority queue.
 * Maintains the heap order property by performing a "Percolate Up" operation.
 * Time Complexity: O(log N)
 */
void Insert(ElementType x, PriorityQueue h) {
    if (h == NULL) return;

    if (h->size == h->capacity) {
        fprintf(stderr, "Error: Priority queue is full. Cannot insert.\n");
        return;
    }

    /* Create a "hole" at the next available position to maintain the complete tree structure */
    int current_pos = ++h->size;

    /**
     * Percolate Up:
     * Compare the new element (x) with the parent of the hole (current_pos / 2).
     * If x is smaller, move the parent down into the hole.
     * The sentinel at h->elements[0] guarantees this loop will stop at the root.
     */
    while (x < h->elements[current_pos / 2]) {
        h->elements[current_pos] = h->elements[current_pos / 2];
        current_pos /= 2; /* Move the hole up to the parent's position */
    }

    /* Place the new element into the final, correct position of the hole */
    h->elements[current_pos] = x;
}
```

#### C. DeleteMin: "Percolate Down"

**Time Complexity:** $O(\log N)$

1. Remove the root node (this is the minimum element). This leaves a "hole" at the root.
    
2. Take the _last_ element in the heap array (to maintain the Structure Property) and temporarily hold it.
    
3. Compare the hole's children. Find the **smaller child**.
    
4. If the smaller child is less than the last element, push the child up into the hole (moving the hole down).
    
5. Repeat until the hole is at a level where it is smaller than both children, then place the last element into the hole.
    

```c
/**
 * Removes and returns the minimum element (the root) from the priority queue.
 * Maintains the heap order property by performing a "Percolate Down" operation.
 * Time Complexity: O(log N)
 */
ElementType DeleteMin(PriorityQueue h) {
    if (h == NULL || h->size == 0) {
        fprintf(stderr, "Error: Priority queue is empty.\n");
        return h->elements[0]; /* Return sentinel as an error indicator */
    }

    /* The minimum element is always at the root (index 1 in a 1-based array) */
    ElementType min_element = h->elements[1];
    
    /* Save the last element in the heap, then shrink the logical size of the heap */
    ElementType last_element = h->elements[h->size--];

    int current_pos, child_pos;

    /**
     * Percolate Down:
     * Start with a hole at the root and push it down the tree until 
     * last_element can be safely inserted without violating heap order.
     */
    for (current_pos = 1; current_pos * 2 <= h->size; current_pos = child_pos) {
        child_pos = current_pos * 2; /* Calculate the index of the left child */

        /**
         * If there is a right child (child_pos != h->size), 
         * check if the right child is smaller than the left child. 
         * We always want to compare against the smaller of the two children.
         */
        if (child_pos != h->size && h->elements[child_pos + 1] < h->elements[child_pos]) {
            child_pos++; /* Point to the right child instead */
        }

        /**
         * If the last element is greater than the smaller child, 
         * move the smaller child up to fill the current hole.
         */
        if (last_element > h->elements[child_pos]) {
            h->elements[current_pos] = h->elements[child_pos];
        } else {
            /* The hole is now in a position where last_element is smaller than both children */
            break; 
        }
    }

    /* Place the last element into the final hole position */
    h->elements[current_pos] = last_element;

    return min_element;
}
```

---

## 4. Advanced Heap Operations

Finding an arbitrary key in a heap requires a linear scan $O(N)$ because the heap only guarantees vertical ordering (parent vs. child), not horizontal ordering. However, if we know a node's index $P$, we can do the following:

- **`DecreaseKey(P, Δ, H)`:** Decreases the value of node $P$ by $\Delta$. This destroys the heap order, so we must **Percolate Up**. _Use case: An OS temporarily boosting the priority of a starving process._
    
- **`IncreaseKey(P, Δ, H)`:** Increases the value of node $P$ by $\Delta$. We must **Percolate Down**. _Use case: Dropping the priority of a process consuming too much CPU._
    
- **`Delete(P, H)`:** Removes node $P$ entirely. Achieved by executing `DecreaseKey(P, ∞, H)` to force it to the root, followed by `DeleteMin(H)`. _Use case: A user abnormally terminating a process._
    

### BuildHeap (Linear Time Construction)

Convert an arbitrary array of $N$ items into a heap.

- **Naive approach:** Do $N$ sequential `Insert` operations. This takes $O(N \log N)$ time.
    
- **Optimal approach:** Place all elements into the array randomly. Then, starting from the last parent node (at index $\lfloor N/2 \rfloor$) and working backwards to the root (index 1), run `PercolateDown` on each node.
    
- **Complexity:** $O(N)$.
    
- **Proof Intuition:** The cost of a `PercolateDown` is proportional to the node's height. Most nodes in a tree are at the bottom (leaves have height 0). The sum of the heights of all nodes in a perfect binary tree is exactly $2^{h+1} - 1 - (h+1)$, which simplifies mathematically to $O(N)$.
    

---

## 5. Applications: The Top-K Problem

**Problem:** Given a list of $N$ elements and an integer $k$, find the $k$-th largest element.

1. **Sorting Method:** Sort the entire array descending, return the $k$-th item.
    
    - Complexity: $O(N \log N)$. Slow for large $N$.
        
2. **Max-Heap Method:** Call `BuildHeap` to create a max-heap from all $N$ elements. Then call `DeleteMax` $k$ times.
    
    - Complexity: $O(N)$ for build + $O(k \log N)$ for deletions = $O(N + k \log N)$.
        
3. **Min-Heap (Window) Method:** Build a min-heap of the first $k$ elements. For the remaining $N-k$ elements, compare each to the root. If it's larger, `DeleteMin` and `Insert` the new element. At the end, the root is the $k$-th largest.
    
    - Complexity: $O(k + (N-k) \log k) \approx O(N \log k)$. Excellent when $k$ is small and $N$ is massive.
        

---

## 6. $d$-Heaps

A $d$-Heap generalizes the Binary Heap. Instead of 2 children, every node has $d$ children.

**Characteristics & Complexities:**

- **Tree Depth:** Becomes shallower. Height is $O(\log_d N)$.
    
- **Insertion:** Still requires Percolate Up. Because the tree is shallower, it takes fewer steps: $O(\log_d N)$.
    
- **DeleteMin:** Requires finding the minimum of $d$ children to percolate down. This takes $d-1$ comparisons per level. Total time: $O(d \log_d N)$.
    

**Trade-offs & Use Cases:**

- In standard binary heaps, finding a child ($2i$, $2i+1$) is a fast **bit shift**. In $d$-heaps, multiplication/division by $d$ requires actual ALU operations, which are slightly slower.
    
- **Primary Use Case:** When a priority queue is too massive to fit entirely in main memory (RAM). A $d$-heap aligns with disk blocks (similar to the concept of B-Trees), drastically reducing disk I/O operations because the tree depth—and thus the number of disk accesses—is minimized.