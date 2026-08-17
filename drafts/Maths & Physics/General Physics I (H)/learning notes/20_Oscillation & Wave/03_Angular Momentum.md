# 03_Angular Momentum

## 1. Pure Rotation (Moving Axis)

When extending rotational kinematics from a fixed axis to a moving axis (e.g., a rolling object), we analyze the Center of Mass (CM).

- **Kinematics of Pure Rolling**:

    For an object of radius $R$ rolling without slipping, the arc length $s = R\theta$.

    - Velocity of CM: $v_{cm} = \frac{ds}{dt} = R\frac{d\theta}{dt} = R\omega$

    - Acceleration of CM: $a_{cm} = \frac{dv_{cm}}{dt} = R\alpha$

- **Energy Conservation**:

    When the point of contact remains static (no slipping), static friction does **no work** in pure rotation. Therefore, mechanical energy is conserved.

- **Total Kinetic Energy (König's Theorem)**:

    Total kinetic energy $K$ is the sum of translational kinetic energy of the CM and rotational kinetic energy relative to the CM:

    $$
K = K_{cm} + K' = \frac{1}{2} Mv_{cm}^2 + \frac{1}{2} I_{cm} \omega^2
    $$

    For pure rotation ($v_{cm} = \omega R$), this simplifies to:

    $$
K = \frac{1}{2}\left(M + \frac{I_{cm}}{R^2}\right) v_{cm}^2
    $$

---

## 2. Torque and Angular Momentum

Recall the linear Impulse-Momentum Theorem: $\vec{I} = \vec{P}_f - \vec{P}_i$. We can define a rotational analogue.

### Definitions

- **Torque**: $\vec{\tau} = \vec{r} \times \vec{F}$

- **Angular Momentum**: $\vec{L} = \vec{r} \times \vec{p}$

### Derivation of Rotational Dynamics

Taking the time derivative of angular momentum:

$$
\vec{\tau} = \vec{r} \times \frac{d\vec{p}}{dt} = \frac{d}{dt}(\vec{r} \times \vec{p}) - \frac{d\vec{r}}{dt} \times \vec{p}
$$

Since $\frac{d\vec{r}}{dt} \times \vec{p} = \vec{v} \times (m\vec{v}) = 0$, we get the rotational analogue to Newton's Second Law:

$$
\vec{\tau} dt = d\vec{L}
$$

> **Key Notes:**
>
> 1. Both $\vec{\tau}$ and $\vec{L}$ depend on the choice of origin.
>
> 2. The origin for calculating $\vec{\tau}$ and $\vec{L}$ must be the same.
>
> 3. Any chosen origin is mathematically valid.
>

### System of Particles

For a system of particles, total angular momentum is $\vec{L} = \sum_i \vec{L}_i$ and total external torque is $\vec{\tau}_{ext} = \sum_i \vec{\tau}_{i, ext}$.

$$
\vec{\tau}_{ext} dt = d\vec{L}
$$

_Note: Internal torques cancel out._ For example, the internal torque between two particles is $\vec{\tau}_{int} = \vec{r}_1 \times \vec{F}_{12} + \vec{r}_2 \times \vec{F}_{21} = (\vec{r}_1 - \vec{r}_2) \times \vec{F}_{12} = 0$ (since the distance vector is parallel to the force vector). Only external forces need to be considered.

---

## 3. The Moment of Inertia Tensor

For a rigid body rotating around a fixed axis:

$$
\vec{L} = \sum_i \vec{r}_i \times m_i \vec{v}_i = \sum_i \vec{r}_i \times m_i (\vec{\omega} \times \vec{r}_i)
$$

Applying the vector triple product expansion:

$$
\vec{L} = \sum_i m_i \left[ r_i^2 \vec{\omega} - (\vec{r}_i \cdot \vec{\omega})\vec{r}_i \right]
$$

By expanding the vectors into Cartesian components $\vec{\omega} = (w_x, w_y, w_z)^T$ and $\vec{r}_i = (x_i, y_i, z_i)^T$, we can express this as a matrix multiplication:

$$
\vec{L} = \sum_i m_i \begin{pmatrix} (y_i^2+z_i^2) & -x_i y_i & -x_i z_i \\ -y_i x_i & (z_i^2+x_i^2) & -y_i z_i \\ -z_i x_i & -z_i y_i & (x_i^2+y_i^2) \end{pmatrix} \begin{pmatrix} w_x \\ w_y \\ w_z \end{pmatrix}
$$

This establishes the relationship $\vec{L} = I \vec{\omega}$, where $I$ is the **Moment of Inertia Tensor**:

$$
I = \sum_i m_i (r_i^2 \mathbf{1} - \vec{r}_i \otimes \vec{r}_i)
$$

_(Note: $\vec{A} \otimes \vec{B}$ denotes the dyadic/direct product where $(\vec{A} \otimes \vec{B})_{mn} \equiv A_m B_n$.)_

**Example: Uniform Ball**

For a uniform sphere, the diagonal elements are all $I_0 = \frac{2}{5} MR^2$.

The off-diagonal elements (e.g., $I_{xy} = \int dx dy dz (-xy) \rho$) integrate to zero due to odd symmetry in $x$ and $y$.

Thus, if the z-axis is fixed, $L_z = I_0 \omega_z$.

---

## 4. Conservation of Angular Momentum

When net external torque is zero ($\vec{\tau}_{ext} = 0$), then $\frac{d\vec{L}}{dt} = 0$, meaning $\vec{L}$ is **constant**.

**Example: Kepler's Second Law**

A planet orbits the Sun under a central gravitational force $\vec{F}_g$.

$$
\vec{\tau} = \vec{r} \times \vec{F}_g = 0 \implies \vec{L} = \vec{r} \times \vec{p} = \text{constant}
$$

The area swept by $\vec{r}$ in unit time is $dA = \frac{1}{2} |\vec{r} \times \vec{v} dt|$.

$$
\frac{dA}{dt} = \frac{1}{2} |\vec{r} \times \vec{v}| = \frac{|\vec{L}|}{2m} = \text{constant}
$$

---

## 5. Dynamics in the Center of Mass (CM) Frame

- $\vec{r} = \vec{r}_{cm} + \vec{r}'$:

- **Torque Separation**:

    $$
\vec{\tau}_{ext} = \vec{r}_{cm} \times \left(\sum_i \vec{F}_{i,ext}\right) + \sum_i \vec{r}_i' \times \vec{F}_{i,ext}
    $$

    This splits torque into the torque from all external forces acting on the CM, plus the torques relative to the CM. _(Note: Torque from gravity relative to CM is 0)._

- **Angular Momentum Separation**:

    $$
\vec{L} = M\vec{r}_{cm} \times \vec{v}_{cm} + \sum_i m_i \vec{r}_i' \times \vec{v}_i'
    $$

    This splits angular momentum into the orbital angular momentum of the CM, plus the spin angular momentum relative to the CM.

**Combined Formalism**:

$$
\sum_i \vec{r}_i' \times \vec{F}_{i,ext} = \frac{d}{dt} \left(\sum_i m_i \vec{r}_i' \times \vec{v}_i'\right)
$$

$$
\vec{r}_{cm} \times \left(\sum_i \vec{F}_{i,ext}\right) = \frac{d}{dt} (M\vec{r}_{cm} \times \vec{v}_{cm})
$$

For any closed, isolated system, the following are strictly conserved:

1. Energy: $K_i + U_i = K_f + U_f$

2. Linear Momentum: $\vec{P}_i = \vec{P}_f$

3. Angular Momentum: $\vec{L}_i = \vec{L}_f$

---

## 6. Comprehensive Examples

### A. The Rolling Ball on an Incline

Find the CM acceleration ($a_{cm}$) of a ball rolling down an incline of angle $\theta$.

- **Method 1: Momentum & Relative Angular Momentum**

    - Translation: $Mg \sin\theta - f_s = M a_{cm}$

    - Rotation: $f_s R = I_{cm} \alpha$

    - Constraint (pure rotation): $a_{cm} = \alpha R$

    - Solving yields: $a_{cm} = \frac{g \sin\theta}{1 + I_{cm}/(MR^2)}$

- **Method 2: Parallel Axis Theorem**

    Take the torque about the bottom contact point (where normal force $\vec{n}$ and friction $\vec{f}_s$ exert no torque).

    - $\tau_{ext} = Mg R \sin\theta$

    - $I = I_{cm} + MR^2$

    - $Mg R \sin\theta = (I_{cm} + MR^2) \frac{a_{cm}}{R} \implies a_{cm} = \frac{g \sin\theta}{1 + I_{cm}/(MR^2)}$

### B. Elastic Collision (Ball and Stick)

A ball (mass $m_b$, initial velocity $v_{bi}$) strikes a freely pivoting stick (mass $M$) at distance $r$ from the pivot. Find final velocities $v_{bf}$ (ball), $v_s$ (stick CM), and $\omega$ (stick angular velocity).

![[GP-Angular-Momentum1.png]]

- schematic diagram from the hand-written notes of Mr. ztWang

Set up a system of three conservation equations:

1. **Momentum**: $m_b v_{bi} = m_b v_{bf} + M v_s$

2. **Angular Momentum**: $m_b v_{bi} r = m_b v_{bf} r + I \omega$

3. **Kinetic Energy**: $\frac{1}{2} m_b v_{bi}^2 = \frac{1}{2} m_b v_{bf}^2 + \frac{1}{2} M v_s^2 + \frac{1}{2} I \omega^2$

### C. Rotation with Slipping

A solid cylinder ($I = \frac{1}{2}MR^2$) is placed on a surface with initial forward velocity $V_0$ and initial backspin $\omega_0$. Kinetic friction $\mu Mg$ acts to normalize the motion. Find the time $t$ when slipping stops, and the final pure-rolling velocity $V_{cm}$.

![[GP-Angular-Momentum.png]]

1. Linear deceleration: $V_{cm} = V_0 - \mu gt$

2. Angular acceleration: $\omega = -\omega_0 + \frac{\mu MgR}{I} t$

3. Pure rolling condition: $V_{cm} = \omega R$

Solving the system:

$$
t = \frac{V_0 + \omega_0 R}{\mu g (1 + \frac{MR^2}{I})} = \frac{V_0 + \omega_0 R}{3 \mu g}
$$

$$
V_{cm} = \frac{1}{3} (2V_0 - \omega_0 R)
$$

### D. Precession of a Gyroscope

A fast-spinning gyroscope tilted at angle $\theta$ experiences a gravitational torque.

![[GP-Angular-Momentum2.png]]

- Angular momentum is dominated by the fast spin: $\vec{L} \approx \sum_i \vec{r}_i' \times \vec{p}_i'$ (CM orbital term $\vec{r}_{cm} \times \vec{p}_{cm} \approx 0$).

- Torque: $\vec{\tau} = \vec{r}_{cm} \times M\vec{g} \implies \tau = Mg r \sin\theta = \frac{dL}{dt}$

- From geometry, a small change in angle $d\phi$ means $dL = L \sin\theta d\phi$.

- Substituting: $Mg r \sin\theta = L \sin\theta \frac{d\phi}{dt}$

- Precession angular velocity: $\frac{d\phi}{dt} = \frac{Mgr}{L}$
