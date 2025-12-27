## 1. The Compilation Unit (Translation Unit)
The **Compilation Unit** (or Translation Unit) is the fundamental atomic unit that the compiler processes and optimizes. It is crucial to distinguish between the **physical source file** and the **logical compilation unit**.

### Definition
A Compilation Unit is not just the `.c` file you write. It is the result of the preprocessing stage.
**Formula:**
$$ \text{Compilation Unit} = \text{Source File (.c)} + \text{Recursively Expanded Headers} - \text{Comments} - \text{Excluded Code blocks} $$

### Core Characteristic: Independence
The compiler processes one compilation unit at a time and maintains **zero knowledge** of other units during this stage.
*   **Isolation:** When compiling `A.c`, the compiler does not know `B.c` exists.
*   **Consequence:** This is why **Function Declarations** (Prototypes) are mandatory. You must tell the compiler: "I promise this function exists somewhere else, let me pass for now, and the Linker will find it later."

### Scope and Linkage
[[static | More about static]]
The boundaries of a compilation unit define the behavior of the `static` keyword.
*   **Internal Linkage (`static`):** Variables/functions marked `static` are private to the current compilation unit. They are invisible to the linker and other files.
*   **External Linkage (`extern`):** By default, functions and global variables are visible to the entire program.