## **1. Writing Source Code**

You begin by writing human-readable source code in a high-level language such as C:

`int main() {     return 0; }`

This file (e.g., `main.c`) contains symbols, keywords, and logic understandable by humans, not machines.

---

## **2. Preprocessing**

The **preprocessor** handles all lines starting with `#`, including:

- Expanding header files (`#include`)
    
- Replacing macros (`#define`)
    
- Removing comments
    
- Processing conditional compilation (`#ifdef`, `#ifndef`)
    

The output is still C code, but now fully expanded.

---

## **3. Compilation**

The compiler translates the preprocessed C code into **assembly language**.  
Important steps here:

- Syntax analysis
    
- Semantic analysis
    
- Optimization
    
- Generating assembly code (e.g., `.s` file)
    

This step maps your high-level constructs into low-level instructions.

---

## **4. Assembly**

The **assembler** converts assembly code into machine code, producing an **object file**:

- `.o` on Linux/macOS
    
- `.obj` on Windows
    

This file contains binary instructions, but the program is still incomplete because external functions are unresolved.

---

## **5. Linking**

The **linker** combines multiple object files and libraries into a **complete executable**:

- Resolves external function references (e.g., `printf`)
    
- Merges code and data sections
    
- Performs relocations
    
- Produces the final binary:
    
    - `a.out` or custom output on Linux
        
    - `.exe` on Windows
        

Static and dynamic linking may both occur.

---

## **6. Loading**

When you run the executable, the **operating system loader** performs:

- Creating a new process
    
- Allocating virtual address space
    
- Loading program segments into memory
    
- Setting up stack, heap, and global data regions
    
- Mapping dynamic libraries through the dynamic linker
    
- Preparing CPU registers
    
- Jumping to the entry point (`_start`)
    

At this point, the program is ready to execute.

---

## **7. Execution**

Execution begins at `_start`, then proceeds through:

1. Runtime environment initialization (usually from libc)
    
2. Calling `main()`
    
3. Running your program logic
    
4. Returning the exit code
    
5. Cleanup by the OS after the program terminates
    

The CPU executes the machine instructions step by step.

---

# *📌 Summary Diagram (Text Version)**

```
Source Code (.c)
       ↓ 
Preprocessing
       ↓ 
Compilation (→ Assembly)
       ↓
Assembly (→ Object File)
       ↓ 
Linking (→ Executable)
       ↓ 
Loading (OS loads the program)
       ↓ 
Execution (CPU runs instructions)
```