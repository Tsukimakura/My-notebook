# 03_Energy&Momentum

## 1. Relativistic Momentum

In classical Newtonian mechanics, both momentum and energy are conserved in a closed system. When generalizing to Special Relativity, the definition of momentum must be modified to ensure that momentum conservation holds in all inertial reference frames.

The relativistic momentum $\vec{p}$ is defined as:

$$
\vec{p} = \frac{m_0}{\sqrt{1 - v^2/c^2}} \vec{v}
$$

where $m_0$ is the rest mass of the object and $\vec{v}$ is its velocity.

### Proof of Conservation: Elastic Collision of Identical Balls

To verify this formula, consider the elastic collision of two identical balls, analyzed from two different inertial frames.

**In the $K'$ Frame (moving at velocity $v$ relative to $K$):**

- **Before Collision:** Ball 1 moves right with velocity $v$; Ball 2 moves left with velocity $v$.

- **After Collision:** Ball 1 moves up with velocity $v$; Ball 2 moves down with velocity $v$.

- By symmetry, momentum is conserved in the $K'$ frame: $\vec{p_1}' + \vec{p_2}' = 0$ both before and after the collision.

**In the $K$ Frame (Track Frame):**

Using relativistic velocity transformation equations:

$$
u_x = \frac{u_x' + v}{1 + u_x'v/c^2}, \quad u_y = \frac{u_y'}{\gamma(1 + u_x'v/c^2)}, \quad u_z = \frac{u_z'}{\gamma(1 + u_x'v/c^2)}
$$

- **Before Collision:**

    - Ball 1 velocity $w = \frac{v + v}{1 + v^2/c^2} = \frac{2v}{1 + v^2/c^2}$

    - Ball 2 velocity is 0.

- **After Collision:**

    - Ball 1: $u_{x1} = \frac{0 + v}{1 + 0} = v$, and $u_{y1} = \frac{v}{\gamma(1 + 0)} = v\sqrt{1 - v^2/c^2}$. Its total speed is $u \equiv v\sqrt{2 - v^2/c^2}$.

    - Ball 2 moves symmetrically downwards.

**Checking Conservation in $K$ Frame:**

- _Using Non-Relativistic Momentum ($\vec{p} = m_0\vec{v}$):_

    - Before: $p_{tot}^{(b)} = m_0 w = \frac{2m_0 v}{1 + v^2/c^2}$

    - After: $p_{tot}^{(a)} = 2m_0 v$ (since $u_x = v$ for both balls).

    - $p_{tot}^{(b)} \neq p_{tot}^{(a)} \Rightarrow$ classical momentum conservation is **broken**.

- _Using Relativistic Momentum:_

    - Before: $p_{tot}^{(b)} = \frac{m_0}{\sqrt{1 - w^2/c^2}} w = \frac{2m_0 v}{1 - v^2/c^2}$

    - After: $p_{tot}^{(a)} = \frac{m_0}{\sqrt{1 - u^2/c^2}} v + \frac{m_0}{\sqrt{1 - u^2/c^2}} v = \frac{2m_0 v}{1 - v^2/c^2}$

    - $p_{tot}^{(b)} = p_{tot}^{(a)} \Rightarrow$ relativistic momentum is **conserved**.

_(Note: For $v \ll c$, $\vec{p} \approx m_0 \vec{v}$, recovering the non-relativistic formula)._

## 2. Relativistic Force and Work-Kinetic Energy Theorem

### Relativistic Force

Force is defined as the rate of change of momentum (Impulse-Momentum Theorem):

$$
\vec{F} = \frac{d\vec{p}}{dt} = \frac{d}{dt} \left( \frac{m_0}{\sqrt{1 - v^2/c^2}} \vec{v} \right)
$$

- $\vec{F}$ changes across different inertial frames.

- Newton's second law in the form $\vec{F} = m\vec{a}$ **no longer holds**.

### Deriving the Work-Kinetic Energy Theorem

The work done on an object equals the change in its kinetic energy: $W = E_b - E_a$.

$$
W = \int_a^b \vec{F} \cdot d\vec{r} = \int_a^b \frac{d\vec{p}}{dt} \cdot d\vec{r} = \int_a^b d\vec{p} \cdot \vec{v} = \int_a^b \frac{\vec{p}}{m} \cdot d\vec{p}
$$

By defining $m \equiv \frac{m_0}{\sqrt{1 - (v/c)^2}}$, we can manipulate the momentum equation $\vec{p} = m\vec{v}$:

$$
m^2 c^2 - p^2 = m_0^2 c^2
$$

Differentiating this invariant expression yields:

$$
m c^2 dm = p dp = \vec{p} \cdot d\vec{p}
$$

Substituting this back into the work integral:

$$
W = \int_a^b c^2 dm = m c^2 - m_0 c^2
$$

where at state $a$, velocity is 0 ($m = m_0$), and at state $b$, velocity is $v$ ($m = m$).

### Energy Definitions

From the theorem above, we define the fundamental energy quantities:

- **Total Energy:** $E = \frac{m_0}{\sqrt{1 - (v/c)^2}} c^2$

- **Rest Energy:** $E_0 = m_0 c^2$

- **Kinetic Energy:** $E_k = m c^2 - m_0 c^2$

_(Note: When $v \ll c$, using a binomial expansion, $E_k \approx m_0 c^2 [1 + \frac{1}{2}(v/c)^2] - m_0 c^2 = \frac{1}{2}m_0 v^2$, safely recovering the classical kinetic energy)._

## 3. Four-Vectors and Mass-Energy Equivalence

### 4-Momentum and Invariance

We can unify momentum ($\vec{p}$) and energy ($E$) using the relativistic mass $m$:

$$
\vec{P} = \left( \frac{E}{c}, p_x, p_y, p_z \right)
$$

The squared magnitude of this 4-vector is a **Lorentz invariant** across all frames:

$$
\left( \frac{E}{c} \right)^2 - p^2 = m_0^2 c^2
$$

Similarly, the spacetime 4-vector is $(ct, x, y, z)$, yielding the invariant interval:

$$
s^2 \equiv (ct)^2 - x^2 - y^2 - z^2
$$

### Mass-Energy Equivalence ($E = mc^2$)

Changes in mass directly correspond to changes in energy. A practical example is nuclear fission.

**Fission of Uranium-235:**

$$
^1_0n + ^{235}_{92}U \rightarrow ^{141}_{56}Ba + ^{92}_{36}Kr + 3 ^1_0n
$$

- **Mass reduction:** Calculating the atomic masses (where 1u $\approx 1.66 \times 10^{-27}$ kg) yields a mass defect of approximately $-0.18$ u, or roughly $3 \times 10^{-28}$ kg per fission event.

- **Energy release:** For one mole of U-235 (~235 grams), the energy released is:

    $$
E = (3 \times 10^{-28} \text{ kg}) \times (3 \times 10^8 \text{ m/s})^2 \times (6.02 \times 10^{23}) \approx 1.6 \times 10^{13} \text{ J}
    $$

    This is equivalent to roughly $4.4 \times 10^6$ kWh of electrical energy per mole.

## 4. The Twin Paradox

**The Scenario:**

- **Frank** stays on Earth.

- **Mary** flies to $\alpha$-Centauri (4 light-years away) at $v = 0.8c$. The one-way trip takes 5 years in the Earth frame.

**The Paradox:**

- **Earth Frame (Frank):** After 10 years, Mary returns. Frank has aged 10 years. Due to time dilation, Mary's clock slowed down ($\sqrt{1 - 0.8^2} = 0.6$), so Mary aged $10 \times 0.6 = 6$ years.

- **Spacecraft Frame (Mary):** Mary observes the distance contracted to $L = 4 \times 0.6 = 2.4$ light-years. The round trip takes her 6 years. She observes Frank moving relative to her, so she believes Frank's clock should be slowed down, making him $6 \times 0.6 = 3.6$ years old.

### Resolution 1: Frame Shifts (Minkowski Diagram Analysis)

The paradox arises because Mary is not in a single inertial frame; she must accelerate to turn around. We assume the turnaround time is negligible, meaning Mary instantaneously jumps from an outbound frame ($K'$) to an inbound frame ($K''$).

- **First Half (Outbound):** At Mary's turnaround (Event B, $t' = 3$ years), she calculates the simultaneous time on Earth (Event C) in her frame. Using the Lorentz transformation, $t_c = 3.2$ years. From Mary's perspective, Frank's clock did indeed run slow ($5$ years $- 3.2$ years $= 1.8$ years, matching the $0.6$ dilation factor).

- **The Frame Jump:** When Mary jumps from frame $K'$ to $K''$, her "line of simultaneity" drastically shifts. Earth time jumps forward from Mary's calculated simultaneous perspective. The missing time for Frank is accounted for during this frame shift. Ultimately, when she returns (Event D), they both agree: Frank aged 10 years, Mary aged 6.

### Resolution 2: Doppler Effect of Light (Observational)

A paradox-free way to analyze the situation is to look at physical signals (e.g., radio pulses) sent by Frank and Mary every year, utilizing the relativistic Doppler effect:

$$
f = \sqrt{\frac{1 \mp v/c}{1 \pm v/c}} f_0
$$

**From Frank's Perspective:**

- Frank sends 10 signals total (1 per year). He ages 10 years.

- Mary sends 1 signal per spacecraft year (6 signals total).

**Signal Reception Analysis:**

1. **Outbound (Receding):** Both receive signals at a redshifted frequency $f = \sqrt{\frac{1 - 0.8}{1 + 0.8}} f_0 = \frac{1}{3} f_0$. They observe 1 signal every 3 years.

2. **Inbound (Approaching):** Both receive signals at a blueshifted frequency $f = \sqrt{\frac{1 + 0.8}{1 - 0.8}} f_0 = 3 f_0$. They observe 3 signals per year.

Because Mary changes direction halfway through _her_ trip (at year 3), she receives redshifted signals for 3 years, then blueshifted signals for 3 years.

Frank, however, does not change frames. He must wait for the light of Mary's turnaround to reach Earth. He receives redshifted signals for 9 years (accounting for the 5-year journey + 4 years for light to return), and blueshifted signals for only his final 1 year.

By counting the physical signals received, both observers perfectly agree on the elapsed time for each twin without relying on complex frame transformations.
