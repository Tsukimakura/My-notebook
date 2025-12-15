[[Declarations vs Definitions 声明和定义 | pre-knowledge -- declarations and definitions]]
#### **1. Definition**

**Scope** determines the region of the program where a variable or function is **visible** and can be accessed. If you try to access a variable outside its scope, the compiler will generate an error.

---

#### **2. Types of Scope**

**A. Block Scope (Local Scope)**

- **Definition:** Variables declared inside a block { ... }.
    
- **Visibility:** Only accessible within that specific block (functions, loops, if-statements).
    
- **Lifetime:** Created when execution enters the block(the point of declaration), destroyed when it exits (unless static).
    
- **Example:**

    ```c
    void func() {
        int x = 10; // Block scope (visible only in func)
        if (x > 5) {
            int y = 20; // Block scope (visible only in this 'if')
        }
        // y is not accessible here
    }
    ```
    

**B. File Scope (Global Scope)**

- **Definition:** Variables declared **outside** of all functions (usually at the top of the file).
    
- **Visibility:** Accessible from the point of declaration to the end of the file. Can be accessed by other files if not marked static.
    
- **Lifetime:** Exists for the entire duration of the program.
    

**C. Function Scope**

- **Specific Case:** Applies **only to Labels** (used with goto).
    
- **Rule:** A label is visible throughout the entire function, regardless of which block it is in.
    

**D. Function Prototype Scope**

- **Definition:** Parameter names in a function declaration.
    
- **Rule:** The names (a, b) only matter within that specific prototype line.

    ```c
    void myFunc(int a, int b); // 'a' and 'b' have prototype scope here
    ```
    

---

#### **3. Impact of Keywords (static & extern)**

**A. static (Internal Linkage)**
[[static | Learn more about static]]

- **On Global Variables:** Limits the scope to **the current file only**. Other files cannot access it using extern.
    
    - Use: To create "private" global variables.
        
- **On Local Variables:** Does **not** change scope (still only visible in the block), but extends **lifetime** (persists between function calls).
    

**B. extern (External Linkage)**

- **Purpose:** Declares a variable that is defined in another file.
    
- **Effect:** Extends the scope of a global variable from File A to File B.
    

---

#### **4. Variable Shadowing**

- **Concept:** If an inner block defines a variable with the **same name** as an outer block (or global), the inner variable **"shadows"** (hides) the outer one.
    
- **Example:**

    ```c
    int x = 100; // Global
    
    void test() {
        int x = 5; // Local 'x' shadows Global 'x'
        printf("%d", x); // Prints 5
    }
    ```
    

---

#### **5. Summary Table**

| Scope Type        | Declaration Place    | Visibility              | Lifetime (Default)   |
| ----------------- | -------------------- | ----------------------- | -------------------- |
| **Block**         | Inside { }           | Inside that block only  | Ends when block ends |
| **File**          | Outside functions    | Entire file (downwards) | Entire Program       |
| **Function**      | Labels (label:)      | Entire Function         | Function execution   |
| **Static Global** | Outside { } + static | **Current File Only**   | Entire Program       |