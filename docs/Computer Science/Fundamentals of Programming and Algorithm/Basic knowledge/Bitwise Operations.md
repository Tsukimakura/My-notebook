## 1. Overview
**Bitwise operations** interact directly with the binary representations (bits) of data in memory. They are significantly faster than arithmetic operations and are essential for low-level programming, such as device drivers, protocol parsing, and embedded systems.

*   **Constraint**: Bitwise operators only work on **integer types** (`char`, `short`, `int`, `long`, `unsigned`, etc.). They cannot be used on floating-point numbers (`float`, `double`).

---

## 2. The Operators Reference

| Operator | Symbol | Name | Logic | Math Equivalent |
| :--- | :---: | :--- | :--- | :--- |
| **AND** | `&` | Bitwise AND | Both are 1 $\rightarrow$ 1 | Intersection / Masking |
| **OR** | `\|` | Bitwise OR | Either is 1 $\rightarrow$ 1 | Union / Setting |
| **NOT** | `~` | One's Complement | 0 $\rightarrow$ 1, 1 $\rightarrow$ 0 | Inversion |
| **XOR** | `^` | Bitwise XOR | Different $\rightarrow$ 1 | Toggling / Subtraction |
| **L-Shift** | `<<` | Left Shift | Move bits left, fill 0 | Multiply by $2^n$ |
| **R-Shift** | `>>` | Right Shift | Move bits right | Divide by $2^n$ |

---

## 3. Detailed Breakdown & Use Cases

### 3.1 Bitwise AND (`&`)
**Rule**: Results in `1` only if **both** corresponding bits are `1`. Otherwise `0`.
*   **Key Property**: `x & 0 = 0` (Clearing), `x & 1 = x` (Preserving).

**Common Applications**:
1.  **Masking (Clearing Bits)**: Forcing specific bits to 0.
    *   `x & 0xFE` $\rightarrow$ Clears the LSB (Least Significant Bit), keeps others unchanged.
2.  **Extracting Data**: Getting a specific byte or segment.
    *   `x & 0xFF` $\rightarrow$ Extracts the lowest byte (8 bits).
3.  **Modulo Operation (Power of 2)**:
    *   `x % 16` is equivalent to `x & 0x0F` (where $16 = 2^4$).
    *   General rule: `x % (2^n)` $\Leftrightarrow$ `x & (2^n - 1)`.

### 3.2 Bitwise OR (`|`)
**Rule**: Results in `1` if **at least one** of the corresponding bits is `1`.
*   **Key Property**: `x | 1 = 1` (Setting), `x | 0 = x` (Preserving).

**Common Applications**:
1.  **Setting Bits**: Forcing specific bits to 1.
    *   `x | 0x01` $\rightarrow$ Sets the LSB to 1.
2.  **Splicing Data**: Combining smaller data chunks into a larger one.
    *   `(high_byte << 8) | low_byte` $\rightarrow$ Combines two 8-bit values into a 16-bit value.

### 3.3 Bitwise NOT (`~`)
**Rule**: Inverts every bit. `0` becomes `1`, `1` becomes `0`.
*   **Note**: This is a **unary** operator (takes only one operand).

**Common Applications**:
1.  **Portable "All Ones" Mask**: `~0` always represents a number with all bits set to 1, regardless of the machine's word size (32-bit or 64-bit).
2.  **Creating Clearing Masks**: Used with AND.
    *   To clear the lower 3 bits: `x & ~7` (Since 7 is `...00111`, `~7` is `...11000`).

### 3.4 Bitwise XOR (`^`)
**Rule**: Results in `1` if the bits are **different**. Results in `0` if they are the **same**.
*   **Key Properties**:
    *   `x ^ x = 0` (Self-cancellation)
    *   `x ^ 0 = x` (Identity)
    *   `a ^ b ^ b = a` (Reversibility)

**Common Applications**:
1.  **Equality Check**: If `(a ^ b) == 0`, then `a == b`.
2.  **Toggling Bits**: Inverting specific bits without touching others.
3.  **Variable Swap**: Swapping values without a temporary variable (classic interview trick).

---

## 4. Essential Technique: Set, Reset, and Toggle

This is the standard pattern for manipulating hardware registers or configuration flags (as seen in the slides).

**Scenario**: You want to modify the 3rd and 4th bits of a variable `reg` (0-indexed).

1.  **Prepare the Mask**:
    ```c
    // Create a mask where only bits 3 and 4 are 1.
    unsigned long mask = (1ul << 3) | (1ul << 4); 
    ```

2.  **Set Bits (Turn ON)**: Use `OR`
    ```c
    reg |= mask; // Bits 3 and 4 become 1; others unchanged.
    ```

3.  **Reset Bits (Turn OFF)**: Use `AND` + `NOT`
    ```c
    reg &= ~mask; // Bits 3 and 4 become 0; others unchanged.
    ```

4.  **Toggle Bits (Flip)**: Use `XOR`
    ```c
    reg ^= mask; // Bits 3 and 4 flip states; others unchanged.
    ```

---

### 5. Logical vs. Bitwise Operations

**1. Input Interpretation**
*   **Logical (`&&`, `||`, `!`)**: Treats the operands as **Boolean** values. It only cares if a number is **Zero (False)** or **Non-zero (True)**.
*   **Bitwise (`&`, `|`, `~`)**: Treats the operands as a **sequence of bits**. It operates on every single bit position independently.

**2. Result Type**
*   **Logical**: The result is always **`0`** or **`1`**.
*   **Bitwise**: The result is an **integer** calculated by the bit logic (e.g., `5 & 4` results in `4`).

**3. Short-Circuit Evaluation**
*   **Logical**: **Yes**. It stops evaluation as soon as the result is determined.
    *   *Example*: In `A && B`, if `A` is false, `B` is **never executed**.
*   **Bitwise**: **No**. Both operands are **always evaluated** completely before the operation takes place.

**Comparison Example:**
*   `5 & 4` $\rightarrow$ `0101 & 0100` = **`4`** (Bitwise intersection)
*   `5 && 4` $\rightarrow$ `True && True` = **`1`** (Logical truth)

---

## 6. Shift Operations

### 6.1 Left Shift (`<<`)
*   **Action**: Moves bits to the left.
*   **Padding**: Always fills the right (LSB) with **0**.
*   **Math**: Equivalent to multiplying by $2^n$ (if no overflow occurs).
    *   `x << 1` $\approx$ `x * 2`

### 6.2 Right Shift (`>>`)
*   **Action**: Moves bits to the right.
*   **Math**: Equivalent to dividing by $2^n$ (integer division).
*   **Padding Rule (Crucial)**:
    1.  **Logical Shift (Unsigned types)**: Fills the left (MSB) with **0**.
    2.  **Arithmetic Shift (Signed types)**: Fills the left (MSB) with the **Sign Bit**.
        *   If positive (MSB=0), fills with 0.
        *   If negative (MSB=1), fills with 1 to maintain the negative value.

---

## 7. Pitfalls & Best Practices ("No Zuo No Die")

Strictly avoid **Undefined Behaviors (UB)** regarding shift operations:

1.  **Negative Shift Count**:
    *   `x << -2` is **undefined**. Never use negative numbers for the number of positions to shift.
2.  **Oversize Shift**:
    *   Shifting by a number greater than or equal to the width of the type.
    *   Example: `x << 32` (where `x` is a 32-bit `int`) is **undefined**.
3.  **Signed Integer Overflow**:
    *   `1 << 31` on a 32-bit signed int touches the sign bit. This can cause issues.
    *   **Fix**: Use unsigned literals: `1u << 31` or `1ul << 31`.

---

## 8. Code Example: Printing Binary
A standard algorithm to visualize the binary representation of a number (from the slides).

```c
#include <stdio.h>

int main() {
    int number;
    printf("Enter an integer: ");
    scanf("%d", &number);

    // Start with a mask where only the Highest Bit (MSB) is 1.
    // 'u' ensures it is treated as unsigned to avoid arithmetic shift issues.
    unsigned int mask = 1u << 31; 

    printf("Binary: ");
    for (; mask > 0; mask >>= 1) {
        // Check if the bit at the current mask position is 1
        if (number & mask) {
            printf("1");
        } else {
            printf("0");
        }
    }
    printf("\n");
    return 0;
}
```

### Explanation of the loop:
1.  **Init**: `mask` is `1000...0000`.
2.  **Check**: `number & mask` isolates the current bit.
3.  **Update**: `mask >>= 1` shifts the `1` to the right (`0100...`, then `0010...`).
4.  **End**: When `mask` becomes `0`, all bits have been checked.