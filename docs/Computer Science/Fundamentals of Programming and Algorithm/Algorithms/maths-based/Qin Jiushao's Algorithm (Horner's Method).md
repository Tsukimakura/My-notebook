## 1. Introduction
**Qin Jiushao's Algorithm**, globally known as **Horner's Method** (or Horner Scheme), is an efficient algorithm for the evaluation of polynomials. While named after the British mathematician William George Horner, it was documented by the Chinese mathematician **Qin Jiushao** in his 13th-century treatise *Shushu Jiuzhang* (Mathematical Treatise in Nine Sections).

The algorithm transforms a standard polynomial into a **nested multiplication** format, significantly reducing the number of arithmetic operations required.

---

## 2. Mathematical Principle
A polynomial of degree $n$ is typically expressed as:

$$P(x) = a_n x^n + a_{n-1} x^{n-1} + \dots + a_1 x + a_0$$

Evaluating this directly is computationally expensive because calculating $x^k$ requires multiple multiplications. Qin Jiushao’s algorithm rewrites the polynomial as:

$$P(x) = ((\dots((a_n x + a_{n-1})x + a_{n-2})x + \dots + a_1)x + a_0)$$

### Iterative Process:
1. Let $v_n = a_n$
2. For $i = n-1$ down to $0$:
   $$v_i = v_{i+1} \cdot x + a_i$$
3. The final result is $v_0$.

---

## 3. Complexity Analysis
The algorithm is mathematically optimal for polynomial evaluation, minimizing the total number of operations.

| Method | Multiplications | Additions | Time Complexity |
| :--- | :---: | :---: | :---: |
| **Naive Approach** | $\approx \frac{n(n+1)}{2}$ | $n$ | $O(n^2)$ |
| **Qin Jiushao / Horner** | $n$ | $n$ | $O(n)$ |

---

## 4. C Language Implementation

The following implementation assumes the coefficients are stored in an array in descending order of powers ($a_n, a_{n-1}, \dots, a_0$).

```c
#include <stdio.h>

/**
 * Evaluates a polynomial using Qin Jiushao's Algorithm.
 * 
 * @param coeff[] Array of coefficients starting from the highest degree (a_n to a_0).
 * @param n       The degree of the polynomial.
 * @param x       The value at which to evaluate the polynomial.
 * @return        The value of P(x).
 */
double evaluate_polynomial(double coeff[], int n, double x) {
    // Initialize result with the leading coefficient (a_n)
    double result = coeff[0];

    // Iterate through the remaining coefficients
    for (int i = 1; i <= n; i++) {
        result = result * x + coeff[i];
    }

    return result;
}

int main() {
    // Example: P(x) = 2x^3 - 6x^2 + 2x - 1
    // Coefficients: a3=2, a2=-6, a1=2, a0=-1
    double coeffs[] = {2.0, -6.0, 2.0, -1.0};
    int degree = 3;
    double x_val = 3.0;

    double result = evaluate_polynomial(coeffs, degree, x_val);

    printf("For P(x) = 2x^3 - 6x^2 + 2x - 1\n");
    printf("When x = %.2f, P(x) = %.2f\n", x_val, result);

    return 0;
}
```
