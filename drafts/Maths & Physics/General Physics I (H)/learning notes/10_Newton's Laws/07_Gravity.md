# 07_Gravity

## **Law of Gravity**

### **1. Kepler's Laws**

Kepler formulated three foundational laws describing planetary motion:

1. **The Law of Orbits:** All planets move in elliptical orbits, with the Sun at one focus.

    - _Geometry parameters:_ $a$ (semimajor axis), $b$ (semiminor axis), $c$ (linear eccentricity).

2. **The Law of Areas:** A radial vector connecting the Sun and a planet sweeps out equal areas in equal time intervals.

    - $$\frac{dA}{dt} = C \quad (\text{constant})$$

3. **The Law of Periods:** The square of the orbital period is proportional to the cube of the semimajor axis.

    - $$T^2 \propto a^3$$

**Deductions from Kepler's Laws:**

- Laws 1 & 2 imply the presence of a **central force** (which leads to the conservation of angular momentum).

- Law 3 dictates the **magnitude** of this force.

    - _Derivation (assuming a circular orbit where $a = b = r$):_

        Given $T^2 \propto r^3$ and orbital velocity $v = \frac{2\pi r}{T}$, we find $v \propto \frac{1}{\sqrt{r}}$.

        Centripetal acceleration is $a = \frac{v^2}{r} \propto \frac{1}{r^2}$.

        Therefore, force $F = ma \propto \frac{m}{r^2}$.

### **2. Newton's Law of Universal Gravitation**

Building upon these deductions, Newton proposed the universal law of gravitation:

$$
F = G \frac{m_1 m_2}{r^2}
$$

- **Gravitational Constant ($G$):** $G \approx 6.67 \times 10^{-11} \text{ N}\cdot\text{m}^2/\text{kg}^2$

---

## **Gravity of Extended Bodies (The Earth)**

The **Principle of Superposition** states that the net gravitational force is the vector sum of individual forces:

$$
\vec{F}_{1,net} = \vec{F}_{12} + \vec{F}_{13} + \dots + \vec{F}_{1n}
$$

Treating the Earth as a finite-size sphere with uniform density $\rho$ and radius $R_E$:

![[GP-Gravity1.png]]

- schematic diagram from the hand-written notes of Mr. ztWang

### **Case 1: Outside the Earth ($R > R_E$)**

By integrating the force contributions $dF$ from volume elements $dV$ over the entire sphere:

$$
F = \int dF \cos\alpha = \dots = \frac{GMm}{R^2}
$$

_(Where total mass $M = \rho \cdot \frac{4}{3}\pi R_E^3$)_

- **Conclusion:** A spherically symmetric body affects external objects gravitationally as though all of its mass were concentrated at its central point.

- **Surface Gravity:** At the surface, $F = mg$, yielding $g = \frac{GM}{R_E^2}$.

### **Case 2: Inside the Earth ($R < R_E$)**

Applying the Shell Theorem using solid angles ($d\Omega$):

![[GP-Gravity2.png]]

- An empty spherical shell contributes **zero** net gravitational force to a point inside it. The forces from opposing sections cancel out ($F_1 = F_2 = \lambda m d\Omega$).

- Therefore, for a mass $m$ at radius $R$ inside the Earth, only the inner sphere of radius $R$ contributes to the force:

    $$
M' = \rho \cdot \frac{4}{3}\pi R^3 = M \left(\frac{R}{R_E}\right)^3
    $$

    $$
F = \frac{GM'm}{R^2} = \frac{GMm}{R_E^3} R
    $$

- **Conclusion:** Inside the Earth, gravity acts like a restoring spring force ($F \propto R$).

---

## **Empirical Verifications and Measurements**

### **1. Prediction of "Universal" Gravitation**

Relating Earth's surface gravity to the Moon's orbit:

$$
F = \frac{G M_E M_M}{r_M^2} = M_M \frac{v_M^2}{r_M} \quad \text{and} \quad g = \frac{G M_E}{R_E^2}
$$

Substituting and using $v_M = \frac{2\pi r_M}{T}$ yields the theoretical relationship:

$$
r_M^3 = \frac{g R_E^2 T^2}{4\pi^2}
$$

_Verification using known values:_

- $g \approx 9.8 \text{ m/s}^2$

- $R_E \approx 6.4 \times 10^6 \text{ m}$

- $T \approx 27.32 \text{ days} \approx 2.361 \times 10^6 \text{ s}$

- $r_M \approx 3.84 \times 10^8 \text{ m}$

    _Left-hand side:_ $r_M^3 \approx 5.66 \times 10^{25} \text{ m}^3$

    _Right-hand side:_ $\approx 5.67 \times 10^{25} \text{ m}^3$ (The prediction holds).

### **2. Measurement of $G$ and Earth's Density**

- **Cavendish Experiment:** Henry Cavendish used a torsion balance to measure the gravitational constant, obtaining $G \approx 6.754 \times 10^{-11} \text{ m}^3/(\text{kg}\cdot\text{s}^2)$.

- **Calculating Earth's Density:**

    $$
M_E = \frac{g R_E^2}{G} \approx 6.02 \times 10^{24} \text{ kg}
    $$

    $$
V_E = \frac{4}{3}\pi R_E^3 \approx 1.10 \times 10^{21} \text{ m}^3
    $$

    $$
\rho_E = \frac{M_E}{V_E} \approx 5.5 \times 10^3 \text{ kg/m}^3
    $$

	Comparing this to surface materials (coal: 1.1-1.4, marble: 2.4-2.7, iron: 7.9) suggests a high-density core.

---

## **Gravitational Energy and Orbital Mechanics**

### **Modification of Gravity Near Earth's Surface**

For an altitude $h$ where $h \ll R_E$: (when $x$ is sufficiently small，$(1 + x)^n \approx 1 + nx$)

$$
F = \frac{G M_E m}{(R_E + h)^2} = \frac{G M_E m}{R_E^2 \left(1 + \frac{h}{R_E}\right)^2} \approx \frac{G M_E m}{R_E^2} \left(1 - \frac{2h}{R_E}\right)
$$

$$
g \approx g_0 \left(1 - \frac{2h}{R_E}\right)
$$

### **Gravitational Potential Energy**

$$
U(r) = - \int_{r_0}^r F(r') dr' = \int_{r_0}^r \frac{GMm}{(r')^2} dr' = - \frac{GMm}{r'} \Bigg|_{r_0}^r = - \frac{GMm}{r} + C
$$

By convention, setting $C = 0$ at infinity:

$$
U(r) = - \frac{GMm}{r}
$$

_(Check: $-\frac{dU}{dr} = - \frac{GMm}{r^2} = F(r)$)_

### **Energy of a Satellite**

For a satellite in circular orbit at radius $r$:

- Centripetal force constraint: $\frac{G M_E m}{r^2} = m \frac{v^2}{r} \Rightarrow v^2 = \frac{G M_E}{r}$

- Total Mechanical Energy ($E = K + U$):

    $$
E = \frac{1}{2}mv^2 - \frac{GMm}{r} = - \frac{G M_E m}{2r}
    $$

**Example: Geosynchronous Orbit**

Given $T = 1 \text{ day} = 86400 \text{ s}$.

$$
r = \sqrt[3]{\frac{G M_E T^2}{4\pi^2}} \approx 4.23 \times 10^7 \text{ m}
$$

### **Cosmic Velocities**

1. **First Cosmic Velocity (Circular Orbit Velocity):**

        $$
    \frac{1}{2}mv^2 - \frac{G M_E m}{R_E} = - \frac{G M_E m}{2R_E} \Rightarrow v = \sqrt{\frac{G M_E}{R_E}} \approx 7.9 \text{ km/s}
        $$

2. **Second Cosmic Velocity (Escape Velocity of Earth):**

        $$
    \frac{1}{2}mv^2 - \frac{G M_E m}{R_E} = 0 \Rightarrow v = \sqrt{\frac{2G M_E}{R_E}} \approx 11.2 \text{ km/s}
        $$

3. **Third Cosmic Velocity:** Escape velocity of the Sun.

---

## **Rocket Propulsion**

### **1. Momentum Conservation (Without Gravity)**

Assume a rocket of mass $M$ travels at velocity $v$. It ejects a mass differential $dm$ (where $dm = -dM$) at a relative exhaust velocity $v_e$.

Applying conservation of momentum:

$$
(M + dm)v = M(v + dv) + dm(v - v_e)
$$

$$
dv = \frac{dm}{M} v_e \Rightarrow dv = - \frac{dM}{M} v_e
$$

Integrating from initial to final states:

$$
\int_{v_i}^{v_f} dv = -v_e \int_{M_i}^{M_f} \frac{dM}{M} \Rightarrow v_f - v_i = v_e \ln\left(\frac{M_i}{M_f}\right)
$$

- **Note:** A larger mass ratio ($\frac{M_i}{M_f}$) yields a larger velocity change ($\Delta v$). This acts as the reverse process of a perfectly inelastic collision (mechanical energy increases).

### **2. Propulsion with Gravity**

Factoring in the impulse from gravity ($-Mg\Delta t$):

$$
-(M + \Delta m)g \Delta t = [M(v + \Delta v) + \Delta m(v - v_e)] - [(M + \Delta m)v]
$$

$$
-g dt = dv + \frac{dM}{M} v_e
$$

Integrating yields:

$$
v_f = v_e \ln\left(\frac{M_i}{M_f}\right) - g t_f
$$

### **3. Rocket Thrust**

Thrust is the force exerted on the rocket by the ejected exhausted gas:

$$
F_{\text{thrust}} = M \frac{dv}{dt} = - \frac{dM}{dt} v_e = v_e \left| \frac{dM}{dt} \right|
$$
