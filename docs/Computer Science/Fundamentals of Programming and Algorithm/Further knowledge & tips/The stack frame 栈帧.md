#### **1. Definition**

A **Stack Frame** is a temporary, private workspace in memory allocated for a **single function call**.

- **Created:** When a function is called.
    
- **Destroyed:** When the function returns.
    
- **Location:** Resides in the **Stack Segment**.
    

#### **2. Anatomy (High Address -> Low Address)**

A typical stack frame consists of four layers. The frame is bounded by two CPU registers: **EBP** (top/anchor) and **ESP** (bottom).

| Section                | Content     | Description                                                                                              |
| ---------------------- | ----------- | -------------------------------------------------------------------------------------------------------- |
| **1. Arguments**       | func(a, b)  | Passed by the **Caller**. Located above EBP.                                                             |
| **2. Return Address**  | 0x401...    | Where to jump back to after the function finishes. Pushed automatically by CALL.                         |
| **3. Saved EBP**       | **Old EBP** | The **Caller's** stack base. This links the current frame to the previous one (forming the stack trace). |
| **4. Local Variables** | int x;      | Private variables for this function. Located below EBP.                                                  |

#### **3. Key Registers**

- **EBP (Base Pointer):** The **Anchor**. It remains fixed during the function execution. Used to access locals (e.g., EBP - 4) and arguments (e.g., EBP + 8).
    
- **ESP (Stack Pointer):** The **Moving Top**. It changes as data is pushed/popped or as memory is allocated for locals.
    

#### **4. Lifecycle (Assembly View)**

**A. Construction (Prologue)**  
Sets up the "house".

```Assembly
push ebp      ; Save the Caller's EBP
mov ebp, esp  ; Set current ESP as the new EBP (Anchor)
sub esp, N    ; Allocate N bytes for local variables
```

**B. Destruction (Epilogue)**  
Tears down the "house".

```Assembly
mov esp, ebp  ; Restore ESP (Free locals instantly)
pop ebp       ; Restore Caller's EBP (Go back to previous frame)
ret           ; Pop Return Address into Instruction Pointer
```

#### **5. Key Concepts**

- **Isolation:** Each function call gets its own frame. main cannot touch func's variables.
    
- **Recursion:** If a function calls itself, a **new** stack frame is created for that specific call. This preserves the state of previous calls.
    
- **Stack Overflow:** Occurs when too many frames are created (e.g., infinite recursion), exhausting the stack memory.

[[Anatomy of a function call in memory]]