## 1. Overview
The Linker (`ld`) is the final stage of the compilation pipeline. Its primary job can be visualized as a combination of **"Jigsaw Puzzle"** (assembling code pieces) and **"Fill-in-the-blanks"** (connecting addresses).
*   **Input:** Multiple Relocatable Object Files (`.o`) and Static/Dynamic Libraries (`.a`, `.so`).
*   **Output:** A single Executable File.

## 2. The Three Core Steps
The linker performs three major operations to transform independent modules into a unified program.

### Step 1: Section Merging
Individual object files have their own fragmented sections (`.text`, `.data`). The linker aggregates them.
1.  **Aggregation:** It takes the `.text` section from `file A.o` and the `.text` section from `file B.o` and concatenates them into a single, massive `.text` segment.
2.  **VMA Assignment:** Once merged, the layout is finalized. The linker assigns **Virtual Memory Addresses (VMA)** to every byte.
    *   *Significance:* Before this step, addresses were relative (starting at 0). After this step, the code has a specific destination in memory (e.g., `0x400000`).

### Step 2: Symbol Resolution
The linker ensures that every function call or variable access points to a valid definition.
*   **The Global Symbol Table:** The linker maintains a list of:
    *   **Defined Symbols:** Functions/Variables implemented in the current set of files.
    *   **Undefined Symbols:** Functions/Variables called but not yet found.
*   **Resolution Logic:** It matches references in one file (Undefined) to definitions in another file (Defined).
*   **Common Errors:**
    *   **Undefined Reference:** The linker searched all files and libraries but could not find the definition (e.g., missing library).
    *   **Multiple Definition:** Two files define the same global symbol (e.g., `int a;` in two headers included without guards).

### Step 3: Relocation
This is the physical patching of the machine code. Since the addresses were placeholders (0x0) in the `.o` files, the linker must update them now that VMAs are assigned.
*   **Absolute Relocation:** Used for global variables. The linker replaces the placeholder with the exact 32/64-bit address of the variable.
*   **PC-Relative Relocation:** Used for function calls (e.g., `call` instruction).
    *   **The Math:** The CPU instruction pointer (PC) moves relative to the current position.
    *   **Calculation:** `Target Address - Current PC = Offset`.
    *   The linker writes this calculated `Offset` into the machine code.

## 3. The True Entry Point
A common misconception is that C programs begin execution at `main()`.
*   **The Reality:** The linker links a special startup file provided by the C Runtime (CRT), often named `crt0.o` or `crt1.o`.
*   **`_start` Symbol:** This is the actual entry point defined in the CRT.
*   **Execution Flow:**
    1.  OS loads program and jumps to `_start`.
    2.  `_start` initializes the stack, heap, and global variables.
    3.  `_start` calls `main()`.
    4.  When `main()` returns, `_start` calls `exit()` to clean up.

## 4. How the Linker Finds Libraries
The linker does not have a database of where functions live. It performs a **Linear Scan**.

### The Scanning Mechanism
1.  **Sequential Processing:** The linker processes files (object files and libraries) from **left to right** as they appear on the command line.
2.  **The "Unresolved List":** It keeps a running list of undefined symbols.
3.  **Library Lookup:** When it encounters a library (e.g., `-lm`):
    *   It checks the library's **Symbol Table**.
    *   If the library defines a symbol currently in the "Unresolved List", it links that object file.
    *   If the library defines symbols that are *not* needed, it ignores them.

### The Order Dependency
Because of the linear scan, **Callers must appear before Callees**.
*   **Wrong:** `gcc -lm main.c` (Linker sees math lib first, needs nothing from it, discards it. Then sees main, needs math, but library is gone).
*   **Right:** `gcc main.c -lm` (Linker sees main, notes need for `sin`, then sees math lib, and resolves it).

## 5. Static vs. Dynamic Linking
The linker handles libraries in two distinct ways:

### Static Linking (.a)
*   **Mechanism:** Copy and Paste.
*   The linker extracts only the specific `.o` files needed from the archive (`.a`) and physically copies their code into the final executable.
*   **Result:** Larger executable, but zero runtime dependencies.

### Dynamic Linking (.so / .dll)
*   **Mechanism:** "Leave a Note".
*   The linker does **not** copy the code. Instead, it generates a stub using **PLT (Procedure Linkage Table)** and **GOT (Global Offset Table)**.
*   **Result:** Small executable. At runtime, the OS Loader (`ld-linux.so`) must load the external library file to resolve addresses.