### **1. The Concept & Purpose**
**What is it?**
A `tail` pointer is a variable that **always** holds the memory address of the **last node** in the list.

**Why introduce it? (The Logic)**
*   **The Problem:** In a standard Singly Linked List, inserting at the end (`pushBack`) requires iterating through the entire list to find the end. This is **$O(N)$** (slow for long lists).
*   **The Solution:** By remembering where the end is, `pushBack` becomes **$O(1)$** (instant).

**Data Structure Update:**
We typically add this to our wrapper struct. (Assuming we are using the Sentinel model from Note 1).
```c
typedef struct LinkedList {
    Node* head; // Points to Sentinel
    Node* tail; // Points to the Last Node (Sentinel if empty)
} LinkedList;
```

---

### **2. Modifications Required**

Introducing a `tail` pointer is high-maintenance. You gain speed, but you must keep `tail` accurate during every change.

#### **A. Initialization**
*   **Logic:** When the list is empty, the Sentinel is *also* the last node.
```c
LinkedList* createList() {
    LinkedList* list = (LinkedList*)malloc(sizeof(LinkedList));
    list->head = (Node*)malloc(sizeof(Node));
    list->head->next = NULL;
    
    // CRITICAL: Tail points to Sentinel initially
    list->tail = list->head; 
    return list;
}
```

#### **B. Insertion at Back (`pushBack`) - The Optimization**
*   **Logic:** No loop needed! Use `tail` directly.
```c
void pushBack(LinkedList* list, int val) {
    Node* newNode = (Node*)malloc(sizeof(Node));
    newNode->data = val;
    newNode->next = NULL;

    // 1. Link current tail to new node
    list->tail->next = newNode;
    
    // 2. Update tail pointer to the new end
    list->tail = newNode;
}
```

#### **C. Insertion at Front (`pushFront`) - The Edge Case**
*   **Logic:** Usually, `pushFront` doesn't care about the tail. **However**, if the list was **empty**, the new node becomes *both* the first data node AND the last node.

	```c
void pushFront(LinkedList* list, int val) {
    Node* newNode = (Node*)malloc(sizeof(Node));
    newNode->data = val;
    
    newNode->next = list->head->next;
    list->head->next = newNode;

    // MAINTENANCE: If list was empty, new node is also the tail
    if (list->tail == list->head) {
        list->tail = newNode;
    }
}
	```

#### **D. Deletion (`deleteAll`) - The Risk**
This is where `tail` pointers are annoying. If you delete the node that `tail` is pointing to, `tail` becomes a **Dangling Pointer**. You must update it to point to the *new* last node.

```c
void deleteAll(LinkedList* list, int key) {
    Node* p = list->head;
    
    while (p->next != NULL) {
        if (p->next->data == key) {
            Node* temp = p->next;
            p->next = temp->next; 
            
            // MAINTENANCE: Did we just delete the tail?
            if (temp == list->tail) {
                list->tail = p; // The current 'p' becomes the new tail
            }
            
            free(temp);
            // Do not advance p
        } else {
            p = p->next;
        }
    }
    // Note: If p advances to the end, list->tail is already correct.
}
```
