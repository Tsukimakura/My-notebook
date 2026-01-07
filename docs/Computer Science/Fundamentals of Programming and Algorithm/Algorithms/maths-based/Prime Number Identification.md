### Method 1: The Square Root Optimized Trial Division
**Best for:** Checking if a single number $n$ is prime.

**Logic:** 
If $n$ is composite, it must have a factor less than or equal to $\sqrt{n}$. By checking only up to $\sqrt{n}$ and skipping even numbers, we significantly reduce the number of iterations.

*   **Time Complexity:** $O(\sqrt{n})$
*   **Key Optimization:** Use `i * i <= n` to avoid the overhead of the `sqrt()` function.

#### Implementation:
```c
#include <stdbool.h>

bool is_prime(int n) {
    if (n <= 1) return false;
    if (n == 2 || n == 3) return true;
    if (n % 2 == 0 || n % 3 == 0) return false;

    // Check odd divisors starting from 5
    for (int i = 5; i * i <= n; i += 2) {
        if (n % i == 0) return false;
    }
    return true;
}
```

---

### Method 2: Sieve of Eratosthenes
**Best for:** Finding all prime numbers in a large range (e.g., 1 to $N$).

**Logic:** 
Iteratively mark the multiples of each prime number starting from 2. The numbers remaining unmarked are primes. This avoids the cost of division operations entirely.

*   **Time Complexity:** $O(n \log \log n)$
*   **Space Complexity:** $O(n)$ (requires an array to store prime status)

#### Implementation:
```c
#include <stdio.h>
#include <stdbool.h>
#include <string.h>

void find_primes_in_range(int n) {
    bool is_prime[n + 1];
    memset(is_prime, true, sizeof(is_prime));
    is_prime[0] = is_prime[1] = false;

    for (int p = 2; p * p <= n; p++) {
        if (is_prime[p]) {
            // Mark multiples of p starting from p*p
            for (int i = p * p; i <= n; i += p)
                is_prime[i] = false;
        }
    }

    // Output primes
    for (int p = 2; p <= n; p++) {
        if (is_prime[p]) printf("%d ", p);
    }
}
```
