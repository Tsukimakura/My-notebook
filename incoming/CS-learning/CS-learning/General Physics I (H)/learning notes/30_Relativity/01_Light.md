## 1. Early Measurements of the Speed of Light

The fundamental equation for measuring the speed of light is $c = \frac{\Delta L}{\Delta t}$.

### Galileo's Experiment (1638)

**Setup:** Galileo attempted to measure the speed of light using lanterns between two points (A and B) separated by a distance $L$.

**Result:** For $L \le \mathbf{1 \text{ mile}}$, the time delay $\Delta t$ was practically zero, making it impossible to tell if light had a finite speed or if $c \rightarrow \infty$.

**Hindsight:** Using modern values, the expected delay would be $\Delta t = \frac{3.2 \times 10^3 \text{ m}}{3 \times 10^8 \text{ m/s}} \approx 10^{-5} \text{ s}$, which is far too fast for human reaction times to perceive.

### Rømer's Observation (1644–1710)

**Observation:** Ole Rømer studied the eclipses of Jupiter's Galilean moons (specifically Io). The standard orbital period of Io is approximately **42h**.

**Findings:** When Earth and Jupiter were getting closer ($v_E > v_J$), the observed period of the eclipses was shorter ($T < T_0$). When they were getting further apart, the observed period was longer ($T > T_0$).

**Conclusion:** The speed of light is finite, and the observed differences were due to the Doppler effect.

### Aberration of Light (James Bradley, 1729)

**Principle:** When observing light from a distant star from a moving frame (Earth), the light appears to come in at an angle $\theta$, determined by $\tan\theta = \frac{v}{c}$.

**Result:** By observing the seasonal changes of $\theta$ as Earth orbits the sun, the speed of light was calculated to be $c \approx 3.01 \times 10^8 \text{ m/s}$, which had only a **0.4%** error.

![[General-physics-light1.png]]

- diagram from hand-written notes of Mr. Wang, also the diagrams shown below

### Rotating Mirror Experiments

**Léon Foucault (1862):** Light was bounced off a rotating mirror to a distant fixed mirror (distance $h$) and back. By the time the light returned ($t = \frac{2h}{c}$), the mirror had rotated by an angle $\theta = \omega t$.

![[General-physics-light2.png]]

**Foucault's Result:** Using the relationship $c = \frac{2\omega h}{\theta}$, he measured $c \approx 2.98 \times 10^8 \text{ m/s}$ (**0.6%** error).

**Albert Michelson (1926):** Using an improved apparatus and a larger distance of $h \approx \mathbf{35 \text{ km}}$, Michelson refined the measurement to $c \approx 2.99796 \times 10^8 \text{ m/s}$, dropping the error to **0.001%**.

## 2. The Ether Hypothesis and Its Contradictions

Visible light is an electromagnetic (E&M) wave with wavelengths ($\lambda$) ranging from **400 nm** (Violet) to **700 nm** (Red). Its frequency is derived from $f = \frac{c}{\lambda}$, yielding ranges from $7.5 \times 10^{14} \text{ Hz}$ to $4.3 \times 10^{14} \text{ Hz}$.

### The Search for a Medium

A major historical question was whether light required a medium to propagate. This theoretical substance, believed to fill all space including vacuums, was called the "luminiferous aether" or simply "ether."

**Supporters:** Included Aristotle (4th-century BC) and later scientists like Boyle, Huygens, and Newton (17th century). By the 19th century, the concept faced significant mathematical and logical hurdles.

**Mechanical Contradiction:** For a longitudinal wave, velocity $v = \sqrt{\frac{B}{\rho}}$ (where $B$ is bulk modulus). For a transverse wave like light, $v = \sqrt{\frac{G}{\rho}}$ (where $G$ is shear modulus). Because $c$ is extraordinarily large, $G$ must also be incredibly large. This implies the ether must be remarkably hard, contradicting the fact that planets move freely through space without resistance.

### Fizeau Experiment (1851)

**Goal:** To measure the speed of light in moving water and determine if the flowing water "drags" the ether.

![[General-physics-light3.png]]

**Naive Expectation:** $v_+ = \frac{c}{n} + v$ and $v_- = \frac{c}{n} - v$.

**Measured Result:** $v_+ = \frac{c}{n} + v(1 - \frac{1}{n^2})$. Since the index of refraction for water is $n \approx 1.333$, the drag factor $(1 - \frac{1}{n^2})$ was approximately **0.44**.

**Conclusion:** This indicated a much lower drag speed than expected, suggesting only a "partial drag" of the ether.

### Michelson-Morley Experiment (1887)

**Goal:** To detect an "ether wind" caused by the Earth moving through the supposedly stationary ether at a relative speed of $v \sim 3 \times 10^4 \text{ m/s}$. Air has an index of refraction $n \approx 1$, meaning $(1 - \frac{1}{n^2}) \approx 0$, which should imply no ether drag by Earth, hence a strong ether wind should be detectable.

**Result:** Known as the most famous "failed" experiment (earning a Nobel Prize in 1907). They expected a fringe drift of **0.4 fringes** due to interference, but the experiment yielded $\le \mathbf{0.01 \text{ fringes}}$.

**Conclusion:** The ether appears stationary relative to Earth, implying a "complete drag."

**The Ultimate Paradox:** The Fizeau experiment showed incomplete drag, while the Michelson-Morley experiment showed complete drag. Therefore, the ether hypothesis was entirely self-contradicting.

## 3. Assumptions in Special Relativity

### Moving Light Source Experiment (Alväger et al., 1964)

Protons striking Beryllium created Pion particles ($\pi^0$) moving at $v \sim 0.99c$. These decayed into photons ($\gamma$).

**Result:** The speed of the emitted photons was measured precisely at $2.9979 \times 10^8 \text{ m/s}$. The speed of light from a moving source is identically the same as from a stationary source.

### Einstein's Two Core Postulates

**First Postulate (Relativity Principle):** Physical laws in ALL inertial frames are the same. It is impossible to conduct an internal experiment to determine if an inertial frame is static or moving smoothly. If the ether existed, it would establish a special, absolutely static inertial frame, which is theoretically "ugly" and unnecessary.

**Second Postulate (Invariance of $c$):** The speed of light is exactly the same in all inertial frames, regardless of the relative motion between the source and the observer.

## 4. Deriving the Lorentz Transformation

Assume two coordinate frames: $K$ and $K'$. Frame $K'$ moves at a relative velocity $v$ along the x-axis. At $t = t' = 0$, a light source emits a pulse at the origin $O = O'$.

![[General-physics-light4.png]]

### Spherical Wavefront Invariance

In frame $K$, the wavefront is a sphere: $x^2 + y^2 + z^2 - c^2t^2 = 0$.

According to the second postulate, it must also be a spherical wavefront in frame $K'$: $x'^2 + y'^2 + z'^2 - c^2t'^2 = 0$.

Since there is no relative motion along the y and z axes ($y' = y$, $z' = z$), we can equate the remaining dimensions:

$$x^2 - c^2t^2 = x'^2 - c^2t'^2$$

### Applying a Linear Transformation

We try a linear transformation using hyperbolic functions, knowing $\cosh^2\varphi - \sinh^2\varphi = 1$:

$$x' = x \cosh\varphi - ct \sinh\varphi$$

$$ct' = -x \sinh\varphi + ct \cosh\varphi$$

**Verification:**

$$x'^2 - (ct')^2 = (x \cosh\varphi - ct \sinh\varphi)^2 - (-x \sinh\varphi + ct \cosh\varphi)^2$$

Expanding and factoring out terms verifies the invariant condition:

$$x'^2 - (ct')^2 = x^2(\cosh^2\varphi - \sinh^2\varphi) - c^2t^2(\cosh^2\varphi - \sinh^2\varphi) = x^2 - c^2t^2$$

### Solving for $\beta$

Let $\beta \equiv \tanh\varphi$. This implies:

$$\sinh\varphi = \frac{\beta}{\sqrt{1-\beta^2}} \quad \text{and} \quad \cosh\varphi = \frac{1}{\sqrt{1-\beta^2}}$$

Substitute these back into the linear transformation equations:

$$x' = \frac{x - \beta ct}{\sqrt{1-\beta^2}}$$

$$t' = \frac{t - \beta \frac{x}{c}}{\sqrt{1-\beta^2}}$$

To find $\beta$, we look at the origin $O$ of the $K'$ frame. In the $K$ frame, it moves such that $x = vt$. In the $K'$ frame, it remains at $x' = 0$.

Substituting $x' = 0$ into the equation:

$$0 = \frac{vt - \beta ct}{\sqrt{1-\beta^2}}$$

Solving for $\beta$ yields $\beta = \frac{v}{c}$.

### Final Lorentz Transformation Equations

Substituting $\beta = \frac{v}{c}$ back into our system gives the complete Lorentz transformation equations.

**Transformation from $K$ to $K'$:**

$$x' = \frac{x - vt}{\sqrt{1 - v^2/c^2}}$$

$$y' = y$$

$$z' = z$$

$$t' = \frac{t - \frac{v}{c^2}x}{\sqrt{1 - v^2/c^2}}$$

**Transformation from $K'$ to $K$:**

$$x = \frac{x' + vt'}{\sqrt{1 - v^2/c^2}}$$

$$y = y'$$

$$z = z'$$

$$t = \frac{t' + \frac{v}{c^2}x'}{\sqrt{1 - v^2/c^2}}$$