### **1. The Concept & Purpose**
**What is it?**
A Sentinel Node (often called a "Dummy Head") is a node that exists at the very beginning of the linked list but **holds no meaningful data**.
*   **Before (No Sentinel):** `head` $\to$ `[Data 1]` $\to$ `[Data 2]` ...
*   **After (With Sentinel):** `head` $\to$ `[DUMMY]` $\to$ `[Data 1]` $\to$ `[Data 2]` ...

**Why introduce it? (The Logic)**
In the "No Sentinel" version, the first node is "special."
1.  **Insertion:** Inserting at index 0 changes the `head` pointer. Inserting at index 1 changes a `next` pointer.
2.  **Deletion:** Deleting the first node requires changing `head`. Deleting other nodes requires changing `prev->next`.

By adding a Sentinel, **the first actual data node now has a predecessor (the Sentinel).**
*   **Result:** Index 0 is no longer special. Every single data operation becomes "Operation **after** a node." We eliminate all `if (head == NULL)` or `if (index == 0)` edge cases for modification.

---

### **2. Modifications Required**

Here is how your functions change compared to the "No Sentinel" version.

#### **A. Initialization (`createList`)**
*   **Before:** We simply set `head = NULL`.
*   **After:** We must `malloc` the Sentinel node immediately.
```c
// Setup
LinkedList* createList() {
    LinkedList* list = (LinkedList*)malloc(sizeof(LinkedList));
    // Create the Dummy Node
    list->head = (Node*)malloc(sizeof(Node));
    list->head->next = NULL; // The list is empty when Dummy points to NULL
    // list->head->data is ignored/unused
    return list;
}
```

#### **B. Insertion (`pushFront`)**
*   **Logic Change:** We no longer replace `head`. We simply insert **after** the sentinel.
*   **Impact:** No need for double pointers (`Node**`) or returning new heads.
```c
void pushFront(LinkedList* list, int val) {
    Node* newNode = (Node*)malloc(sizeof(Node));
    newNode->data = val;
    
    // Standard "Insert After" logic
    newNode->next = list->head->next; // Point new node to current first data
    list->head->next = newNode;       // Point dummy to new node
}
```

#### **C. Deletion (`deleteAll`) - The Biggest Improvement**
*   **Logic Change:** Remember the "Phase 1: Handle Head" loop from the previous note? **It is completely removed.**
*   **Why:** Even if the first data node (`dummy->next`) needs to be deleted, it is treated exactly like a middle node because we have the pointer *before* it (`dummy`).
*   **Code:** We only need the "Look-Ahead" loop.

```c
void deleteAll(LinkedList* list, int key) {
    // Start 'p' at the Sentinel (Dummy)
    Node* p = list->head;

    // Look ahead at p->next (the potential target)
    while (p->next != NULL) {
        if (p->next->data == key) {
            Node* temp = p->next;
            p->next = temp->next; // Skip the target
            free(temp);
            // Do not advance 'p', check the new neighbor next
        } else {
            p = p->next; // Advance only if no deletion
        }
    }
}
```

#### **D. Traversal / Printing**
*   **Logic Change:** We cannot start printing at `list->head` (because it's garbage data). We must start at `list->head->next`.
