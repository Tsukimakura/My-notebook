# 04_Work

## **1. Work**

### **1.1 Definitions and Properties**

- **Mechanical Definition:** $W = F d \cos\theta = \vec{F} \cdot \vec{d}$ (for constant force $\vec{F}$ and displacement $\vec{d}$).

- **Energy Transfer Definition:** Energy transferred between an object and a force.

    - Positive work: Energy is transferred _to_ the object.

    - Negative work: Energy is transferred _from_ the object.

- **Unit:** Joule (J) = $N \cdot m$.

**Important Notes:**

1. If displacement $\vec{d} = 0$, then $W = 0$, even if a force $\vec{F}$ is applied.

2. If the force is perpendicular to the displacement ($\vec{F} \perp \vec{d}$), then $W = 0$.

_(Mathematical Reminder: The scalar product of two vectors in an orthonormal basis where $\hat{e}_i \cdot \hat{e}_j = \delta_{ij}$ is given by $\vec{A} \cdot \vec{B} = \sum_i A_i B_i$.)_

### **1.2 Work Done by a Varying Force**

For a force that varies with position, take the limit as $\Delta x \rightarrow 0$ ($\Delta W = F_x \Delta x$). The total work is the integral of the force over the path, representing the area under the $F_x$ vs. $x$ curve:

$$
W = \int_{x_i}^{x_f} F_x dx
$$

### **1.3 Examples of Work**

**Example I: Gravitational Force**

Calculating the work done by gravity as an object moves from $r_i$ to $r_f$.

Given: $F = -1.3 \times 10^{22} / r^2$, $r_i = 1.5 \times 10^{11}\text{ m}$, $r_f = 2.3 \times 10^{11}\text{ m}$.

$$
W = \int_{r_i}^{r_f} \left(\frac{-1.3 \times 10^{22}}{r^2}\right) dr = 1.3 \times 10^{22} \left[ \frac{1}{r} \right]_{r_i}^{r_f}
$$

$$
W = 1.3 \times 10^{22} \left( \frac{1}{2.3 \times 10^{11}} - \frac{1}{1.5 \times 10^{11}} \right) \approx -3 \times 10^{10} \text{ J}
$$

**Example II: Hooke's Law (Force of Springs)**

$$
F_s = -kx
$$

Where $k$ is the force constant (spring constant/stiffness) and $x$ is the displacement from the relaxed position. The negative sign indicates the force always opposes the displacement.

_Measuring $k$:_ Hang a mass $m$ on the spring. At equilibrium, the spring displacement is $d$.

$$
kd = mg \Rightarrow k = mg/d
$$

_Work done by a spring:_

$$
W = \int_{x_i}^{x_f} (-kx) dx = -\frac{1}{2}k(x_f^2 - x_i^2)
$$

- **Case 1:** From $x_i = 0$ to $x_f = x_{max} \Rightarrow W = -\frac{1}{2}kx_{max}^2$

- **Case 2:** From $x_i = 0$ to $x_f = -x_{max} \Rightarrow W = -\frac{1}{2}kx_{max}^2$ (Yields the same sign).

- **Case 3:** From $x_i = -x_{max}$ to $x_f = x_{max} \Rightarrow W = 0$ (Returns to original state, net work is zero).

_Work done by a slow external force:_

If an external force stretches a spring slowly enough that the system remains in equilibrium at all times ($F_{ext} = -F_s$):

$$
W_{ext} = -W_s
$$

---

## **2. Kinetic Energy and the Work-Kinetic Energy Theorem**

**Motivation: Why define Work as $\vec{F} \cdot \vec{d}$?**

Consider a block of mass $m$ accelerating constantly from initial velocity $v_i$ to final velocity $v_f$ over a distance $d$ and time $t$ under a constant force $F$.

Using kinematics:

$$
v_f = v_i + at \Rightarrow a = F/m
$$

$$
d = v_i t + \frac{1}{2}at^2 = \frac{1}{2}(v_i + v_f)t
$$

Eliminating $t$:

$$
v_f = v_i + a \left(\frac{2d}{v_i + v_f}\right) \Rightarrow \frac{1}{2}(v_f^2 - v_i^2) = ad
$$

Substituting $a = F/m$:

$$
\frac{1}{2}mv_f^2 - \frac{1}{2}mv_i^2 = Fd
$$

The right side is Work ($W$). The left side defines the change in a new quantity, Kinetic Energy ($K$).

$$
\text{Definition of Kinetic Energy: } K \equiv \frac{1}{2}mv^2
$$

### **Work-Kinetic Energy Theorem**

The net work done on an object equals its change in kinetic energy. This holds true for any force, constant or non-constant:

$$
K_f - K_i = W \quad (\text{for } \forall F)
$$

**General Proof using Calculus:**

$$
W = \int_{x_i}^{x_f} F dx = \int_{x_i}^{x_f} ma dx = \int_{x_i}^{x_f} m \frac{dv}{dt} dx
$$

Using the chain rule ($\frac{dv}{dt} dx = dv \frac{dx}{dt} = v dv$):

$$
W = \int_{v_i}^{v_f} m v dv = \frac{1}{2}mv_f^2 - \frac{1}{2}mv_i^2
$$

---

## **3. Power**

Power is the time rate at which work is done.

- **Average Power:** $P_{avg} = \frac{W}{\Delta t}$

- **Instantaneous Power:** $P = \frac{dW}{dt}$

- **For a constant force:** $P = \vec{F} \cdot \frac{d\vec{r}}{dt} = \vec{F} \cdot \vec{v}$

**Units of Power and Energy:**

- **Watt (W):** $1\text{ W} = \frac{1\text{ J}}{1\text{ s}} = 1\text{ kg}\cdot\text{m}^2/\text{s}^3$.

- **Kilowatt-hour (kWh):** A unit of energy, often used in electricity.

    $$
1\text{ kWh} = 1\text{ kW} \cdot 1\text{ h} = 10^3\text{ W} \cdot 3600\text{ s} = 3.6 \times 10^6\text{ J}
    $$
