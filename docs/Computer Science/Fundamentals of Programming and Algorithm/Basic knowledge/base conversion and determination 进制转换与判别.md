# **Number Base Conversion — Detailed Notes (Computer Science)**

## **1. Introduction**

In computer science, numbers are often represented in different bases.  
The most common ones are:

|Base|Name|Digits|Typical Use|
|---|---|---|---|
|**2**|Binary|0–1|Machine operations, logic circuits|
|**8**|Octal|0–7|Legacy systems, UNIX permissions|
|**10**|Decimal|0–9|Human-readable numbers|
|**16**|Hexadecimal|0–9, A–F|Memory addresses, color codes, assembly|

Understanding base conversion is essential for programming, digital logic, and low-level systems.

---

# **2. Converting Between Bases**

---

## **2.1 Decimal → Binary / Octal / Hexadecimal**

### **Method A: Repeated Division (for integer part)**

1. Divide the number by the target base.
    
2. Record the remainder.
    
3. Use the quotient for the next division.
    
4. Stop when the quotient is 0.
    
5. The result is the remainders **read in reverse order**.
    

### **Example: Convert 45₁₀ → Binary**

`45 ÷ 2 = 22 R 1   22 ÷ 2 = 11 R 0   11 ÷ 2 = 5  R 1   5  ÷ 2 = 2  R 1   2  ÷ 2 = 1  R 0   1  ÷ 2 = 0  R 1`  

Binary = **101101₂**

---

### **Method B: Multiply-by-base (for fractional part)**

1. Multiply fraction by the target base.
    
2. The integer part becomes the next digit.
    
3. Use the fractional part as next input.
    
4. Continue until fraction becomes 0 (or precision limit reached).
    

### **Example: Convert 0.625₁₀ → Binary**

`0.625 × 2 = 1.25   → 1   0.25  × 2 = 0.5    → 0   0.5   × 2 = 1.0    → 1`  

Binary fraction = **0.101₂**

---

## **2.2 Binary ↔ Octal / Hexadecimal (Fast Grouping Method)**

### **Grouping rules**

- **Binary → Octal**: group **3 bits** from right to left.
    
- **Binary → Hexadecimal**: group **4 bits**.
    

Add leading zeros if necessary.

---

### **Example: Binary → Hex**

Convert 1101011011₂ to hex:

Group into 4 bits:

`0011 0101 1011`

Convert each group:

|Binary|Hex|
|---|---|
|0011|3|
|0101|5|
|1011|B|

Hexadecimal result = **35B₁₆**

---

### **Example: Binary → Octal**

1101011011₂ grouped as 3 bits:

`1 101 011 011 → 001 101 011 011`

|Binary|Oct|
|---|---|
|001|1|
|101|5|
|011|3|
|011|3|

Octal = **1533₈**

---

## **2.3 Hexadecimal / Octal → Binary**

Simply convert each digit individually:

### **Hex → Binary Table**

|Hex|Binary|
|---|---|
|0|0000|
|1|0001|
|2|0010|
|3|0011|
|4|0100|
|5|0101|
|6|0110|
|7|0111|
|8|1000|
|9|1001|
|A|1010|
|B|1011|
|C|1100|
|D|1101|
|E|1110|
|F|1111|

### **Octal → Binary Table**

|Oct|Binary|
|---|---|
|0|000|
|1|001|
|2|010|
|3|011|
|4|100|
|5|101|
|6|110|
|7|111|

---

## **2.4 Binary / Octal / Hexadecimal → Decimal**

### **Positional Value Expansion**

For a number with digits dndn−1...d1d0.d−1d−2...d_n d_{n-1} ... d_1 d_0 . d_{-1} d_{-2} ...dn​dn−1​...d1​d0​.d−1​d−2​...

Decimal value =

∑i=kmdi⋅(base)i\sum_{i=k}^{m} d_i \cdot (\text{base})^ii=k∑m​di​⋅(base)i

---

### **Example: Convert 101101₂ → Decimal**

`1×2⁵ + 0×2⁴ + 1×2³ + 1×2² + 0×2¹ + 1×2⁰ = 32 + 0 + 8 + 4 + 0 + 1 = 45`

---

### **Example: Convert A3₁₆ → Decimal**

`A = 10   A3₁₆ = 10×16¹ + 3×16⁰ = 160 + 3 = 163`

---

## **3. Converting Between Non-Decimal Bases (Binary ↔ Octal ↔ Hex)**

### **Rule**

**Always go through binary** when converting between oct and hex.

Example: Convert 57₈ → Hex

1. 5 → 101  
    7 → 111
    

→ 101111₂

2. Group into 4 bits: 0010 1111
    

→ 2F₁₆

---

## **4. Two’s Complement for Negative Numbers**

### **Steps to get two’s complement**

1. Write the positive number in binary.
    
2. Invert all bits (0 ↔ 1).
    
3. Add 1.
    

### **Example: Represent −5 in 8-bit two’s complement**

1. +5 = 0000 0101
    
2. Invert → 1111 1010
    
3. Add 1 → **1111 1011₂**
    

- by this way a signed integer can be calculated by the same way as unsigned integers.

---

## **5. Common Pitfalls**

### **1. Forgetting to pad zeros**

Binary → hex requires 4-bit groups.  
Binary → oct requires 3-bit groups.

### **2. Mixing up fractional conversion**

Integer part uses **division**, fractional uses **multiplication**.

### **3. Truncation errors**

Some decimals (e.g., 0.1) cannot be represented exactly in binary.

---

## **6. Quick Reference Table**

### **Powers of 2 and Conversions**

|Power|Value|Approx Decimal|
|---|---|---|
|2¹⁰|1024|≈ 10³|
|2⁸|256|—|
|2⁴|16|—|
|2¹⁶|65536|—|
|2³²|4,294,967,296|—|

### **Hex ↔ Binary Shortcuts**

|Hex|Binary|
|---|---|
|1|0001|
|2|0010|
|4|0100|
|8|1000|

# **How C Determines the Base of Numeric Literals**

In C, the base (radix) of an integer literal is determined **solely by its textual form**. The compiler does not guess based on context or variable type.

---

## **1. Decimal literals (base-10)**

**Rule:**

- Must **not** start with `0`.
    
- Digits: `0–9`.
    

**Examples:**

`123 42 2025`

---

## **2. Octal literals (base-8)**

**Rule:**

- Start with a leading `0`.
    
- Digits must be `0–7`.
    

**Examples:**

`0755 012 0007`

**Invalid:**

`09   // 9 is not allowed in octal`

---

## **3. Hexadecimal literals (base-16)**

**Rule:**

- Start with `0x` or `0X`.
    
- Digits: `0–9`, `a–f`, `A–F`.
    

**Examples:**

`0xFF 0X1a3 0x7B`

---

## **4. Binary literals (base-2)**

Binary literals are **not supported in older C standards** (C89/C99/C11).  
They are supported starting from **C23**, and also by many compilers as extensions (e.g., GCC).

**Rule (C23 or compiler extension):**

- Start with `0b` or `0B`.
    
- Digits: `0` or `1`.
    

**Examples:**

`0b1010 0B11001`