**Basic steps:**
1. **Define Model** - Create mathematical representation
2. **Generate Inputs** - Sample from probability distributions
3. **Run Simulations** - Compute outputs repeatedly
4. **Analyze Results** - Use statistics to draw conclusions

**Core:** Repeat random sampling to solve complex problems.

- The random number functions in the C standard library produce uniformly distributed(均匀分布) random numbers.

**Implementation**
Estimate the value of **PI**
[[Random Numbers |A simple note about random numbers]]
```c
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int main() {
    int numberOfTrials = (int)1e7;
    int numberOfHits = 0;
    srand(time(NULL)); // 设置随机种子，避免每次运行相同
    for (int i = 0; i < numberOfTrials; i++) {
        double x = (double)rand() / RAND_MAX * 2 - 1; // 生成[-1,1)的随机浮点数
        double y = (double)rand() / RAND_MAX * 2 - 1;
        if (x * x + y * y <= 1) {
            numberOfHits++;
        }
    }
    double pi = 4.0 * numberOfHits / numberOfTrials;
    printf("%f\n", pi);
    return 0;
}
```