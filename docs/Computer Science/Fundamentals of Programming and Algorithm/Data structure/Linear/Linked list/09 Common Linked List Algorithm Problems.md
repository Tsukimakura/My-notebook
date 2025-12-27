In algorithmic interviews (like LeetCode), Linked List problems usually test two things: **Pointer Manipulation** and **Edge Case Handling**.

Here are the four classic patterns you must master.

---

### **1. Reverse a Linked List (The Foundation)**
**Goal:** Turn `1 -> 2 -> 3 -> NULL` into `3 -> 2 -> 1 -> NULL`.

**The Algorithm: "Three-Pointer Sliding"**
You cannot reverse a link without losing the rest of the list, so you need three pointers:
1.  **`curr`**: The node you are currently flipping.
2.  **`prev`**: The node before `curr` (where `curr->next` should point to).
3.  **`next`**: The node after `curr` (saved so we don't lose the rest of the list).

**Logic Steps:**
1.  Save `next = curr->next`.
2.  Reverse the arrow: `curr->next = prev`.
3.  Shift `prev` to `curr`.
4.  Shift `curr` to `next`.
5.  Repeat until `curr` is NULL. Return `prev` (the new head).

---

### **2. Detect a Cycle (Floyd’s "Tortoise and Hare")**
**Goal:** Determine if a linked list has a loop (i.e., the last node points back to a previous node instead of `NULL`).

**The Algorithm: Fast & Slow Pointers**
Imagine two runners on a track.
*   **Slow Pointer (`tortoise`)**: Moves 1 step at a time (`p = p->next`).
*   **Fast Pointer (`hare`)**: Moves 2 steps at a time (`p = p->next->next`).

**Logic:**
*   If there is **no loop**, the Fast pointer will reach `NULL` (the finish line).
*   If there **is a loop**, the Fast pointer will eventually "lap" (catch up to) the Slow pointer inside the loop.
*   **Condition:** `if (fast == slow) return true;`

---

### **3. Merge Two Sorted Lists**
**Goal:** Combine `1 -> 3 -> 5` and `2 -> 4 -> 6` into `1 -> 2 -> 3 -> 4 -> 5 -> 6`.

**The Algorithm: The "Zipper" Method**
We iterate through both lists simultaneously and pick the smaller node to add to our result.

**Crucial Trick: The Dummy Head**
Since we don't know which list has the starting node (1 or 2?), we create a local `Dummy` node on the stack. We build the result list after `Dummy`.
1.  Compare `L1->val` and `L2->val`.
2.  Attach the smaller one to `tail->next`.
3.  Move the pointer of the chosen list forward.
4.  **End:** If one list runs out, attach the *entire* remainder of the other list to the end (no need to iterate further).

---

### **4. Reverse Nodes in k-Group (Advanced)**
**Goal:** Reverse the list in groups of size $k$.
*   Input: `1->2->3->4->5`, $k=2$
*   Output: `2->1->4->3->5` (Note: 5 is left alone because there are fewer than $k$ nodes left).

**The Algorithm: "Check, Cut, Reverse, Connect"**
This problem combines traversal and reversal. We usually use a **Dummy Head** to handle the first group uniformly.

**Step-by-Step Logic:**
1.  **Check:** Starting from a pointer `groupPrev`, move forward $k$ steps to see if there are enough nodes.
    *   If you hit `NULL` before $k$ steps, stop (leave the rest as is).
2.  **Identify Boundaries:**
    *   `groupStart`: The first node of the group (will become the tail after reversal).
    *   `groupEnd`: The $k$-th node (will become the head after reversal).
    *   `nextGroup`: The node after `groupEnd`.
3.  **Cut & Reverse:**
    *   Temporarily break the link to `nextGroup` (optional, but helps visualization).
    *   Run the **Standard Reverse Algorithm** (from Problem 1) on the segment from `groupStart` to `groupEnd`.
4.  **Connect:**
    *   Link `groupPrev->next` to the new head (`groupEnd`).
    *   Link `groupStart->next` to `nextGroup`.
5.  **Advance:**
    *   `groupPrev` moves to `groupStart` (which is now at the end of the reversed segment).
    *   Repeat.

---

### **5. Find Middle Node (or N-th from End)**
**Goal:** Find the center of the list in one pass.

**The Algorithm: Fast & Slow Pointers (Again)**
*   **Middle:** `Fast` moves 2 steps, `Slow` moves 1 step. When `Fast` hits the end, `Slow` is exactly in the middle.
*   **N-th from End:**
    1.  Move `Fast` forward by $N$ steps first.
    2.  Then move both `Fast` and `Slow` at speed 1.
    3.  When `Fast` hits the end, `Slow` is at the N-th node from the end.

---

### **Summary of "Pro" Techniques**

| Technique | Used For... |
| :--- | :--- |
| **Dummy Head** | Merging lists, Deleting/Reversing where the Head might change. |
| **Two Pointers (Fast/Slow)** | Detecting cycles, Finding the middle, Finding K-th from end. |
| **Three Pointers (Prev/Curr/Next)** | Reversing links without losing data. |