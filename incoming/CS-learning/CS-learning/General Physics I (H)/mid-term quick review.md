## Newton's Laws

### **1. 1D & 2D Kinematics**

**Fundamental Definitions**

- Average velocity is defined as displacement over time: $v_{avg} = \Delta x / \Delta t$.
    
- Instantaneous velocity is the time derivative of position: $v = dx/dt$.
    
- Instantaneous acceleration is the time derivative of velocity: $a = dv/dt = d^2x/dt^2$.
    
- To find velocity from variable acceleration, integrate: $v(t) = \int_{t_i}^t a(t') dt' + v_i$.
    
- To find position from variable velocity, integrate: $x(t) = \int_{t_i}^t v(t') dt' + x_i$.
    

**Constant Acceleration Formulas**

- Velocity as a function of time: $v(t) = v_0 + at$.
    
- Position as a function of time: $x(t) = x_0 + v_0t + \frac{1}{2}at^2$.
    
- Time-independent kinematic equation: $x(t) - x_0 = (v_f^2 - v_0^2)/(2a)$.
    

**Projectile & Circular Motion**

- Total range of a projectile on level ground: $s = (v_0^2\sin2\phi_0)/g$.
    
- Total time of flight for a projectile on level ground: $t = (2v_0\sin\phi_0)/g$.
    
- Uniform circular motion features constant angular velocity: $\omega = v/r$.
    
- Centripetal acceleration for uniform circular motion always points radially inward: $\vec{a} = -(v^2/r)\hat{r}$.
    
- Non-uniform circular motion includes both tangential and centripetal acceleration components: $\vec{a} = (d\omega/dt)r\hat{\phi} - \omega^2r\hat{r}$.
    

---

### **2. Error Propagation & Significant Figures**

**Significant Figures**

- Addition and Subtraction: The final result must be rounded to the same decimal place as the number with the least precise decimal place.
    
- Multiplication and Division: The final result must have the same number of significant figures as the term with the fewest significant figures.
    

**Uncertainty Propagation**

- Absolute uncertainty for addition ($y = x_1 + x_2$): $\Delta y = \sqrt{(\Delta x_1)^2 + (\Delta x_2)^2}$.
    
- Relative uncertainty for multiplication/division ($y = x_1 x_2$ or $y = x_1 / x_2$): $\Delta y / |y| = \sqrt{(\Delta x_1/x_1)^2 + (\Delta x_2/x_2)^2}$.
    

---

### **3. Newtonian Dynamics & Forces**

**Core Laws & Reference Frames**

- Newton's Second Law relates force and acceleration: $\vec{F} = m\vec{a}$.
    
- Galilean velocity transformation between frames: $\vec{v}' = \vec{v} - \vec{v}_0$.
    
- Fictitious force required in an accelerating (non-inertial) reference frame: $F_{\text{fictitious}} = -m\vec{a}$.
    

**Drag & Friction**

- Low-speed (linear) drag applies to highly viscous fluids or slow speeds: $\vec{R} = -b\vec{v}$.
    
- Terminal velocity under low-speed drag: $v_t = mg/b$.
    
- High-speed (quadratic) drag applies when turbulence is a factor: $\vec{R} = -\frac{1}{2} C \rho A v^2 \hat{v}$.
    
- Terminal velocity under high-speed drag scales with the square root of the object's radius: $v_t = \sqrt{2mg / (C \rho A)}$.
    
- Maximum static friction prevents initial motion: $f_{s,\max} = \mu_s F_N$.
    
- Kinetic friction opposes ongoing motion: $f_k = \mu_k F_N$.
    

---

### **4. Numerical Integration Methods**

|**Integration Method**|**Position Update Formula**|**Truncation Error**|
|---|---|---|
|**Euler**|$\vec{r}_{n+1} = \vec{r}_n + \vec{v}_n\Delta t$|$O(\Delta t^2)$|
|**Verlet**|$\vec{r}_{n+1} = 2\vec{r}_n - \vec{r}_{n-1} + \vec{a}_n \Delta t^2$|$O(\Delta t^4)$|
|**Velocity Verlet**|$\vec{r}_{n+1} = \vec{r}_n + \vec{v}_n \Delta t + \frac{1}{2}\vec{a}_n \Delta t^2$|$O(\Delta t^4)$|

---

### **5. Work, Energy, and Momentum**

**Work and Energy Theorems**

- Mechanical work definition for a constant force: $W = \vec{F} \cdot \vec{d}$.
    
- Work done by a varying force in 1D: $W = \int_{x_i}^{x_f} F_x dx$.
    
- Work done by a spring obeying Hooke's Law: $W = -\frac{1}{2}k(x_f^2 - x_i^2)$.
    
- Definition of kinetic energy: $K = \frac{1}{2}mv^2$.
    
- The Work-Kinetic Energy Theorem states that net work equals the change in kinetic energy: $K_f - K_i = W$.
    

**Potential Energy and Equilibrium**

- Change in potential energy is the negative work done by a conservative force: $\Delta U = -W$.
    
- Gravitational potential energy near Earth's surface: $U(y) = mgy$.
    
- Elastic potential energy of a spring: $U(x) = \frac{1}{2}kx^2$.
    
- A conservative force is the negative gradient of its potential energy: $\vec{F} = -\nabla U$.
    
- Stable equilibrium occurs at a potential energy minimum: $dU/dx = 0$ and $d^2U/dx^2 > 0$.
    
- Unstable equilibrium occurs at a potential energy maximum: $dU/dx = 0$ and $d^2U/dx^2 < 0$.
    

**Momentum and Collisions**

- Linear momentum definition: $\vec{p} = m\vec{v}$.
    
- The Impulse-Momentum Theorem relates force over time to momentum change: $\vec{I} = \int \vec{F} dt = \Delta \vec{p}$.
    
- In perfectly inelastic collisions, objects stick together and kinetic energy is lost.
    
- Shared final velocity for perfectly inelastic collisions: $\vec{v}_f = (m_1\vec{v}_{1i} + m_2\vec{v}_{2i})/(m_1 + m_2)$.
    
- In elastic collisions, both linear momentum and kinetic energy are conserved.
    
- Position of the Center of Mass (CM) for discrete particles: $\vec{r}_{CM} = (\sum m_i \vec{r}_i)/M$.
    
- Position of the CM for continuous extended objects: $\vec{r}_{CM} = (\int \vec{r} dm)/M$.
    
- König's Theorem states total kinetic energy is the kinetic energy of the CM plus the internal kinetic energy: $E_K = E_{k, cm} + E_K'$.
    
- The total momentum of any system measured within its own CM frame is always zero: $\vec{P}' = 0$.
    

---

### **6. Gravity & Rocket Propulsion**

**Universal Gravitation**

- Kepler's Law of Periods relates orbital period to the semimajor axis: $T^2 \propto a^3$.
    
- Newton's Law of Universal Gravitation: $F = G(m_1 m_2)/r^2$.
    
- Outside a uniform spherical mass ($R > R_E$), gravity acts exactly as if all mass is concentrated at the center.
    
- Inside a uniform spherical mass ($R < R_E$), the gravitational force acts like a restoring spring: $F \propto R$.
    
- Universal gravitational potential energy (setting zero at infinity): $U(r) = -GMm/r$.
    

**Orbital Mechanics & Rockets**

- Required velocity for a satellite in a circular orbit at radius $r$: $v = \sqrt{GM_E/r}$.
    
- First Cosmic Velocity (velocity for a circular orbit at Earth's surface): $v = \sqrt{GM_E/R_E} \approx 7.9$ km/s.
    
- Second Cosmic Velocity (escape velocity from Earth): $v = \sqrt{2GM_E/R_E} \approx 11.2$ km/s.
    
- The change in velocity for a rocket depends on the mass ratio and exhaust velocity: $v_f - v_i = v_e \ln(M_i/M_f)$.
    
- Rocket thrust force is proportional to the mass ejection rate: $F_{\text{thrust}} = v_e |dM/dt|$.

---

## Oscillation and Wave

## **1. Rotational Kinematics & Dynamics**

### Kinematics & Linear Analogies

Rotational motion perfectly mirrors linear kinematics:

- **Variables:** Displacement $\theta$, Velocity $\omega = d\theta/dt$, Acceleration $\alpha = d\omega/dt$.
    
- **Constant $\alpha$ Equations:** $\omega_f = \omega_i + \alpha t$ | $\theta_f = \theta_i + \omega_i t + \frac{1}{2}\alpha t^2$ | $\omega_f^2 - \omega_i^2 = 2\alpha\Delta\theta$.
    
- **Relations to Linear:** $v = \omega r$ | Tangential $a_t = \alpha r$ | Radial (Centripetal) $a_r = \omega^2 r$.
    
- **Vector Form:** $\vec{v} = \vec{\omega} \times \vec{r}$.
    

### Moment of Inertia ($I$)

A body's resistance to rotational acceleration:

- **Formulas:** Discrete $I = \sum m_i r_i^2$ | Continuous $I = \int r^2 dm$.
    
- **Parallel Axis Theorem:** $I = I_{cm} + Mh^2$ (where $h$ is distance from COM).
    
- **Common Geometries (Memorize):**
    
    - **Uniform Rod:** Center $I = \frac{1}{12}ML^2$ | End $I = \frac{1}{3}ML^2$.
        
    - **Sphere:** Solid $I = \frac{2}{5}MR^2$ | Shell $I = \frac{2}{3}MR^2$.
        
    - **Cylinder/Disk:** Solid $I = \frac{1}{2}MR^2$ | Shell $I = MR^2$.
        

### Torque ($\tau$), Energy, & Angular Momentum ($L$)

- **Torque:** $\vec{\tau} = \vec{r} \times \vec{F}$ | Magnitude: $\tau = Fd$ (where $d$ is the moment arm).
    
- **Newton's 2nd Law for Rotation:** $\vec{\tau}_{net} = I\vec{\alpha} = \frac{d\vec{L}}{dt}$.
    
- **Angular Momentum:** $\vec{L} = \vec{r} \times \vec{p} = I\vec{\omega}$. Conserved ($\vec{L}_i = \vec{L}_f$) if net external torque is zero.
    
- **Rotational Kinetic Energy:** $K_R = \frac{1}{2}I\omega^2$.
    
- **Power:** $P = \tau\omega$.
    
- **Pure Rolling (No slipping):** $v_{cm} = \omega R$ | $a_{cm} = \alpha R$. Total $K = \frac{1}{2}Mv_{cm}^2 + \frac{1}{2}I_{cm}\omega^2$. Friction does zero work.
    

### Rotating Frames & Fictitious Forces

When calculating motion in a rotating (non-inertial) frame, add fictitious forces:

- **Coriolis Force:** $-2m\vec{\omega} \times \vec{v}'$ (Deflects moving objects; right in Northern Hemisphere).
    
- **Centrifugal Force:** $-m\vec{\omega} \times (\vec{\omega} \times \vec{r}')$ (Points outward from rotation axis).
    

---

## **2. Static Equilibrium**

For a rigid body to remain completely at rest, two conditions must be met:

- **Translational Equilibrium:** $\sum \vec{F}_{net} = 0$ (Linear momentum is constant/zero).
    
- **Rotational Equilibrium:** $\sum \vec{\tau}_{net} = 0$ (Angular momentum is constant/zero). _Rule of thumb: You can calculate torque from ANY arbitrary origin to simplify math_.
    
- **Center of Gravity (COG):** The effective point of gravitational torque. It coincides with the Center of Mass (COM) in uniform gravity.
    
- **Concurrent Forces Theorem:** If a body is in equilibrium under 3 non-parallel forces, their lines of action must intersect at a single point.
    

---

## **3. Oscillatory Motion (SHM)**

### Simple Harmonic Motion Basics

Occurs near stable equilibrium points where restoring force is linear.

- **Equation of Motion:** $\ddot{x} = -\omega^2(x - x_0)$ / $\frac{d^2x}{dt^2} = -\omega^2 x$ where $\omega = \sqrt{k/m}$.
    
- **Kinematics Solution:** $x(t) = A \cos(\omega t + \phi)$.
    
- **Parameters:** Period $T = 2\pi/\omega$ | Frequency $f = 1/T = \omega/2\pi$ (Hz).
    
- **Energy:** Total $E = \frac{1}{2}kA^2$. Kinetic and Potential energies oscillate at $2\omega$ (twice the frequency of position).
    

### Pendulums

- **Simple Pendulum:** $\omega = \sqrt{g/L}$.
    
- **Physical Pendulum:** $\omega = \sqrt{mgd/I}$ ($d$ is distance from COM to pivot).
    
- **Torsion Pendulum:** $\omega = \sqrt{k/I}$ (where $k$ is the torsional constant).
    

### Damping & Resonance

- **Damping Regimes:** Controlled by damping constant $b$:
    
    - _Underdamped:_ System oscillates with exponentially decaying amplitude.
        
    - _Critically Damped:_ Fastest return to equilibrium without oscillating.
        
    - _Overdamped:_ Slow return to equilibrium without oscillating.
        
- **Forced Oscillation:** Maximum amplitude (Resonance) occurs when driving frequency matches natural frequency ($\omega_{ext} = \omega_0$).
    

### Modes of Vibration

For an $N$-atom molecule, total degrees of freedom = $3N$:

- **Linear molecule:** $3N - 5$ vibrational modes.
    
- **Non-linear molecule:** $3N - 6$ vibrational modes.
    

---

## **4. Mechanical Waves**

### The Wave Equation & Parameters

- **General Wave Equation:** $\frac{\partial^2 y}{\partial t^2} = v^2 \frac{\partial^2 y}{\partial x^2}$.
    
- **Sinusoidal Wave:** $y(x,t) = A \sin(kx - \omega t + \phi)$.
    
- **Wave Variables:** Wave number $k = 2\pi/\lambda$ | Angular freq $\omega = 2\pi/T$.
    
- **Phase Velocity:** $v = \omega/k = \lambda/T = \lambda f$.
    

### Wave Speeds in Media

- **String:** $v = \sqrt{T/\mu}$ (Tension / linear mass density).
    
- **Fluids (Sound):** $v = \sqrt{B/\rho}$ (Bulk Modulus / density). Water is highly incompressible, so $v_{water} \gg v_{air}$.
    

### Interference, Boundaries, & Standing Waves

- **Boundary Reflection:** 
	
	- Fixed/Heavy boundary: Pulse reflects **inverted**.
	    
    - Free/Light boundary: Pulse reflects **upright**.
        
- **Interference (Path Difference $\Delta r$):**
    
    - Constructive (In Phase): $\Delta r = n\lambda$.
        
    - Destructive (Out of Phase): $\Delta r = (n + 0.5)\lambda$.
        
- **Standing Waves (Fixed Ends):** Nodes (zero amplitude) separated by $\lambda/2$. Harmonic frequencies: $f_n = n \frac{v}{2L}$.
    
- **Beats (Temporal Interference):** Beat frequency $f_{beat} = |f_1 - f_2|$.
    

### Energy & Dispersion

- **Average Power:** $P_{avg} = \frac{1}{2}\mu v \omega^2 A^2$.
    
- **Dispersion:** Phase velocity $v_p = \omega/k$. Group velocity (envelope) $v_g = d\omega/dk$.
    

---

## **5. Sound & Elasticity**

### Elasticity Formulas

_Linear region Hooke's Law approximation:_ $\text{Stress} = \text{Modulus} \times \text{Strain}$.

- **Young's (Tensile):** $F/A = E(\Delta L/L)$.
    
- **Shear:** $F/A = G(\Delta x/L)$.
    
- **Bulk (Hydraulic):** $P = B(\Delta V/V)$.
    

### Intensity & Decibels

- **Intensity:** $I = P/A$. For a spherical point source: $I = P_s / 4\pi r^2$.
    
- **Sound Level ($\beta$):** $\beta = 10 \log_{10}(I/I_0)$ in decibels (dB), where $I_0 = 10^{-12} \text{ W/m}^2$.
    
    - _Rule of thumb:_ Adding 10 dB means Intensity is multiplied by 10.
        

### Doppler Effect & Shock Waves

- **Doppler Equation:** $f' = f \left( \frac{v \pm v_D}{v \pm v_S} \right)$.
    
    - _Sign Convention:_ Use top signs ($+$ in num, $-$ in den) when approaching. Use bottom signs when moving away.
        
- **Shock Waves (Mach Cone):** Occur when $v_S > v$. The Mach cone angle is $\sin\theta = v/v_S$.
    
