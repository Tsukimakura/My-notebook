## **1. Core Concept & Data Structure**

In a "No Sentinel" (or No Dummy Node) implementation, the `head` pointer points directly to the **first actual data node**.
*   **Empty List:** `head == NULL`.
*   **Non-Empty List:** `head` holds the address of the first node.

### **Struct Definition**
```c
typedef struct Node {
    int data;               // The payload
    struct Node* next;      // Pointer to the next node
} Node;
```

---

## **2. Key Pointer Variables: The "Cast of Characters"**

When writing linked list functions, understanding these variable roles is crucial.

### **A. `head` (The Anchor)**
*   **Role:** Represents the entry point of the list.
*   **Critical Detail:** Since there is no dummy node, if the list is empty, `head` is `NULL`. If we insert or delete at the very beginning, **the value of the `head` variable itself must change**.

### **B. `current` (or `p`, `curr`)**
*   **Role:** The "Explorer." Used to traverse (iterate) through the list.
*   **Movement:** `current = current->next;`
*   **Stop Condition:** Usually `current == NULL` (end of list).

### **C. `prev` (The Shadow)**
*   **Role:** The "Follower." Used primarily in **deletion**.
*   **Why we need it:** In a singly linked list, you cannot look back. If `current` is at the node you want to delete, you need `prev` to connect the previous node to `current->next`.

### **D. `newNode`**
*   **Role:** A pointer to a newly allocated memory block (`malloc`) waiting to be linked into the chain.

---

## **3. The "Head Modification" Problem**

In C, function arguments are passed by **value**. If you write `void add(Node* head, int val)`, the function gets a *copy* of the pointer. Changing `head` inside the function does not change the `head` in `main()`.

To solve this, we use **Double Pointers**:
*   **Type:** `Node** headRef`
*   **Meaning:** A pointer to the head pointer.
*   **Usage:** `*headRef` gives us access to the actual `head` variable in the main function.

---

## **4. Operation Logic & Implementation Principles**

### **A. Insertion at Front (Push)**
*Logic:* The new node becomes the new head.
1.  Allocate memory for `newNode`.
2.  Point `newNode->next` to the *current* head (`*headRef`).
3.  Update the actual head (`*headRef`) to point to `newNode`.

```c
void pushFront(Node** headRef, int data) {
    Node* newNode = (Node*)malloc(sizeof(Node));
    newNode->data = data;
    newNode->next = *headRef; 
    *headRef = newNode;       
}
```

### **B. Insertion at Tail (Append)**
*Logic:* If empty, make it the head. If not, find the last node.
1.  **Corner Case:** If `*headRef` is `NULL`, set `*headRef = newNode`.
2.  **General Case:** Loop with `current` until `current->next == NULL`.
3.  Link `current->next = newNode`.

```c
void pushBack(Node** headRef, int data) {
    Node* newNode = (Node*)malloc(sizeof(Node));
    newNode->data = data;
    newNode->next = NULL;

    if (*headRef == NULL) {
        *headRef = newNode;
        return;
    }

    Node* current = *headRef;
    while (current->next != NULL) {
        current = current->next;
    }
    current->next = newNode;
}
```

### **C. Deletion (Delete ALL Occurrences)** 

*Logic:* We must scan the entire list. Since the target value might appear multiple times (even consecutively), the logic is split into two parts: handling the head, and handling the rest.

**Part 1: Handle the Head(s)**
The value to delete might be at the very start, potentially multiple times (e.g., `10 -> 10 -> 20...` delete `10`).
*   **Logic:** Use a `while` loop. As long as the head exists and equals the key, move head forward and free the old node.

**Part 2: Handle the Body**
Now `head` is safe (either NULL or not the key). We use `prev` and `curr`.
*   **If `curr` matches key:**
    1.  Link `prev->next` to `curr->next` (bypass `curr`).
    2.  Free `curr`.
    3.  **Crucial:** Do **not** move `prev` forward. Only update `curr` to `prev->next`. (The new neighbor might *also* need to be deleted).
*   **If `curr` does NOT match:**
    1.  Move `prev` to `curr`.
    2.  Move `curr` to `curr->next`.
	

	```c
	void deleteAll(Node** headRef, int key) {
    // 1. Handle the head node(s)
    // We use a loop because there might be consecutive keys at the start.
    while (*headRef != NULL && (*headRef)->data == key) {
        Node* temp = *headRef;
        *headRef = (*headRef)->next; // Move head forward
        free(temp);
    }

    // If list became empty after deleting heads, return.
    if (*headRef == NULL) return;

    // 2. Handle the rest of the list
    Node* prev = *headRef;
    Node* curr = prev->next;

    while (curr != NULL) {
        if (curr->data == key) {
            // Match found: Remove it
            Node* temp = curr;
            prev->next = curr->next; // Bypass curr
            curr = prev->next;       // Update curr to the next node
            free(temp);
            // NOTICE: We do NOT move 'prev' here.
        } else {
            // No match: Move both pointers forward
            prev = curr;
            curr = curr->next;
        }
    }
}
	```


---

## **5. Evolution of Implementation: From `Node**` to `List`**

Handling `Node**` (pointer to a pointer) can be confusing and syntactically ugly (`(*head)->next`). We can optimize readability by defining a List type.

### **Phase 1: The Raw Method (Double Pointers)**
*   **Signature:** `void insert(Node** head, int val);`
*   **Pros:** Efficient, standard C.
*   **Cons:** Hard to read. easy to forget `*` when dereferencing.

### **Phase 2: The Wrapper Struct (Abstract Data Type)**
We create a struct that *contains* the head pointer.

```c
// The Optimization
typedef struct LinkedList {
    Node* head;
    // We can also add 'tail' or 'size' here easily!
} LinkedList;

// Initialization
LinkedList* createList() {
    LinkedList* list = (LinkedList*)malloc(sizeof(LinkedList));
    list->head = NULL;
    return list;
}
```

### **Why is this better?**
Now, when we pass `LinkedList* list` to a function, we are passing a pointer to the *container*. The `list->head` inside it can be modified easily without double indirection syntax.

**Comparison of Insertion:**

*   **Old Way (`Node**`):**
    ```c
    void insert(Node** headRef, int val) {
        // ...
        if (*headRef == NULL) *headRef = newNode; 
    }
    // Call: insert(&head, 5);
    ```

*   **Optimized Way (`LinkedList*`):**
    ```c
    void insert(LinkedList* list, int val) {
        Node* newNode = createNode(val);
        if (list->head == NULL) {
            list->head = newNode; // Much cleaner! No * needed
        } else {
            // traverse using list->head...
        }
    }
    // Call: insert(myList, 5);
    ```

## **6. Summary Checklist**

1.  **Empty Check:** Always check `if (head == NULL)` first.
2.  **Head Change:** If your operation might affect the first node (insert front, delete front, delete from single-node list), you **must** update the head pointer variable.
3.  **Memory:** Every `malloc` requires a corresponding `free`. When deleting a node, re-link the pointers *before* freeing the memory.
4.  **Traversal:** Do not use `head` to traverse (e.g., `head = head->next` inside a loop) or you will lose the start of your list. Always use a temporary pointer `current`.