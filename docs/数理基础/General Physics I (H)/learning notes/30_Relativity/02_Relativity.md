# 02_Relativity

## 1. The Lorentz Transformation (Standard Configuration)

The Lorentz transformation relates the space and time coordinates of an event as measured in two different inertial frames. Assume a stationary track frame $K(x,y,z,t)$ and a train frame $K'(x',y',z',t')$ moving at a constant speed $+v$ along the x-axis relative to $K$.

The transformation from $K$ to $K'$ is given by:

$$
x' = \frac{x - vt}{\sqrt{1 - v^2/c^2}}
$$

$$
y' = y
$$

$$
z' = z
$$

$$
ct' = \frac{ct - \frac{v}{c}x}{\sqrt{1 - v^2/c^2}}
$$

### 1.1 Matrix Form

Defining $\beta = v/c$ and the Lorentz factor $\gamma = \frac{1}{\sqrt{1-\beta^2}}$, the transformation can be expressed elegantly in matrix notation:

$$
\begin{pmatrix} ct' \\ x' \end{pmatrix} = \begin{pmatrix} \gamma & -\beta\gamma \\ -\beta\gamma & \gamma \end{pmatrix} \begin{pmatrix} ct \\ x \end{pmatrix}
$$

**Note on Basis Vectors:** Changing the frame of reference is mathematically equivalent to a change of basis. The relationship between the basis vectors of $K$ ($\hat{e}_t, \hat{e}_x$) and $K'$ ($\hat{e}_{t'}, \hat{e}_{x'}$) is:

$$
\{ \hat{e}_t, \hat{e}_x \} = \{ \hat{e}_{t'}, \hat{e}_{x'} \} \begin{pmatrix} \gamma & -\beta\gamma \\ -\beta\gamma & \gamma \end{pmatrix}
$$

## 2. Minkowski Diagrams

A Minkowski diagram provides a geometric visualization of special relativity in spacetime.

![[General-physics-relativity1.png]]

- In the $K$ frame, the axes are strictly orthogonal ($ct$ and $x$).

- For the moving $K'$ frame (speed $+v$), the $ct'$ and $x'$ axes tilt inward toward the light cone. The angle of tilt $\theta$ relative to the $K$ axes is given by $\tan\theta = \frac{v}{c}$.

- If the train were moving in the opposite direction (speed $-v$), the $ct'$ and $x'$ axes would skew outward.

![[General-physics-relativity2.png]]

**Consistency Check:** Observe the origin $O'$ of the $K'$ frame at time $t$ in the $K$ frame. Its coordinates in $K$ are $\{ct, vt\}$. Applying the Lorentz matrix:

![[General-physics-relativity3.png]]

$$
\begin{pmatrix} ct' \\ x' \end{pmatrix} = \begin{pmatrix} \gamma & -\beta\gamma \\ -\beta\gamma & \gamma \end{pmatrix} \begin{pmatrix} ct \\ vt \end{pmatrix} = \begin{pmatrix} \gamma(ct - \beta vt) \\ \gamma(- \beta ct + vt) \end{pmatrix}
$$

Since $v/c = \beta$, we have $vt = \beta ct$. Substituting this yields $x' = 0$ and $ct' = ct/\gamma$, confirming that $O'$ strictly lies on the $ct'$ axis.

## 3. Relativistic Velocity Addition

Suppose a ball is moving on the train. We define:

- $v$: Speed of the train relative to the track.

- $u$: Speed of the ball relative to the train.

- $w$: Speed of the ball relative to the track.

**Classical (Non-relativistic) Addition:** $w = u + v$

**Relativistic Addition:**

$$
w = \frac{u + v}{1 + \frac{uv}{c^2}}
$$

_(Note: For $u, v \ll c$, the denominator approaches $1$, recovering the classical Galilean addition $w \approx u + v$.)_

### Proof Method 1: Thought Experiment (Kinematics)

Consider a photon and a ball emitted from the origin $O$ inside a train of length $L_0$. The photon hits the front wall, reflects, and eventually meets the ball.

1. **In the train frame ($K'$):** Let the photon travel forward, hit the wall, and travel a distance $fL_0$ backward before meeting the ball.

        Total distance the photon traveled is $(1+f)L_0$. The time of the meeting event is $t' = \frac{(1+f)L_0}{c}$.

        The ball traveled forward a distance $x' = (1-f)L_0$. Since $x' = u t'$, we get:

        $$
    u \frac{(1+f)L_0}{c} = (1-f)L_0 \implies \frac{u}{c} = \frac{1-f}{1+f} \implies f = \frac{c-u}{c+u} \quad (*)
        $$

2. **In the track frame ($K$):**

        Let $T_0$ be the time the photon hits the front wall, and $T_1$ be the subsequent time until it meets the ball. Because the wall is moving at $v$, $T_0 = \frac{L}{c-v}$ and $T_1 = \frac{fL}{c+v}$.

        Let $D$ be the distance between the ball and the front wall when the photon hits the wall. Based on relative speeds:

        $$
    D = cT_0 - wT_0 \quad \text{and} \quad D = cT_1 + wT_1
        $$

        Equating these yields $T_0(c-w) = T_1(c+w) \implies \frac{T_0}{T_1} = \frac{c+w}{c-w}$.

        Substituting $T_0$ and $T_1$ gives:

        $$
    f \frac{c-v}{c+v} = \frac{c-w}{c+w} \quad (**)
        $$

3. **Combine (*) and (**):

    $$
\frac{c-u}{c+u} \cdot \frac{c-v}{c+v} = \frac{c-w}{c+w} \implies w = \frac{u + v}{1 + \frac{uv}{c^2}}
    $$

### Proof Method 2: Matrix Transformation

Using the meeting event $C$ from Method 1, its coordinates in $K'$ are $ct' = (1+f)L_0$ and $x' = \frac{u}{c}(1+f)L_0$.

Apply the inverse Lorentz transformation (from $K'$ to $K$ using $+v$):

$$
\begin{pmatrix} ct \\ x \end{pmatrix} = \begin{pmatrix} \gamma & \beta\gamma \\ \beta\gamma & \gamma \end{pmatrix} \begin{pmatrix} (1+f)L_0 \\ \frac{u}{c}(1+f)L_0 \end{pmatrix} = \gamma(1+f)L_0 \begin{pmatrix} 1 + \beta \frac{u}{c} \\ \beta + \frac{u}{c} \end{pmatrix}
$$

The velocity in $K$ is $w = \frac{x}{t} = c \frac{x}{ct}$. Substituting the matrix results:

$$
w = c \frac{\beta + u/c}{1 + \beta u/c} = \frac{v + u}{1 + \frac{vu}{c^2}}
$$

### Proof Method 3: Differential Form (Standard)

Start with the complete 4D Lorentz transformation from $K'$ to $K$:

$$
\begin{pmatrix} ct \\ x \\ y \\ z \end{pmatrix} = \begin{pmatrix} \gamma & \beta\gamma & 0 & 0 \\ \beta\gamma & \gamma & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{pmatrix} \begin{pmatrix} ct' \\ x' \\ y' \\ z' \end{pmatrix}
$$

Taking differentials gives the relations for coordinate increments:

$$
\begin{cases} dt = \gamma dt' + \frac{\beta\gamma}{c} dx' \\ dx = \beta\gamma c dt' + \gamma dx' \\ dy = dy' \\ dz = dz' \end{cases}
$$

Dividing $dx$, $dy$, and $dz$ by $dt$ yields the velocity addition formulas in all three dimensions (where $u_x' = dx'/dt'$, etc.):

$$
\frac{dx}{dt} = \frac{u_x' + v}{1 + \frac{u_x' v}{c^2}}
$$

$$
\frac{dy}{dt} = \frac{u_y'}{\gamma(1 + \frac{u_x' v}{c^2})}
$$

$$
\frac{dz}{dt} = \frac{u_z'}{\gamma(1 + \frac{u_x' v}{c^2})}
$$

## 4. Observations and Generalizations

### Testing Velocity Limits

- If the object is a photon ($u=c$): $w = \frac{c+v}{1+v/c} = c$. This is perfectly consistent with the postulate of the constant speed of light.

- If both speeds are close to $c$ (e.g., $u=0.9c$, $v=0.9c$): $w = \frac{1.8c}{1+0.81} \approx 0.994c$. The combined speed remains strictly $w \le c$.

### General Lorentz Transformation (Arbitrary Direction)

If the $K'$ frame moves with velocity $\vec{v} = v\hat{n}$ (where $\hat{n}$ is a unit vector in an arbitrary direction), the transformation matrix generalizes to:

$$
\begin{pmatrix} ct' \\ x' \\ y' \\ z' \end{pmatrix} = \begin{pmatrix} \gamma & -\beta\gamma n_x & -\beta\gamma n_y & -\beta\gamma n_z \\ -\beta\gamma n_x & 1+(\gamma-1)n_x^2 & (\gamma-1)n_x n_y & (\gamma-1)n_x n_z \\ -\beta\gamma n_y & (\gamma-1)n_y n_x & 1+(\gamma-1)n_y^2 & (\gamma-1)n_y n_z \\ -\beta\gamma n_z & (\gamma-1)n_z n_x & (\gamma-1)n_z n_y & 1+(\gamma-1)n_z^2 \end{pmatrix} \begin{pmatrix} ct \\ x \\ y \\ z \end{pmatrix}
$$

**Derivation Principle:**

This general matrix $\Lambda$ is constructed by rotating the coordinate system so that the x-axis aligns with $\hat{n}$, performing the standard 1D Lorentz boost $\Lambda_x$, and then rotating back. Let $R$ be the rotation matrix such that $R\hat{e}_x = \hat{n}$. Defining a 4x4 rotation matrix $\tilde{R} = \begin{pmatrix} 1 & 0 \\ 0 & R \end{pmatrix}$, the complete transformation is given by:

$$
\Lambda = \tilde{R} \Lambda_x \tilde{R}^T
$$

## 5. The Relativity of Simultaneity

An **event** in relativity is defined by a set of coordinates $\{t, x, y, z\}$. Ideally, it is instantaneous, represented by a Dirac delta function in time $\delta(t)$, and point-like, represented by $\delta(x)\delta(y)\delta(z)$.

**Core Question:** If two events are simultaneous in frame $K$ ($t_1 = t_2$), are they still simultaneous in a moving frame $K'$?

- **Newtonian Physics:** Yes. Time is absolute.

- **Relativity:** NOT always.

In a Minkowski diagram, simultaneous events in frame $K$ (e.g., events $A$ and $B$) lie on a line parallel to the $x$-axis ($t_A = t_B$). However, when viewed from the $K'$ frame, these events project onto different points on the $ct'$ axis, meaning $t'_A \neq t'_B$.

![[General-physics-relativity4.png]]

### 5.1 Thought Experiment: Light Source on a Train

Consider a train frame ($K'$) of proper length $L_0$. At $t'=0$, a light source at the center of the train emits photons towards both ends.

- **Event B:** Front photon hits the front end.

- **Event C:** Rear photon hits the rear end.

    In the train frame $K'$, these events are perfectly simultaneous: $t'_B = t'_C = \frac{L_0}{2c}$.

### 5.2 Analysis in the Track Frame ($K$)

Now observe the same experiment from the track frame ($K$), where the train moves to the right with velocity $v$, and its length is measured as $L$.

Let $t=t_0$ be the time of emission.

- **Event C (rear hit):** Occurs at time $t_r$. The rear end moves forward, meeting the photon: $c(t_r - t_0) = \frac{1}{2}L - v(t_r - t_0)$.

- **Event B (front hit):** Occurs at time $t_f$. The front end moves away from the photon: $c(t_f - t_0) = \frac{1}{2}L + v(t_f - t_0)$.

Clearly, $t_f \neq t_r$. Events B and C are **NOT simultaneous** in the $K$ frame.

Let $T \equiv t_f - t_r$ (time difference in $K$) and $D \equiv x_f - x_r$ (spatial difference in $K$).

Subtracting the kinematic equations gives $cT = v(t_r + t_f - 2t_0)$, and adding them gives $c(t_f - t_0) + c(t_r - t_0) = D$. By substituting, we find the fundamental relation:

$$
T = \frac{v}{c^2}D
$$

### 5.3 Proof via Lorentz Transformation

We can rigorously prove this using the Lorentz Transformation matrix from $K'$ to $K$.

- **Event C in $K'$:** $\{ct' = \frac{L_0}{2}, x' = 0\}$

- **Event B in $K'$:** $\{ct' = \frac{L_0}{2}, x' = L_0\}$

Transforming Event C to $K$:

$$
\begin{pmatrix} ct_r \\ x_r \end{pmatrix} = \begin{pmatrix} \gamma & \beta\gamma \\ \beta\gamma & \gamma \end{pmatrix} \begin{pmatrix} L_0/2 \\ 0 \end{pmatrix} = \begin{pmatrix} \frac{1}{2}\gamma L_0 \\ \frac{\beta}{2}\gamma L_0 \end{pmatrix}
$$

Transforming Event B to $K$:

$$
\begin{pmatrix} ct_f \\ x_f \end{pmatrix} = \begin{pmatrix} \gamma & \beta\gamma \\ \beta\gamma & \gamma \end{pmatrix} \begin{pmatrix} L_0/2 \\ L_0 \end{pmatrix} = \begin{pmatrix} \gamma L_0 (\beta + \frac{1}{2}) \\ \gamma L_0 (\frac{\beta}{2} + 1) \end{pmatrix}
$$

Calculating the differences in $K$:

- $cT = ct_f - ct_r = \beta\gamma L_0$

- $D = x_f - x_r = \gamma L_0$

Thus, $\frac{cT}{D} = \beta = \frac{v}{c} \implies T = \frac{v}{c^2}D$.

![[General-physics-relativity5.png]]

_(Note: As shown in the Minkowski diagram, the slope of the line connecting two events simultaneous in $K'$ is $\tan\theta = \frac{v}{c}$, directly yielding $\frac{cT}{D} = \frac{v}{c}$. This geometric relation holds universally, even if the objects are massive balls moving at speed $u$ instead of photons.)_

## 6. Length Contraction

**Proper Length ($L_0$):** The length of an object measured in a reference frame where the object is strictly at rest.

Consider the train (length $L_0$ in $K'$, length $L$ in $K$) moving at speed $v$ relative to the track. Let's define three distinct events based on clocks situated on the train (front and rear) and the track:

- **Event A:** Rear clock of train meets rear clock of track. (Set as origin: $t=0, x=0, t'=0, x'=0$)

- **Event B:** Front clock of train meets front clock of track at $t=0$ in the track frame ($K$). The coordinate in $K$ is $x=L$.

- **Event C:** Front clock of train reads $t'=0$ in the train frame ($K'$). The coordinate in $K'$ is $x'=L_0$.

**Analyzing the process from Event B to Event C:**

In frame $K$, the front end of the train moves from $x_B = L$ at time $t_B = 0$ to coordinate $x_c$ at time $t_c$. The speed of the train is $v = \frac{x_c - x_B}{t_c - t_B}$.

Let's find the coordinates of Event C in frame $K$ by transforming from $K'$ $\{ct'=0, x'=L_0\}$:

$$
\begin{pmatrix} ct_c \\ x_c \end{pmatrix} = \begin{pmatrix} \gamma & \beta\gamma \\ \beta\gamma & \gamma \end{pmatrix} \begin{pmatrix} 0 \\ L_0 \end{pmatrix} = \begin{pmatrix} \beta\gamma L_0 \\ \gamma L_0 \end{pmatrix}
$$

Substitute $x_c = \gamma L_0$ and $t_c = \frac{\beta\gamma L_0}{c}$ into the velocity equation:

$$
v = \frac{\gamma L_0 - L}{\frac{\beta\gamma L_0}{c} - 0}
$$

$$
\beta^2 \gamma L_0 = \gamma L_0 - L
$$

$$
L = \gamma L_0 (1 - \beta^2)
$$

Because $\gamma = \frac{1}{\sqrt{1-\beta^2}}$, we know $(1-\beta^2) = \gamma^{-2}$. Therefore:

$$
L = \gamma^{-1} L_0
$$

Since $\gamma^{-1} = \sqrt{1-\beta^2} < 1$, we conclude $L < L_0$. The length of a moving object is contracted along its direction of motion.

## 7. Time Dilation

We investigate how time passes differently by observing a single clock fixed on the front of the train (in frame $K'$) as it travels between Event B and Event C.

**Proper Time ($\Delta t_0$):** The time interval measured by a single clock present at both events (the clock is stationary in its own frame).

- In frame $K'$, the clock is at the front of the train. It reads $t' = t'_B$ at Event B, and $t' = 0$ at Event C.

- The proper time interval is $\Delta t_0 \equiv 0 - t'_B$.

**Dilated Time ($\Delta t$):** The time interval measured by synchronized clocks in frame $K$.

- In frame $K$, Event B occurs at $t = 0$ and Event C occurs at $t = t_c$.

- The time interval is $\Delta t \equiv t_c - 0 = t_c$.

**Derivation:**

First, find $t'_B$ by inverse-transforming Event B $\{ct=0, x=L\}$ from $K$ to $K'$:

$$
\begin{pmatrix} ct'_B \\ x'_B \end{pmatrix} = \begin{pmatrix} \gamma & -\beta\gamma \\ -\beta\gamma & \gamma \end{pmatrix} \begin{pmatrix} 0 \\ L \end{pmatrix} = \begin{pmatrix} -\beta\gamma L \\ \gamma L \end{pmatrix}
$$

This gives $ct'_B = -\beta\gamma L$, so the proper time interval is:

$$
\Delta t_0 = 0 - (-\frac{\beta\gamma L}{c}) = \frac{\beta\gamma L}{c}
$$

Next, we already derived $t_c$ during the length contraction proof: $t_c = \frac{\beta\gamma L_0}{c}$. Therefore:

$$
\Delta t = \frac{\beta\gamma L_0}{c}
$$

Since we established that $L_0 = \gamma L$, we substitute this into the equation for $\Delta t$:

$$
\Delta t = \frac{\beta\gamma (\gamma L)}{c} = \gamma \left( \frac{\beta\gamma L}{c} \right) = \gamma \Delta t_0
$$

Since $\gamma > 1$, we conclude $\Delta t > \Delta t_0$. A moving clock ticks slower relative to a stationary observer.

## 8. The Symmetry "Puzzle" of Relativity

Recall the two fundamental consequences of the Lorentz transformation:

- **Length Contraction:** $L = \gamma^{-1} L_0 < L_0$

- **Time Dilation:** $\Delta t = \gamma \Delta t_0 > \Delta t_0$

### The Apparent Contradiction

- **Track Observer:** Observes the train's length as contracted and the clock on the train as running slow.

- **Train Observer:** Observes the track's length as contracted and the clock on the track as running slow.

**Is this a contradiction? No.** This perfectly illustrates the principle of relativity—neither inertial frame is preferred.

### Proof via Lorentz Transformation

Let's mathematically prove that a clock stationary in the track frame ($K$) appears to run slow when observed from the train frame ($K'$). We expect the time interval measured in $K'$ to be $\Delta t' = \gamma \Delta t_0$.

Consider two events $D$ and $E$ on a clock stationary at the origin of $K$ ($x = 0$):

- Event D: $t = 0 \implies ct_D = 0, x_D = 0$

- Event E: $t = t_E \implies ct_E = ct_E, x_E = 0$

Transforming Event E to the $K'$ frame:

$$
\begin{pmatrix} ct'_E \\ x'_E \end{pmatrix} = \begin{pmatrix} \gamma & -\beta\gamma \\ -\beta\gamma & \gamma \end{pmatrix} \begin{pmatrix} ct_E \\ x_E \end{pmatrix} = \begin{pmatrix} \gamma ct_E - \beta\gamma x_E \\ -\beta\gamma ct_E + \gamma x_E \end{pmatrix}
$$

Transforming Event D to the $K'$ frame:

$$
\begin{pmatrix} ct'_D \\ x'_D \end{pmatrix} = \begin{pmatrix} \gamma & -\beta\gamma \\ -\beta\gamma & \gamma \end{pmatrix} \begin{pmatrix} 0 \\ x_E \end{pmatrix} = \begin{pmatrix} -\beta\gamma x_E \\ \gamma x_E \end{pmatrix}
$$

Since the clock is stationary at the origin in $K$, $x_E = 0$.

The time interval in $K'$ is $\Delta t'_{DE} = t'_E - t'_D = \gamma t_E = \gamma \Delta t_{DE}$.

Because the clock is at rest in $K$, $\Delta t_{DE}$ is the proper time ($\Delta t_0$). Thus, $\Delta t' = \gamma \Delta t_0$, proving that moving clocks slow down symmetrically.

## 9. Physical Application: Muon Decay

Muons are unstable subatomic particles created in the upper atmosphere.

- **Half-life at rest (proper time):** $t_{1/2} \approx 1.52\ \mu\text{s}$

- **Decay formula:** $N = N_0 2^{-t/t_{1/2}}$

- **Scenario:** Muons travel toward the Earth's surface from a height of 2000 m at a speed of $v = 0.98c$.

**Naive (Classical) Calculation:**

Time to reach surface: $t = \frac{2000\text{ m}}{0.98c} \approx 6.8\ \mu\text{s}$

Survival rate: $\frac{N}{N_0} \approx 2^{-6.8 / 1.52} \approx 4.5\%$ (Very few reach the surface).

### Relativistic Calculation (Method 1: Earth Frame)

In the Earth frame, the surface is stationary.

- Travel distance $x_B = L_0 = 2000\text{ m}$.

- Travel time $t_B = \frac{L_0}{v} \approx 6.8\ \mu\text{s}$.

- Because the muon is moving rapidly, its "internal clock" experiences **time dilation**.

- Time passed in the muon frame ($\Delta t_0$):

    $$
\Delta t_0 = \Delta t' = \frac{L_0}{v\gamma} = \gamma^{-1} t_B \approx 1.35\ \mu\text{s}
    $$

- Relativistic Survival rate: $\frac{N}{N_0} \approx 2^{-1.35 / 1.52} \approx 54\%$

_(Alternatively: The Earth observer sees the muon's half-life dilated to $t_{1/2}^{\text{(earth)}} = \gamma t_{1/2} \approx 7.6\ \mu\text{s}$.)_

### Relativistic Calculation (Method 2: Muon Frame)

In the muon frame, the muon is stationary, and the Earth's surface rushes upward at $v = 0.98c$.

- The 2000 m atmosphere undergoes **length contraction**.

- Distance to travel: $x'_D - x'_B = \gamma^{-1} L_0 \approx 398\text{ m}$.

- Time needed to go from D to B in the muon frame:

    $$
t'_{DB} = \frac{\gamma^{-1} L_0}{v} \approx 1.35\ \mu\text{s}
    $$

- Survival rate: $\frac{N}{N_0} \approx 2^{-1.35 / 1.52} \approx 54\%$

**Summary Table:**

|**Property**|**Earth Frame**|**Muon Frame**|
|---|---|---|
|**Distance**|$L_0 = 2000\text{ m}$|$\gamma^{-1} L_0 \approx 398\text{ m}$|
|**Half-life**|$\gamma t_{1/2} \approx 7.6\ \mu\text{s}$|$t_{1/2} \approx 1.52\ \mu\text{s}$|
|**Travel Time**|$\frac{L_0}{v} \approx 6.8\ \mu\text{s}$|$\frac{\gamma^{-1} L_0}{v} \approx 1.35\ \mu\text{s}$|

Both reference frames yield the exact same physical reality: 54% of the muons survive.

## 10. Resolving Coordinate Intuition Traps

Consider a train of proper length $L_0$ moving at speed $v$. At $t'=0$, the train is centered at the origin in its own frame ($K'$). What are the front and rear locations in the track frame ($K$) at a given time $t=t_0$?

Let Event A be the location of the train's front. In $K'$: $t'_A = 0$, $x'_A = \frac{L_0}{2}$.

Transforming Event A to $K$:

$$
\begin{pmatrix} ct_0 \\ x_A \end{pmatrix} = \begin{pmatrix} \gamma & \beta\gamma \\ \beta\gamma & \gamma \end{pmatrix} \begin{pmatrix} 0 \\ L_0/2 \end{pmatrix} = \begin{pmatrix} \frac{1}{2}\beta\gamma L_0 \\ \frac{1}{2}\gamma L_0 \end{pmatrix}
$$

Notice that $x_A = \frac{\gamma}{2} L_0$. It is **NOT** $\frac{\gamma^{-1}}{2} L_0$. You cannot simply divide the contracted length by 2 to find the coordinate, because of the relativity of simultaneity.

![[General-physics-relativity6.png]]

**Verifying Length Contraction:**

Let Event F be the center of the train in $K$. At $t=t_0$:

- $ct_0 = \frac{1}{2}\beta\gamma L_0$

- The center moves at $v$, so $x_F = vt_0 = \frac{v}{c} ct_0 = \frac{1}{2}\beta^2\gamma L_0$

The distance from the center to the front in frame $K$ is:

$$
x_A - x_F = \frac{1}{2}\gamma L_0 - \frac{1}{2}\beta^2\gamma L_0 = \frac{1}{2}\gamma L_0 (1-\beta^2) = \gamma^{-1} \frac{L_0}{2}
$$

This perfectly matches the expected length contraction for half the train.

## 11. The Invariant Interval

In Newtonian physics, the spatial distance between two events is absolute.

- **Galilean Transformation Invariant:** $(\Delta s)^2 \equiv (\Delta x)^2 + (\Delta y)^2 + (\Delta z)^2$

In relativity, space and time mix. The absolute quantity is the spacetime interval.

- **Lorentz Transformation Invariant:** $(\Delta s)^2 \equiv c^2(\Delta t)^2 - (\Delta x)^2 - (\Delta y)^2 - (\Delta z)^2$

**Mathematical Proof (1D Space):**

Let $s^2 = c^2 t^2 - x^2$. Substitute the Lorentz transformation equations $ct = \gamma ct' + \beta\gamma x'$ and $x = \beta\gamma ct' + \gamma x'$:

$$
c^2 t^2 - x^2 = (\gamma ct' + \beta\gamma x')^2 - (\beta\gamma ct' + \gamma x')^2
$$

Expanding and grouping terms:

$$
= c^2 t'^2 (\gamma^2 - \beta^2\gamma^2) + x'^2 (\beta^2\gamma^2 - \gamma^2)
$$

Since $\gamma^2(1 - \beta^2) = 1$ and $\gamma^2(\beta^2 - 1) = -1$:

$$
= c^2 t'^2 - x'^2
$$

The interval is mathematically proven to be invariant across all inertial frames.

## 12. Spacetime Separation and Causality

The invariant interval $s^2$ classifies the causal relationship between two events. Plotted on a Minkowski diagram, the light cones ($s^2 = 0$) define the boundaries.

![[General-physics-relativity7.png]]

- **Timelike Separation ($s^2 > 0$):**

    - Occurs inside the light cone.

    - A particle moving slower than light can travel between the two events.

    - It is physically possible to find a reference frame where the two events happen at the **same place** ($x=0$).

    - The interval defines the **Proper Time** ($\Delta t_0 = s/c$).

- **Spacelike Separation ($s^2 < 0$):**

    - Occurs outside the light cone.

    - No signal or particle can travel between the events (would require $v > c$).

    - It is physically possible to find a reference frame where the two events happen at the **same time** ($t=0$).

    - The interval defines the **Proper Length/Distance** ($L_0 = \sqrt{-s^2}$).

- **Lightlike Separation ($s^2 = 0$):**

    - Occurs exactly on the light cone.

    - Only light (or a massless particle) can connect the two events.

**Causality (因果律):** If two events are spacelike separated, their chronological order depends on the observer's reference frame. Therefore, they cannot influence each other. Causality is strictly preserved because cause and effect must always have a timelike or lightlike separation.
