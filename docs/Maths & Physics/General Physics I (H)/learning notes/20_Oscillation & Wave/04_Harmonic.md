# 04_Harmonic

## 1. Equilibrium Overview

### Conditions for Equilibrium

For a system to be in equilibrium, both its linear momentum ($\vec{P}$) and angular momentum ($\vec{L}$) must remain constant.

1. **Translational Equilibrium**: Net force must be zero.

        $$
    \sum \vec{F}_{net} = 0 \implies \vec{P} = \text{constant}
        $$

2. **Rotational Equilibrium**: Net torque must be zero, measured from **any** arbitrary point.

    $$
\sum \vec{\tau}_{net} = 0 \implies \vec{L} = \text{constant}
    $$

**Static Equilibrium** is a special case where the system is completely at rest:

$$
\vec{P} = 0 \quad \text{and} \quad \vec{L} = 0
$$

### Proof: Independence of Torque Origin in Equilibrium

If a system is in translational equilibrium ($\sum \vec{F}_i = 0$) and rotational equilibrium about an origin $O$ ($\sum \vec{\tau}_{i, O} = 0$), then the net torque about any other arbitrary point $O'$ is also zero.

![[GP-Harmonic1.png]]

- schematic diagram from the hand-written notes of Mr. ztWang

**Proof**:

Let the position vector of point $O'$ relative to $O$ be $\vec{r}'$. The position of the $i$-th force relative to $O'$ is $\vec{r}_{i, O'}$. Thus, the position relative to $O$ is $\vec{r}_{i, O} = \vec{r}' + \vec{r}_{i, O'}$.

$$
\sum_i \vec{\tau}_{i, O} = \sum_i \vec{r}_{i, O} \times \vec{F}_i
$$

$$
= \sum_i (\vec{r}' + \vec{r}_{i, O'}) \times \vec{F}_i
$$

$$
= \vec{r}' \times \left( \sum_i \vec{F}_i \right) + \sum_i \vec{r}_{i, O'} \times \vec{F}_i
$$

Since $\sum_i \vec{F}_i = 0$, the first term vanishes:

$$
0 = 0 + \sum_i \vec{\tau}_{i, O'}
$$

$$
\implies \sum_i \vec{\tau}_{i, O'} = 0
$$

---

## 2. Center of Gravity (COG)

**Definition**: The point at which the total gravitational force $\vec{F}_g$ effectively acts on a body.

**Theorem**: Under uniform gravity, the Center of Gravity (COG) coincides with the Center of Mass (COM).

**Proof**:

The actual net torque due to gravity on all individual mass elements is:

$$
\vec{\tau}_{net} = \sum_i \vec{r}_i \times m_i \vec{g}_i
$$

The effective torque acting at the COG is:

$$
\vec{\tau}_{eff} = \vec{r}_{cog} \times \left( \sum_i m_i \vec{g}_i \right)
$$

For uniform gravity ($\vec{g}_i = \vec{g}$):

$$
\vec{\tau}_{net} = \sum_i m_i \vec{r}_i \times \vec{g}
$$

$$
\vec{\tau}_{eff} = \vec{r}_{cog} \times (M\vec{g})
$$

If we set $\vec{r}_{cog} = \vec{r}_{com} = \frac{\sum m_i \vec{r}_i}{M}$:

$$
\vec{\tau}_{eff} = \frac{1}{M} \left( \sum_i m_i \vec{r}_i \right) \times (M\vec{g}) = \sum_i m_i \vec{r}_i \times \vec{g} = \vec{\tau}_{net}
$$

Therefore, we can treat the entire gravitational force $M\vec{g}$ as acting at a single point (the COG/COM) to calculate net torque.

---

## 3. Static Equilibrium Examples

### Example A: Standing on a Supported Beam

A uniform beam of length $L$ and mass $M$ is hinged to a wall and supported by a wire at an angle $\theta$. A person of mass $m$ stands at a distance $d$ from the wall.

![[GP-Harmonic2.png]]

1. **Torque Balance (around the hinge)**:

        $$
    mgd + Mg\frac{L}{2} = TL\sin\theta \implies T = \frac{mgd + Mg\frac{L}{2}}{L\sin\theta}
        $$

2. **Force Balance**:

    - Horizontal: $N_x = T\cos\theta$

    - Vertical: $N_y = mg + Mg - T\sin\theta$

### Example B: A Leaning Ladder

A uniform ladder of length $L$ and mass $M$ leans against a perfectly smooth wall. What is the minimal angle $\theta$ with the floor required to maintain static equilibrium without slipping?

- **Method 1 (Standard Torque Balance)**:

	![[GP-Harmonic3.png]]

	Take the torque around the top of the ladder (point A). The forces at the bottom are the normal force $N_1$ and static friction $\mu_s N_1$. The normal force from the wall is $N_2$.

    - Vertical Forces: $N_1 = Mg$

    - Horizontal Forces: $N_2 = \mu_s N_1 = \mu_s Mg$

    - Torque around top: $Mg \frac{L}{2} \cos\theta + \mu_s N_1 L \sin\theta = N_1 L \cos\theta$

        Substitute $N_1 = Mg$:

        $$
\mu_s Mg L \sin\theta = \left(Mg L - Mg \frac{L}{2}\right) \cos\theta
        $$

        $$
\mu_s \sin\theta = \frac{1}{2} \cos\theta \implies \tan\theta = \frac{1}{2\mu_s}
        $$

- **Method 2 (Concurrent Forces)**:

	For a body in equilibrium under three non-parallel forces (Gravity, Wall Normal Force, and the Total Floor Reaction), their lines of action must intersect at a single point $D$.

	![[GP-Harmonic4.png]]

    Let $\varphi$ be the angle of the floor reaction force.

    $$
\tan\varphi = \frac{\mu_s N_1}{N_1} = \mu_s
    $$

    From the geometry of the intersection point $D$:

    $$
\tan\varphi = \frac{\frac{L}{2} \cos\theta}{L \sin\theta} = \frac{1}{2}\cot\theta
    $$

    Equating the two:

    $$
\mu_s = \frac{1}{2}\cot\theta \implies \tan\theta = \frac{1}{2\mu_s}
    $$

### Example C: Wheel over a Step

A wheel of radius $R$ and mass $M$ is pulled by a horizontal force $F$ at the top to overcome a step of height $h$.

![[GP-Harmonic5.png]]

- **Q1: Minimal $F$?** Take the torque around the corner of the step.

	The lever arm for $F$ is $(2R - h)$. The lever arm for gravity is determined by the Pythagorean theorem: $\sqrt{R^2 - (R-h)^2}$.

    $$
F(2R - h) = Mg \sqrt{R^2 - (R-h)^2} \implies F = Mg\frac{\sqrt{R^2 - (R-h)^2}}{2R - h}
    $$

![[GP-Harmonic6.png]]

- **Q2: Direction of normal force $\vec{N}$ at the corner?**

	For $\vec{\tau}_{net, c} = 0$, the line of action of the normal force $\vec{N}$ must pass through the intersection of the applied force $F$ and gravity $Mg$ (Concurrent forces theorem).

---

## 4. Simple Harmonic Motion (SHM)

### Stable Equilibrium and Taylor Expansion

A system is in stable equilibrium if:

1. $F = -\frac{dU}{dx} = 0$ (Equilibrium state)

2. $\frac{d^2U}{dx^2} > 0$ (Stable; corresponds to a minimum in the potential energy $U(x)$)

For any potential energy function $U(x)$ near a stable equilibrium point $x_0$, we can apply a Taylor expansion:

$$
U(x) = U(x_0) + \left.\frac{dU}{dx}\right|_{x_0} (x-x_0) + \frac{1}{2} \left.\frac{d^2U}{dx^2}\right|_{x_0} (x-x_0)^2 + \dots
$$

Since $\frac{dU}{dx} = 0$ at equilibrium, for small displacements ($x \sim x_0$):

$$
U(x) \approx U(x_0) + \frac{1}{2}k(x-x_0)^2 \quad \text{where} \quad k = \left.\frac{d^2U}{dx^2}\right|_{x_0}
$$

This represents a **universal family of motion**: Simple Harmonic Motion.

### Equation of Motion

The restoring force is linear:

$$
F = -\frac{dU}{dx} = -k(x-x_0)
$$

$$
a = \frac{F}{m} = -\frac{k}{m}(x-x_0) \implies \ddot{x} = -\frac{k}{m}(x-x_0)
$$

### Kinematic Solutions

The general solution to this differential equation is:

$$
x - x_0 = A \cos(\omega t + \phi)
$$

- **Angular Frequency**: $\omega \equiv \sqrt{\frac{k}{m}}$

- **Amplitude**: $A$

- **Period**: $T \equiv \frac{2\pi}{\omega}$

- **Frequency**: $f \equiv \frac{1}{T} = \frac{\omega}{2\pi}$ (Units: $\text{s}^{-1}$ or Hertz, Hz)

- **Phase Constant**: $\phi$

By taking derivatives, we find velocity and acceleration:

- **Velocity**: $v = -\omega A \sin(\omega t + \phi) = \omega A \cos(\omega t + \phi + \frac{\pi}{2})$

- **Acceleration**: $a = -\omega^2 A \cos(\omega t + \phi) = \omega^2 A \cos(\omega t + \phi + \pi)$

**Key Kinematic Notes:**

1. $a = -\omega^2(x-x_0)$ (Acceleration is strictly proportional to displacement, opposite in sign).

2. $\{x, v, a\}$ share the same frequency $\omega$ but have different phases (shifted by $\pi/2$ increments).

### Energy in SHM

- **Kinetic Energy**:

    $$
K = \frac{1}{2}mv^2 = \frac{1}{2}m\omega^2 A^2 \sin^2(\omega t + \phi) = \frac{1}{2}kA^2 \sin^2(\omega t + \phi)
    $$

- **Potential Energy**:

    $$
U = \frac{1}{2}k(x-x_0)^2 = \frac{1}{2}kA^2 \cos^2(\omega t + \phi)
    $$

- **Total Mechanical Energy**:

    $$
E = K + U = \frac{1}{2}kA^2
    $$

**Energy Frequency (Double Angle Identity)**:

Using trigonometric identities, we can rewrite the energy terms:

$$
K = \frac{1}{2}kA^2 \left( \frac{1 - \cos(2\omega t + 2\phi)}{2} \right)
$$

$$
U = \frac{1}{2}kA^2 \left( \frac{1 + \cos(2\omega t + 2\phi)}{2} \right)
$$

_Note: The kinetic and potential energies oscillate with a frequency of $2\omega$ (twice the frequency of the position/velocity oscillation), transforming completely into one another twice every full period $T$._

![[GP-Harmonic7.png]]
