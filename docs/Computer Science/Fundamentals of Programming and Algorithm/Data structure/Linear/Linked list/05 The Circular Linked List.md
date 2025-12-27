### **1. The Concept & Purpose**
**What is it?**
A list where the last node does **not** point to `NULL`. Instead, it points back to the **Head** (or the Sentinel).
*   **Visual:** `[Sentinel] -> [A] -> [B] -> [C] --(points back)--> [Sentinel]`

**Why introduce it? (The Logic)**
1.  **Continuous Looping:** Useful for applications that need to cycle through data repeatedly without resetting (e.g., Round-Robin process scheduling in Operating Systems, media players on "Repeat" mode).
2.  **Accessibility:** From *any* node in the list, you can reach *any other* node just by keeping moving forward. You never hit a dead end (`NULL`).

---

### **2. Modifications Required**
We assume a **Singly Linked List with a Sentinel** as the base.

#### **A. Initialization (`createList`)**
*   **Change:** The Sentinel must point to **itself**, not `NULL`.
*   **Why:** An empty circular list is just a Sentinel pointing to the Sentinel.
```c
LinkedList* createList() {
    LinkedList* list = (LinkedList*)malloc(sizeof(LinkedList));
    list->head = (Node*)malloc(sizeof(Node));
    
    // THE CHANGE: Point back to self
    list->head->next = list->head; 
    return list;
}
```

#### **B. Insertion at Back (`pushBack`)**
*   **Change:** The new tail must point to the Sentinel, not `NULL`.
```c
void pushBack(LinkedList* list, int val) {
    Node* newNode = (Node*)malloc(sizeof(Node));
    newNode->data = val;
    
    // 1. New node points back to Head (Sentinel)
    newNode->next = list->head; 
    
    // 2. Old tail points to New Node
    // (Assuming we have a 'tail' pointer for O(1) access)
    list->tail->next = newNode;
    list->tail = newNode;
}
```

#### **C. Traversal / Printing (The Critical Change)**
*   **Change:** You cannot use `while (p != NULL)`. That loop will run forever (Infinite Loop).
*   **New Logic:** You must stop when the pointer wraps around to the start.
```c
void printList(LinkedList* list) {
    Node* p = list->head->next; // Start at first data node
    
    // Stop if we hit the Sentinel again
    while (p != list->head) {
        printf("%d -> ", p->data);
        p = p->next;
    }
    printf("(back to start)\n");
}
```

### **3. Unique Precautions (Gotchas)**
1.  **The Infinite Loop Trap:** This is the #1 bug. If you write `while(p)` or `while(p->next)`, your program will freeze. Always check `if (p == head)`.
2.  **Josephus Problem:** When deleting nodes in a circle, be very careful not to delete the Sentinel if your logic assumes data nodes only.