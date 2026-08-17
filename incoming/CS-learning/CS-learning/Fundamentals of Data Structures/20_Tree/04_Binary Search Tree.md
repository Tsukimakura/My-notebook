## 1. The Binary Search Tree (BST) ADT

### 1.1 Definition

A Binary Search Tree is a specialized binary tree designed for efficient searching, insertion, and deletion. It can be empty. If it is not empty, it strictly satisfies the following properties:

1. **Distinct Keys:** Every node has a key (often an integer), and all keys in the tree are distinct.
    
2. **Left Subtree Property:** The keys in a nonempty _left_ subtree must be strictly **smaller** than the key in the root of that subtree.
    
3. **Right Subtree Property:** The keys in a nonempty _right_ subtree must be strictly **larger** than the key in the root of that subtree.
    
4. **Recursive Nature:** The left and right subtrees must themselves be valid binary search trees.
    

### 1.2 ADT Operations

The BST operates conceptually as a finite ordered list. Its core operations include:

- `MakeEmpty(T)`: Initializes or clears the tree.
    
- `Find(X, T)`: Locates the node containing key $X$.
    
- `FindMin(T)` / `FindMax(T)`: Locates the minimum or maximum key in the tree.
    
- `Insert(X, T)`: Adds a new key $X$ to the tree while maintaining BST properties.
    
- `Delete(X, T)`: Removes key $X$ from the tree while maintaining BST properties.
    
- `Retrieve(P)`: Returns the element stored at a specific node position.
    

---

## 2. Implementations of BST Operations

All primary BST operations take time proportional to the depth of the tree, denoted as $O(d)$. In the worst case, this is $O(N)$ for a skewed tree, but $O(\log N)$ on average for a balanced tree.

We assume `ElementType` is defined appropriately (e.g., `typedef int ElementType;`).

```c
struct TreeNode;
typedef struct TreeNode *Position;
typedef struct TreeNode *SearchTree;

struct TreeNode {
    ElementType Element;
    SearchTree  Left;
    SearchTree  Right;
};
```

### 2.1 Searching (`Find`, `FindMin`, `FindMax`)

- **Find:** To find a value $X$, compare it to the root. If $X$ is smaller, recursively search the left subtree. If $X$ is larger, recursively search the right subtree. If it matches, return the node.
    
    - _Implementation Note:_ The recursive `Find` utilizes **tail recursion**. Because the recursive call is the very last operation evaluated in the function, it can be easily converted into an iterative `while` loop (`Iter_Find`) to save call stack space and improve performance.
        
- **FindMin:** Always traverse to the `Left` child until reach a node whose left pointer is `NULL`. This is the smallest element.
    
- **FindMax:** Always traverse to the `Right` child until reach a node whose right pointer is `NULL`. This is the largest element. (Often implemented iteratively for efficiency).
    


```c
/* Recursive Find */
Position Find(ElementType X, SearchTree T) {
    if (T == NULL) {
        return NULL; /* Not found in an empty tree */
    }
    if (X < T->Element) {
        return Find(X, T->Left);  /* Search left subtree */
    } else if (X > T->Element) {
        return Find(X, T->Right); /* Search right subtree */
    } else {
        return T; /* Found */
    }
}

/* Iterative Find (Optimized for tail recursion) */
Position Iter_Find(ElementType X, SearchTree T) {
    while (T != NULL) {
        if (X == T->Element) return T; /* Found */
        if (X < T->Element) 
            T = T->Left;  /* Move down along left path */
        else 
            T = T->Right; /* Move down along right path */
    }
    return NULL; /* Not found */
}

/* Find the minimum element (Recursive) */
Position FindMin(SearchTree T) {
    if (T == NULL) return NULL;
    else if (T->Left == NULL) return T; /* Found leftmost */
    else return FindMin(T->Left);       /* Keep moving to left */
}

/* Find the maximum element (Iterative) */
Position FindMax(SearchTree T) {
    if (T != NULL) {
        while (T->Right != NULL) {
            T = T->Right; /* Keep moving to find rightmost */
        }
    }
    return T;
}
```

### 2.2 Insertion (`Insert`)

To insert a new element $X$, traverse the tree as if you were searching for $X$.

1. The last node we encounter before falling off the tree (reaching a `NULL` pointer) becomes the parent of the new node.
    
2. If $X$ is less than the parent, it becomes the left child; if greater, the right child.
    
3. **Handling Duplicates:** If $X$ is already in the tree, standard implementations either do nothing (ignoring the duplicate) or update a counter/frequency field within the existing node.
    


```c
SearchTree Insert(ElementType X, SearchTree T) {
    if (T == NULL) {
        /* Create and return a one-node tree */
        T = malloc(sizeof(struct TreeNode));
		T->Element = X;
		T->Left = T->Right = NULL;
    } else if (X < T->Element) {
        T->Left = Insert(X, T->Left);
    } else if (X > T->Element) {
        T->Right = Insert(X, T->Right);
    }
    /* Else X is in the tree already; we'll do nothing */
    return T;
}
```

### 2.3 Deletion (`Delete`)

Deletion is the most complex operation because it must preserve the BST structure. It is broken down into three cases:

1. **Deleting a Leaf Node (Degree 0):** Simply reset its parent's link to `NULL` and free the memory.
    
2. **Deleting a Node with One Child (Degree 1):** Bypass the node by resetting its parent's link to point directly to the node's single child, then free the node.
    
3. **Deleting a Node with Two Children (Degree 2):** 
	
	- Find a replacement node. This must be either the **largest node in its left subtree** (inorder predecessor) OR the **smallest node in its right subtree** (inorder successor).
	    
    - Copy the key of the replacement node into the node you originally wanted to delete.
        
    - Recursively call `Delete` to remove the replacement node from its original position (which is now guaranteed to be an easier case: a leaf or a degree-1 node).
        

```c
SearchTree Delete(ElementType X, SearchTree T) {
    Position TmpCell;

    if (T == NULL) {
        Error("Element not found");
    } else if (X < T->Element) { /* Go left */
        T->Left = Delete(X, T->Left);
    } else if (X > T->Element) { /* Go right */
        T->Right = Delete(X, T->Right);
    } else { /* Found element to be deleted */
        
        if (T->Left && T->Right) { /* Case 3: Two children */
            /* Replace with smallest in right subtree */
            TmpCell = FindMin(T->Right);
            T->Element = TmpCell->Element;
            T->Right = Delete(T->Element, T->Right);
        } else { /* Case 1 & 2: One or zero children */
            TmpCell = T;
            if (T->Left == NULL) { /* Also handles 0 children */
                T = T->Right;
            } else if (T->Right == NULL) {
                T = T->Left;
            }
            free(TmpCell);
        }
    }
    return T;
}
```

---

## 3. Advanced Considerations and Analysis

### 3.1 Lazy Deletion

If a tree experiences a high volume of insertions and deletions, constantly freeing and reallocating memory can be computationally expensive.

- **The Strategy:** Instead of physically removing a node, add a boolean `isDeleted` flag to the node structure. To "delete" a node, simply set this flag to true.
    
- **Advantages:** Faster deletion operation; if a deleted key is re-inserted, no new memory allocation (`malloc`) is required—just flip the flag back.
    
- **Disadvantages (The Efficiency Question):** If the number of deleted nodes becomes equal to the number of active nodes, the tree's depth remains large. Because the time complexity of operations is tied to the height $h$, $O(h)$ operations will take longer than they would in a tightly packed tree.
    

### 3.2 Average-Case Analysis & Insertion Order

The height $h$ of a BST is completely dependent on the order in which elements are inserted.

- **Best/Average Case:** If elements are inserted in a random order (e.g., $4, 2, 1, 3, 6, 5, 7$), the tree tends to remain relatively balanced. For $N$ elements, the height is approximately $O(\log N)$.
    
- **Worst Case:** If elements are inserted in a pre-sorted (or reverse-sorted) order (e.g., $1, 2, 3, 4, 5, 6, 7$), the tree degrades into a Skewed Binary Tree. The height becomes $O(N)$, and the tree loses its efficiency advantages, behaving essentially like a linked list.

### 3.3 Balanced Binary Search Trees `(*)`

**What is a Balanced Tree:**

A balanced tree is a variation of a binary search tree that automatically alters its structure during insertions and deletions to ensure its height remains strictly bounded at $O(\log N)$. It prevents the tree from becoming excessively skewed by enforcing specific rules regarding the height difference between the left and right subtrees of any given node.

**Methods to Obtain/Maintain a Balanced Tree:**

To maintain balance, these data structures typically rely on a mathematical operation called a **Tree Rotation** (single or double rotations) during insertion or deletion. Common implementations include:

- **AVL Trees:** The first balanced BST invented. It enforces a strict mathematical rule: for every node, the height of its left and right subtrees can differ by at most 1. It provides highly optimized search times due to strict balancing but requires more rotations during insertion/deletion.
    
- **Red-Black Trees:** A slightly relaxed balanced tree where nodes are "colored" red or black, and specific structural rules regarding color sequencing ensure that the longest path from root to leaf is no more than twice as long as the shortest path. This reduces the overhead of rotations, making it highly efficient for frequent insertions and deletions (widely used in C++ STL `std::map` and Java's `TreeMap`).
    
- **Splay Trees:** A self-adjusting BST that does not strictly guarantee $O(\log N)$ worst-case height, but guarantees that any sequence of $M$ operations takes $O(M \log N)$ time. It uses a "splaying" operation to rotate recently accessed elements to the root, optimizing for data sets with temporal locality (recently accessed items are likely to be accessed again).
    
- **B-Trees:** While not strictly _binary_ trees, B-Trees are generalized balanced search trees that allow nodes to have multiple children (more than two). They are optimized for systems that read and write large blocks of data, such as disk drives and databases.