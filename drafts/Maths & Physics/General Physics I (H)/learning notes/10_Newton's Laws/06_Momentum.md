# 06_Momentum

## **Conservation of Momentum**

### **1. Invariance of the Work-Kinetic Energy Theorem**

The Work-Kinetic Energy Theorem states: $K_f - K_i = W$.

We can demonstrate that this theorem holds across different inertial frames under a Galilean transformation.

**Galilean Transformation:**

Consider a frame moving with constant velocity $\vec{v}_0$. The transformations for position, velocity, and acceleration are:

- $\vec{r}' = \vec{r} - \vec{v}_0 t$

- $\vec{v}' = \vec{v} - \vec{v}_0$

- $\vec{a}' = \vec{a}$

**Proof (Assuming 1D motion and constant force):**

In the original frame, work is $W = Fd$.

In the moving frame, displacement is $d' = d - v_0 t$, so the work is:

$$
W' = Fd' = F(d - v_0 t)
$$

The kinetic energy in the moving frame is $K' = \frac{1}{2}m(v')^2 = \frac{1}{2}m(v - v_0)^2 = K - v_0mv + \frac{1}{2}mv_0^2$.

The change in kinetic energy in the moving frame is:

$$
K_f' - K_i' = K_f - K_i - v_0m(v_f - v_i) = Fd - v_0m(v_f - v_i)
$$

Rewriting $Fd$ in terms of $d'$:

$$
K_f' - K_i' = F(d' + v_0 t) - v_0m(v_f - v_i) = W' + v_0[Ft - m(v_f - v_i)]
$$

From kinematics, under constant acceleration, $v_f = v_i + at \Rightarrow m(v_f - v_i) = mat = Ft$. Therefore, the bracketed term is zero.

$$
\Rightarrow K_f' - K_i' = W'
$$

**Conclusion:** The Work-Kinetic Energy Theorem always holds, regardless of the inertial reference frame.

---

### **2. Linear Momentum and Impulse**

- **Linear Momentum:** Defined as $\vec{p} \equiv m\vec{v}$

- **Impulse:** Defined as the integral of force over time: $\vec{I} \equiv \int_{t_i}^{t_f} \vec{F} dt$

**Impulse-Momentum Theorem:** $\vec{I} = \vec{p}_f - \vec{p}_i$

_Proof:_

Starting from Newton's Second Law: $\vec{F} = m\frac{d\vec{v}}{dt} \Rightarrow \vec{F} = \frac{d\vec{p}}{dt}$ (differential form).

Integrating both sides: $\int_{t_i}^{t_f} \vec{F} dt = \int_{\vec{p}_i}^{\vec{p}_f} d\vec{p} \Rightarrow \vec{I} = \vec{p}_f - \vec{p}_i$.

_(Example: For a constant force, $\vec{F}t = m(\vec{v}_f - \vec{v}_i)$, as used in the Galilean proof.)_

---

### **3. Conservation of Linear Momentum**

**Isolated Two-Particle System:**

Consider particles $m_1$ and $m_2$ interacting with forces $\vec{F}_{12}$ (on 1 by 2) and $\vec{F}_{21}$ (on 2 by 1).

$$
\vec{F}_{21} = \frac{d\vec{p}_1}{dt}, \quad \vec{F}_{12} = \frac{d\vec{p}_2}{dt}
$$

By Newton's Third Law, $\vec{F}_{21} = -\vec{F}_{12}$, which means:

$$
\frac{d\vec{p}_1}{dt} + \frac{d\vec{p}_2}{dt} = 0 \Rightarrow \vec{p}_1 + \vec{p}_2 = \text{constant} \Rightarrow \vec{p}_{1i} + \vec{p}_{2i} = \vec{p}_{1f} + \vec{p}_{2f}
$$

**Generalization:**

For any system, if the system is **closed** (no particles enter/leave) and **isolated** (no net external force), the total linear momentum is conserved:

$$
\vec{P} = \sum_i \vec{p}_i = \text{constant}
$$

**Origin of Conservation Laws (Symmetry):**

- Energy conservation stems from _time translation invariance_.

- Linear momentum conservation stems from _spatial translation invariance_.

    _(Formal proofs are covered in advanced Theoretical Mechanics)._

---

### **4. Collisions**

During a collision, internal forces ($\vec{F}_{12}$ and $\vec{F}_{21}$) are equal and opposite, resulting in equal and opposite impulses. Therefore, the total momentum of the isolated system is conserved: $\vec{P} = \vec{p}_1 + \vec{p}_2 = \text{constant}$.

**Kinetic energy is NOT necessarily conserved in collisions.**

- **Elastic collision:** Kinetic energy is conserved ($K_i = K_f$).

- **Inelastic collision:** Kinetic energy is lost ($K_i > K_f$).

#### **Perfectly Inelastic Collisions**

Objects stick together and share a final velocity: $\vec{v}_{1f} = \vec{v}_{2f} = \vec{v}_f$.

- **Momentum Conservation:** $\vec{v}_f = \frac{m_1\vec{v}_{1i} + m_2\vec{v}_{2i}}{m_1 + m_2}$

- **Loss of Kinetic Energy:**

    $$
K_i - K_f = \frac{1}{2}m_1v_{1i}^2 + \frac{1}{2}m_2v_{2i}^2 - \frac{1}{2}(m_1+m_2)v_f^2 = \frac{m_1 m_2}{2(m_1+m_2)} (\vec{v}_{1i} - \vec{v}_{2i})^2
    $$

    This value is strictly $>0$ unless $\vec{v}_{1i} = \vec{v}_{2i}$ (in which case no collision occurs).

_Example Applications:_

1. **Ballistic Pendulum:** A mass $m_1$ at $v_{1i}$ embeds into $m_2$ at rest. The system swings to height $h$.

        $$
    v_f = \frac{m_1 v_{1i}}{m_1 + m_2} \Rightarrow h = \frac{v_f^2}{2g} = \frac{m_1^2 v_{1i}^2}{2(m_1+m_2)^2 g}
        $$

2. **Spring Deformation:** Mass $m_1$ ($v_{1i}$) strikes $m_2$ ($v_{2i}$) through a spring $k$, where $v_{1i} > v_{2i}$.

    Maximal deformation $x$ occurs when velocities are momentarily equal (acting as a perfectly inelastic collision).

    $$
\Delta K = \frac{1}{2}kx^2 \Rightarrow x = \sqrt{\frac{m_1 m_2}{k(m_1+m_2)}} (v_{1i} - v_{2i})
    $$

#### **Elastic Collisions**

- **1D Elastic Collision (Head-to-head):**

    Solving energy and momentum conservation equations yields:

    $$
v_{1f} = \frac{m_1 - m_2}{m_1 + m_2}v_{1i} + \frac{2m_2}{m_1 + m_2}v_{2i}
    $$

    $$
v_{2f} = \frac{2m_1}{m_1 + m_2}v_{1i} + \frac{m_2 - m_1}{m_1 + m_2}v_{2i}
    $$

    _Special Cases (assuming target $m_2$ is initially at rest, $v_{2i} = 0$):_

    - $m_1 \ll m_2$: $v_{1f} \approx -v_{1i}$, $v_{2f} \approx 0$ (Light object bounces off).

    - $m_1 \gg m_2$: $v_{1f} \approx v_{1i}$, $v_{2f} \approx 2v_{1i}$ (Heavy object plows through).

    - $m_1 = m_2$: $v_{1f} = v_{2i}$, $v_{2f} = v_{1i}$ (Velocities exchange).

- **2D Elastic Collision:**

    Requires considering momentum in x and y directions separately alongside energy conservation. Yields 3 equations for 4 unknowns ($v_{1f}, v_{2f}, \theta, \phi$), requiring an extra constraint to solve.

    _Special case:_ If $m_1 = m_2$ and target is at rest, the final velocity vectors are always orthogonal ($\vec{v}_{1f} \cdot \vec{v}_{2f} = 0$).

---

### **5. Center of Mass (CM)**

The Center of Mass represents the mean position of the mass distribution.

- **Many-particle system:** $\vec{r}_{CM} \equiv \frac{\sum m_i \vec{r}_i}{\sum m_i}$

- **Extended object:** $\vec{r}_{CM} = \frac{\int \vec{r} dm}{M} = \frac{\int \vec{r} \rho dV}{M}$

**Examples of calculating CM:**

1. **Uniform Rod** (Length $L$): $x_{CM} = \frac{\int_0^L \lambda x dx}{\int_0^L \lambda dx} = \frac{1}{2}L$

2. **Non-uniform Rod** ($\lambda(x) = \alpha x$): $x_{CM} = \frac{\int_0^L (\alpha x) x dx}{\int_0^L (\alpha x) dx} = \frac{2}{3}L$

3. **Uniform Right Triangle** (Base $a$, height $b$): Utilizing double integration over area, $x_{CM} = \frac{2}{3}a$, $y_{CM} = \frac{1}{3}b$.

**Motion of a System of Particles:**

Taking derivatives of $\vec{r}_{CM} = \frac{\sum m_i \vec{r}_i}{M}$:

- **Velocity:** $\vec{v}_{CM} \equiv \frac{d\vec{r}_{CM}}{dt} = \frac{\sum \vec{p}_i}{M} = \frac{\vec{P}_{tot}}{M}$

- **Acceleration:** $\vec{a}_{CM} \equiv \frac{d\vec{v}_{CM}}{dt} = \frac{\sum \vec{F}_i}{M}$

    This leads to Newton's Second Law for a system: $\sum \vec{F}_{ext} = M\vec{a}_{CM} = \frac{d\vec{P}_{tot}}{dt}$. (Note: All internal forces cancel out).

---

### **6. The Center of Mass Frame**

#### **König's Theorem**

The total kinetic energy of a system is the sum of the kinetic energy of the Center of Mass (bulk motion) and the internal kinetic energy relative to the CM.

$$
E_K = E_{k, cm} + E_K'
$$

_Proof:_ Let particle velocities in the CM frame be $\vec{v}_i' = \vec{v}_i - \vec{v}_{CM}$.

$E_K = \sum \frac{1}{2}m_i (\vec{v}_{CM} + \vec{v}_i') \cdot (\vec{v}_{CM} + \vec{v}_i') = \frac{1}{2}M v_{CM}^2 + \frac{1}{2}\sum m_i(v_i')^2 + \vec{v}_{CM} \cdot \sum m_i \vec{v}_i'$.

Since $\sum m_i \vec{r}_i' = 0$ by definition of the CM frame, its derivative $\sum m_i \vec{v}_i'$ is also zero. This eliminates the cross term, proving the theorem.

#### **Momentum in the CM Frame**

The total momentum of any system evaluated _within_ its own Center of Mass frame is always zero.

$$
\vec{P}' = \sum \vec{p}_i' = 0
$$

#### **Collisions in the CM Frame**

Analyzing collisions in the CM frame simplifies the math significantly.

- **1D Elastic Collision:**

    Particles approach with initial momenta $\vec{p}_{1i}' = -\vec{p}_{2i}'$.

    After an elastic collision, their velocities simply reverse direction:

    $$
\vec{v}_{1f}' = -\vec{v}_{1i}' \quad \text{and} \quad \vec{v}_{2f}' = -\vec{v}_{2i}'
    $$

- **2D Elastic Collision:**

    In the original frame, particles scatter at complex angles. In the CM frame, particles _always_ approach head-on and recede back-to-back. Energy conservation dictates that the magnitudes of their velocities remain unchanged; the collision merely rotates the axis of their back-to-back trajectory.
