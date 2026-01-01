## 1. Integer Storage Models

### A. Binary Logic vs. Binary Numbers
To understand integers, one must distinguish between the physical state and the mathematical abstraction.

-   **Binary Logic (Physical Layer):** This refers to the hardware state. A bit is simply a switch state (High Voltage/Low Voltage). It follows Boolean logic (AND, OR, NOT). Computer hardware operates fundamentally on this **Two-Value Logic**.

-   **Binary Numbers (Mathematical Layer):** This is an abstraction built on top of binary logic. We assign numerical meaning (powers of 2) to specific sequences of logic states to represent quantities.

### B. Unsigned Integers (Raw Binary)
*   **Definition:** A direct mapping between the hardware bits and a mathematical value.
*   **Mechanism:** Uses standard **Base-2 Positional Notation**.
*   **Weight:** Every bit has a positive weight ($2^0, 2^1, \dots, 2^{N-1}$).
*   **Nature:** This is the "natural language" of the hardware counter.

### C. Signed Integers (Encoded Binary)
*   **Definition:** A system to represent both positive and negative values within a fixed number of bits.
*   **Mechanism:** Uses **Two's Complement** encoding.
*   **Nature:** It is an interpretation rule imposed on the raw binary data to facilitate signed arithmetic.

---

## 2. Two's Complement Principles

### A. The Design Philosophy
Two's Complement was adopted to solve two critical hardware problems found in simpler systems (like Sign-Magnitude):
1.  **Unified Circuitry:** It allows the CPU to use the **same Adder circuit** for both addition and subtraction. Subtraction is simply adding a negative number.
2.  **Unique Zero:** It eliminates the redundancy of `+0` and `-0`, ensuring a single representation for zero (`00...00`).

### B. The Mathematical Essence: Negative Weight
In Two's Complement, the Most Significant Bit (MSB) acts not just as a sign flag, but as a bit with **negative weight**.
For an $N$-bit integer $B = b_{n-1} \dots b_0$:
$$ Value = -b_{n-1} \cdot 2^{n-1} + \sum_{i=0}^{n-2} b_i \cdot 2^i $$
*   **MSB = 0:** The negative weight is inactive. The number is positive.
*   **MSB = 1:** The number starts with a massive negative value (e.g., -128 for 8-bit), which is then "filled back up" by the positive weights of the remaining bits.

### C. Modulo Arithmetic (The Clock Model)
*   **Concept:** Computer integers operate in a finite ring defined by the **Modulus** $M = 2^N$ (where $N$ is the bit width).
*   **Overflow:** Any calculation exceeding $M$ results in the higher bits being physically discarded (hardware truncation).
*   **Negative Definition:** A negative number $-x$ is mathematically defined as the complement required to complete the cycle:
    $$ -x \equiv (M - x) \pmod M $$
    *   *Example (8-bit):* $-1$ is represented as $256 - 1 = 255$ (`1111 1111`).
*   **Calculation Rule:** To find the negative representation: **Invert all bits and add 1**.

### D. Range and Asymmetry
*   **The Split:** The $2^N$ possible values are split in half.
    *   First half ($0$ to $2^{N-1}-1$): MSB is 0 (Positive).
    *   Second half ($2^{N-1}$ to $2^N-1$): MSB is 1 (Negative).
*   **Asymmetry:** The range is $[-2^{N-1}, 2^{N-1}-1]$.
    *   *Example (8-bit):* `-128` to `+127`.
    *   **Reason:** Zero (`00000000`) occupies a slot in the "positive" (non-negative) section, leaving one fewer spot for positive numbers. `-128` (`10000000`) consists solely of the negative weight bit and has no positive counterpart.

---

## 3. The Integer Family in C

### A. Native Basic Types
Standard C defines these types based on **relative size**, not fixed bits (implementation-dependent).
*   `char`: Smallest addressable unit (usually 8-bit). Used for text or small integers.
*   `short`: At least 16-bit.
*   `int`: The **natural word size** of the CPU. Default choice for speed.
*   `long`: At least 32-bit.
*   `long long`: At least 64-bit (Introduced in C99).

### B. Modern Fixed-Width Types (`stdint.h`)
Used when precise memory layout is required (protocols, hardware registers).
*   `int8_t` / `uint8_t`
*   `int16_t` / `uint16_t`
*   `int32_t` / `uint32_t`
*   `int64_t` / `uint64_t`

### C. Boolean Type (`stdbool.h`)
*   **Underlying Type:** `_Bool` (an unsigned integer).
*   **Normalization:** Unlike standard `int`, `_Bool` has a hardware constraint: any **non-zero** assignment is forced to `1`.
*   **Usage:** Semantic clarity for true/false states.

### D. Special Purpose Types
*   `size_t`: **Unsigned**. Used for object sizes and array indexing. Prevents logical errors involving negative sizes.
*   `ptrdiff_t`: **Signed**. Used to represent the distance between two pointers.

---

## 4. The Philosophy of Unsigned Types

### A. Why Unsigned Exists
It is not merely for doubling the positive range.
1.  **Bitwise Container:** When treating data as a collection of flags or bits, signed types are dangerous (e.g., right-shifting a negative number triggers Sign Extension). Unsigned provides a "clean" binary environment.
2.  **Logical Correctness:** Represents quantities that physically cannot be negative (e.g., memory addresses, file sizes).
3.  **Defined Overflow:**
    *   **Signed Overflow:** **Undefined Behavior (UB)** in C. Compilers may optimize assuming it never happens.
    *   **Unsigned Overflow:** **Defined Behavior**. Guaranteed to wrap around modulo $2^N$. Essential for algorithms relying on wrapping (hashing, cryptography).

### B. Sign Extension
When promoting a smaller signed type to a larger type (e.g., `char` to `int`):
*   The CPU performs **Sign Extension**, filling the new high bits with the value of the MSB (0s for positive, 1s for negative).
*   This preserves the **numerical value** and the **sign** in the Two's Complement system.