---
title: "2023 Midterm · Worked Solutions"
status: draft
tags: [math-physics, physics, midterm, solutions]
created: 2026-11-08
updated: 2026-11-08
sources:
  - "2023 midterm question images supplied by the user, printed pp. 3, 5, 7, 9"
  - "General Physics II lectures 5–12 and associated homework; linked in each solution"
---

# 2023 Midterm · Worked Solutions

[Question paper](paper-2023.md) · [Revision plan](revision-plan.md) · [Transfer practice](transfer-practice.md)

Use $k=1/(4\pi\epsilon_0)$ and $V(\infty)=0$. These are worked reference solutions; the supplied images contain no official answer key.

## 1. Conducting sphere and an external charge {#solution-1}

[Question 1](paper-2023.md#question-1) · [Conductor equilibrium](../05-conductors-and-image-charges.md#1-electrostatic-equilibrium-of-a-conductor) · [Spherical images](../05-conductors-and-image-charges.md#8-classroom-supplement-spherical-image-construction) · [Related homework](../homework/03-conductors-and-circuits.md#ch05-ex03)

### (a) Isolated sphere without external sources

Spherical symmetry and Gauss's law give

$$
\boxed{\mathbf E_1(r)=\begin{cases}
0,&r<R,\\
kQ\hat{\mathbf r}/r^2,&r>R,
\end{cases}\qquad
V_1(r)=\begin{cases}
kQ/R,&r\leq R,\\
kQ/r,&r\geq R.
\end{cases}}
$$

$V$ is continuous at $R$; $E_r$ jumps from $0$ to $Q/(4\pi\epsilon_0R^2)$. The field at a charged ideal surface is specified by its two one-sided limits.

### (b) External charge, sphere still isolated

After redistribution the metal remains equipotential and field-free:

$$
\boxed{\mathbf E_2(O)=0.}
$$

At the center, every surface element is still distance $R$ away, regardless of its density. Since the sphere's **total charge remains $Q$**,

$$
V_2(O)=k\int_{\rm sphere}\frac{dq_s}{R}+\frac{kq}{d}
=\boxed{\frac{kQ}{R}+\frac{kq}{d}.}
$$

表面电荷已不均匀；中心电势仍可这样算，是因为所有面元到中心等距。计算电势相加，计算电场则必须相加矢量。

### (c) Charge exchanged on grounding

Grounding imposes $V(O)=0$ while allowing the net sphere charge to change:

$$
0=\frac{kQ_2}{R}+\frac{kq}{d}
\quad\Rightarrow\quad
\boxed{Q_2=-\frac{qR}{d},\qquad Q-Q_2=Q+\frac{qR}{d}.}
$$

The latter is signed positive charge transferred **from sphere to ground**. Equivalently, electrons flow from ground to sphere. 接地固定电势，不固定净电荷，也不保证电中性。

### (d) Exterior potential by images

**Source correction.** The grounded sphere's induced charge is **nonuniform** in the external charge's presence. The uniformity sentence in the question contradicts its image-method hint; solve the stated $V(R,\theta)=0$ boundary problem.

Put the real $q$ at $d\hat{\mathbf z}$ and an image $-q'$ at $a\hat{\mathbf z}$, $0<a<R$. On the sphere,

$$
\frac{q}{\sqrt{R^2+d^2-2Rd\cos\theta}}
=\frac{q'}{\sqrt{R^2+a^2-2Ra\cos\theta}}.
$$

Matching the constant and $\cos\theta$ terms after squaring gives the interior image

$$
\boxed{a=\frac{R^2}{d},\qquad q'=\frac{qR}{d}.}
$$

Indeed the real-charge distance on the surface is $d/R$ times the image distance, so cancellation holds for every $\theta$. Uniqueness fixes the exterior solution:

$$
\boxed{V_3(r,\theta)=k\left[
\frac{q}{\sqrt{r^2+d^2-2rd\cos\theta}}
-\frac{qR/d}{\sqrt{r^2+(R^2/d)^2-2r(R^2/d)\cos\theta}}
\right],\quad r\geq R.}
$$

Exclude the real charge's singular point. The image is a mathematical replacement inside the excluded conductor; the represented total induced charge is $-q'=Q_2$. Its nonuniform density, if needed, follows from the normal derivative:

$$
\sigma_s(\theta)=-\epsilon_0\left.\frac{\partial V_3}{\partial r}\right|_{R^+}
=-\frac{q(d^2-R^2)}{4\pi R(R^2+d^2-2Rd\cos\theta)^{3/2}}.
$$

The density depends on $\theta$, while its integral is $-qR/d$. If the sphere were isolated instead, a central compensating image would be needed; see [transfer practice 2](transfer-practice.md#check-2).

## 2. Lossy spherical capacitor {#solution-2}

[Question 2](paper-2023.md#question-2) · [Capacitance and local Ohm's law](../06-current-resistance-and-capacitance.md) · [RC discharge](../07-dc-circuits-and-dielectrics.md#4-rc-charging-and-discharging)

Set $\epsilon=\epsilon_0\epsilon_r$. Assume a uniform linear medium and **free discharge with no connected voltage source**. Here $R$ means electrical resistance.

### (a) Capacitance and resistance

At instantaneous inner charge $Q$, spherical symmetry gives

$$
E_r(r)=\frac{Q}{4\pi\epsilon r^2},\qquad
V_a-V_b=\int_a^bE_r\,dr=\frac{Q}{4\pi\epsilon}\left(\frac1a-\frac1b\right).
$$

Consequently,

$$
\boxed{C=\frac{4\pi\epsilon}{1/a-1/b}
=\frac{4\pi\epsilon ab}{b-a}.}
$$

A radial current $I$ crosses area $4\pi r^2$, so $J_r=I/(4\pi r^2)$, $E_r=J_r/\sigma$, and

$$
V_a-V_b=\frac{I}{4\pi\sigma}\int_a^b\frac{dr}{r^2},
\qquad
\boxed{R=\frac1{4\pi\sigma}\left(\frac1a-\frac1b\right).}
$$

Do not substitute a constant area into $R=\ell/(\sigma A)$; the current-carrying area varies with radius.

### (b) Charge relaxation

Outward conventional current removes positive inner charge:

$$
-\dot Q=I=\frac{V_a-V_b}{R}=\frac{Q}{RC}.
$$

Using $Q(0)=Q_0$,

$$
\boxed{Q(t)=Q_0e^{-t/\tau},\qquad
\tau=RC=\frac\epsilon\sigma.}
$$

Geometry cancels in $RC$ for this uniform medium. The equivalent circuit is a leakage resistor **in parallel** with the capacitance; without an external connection they still form a discharge path.

### (c) Joule power and energy check

$$
\boxed{P(t)=I^2R=\frac{(V_a-V_b)^2}{R}
=\frac{Q_0^2}{RC^2}e^{-2t/\tau}
=\frac{\sigma Q_0^2}{4\pi\epsilon^2}
\left(\frac1a-\frac1b\right)e^{-2\sigma t/\epsilon}.}
$$

The local check gives the same result:
$P=\int_a^b\sigma E_r^2\,4\pi r^2dr$.
The total heat is

$$
\int_0^\infty P(t)dt=\frac{Q_0^2}{2C}=U(0),\qquad
P=-\frac d{dt}\left(\frac{Q^2}{2C}\right).
$$

电荷按 $e^{-t/\tau}$ 衰减，能量和功率按 $e^{-2t/\tau}$ 衰减。As $\sigma\to0$, leakage power tends to zero and $\tau\to\infty$.

## 3. Rotating charged spherical surface {#solution-3}

[Question 3](paper-2023.md#question-3) · [Biot–Savart law](../09-fields-of-currents.md#1-biotsavart-law) · [Loop axial field](../10-magnetic-dipoles-and-materials.md#2-circular-arc-coil-and-dipole-field) · [Related homework](../homework/04-magnetic-force-and-fields.md#ch09-ex02)

Take $\boldsymbol\omega=\omega\hat{\mathbf z}$, $\omega>0$. The usual surface density is $\sigma_s=Q/(4\pi R^2)$.

### (a) Latitude-ring charge and current

The ring's circumference is $2\pi R\sin\theta$ and its meridional width is $R\,d\theta$, so

$$
dq=\sigma_s(2\pi R\sin\theta)(R\,d\theta)
=\frac Q2\sin\theta\,d\theta.
$$

In the paper's notation,

$$
\boxed{\sigma(\theta)=\frac{dq}{d\theta}=\frac Q2\sin\theta,\qquad
J(\theta)=\frac{\sigma(\theta)}{2\pi/\omega}
=\frac{Q\omega}{4\pi}\sin\theta.}
$$

The physical ring current is $dI=J(\theta)d\theta$. Here $\sigma(\theta)$ is charge **per polar angle**, not C/m²; $J(\theta)$ is current **per polar angle**, not A/m². 漏掉面元中的 $\sin\theta$ 会同时影响后两问。

### (b) Magnetic dipole moment

The ring radius is $s=R\sin\theta$, so its enclosed area is $A=\pi R^2\sin^2\theta$:

$$
d\boldsymbol\mu=A\,dI\,\hat{\mathbf z}
=\frac{Q\omega R^2}{4}\sin^3\theta\,d\theta\,\hat{\mathbf z}.
$$

Since $\int_0^\pi\sin^3\theta\,d\theta=4/3$,

$$
\boxed{\boldsymbol\mu=\frac{Q\omega R^2}{3}\hat{\mathbf z}.}
$$

Use the area enclosed by the ring for its moment, not the spherical strip's surface area.

### (c) Magnetic field at the center

The ring is offset by $z'=R\cos\theta$; the center of the **sphere** is not generally the center of that ring. Its axial field there is

$$
dB_z=\frac{\mu_0(dI)s^2}{2(s^2+z'^2)^{3/2}}
=\frac{\mu_0Q\omega}{8\pi R}\sin^3\theta\,d\theta.
$$

Integrating,

$$
\boxed{\mathbf B(O)=\frac{\mu_0Q\omega}{6\pi R}\hat{\mathbf z}.}
$$

For positive surface charge the field follows $\boldsymbol\omega$. The far-field dipole formula cannot be applied at the sphere's center.

## 4. Faraday disk {#solution-4}

[Question 4](paper-2023.md#question-4) · [Motional emf and power](../11-electromagnetic-induction.md#3-motional-emf-and-mechanical-energy) · [Related homework](../homework/05-dipoles-and-induction.md#ch11-ex07)

Use cylindrical radius $r$, $\boldsymbol\omega=\omega\hat{\mathbf z}$ and $\mathbf B=B\hat{\mathbf z}$, with $B>0$. Neglect friction and circuit inductance in the resistive-circuit model of (b,c).

### (a) Open circuit: electric field and terminal voltage

The material velocity is $\mathbf u=\omega r\hat{\boldsymbol\phi}$. Charge separation stops the radial current when the force per unit charge vanishes:

$$
\mathbf E+\mathbf u\times\mathbf B=0,
\qquad \boxed{\mathbf E=-B\omega r\hat{\mathbf r}.}
$$

This is a moving conductor; the static-conductor rule $\mathbf E=0$ cannot be imposed in the laboratory frame. Integrating the electric field gives

$$
\boxed{V_{\rm rim}-V_O=-\int_0^a\mathbf E\cdot d\boldsymbol\ell
=\frac12B\omega a^2.}
$$

The rim is at higher potential. If “drop” means $V_O-V_{\rm rim}$, its signed value is $-B\omega a^2/2$.

### (b) Closed circuit: torque and mechanical power

The motional emf from center to rim is
$\mathcal E=\int_0^a(\mathbf u\times\mathbf B)\cdot d\boldsymbol\ell=B\omega a^2/2$.
Hence the current is outward through the disk and returns through the external resistor:

$$
I=\frac{\mathcal E}{R}=\frac{B\omega a^2}{2R}.
$$

For radial current, $d\mathbf F=I\,dr\,\hat{\mathbf r}\times\mathbf B=-IB\,dr\,\hat{\boldsymbol\phi}$. Its lever arm is $r$, giving

$$
\boldsymbol\tau_B=-\int_0^a rIB\,dr\,\hat{\mathbf z}
=-\frac{IBa^2}{2}\hat{\mathbf z},
\qquad
\boxed{\boldsymbol\tau_{\rm ext}=\frac{B^2a^4\omega}{4R}\hat{\mathbf z}.}
$$

Check the energy flow:

$$
\tau_{\rm ext}\omega=\frac{B^2a^4\omega^2}{4R}=I\mathcal E=I^2R.
$$

Current in (b) follows the emf around the complete circuit and its total resistance. For an ideal moving conductor, a zero rest-frame electric field does not imply zero current.

### (c) Free magnetic braking

Let $\mathcal I$ be the disk's moment of inertia about $z$. With the applied torque removed,

$$
\mathcal I\dot\omega=-\frac{B^2a^4}{4R}\omega,
\qquad
\boxed{\omega(t)=\omega_0e^{-t/\tau_m},\qquad
\tau_m=\frac{4\mathcal I R}{B^2a^4}.}
$$

The supplied question gives no mass or inertia, so a numerical decay time is undetermined. For a uniform disk of mass $M$, $\mathcal I=Ma^2/2$ and $\tau_m=2MR/(B^2a^2)$; with mass density $\rho_m$, $M=\rho_m\pi a^2h$ and $\tau_m=2\pi\rho_mhR/B^2$.

Finally,

$$
-\frac d{dt}\left(\frac12\mathcal I\omega^2\right)=I(t)^2R,
\qquad\int_0^\infty I(t)^2R\,dt=\frac12\mathcal I\omega_0^2.
$$

Thickness $h$ enters through the moment of inertia if density is specified; it does not enter the ideal motional emf. 若计入电路自感，需联立 $L\dot I+RI=B a^2\omega/2$ 与 $\mathcal I\dot\omega=-Ba^2I/2$；单指数结果对应忽略自感的模型。
