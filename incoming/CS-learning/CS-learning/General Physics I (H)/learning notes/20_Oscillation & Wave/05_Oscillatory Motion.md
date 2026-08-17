## 1. Applications of Oscillatory Motion

### Simple Pendulum

A point mass $m$ attached to a massless string of length $L$.

- **Torque equation:** $\tau = I\alpha \Rightarrow -mg\sin\theta \cdot L = mL^2 \frac{d^2\theta}{dt^2}$
    
- **Equation of motion:** $\frac{d^2\theta}{dt^2} = -\frac{g}{L}\sin\theta$
    
- **Small-angle approximation** ($\theta \ll 1 \Rightarrow \sin\theta \approx \theta$):
    
    $$\frac{d^2\theta}{dt^2} = -\frac{g}{L}\theta \quad \text{(Simple Harmonic Oscillation)}$$
    
- **Solution:** $\theta = \theta_{max}\cos(\omega t + \phi)$
    
- **Angular frequency and Period:**
    
    $$\omega = \sqrt{\frac{g}{L}}, \quad T = \frac{2\pi}{\omega} = 2\pi\sqrt{\frac{L}{g}}$$
    

### Physical Pendulum

An extended rigid body oscillating about a pivot point at a distance $d$ from its center of mass.

![[GP-Oscillatory-Motion.png]]

- schematic diagram from the hand-written notes of Mr. ztWang

- **Torque equation:** $\tau = I\alpha \Rightarrow -mgd\sin\theta = I\frac{d^2\theta}{dt^2}$
    
- **Equation of motion:** $\frac{d^2\theta}{dt^2} = -\frac{mgd}{I}\sin\theta$
    
- **Solution** (for small angles): $\theta = \theta_{max}\cos(\omega t + \phi)$
    
- **Angular frequency:** $\omega = \sqrt{\frac{mgd}{I}}$
    

### Torsion Pendulum

![[GP-Oscillatory-Motion2.png]]

A disc suspended by a wire that twists.

- **Torque equation:** $\tau = -k\theta = I\ddot{\theta}$
    
- **Solution:** $\theta = \theta_{max}\cos(\omega t + \phi)$
    
- **Angular frequency:** $\omega = \sqrt{\frac{k}{I}}$
    

---

## 2. Simple Harmonic Motion (SHM) and Uniform Circular Motion

- Projecting uniform circular motion of a point $P'$ onto the x-axis yields:
    
    $$x = A\cos(\omega t + \phi) \rightarrow \text{Simple Harmonic Motion}$$
    
- Projecting onto the y-axis yields:
    
    $$y = A\sin(\omega t + \phi)$$
    
- **Notes:**
    
    1. Projection of uniform circular motion $\iff$ Simple harmonic motion.
        
    2. Uniform circular motion $\iff$ Combination of two orthogonal simple harmonic motions.
        

---

## 3. Damped Oscillator

Motion reduced by an external force (e.g., fluid resistance).

- **Fluid resistance (Low speed):** $F_d = -bv$, where $b$ is the damping constant.
    
- **Equation of motion:**
    
    $$F_{net} = -kx - bv = ma \Rightarrow m\frac{d^2x}{dt^2} + b\frac{dx}{dt} + kx = 0$$
    

![[GP-Oscillatory-Motion3.png]]

### Damping Regimes

1. **Underdamped** ($\frac{b}{2m} < \sqrt{\frac{k}{m}}$):
    
    - Solution: $x = Ae^{-\frac{b}{2m}t}\cos(\omega' t + \phi)$
        
    - Damped frequency: $\omega' \equiv \sqrt{\frac{k}{m} - \left(\frac{b}{2m}\right)^2}$

![[GP-Oscillatory-Motion4.png]]

2. **Overdamped** ($\frac{b}{2m} > \sqrt{\frac{k}{m}}$):
    
    - Solution: $x = A_1\exp\left[\left(-\frac{b}{2m} + \sqrt{\left(\frac{b}{2m}\right)^2 - \omega_0^2}\right)t\right] + A_2\exp\left[\left(-\frac{b}{2m} - \sqrt{\left(\frac{b}{2m}\right)^2 - \omega_0^2}\right)t\right]$
        
3. **Critically Damped** ($\frac{b}{2m} = \sqrt{\frac{k}{m}}$):
    
    - $\omega' = 0$
        
    - Solution: $x = (A_1 + A_2 t)e^{-\frac{b}{2m}t}$
        
    - _Note:_ Critical damping is the fastest way to restore the system to its equilibrium position, making it ideal for devices such as ammeters.
        

---

## 4. Forced Oscillation (Driven Oscillation)

Oscillator driven by an external sinusoidal force.

- **Equation of motion:**
    
    $$F = -kx - bv + F_{ext}\cos(\omega t) = ma \Rightarrow \ddot{x} + \frac{b}{m}\dot{x} + \frac{k}{m}x = \frac{F_{ext}}{m}\cos(\omega t)$$
    
- **General Solution:**
    
    $$x = \underbrace{A'e^{-\frac{b}{2m}t}\cos(\omega' t + \phi')}_{\text{Transient solution}} + \underbrace{A\cos(\omega t - \phi)}_{\text{Steady solution}}$$
    
- **Steady State Parameters:**
    
    - Amplitude: $A = \frac{F_{ext}/m}{\sqrt{(\omega_0^2 - \omega^2)^2 + (b\omega/m)^2}}$
        
    - Phase angle: $\tan\phi = \frac{b\omega/m}{\omega_0^2 - \omega^2}$
        
- **Notes:**
    
    1. For $t \gg 1$, only the steady solution survives.
        
    2. $\omega$ is the frequency of the external force.
        
    3. $\phi$ is the relative phase with respect to $F_{ext}$.
        

### Driving Frequency Behaviors

- **Slow drive** ($\omega \ll \omega_0$):
    
    - $A \approx \frac{F_{ext}/m}{\omega_0^2} = \frac{F_{ext}}{k}$
        
    - $\phi \approx 0$ (Same phase as $F_{ext}$)
        
- **Fast drive** ($\omega \gg \omega_0$):
    
    - $A \approx 0$
        
    - $\phi \approx \pi$ (Opposite phase as $F_{ext}$)
        
- **Resonance** ($\omega = \omega_0$):
    
    - $\tan\phi = \infty \Rightarrow \phi = \frac{\pi}{2}$
        
    - Amplitude $A$ peaks. As $b \to 0$, $A(\omega = \omega_0) \to \infty$.
        

---

## 5. Lennard-Jones Potential (Example)

Potential energy for a pair of neutral atoms or molecules:

$$U(x) = 4\epsilon \left[ \left(\frac{\sigma}{x}\right)^{12} - \left(\frac{\sigma}{x}\right)^6 \right]$$

- **Equilibrium position ($x_0$):**
    
    $$\left.\frac{dU}{dx}\right|_{x_0} = 0 \Rightarrow x_0 = 2^{1/6}\sigma \approx 1.122\sigma$$
    
- **Effective spring constant ($k$):**
    
    $$k = \left.\frac{d^2U}{dx^2}\right|_{x_0} = \frac{72\epsilon}{x_0^2}$$
    
- **Angular frequency:**
    
    $$\omega = \sqrt{\frac{k}{\mu}} = \sqrt{\frac{72\epsilon}{\mu x_0^2}} \quad \text{($\mu$: effective mass)}$$
    

---

## 6. Coupled Harmonic Oscillators

Two masses $m$ connected by a central spring $k$ and bound to walls by springs $k'$.

![[GP-Oscillatory-Motion5.png]]

- **Equations of motion:**
    
    $$\begin{cases} m\ddot{x}_1 = -k'x_1 - k(x_1 - x_2) \\ m\ddot{x}_2 = -k'x_2 + k(x_1 - x_2) \end{cases}$$
    
- **Normal modes:** Frequency $\omega$ is the same for all oscillators, with a fixed relative phase.
    
    Trying $x_1 = A_1\cos(\omega t + \phi_0)$ and $x_2 = A_2\cos(\omega t + \phi_0)$ yields the eigenvalue problem:
    
    $$\begin{pmatrix} k+k' & -k \\ -k & k+k' \end{pmatrix} \begin{pmatrix} A_1 \\ A_2 \end{pmatrix} = m\omega^2 \begin{pmatrix} A_1 \\ A_2 \end{pmatrix}$$
    

### Solutions for Normal Modes

- **Solution 1: Translational mode**
    
    - Eigenvalue constraint checks out when $A_1 = A_2$.
        
    - $\omega = \sqrt{\frac{k'}{m}}$
        
- **Solution 2: Vibrational mode**
    
    - Eigenvalue constraint checks out when $A_1 = -A_2$.
        
    - $\omega = \sqrt{\frac{2k+k'}{m}}$
        

### Method 2 (Decoupling)

Adding and subtracting the differential equations:

1. $m\frac{d^2}{dt^2}(x_1+x_2) = -k'(x_1+x_2) \Rightarrow x_1+x_2 = C_1\cos(\sqrt{\frac{k'}{m}}t + \phi_1)$
    
2. $m\frac{d^2}{dt^2}(x_1-x_2) = -(2k+k')(x_1-x_2) \Rightarrow x_1-x_2 = C_2\cos(\sqrt{\frac{2k+k'}{m}}t + \phi_2)$
    

- **Overall motion:** The linear combination of the normal modes. Setting $C_2 = 0$ isolates the translational mode, while $C_1 = 0$ isolates the vibrational mode.
    

---

## 7. Mode Counting for N-atom Molecules

A molecule with $N$ atoms has a total of **$3N$ degrees of freedom (modes)**.

- **Linear molecule:**
    
    - Translation: 3 ($x, y, z$)
        
    - Rotation: 2 ($\theta, \phi$)
        
    - Vibration: $3N - 5$
        
- **Non-linear molecule:**
    
    - Translation: 3
        
    - Rotation: 3 (Euler angles $\alpha, \beta, \gamma$)
        
    - Vibration: $3N - 6$
        

### Examples

![[GP-Oscillatory-Motion6.png]]