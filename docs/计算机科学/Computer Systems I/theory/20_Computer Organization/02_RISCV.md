# 02_RISCV

## I. Introduction to RISC-V

RISC-V (pronounced "risk-five") is an open-source Instruction Set Architecture based on Reduced Instruction Set Computing (RISC) principles.

- **Origins:** Developed in 2010 by researchers at UC Berkeley (Krste Asanović, David Patterson, and students).

- **Motivation:** Most traditional ISAs (x86, ARM, MIPS) are commercially protected by patents, preventing practical reproduction. RISC-V is completely open, permitting anyone to construct compatible hardware and software.

- **Design Goals:**

    - Suitable for direct native hardware implementation (not just simulation).

    - Avoids "over-architecting" for specific microarchitecture styles (e.g., out-of-order execution) or implementation technologies (FPGA, ASIC).

    - Supports the revised 2008 IEEE-754 floating-point standard.

## II. RISC-V Principles and Processor State

### 1. Modular and Extendable Design

RISC-V is kept highly simple by separating its specifications into modular components:

- **User-level ISA Spec:** For compute instructions.

- **Privileged ISA Spec:** For supervisor-mode instructions.

- **Naming Convention:** `RV + Word Width + Extensions`.

    - _Example:_ **RV32IMAFD** (or **RV32G**) represents a 32-bit architecture with **I**nteger base, **M**ultiply/Divide, **A**tomic, Single **F**P, and **D**ouble FP extensions.

### 2. Processor State (Registers)

The RISC-V machine state consists of:

- **Program Counter (PC):** Points to the current instruction.

- **32 Integer Registers (`x0` - `x31`):** 32-bit or 64-bit wide.

    - `x0`: Hardwired to `0` (always contains the value 0).

    - `x1`: By convention, holds the return address on a function call.

- **32 Floating-Point Registers (`f0` - `f31`):** Can hold single or double-precision values.

- **FP Status Register (`fsr`):** Used for rounding modes and exception reporting.

## III. Instruction Encoding Formats

RISC-V uses a hybrid instruction encoding. While it supports variable lengths (16, 32, 48, 64 bits), the base ISA (RV32I) strictly uses **32-bit fixed-length instructions** aligned on four-byte memory boundaries. The lowest two bits of standard 32-bit instructions are always `11`.

There are six core instruction formats:

| **Format Name** | **Primary Use**                 | **Field Structure / Comments**                                                                 |
| --------------- | ------------------------------- | ---------------------------------------------------------------------------------------------- |
| **R-type**      | Register-to-Register Arithmetic | `funct7` \| `rs2` \| `rs1` \| `funct3` \| `rd` \| `opcode`                                     |
| **I-type**      | Immediate Arithmetic & Loads    | `imm[11:0]` \| `rs1` \| `funct3` \| `rd` \| `opcode`                                           |
| **S-type**      | Stores to Memory                | `imm[11:5]` \| `rs2` \| `rs1` \| `funct3` \| `imm[4:0]` \| `opcode` (Immediate field is split) |
| **B-type**      | Conditional Branches            | Similar to S-type, but immediate encodes a branch offset.                                      |
| **U-type**      | Upper Immediates                | `imm[31:12]` \| `rd` \| `opcode`                                                               |
| **J-type**      | Unconditional Jumps             | `imm[20:10, 1, 11, 19:12]` \| `rd` \| `opcode`                                                 |

## IV. Core Instruction Categories (RV32I Base)

### 1. ALU Instructions (Arithmetic & Logic)

- **R-Type (Register):** Uses two source registers (`rs1`, `rs2`) and one destination register (`rd`).

    - Examples: `add`, `sub`, `xor`, `or`, `and`, `sll` (shift left logical), `srl` (shift right logical), `sra` (shift right arithmetic), `slt` (set less than).

    - _Bitwise Tricks:_ `AND` is used to mask/clear bits. `XOR` with all 1s acts as a `NOT` operation. Left shifting by $i$ mathematically multiplies the value by $2^i$.

- **I-Type (Immediate):** Uses one source register and a sign-extended 12-bit immediate.

	- Examples: `addi`, `slti`, `andi`, `slli`. (Note: There is no `subi`; you simply use `addi` with a negative immediate).

- **U-Type (Upper Immediate):**

    - `lui` (Load Upper Immediate): Copies a 20-bit constant to the upper 20 bits `[31:12]` of the destination register and clears the lower 12 bits.

    - _Loading 32-bit Constants:_ Requires two steps because a 32-bit constant cannot fit inside a single 32-bit instruction word. You must use `lui` to set the top 20 bits, followed by `addi` to set the bottom 12 bits.

### 2. Memory Access (Loads and Stores)

- **Memory Characteristics:** RISC-V utilizes **Little-Endian** byte ordering (the least significant byte is stored at the lowest memory address). Certain data types may have alignment restrictions.

- **Loads (I-Type):** Reads data from memory into a register.

    - Syntax: `lw rd, offset(rs1)` $\rightarrow$ $rd = Memory[rs1 + offset]$

    - Examples: `ld` (double), `lw` (word), `lh` (halfword), `lb` (byte), `lbu` (byte unsigned).

- **Stores (S-Type):** Writes data from a register into memory.

    - Syntax: `sw rs2, offset(rs1)` $\rightarrow$ $Memory[rs1 + offset] = rs2$

    - Examples: `sd`, `sw`, `sh`, `sb`.

### 3. Control Transfer (Branches and Jumps)

RISC-V does not utilize architecturally visible delay slots. All targets are PC-relative (Target Address = PC + offset).

- **Conditional Branches (B-Type):** Compare two registers.

    - Examples: `beq` (equal), `bne` (not equal), `blt` (less than), `bge` (greater/equal).

- **Unconditional Jumps (J-Type / I-Type):**

    - `jal` (Jump and Link): J-Type. Jumps to a PC-relative target and saves the return address (PC + 4) in the destination register (usually `x1`).

    - `jalr` (Jump and Link Register): I-Type. Jumps to an address calculated by `rs1 + immediate`, saving the return address in `rd`.

## V. Compilation and Assembly Techniques

### Compiling Arrays and Loops

When iterating through an array, the index must be scaled by the byte-size of the data type.

- For an array of doublewords (8 bytes), an index $i$ must be multiplied by 8 (achieved efficiently via `slli reg, reg, 3` because $2^3 = 8$) to calculate the correct memory offset.

### Bounds Check Shortcut

To check if an array index is out of bounds ($i \ge length$ OR $i < 0$), you can use a single **unsigned** branch instruction:

- `bgeu x20, x11, IndexOutOfBounds`

- _Why it works:_ In two's complement, negative numbers appear as extremely large positive numbers when evaluated as unsigned. Therefore, `bgeu` catches both the greater-than condition and the negative condition simultaneously.

### Handling Far Branches

Because branch instructions (B-type) only have a 12-bit immediate field for the offset, they cannot jump to extremely distant memory addresses.

- **Solution:** The assembler will automatically invert the branch condition to skip a jump instruction, and insert an unconditional jump (`jal` - which has a larger 20-bit range) to reach the far target.

- _Example:_ `beq x10, x0, L1` (where L1 is too far) becomes:

    ```riscv
    bne x10, x0, L2  // Skip the jump if NOT equal
    jal x0, L1       // Jump to the far target
    L2:              // Continue execution
    ```

## VI. Advanced Control Flow

### 1. Compiling `switch` / `case` Statements

Instead of using a long chain of `if-else` (conditional branches) for a `switch` statement, compilers often optimize this using a **Jump Address Table** (an array of memory addresses corresponding to different `case` blocks).

- **Mechanism:**

    1. Check bounds: Ensure the `switch` variable $k$ is within the valid range (e.g., $0 \le k < 4$). If not, branch to the exit.

    2. Calculate memory offset: Multiply $k$ by 8 (using a left shift `slli reg, k, 3`) because memory addresses in a 64-bit architecture are 8 bytes long.

    3. Add the offset to the base address of the Jump Table.

    4. Load the target address from memory (`ld`).

    5. Execute an unconditional jump to that loaded address using `jalr` (Jump and Link Register).

- **NOP Instruction:** A "No Operation" instruction does nothing but advance the PC. In RISC-V, this is implemented as a pseudo-instruction: `addi x0, x0, 0`.

## VII. Decoding Machine Language & Addressing Modes

### 1. Decoding Example

Translating a 32-bit machine instruction (e.g., `0x00578833`) back to assembly:

1. Convert Hex to Binary: `0000 0000 0101 0111 1000 1000 0011 0011`

2. Look at the lowest 7 bits (opcode: `0110011`). This identifies it as an **R-type** arithmetic instruction.

3. Parse the remaining fields based on the R-type format:

    - `funct7` (0000000) & `funct3` (000) $\rightarrow$ indicates the `add` instruction.

    - `rs2` = 00101 (Register `x5`)

    - `rs1` = 01111 (Register `x15`)

    - `rd` = 10000 (Register `x16`)

4. Assembly Result: `add x16, x15, x5`

### 2. Immediate Encoding Variants

RISC-V shuffles the bits of immediate values depending on the instruction format (S-type, B-type, U-type, J-type).

- **Goal:** To simplify hardware decoding. By shuffling bits, the hardware can keep the **sign bit** always located at the highest bit position (`inst[31]`) and maximize the physical overlap of immediate bits across different formats.

- _Note:_ Branch (B) and Jump (J) immediates are implicitly shifted left by 1 (since instructions are aligned on halfword/word boundaries, the lowest bit is always 0).

### 3. RISC-V Addressing Modes Summary

1. **Immediate Addressing:** The operand is a constant located directly inside the instruction itself.

2. **Register Addressing:** The operand is the data contained within a specified register.

3. **Base (Displacement) Addressing:** The memory address is calculated by adding a constant immediate (offset) to the value in a base register. (Used for loads/stores).

4. **PC-Relative Addressing:** The address is calculated by adding a constant immediate to the Program Counter (PC). (Used for branches and jumps).

## VIII. Privileged ISA and Software Stack

### 1. Privilege Modes

RISC-V defines different levels of privilege to safely isolate system components. Processors spend most of their time in the lowest privilege mode, using interrupts/exceptions to transfer control to higher modes.

- **Level 3 - Machine Mode (M):** The highest privilege level. It has absolute access to hardware. This is the _only_ strictly mandatory mode in a RISC-V implementation.

- **Level 1 - Supervisor Mode (S):** Used by Operating Systems (like Linux).

- **Level 0 - User/Application Mode (U):** The lowest privilege level, used for standard application software.

### 2. Software Interface Stack

- Applications communicate with the OS via the **ABI** (Application Binary Interface).

- The OS communicates with the execution environment (or hypervisor) via the **SBI** (Supervisor Binary Interface).

## IX. Function Calls and Procedure Conventions

When a **Caller** (e.g., `main()`) invokes a **Callee** (e.g., `sum()`), the system must follow a strict 6-step convention:

1. Put arguments where the Callee can access them.

2. Jump to the Callee.

3. Acquire local storage resources (save existing register values).

4. Perform the function's calculations.

5. Place the result where the Caller expects it, and restore any saved registers.

6. Return control to the origin point in the Caller.

### 1. Procedure Call Instructions

- **Call (`jal x1, Target`):** Jumps to the target address and saves the address of the _next_ instruction (`PC + 4`) into the return address register (`x1` / `ra`).

- **Return (`jalr x0, 0(x1)`):** Jumps to the address stored in `x1`. It writes its own return address to `x0` (which is hardwired to zero, effectively discarding it).

### 2. Register Conventions (The Contract)

RISC-V utilizes 32 registers (`x0-x31`), each with specific ABI roles during function calls:

- **`x10 - x17` (Argument/Result Registers):** Used to pass parameters and return values.

- **`x1` (`ra`):** Return address register.

- **`x2` (`sp`):** Stack pointer register.

- **`x8 - x9, x18 - x27` (Saved Registers):** **Callee-saved.** If the Callee wants to use these, it _must_ save their original values to the stack first and restore them before returning. The Caller expects these to remain unchanged across a call.

- **`x5 - x7, x28 - x31` (Temporary Registers):** **Caller-saved.** The Callee can use and overwrite these freely. If the Caller needs the data in these registers to survive the function call, the _Caller_ must save them before invoking the procedure.

### 3. Stack Management

The Stack is the ideal data structure for "spilling" registers (saving data when you run out of registers).

- **Direction:** The stack grows from **Higher Addresses to Lower Addresses**.

- **Push (Allocate):** Subtract from the stack pointer (e.g., `addi sp, sp, -24`).

- **Pop (Deallocate):** Add to the stack pointer (e.g., `addi sp, sp, 24`).

### 4. Anatomy of a Procedure

- **Prologue:** The start of the function. Allocates space on the stack (`sp = sp - framesize`) and saves necessary registers (like `ra` and any Saved Registers).

- **Body:** The actual computation.

- **Epilogue:** The end of the function. Restores saved registers from the stack, de-allocates the stack frame (`sp = sp + framesize`), and returns (`ret`).

### 5. Leaf vs. Non-Leaf Procedures

- **Leaf Procedure:** A function that does _not_ call any other functions.

- **Non-Leaf Procedure:** A function that calls other functions (e.g., Nested calls or Recursion).

    - _Crucial Rule:_ A non-leaf procedure **must** save its own return address (`x1` / `ra`) to the stack before calling the inner function; otherwise, the inner function call will overwrite `x1`, and the program will be unable to return to the original Caller.

- **Recursion Disadvantages:** Recursive functions require heavy use of the stack (frequent pushes and pops). This is memory inefficient and can lead to a Stack Overflow. Where possible, iteration (loops) or tail-call optimization is preferred.

## X. Memory Layout and the Stack Frame

A typical program's memory space is organized into specific segments:

1. **Text Segment:** Holds the compiled program code (machine instructions).

2. **Static Data:** Holds global variables and constants. The **Global Pointer (`gp` / `x3`)** is initialized to point to the middle of this segment for fast access.

3. **Dynamic Data (Heap):** Used for dynamically allocated memory (e.g., `malloc` in C, `new` in Java). It grows _upward_ toward higher addresses.

4. **Stack:** Used for automatic storage (local variables, procedure frames). It grows _downward_ toward lower addresses.

### The Stack Frame and Frame Pointer (`fp`)

When a procedure is called, it allocates a private block of memory on the stack called a **Procedure Frame** (or Activation Record). This holds saved registers, local arrays, and variables that don't fit in registers.

- **Frame Pointer (`fp` / `x8`):** While the Stack Pointer (`sp`) points to the bottom (lowest address) of the current frame and might move dynamically as data is pushed/popped, the Frame Pointer points to the **top** (base/highest address) of the current frame.

- **Purpose:** The `fp` provides a stable, unchanging base address to reference local variables and parameters throughout the lifecycle of the function call.
