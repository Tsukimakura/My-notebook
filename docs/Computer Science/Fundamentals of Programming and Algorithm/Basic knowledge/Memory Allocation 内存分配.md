# **1. Visual Memory Layout (Revised)**

This diagram reflects the **Linux/ELF** standard layout, incorporating `.rodata` and the distinction between the Main Thread Stack and Child Thread Stacks.

```text
High Addresses (0xFF...)
+-----------------------------------+
|   Kernel Space                    | (Inaccessible to user mode)
+-----------------------------------+
|   Command Line Args & Env Vars    | (argv, environ)
+-----------------------------------+
|   Main Thread Stack               | (Created by Kernel at startup)
|   (Grows Downwards ↓)             |
+-----------------------------------+
|           ↓                       |
|                                   |
|   Memory Mapping Region (mmap)    | (Shared Libs, Child Thread Stacks)
|                                   |
|           ↑                       |
+-----------------------------------+
|   Heap                            | (brk/sbrk managed)
|   (Grows Upwards ↑)               |
+-----------------------------------+
|   BSS Section                     | (Uninitialized globals) \
+-----------------------------------+                          > OS "Data Segment" (RW-)
|   Data Section                    | (Initialized globals)   /
+-----------------------------------+
|   .rodata Section                 | (String literals, const)\
+-----------------------------------+                          > OS "Text Segment" (R-X)
|   .text Section                   | (Machine code)          /
+-----------------------------------+
Low Addresses (0x00...)
```

---

# **2. The Read-Only Region (OS "Text Segment")**

In the OS view, this entire region is mapped as **Read-Only + Execute (R-X)** (or sometimes just Read-Only for data). It combines two Linker Sections:

### **A. .text Section (Code)**
*   **Content:** The executable machine instructions.
*   **Note:** Contains immediate values (integer literals like `100`) embedded directly in the instructions.

### **B. .rodata Section (Read-Only Data)**
*   **Content:**
    *   **String Literals** (e.g., `"Hello World"`).
    *   Global `const` variables.
    *   Jump tables (for `switch` statements).
*   **Placement:** Physically located between `.text` and `.data`.
*   **Protection:** Writing to this area causes a **Segmentation Fault** because the OS marks these pages as Read-Only.

---

# **3. The Read-Write Region (OS "Data Segment")**

In the OS view, these sections are merged into a single **Read-Write (RW-)** segment because they share the same permissions.

### **A. .data Section**
*   **Content:** Global/Static variables initialized to **non-zero** values.
*   **Storage:** Occupies actual space in the binary file on disk.

### **B. .bss Section**
*   **Content:** Global/Static variables that are uninitialized or initialized to zero.
*   **The "Zero-Fill" Trick:**
    *   It takes up **zero space** on the disk (Linker view).
    *   The OS allocates memory for it at runtime and automatically wipes it with zeros.
    *   *Implementation:* In the ELF header, `MemSiz > FileSiz`. The difference is the BSS.

---

# **4. Heap**

*   **Content:** Dynamically allocated memory via `malloc`/`calloc`/`realloc`.
*   **Growth:** Grows upward (low to high addresses).
*   **Mechanism:** managed by the allocator (like `ptmalloc` in glibc) using `brk` (for small allocations) or `mmap` (for large allocations).

---

# **5. Memory Mapping Region (mmap)**

This is the vast space between the Heap and the Main Stack.

*   **Shared Libraries:** Dynamic libraries (`.so`, `.dll`) linked at runtime are mapped here.
*   **Child Thread Stacks:**
    *   Unlike the main thread, stacks for threads created via `pthread_create` are allocated here using `mmap`.
    *   They usually have fixed sizes (e.g., 8MB) and are protected by **Guard Pages** to prevent overflow.

---

# **6. The Stack (Main Thread)**

*   **Content:** Stack frames, local variables, return addresses for the **Main Thread**.
*   **Growth:** Grows downward (high to low addresses).
*   **Creation:** Automatically created by the **OS Kernel** when the process starts.
*   **Limit:** Usually limited by the OS (e.g., `ulimit -s` in Linux, typically 8MB), but expands automatically until that limit.

---

# **7. Arguments and Environment**

Located at the very top of the user address space, just below the Kernel space.

*   **Environment Variables:** The `KEY=VALUE` pairs (e.g., `PATH`, `HOME`) inherited from the parent shell.
*   **Command Line Arguments:** The content of `argv[]` passed to `main`.
*   **Access:** Can be accessed via `main(int argc, char *argv[], char *envp[])` or `getenv()`.

---

# **8. Kernel Space**
*   **Content:** The kernel code, page tables, and kernel data structures.
*   **Protection:** Inaccessible to user programs (Ring 3). Access requires a **System Call** (switching to Ring 0).

---

# **Summary: Linker View vs. OS View**

| Logical Content | Linker Section | OS Segment | Permissions |
| :--- | :--- | :--- | :--- |
| Functions / Code | `.text` | **Text Segment** | **R-X** (Read/Exec) |
| String Literals / Const | `.rodata` | **Text Segment** | **R--** (Read Only) |
| Init Globals (`int a=1`) | `.data` | **Data Segment** | **RW-** (Read/Write) |
| Uninit Globals (`int a`) | `.bss` | **Data Segment** | **RW-** (Read/Write) |