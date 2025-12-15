### 1. Basic Math Functions

| Function                          | Description              | Example             |
| --------------------------------- | ------------------------ | ------------------- |
| `double fabs(double x)`           | Absolute value           | `fabs(-3.2) → 3.2`  |
| `double sqrt(double x)`           | Square root              | `sqrt(9) → 3`       |
| `double cbrt(double x)`           | Cube root                | `cbrt(8) → 2`       |
| `double pow(double x, double y)`  | x raised to power y      | `pow(2,3) → 8`      |
| `double fmod(double x, double y)` | Floating-point remainder | `fmod(5.3,2) → 1.3` |
 
### 2. Rounding and Integer Conversions

| Function                 | Description                       | Example            |
| ------------------------ | --------------------------------- | ------------------ |
| `double floor(double x)` | Round down (largest integer ≤ x)  | `floor(3.8) → 3`   |
| `double ceil(double x)`  | Round up (smallest integer ≥ x)   | `ceil(3.2) → 4`    |
| `double round(double x)` | Round to nearest integer          | `round(3.5) → 4`   |
| `double trunc(double x)` | Truncate (remove fractional part) | `trunc(-3.8) → -3` |

**Key differences:**

- `floor(2.9)` → `2`
    
- `ceil(2.1)` → `3`
    
- `trunc(2.9)` → `2`, `trunc(-2.9)` → `-2` (toward zero)

### 3. Splitting Floating-Point Numbers

|Function|Description|
|---|---|
|`double modf(double x, double *intpart)`|Splits x into integer and fractional parts|
|`double frexp(double x, int *exp)`|Splits x into mantissa and exponent|
|`double ldexp(double mantissa, int exp)`|Computes `mantissa × 2^exp`|

Example using `modf`:
```c
double ip; double fp = modf(3.14, &ip); /* ip = 3, fp = 0.14 */
```

### 4. Exponential and Logarithmic Functions

|Function|Description|Example|
|---|---|---|
|`double exp(double x)`|e^x|`exp(1) ≈ 2.718`|
|`double log(double x)`|Natural logarithm (ln)|`log(e) = 1`|
|`double log10(double x)`|Base-10 logarithm|`log10(100) = 2`|

### 5. Trigonometric Functions (Radians)

|Function|Description|
|---|---|
|`double sin(double x)`|Sine|
|`double cos(double x)`|Cosine|
|`double tan(double x)`|Tangent|
|`double asin(double x)`|Arcsine|
|`double acos(double x)`|Arccosine|
|`double atan(double x)`|Arctangent|
|`double atan2(double y, double x)`|Arctangent with quadrant awareness|

**All angles are in radians**, not degrees.

### 6. Hyperbolic Functions (Less Common)

|Function|Description|
|---|---|
|`double sinh(double x)`|Hyperbolic sine|
|`double cosh(double x)`|Hyperbolic cosine|
|`double tanh(double x)`|Hyperbolic tangent|

# **Quick Knowledge Points**

- `<math.h>` functions work on `double` by default.
    
- For `float`, use versions like `sinf`, `cosf`, `fabsf`, etc.
    
- On Linux/Mac, you must link the math library:  
    `gcc file.c -lm`
    
- To split a number into integer & fractional parts, prefer `modf()` instead of writing your own function.