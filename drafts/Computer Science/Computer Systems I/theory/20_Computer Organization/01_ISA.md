# 01_ISA

## I. Overview of Instruction Set Architecture (ISA)

- **Definition:** The ISA is the contract and interface between software and hardware. It defines the physical hardware controlled by instructions and represents the programmer-visible machine interface (e.g., instruction set, registers, memory organization, and interrupt handling).

- **System Abstraction Stack:**

    - **Software:** Application $\rightarrow$ Compiler / Libraries $\rightarrow$ Operating System (OS)

    - **Interface:** **Instruction Set Architecture (ISA)**

    - **Hardware:** Computer Organization (Microarchitecture) $\rightarrow$ Register Transfer Level (RTL) $\rightarrow$ Digital Logic Circuit $\rightarrow$ Device Technology

- **ISA vs. Microarchitecture:** * The ISA specifies the microprocessor design (e.g., the x86 family).

    - The microarchitecture ($\mu$-architecture) is the actual hardware realization. Multiple microarchitectures can implement the same ISA (e.g., Xeon and Celeron use the same ISA but different hardware designs).

- **Machine State:** The ISA specifies how the computer changes state. The machine state includes the Program Counter (PC), memory, and register states, which transition from a "Before State" to an "After State" upon executing an instruction.

## II. What is an Instruction?

- **Basic Structure:** `Instruction = Opcode + Operands`

- **Four Elements of an Instruction:**

    1. **Operation Code (Opcode):** Specifies the action to be performed ("Do this").

    2. **Source Operand Reference(s):** The input data for the operation.

    3. **Result Operand Reference(s):** Where to store the computed answer.

    4. **Next Instruction Reference:** Where to fetch the next instruction (usually handled implicitly by the Program Counter).

- **Operand Locations:** Operands can be located in main memory, CPU registers, I/O devices, or contained within the instruction itself (immediate values).

- **Instruction Set / Machine Code:** The complete collection of instructions understood by a CPU. It is ultimately represented in binary machine code (object code), typically written as assembly code by human programmers.

## III. ISA Design Principles

According to Hennessy and Patterson, a well-designed ISA follows four underlying principles:

1. **Simplicity favors regularity:** Using fixed instruction sizes, formats, and fixed placement of operands eases hardware implementation.

2. **Make the common case fast:** Favor registers over memory (fewer bits to read/write, faster access).

3. **Smaller is faster:** Small constants are common, so providing small immediate fields within instructions is efficient.

4. **Good design demands good compromises:** For example, keeping instruction lengths regular but allowing special formats for important exceptions (like a jump far away that requires a larger constant).

- **Design Tradeoffs:** * _More Operands:_ More complex/powerful instructions, but requires longer instruction words. Fewer instructions needed per program.

    - _Fewer Operands:_ Less complex instructions, faster fetch/execution, but requires more instructions to complete a task.

    - _More Registers:_ Inter-register operations are much faster than memory accesses.

## IV. Instruction Formats (Number of Operands)

The number of operands significantly impacts CPU complexity and word size.

- **Three-Operand Instructions:** (e.g., `SUB R1, A, B` meaning $R1 = A - B$)

    - _Pros:_ Highly flexible. It does not overwrite the original source data.

- **Two-Operand Instructions:** (e.g., `SUB A, B` meaning $A = A - B$)

    - _Cons:_ The first operand acts as both a source and the default destination, **overwriting** the old data. If the original data is needed later, extra `MOV` instructions are required to copy the data first.

- **One-Operand Instructions:** (e.g., `ADD C`)

    - _Characteristics:_ Relies on an implicit register called the **Accumulator (ACC)**. The operation automatically uses the ACC and stores the result back into the ACC (e.g., $ACC = ACC + C$).

    - _Pros:_ Simplifies CPU design.

- **Zero-Operand Instructions:** (e.g., `PUSH A`, `ADD`)

    - _Characteristics:_ Uses a **Stack** (LIFO: Last In, First Out memory structure). Instructions do not specify operands; they automatically operate on the top values of the stack and push the result back on top.

## V. Addressing Modes

Addressing modes specify how to calculate the **effective address** of an operand (whether it is a constant, a register, or a dynamic memory location).

|**Addressing Mode**|**Syntax**|**Meaning / Mechanism**|
|---|---|---|
|**Immediate**|`#K`|The operand is directly contained in the instruction. (Value is known at assembly time).|
|**Direct**|`K`|The instruction contains the memory address of the data (`M[K]`). Downside: Address space is limited by instruction length.|
|**Indirect**|`(K)`|The instruction contains an address, which points to _another_ address containing the actual data (`M[M[K]]`). Upside: Full address space access; Downside: Needs extra memory access.|
|**Register Direct**|`(Rn)`|The operand is the data inside the register (`M[Rn]`). Fast, but limited by register count.|
|**Register Indirect**|`[Rn]`|The register holds the memory address of the data.|
|**Indexed**|`(Rm + Rn)`|Uses an index register + offset to determine the effective address (`M[Rm + Rn]`). Great for traversing arrays.|
|**Relative**|_(PC offset)_|Uses the Program Counter (PC) as a base, adding an offset to find the address.|
|**Based**|`(Rm + X)`|Uses a base register plus a displacement value (`M[Rm + X]`).|

### Addressing Example Calculation

_(Based on the memory map from the final slide, Assuming we execute a Load instruction for `800`, and Register `R1 = 800`)_

- **Memory State Reference:** Address `800` contains `900`; Address `900` contains `1000`; Address `1000` contains `500`; Address `1600` contains `700`.

|**Mode**|**Instruction executed**|**Value Loaded into Accumulator**|**Explanation**|
|---|---|---|---|
|**Immediate**|`Load 800`|**800**|The value `800` is loaded directly.|
|**Direct**|`Load 800`|**900**|Fetches the data at memory address `800`.|
|**Indirect**|`Load 800`|**1000**|Fetches the address at `800` (which is `900`), then fetches the data at memory address `900`.|
|**Indexed**|`Load R1[800]`|**700**|Base `800` + Register `R1` (800) = Address `1600`. Fetches data at memory address `1600`.|

## VI. Types of Operations and Encodings

### 1. Typical ISA Operations

Instruction sets generally support several standard categories of operations, which have remained largely consistent since the 1960s:

- **Data Transfer (Movement):** `MOV`, `LOAD`, `STORE`, `PUSH`, `POP` (moves data between memory, registers, or I/O devices).

- **Arithmetic and Logic:** `ADD`, `SUB`, `MUL`, `DIV` (Integer or Floating Point); `AND`, `OR`, `NOT`.

- **Shift:** Shift left/right, rotate left/right.

- **Control (Jump/Branch):** Unconditional and conditional jumps, used to alter the execution flow (`BRANCH`, `JMP`).

- **Subroutine Linkage:** `CALL`, `RET` (Return).

- **System / Interrupt:** `HALT`, `INTERRUPT`, `TRAP`.

- **Synchronization:** Atomic read-modify-write operations (e.g., test & set).

- **String & Graphics:** specialized operations like parallel subword operations (MMX).

### 2. Types of Instruction Encodings

How instructions are represented in binary affects both program size and CPU performance.

- **Variable Length:** Instructions have different bit lengths based on their complexity.

    - _Pros:_ Maximizes code density (best if code size is the most important factor).

- **Fixed Length:** All instructions have the exact same bit length (e.g., 32 bits).

    - _Pros:_ Simplifies decoding and pipelining (best if execution performance is most important).

- **Hybrid / Recent Trends:**

    - Modern embedded systems (where code size is critical) often use hybrid approaches. For example, ARM and MIPS added optional modes to execute a subset of 16-bit wide instructions (e.g., ARM Thumb, MIPS16) to improve density without sacrificing too much performance.

    - Some architectures explore on-the-fly decompression for maximum density.

## VII. Evolution of Instruction Sets: CISC vs. RISC

The evolution of ISAs transitioned from single accumulator machines (1950s) to General Purpose Register machines, eventually splitting into two primary design philosophies:

### 1. CISC (Complex Instruction Set Computers)

- **Philosophy:** Close the "semantic gap" between high-level programming languages and machine execution by providing highly complex, powerful instructions.

- **Characteristics:**

    - Variable-length instructions with long, complex decoding logic.

    - Abundant instructions and complex addressing modes.

    - Allows memory-to-memory operations directly within instructions.

    - Utilizes a microcode engine (another state machine inside the CPU) to execute complex instructions.

- **Pros:** Smaller code size (historically important when memory was highly expensive); simplifies compiler design.

- **Examples:** x86, DEC VAX, IBM 360, Motorola 68030.

### 2. RISC (Reduced Instruction Set Computers)

- **Observation:** Researchers at IBM and Berkeley noticed the "n+1" phenomenon: adding complex instructions slowed down the decoding logic for the _entire_ ISA, yet compilers rarely used those complex instructions.

- **Characteristics (A Typical RISC):**

    - Smaller number of simple instructions.

    - Fixed format instruction (e.g., 32 bits) for simple decoding.

    - **Load-Store Architecture:** Only `LOAD` and `STORE` instructions access memory; all arithmetic is performed register-to-register (3-address format).

    - Simple addressing modes (e.g., Base + displacement) and no indirection.

    - Hardwired control logic (no microcode), enabling single-cycle execution.

- **Pros:** Highly optimized for pipelining and fast clock speeds.

- **Cons:** Requires more compiler effort to reorder instructions and manage registers; larger code size.

- **Examples:** MIPS, ARM, Sun SPARC, IBM POWER.

### 3. The Modern Convergence (CISC Outfit + RISC Inside)

The CISC vs. RISC classification is no longer a strict dichotomy. Modern effective processor design combines CISC experiences with RISC tenets.

- **Modern x86 (Intel/AMD):** Externally presents a CISC instruction set, but internally, complex x86 instructions are dynamically decoded into simple "micro-ops" (RISC-ops) on the fly. The internal microarchitecture utilizes RISC design philosophies (superscalar, dynamic scheduling).

## VIII. Classification of ISAs (Operand Storage Architectures)

ISAs can be classified based on where ALU (Arithmetic Logic Unit) operands are stored and how they are addressed.

### 1. Stack Architectures (0-Address)

- **Mechanism:** First-In Last-Out (FILO) data structure. The ALU implicitly operates on the top of the stack (TOS). No operands are specified in ALU operations.

- **Pros:** Very short instructions; extremely good code density; easy to write a simple compiler.

- **Cons:** The stack becomes a bottleneck; highly inefficient code execution; extremely difficult to pipeline or execute in parallel; data is not always at the top (requires extra `SWAP` instructions).

- **Example:** Java VM, early Burroughs machines.

### 2. Accumulator Architectures (1-Address)

- **Mechanism:** Uses a single implicit register (the Accumulator). One operand is explicit (in memory), the other is implicitly the Accumulator. ($Acc = Acc + Mem$)

- **Pros:** Very low hardware requirements; short instructions; easy to design.

- **Cons:** The Accumulator becomes a massive bottleneck; little ability for parallelism; very high memory traffic due to constant loading and storing.

- **Example:** Early machines, DSP architectures.

### 3. Memory-Memory Architectures (2 or 3-Address)

- **Mechanism:** All ALU operands are fetched directly from memory addresses.

- **Pros:** No wasted registers; requires the lowest total instruction count.

- **Cons:** Huge memory traffic; large variations in instruction lengths and clock cycles per instruction; extremely difficult to pipeline.

- **Example:** VAX.

### 4. Register-Memory Architectures (2-Address)

- **Mechanism:** One operand can be a memory address, the other is a register. Typically uses a 2-operand format where the result overwrites one source.

- **Pros:** Good code density; some data can be accessed without explicit load instructions.

- **Cons:** Operands are not equivalent (poor orthogonality); the result destroys a source operand; variable clock cycles make pipelining harder.

- **Example:** IBM 360/370, x86.

### 5. Register-Register / Load-Store Architectures (3-Address)

- **Mechanism:** No memory addresses are allowed in ALU operations. ALU only interacts with registers. Explicit `LOAD` and `STORE` instructions move data between memory and registers.

- **Pros:** Simple, fixed-length instruction encodings; instructions take a similar number of cycles, making it extremely easy to pipeline and build superscalar processors.

- **Cons:** Higher instruction count; heavy reliance on a smart compiler for register allocation.

- **Note:** Every ISA designed after 1980 uses a load-store ISA to simplify CPU design.

## IX. More About General Purpose Registers (GPRs)

Almost all modern architectures rely heavily on General Purpose Registers.

- **Advantages of Registers:**

    - **Speed:** Registers are significantly faster than cache or main memory (no addressing modes or tags required). When memory isn't ready, the processor must stall.

    - **Determinism:** Register access times are fixed and deterministic (no cache misses).

    - **Compact Code:** Register identifiers are very short (typically 3 to 8 bits), leading to denser code compared to specifying full memory addresses.

    - **Reduced Traffic:** Utilizing registers heavily reduces the traffic on the memory bus.

- **Disadvantages of Registers:**

    - Must be saved and restored to memory during procedure calls and context switches.

    - You cannot take the memory address of a register (problematic for pointers).

    - Fixed size (cannot efficiently store dynamic strings or structures).

    - Limited in number; the compiler must meticulously manage their allocation.
