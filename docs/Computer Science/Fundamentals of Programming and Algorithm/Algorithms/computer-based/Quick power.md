### 1. Mathematical Principle

The algorithm leverages the **binary representation** of the exponent $n$ to compute powers in logarithmic time. Additionally, it applies **Modular Arithmetic** properties to prevent integer overflow during calculation.

**Binary Decomposition:**
$$x^n = x^{(b_k 2^k + \dots + b_0 2^0)} = \prod_{i=0}^{k} (x^{2^i})^{b_i}$$
Where $b_i \in \{0, 1\}$ is the $i$-th bit of $n$.

**Modular Property (Multiplication Rule):**
To compute large numbers without overflow, the modulo operator is applied at each multiplication step based on the property:
$$(a \cdot b) \pmod m = [(a \pmod m) \cdot (b \pmod m)] \pmod m$$
This ensures intermediate results never exceed $m^2$, fitting within standard integer types (e.g., `long long`) provided $m < 2^{31}$.

### 2. Algorithm Logic

1.  **Initialize:** Set `result = 1`. Pre-reduce `base` ($base \leftarrow base \pmod m$).
2.  **Loop:** While exponent `n > 0`:
    *   **Check LSB:** If `n` is odd (`n & 1`), update result:
        $$result \leftarrow (result \cdot base) \pmod m$$
    *   **Square Base:** Square the base for the next bit position:
        $$base \leftarrow (base \cdot base) \pmod m$$
    *   **Shift:** Right shift `n` by 1.
3.  **Return:** The final `result`.

### 3. Implementation (C Language)

```c
#include <stdio.h>

/**
 * Computes (base^exp) % mod using Modular Exponentiation.
 * 
 * @param base The base number.
 * @param exp  The exponent (non-negative).
 * @param mod  The modulus (dividing factor).
 * @return The result of (base^exp) modulo mod.
 */
long long modPow(long long base, long long exp, long long mod) {
    long long res = 1;
    
    // Handle cases where base >= mod initially
    base %= mod;

    while (exp > 0) {
        // If current bit is 1, multiply result by base and take modulo
        if (exp & 1) {
            res = (res * base) % mod;
        }

        // Square the base and take modulo
        base = (base * base) % mod;

        // Shift exponent to process next bit
        exp >>= 1;
    }

    return res;
}
```

### 4. Complexity Analysis

*   **Time Complexity: $O(\log n)$**
    The loop runs once for every bit in the exponent $n$. Even for $n = 10^{18}$ (approx. 60 bits), the loop executes only ~60 times.
*   **Space Complexity: $O(1)$**
    Uses constant extra memory variables (`res`, `base`, `exp`, `mod`).

### 5. Common Applications

1.  **Cryptography:** Essential for RSA encryption and Diffie-Hellman Key Exchange (dealing with huge primes).
2.  **Competitive Programming:** Solving combinatorics problems where answers are required modulo $10^9 + 7$ (e.g., calculating combinations $_nC_k$).
3.  **Primality Testing:** Used in the Miller-Rabin primality test.