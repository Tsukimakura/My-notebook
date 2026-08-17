# Basic Principles

## 1. Computer Architecture Overview

**Computer Architecture Hierarchy:**

The design of a computer system is layered. The Instruction Set Architecture (ISA) serves as the crucial interface between software and hardware.

- Problem $\rightarrow$ Algorithm $\rightarrow$ Program $\rightarrow$ Runtime System (VM, OS, MM) $\rightarrow$ **ISA (Architecture)** $\rightarrow$ Microarchitecture $\rightarrow$ Logic $\rightarrow$ Circuits $\rightarrow$ Electrons.
    

**Von Neumann Structure:**

- **Core Principle:** Both data and programs (instructions) are stored in memory. The CPU fetches instructions and data from memory, performs operations, and writes results back to memory.
    
- **Main Components:** * Input / Output
    
    - Memory
        
    - **CPU:** Consists of the **Datapath** (Multiplexors, ALU, Registers) and the **Control Unit**.
        

## 2. Inside the Processor (CPU)

The CPU is primarily divided into three functional areas:

1. **Datapath:** Performs actual arithmetic and logical operations on data.
    
2. **Control Unit:** Sequences and commands the datapath, memory, and I/O devices based on the program's instructions.
    
3. **Cache Memory:** Small, fast SRAM memory built into the processor for immediate access to frequently used data.
    

## 3. CPU Design Methodology & Problem Solving

**Design Methodologies:**

- **Methodology 1: Finite State Machine (FSM)** * Inputs pass through combinational circuits for output processing and status transmission, integrating with state storage to form a closed-loop digital system.
    
- **Methodology 2: Control of Register Transfers (RTL)**
    
    - Relies on **Register Transfer Language (RTL)**.
        
    - Three essential elements:
        
        1. **Set of registers:** Primarily in the datapath, with some in the control unit.
            
        2. **Basic operations (micromanipulation):** The actual register transfers performed.
            
        3. **Control:** Supervises the sequencing of these register transfers.
            
- **Methodology 3: Program State Machine (PSM)**
    
    - General system architecture where memory interacts with the Control Unit (control signals/inputs) and Datapath (data inputs/outputs).
        

**Specific vs. General Systems:**

- **Specific System (Non-programmable):** The control unit relies solely on inputs and datapath status bits to sequence register transfers. It does not fetch or execute instructions.
    
- **General System (Programmable):** Uses a **program** (a sequence of instructions stored in memory). A **Program Counter (PC)** addresses the memory, and the Control Unit fetches and executes these instructions. The CPU is fundamentally a general digital system (A Turing Machine) implemented via Register Transmission Control Technology.
    

## 4. Hardware Implementation Details

### A. The ALU (Arithmetic Logic Unit)

Performs core computations. Standard operations include:

- `000`: AND
    
- `001`: OR
    
- `010`: ADD
    
- `110`: SUB
    
- `111`: SLT (Set on Less Than: _If A < B, Result = 1; else Result = 0_)
    

### B. Memory Elements

- **Instruction Memory:** Designed as read-only. Input is the instruction address; output is the instruction itself.
    
- **Data Memory:** Supports read and write, controlled by `MemRead` and `MemWrite` signals.
    

### C. Registers & The Register File

- **Registers:** State elements controlled by a `Write` signal. If `Write = 0`, the output holds its state. If `Write = 1`, the output updates to the data input value at the effective clock edge.
    
- **Register File Architecture:**
    
    - Built using D flip-flops. Typically consists of 32 registers, each 64 bits wide.
        
    - **Inputs:** Two 5-bit read register numbers, one 5-bit write register number, and 64-bit write data.
        
    - **Outputs:** Two 64-bit data outputs (Read data 1 & 2).
        
    - **Read Operation:** Combinational logic. Output updates immediately based on the requested address.
        
    - **Write Operation:** Sequential logic. Written to the designated register on the clock edge when `RegWrite` is asserted.
        

### D. Immediate Generation Unit

Responsible for extracting immediate values from instructions and sign-extending them to 64 bits. It adjusts output based on instruction type:

- **I-Type (Load/ALU imm):** Sign-extends `instr[31:20]`. (`ImmSel = 00`)
    
- **S-Type (Store):** Extracts and sign-extends `instr[31:25]` and `instr[11:7]`. (`ImmSel = 01`)
    
- **B-Type (Branch):** Extracts offset, shifts left (adds a `0` at the LSB), and sign-extends. (`ImmSel = 10`)
    
- **J-Type (Jump - jal):** Extracts 20-bit offset, shifts left, and sign-extends. (`ImmSel = 11`)
    

## 5. Logic Design & Clocking Conventions

- **Binary Encoding:** Low voltage = 0, High voltage = 1. Multi-bit data is transmitted on multi-wire buses.
    
- **Element Types:**
    
    - _Combinational Elements:_ Operate on data; output is purely a function of current inputs (no memory).
        
    - _State (Sequential) Elements:_ Store information (e.g., registers).
        
- **Clocking Methodology:** * Uses **edge-triggered methodology**.
    
    - _Typical Execution Cycle:_ Read contents of state elements $\rightarrow$ Send values through combinational logic $\rightarrow$ Write results to state element(s) at the next clock cycle edge.


# Design and Datapath Implementation

## 1. Instruction Execution Overview

The CPU implementation focuses on a simplified RISC-V architecture encompassing three main instruction classes: memory-reference (e.g., `lw`, `sw`), arithmetic-logical (e.g., `add`, `sub`, `and`, `or`, `slt`), and control flow/branches (e.g., `beq`, `jal`). The execution of these instructions generally follows a standard sequence of steps:

- **Step 1: Instruction Fetch (IF):** The instruction is fetched from the Instruction Memory using the current Program Counter (PC) address. Simultaneously, the PC is incremented to point to the next sequential instruction (PC + 4).
    
- **Step 2: Instruction Decode & Read Operands (ID):** The instruction is translated into machine control commands. The source register operands (`rs1`, `rs2`) are read from the Register File simultaneously, regardless of whether the specific instruction type uses both of them.
    
- **Step 3: Executive Control / ALU Operation (EX):** The Arithmetic Logic Unit (ALU) performs calculations based on the instruction class: calculating arithmetic results, computing memory addresses for load/store, or performing comparisons for branches.
    
- **Step 4: Memory Access (MEM):** Data is read from or written to the Data Memory. This step is exclusively utilized by load (`ld`/`lw`) and store (`sd`/`sw`) instructions.
    
- **Step 5: Write Results / Write Back (WB):** The final result is written back to the destination register (`rd`). For R-type and I-type (arithmetic) instructions, this is the ALU output; for Load instructions, this is the data fetched from memory.
    

## 2. RISC-V Instruction Format and Datapath Routing

A key design principle in RISC-V is keeping instruction fields consistent across different formats to simplify the datapath hardware.

- **Control Signals:** The `opcode`, `funct3`, and `funct7` fields are routed directly to the Control Unit to generate necessary datapath control signals (e.g., ALU operation, read/write enables).
    
- **Register Routing:** To minimize multiplexing, register fields are statically mapped to the Register File inputs.
    
    - The destination register `rd` (bits 11-7) is always routed to the Write Register Address port.
        
    - Source register `rs1` (bits 19-15) and `rs2` (bits 24-20) are always routed to Read Register Address 1 and 2, respectively.
        
- **Immediate Generation:** The remaining bits are routed to the Immediate Generation unit (ImmGen) to construct a 64-bit sign-extended immediate value based on the specific instruction type.
    

## 3. Incremental Datapath Construction

The complete datapath is built incrementally by adding necessary components and data routing for each instruction class.

### A. The Instruction Fetch Unit

- **Function:** Retrieves the instruction and updates the PC.
    
- **Components:** Program Counter (PC), Instruction Memory, and a dedicated Adder.
    
- **Routing:** The PC value serves as the read address for the Instruction Memory. The PC output also routes to the Adder, which adds the constant 4 (since RISC-V instructions are 4 bytes long and memory is byte-addressed). The Adder's output (PC + 4) is routed back to update the PC at the end of the cycle.
    

### B. R-Type Datapath (Arithmetic/Logical)

- **Function:** Performs operations on data stored in two source registers and writes the result to a destination register.
    
- **Data Stream:**
    
    1. Read addresses `rs1` and `rs2` fetch `Read data 1` and `Read data 2` from the Register File.
        
    2. Both data outputs route directly to the ALU.
        
    3. The ALU performs the operation specified by the control signals.
        
    4. The ALU result routes back to the `Write data` port of the Register File, writing to the address specified by `rd` (controlled by the `RegWrite` signal).
        

### C. I-Type Datapath (Load & Arithmetic Immediate)

- **Function:** Performs operations using one source register and a sign-extended immediate value.
    
- **Modifications required:**
    
    - **ALU Input MUX:** A multiplexer must be added at the second ALU input to select between `Read data 2` (for R-type) and the output of the ImmGen unit (for I-type and others).
        
- **Load Instruction (`ld`, `lw`) Specific Routing:**
    
    1. The ALU calculates the memory address by adding `Read data 1` (base address) and the sign-extended offset (immediate).
        
    2. The ALU output routes to the Address port of the Data Memory.
        
    3. **Write Back MUX:** A multiplexer must be added before the Register File's `Write data` port. It selects between the ALU result (for arithmetic instructions) and the Data Memory read output (for Load instructions).
        

### D. S-Type Datapath (Store)

- **Function:** Stores a value from a register into memory.
    
- **Data Stream:**
    
    1. `rs1` specifies the base address, and the ImmGen provides the offset. The ALU adds them to calculate the target memory address.
        
    2. `rs2` specifies the register containing the data to be stored. The `Read data 2` output from the Register File routes directly to the `Write data` port of the Data Memory.
        
    3. The Data Memory executes the write operation (controlled by the `MemWrite` signal). No register write-back occurs.
        

### E. SB-Type Datapath (Branch - e.g., `beq`)

- **Function:** Compares two registers and alters the PC if the condition is met.
    
- **Data Stream:**
    
    1. `Read data 1` and `Read data 2` route to the ALU. The ALU performs a subtraction to compare the values.
        
    2. The ALU sets its `Zero` output flag if the subtraction result is zero (indicating operands are equal).
        
    3. **Target Address Calculation:** A separate dedicated Adder computes the branch target address by adding the current PC value to the sign-extended immediate value (which is shifted left by 1 to align with halfword boundaries).
        
    4. **PC Update MUX:** A multiplexer is placed before the PC input. It is controlled by an AND gate that combines the control unit's `Branch` signal with the ALU's `Zero` flag. If both are true, the MUX selects the branch target address; otherwise, it defaults to the PC + 4 path.

## 6. Completing the Full Datapath

To integrate all instruction types into a single-cycle datapath, specific design rules must be followed:

- **Single-Cycle Constraint:** Each datapath element can only perform one function at a time per clock cycle.
    
- **Separation of Memory:** Because a load instruction requires reading an instruction and reading data in the same cycle, the system must utilize separate Instruction and Data memories.
    
- **Resource Sharing:** Multiplexers are strategically placed wherever an input port needs to receive data from multiple alternate sources depending on the instruction type.
    

### Adding the UJ-Type Datapath (`jal`)

The Jump and Link (`jal`) instruction introduces new routing requirements:

1. **Return Address:** It must save the address of the next sequential instruction (`PC + 4`) into the destination register (`rd`). This requires expanding the multiplexer before the Register File's `Write data` port to accept `PC + 4` as a source.
    
2. **Target Calculation:** It calculates the target jump address by adding the current `PC` to a 20-bit sign-extended immediate offset (shifted left by 1). A multiplexer before the PC determines whether to route `PC + 4` or the newly calculated jump target.
    

## 7. The Controller Design

The CPU requires control signals to manage multiplexer routing, memory access, and ALU operations. To manage complexity, the control unit is designed using a **2-level decoder scheme**.

### A. The First Level: Main Control Unit

- **Input:** The 7-bit `opcode` from the instruction.
    
- **Outputs:** Generates 7 primary data routing and operational signals, plus a 2-bit preliminary `ALUOp` signal.
    
- **Core Control Signals & Effects:**
    
    - `RegWrite`: Asserts (1) to write data into the destination register.
        
    - `ALUSrc`: Selects the second ALU operand. `0` = Register file (`Read data 2`), `1` = Sign-extended immediate.
        
    - `Branch`: Asserts (1) for branch instructions. Combined with the ALU's `Zero` output via an AND gate to trigger a PC update to the branch target.
        
    - `Jump`: Asserts (1) to force the PC to update to the computed jump address.
        
    - `MemRead` / `MemWrite`: Asserts (1) to read from or write to Data Memory, respectively.
        
    - `MemtoReg`: Selects the value fed back to the register file. `0` = ALU output, `1` = Data Memory output, `2` (if expanded) = `PC + 4`.
        

### B. The Second Level: ALU Control Unit

- **Inputs:** The 2-bit `ALUOp` (from the Main Controller) and the `funct7` and `funct3` fields from the instruction.
    
- **Output:** A 4-bit `ALU control` signal that dictates the specific arithmetic or logical operation.
    
- **ALUOp Encoding Strategy:**
    
    - `00` (Load/Store): Instructs the ALU to add the base address and offset.
        
    - `01` (Branch): Instructs the ALU to subtract operands to check for equality (`Zero` flag).
        
    - `10` (R-type): Instructs the ALU decoder to look at the `funct3` and `funct7` fields to determine the exact operation (ADD, SUB, AND, OR, SLT, etc.).
        

## 8. Single-Cycle Implementation Performance

In a single-cycle datapath, every instruction must fetch, decode, and execute completely within one clock tick.

### A. Critical Path Analysis

The length of the clock cycle is strictly determined by the path of the slowest instruction (the critical path) to ensure all data has time to settle.

- Assuming standard component delays (Memory: 200ps, ALU/Adders: 200ps, Register File: 100ps), the Load instruction (`ld`/`lw`) takes the longest.
    
- **Load Execution Time:** Instruction Fetch (200ps) + Register Read (100ps) + ALU computation (200ps) + Data Memory Read (200ps) + Register Write (100ps) = **800ps**.
    
- Therefore, the global clock cycle must be set to 800ps.
    

### B. Performance Issues

While simple to understand, the single-cycle design suffers from significant inefficiencies:

1. **Waste of Time (Inefficiency):** Instructions that complete faster (e.g., a branch taking only 500ps) must sit idle, wasting the remaining 300ps of the 800ps cycle.
    
2. **Waste of Area:** Because components cannot be used more than once per cycle, hardware must be duplicated. For example, separate adders are required for calculating `PC + 4` and branch targets alongside the main ALU.
    
3. **Violates Design Principles:** It violates the core computer architecture principle of "Making the common case fast." If 80% of instructions are fast ALU operations, forcing them to run at the speed of the slowest memory operation degrades overall system performance.
    

These severe inefficiencies motivate the need for advanced architectural implementations like **Pipelining** or Multi-cycle designs.

---

# Performance

## 1. Defining Computer Performance

Assessing computer performance depends heavily on the specific context and the user's goals, much like evaluating an airplane based on passenger capacity versus cruising speed. Performance is generally evaluated using two primary metrics:

- **Latency (Response / Execution Time):** The total time between the start and completion of an event (how long a single task takes). Single users on a PC typically aim to minimize response time.
    
- **Throughput (Bandwidth):** The total amount of work completed in a given period (e.g., tasks or transactions per hour). Datacenters and servers processing large amounts of data aim to maximize throughput.
    

**The Performance Ratio:**

Performance is strictly defined as the inverse of execution time.

$$Performance = \frac{1}{Execution Time}$$

To state that "Computer X is $n$ times faster than Computer Y", use the following ratio:

$$\frac{Performance_X}{Performance_Y} = \frac{Execution Time_Y}{Execution Time_X} = n$$

## 2. Measuring Execution Time

When measuring time to gauge performance, we must distinguish between total system time and processor-specific time.

- **Elapsed Time (Wall-clock Time):** The total response time including all system aspects (processing, I/O, OS overhead, and idle time).
    
- **CPU Time:** The actual time the CPU spends computing for a specific task, discounting I/O and time spent on other jobs. It is subdivided into **User CPU Time** (time spent running the program itself) and **System CPU Time** (time the OS spends performing tasks on behalf of the program).
    

**CPU Clocking Basics:**

Digital hardware is governed by a constant-rate clock.

- **Clock Period:** The duration of a single clock cycle (e.g., 250ps = $250 \times 10^{-12}$s).
    
- **Clock Rate (Frequency):** The inverse of the clock period, measured in cycles per second (e.g., 4.0GHz = $4.0 \times 10^9$ Hz).
    

$$CPU Execution Time = CPU Clock Cycles \times Clock Period = \frac{CPU Clock Cycles}{Clock Rate}$$

## 3. The Classic CPU Performance Equation

To accurately determine CPU performance, we must break execution time down into three fundamental components:

1. **Instruction Count (IC):** The total number of instructions executed for a program.
    
2. **Clock Cycles per Instruction (CPI):** The average number of clock cycles it takes to execute one instruction.
    
3. **Clock Cycle Time (or Clock Rate):** The length of one clock cycle.
    

**The "Big Picture" Formula:**

$$CPU Time = Instruction Count \times CPI \times Clock Cycle Time = \frac{Instruction Count \times CPI}{Clock Rate}$$

Because different instruction types (e.g., Load, Store, ALU) often require varying numbers of clock cycles, the overall CPI must be calculated as a weighted average based on the instruction mix frequency:

$$Clock Cycles = \sum_{i=1}^{n} (CPI_i \times Instruction Count_i)$$

$$Weighted CPI = \sum_{i=1}^{n} (CPI_i \times \frac{Instruction Count_i}{Instruction Count})$$

## 4. Factors Affecting Performance Components

No single metric (like clock rate or CPI alone) can define system performance; they all interact and trade off against one another.

- **Algorithm:** Directly dictates the Instruction Count and can influence the CPI depending on the instruction mix used.
    
- **Programming Language & Compiler:** Affects both the Instruction Count and the CPI by determining how high-level code is translated into machine instructions.
    
- **Instruction Set Architecture (ISA):** Defines the available instructions, impacting the Instruction Count, the CPI, and the hardware-limited Clock Cycle Time.
    

## 5. The Shift to Multiprocessors & The "Three Walls"

For decades, uniprocessor performance doubled roughly every 18 to 24 months largely due to semiconductor scaling (Moore's Law) and architectural advancements (pipelining, caches). However, single-core performance scaling has flattened due to three major constraints known as the "Three Walls":

- **The Power Wall:** CPU power consumption scales with frequency.
    
    $Power = Capacitive Load \times Voltage^2 \times Frequency$
    
    Voltages cannot be reduced much further without causing severe leakage currents, and standard cooling mechanisms cannot remove the generated heat (hot-spots).
    
- **The Memory Wall:** The performance gap between the CPU and DRAM continues to widen. Even with larger L2/L3 caches, memory latency severely bottlenecks the incredibly fast CPU.
    
- **The ILP Wall (Instruction-Level Parallelism):** It is increasingly difficult to extract enough parallel instructions from a single process to keep advanced, highly pipelined superscalar processors busy.
    

**Solution:** The industry shifted to **Multicore Microprocessors** (multiple processors on a single chip). This shifts the burden to the programmer, requiring explicit parallel programming, thread-level parallelism (TLP), data-level parallelism (DLP), and careful load balancing to achieve higher performance.

## 6. Amdahl's Law

A fundamental principle in computer architecture states that the performance improvement gained from optimizing one specific part of a system is strictly limited by the fraction of time that the improved part is actually used.

**The Rule:** Make the common case fast!.

**Amdahl's Law Formulas:**

$$Execution Time_{new} = Execution Time_{old} \times \left( (1 - Fraction_{enhanced}) + \frac{Fraction_{enhanced}}{Speedup_{enhanced}} \right)$$

$$Speedup_{overall} = \frac{1}{(1 - Fraction_{enhanced}) + \frac{Fraction_{enhanced}}{Speedup_{enhanced}}}$$

**Important Inference:**

If only a part of the computing task is optimized, no matter how infinitely fast you make that specific part (i.e., $Speedup_{enhanced} \rightarrow \infty$), the maximum theoretical overall speedup is mathematically capped at:

$$Max Speedup = \frac{1}{1 - Fraction_{enhanced}}$$