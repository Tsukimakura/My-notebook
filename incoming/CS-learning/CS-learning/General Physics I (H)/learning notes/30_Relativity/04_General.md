## 1. Special Relativity: Kinematics Example

### Problem Setup

Consider a spaceship (reference frame $K'$) of length $L_0$ moving at a constant speed $v$ relative to the Earth (reference frame $K$). Inside the spaceship, a ball moves from the left end to the right end at a speed $u_0$.

- **Question:** What is the time interval ($\Delta t$) of the ball reaching the other end, as measured by an observer on Earth (frame $K$)?
    

### Analysis and Derivation

We define two key events in the Minkowski diagram:

![[General-physics-general1.png]]

- **Event A:** Ball starts at the left end.
    
- **Event B:** Ball hits the right end.
    

In the spaceship frame ($K'$):

- Position of B: $x'_B = L_0$
    
- Time of B: $t'_B = \frac{L_0}{u_0}$
    

To find the time and position in the Earth frame ($K$), we apply the Lorentz Transformation:

$$\begin{pmatrix} ct_B \\ x_B \end{pmatrix} = \begin{pmatrix} \gamma & \beta\gamma \\ \beta\gamma & \gamma \end{pmatrix} \begin{pmatrix} c \frac{L_0}{u_0} \\ L_0 \end{pmatrix} = \begin{pmatrix} \gamma c \frac{L_0}{u_0} + \beta\gamma L_0 \\ \beta\gamma c \frac{L_0}{u_0} + \gamma L_0 \end{pmatrix}$$

The time interval in frame $K$ is $\Delta t = t_B - t_A$. Assuming $t_A = 0$, we get:

$$\Delta t = \gamma \frac{L_0}{u_0} + \beta\gamma \frac{L_0}{c}$$

We can also verify the relativistic velocity addition formula by calculating the ball's speed $u$ in frame $K$:

$$u = \frac{x_B - x_A}{t_B - t_A} = \frac{\beta\gamma c \frac{L_0}{u_0} + \gamma L_0}{\gamma \frac{L_0}{u_0} + \beta\gamma \frac{L_0}{c}} = \frac{u_0 + v}{1 + \frac{u_0 v}{c^2}}$$

> **Important Pitfall:** Do not blindly apply the time dilation formula to get $\Delta t = \gamma \frac{L_0}{u_0}$. This is **incorrect** because the time dilation formula $\Delta t = \gamma \Delta t_0$ only applies to a clock that is strictly _stationary_ with respect to the moving frame ($K'$). The ball is moving in $K'$.

## 2. General Relativity: Introduction

General Relativity shifts the focus from inertial frames to non-inertial frames, redefining gravity not as a force, but as the curvature of space and time (described by Riemann Geometry).

### Mass and the Principle of Equivalence

- **Gravitational Mass ($m_g$):** The mass responsible for gravitational attraction ($F = m_g g$).
    
- **Inertial Mass ($m_i$):** The mass representing resistance to acceleration ($F = m_i a$).
    

Empirically, $m_g = m_i \equiv m$. This implies a deep connection between gravity and acceleration ($g \sim a$).

**The Principle of Equivalence:** At any local space-time point, an arbitrary gravitational field is physically equivalent to an accelerated reference frame.

- _Example:_ An observer standing on the Earth's surface feels a downward force $f = mg$. An observer in a rocket accelerating upwards at $g$ in free space feels the exact same force.
    

### Gravitational Deflection of Light

Imagine a free-falling elevator near the Earth's surface.

- **Elevator Frame:** The gravitational force and the non-inertial fictitious force perfectly cancel out. To an observer inside, light propagates in a straight, horizontal line.
    
- **Earth Frame:** Because the elevator is accelerating downward, an observer on Earth sees the light beam bend downwards. Gravity effectively bends light.
    

## 3. Predictions and Experimental Verification

### Gravitational Deflection of Starlight

![[General-physics-general2.png]]

General relativity predicts that light from a distant star grazing the Sun will be deflected by an angle $\Delta\theta$:

$$\Delta\theta = \frac{4GM_{\odot}}{R_{\odot}}$$

_(Where $M_{\odot}$ is the mass of the Sun and $R_{\odot}$ is the radius of the Sun)._

This calculation yields a deflection of **1.75''** (arcseconds, where **1° = 60'** and **1' = 60''**). This was famously confirmed by Arthur Eddington and his collaborators during a solar eclipse in **1919**.

### Gravitational Time Dilation

Consider a rotating disk with angular velocity $\omega$ to simulate a gravitational field via fictitious forces.

![[General-physics-general3.png]]

- In the rotating frame, the non-inertial centrifugal force is $F_{\text{non-ine}} = m r \omega^2$.
    
- This corresponds to an effective gravitational potential $\varphi$:
    
    $$\varphi = - \int_0^r r'\omega^2 dr' = -\frac{1}{2}\omega^2 r^2 = -\frac{1}{2}v^2$$
    

Using Special Relativity, we know a moving clock slows down: $\Delta t = \gamma \Delta t_0$. Substituting velocity with potential:

$$\Delta t = \frac{\Delta t_0}{\sqrt{1 - v^2/c^2}} = \frac{\Delta t_0}{\sqrt{1 + 2\varphi/c^2}}$$

Because $\varphi < 0$, the denominator is less than 1, meaning $\Delta t > \Delta t_0$.

**Conclusion:** A clock deeper in a gravitational field runs slower.

## 4. Real-World Applications and Evidence

### Global Navigation Satellite Systems (GPS)

Systems like GPS (USA), Beidou (China), GLONASS (Russia), and Galileo (EU) rely heavily on precise timing ($\Delta S = c\Delta t$). The clocks on satellites experience competing relativistic effects:

1. **Special Relativity Effect:** Because the satellite is moving fast relative to Earth, its clock is _slowed_ by **7 μs/day**.
    
2. **General Relativity Effect:** Because gravity is weaker at the satellite's altitude, its clock is _boosted_ (speeds up) by **46 μs/day**.
    

### Gravitational Redshift

When light escapes a massive object, its period $T_0$ increases to $T = \gamma T_0$, meaning its frequency $\nu$ decreases (shifting toward the red end of the spectrum).

- _Energy Perspective:_ A photon must expend energy to overcome the gravitational pull and escape. Since photon energy is $E = h\nu$, a loss of energy directly results in a lower frequency $\nu$. _(Note: $\nu$ is the Greek letter "nu" for frequency, not velocity $v$)_.
    

### Spacetime Curvature Evidence

Massive objects curve spacetime, dictating how matter and energy move. Key evidence includes:

1. Light travels along "null geodesics" (the shortest possible path in curved spacetime).
    
2. The anomalous perihelion precession of Mercury's orbit.
    
3. The detection of Gravitational Waves (confirmed by LIGO in **2016**, awarded the Nobel Prize in **2017**).