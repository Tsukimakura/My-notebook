# 20_Integer Representations and Algorithms

## **1. Base $b$ Representations**

**Theorem (Base $b$ Expansion):**

Let $b$ be a positive integer greater than 1. Any positive integer $n$ can be expressed uniquely in the form:

$$
n = a_kb^k + a_{k-1}b^{k-1} + \dots + a_1b + a_0
$$

- $k$ is a nonnegative integer.

- $a_0, a_1, \dots, a_k$ are nonnegative integers strictly less than $b$ ($0 \le a_i < b$).

- The leading digit $a_k \neq 0$.

- **Notation:** This representation is denoted as $(a_k a_{k-1} \dots a_1 a_0)_b$. For base 10, the subscript is typically omitted.

---

## **2. Common Number Systems in Computing**

Computing and communications heavily rely on bases that are powers of 2.

- **Binary (Base 2)**

- **Octal (Base 8)**

- **Hexadecimal (Base 16)**

---

## **3. Base Conversion Algorithm**

---

## **4. Conversion Between Binary, Octal, and Hexadecimal**

---

## **5. Algorithms for Integer Operations**

Algorithms utilizing binary expansions are fundamental for computer hardware (ALUs).

- **Binary Addition:** Adds corresponding bits from right to left, passing a carry bit to the next position (similar to standard decimal addition).

    - **Time Complexity:** $O(n)$ bit additions are required to add two $n$-bit integers.

- **Binary Multiplication:** Computes partial products by shifting the multiplicand $j$ places to the left if the $j$-th bit of the multiplier is 1, then sums all partial products.

    - **Time Complexity:** $O(n^2)$ bit operations to multiply two $n$-bit integers.

```text
	   1 0 1 1
     x   1 0 1
     ---------
       1 0 1 1
     0 0 0 0
   1 0 1 1
   -----------
   1 1 0 1 1 1
```

---

## **6. Binary Modular Exponentiation**

> In fields like cryptography, computing $b^n \bmod m$ efficiently for extremely large integers is crucial. A naive approach (multiplying $b$ by itself $n$ times) is computationally infeasible.

- **Quick Power Algorithm**

**Example Breakdown ($3^{11} \bmod m$):**

- Binary of 11 is $(1011)_2$, meaning $11 = 8 + 2 + 1$.

- Therefore, $3^{11} = 3^8 \cdot 3^2 \cdot 3^1$.

- Calculate $3^1, 3^2, 3^4, 3^8 \bmod m$, and multiply the corresponding results.

**Time Complexity:**

This algorithm drastically reduces the number of operations required. Finding $b^n \bmod m$ uses $O((\log m)^2 \log n)$ bit operations.
