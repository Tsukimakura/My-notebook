### **1. What is a Linked List?**
A **Linked List** is a linear data structure used to store a collection of elements. Unlike arrays, linked list elements are **not** stored in contiguous memory locations. Instead, each element points to the next one using a memory address (pointer).

This structure allows the list to grow and shrink dynamicall during program execution.

### **2. Structure of a Node**
The building block of a linked list is called a **Node**. A node typically consists of two parts:
*   **Data:** The value or information stored in the node (e.g., an integer, a character).
*   **Pointer (Next):** A reference that holds the address of the next node in the sequence.

> **Visual Model:** `[ Data | Next ] ---> [ Data | Next ] ---> NULL`

---

### **3. Types of Linked Lists**

There are several forms of linked lists, designed for different needs:

#### **A. Singly Linked List**
*   **Concept:** The simplest form. Each node points only to the **next** node.
*   **Direction:** You can only traverse it in one direction (forward).
*   **End:** The last node points to `NULL`.

#### **B. Doubly Linked List**
*   **Concept:** Each node has **two pointers**: one pointing to the **next** node and one pointing to the **previous** node.
*   **Direction:** You can traverse it both forward and backward.
*   **Advantage:** Easier to delete nodes (because you have access to the previous node) but requires more memory for the extra pointer.

#### **C. Circular Linked List**
*   **Concept:** There is no `NULL` at the end. The last node points back to the **first node** (head).
*   **Variation:** It can be singly circular or doubly circular.
*   **Use Case:** Useful for applications that need to cycle through data repeatedly (e.g., task scheduling in an OS).

#### **D. Linked List with Sentinel (Dummy Node)**
*   **Concept:** A special "empty" node is added at the beginning (and sometimes the end) of the list.
*   **Purpose:** It simplifies operations like insertion and deletion by ensuring that every data node always has a previous node. It removes the need to write special code for handling the "head" of the list.

---

### **4. Advantages and Disadvantages**

| **Feature** | **Linked List** | **Array** |
| :--- | :--- | :--- |
| **Memory** | **Dynamic Size:** Can grow or shrink at runtime. | **Fixed Size:** Must be defined in advance. |
| **Insertion/Deletion** | **Efficient:** Just update pointers ($O(1)$). | **Slow:** Requires shifting elements ($O(N)$). |
| **Access** | **Sequential:** Must read from the start ($O(N)$). | **Random Access:** Can jump to index `i` ($O(1)$). |
| **Space** | Uses extra memory for pointers. | Memory efficient (data only). |

### **5. Summary**
A linked list is a flexible chain of nodes. While it is slower than an array for accessing specific elements, it is much more efficient for situations where data needs to be frequently inserted or deleted. Understanding linked lists is the foundation for learning complex structures like Trees and Graphs.