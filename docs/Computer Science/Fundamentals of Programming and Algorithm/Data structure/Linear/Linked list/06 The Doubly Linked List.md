### **1. The Concept & Purpose**
**What is it?**
A list where every node has **two pointers**:
1.  `next`: Points forward.
2.  `prev`: Points backward.

**Why introduce it? (The Logic)**
1.  **Bidirectional Traversal:** You can iterate from Head to Tail OR Tail to Head.
2.  **The "Self-Deletion" Power:** This is the massive advantage. In a Singly list, to delete node `X`, you need a pointer to the node *before* `X`. In a Doubly list, if you hold `X`, you can delete it immediately because `X` knows who is before it (`X->prev`).
    *   **Complexity:** Deletion becomes **$O(1)$** (assuming you already have the pointer to the target).

### **2. Modifications Required**

#### **A. Struct Definition**
```c
typedef struct DNode {
    int data;
    struct DNode* prev; // New Pointer
    struct DNode* next;
} DNode;
```

#### **B. Insertion (The "Four-Step Dance")**
*   **Change:** When inserting a node `New` between `A` and `B`, you must update **four** pointers, not two. Order is critical to avoid losing connections.
```c
// Insert 'newNode' after 'A'
void insertAfter(DNode* A, DNode* newNode) {
    DNode* B = A->next; // B is the node originally after A
    
    // 1. Link NewNode to neighbors
    newNode->prev = A;
    newNode->next = B;
    
    // 2. Link neighbors to NewNode
    A->next = newNode;
    if (B != NULL) { // Check required unless using Double Sentinels
        B->prev = newNode; 
    }
}
```

#### **C. Deletion (`deleteNode`)**
*   **Change:** We no longer need the "Look-Ahead" (`p->next`) strategy. We can look directly at the target.
```c
// Delete node 'p' directly
void deleteNode(DNode* p) {
    DNode* before = p->prev;
    DNode* after = p->next;
    
    // Bypass 'p'
    if (before != NULL) before->next = after;
    if (after != NULL)  after->prev = before;
    
    free(p);
}
```

### **3. Unique Precautions (Gotchas)**

1.  **Memory Overhead:** Each node requires extra memory (4 or 8 bytes) for the `prev` pointer. On embedded systems, this adds up.
2.  **Maintenance Complexity:**
    *   In a Singly list, forgetting to update a pointer might break the list.
    *   In a Doubly list, forgetting to update a `prev` pointer might create a **subtle bug** where traversing forward works fine, but traversing backward crashes or goes to the wrong place.
3.  **The "Double Sentinel" Recommendation:**
    *   To avoid checking `if (B != NULL)` or `if (before != NULL)` constantly, Doubly Linked Lists are best implemented with **Two Sentinels**: a `HeadDummy` and a `TailDummy`. This ensures every data node always has a valid `prev` and `next`.