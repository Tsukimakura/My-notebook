### 1. Fundamental Concepts & Definitions

- **Point Particle** (质点)
    
- **Displacement** (位移): $\Delta x$
    
- **Average Velocity:**
    
    $$v_{avg} = \frac{x_2 - x_1}{t_2 - t_1}$$
    
- **Average Speed:**
    
    $$s_{avg} = \frac{\text{total distance}}{t_2 - t_1}$$
    
- **Instantaneous Velocity:**
    
    $$v = \lim_{\Delta t \to 0} \frac{\Delta x}{\Delta t} = \frac{dx}{dt}$$
    
- **Instantaneous Speed:**
    
    $$|v| \ge 0$$
    
- **Average Acceleration:**
    
    $$a_{avg} = \frac{v_2 - v_1}{t_2 - t_1}$$
    
- **Instantaneous Acceleration:**
    
    $$a = \lim_{\Delta t \to 0} \frac{\Delta v}{\Delta t} = \frac{dv}{dt} = \frac{d^2x}{dt^2}$$
    
- **Dimension** (量纲)
    

---

### 2. Deriving Velocity from Acceleration

- For a given $a(t)$:
    
    $$dv = a(t)dt$$
    
- Integrating both sides:
    
    $$v(t) = \int_{t_i}^t a(t') dt' + C_1$$
    
- Applying the initial condition $v(t_i) = v_i$ (where "$i$" stands for initial):
    
    $$C_1 = v_i$$
    
- **Final Velocity Equation:**
    
    $$v(t) = \int_{t_i}^t a(t') dt' + v_i$$
    

---

### 3. Deriving Position from Velocity

- For a given $v(t)$:
    
    $$x(t) = \int_{t_i}^t v(t') dt' + x_i$$
    
- Substituting the expression for $v(t')$ derived in Part 2:
    
    $$x(t) = \int_{t_i}^t dt' \left[ \int_{t_i}^{t'} a(t'') dt'' + v_i \right] + x_i$$
    
- Expanding the integral gives the **Final Position Equation**:
    
    $$x(t) = x_i + (t - t_i)v_i + \int_{t_i}^t dt' \int_{t_i}^{t'} dt'' a(t'')$$
    

---

### 4. Application: Constant Acceleration

This section applies the general integral formulas to the specific case where acceleration is constant ($a(t) = a$).

**Velocity under constant acceleration:**

- Apply the formula: $v(t) = \int_{t_i}^t a(t') dt' + v_i$
    
- Evaluating the integral:
    
    $$v(t) = (t - t_i)a + v_i$$
    
    > _Note:_ If we set $t_i = 0$, this simplifies to the standard form: $v(t) = v_0 + at$.
    > 
    > The notes include a sketch of a $v(t)$ vs $t$ graph, showing a straight line through $(t_i, v_i)$ with a constant slope equal to $a$.
    

**Position under constant acceleration:**

- Setting the standard initial conditions: $t_i = 0$, $x_i = x_0$, $v_i = v_0$, and $a(t) = a$
    
- Substitute into the position formula:
    
    $$x(t) = x_0 + v_0t + a \int_{0}^{t} t' dt'$$
    
    $$x(t) = x_0 + v_0t + \frac{1}{2}at^2$$
    

**Other useful forms (Deriving the Time-Independent Equation):**

- Using average velocity to find displacement:
    
    $$x(t) - x_0 = \frac{1}{2}(v_0 + v_f)t$$
    
- Substitute $t = \frac{v_f - v_0}{a}$ into the equation:
    
    $$x(t) - x_0 = \frac{1}{2}(v_0 + v_f) \left( \frac{v_f - v_0}{a} \right)$$
    
    $$x(t) - x_0 = \frac{v_f^2 - v_0^2}{2a}$$
    

**Dimension Analysis**

- $$[x(t) - x_0] = \left[\frac{1}{2}(v_0 + v_f)t\right] = L$$
    
- $$\Rightarrow [v][t] = L \Rightarrow [v] = L/T$$
    

---

### 5. Application: Non-constant Acceleration

This shows how to find velocity when acceleration changes with time according to a power law.

- Given: $a(t) = at^\alpha$ _(Note: If $\alpha = 0 \Rightarrow$ constant acceleration)_
    
- Suppose $\alpha > 0$.
    
- To find velocity:
    
    $$v(t) = \int_{t_i}^t a(t') dt' + v_i$$
    
    $$= a \int_{t_i}^t (t')^\alpha dt' + v_i$$
    
    $$= \frac{a}{\alpha + 1} (t')^{\alpha+1} \Big|_{t_i}^t + v_i$$
    
    $$= \frac{a}{\alpha + 1} (t^{\alpha+1} - t_i^{\alpha+1}) + v_i$$
    

---

### 6. Significant Figures (有效数字)

Rules for counting and calculating with significant figures:

- **Leading zeros:** Not counted
    
- **Trailing zeros:** Counted
    
- **Addition/Subtraction:** The result is rounded to the same decimal place as the number with the _first uncertain digit_ (least precise decimal place).
    
    - _Example:_
        
        $213.25+16.\underline{1}+ 0.124 = xxx.\underline{x}xx \rightarrow$ Result has 4 sig figs (e.g., $229.5$)
        
- **Multiplication/Division:** The result has the same number of significant figures as the term with the _least sig figs_.
    
    - _Example:_ $325.78 \times 0.0145 \div 789.2 = 0.00599$
        
        - $325.78$ (5 sig figs)
            
        - $0.0145$ (3 sig figs) $\leftarrow$ _Least sig figs_
            
        - $789.2$ (4 sig figs)
            
        - Result: $0.00599$ (3 sig figs)
            

---

### 7. Uncertainty Propagation (不确定性/误差传递)

This section covers how uncertainties (errors) in individual variables propagate into the final calculated result.

#### General Formula

For a function $y = y(x_1, x_2, \dots, x_n)$, the absolute uncertainty $\Delta y$ is given by:

- $$\Delta y = \sqrt{\left(\frac{\partial y}{\partial x_1}\right)^2 (\Delta x_1)^2 + \left(\frac{\partial y}{\partial x_2}\right)^2 (\Delta x_2)^2 + \dots}$$
    

#### Specific Cases

- **Addition ($y = x_1 + x_2$):**
    
    $$\Delta y = \sqrt{(\Delta x_1)^2 + (\Delta x_2)^2}$$
    
- **Multiplication ($y = x_1 x_2$):**
    
    $$\Delta y = \sqrt{(x_2 \Delta x_1)^2 + (x_1 \Delta x_2)^2}$$
    
    - Relative uncertainty form:
        
        $$\Rightarrow \frac{\Delta y}{|y|} = \sqrt{\left(\frac{\Delta x_1}{x_1}\right)^2 + \left(\frac{\Delta x_2}{x_2}\right)^2}$$
        
- **Division ($y = x_1 / x_2$):**
    
    $$\Delta y = \sqrt{\left(\frac{1}{x_2} \Delta x_1\right)^2 + \left(\frac{x_1}{x_2^2} \Delta x_2\right)^2}$$
    
    - Relative uncertainty form (matches multiplication):
        
        $$\Rightarrow \frac{\Delta y}{|y|} = \sqrt{\left(\frac{\Delta x_1}{x_1}\right)^2 + \left(\frac{\Delta x_2}{x_2}\right)^2}$$
        

#### Numerical Example

Calculating the product and uncertainty for $(5.5 \pm 0.1) \times (6.4 \pm 0.1)$:

- **Result:** $= 35 \pm 1$
    
- **Uncertainty Calculation ($\Delta y$):** The uncertainty value of $1$ is calculated using the relative uncertainty formula rearranged for $\Delta y$:
    
    $$\Delta y = \sqrt{\left(\frac{0.1}{5.5}\right)^2 + \left(\frac{0.1}{6.4}\right)^2} \times 35$$
    
