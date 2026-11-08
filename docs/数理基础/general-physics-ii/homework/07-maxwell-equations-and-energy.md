---
title: "Homework 7 · Displacement Current, Energy Flow, and Angular Momentum"
status: draft
tags: [math-physics, physics, homework, maxwell-equations, energy]
created: 2026-11-08
updated: 2026-11-08
sources:
  - "课程资料/普通物理学-II/homework/chap14.pdf, Exercises 1, 3, 4, PDF p. 9 (printed p. 133)"
---

# Homework 7 · Displacement Current, Energy Flow, and Angular Momentum

[All assignments](index.md) · [Previous](06-inductance-and-ac-circuits.md).

## Ch. 14, Ex. 1 · Displacement current in a circular capacitor {#ch14-ex01}

**Problem.** A parallel-plate capacitor has circular plates of radius $a$, and an AC source imposes $Q(t)=Q_0\sin\omega t$. Find the displacement current density $\mathbf j_d$, total displacement current $i_d$, and magnetic field at radius $r<a$ between the plates. Ignore edges, assume uniform gap electric field, and use $\omega a\ll c$.

**Method:** [Displacement current and Ampère–Maxwell law](../14-maxwell-equations-and-waves.md#1-why-magnetostatic-amperes-law-is-incomplete).

**Solution.** Choose $+z$ along the gap field for $Q>0$. Uniform field gives

$$
\mathbf E=\frac{Q(t)}{\epsilon_0\pi a^2}\hat{\mathbf z},\qquad
\boxed{\mathbf j_d=\epsilon_0\frac{\partial\mathbf E}{\partial t}
=\frac{Q_0\omega}{\pi a^2}\cos\omega t\,\hat{\mathbf z},}
$$

$$
\boxed{i_d=\pi a^2j_{d,z}=Q_0\omega\cos\omega t=\dot Q.}
$$

For a circular Amperian contour of radius $r<a$, its enclosed displacement current is $j_{d,z}\pi r^2$. Thus

$$
2\pi r B_\phi=\mu_0j_{d,z}\pi r^2,
\qquad
\boxed{\mathbf B(r,t)=\frac{\mu_0Q_0\omega r}{2\pi a^2}\cos\omega t\,\hat{\boldsymbol\phi}.}
$$

The sense follows the right-hand rule for signed $i_d$. $\omega a\ll c$ is the quasistatic condition: propagation across the plate is fast compared with the field variation. 位移电流不是电荷穿过真空间隙，却在磁场方程中起相应作用。

## Ch. 14, Ex. 3 · Energy entering a resistive wire {#ch14-ex03}

**Problem.** A long cylindrical lead of radius $a$ and resistivity $\rho_e$ carries steady current $i$, uniformly distributed over its cross-section. Its interior electric field is uniform; neglect the return circuit's magnetic field. (a) Find magnitudes and directions of $\mathbf E,\mathbf B,\mathbf S$ at $r<a$. (b) Verify $\nabla\cdot\mathbf S+\partial u/\partial t=-\rho_eJ^2=-\mathbf j\cdot\mathbf E$, where $J=|\mathbf j|$.

**Method:** [Ohm's law](../06-current-resistance-and-capacitance.md#3-resistance-resistivity-and-conductivity), [Ampère's law](../09-fields-of-currents.md#3-amperes-circuital-law), and [Poynting's theorem](../14-maxwell-equations-and-waves.md#6-energy-flux-intensity-and-spreading).

**Solution. (a)** Choose the positive current along $+z$. With $J=i/(\pi a^2)>0$,

$$
\boxed{\mathbf E=\rho_eJ\hat{\mathbf z},\qquad
\mathbf B=\frac{\mu_0Jr}{2}\hat{\boldsymbol\phi}.}
$$

Since $\hat{\mathbf z}\times\hat{\boldsymbol\phi}=-\hat{\mathbf r}$,

$$
\boxed{\mathbf S=\frac{\mathbf E\times\mathbf B}{\mu_0}
=-\frac{\rho_eJ^2r}{2}\hat{\mathbf r}.}
$$

Thus $E=\rho_ei/(\pi a^2)$, $B=\mu_0ir/(2\pi a^2)$, and $S=\rho_ei^2r/(2\pi^2a^4)$. Energy flows **radially inward**, even though the current flows along the wire. Reversing current reverses $\mathbf E$ and $\mathbf B$ together, leaving $\mathbf S$ inward.

**(b)** All fields are steady, so $\partial u/\partial t=0$. Cylindrical divergence gives

$$
\nabla\cdot\mathbf S=\frac1r\frac{\partial(rS_r)}{\partial r}
=\frac1r\frac{\partial}{\partial r}\left(-\frac12\rho_eJ^2r^2\right)
=-\rho_eJ^2=-\mathbf j\cdot\mathbf E.
$$

This extends continuously to $r=0$. For a length $\ell$, the inward surface power is
$-S_r(a)2\pi a\ell=\rho_eJ^2\pi a^2\ell=i^2R_\ell$, where $R_\ell=\rho_e\ell/(\pi a^2)$. 流入导线的场能恰好转化为焦耳热。

## Ch. 14, Ex. 4 · A spherical capacitor starts rotating {#ch14-ex04}

**Problem.** A spherical capacitor has inner radius $r_1$ and outer radius $r_2>r_1$. Initially at rest, its **insulating** shells carry uniform fixed charges $+Q$ and $-Q$. They are rigidly joined, free to rotate about $z$, and have combined moment of inertia $I$. A surrounding long coaxial solenoid initially produces uniform $\mathbf B=B_0\hat{\mathbf z}$, $B_0>0$, which is slowly removed. Neglect the field produced by the shells' own rotation. Find the final angular velocity and its sense.

**Method:** [Induced electric field](../11-electromagnetic-induction.md#4-induced-electric-field-no-conductor-required) followed by mechanical torque and angular impulse.

**Solution.** At cylindrical radius $s$ inside the solenoid, a circular contour gives

$$
2\pi s E_\phi=-\pi s^2\dot B,
\qquad E_\phi=-\frac{s}{2}\dot B.
$$

On a spherical shell of radius $r$ and signed charge $Q_s$, $s=r\sin\theta$. Its axial torque is

$$
\tau_z=\int sE_\phi\,dq
=-\frac{\dot B}{2}\int r^2\sin^2\theta\,dq.
$$

Uniform surface charge has $\langle\sin^2\theta\rangle=2/3$, so
$\tau_z=-Q_sr^2\dot B/3$. Adding the inner positive shell and outer negative shell,

$$
\tau_{z,\rm total}=\frac{Q(r_2^2-r_1^2)}{3}\dot B.
$$

Integrate $I\dot\Omega=\tau_z$ while $B$ decreases from $B_0$ to zero:

$$
I\Omega_f=\frac{Q(r_2^2-r_1^2)}3\int_{B_0}^{0}dB,
\qquad
\boxed{\boldsymbol\Omega_f=-\frac{QB_0(r_2^2-r_1^2)}{3I}\hat{\mathbf z}.}
$$

The shells turn **clockwise seen from $+z$**. The induced electric field is counterclockwise during removal, but the negative outer shell receives a larger clockwise torque because of its larger squared lever arm. 这里的电荷固定在绝缘壳上，不应使用导体的静电平衡重新分布电荷。
