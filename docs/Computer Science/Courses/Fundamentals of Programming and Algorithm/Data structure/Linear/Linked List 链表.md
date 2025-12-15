## 1. Concept & Definition

A **Linked List** is a linear data structure where elements are not stored at contiguous memory locations. Instead, the elements are linked using pointers.

- **Node:** The fundamental building block. Each node contains:
    
    1. **Data:** The value stored.
        
    2. **Pointer (Next):** The address of the next node in the sequence.
        
- **Head:** A pointer to the first node in the list.
    
- **Terminator:** The last node’s pointer is set to NULL to indicate the end of the list.
    
- **Memory:** Unlike arrays, linked lists can grow and shrink dynamically at runtime, utilizing memory wherever it is available (Heap memory).
    

### Key Terminology

- **Singly Linked List:** Nodes allow traversal in one direction (forward).
    
- **Doubly Linked List:** Nodes contain two pointers (prev and next), allowing traversal in both directions.
    
- **Circular Linked List:** The last node points back to the head instead of NULL.
    

---

## 2. Core Operations

1. **insertAtHead(x)**: Add an element to the beginning (fastest operation).
    
2. **insertAtTail(x)**: Add an element to the end (requires traversal unless a tail pointer is maintained).
    
3. **delete(value)**: Find a node containing value and remove it by updating pointers.
    
4. **search(x)**: Iterate through the list to find if x exists.
    
5. **traverse()**: Visit every node to print or process data.
    

---

## 3. Implementation in C Language

Below is an implementation of a **Singly Linked List**.

- **Logic:** We use a struct Node.
    
- **Pointers:** Functions receive Node** head_ref (pointer to the head pointer) so they can modify the actual head of the list in the main function.
    

codeC

```
#include <stdio.h>
#include <stdlib.h>

// Definition of a Node
typedef struct Node {
    int data;
    struct Node* next;
} Node;

// Function to create a new node
Node* createNode(int value) {
    Node* newNode = (Node*)malloc(sizeof(Node));
    if (!newNode) {
        printf("Memory allocation error\n");
        exit(1);
    }
    newNode->data = value;
    newNode->next = NULL;
    return newNode;
}

// 1. Insert at the beginning (Head) - O(1)
void insertAtHead(Node** head_ref, int value) {
    Node* newNode = createNode(value);
    newNode->next = *head_ref; // Point new node to current head
    *head_ref = newNode;       // Update head to be the new node
    printf("Inserted %d at head\n", value);
}

// 2. Insert at the end (Tail) - O(n)
void insertAtTail(Node** head_ref, int value) {
    Node* newNode = createNode(value);
    
    // If list is empty, new node becomes head
    if (*head_ref == NULL) {
        *head_ref = newNode;
        printf("Inserted %d at tail (First element)\n", value);
        return;
    }

    // Traverse to the last node
    Node* temp = *head_ref;
    while (temp->next != NULL) {
        temp = temp->next;
    }
    temp->next = newNode; // Link last node to new node
    printf("Inserted %d at tail\n", value);
}

// 3. Delete a node by value - O(n)
void deleteNode(Node** head_ref, int key) {
    Node* temp = *head_ref;
    Node* prev = NULL;

    // Case 1: Head holds the key
    if (temp != NULL && temp->data == key) {
        *head_ref = temp->next; // Changed head
        free(temp);             // Free memory
        printf("Deleted %d from head\n", key);
        return;
    }

    // Case 2: Search for the key to be deleted
    while (temp != NULL && temp->data != key) {
        prev = temp;
        temp = temp->next;
    }

    // If key was not present in linked list
    if (temp == NULL) {
        printf("Element %d not found\n", key);
        return;
    }

    // Unlink the node from linked list
    prev->next = temp->next;
    free(temp);
    printf("Deleted %d\n", key);
}

// 4. Traversal (Print List) - O(n)
void printList(Node* node) {
    printf("List: ");
    while (node != NULL) {
        printf("%d -> ", node->data);
        node = node->next;
    }
    printf("NULL\n");
}

// Main function to test
int main() {
    Node* head = NULL; // Start with empty list

    insertAtTail(&head, 10);
    insertAtTail(&head, 20);
    insertAtHead(&head, 5);  // List: 5 -> 10 -> 20
    
    printList(head);

    deleteNode(&head, 10);   // List: 5 -> 20
    printList(head);

    deleteNode(&head, 5);    // List: 20
    printList(head);

    return 0;
}
```

---

## 4. Common Use Cases

Linked Lists are preferred when the number of elements is not known in advance or varies drastically.

1. **Dynamic Memory Allocation:** Used by operating systems to track free memory blocks.
    
2. **Implementation of Other Data Structures:**
    
    - **Stacks:** push is insertAtHead, pop is deleteFromHead.
        
    - **Queues:** enqueue is insertAtTail, dequeue is deleteFromHead.
        
    - **Graphs:** Adjacency Lists (array of linked lists) to represent graph connections.
        
    - **Hash Tables:** Handling collisions using chaining (array of linked lists).
        
3. **Undo Functionality:** In applications like Photoshop (usually doubly linked lists).
    
4. **Music Playlist:** Playing the next or previous song.
    

---

## 5. Important Analysis

### Time Complexity (Big O)

|   |   |   |   |
|---|---|---|---|
|Operation|Array|Linked List (Singly)|Note|
|**Access (Index)**|```<br>O(1)O(1)<br>```|```<br>O(n)O(n)<br>```|Must traverse from head to find the <br><br>```<br>kk<br>```<br><br>-th element.|
|**Insert (Head)**|```<br>O(n)O(n)<br>```|```<br>O(1)O(1)<br>```|Arrays require shifting; Lists just update pointers.|
|**Insert (Tail)**|```<br>O(1)O(1)<br>```<br><br>*|```<br>O(n)O(n)<br>```<br><br>**|*If array not full. **<br><br>```<br>O(1)O(1)<br>```<br><br> if tail pointer is kept.|
|**Delete (Head)**|```<br>O(n)O(n)<br>```|```<br>O(1)O(1)<br>```|Arrays require shifting left.|
|**Search**|```<br>O(n)O(n)<br>```|```<br>O(n)O(n)<br>```|Linear search for both (unless array is sorted).|

### Space Complexity

- **`O(n)O(n)`**
    
    : However, Linked Lists use **more memory per element** than arrays because they must store the data plus the pointer (extra 4 or 8 bytes per node).
    

### Array vs. Linked List

- **Arrays:** Best for "Read-Heavy" workloads where random access (index-based) is frequent. Fixed size (static) or expensive resizing (dynamic).
    
- **Linked Lists:** Best for "Write-Heavy" workloads where insertions/deletions at the beginning or middle are frequent. Dynamic size.
    

---

## 6. Summary

- **Linked Lists** utilize non-contiguous memory, connected via pointers.
    
- They solve the fixed-size limitation of arrays.
    
- **Pros:** Dynamic size, efficient insertion/deletion (
    
    ```
    O(1)O(1)
    ```
    
    ) if the position is known (e.g., at Head).
    
- **Cons:** No random access (cannot do list[5]), extra memory overhead for pointers, cache unfriendliness (due to scattered memory).
    
- The **Head Pointer** is crucial; if you lose it, you lose the entire list (Memory Leak).