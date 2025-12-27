[[Stack 栈 | pre-knowledge about stack]]
## **1. Memory Segments: Code vs. Execution**

- **Text Segment:**
    
    - **Content:** Stores the compiled machine code (binary instructions) of the function.
        
    - **Address:** The "Function Address" (e.g., 0x00401000) points here.
        
    - **Lifetime:** Exists for the entire program duration. It is usually **Read-Only**.
        
- **Stack Segment:**
    
    - **Content:** Stores **Stack Frames** (local variables, arguments, return addresses).[[The stack frame 栈帧]]
        
    - **Lifetime:** Dynamic. Allocated when the function is called, freed (released) when it returns.
        

---

## **2. The Key Hardware Registers**

Before looking at the process, we must know the CPU registers involved:

1. **EIP / RIP (Instruction Pointer):**
    
    - Always points to the **next instruction** to be executed.
        
    - CPU automatically increments this after every instruction.
        
    - CALL and RET instructions modify this register to jump around in code.
        
2. **ESP / RSP (Stack Pointer):**
    
    - Points to the **Top of the Stack** (lowest address).
        
    - Changes constantly as data is pushed or popped.
        
3. **EBP / RBP (Base Pointer / Frame Pointer):**
    
    - Acts as a fixed **"Anchor"** for the current function's stack frame.
        
    - Local variables are accessed relative to this anchor (e.g., EBP - 4).
        

---

## **3. The Lifecycle of a Function Call**

**Scenario:** main calls func(10, 20).

### **Phase A: Preparation (In main)**

1. **Argument Passing:**
    
    - Arguments are pushed onto the stack (typically Right-to-Left).
        
    - Push 20, Push 10.
        
2. **The CALL Instruction:**
    
    - The CPU pushes the **Return Address** onto the stack.
        
    - **Return Address** = The address of the instruction immediately following the call in main.
        
    - The **EIP** is updated to point to the start of func.
        

### **Phase B: Function Prologue (Entry into func)**

This is the "Setup" phase, executed immediately upon entering the function.

```Assembly
push ebp      ; 1. Save the Caller's (main's) Base Pointer
mov ebp, esp  ; 2. Set the current Stack Pointer as the new Base Pointer
sub esp, N    ; 3. Move Stack Pointer down to reserve N bytes for locals
```

- **Logical Result:** A new Stack Frame is established. EBP is now the stable anchor for func.
    

### **Phase C: Execution (Body)**

- Local variables are stored in the space created by sub esp, N.
    
- They are accessed via negative offsets from EBP (e.g.,`[ebp - 4]`).
    
- **Note:** If these variables are not initialized, they contain "garbage" (values left over from previous function calls).
    

### **Phase D: Function Epilogue (Exit / Return)**

The "Cleanup" phase.

```Assembly
mov esp, ebp  ; 1. Collapse the stack (Free local variables instantly)
pop ebp       ; 2. Restore the Caller's (main's) Base Pointer
ret           ; 3. Pop the Return Address into EIP
```

- **Memory Release:** "Freeing" memory here just means moving the ESP pointer back up. The data physically remains but is considered "invalid/overwritten."
    

---

## **4. Visualization: The Stack Frame**

(Assuming a 32-bit architecture, Stack grows **Downwards**)

|   |   |   |   |
|---|---|---|---|
|Memory Direction|Content|Description|Owner|
|**High Address**|...|...|...|
|```<br>↓↓<br>```|Arg 2 (20)|Second Parameter|Caller (main)|
|```<br>↓↓<br>```|Arg 1 (10)|First Parameter|Caller (main)|
|**Boundary**|**Return Address**|Where to go back to|**Control Flow**|
|```<br>↓↓<br>```|**Old EBP**|Address of main's stack base|Callee (func)|
|```<br>↓↓<br>```|Local Var 1|[EBP - 4]|Callee (func)|
|**Low Address**|Local Var 2|[EBP - 8] (ESP points here)|Callee (func)|

---

## **5. Deep Dive: The "Old EBP" Chain**

### **Why save the Old EBP?**

- When func finishes, the CPU needs to know where main's stack frame was located.
    
- By executing push ebp at the start of every function, we create a **Linked List** embedded in the stack.
    
- **Current EBP** points to  ->  **Saved EBP** (of caller)  ->**Saved EBP** (of caller's caller)...
    

### **The Stack Backtrace**

- Debuggers use this chain to generate a **Stack Trace**.
    
- If the program crashes, the debugger looks at the current EBP, reads the value inside, jumps to that address, and repeats until it reaches the OS entry point. This is how it tells you: "Crash in func(), called by main()."
    

---

## **6. Summary Key Takeaways**

1. **Function Address vs. Stack Frame:** The code lives in the Text Segment (static); the variables live in the Stack Segment (dynamic).
    
2. **Stack Growth:** The stack grows **downwards** (High Address -> Low Address).
    
3. **Prologue:** push ebp -> mov ebp, esp (Sets up the frame).
    
4. **Epilogue:** mov esp, ebp -> pop ebp (Destroys the frame).
    
5. **Memory Release:** Freeing stack memory is fast because it involves simple pointer arithmetic (add esp, ... or mov esp, ebp), not complex garbage collection.