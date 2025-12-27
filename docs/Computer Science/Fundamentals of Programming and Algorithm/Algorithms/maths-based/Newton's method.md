**Iteration Process:**
1. Start with an initial guess x₀
2. Draw the tangent line to the function at point (x₀, f(x₀))
3. Find where this tangent crosses the x-axis → new approximation x₁
4. Repeat until desired accuracy is achieved

**Mathematical Formula:**  
`xₙ₊₁ = xₙ - f(xₙ)/f'(xₙ)`

Where:
- `xₙ` is the current approximation
- `f(xₙ)` is the function value at `xₙ`
- `f'(xₙ)` is the derivative at `xₙ`

**Implementation**
calculating the square root
```c
#define ABS(x) ((x)>0?(x):(-x))

double f(double x, double guess, double eps){
    double newguess = (guess+x/guess)/2;
    if(ABS(guess * guess - x) < eps){
        return guess;
    }else{
        return f(x,newguess,eps);
    }
}
```