## 1. Definition and Essence
The **Relocatable Object File** (suffix `.o` on Linux, `.obj` on Windows) is the output of the **Assembly Stage**.

*   **Nature:** It contains binary machine code that the CPU can understand.
*   **Limitation:** It is **not executable**. It is a "half-finished" module.

## 2. Why is it called "Relocatable"?
The term "Relocatable" refers to the fact that the addresses inside this file are temporary and floating.

*   **Zero-Based Addressing:** In an `.o` file, all code and data addresses start from `0x0000`. This is a relative offset, not a valid physical or virtual memory address.
*   **The Relocation Process:** Since multiple `.o` files cannot all sit at address `0x0000` in the final program, the Linker will later "relocate" (move) this code to a specific, unique memory address.

## 3. Standard File Formats
Although binary, these files follow strict structural standards known as **Object File Formats**:
*   **ELF (Executable and Linkable Format):** The standard for Linux and Unix systems.
*   **PE (Portable Executable):** The standard for Windows (often derived from COFF (Common Object File Format),  the ancestor of modern object file formats, originally used in Unix System V.).

## 4. Internal Anatomy

An object file consists of several key sections. It is not just code; it contains metadata essential for linking.
[[Memory Allocation 内存分配 | About memory allocation]]
### Machine Instructions (.text Section)
*   Contains the actual compiled binary code (logic).
*   **State:** The instructions are valid, but the operands (addresses for jumps or variable access) are often placeholders.

**What exactly is in .text?**  
It strictly contains **Executable Instructions** (Functions).

- **Does it contain Variables?** **No.** Global/Static variables live in .data (if initialized) or .bss (if uninitialized). Local variables live on the Stack or Registers at runtime.
    
- **Does it contain Literals?** **Partially.**
    
    - **String Literals** (e.g., "Hello") usually go to a separate Read-Only Data section (.rodata).
        
    - **Immediate Values** (small numbers like int a = 5;) are embedded directly into the instruction stream within .text.

### Data (.data Section)
*   Contains initialized global and static variables (e.g., `int global_var = 100;`).

### Symbol Table
This is the "inventory list" of the object file. It categorizes symbols into two types:
1.  **Exported (Defined) Symbols:** Functions or variables defined in this file (e.g., `main`, `my_func`) that are available for other modules to use.
2.  **Imported (Undefined) Symbols:** Functions or variables used in this file but defined elsewhere (e.g., `printf`, `sin`). The file is asking the linker: "Where are these?"

### Relocation Table
This is the "instruction manual" for the linker. It lists exactly where in the `.text` section the code needs to be patched.
*   **Content:** "At offset `0x20` in the `.text` section, there is a call to `printf`. Please replace the `00 00 00 00` placeholder with the actual address of `printf` once you know it."

## 5. Visual Example: The Placeholder
Consider a C statement: `call_func();`

### In the Relocatable Object File (.o)
*   **Assembly:** `call 0x0`
*   **Machine Code:** `E8 00 00 00 00`
    *   `E8`: The Opcode for "CALL".
    *   `00 00 00 00`: A placeholder (32-bit offset) because the compiler does not know where `call_func` is located.
*   **Relocation Entry:** A note exists pointing to this `00` sequence, tagging it for the symbol `call_func`.

### In the Final Executable
*   **Action:** The Linker calculates the distance between the call site and the actual function address.
*   **Machine Code:** `E8 25 01 00 00`
    *   The placeholder has been replaced by the correct relative offset.