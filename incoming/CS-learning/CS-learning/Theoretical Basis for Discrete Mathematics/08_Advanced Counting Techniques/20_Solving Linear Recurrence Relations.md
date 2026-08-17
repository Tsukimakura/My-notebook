## 1. Linear Homogeneous Recurrence Relations (LHRR)

**Definition:** A linear homogeneous recurrence relation of degree $k$ with constant coefficients is of the form:

$$a_n = c_1a_{n-1} + c_2a_{n-2} + \dots + c_ka_{n-k}$$

- **Linear:** The right-hand side is a sum of previous terms, not raised to powers or multiplied together.
    
- **Homogeneous:** There are no standalone constant terms or functions of $n$ (every term is a multiple of an $a_j$).
    
- **Constant Coefficients:** The multipliers $c_1, c_2, \dots, c_k$ are real numbers, and $c_k \neq 0$.
    

### The Characteristic Equation

To solve an LHRR, we look for solutions of the form $a_n = r^n$ (where $r$ is a constant). Substituting $a_n = r^n$ into the relation yields the **characteristic equation**:

$$r^k - c_1r^{k-1} - c_2r^{k-2} - \dots - c_k = 0$$

The roots of this equation ($r_1, r_2, \dots$) are called **characteristic roots** and dictate the explicit formula of the sequence.

### Theorem 1 & 3: Distinct Roots

- **Degree Two (Theorem 1):** If $r^2 - c_1r - c_2 = 0$ has two distinct roots $r_1$ and $r_2$, the solution is:
    
    $$a_n = \alpha_1 r_1^n + \alpha_2 r_2^n$$
    
    where $\alpha_1$ and $\alpha_2$ are constants determined by initial conditions.
    
- **Arbitrary Degree (Theorem 3):** If the characteristic equation has $k$ distinct roots $r_1, r_2, \dots, r_k$, the general solution is the linear combination:
    
    $$a_n = \alpha_1 r_1^n + \alpha_2 r_2^n + \dots + \alpha_k r_k^n$$
    

### Theorem 2 & 4: Repeated Roots

- **Degree Two (Theorem 2):** If $r^2 - c_1r - c_2 = 0$ has one repeated root $r_0$, the solution requires multiplying by $n$ to generate a second linearly independent term:
    
    $$a_n = \alpha_1 r_0^n + \alpha_2 n r_0^n$$
    
- **Arbitrary Degree (Theorem 4):** If a root $r_i$ repeats with multiplicity $m_i$, its contribution to the general solution is a polynomial in $n$ of degree $m_i - 1$:
    
    $$(\alpha_{i,0} + \alpha_{i,1}n + \dots + \alpha_{i,m_i-1}n^{m_i-1})r_i^n$$
    
    The total solution sums these blocks across all distinct roots.
    

---

## 2. Linear Nonhomogeneous Recurrence Relations (LNRR)

**Definition:** A linear nonhomogeneous recurrence relation with constant coefficients includes an extra term $F(n)$ that depends only on $n$:

$$a_n = c_1a_{n-1} + c_2a_{n-2} + \dots + c_k a_{n-k} + F(n)$$

The equation achieved by stripping away $F(n)$ is called the **associated homogeneous recurrence relation**.

### Theorem 5: General Solution Structure

The general solution to a nonhomogeneous relation is the sum of two parts:

$$a_n = a_n^{(h)} + a_n^{(p)}$$

1. **$a_n^{(h)}$**: The general solution to the associated homogeneous relation.
    
2. **$a_n^{(p)}$**: A single, particular solution that satisfies the nonhomogeneous relation.
    

**Solution Steps:**

1. Find $a_n^{(h)}$ using characteristic roots.
    
2. Determine the form of $a_n^{(p)}$ based on $F(n)$ (see Theorem 6) and solve for its coefficients.
    
3. Add them together: $a_n = a_n^{(h)} + a_n^{(p)}$.
    
4. **Crucial:** Apply initial conditions ($a_0, a_1, \dots$) to the _complete_ solution $a_n$ to solve for the constants ($\alpha_1, \alpha_2, \dots$) in the homogeneous part.
    

### Theorem 6: Finding the Particular Solution (Method of Undetermined Coefficients)

If the nonhomogeneous part $F(n)$ takes the form of a polynomial multiplied by an exponential:

$$F(n) = (b_t n^t + b_{t-1}n^{t-1} + \dots + b_0)s^n$$

The trial form for the particular solution $a_n^{(p)}$ depends on whether the base $s$ is a root of the characteristic equation.

- **Case 1: $s$ is NOT a characteristic root.**
    
    The particular solution takes the same general form as $F(n)$:
    
    $$a_n^{(p)} = (p_t n^t + p_{t-1}n^{t-1} + \dots + p_0)s^n$$
    
- **Case 2: $s$ IS a characteristic root with multiplicity $m$.**
    
    Multiply the standard trial form by $n^m$ to ensure linear independence from the homogeneous solution:
    
    $$a_n^{(p)} = n^m (p_t n^t + p_{t-1}n^{t-1} + \dots + p_0)s^n$$
    

_Note: If $F(n)$ is a sum of multiple distinct functions (e.g., $F(n) = 2^n + 3n$), find a particular solution for each part separately and sum them together (Superposition)._

---

## 3. Simultaneous Recurrence Relations

When dealing with a system of recurrence relations (e.g., sequences $a_n$ and $b_n$ defined in terms of each other):

1. Use substitution to express one sequence in terms of the other.
    
2. Substitute this expression back into the remaining equation to create a single, higher-order recurrence relation containing only one variable.
    
3. Solve this new relation using standard characteristic equation methods.
    
4. Substitute the explicit formula back into the isolated equation to find the explicit formula for the second sequence.