# 1. Abstract Data Type (ADT)

- **Standard Data Type:** A data type is formally defined as a mathematical set of objects combined with a set of allowable operations.

    - **Formula:** $\text{Data Type} = \{ \text{Objects} \} \cup \{ \text{Operations} \}$.

    - **Example:** The standard `int` type consists of objects $\{ 0, \pm 1, \pm 2, \dots, \text{INT\_MAX}, \text{INT\_MIN} \}$ and supports operations like $\{ +, -, \times, \div, \%, \dots \}$.

- **Abstract Data Type (ADT):** An ADT is a structural design principle where the **specification** of the objects and their operations is strictly separated from their internal **representation and implementation**. Essentially, it defines _what_ the data structure does, without detailing _how_ the underlying code actually achieves it.

---

## 2. The List ADT

## 2.1 ADT

**Objects:** $(item_0, item_1, \dots, item_{N-1})$

**Operations:**

- Finding the length

- Printing all items

- Making an empty list

- Finding the k-th item from the list

- Inserting a new item after the k-th item of a list

- Deleting an item from a list

- Finding next of the current item from a list

- Finding previous of the current item from a list

## 2.2 Implementations

### 2.2.1 Array

### 2.2.2 Linked List

#### Two Applications

##### Application 1: The Polynomial ADT

**1. Definition and Operations**

- **Objects:** A polynomial can be defined mathematically as $P(x) = a_1 x^{e_1} + \dots + a_n x^{e_n}$. It is fundamentally a set of ordered pairs $<e_i, a_i>$, where $a_i$ represents the **coefficient** and $e_i$ represents the **exponent**. Exponents ($e_i$) are non-negative integers.

- **Operations:** The standard operations defined for this ADT include:

    - Finding the degree of the polynomial (which is $\max\{e_i\}$).

    - Addition, Subtraction, and Multiplication between two polynomials.

    - Differentiation of a polynomial.

**2. Representation 1: Array Implementation**

- **Implementation:** We can use an array where the _index_ represents the exponent, and the _value_ stored at that index represents the coefficient: `int CoeffArray[MaxDegree + 1];`.

- **The Drawback:** Consider $P(x) = 10x^{1000} + 5x^{14} + 1$.

    - To store $P$, we need an array of size 1001. However, only 3 elements have non-zero coefficients. The other 998 elements are zeroes, resulting in a massive waste of memory. This is known as a **sparse polynomial**.

**3. Representation 2: Linked List Implementation**

- **Implementation:** To solve the memory waste, we represent each non-zero term as a node in a Linked List.

- **Structure:** Each node contains:

    - `int Coefficient` (Assuming integer coefficients).

    - `int Exponent`.

    - `poly_ptr Next` (A pointer to the next term).

- **Sorting Rule:** The nodes are strictly sorted by their exponent in descending order ($e_{m-1} > e_{m-2} > \dots > e_0 \ge 0$).

- **Advantage:** Memory is dynamically allocated _only_ for terms that actually exist, completely eliminating the "wasted space" issue of the array representation.

- A structure array can do the same thing.

##### Application 2: Multilists (Sparse Matrices)

**1. The Problem Context**

- **Scenario:** A university has 40,000 students and 2,500 courses.

- **Task:** We need an efficient data structure to support two queries: printing the name list of all students registered for a specific course, and printing the list of registered courses for a specific student.

**2. Representation 1: 2D Array**

- **Implementation:** A standard boolean/integer 2D array: `int Array[40000][2500];`.

- **Logic:** `Array[i][j] = 1` if student $i$ is registered for course $j$, and `0` otherwise.

- **The Drawback (Missing Logic Filled):** Creating a **Sparse Matrix** (like the sparse polynomial mentioned above), making the 2D array approach highly impractical.

**3. Representation 2: Multilists**

- **Implementation:** We use a cross-linked structure where nodes are shared between multiple lists simultaneously.

- **Structure Visualization:**

	- We maintain an array of head nodes for the Students ($S1, S2, \dots$) and an array of head nodes for the Courses ($C1, C2, \dots$).

    - When a student registers for a course, a single node is created at the intersection of that student's column and the course's row.

    - **Dual Pointers:** This node contains _two_ `Next` pointers. One pointer links to the next student in the same course (moving horizontally), and the other links to the next course taken by the same student (moving vertically).

#### Advanced Implementations and Applications

##### Cursor Implementation of Linked Lists (No Pointers)

**1. The Concept**

- If a language does not support pointers, we can simulate a linked list's memory space using a globally allocated array of structures.

- **Structure:** Each element in this array (named `CursorSpace`) contains two fields:

    1. `Element`: The actual data being stored.

    2. `Next`: An integer index that acts as a "pointer" to the next structure in the array. A value of `0` typically represents a `NULL` pointer.

**2. Simulating System Memory (The Freelist)**

To manage this array, we must simulate the Operating System's `malloc` and `free` functions. We do this by maintaining a **freelist**—a linked list of all currently unused slots in the array.

- Index `0` of `CursorSpace` is typically reserved as the header for this freelist.

**3. Simulating `malloc`**

When a new node is needed, we remove the first available slot from the freelist.

- **Logic:**

    ```c
    p = CursorSpace[0].Next; // p gets the index of the first free node
    CursorSpace[0].Next = CursorSpace[p].Next; // The freelist header bypasses p, pointing to the next free node
    ```

**4. Simulating `free` (Deallocation)**

When a node `p` is deleted from our active list, we must recycle it by inserting it at the front of the freelist.

- **Logic:**

    ```c
    CursorSpace[p].Next = CursorSpace[0].Next; // Node p points to the current first free node
    CursorSpace[0].Next = p; // The freelist header now points to p, making it the new first free node
    ```

**5. The Major Advantage**

- The interface for using a cursor implementation is mathematically identical to a pointer implementation.

- **Performance:** It is usually significantly faster. Standard `malloc` and `free` calls require expensive system-level context switches. By managing a pre-allocated array manually, we avoid OS memory management overhead completely.

##### Real-World Application: OS Free Memory Management

**1. The OS Memory Management Task**

- The OS is responsible for managing free memory blocks, processing application allocation requests (`malloc`), and recycling memory (`free`).

- **Core Data Structure:** The OS organizes free memory blocks into a **Doubly Linked List**.

**2. Memory Block Anatomy (Boundary Tag Method)**

To manage memory efficiently, the OS wraps user data in "metadata" tags at the boundaries (top and bottom) of the memory block.

- **(a) Structure of a Free Block:**

    - **Header (Top):** Contains a `tag` (indicating it is free), the `size` of the block, an `l_link` (pointer to the previous free block), and an `r_link` (pointer to the next free block).

    - **Footer (Bottom):** Contains a duplicate `size` and `tag`. _(Implicit logic: Having tags at the bottom allows the OS to easily check the status of the physically preceding block in RAM without traversing from the beginning)._

- **(b) Structure of an Allocated Block:**

    - Once a block is given to a user, it is removed from the free list. Therefore, the `l_link` and `r_link` pointers are no longer needed and are overwritten by user data to save space.

    - It only retains the `tag` (indicating it is allocated) and `size` in the header, and the `tag` in the footer.

**3. OS Allocation and Recycling Mechanisms**

- **Allocation Strategies:** When an application requests memory, the OS searches the doubly linked list of free blocks. Common strategies include:

    - **First Fit:** The OS traverses the list and allocates the very first block that is large enough.

    - **Best Fit:** The OS searches the entire list to find the smallest possible block that satisfies the request, minimizing wasted leftover space.

- **Block Recycling & Coalescing:** When memory is freed, the OS returns the block to the doubly linked list. Critically, it uses the boundary tags to check if the physically adjacent memory blocks are also free. If they are, it **coalesces** (merges) them into a single larger free block to prevent severe memory fragmentation.

**Storage of Header and Footer Structures** `(*)`

**1. Core Concept: In-band Management**

- The Header and Footer structures are stored directly in physical memory (RAM), immediately adjacent to the data requested by the user. This approach is known as **In-band management**.

**2. How Allocation (`malloc`) Works**

When a program requests memory (e.g., `int* p = (int*)malloc(100);` to allocate 100 bytes), the OS handles it as follows:

- **Oversizing:** The OS actually allocates a block slightly larger than requested (e.g., 116 bytes) to accommodate the metadata.

- **Memory Layout:**

    - **Top bytes (e.g., 8 bytes):** Stores the **Header** structure.

    - **Middle bytes (e.g., 100 bytes):** The actual **Payload** where user data is stored.

    - **Bottom bytes (e.g., 8 bytes):** Stores the **Footer** structure.

- **Pointer Return:** `malloc` returns the pointer `p` pointing strictly to the _beginning of the payload_ (the 100 bytes), not the beginning of the entire 116-byte block. This means your data is perfectly sandwiched between the Header and the Footer.

**3. How Deallocation (`free`) Works**

- When `free(p)` is called, the OS takes the payload pointer `p` and moves backward (towards lower memory addresses) by a few bytes to precisely locate the Header.

- It reads the `size` attribute from this Header to determine exactly how much memory to reclaim, and then successfully returns the entire block back to the doubly linked list of free blocks.

---

## 3. The Stack ADT

## 3.1 ADT

**Objects:** A finite ordered list with zero or more elements.

**Operations:**

- `Int IsEmpty( Stack S )`

- `Stack CreateStack( )`

- `DisposeStack( Stack S )`

- `MakeEmpty( Stack S )`

- `Push( ElementType X, Stack S )`

- `ElementType Top( Stack S )`

- `Pop( Stack S )`

## 3.2 Implementations

### 3.2.1 Linked List Implementation

This approach uses a singly linked list with a **header node** (`S`).

- **Why use a header node:** A header node (a dummy node at the front) simplifies the code. It ensures that the top of the stack always exists, preventing null-pointer errors and eliminating the need for special `if-else` cases when pushing to or popping from an empty stack.

**Core Operations:**

All operations occur at the front of the linked list (right after the header node), ensuring $O(1)$ time complexity.

- **Push (Insert):** Adds a new element to the top.

    1. `TmpCell->Next = S->Next;` (The new node points to the current top element).

    2. `S->Next = TmpCell;` (The header node is updated to point to the new node, making it the new top).

- **Top (Peek):** Retrieves the value of the top element without removing it.

    - `return S->Next->Element;`.

- **Pop (Delete):** Removes the top element.

    1. `FirstCell = S->Next;` (Temporarily save the pointer to the node being removed).

    2. `S->Next = S->Next->Next;` (Update the header to bypass the removed node, pointing directly to the second element).

    3. `free(FirstCell);` (Deallocate the memory of the removed node).

### 3.2.1 Array Implementation

This is the most popular implementation due to its speed, cache friendliness, and lack of pointer overhead.

**Data Structure:**

The stack is managed using a `StackRecord` structure:

- `int Capacity;`: Defines the maximum number of elements the stack can hold.

- `int TopOfStack;`: An integer acting as the index pointer for the top element.

    - By convention, an empty stack is represented by `TopOfStack = -1`.

    - When pushing an item, increment it (`++`).

    - When popping an item, decrement it (`--`).

- `ElementType *Array;`: A dynamically allocated array that actually stores the elements.

**Operations:**

- **Push(X):** `Array[++TopOfStack] = X;` (Pre-increment the index, then place the value).

- **Top():** `return Array[TopOfStack];` (Return the element at the current index).

- **Pop():** `return Array[TopOfStack--];` (Return the element, then post-decrement the index. The old data remains in the array memory but is logically "deleted" because `TopOfStack` moved below it).

**Crucial Best Practices:**

1. **Strict Encapsulation:** The stack model must be well encapsulated. No outside code should ever directly access the `Array` or the `TopOfStack` variables; they should only interact through the designated Push/Pop/Top functions. This prevents developers from accidentally corrupting the stack order by writing to random array indices.

2. **Mandatory Error Checking:**

	- Before a **Push**, we must check for **Overflow** (`if TopOfStack == Capacity - 1`).

    - Before a **Pop** or **Top**, we must check for **Underflow** (`if TopOfStack == -1`) to avoid crashing the program by accessing invalid memory.

## 3.3 Applications

### 3.3.1 Balancing Symbols

Compilers must verify that every opening parenthesis, bracket, or brace has a corresponding and correctly nested closing symbol.

**1. The Algorithm**

- Create an empty stack `S`.

- Read the expression character by character:

    - If the character is an **opening symbol** (`(`, `[`, `{`), `Push` it onto the stack.

    - If the character is a **closing symbol** (`)`, `]`, `}`), `Pop` the top element from the stack.

        - _Error Check 1:_ If the stack is empty when you try to pop, report an ERROR (meaning there is a closing symbol without a matching opening symbol).

        - _Error Check 2:_ If the popped symbol does not match the closing symbol (e.g., popping a `[` when reading a `}`), report an ERROR (mismatched nesting).

- At the end of the expression, if the stack is **not empty**, report an ERROR (meaning there are unclosed opening symbols).

**2. Complexity**

- This is an **on-line algorithm**, meaning it processes data piece-by-piece in a single pass without needing to read the entire input into memory first.

- The time complexity is strictly linear: $T(N) = O(N)$, where $N$ is the length of the expression.

### 3.3.2 Postfix Expression Evaluation

Mathematical expressions can be written in three ways:

- **Infix:** $a + b * c - d / e$ (Standard human readable, requires precedence rules).

- **Prefix:** $- + a * b c / d e$ (Operators precede operands).

- **Postfix (Reverse Polish Notation):** $a\ b\ c * + d\ e / -$ (Operators follow operands).

**1. Why use Postfix**

In postfix notation, there is **no need to know precedence rules** or use parentheses. The order of operations is strictly determined by the position of the operators.

**2. The Evaluation Algorithm**

Using a stack makes evaluating postfix expressions trivial:

- Read the expression sequentially.

- If you read an **operand** (a number), push it onto the stack.

- If you read an **operator**, pop two operands from the stack, apply the operator to them, and push the result back onto the stack. _(Implicit rule: The first popped element is the right operand, the second popped element is the left operand)._

**3. Trace Example:** $6\ 2 / 3 - 4\ 2 * +$

1. Read `6`: Push 6. (Stack: `[6]`)

2. Read `2`: Push 2. (Stack: `[6, 2]`)

3. Read `/`: Pop 2, Pop 6. Compute $6 / 2 = 3$. Push 3. (Stack: `[3]`)

4. Read `3`: Push 3. (Stack: `[3, 3]`)

5. Read `-`: Pop 3, Pop 3. Compute $3 - 3 = 0$. Push 0. (Stack: `[0]`)

6. Read `4`, then `2`: Push 4, Push 2. (Stack: `[0, 4, 2]`)

7. Read `*`: Pop 2, Pop 4. Compute $4 * 2 = 8$. Push 8. (Stack: `[0, 8]`)

8. Read `+`: Pop 8, Pop 0. Compute $0 + 8 = 8$. Push 8. (Stack: `[8]`)

    _Final Result:_ 8. Time Complexity is $O(N)$.

### 3.3.3 Infix to Postfix Conversion

To let computers evaluate standard math easily, we must first convert Infix to Postfix. A stack is used to hold pending operators until they are ready to be output.

**1. Basic Conversion Rules**

- The order of **operands** is exactly the same in infix and postfix. They are sent directly to the output as they are read.

- **Operators** are pushed to the stack. However, operators with higher precedence must appear _before_ those with lower precedence in the output.

    - _Implicit Logic:_ When reading a new operator, pop operators from the stack to the output until the top of the stack has strictly lower precedence than the new operator, then push the new operator.

**2. Handling Parentheses (The Dual-Precedence Trick)**

Parentheses override standard precedence, which complicates stack logic.

Solution: Assign two different precedence levels to symbols:

- **Incoming Precedence:** When `(` is _not yet in the stack_, it has the **highest** precedence. This guarantees it will always be pushed onto the stack without popping anything.

- **In-Stack Precedence:** Once `(` is _inside the stack_, its precedence instantly becomes the **lowest**. This guarantees that subsequent operators (`+`, `*`, etc.) will simply be pushed on top of it.

- **The Pop Rule:** Never pop a `(` from the stack to the output _except_ when processing a closing `)`. When a `)` arrives, pop operators to the output until the `(` is popped (and discard the parentheses).

**3. Handling Associativity**

- **Left-to-Right (Standard):** $a - b - c$ becomes $a\ b - c -$. When evaluating the second `-`, the first `-` in the stack has equal precedence, so it is popped to the output first.

- **Right-to-Left (Exponentiation):** `2^2^3` evaluates as $2^{(2^3)}$, so it must convert to `2 2 3 ^ ^`, NOT `2 2 ^ 3 ^`.

    - _Implicit Logic:_ To achieve this, an incoming `^` has _higher_ precedence than an in-stack `^`. Thus, it pushes on top of the old one rather than forcing the old one to pop.

Like the evaluation, the time complexity for this conversion is $O(N)$.

### 3.3.4 Function Stacks

---

## 4. The Queue ADT

**Objects:** A finite ordered list with zero or more elements.

**Operations:**

- int IsEmpty( Queue Q )

- Queue CreateQueue( )

- DisposeQueue( Queue Q )

- MakeEmpty( Queue Q )

- Enqueue( ElementType X, Queue Q )

- ElementType Front( Queue Q )

- Dequeue( Queue Q );
