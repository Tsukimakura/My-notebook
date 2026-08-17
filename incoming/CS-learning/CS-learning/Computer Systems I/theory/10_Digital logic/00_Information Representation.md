# Binary Number Representation

## 1. Signals and Information Representation

### Signal Types Over Time

- **Analog Signals:** Continuous in both value and time. 
	
* **Digital Signals (Asynchronous):** Discrete in value, but continuous in time.
	
	The transition between "High" and "Low" can happen at _any_ arbitrary point in time. There is no central clock dictating when a change can occur.
    
- **Digital Signals (Synchronous):** Discrete in both value and time.
	
	The transition between "High" and "Low" are strictly coordinated by a system clock. State changes only occur at specific, regular intervals (e.g., on the rising edge of a clock pulse).

### Physical Implementation of Binary Values

Examples of physical quantities used in hardware:

- **CPU:** Voltage
    
- **Disk:** Magnetic Field Direction
    
- **CD:** Surface Pits / Light
    
- **DRAM:** Electrical Charge
    

### More about Voltage Signals

To ensure reliable communication between hardware components, **The standards for sending a signal (Output) are always stricter than the standards for receiving a signal (Input).**

This principle applies across all hardware voltage standards. Below are two common examples:

**Example A: Modern Low-Voltage System (1.0V Standard)**

- **Output Ranges (Sender):**
    
    - **Output HIGH:** 0.9V to 1.0V
        
    - **Output LOW:** 0.0V to 0.1V
        
- **Input Ranges (Receiver):**
    
    - **Input HIGH:** 0.6V to 1.0V
        
    - **Input LOW:** 0.0V to 0.4V
        

**Example B: Classic TTL System (5.0V Standard)**

- **Output Ranges (Sender):**
    
    - **Output HIGH:** 4.5V to 5.0V
        
    - **Output LOW:** 0.0V to 0.1V
        
- **Input Ranges (Receiver):**
    
    - **Input HIGH:** 4.0V to 5.0V
        
    - **Input LOW:** 0.0V to 0.4V
        

#### Threshold Region and Noise Margin

**The Threshold Region (The Invalid Zone)**

The gap between the maximum acceptable Input LOW and the minimum acceptable Input HIGH is the **Threshold Region**.

- **Definition:** An undefined zone where the logic state is indeterminate.
    
- **Example (1.0V System):** The range between 0.4V and 0.6V.
    
- **Implication:** If a receiver detects a voltage in this zone, it cannot reliably determine if the signal is a `0` or a `1`, leading to potential logic errors. Hardware is designed to transition through this voltage gap as fast as possible.
    

**Noise Margin (The Buffer Zone)**

The mathematical difference between the Output standard and the Input standard is the **Noise Margin**.

- **Definition:** The amount of electrical noise or voltage degradation a signal can absorb during transmission without causing a logic error at the receiver.
    
- **How it works (using the 5.0V example):** The sender guarantees a minimum Output HIGH of 4.5V. The receiver accepts an Input HIGH down to 4.0V. This creates a Noise Margin of 0.5V. If the 4.5V signal loses 0.3V of power traveling down a wire, it arrives at 4.2V. Because 4.2V is still within the receiver's acceptable Input HIGH range (>4.0V), the system reads the `1` flawlessly.

## 2. Storage Metrics and Ambiguity

In computing, data sizes often rely on positive powers of 2.

- $2^{10} (1,024)$ is **Kilo (K)**
    
- $2^{20} (1,048,576)$ is **Mega (M)**
    
- $2^{30} (1,073,741,824)$ is **Giga (G)**
    
- $2^{40} (1,099,511,627,776)$ is **Tera (T)**
    

### The $2^X$ vs. $10^Y$ Bytes Ambiguity

|**Decimal Term**|**Abbrev.**|**Value**|**Binary Term**|**Abbrev.**|**Value**|**% Larger**|
|---|---|---|---|---|---|---|
|kilobyte|KB|$10^3$|**kibibyte**|KiB|$2^{10}$|2%|
|megabyte|MB|$10^6$|**mebibyte**|MiB|$2^{20}$|5%|
|gigabyte|GB|$10^9$|**gibibyte**|GiB|$2^{30}$|7%|
|terabyte|TB|$10^{12}$|**tebibyte**|TiB|$2^{40}$|10%|

---

# Representation of Numeric Data

## 1. Overview of Numeric Data

To represent numerical data effectively in a computer system, three elements are required:

1. A carry counting system (radix/base).
    
2. A number representation format (fixed-point vs. floating-point).
    
3. An encoding method.
    

## 2. Fixed-Point Number Representation

In fixed-point representation, the radix point is assumed to be in a fixed position.

### Unsigned Integers

### Signed Integers


## 3. Encoding Methods for Signed Integers

### Method A: Sign-and-Magnitude (原码)

A straightforward method where a positive number and its corresponding negative number share the exact same value bits; only the sign bit changes.

- **Coding Rule:** Let $X_T$ be the true value.
    
    - If $X_T > 0$, the sign bit $X_{n-1} = 0$.
        
    - If $X_T < 0$, the sign bit $X_{n-1} = 1$.
        
- **Major Issue:** There are two ways to represent zero ($+0$ and $-0$), which complicates arithmetic operations in hardware.
    

### Method B: Complements

**1. Binary 1's Complement (反码 / Diminished Radix Complement)**

- **Mathematical Definition:** For radix $r$, it is defined as $(r^n - 1) - N$.
    
- **Coding Rule:** Let $X_T$ be the true value.
    
    - If $X_T > 0$, the 1's Complement = Sign-and-magnitude.
        
    - If $X_T < 0$, the 1's Comlement is the Sign-and-magnitude keeping the sign bit and complementing the remaining bits.
		
- It didn't solve the double-zero issue, but simplified some hardware disign problems.

**2. Binary 2's Complement (补码 / Radix Complement)**

- **Mathematical Definition:** For radix $r$, it is defined as $r^n - N$.
    
- It is the most common representation because it resolves the double-zero issue (0 has a single, unique representation) and allows the ALU (Arithmetic Logic Unit) to perform subtraction using standard addition circuitry. 
    

### Method C: Frameshift Code / Biased Notation (移码)

- **Core Concept:** It adds a fixed constant (the bias) to the true value, shifting all numbers—including negatives—into a strictly non-negative range.
    
- **Hardware Advantage:** Because all resulting values are essentially "positive," the CPU can use simple, high-speed unsigned logic circuits to compare which number is larger.
    
- **Conversion Shortcut:** In many binary systems, we can convert a 2's complement number directly into biased notation simply by inverting its sign bit, which costs almost zero hardware resources.
    
- **Primary Application:** It is predominantly used to represent the **exponent** portion of floating-point numbers (like in the IEEE 754 standard) to drastically speed up exponent comparisons during calculations.
    

## 4. Expanding and Truncating Data


## 5. The IEEE 754 Floating-Point Standard

> Before floating-point, systems attempted to use fixed-point binary to represent fractions. Fixed bit-widths severely limit the range, and deciding exactly where to place the static "binary point" is inflexible for mixed-scale calculations.

To solve the range and flexibility issues of fixed-point systems, William Kahan designed the IEEE 754 Standard (established in 1985). It represents numbers similarly to scientific notation (e.g., $-2.34 \times 10^{56}$), but in binary: $\pm 1.xxxxxxx_2 \times 2^{yyyy}$.

A floating-point number is divided into three distinct bit fields:

1. **Sign bit ($s$):** Determines if the number is positive (0) or negative (1).
    
2. **Exponent ($E$):** Weights the value by a power of two. (More bits here = wider range).
    
3. **Fraction / Significand ($M$):** Determines the numerical precision. (More bits here = better accuracy).
    

### Precision Formats in C

| **Precision**      | **C Type**   | **Total Bits** | **Sign Bits** | **Exponent Bits** | **Fraction Bits** |
| ------------------ | ------------ | -------------- | ------------- | ----------------- | ----------------- |
| **Single**         | `float`      | 32             | 1             | 8                 | 23                |
| **Double**         | `double`     | 64             | 1             | 11                | 52                |
| **Extended** `(*)` | (Intel only) | 80             | 1             | 15                | 63 or 64          |

## 6. Normalized Values (The Standard Form)

When the Exponent field is neither all 0s nor all 1s, the number is considered "Normalized."

**The Universal Formula:**

$$x = (-1)^s \times (1 + \text{Fraction}) \times 2^{(\text{Exponent} - \text{Bias})}$$

**Key Properties of Normalized Numbers:**

- **The "Hidden Bit":** Because normalized binary numbers always start with a leading `1` (just like scientific notation doesn't start with `0.x`), hardware designers save a bit of space by _not_ explicitly storing the `1.` in the fraction field. The true Significand $M = 1 + \text{Fraction}$.
    
- **The Biased Exponent:** As discussed in previous notes, the Exponent uses **Biased Notation (移码)** to ensure it acts as an unsigned number for fast hardware comparisons.
    
    - **Single Precision Bias:** 127
        
    - **Double Precision Bias:** 1023
        
    - _Example:_ If an 8-bit Exponent field stores `10000001` ($129_{10}$), the actual exponent is $129 - 127 = 2$.
        

## 7. Special Values & Denormalized Numbers

The IEEE 754 standard reserves specific Exponent bit patterns (all 0s or all 1s) to represent special mathematical concepts.

### A. Denormalized Numbers (Exponent = $000...0$)

If the Exponent field is entirely zeros, the number is **Denormalized**.

- **The Formula Changes:** $x = (-1)^s \times (0 + \text{Fraction}) \times 2^{(1 - \text{Bias})}$
    
- **No Hidden Bit:** The implied leading `1` is replaced with a `0`.
    
- **Purpose:** This allows for **"gradual underflow."** It fills the tiny numerical gap between the smallest representable normalized number and exactly zero, preventing small numbers from abruptly rounding down to zero.
    
- **The "Two Zeros" Feature:** If both the Exponent AND the Fraction are all 0s, the value is $0.0$. Because the sign bit is independent, IEEE 754 technically supports both $+0.0$ and $-0.0$.
    

### B. Infinities and NaNs (Exponent = $111...1$)

- **Infinity ($\pm\infty$):** Occurs when Exponent is all 1s and the Fraction is all 0s. This handles overflow natively, allowing calculations to continue without crashing (e.g., $1.0 / 0.0 = +\infty$).
    
- **NaN (Not-a-Number):** Occurs when Exponent is all 1s and the Fraction is _not_ all 0s. This represents undefined or illegal operations (e.g., $\sqrt{-1}$ or $\infty - \infty$).
    

## 8. Floating-Point Operations & Rounding

Because physical hardware has limited bits, calculating floating-point math ($x + y$ or $x \times y$) usually results in a number that requires more bits than are available. The hardware must compute the exact result and then **Round** it to fit the fraction field.

### Rounding Modes

1. **Towards Zero:** Drops extra bits (truncates).
    
2. **Round Down ($-\infty$):** Always rounds to the smaller value.
    
3. **Round Up ($+\infty$):** Always rounds to the larger value.
    
4. **Round-to-Nearest Even (Default):** 

	* This is the default because it prevents **statistical bias** in large datasets.
    
    - If a value is _exactly_ halfway between two possibilities, it rounds toward the one where the least significant digit is **even**.
        
    - _Decimal Example:_ $7.895 \rightarrow 7.90$ (rounds up to even), $7.885 \rightarrow 7.88$ (rounds down to even).
        

## 9. Crucial Limitations and System Realities

Floating-point arithmetic is an approximation. It is **not the same as real mathematical arithmetic**.

- **Loss of Associativity/Distributivity:** Because rounding occurs after every single operation in a chain, $(a + b) + c$ may **not** equal $a + (b + c)$.
    
- **Comparison Quirks:** While you can almost use high-speed unsigned integer hardware to compare floating-point values, you must account for the fact that $+0 == -0$ and that NaNs will ruin standard comparisons.
    

## 10. Binary Codes for Decimal Digits (BCD)

While computers process binary natively, they frequently need to process and display decimal data for human interaction. To do this, we use **Binary Coded Decimal (BCD)**, which encodes each decimal digit (0-9) individually into a 4-bit binary sequence.

Because 4 bits can represent 16 unique states ($2^4$), and we only need 10 states for decimal digits, there are over 8,000 mathematical ways to map them. They fall into two main categories:

- **Weighted BCD Codes:** Each bit position has a specific mathematical weight.
    
    - _Example (8421 Code):_ The most common BCD. The weights of the bits are 8, 4, 2, and 1. (e.g., Decimal `9` is encoded as `1001` because $8(1) + 4(0) + 2(0) + 1(1) = 9$).
        
- **Unweighted BCD Codes:** The bit positions do not have fixed mathematical weights. Commonly used for hardware state transitions or error reduction.
    
    - _Examples:_ **Excess-3 Code** (created by adding 3 to the 8421 code) and **Gray Code** (where only one single bit changes state between any two adjacent numbers).
        

---

# Representation of Non-Numeric Data

When stepping away from math, computers must represent logic, text, and symbols.

## 1. Logical Values

In digital logic, a single bit represents a boolean value (`0` = False, `1` = True). However, memory is typically addressable in blocks (like bytes or words). Therefore, an $n$-bit data unit (like an 8-bit byte) can be treated as an array of $n$ independent 1-bit logical values, allowing the hardware to evaluate multiple conditions simultaneously using bitwise operations.

## 2. Alphanumeric Codes: ASCII

It uses 7 bits to represent 128 unique characters ($2^7$):

- **94 Graphic/Printable Characters:**
	
- **34 Non-Printing/Control Characters:**
	

**Crucial ASCII Properties for Hardware:**

- **The "Flipping Bit 6" Trick:** Notice that the hex code for `A` ($41_{16} = 01000001_2$) and `a` ($61_{16} = 01100001_2$) differ by exactly one bit (the 6th bit, which has a decimal value of 32 or hex $20_{16}$). **Hardware can instantly convert upper to lower case (and vice versa) simply by flipping this single bit.**
    

## 3. UNICODE & International Characters

ASCII is limited to English. **UNICODE** extends this standard.

- Originally implemented as a 16-bit (2-byte) universal code block, giving 65,536 unique combinations to encode characters from all world languages.
    

---

# Data Width and Storage

## 1. Data Width Terminology

- **Bit:** The smallest, indivisible unit (`0` or `1`).
    
- **Byte:** 8 bits. The fundamental addressable unit of memory.
    
- **Word Size:** The nominal size of integer-valued data (and memory addresses) for a specific CPU architecture.
    
    - **32-bit systems:** Word size is 32 bits (4 bytes). Limits the CPU to addressing a maximum of 4GB of RAM ($2^{32}$ bytes). This is too small for modern memory-intensive apps.
        
    - **64-bit systems:** Word size is 64 bits (8 bytes). Pushes the potential address space to an astronomical $1.8 \times 10^{19}$ bytes (though current x86-64 hardware limits physical addressing to 256 Terabytes for efficiency).
        

## 2. Capacity vs. Speed: The Base-2 vs Base-10 Rule

- **Memory Capacity (Powers of 2):** When measuring RAM or Storage space, we use binary prefixes (K, M, G, T, P).
    
    - $1 \text{ KB} = 2^{10} \text{ bytes} = 1,024 \text{ bytes}$
        
    - $1 \text{ MB} = 2^{20} \text{ bytes} = 1,048,576 \text{ bytes}$
        
- **Transmission Speed (Powers of 10):** When measuring networking speed or frequency (like CPU Hz), we use standard decimal metric prefixes (k, M, G).
    
    - $1 \text{ kbps (kilobits per second)} = 10^3 \text{ bps} = 1,000 \text{ bps}$
        
    - $1 \text{ Mbps} = 10^6 \text{ bps} = 1,000,000 \text{ bps}$
        

## 3. Byte Ordering (Endianness)
