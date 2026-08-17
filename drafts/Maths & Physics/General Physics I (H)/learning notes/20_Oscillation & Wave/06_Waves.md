# 06_Waves

## 1. Introduction to Waves

### Three Main Types of Waves

1. **Mechanical Waves**: Require a medium (e.g., water, sound, seismic waves).

2. **Electromagnetic Waves**: Do not require a medium (e.g., visible light, radio waves).

3. **Matter Waves**: The quantum mechanical view of fundamental particles.

### Classification by Direction of Propagation ($\vec{v}$)

- **Transverse Wave**: The displacement is perpendicular to the direction of wave travel ($\Delta\vec{y} \perp \vec{v}$).

    - _Example_: A wave on a string attached to a wall.

- **Longitudinal Wave**: The displacement is parallel to the direction of wave travel ($\Delta\vec{y} \parallel \vec{v}$).

    - _Example_: A stretched and compressed spring attached to a wall.

### Requirements for Mechanical Waves

To generate and propagate a mechanical wave, three conditions must be met:

1. A source of disturbance.

2. A medium.

3. A physical connection between adjacent portions of the medium.

### Basic Variables of Periodic Waves

Similar to simple harmonic motion, periodic waves are described by:

- **Amplitude ($A$)**

- **Frequency ($f$)**

- **Angular Frequency ($\omega$)**

- **Period ($T$)**

- **Wavelength ($\lambda$)**: The distance between points whose oscillations differ by $2\pi$.

---

## 2. 1D Travelling Waves and Superposition

### Mathematical Description

For a 1D travelling wave, the displacement $y$ is a function of both position $x$ and time $t$:

$$
y = f(x, t)
$$

- **Right-moving pulse**: $y = f(x - vt)$

- **Left-moving pulse**: $y = f(x + vt)$

- $v$: Wave speed (波速 / 相位速度).

### Principle of Superposition

**Linear waves** are waves that obey the superposition principle. When waves overlap, they add up algebraically:

$$
y'(x, t) = y_1(x, t) + y_2(x, t)
$$

- **Interference**: The phenomenon of combining waves.

    - **Constructive Interference (相长干涉 / 建设性干涉)**: Pulses with the same sign add together to create a larger amplitude.

    - **Destructive Interference (相消干涉 / 破坏性干涉)**: Pulses with opposite signs add together to momentarily cancel each other out.

---

## 3. Reflection and Transmission

### Reflection (Upon Change of Medium)

- **Fixed Boundary**: When a wave pulse hits a fixed wall, it exerts a force on the wall, and the wall exerts an equal and opposite downward force on the string (Newton's Third Law). As a result, the **pulse inverts upon reflection**.

![[GP-Waves1.png]]

- schematic diagram from the hand-written notes of Mr. ztWang

- **Free Boundary**: When a string is attached to a ring that slides freely on a frictionless vertical rod, the vertical force is zero. The **pulse does not invert upon reflection**.

![[GP-Waves2.png]]

### Transmission Between Different Media

- **Light string to Heavy string**: Behaves similarly to a fixed boundary. The transmitted pulse is upright (but slower/shorter), and the reflected pulse is **inverted**.

- **Heavy string to Light string**: Behaves similarly to a free boundary. The transmitted pulse is upright (faster/longer), and the reflected pulse is **upright**.

![[GP-Waves3.png]]

---

## 4. The Linear Wave Equation

### Derivation 1: Mechanical Waves in a Monoatomic Crystal (Phonon)

Consider atoms in a crystal with an equilibrium lattice spacing $a$.

- Equilibrium position: $X_n = na$

- Deviation from equilibrium: $u_n = x_n - X_n$

Modeling nearest neighbor interaction (potential energy) with a spring constant $K$:

$$
\phi(x_{n+1} - x_n) = \phi_0 + \frac{1}{2}K(x_{n+1} - x_n - a)^2 + \dots = \phi_0 + \frac{1}{2}K(u_{n+1} - u_n)^2 + \dots
$$

$$
U^{total} \approx \frac{K}{2} \sum_n (u_{n+1} - u_n)^2
$$

Using Newton's Second Law for the $n$-th atom ($F_n = m\ddot{u}_n$):

$$
m\ddot{u}_n = K(u_{n+1} - u_n) - K(u_n - u_{n-1})
$$

$$
m\ddot{u}_n = Ka \frac{u_{n+1} - u_n}{a} - Ka \frac{u_n - u_{n-1}}{a}
$$

Taking the continuum limit as $a \to 0$:

$$
m\ddot{u}_n \approx Ka \left. \frac{\partial u}{\partial x} \right|_{x_n + a/2} - Ka \left. \frac{\partial u}{\partial x} \right|_{x_n - a/2} = Ka^2 \left. \frac{\partial^2 u}{\partial x^2} \right|_{x_n}
$$

This yields the wave equation:

$$
\frac{\partial^2 u}{\partial t^2} = v^2 \frac{\partial^2 u}{\partial x^2} \quad \text{where} \quad v = a\sqrt{\frac{K}{m}}
$$

> **Note on Continuum Limit:** > The physical meaning of the limit $a \to 0$ is $\lambda \gg a$ (wavelength is much larger than the lattice spacing), or equivalently $k \ll \frac{2\pi}{a}$.

### Derivation 2: Wave on a String (Small Amplitude)

For a string with mass per unit length $\mu$ and tension $T$:

Applying Newton's second law to a small segment $\Delta x$:

$$
\mu \Delta x \frac{\partial^2 y}{\partial t^2} \approx T \Delta x \left. \frac{\partial^2 y}{\partial x^2} \right|_x
$$

$$
\frac{\partial^2 y}{\partial t^2} = \frac{T}{\mu} \frac{\partial^2 y}{\partial x^2} \equiv v^2 \frac{\partial^2 y}{\partial x^2} \quad \text{where} \quad v = \sqrt{\frac{T}{\mu}}
$$

### The General Linear Wave Equation

The generalized form applies to various physical systems:

$$
\frac{\partial^2 y}{\partial t^2} = v^2 \frac{\partial^2 y}{\partial x^2}
$$

- **Sound wave**: $y$ = displacement of air molecule.

- **Wave on a string**: $y$ = vertical displacement.

- **Electromagnetic wave**: $y$ = electric or magnetic field.

### Verifying Solutions

The obvious solutions are $y = f(x - vt)$ (right-moving) and $y = f(x + vt)$ (left-moving).

To check $f(x - vt)$:

- Time derivatives: $\frac{\partial y}{\partial t} = -vf'(x - vt) \implies \frac{\partial^2 y}{\partial t^2} = v^2 f''(x - vt)$

- Spatial derivatives: $\frac{\partial y}{\partial x} = f'(x - vt) \implies \frac{\partial^2 y}{\partial x^2} = f''(x - vt)$

    Substituting these back verifies the equation: $\frac{\partial^2 y}{\partial t^2} = v^2 \frac{\partial^2 y}{\partial x^2}$.
