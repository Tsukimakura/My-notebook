Working with pointers can be dangerous. A single mistake can cause your program to crash (Segmentation Fault) or hang forever (Infinite Loop). Here is how to write safe code and fix bugs when they happen.

---

### **1. The "Big Three" Common Errors**

#### **A. Segmentation Fault (SegFault)**
*   **Symptom:** The program crashes immediately.
*   **Cause:** You tried to access memory that doesn't belong to you.
*   **Most Common Scenario:** Dereferencing a `NULL` pointer.
    *   *Bad Code:* `if (p->next->data == 5)`
    *   *Why it crashes:* If `p` is `NULL`, `p->next` is illegal. If `p->next` is `NULL`, accessing `data` is illegal.

#### **B. The Broken Chain (Losing Data)**
*   **Symptom:** The list prints correctly up to a certain point, then stops, or the rest of the list disappears.
*   **Cause:** You overwrote a pointer *before* saving the address of the next node.
*   **Rule:** "Connect the new node **before** you disconnect the old one."

#### **C. Infinite Loop**
*   **Symptom:** The program freezes and doesn't print output, or prints the same numbers forever.
*   **Cause:**
    1.  The loop condition is wrong (e.g., `while(p)` in a circular list).
    2.  You forgot to advance the pointer (`p = p->next`) inside the loop.

---

### **2. Prevention Techniques (Coding Phase)**

#### **Tip 1: Draw It First!**
Never write linked list code directly into the editor.
*   **Action:** Draw boxes (nodes) and arrows (pointers) on paper.
*   **Verify:** Trace your code logic with your finger on the drawing. Did you break an arrow before creating a new one?

#### **Tip 2: The "Guard Clause"**
Before accessing `p->next` or `p->data`, always ask: **"Is p NULL?"**
*   *Unsafe:* `while (p->next->data != 5)`
*   *Safe:* `while (p != NULL && p->next != NULL && p->next->data != 5)`
    *   *Note:* The order matters! In C, if the first condition is false, the second is not checked (Short-circuit evaluation).

#### **Tip 3: Handle Edge Cases Explicitly**
Test your logic mentally against these three scenarios:
1.  **Empty List:** Does your function crash if `head == NULL`?
2.  **Single Node:** Does it work if the list has only 1 item?
3.  **Tail Operation:** Does it work if you are deleting/inserting the very last node?

---

### **3. Debugging Techniques (Testing Phase)**

#### **Technique 1: Visual Debugging (Printing)**
Don't just print the data; print the **Address** (`%p`) and the **Next Address**.
```c
printf("Node Address: %p | Data: %d | Next: %p\n", p, p->data, p->next);
```
*   **Why?** This reveals if `next` is `NULL` when it shouldn't be, or if your list has a cycle (Node A points to B, B points to A).

#### **Technique 2: The "Rubber Duck" Method**
Read your code line-by-line out loud. Explain what happens to the pointers.
*   *Example:* "Okay, here I set `temp` to `head`. Then I move `head` forward. Then I free `temp`. Wait... if `head` was NULL, this line crashes."

#### **Technique 3: Memory Tools (Valgrind)**
If your program runs but behaves strangely (or you lose points for Memory Leaks), use a tool like **Valgrind** (on Linux/Mac).
*   **Command:** `valgrind ./my_program`
*   It will tell you exactly which line allocated memory that was never freed.

---

### **4. Summary Checklist**

Before you run your code, check these 4 items:

1.  [ ] **Order:** Did I link the new node (`newNode->next = ...`) *before* breaking the existing link?
2.  [ ] **NULL Check:** Did I check if `head` or `current` is `NULL` before using `->`?
3.  [ ] **Advance:** Did I write `p = p->next` inside my `while` loop?
4.  [ ] **Free:** Did I `free()` the memory for every node I removed?