In C, "compiling" is actually a pipeline process known as **Translation**. The compiler driver (e.g., GCC) orchestrates four distinct stages to transform human-readable source code into machine-executable binaries.

## 0. Overview
*   **Toolchain:** We use **GCC** (GNU Compiler Collection) as the primary example.
*   **The Pipeline:** `Source (.c)` $\to$ `Preprocessed (.i)` $\to$ `Assembly (.s)` $\to$ `Object (.o)` $\to$ `Executable`.

---

##  Stage 1: Preprocessing
**Goal:** Pure text manipulation and substitution.
**Tool:** The Preprocessor (`cpp`).

### Key Actions
1.  **Macro Expansion:** Replaces all defined macros (e.g., `#define NUM 100`) with their literal values.
2.  **Header Inclusion:** Copies the **entire content** of header files (e.g., `#include <stdio.h>`) directly into the source file. This causes the file size to expand significantly.
3.  **Conditional Compilation:** Evaluates directives like `#ifdef`, `#if`, keeping or removing code blocks.
4.  **Cleanup:** Strips out all comments (`//`, `/* ... */`) and adds line markers for debugging.

### Command Line
```bash
gcc -E hello.c -o hello.i
```
*   **Flag:** `-E` (Stop after preprocessing).
*   **Output:** `.i` file (Still **pure C source code**, readable via text editor).

---

##  Stage 2: Compilation (The "Proper" Compilation)
**Goal:** Translate C code into **Assembly Language**.
**Tool:** The Compiler (`cc1`).

### Key Actions
1.  **Analysis:** Performs lexical, syntactic, and semantic analysis (checks for syntax errors and type mismatches).
2.  **Optimization:** If flags like `-O2` are used, the compiler optimizes logic (e.g., dead code elimination, loop unrolling).
3.  **Code Generation:** Translates the logic into the specific **Instruction Set Architecture (ISA)** of the target machine (e.g., x86_64 or ARM64).

### Command Line
```bash
gcc -S hello.i -o hello.s
```
*   **Flag:** `-S` (Compile only, do not assemble).
*   **Output:** `.s` file (Text file containing **Assembly Instructions**).
*   **Example Content:**
    ```assembly
    movl $100, %esi
    call printf
    ```

---

##  Stage 3: Assembly
**Goal:** Translate Assembly instructions into **Machine Code**.
**Tool:** The Assembler (`as`).

### Key Actions
1.  **Translation:** Converts human-readable mnemonics (e.g., `mov`, `push`) into binary opcodes defined by the ISA.
2.  **Generation of "Relocatable Object File":**
    *   **Machine Code:** The CPU can read it, but it cannot run yet.
    *   **Placeholder Addresses:** Addresses for functions/variables are set to `0x0` or relative offsets because the final memory layout is unknown.
    *   **Symbol Table:** A list of symbols defined (exported) and symbols needed (imported/undefined) by this file.
    [[06 Intermediate Product — Relocatable Object File (.o)#Symbol Table | Symbol Table (brief)]]

### Command Line
```bash
gcc -c hello.s -o hello.o
```
*   **Flag:** `-c` (Compile and Assemble, but do not link).
*   **Output:** `.o` (Linux) or `.obj` (Windows). This is a **Binary file**.
*   **Verification:** Use `objdump -d hello.o` to view the machine code.

---

##  Stage 4: Linking
**Goal:** Combine object files and libraries to create the **Executable**.
**Tool:** The Linker (`ld`).

### Key Actions
1.  **Section Merging:** Combines the `.text` (code) and `.data` (variables) segments from multiple `.o` files into one unified layout.
2.  **Symbol Resolution:**
    *   Scans the **Symbol Table** of all inputs.
    *   Matches "Undefined References" (e.g., a call to `printf` in `main.o`) with their "Definitions" (e.g., the actual code of `printf` in `libc.so` or `libc.a`).
3.  **Relocation:**
    *   Calculates the final virtual memory addresses.
    *   **Patches** the machine code: Replaces the placeholder addresses (from Stage 3) with real addresses (Absolute or PC-Relative).
4.  **Entry Point:** Links the startup code (CRT - C Runtime, typically `_start`) which initializes the environment and calls `main`.

### Command Line
```bash
gcc hello.o -o hello
```
*   **Flag:** None (defaults to linking) or specific linker flags (`-l`, `-L`).
*   **Output:** Final Executable (e.g., `a.out`, `hello`, `hello.exe`).

---

##  GCC Flexibility (The "Train Station" Concept)
GCC acts as a driver program. It detects the file extension and automatically runs the necessary previous steps. You can "board the train" at any stage:

| Input File Extension | Content | GCC Action |
| :--- | :--- | :--- |
| **`.c`** | C Source | Preprocess $\to$ Compile $\to$ Assemble $\to$ Link |
| **`.i`** | Preprocessed C | Compile $\to$ Assemble $\to$ Link |
| **`.s`** | Assembly Source | Assemble $\to$ Link |
| **`.o`** | Machine Code | Link |

### Example of Flexibility
You can mix source files and object files in a single command:
```bash
# GCC will compile main.c to object code, then link it with the existing utils.o
gcc main.c utils.o -o my_app
```

---
##  Pro Tip: The All-in-One Inspector (`--save-temps`)
If you want to view **all** intermediate files (`.i`, `.s`, `.o`) without running GCC three separate times, you can use the `--save-temps` flag.

By default, GCC deletes these temporary files after each stage to keep your directory clean. This flag tells GCC to keep them.

### Command Line
```bash
gcc --save-temps hello.c -o hello
```

### Result
After running this single command, your directory will contain:
1.  `hello.i` (Preprocessed source)
2.  `hello.s` (Assembly code)
3.  `hello.o` (Object code)
4.  `hello` (Executable)

**Why use it?**
It is the most efficient way to debug the compilation process or verify what the preprocessor and compiler are actually doing to your code.

---

##  Summary Table

| Stage             | Input                | Action                                              | Output                    | GCC Flag |
| :---------------- | :------------------- | :-------------------------------------------------- | :------------------------ | :------- |
| **Preprocessing** | Source Code (`.c`)   | Macro expansion, Text substitution                  | Pure C Code (`.i`)        | `-E`     |
| **Compilation**   | Pure C Code (`.i`)   | Syntax check, Optimize, Target ISA mapping          | Assembly (`.s`)           | `-S`     |
| **Assembly**      | Assembly (`.s`)      | Translate to Binary, Create Symbol Table            | Relocatable Object (`.o`) | `-c`     |
| **Linking**       | Object (`.o`) + Libs | Merge sections, Resolve symbols, Relocate addresses | Executable                | (None)   |