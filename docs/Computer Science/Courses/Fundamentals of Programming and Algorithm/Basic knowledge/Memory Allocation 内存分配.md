When a program runs on a modern computer, its memory is divided into several logical regions, each serving a different purpose. Although the exact layout varies by architecture and operating system (e.g., Linux, Windows, macOS), the following model captures the essential structure:

```
+---------------------------+ 
|   Kernel Space            |  (protected from user access)
+---------------------------+
|   Stack                   | 
|   (grows downward)        | 
+---------------------------+
|   Heap                    | 
|   (grows upward)          | 
+---------------------------+
|   BSS Segment             |  (uninitialized globals) 
+---------------------------+
|   Data Segment            |  (initialized globals) 
+---------------------------+
|   Text Segment            |  (machine code, read-only) 
+---------------------------+`
```
---

# **1. Text Segment (Code Segment)**

### **What it is**

The text segment stores the **executable machine instructions** of the program. It is usually **read-only** to prevent accidental modification, and often **shared** among processes running the same program to save memory.

### **Historical note**

In early computers (1950s–1970s), programs loaded directly into memory without protection.  
Modern systems use **virtual memory** and **memory protection** so that instructions cannot be overwritten, improving security and stability.

---

# **2. Data Segment**

### **What it is**

The data segment contains **global and static variables that have been explicitly initialized** before the program starts.

Example in C:

`int x = 10;       // in data segment static int y = 5; // in data segment`

### **Historical note**

Before virtual memory, global/static variables lived in a fixed memory region determined at link time.  
As programs became larger, relocation and dynamic linking required more flexible memory models, which virtual memory solved.

---

# **3. BSS Segment (Block Started by Symbol)**

### **What it is**

The BSS stores **global and static variables that are not initialized** by the programmer.  
The OS initializes them to **zero** before the program starts.

Example:

`int counter;       // BSS static int flag;   // BSS`

### **Why this exists**

Historically, storing a block of zeroed variables in the executable was a waste of disk space.  
Instead, Unix linkers placed them in "BSS," meaning “allocate this many zero-initialized bytes at runtime.”

---

# **4. Heap**

### **What it is**

The heap is the region used for **dynamically allocated memory**, e.g.:

- `malloc` / `calloc` / `realloc` in C
    
- `new` in C++
    
- garbage-collected objects in languages like Java and Python
    

The heap **grows upward** (toward higher addresses) as memory is requested.

### **Characteristics**

- Size is not fixed at compile time
    
- Managed by the **runtime memory allocator**
    
- Fragmentation can occur
    
- Often implemented using **brk/sbrk** or **mmap** on Unix-like systems
    

### **Evolution**

- Early systems only offered simple linear allocation (`brk`).
    
- Modern allocators (ptmalloc, jemalloc, tcmalloc) use:
    
    - bins & freelists
        
    - slab allocation
        
    - per-thread caches
        
    - huge pages  
        to reduce fragmentation and improve speed on multi-core processors.
        

---

# **5. Stack**

### **What it is**

The stack stores:

- Function call frames
    
- Local variables
    
- Return addresses
    
- Saved registers
    
- Parameters (depending on calling convention)
    

The stack **grows downward**, from high toward low addresses.

### **Why a stack?**

A stack is perfect for the **LIFO (last-in, first-out)** nature of function calls.

### **Stack frame example**

A typical stack frame (x86-64) includes:

`return address saved base pointer local variables saved registers function arguments (if not passed in registers)`

### **Historical evolution**

- Early machines did not have hardware stacks; programmers managed memory manually.
    
- With architectures like PDP-11 (1970s), hardware stack support became standard.
    
- Modern CPUs use stacks for switching between:
    
    - user mode and kernel mode
        
    - interrupts
        
    - context switching
        

---

# **6. Memory-Mapped Regions (including Shared Libraries)**

Modern systems use **memory mapping (mmap)** to load:

- Shared libraries (`.so`, `.dll`)
    
- Files
    
- Anonymous memory regions
    
- The stack of other threads
    
- GPU buffers
    
- JIT-compiled code regions (e.g., in JVM, JavaScript engines)
    

Memory mappings allow:

- On-demand loading (lazy loading)
    
- Sharing physical pages between processes
    
- Efficient I/O
    

### **Example**

When you load a standard C library, it appears as a mapped file region in your virtual address space.

---

# **7. Kernel Space (Not accessible to user programs)**

Programs run in **user mode**, where they cannot directly access hardware or kernel memory.

To perform privileged operations, programs make **system calls**, which temporarily switch the CPU into **kernel mode**.

### **Historical reason**

This is a major improvement from early MS-DOS–like systems, where applications had unrestricted access to memory and hardware, often causing crashes.

---

# **8. Virtual Memory and Paging (The Key Modern Concept)**

### **What it is**

Virtual memory allows the OS to give each process a **private, isolated address space**, even larger than the physical RAM.

It relies on:

- **Page tables**
    
- **Hardware MMU (Memory Management Unit)**
    
- **TLB (Translation Lookaside Buffer)**
    

### **Benefits**

- Memory protection
    
- Process isolation
    
- Efficient multitasking
    
- Ability to use disk as “extended memory” (swap)
    
- Random-access mapping of files
    

### **Historical transition**

- 1960s: Early systems like Multics pioneered virtual memory.
    
- 1970s–1980s: Unix adopted it.
    
- 1990s–2000s: All mainstream OSes use paging, ASLR, and memory protection.
    

---

# **9. Putting It All Together: Memory Layout of a Typical Process**

```
Higher Addresses 
┌──────────────────────────────┐ 
│   Kernel Space (inaccessible)│ 
├──────────────────────────────┤ 
│   Stack (per thread)         │
│   ↓ grows downward           │
├──────────────────────────────┤ 
│   Memory-mapped regions      │ 
│   (shared libs, files, etc.) │ 
├──────────────────────────────┤ 
│   Heap (dynamic allocation)  │
│   ↑ grows upward             │
├──────────────────────────────┤
│   BSS (uninitialized globals)│
├──────────────────────────────┤ 
│   Data (initialized globals) │
├──────────────────────────────┤ 
│   Text (program code)        │
└──────────────────────────────┘
Lower Addresses
```
---

# **10. Summary**

A running program’s memory organization includes:

|Region|Contains|Notes|
|---|---|---|
|Text|Machine code|Read-only, may be shared|
|Data|Initialized globals|Stored in executable|
|BSS|Zero-initialized globals|Not stored on disk|
|Heap|Dynamic memory|Managed at runtime|
|Stack|Call frames and locals|LIFO, per thread|
|Mapped Regions|Shared libs, files, extra stacks|From the OS via `mmap`|
|Kernel Space|OS memory|Protected, not accessible|

This structure evolved from simple flat memory models to the rich, protected, virtualized environment used today.