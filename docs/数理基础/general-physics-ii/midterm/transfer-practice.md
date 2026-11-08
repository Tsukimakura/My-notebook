---
title: "Midterm · Transfer Practice"
status: draft
tags: [math-physics, physics, midterm, exercises]
created: 2026-11-08
updated: 2026-11-08
sources:
  - "Original practice questions derived from General Physics II lectures 1–14 and the user-supplied 2023 midterm"
---

# Midterm · Transfer Practice

[Revision plan](revision-plan.md) · [2023 paper](paper-2023.md) · [Formula sheet](formula-sheet-2023.md)

These are original practice questions with expandable answers. Use the formula sheet and the [中文精要](essential-notes.md) alongside them.

## 从基础部分开始 {#study-order}

按学习安排读完对应主题后，再做下列片段。允许先展开答案跟算一次，再遮住重做；这些任务放在计划的两小时机动中。

| 顺序 | 先完成的部分 | 对应精要 |
| --- | --- | --- |
| 1 | [题 5](#check-5)：只判断电子刚释放时的受力方向 | [磁力](essential-notes.md#magnetism) |
| 2 | [题 7](#check-7)：先找穿过磁场的面积，再判断电动势正负 | [感应](essential-notes.md#induction) |
| 3 | [题 10](#check-10)：先求波长、磁场振幅和方向，再核对强度 | [电磁波](essential-notes.md#waves) |
| 4 | [题 4](#check-4)：先看 $t=0^+$ 与长期稳态，完整 $V_C(t)$ 留作下一步 | [RC](essential-notes.md#circuits) |
| 5 | [题 11](#check-11)：逐小问解释固定量和材料响应 | [材料](essential-notes.md#materials) |

有余量再做题 1、3、9；题 2、6、8、12 的完整计算留作进阶查阅。题号不是难度顺序，十二题不需要在第一轮全部完成。它们不是原卷附加题或今年的命题预测。

## 1. Zero divergence is not enough {#check-1}

In a charge-free region propose $\mathbf E=A(y\hat{\mathbf x}-x\hat{\mathbf y})$, $A\ne0$. Can stationary charges produce this as an electrostatic field? Does zero divergence imply zero electric field?

[Knowledge: curl and local Gauss law](../04-triangle-of-electrostatics.md)

??? success "Answer"

    $$
    \nabla\cdot\mathbf E=0,\qquad
    \nabla\times\mathbf E=-2A\hat{\mathbf z}\ne0.
    $$

    It satisfies the charge-free divergence condition but fails electrostatic circulation. It cannot be the electrostatic field of stationary charges. Nonzero fields can have zero divergence; a uniform field is an electrostatic example. 散度决定局部源，旋度决定局部环流，两者不能互相替代。

## 2. Grounded versus isolated at $d=2R$ {#check-2}

A charge $q>0$ is distance $2R$ from a conducting sphere's center. Compare an initially neutral **isolated** sphere with a **grounded** one. Find the images, sphere potential, and force on $q$ in both cases. Let $\hat{\mathbf n}$ point from center to $q$.

[Knowledge: spherical images](../05-conductors-and-image-charges.md#8-classroom-supplement-spherical-image-construction)

??? success "Answer"

    Both cases use $-q/2$ at $R/2$ toward the real charge. Grounding needs no other image:

    $$
    V_c=0,\qquad Q_s=-q/2,\qquad
    \mathbf F_{\rm grounded}=-\frac{2kq^2}{9R^2}\hat{\mathbf n}.
    $$

    Isolation requires zero net represented sphere charge, so add $+q/2$ at the center:

    $$
    V_c=\frac{kq}{2R},\qquad Q_s=0,\qquad
    \mathbf F_{\rm isolated}=\left(-\frac29+\frac18\right)\frac{kq^2}{R^2}\hat{\mathbf n}
    =-\frac{7kq^2}{72R^2}\hat{\mathbf n}.
    $$

    Both attract, but with different magnitudes. An isolated neutral conductor has zero total charge, not zero polarization or zero potential.

## 3. What changes the leakage time? {#check-3}

For the lossy spherical capacitor, keep the uniform $\epsilon,\sigma$ fixed and change $a,b$. Does the charge-decay time change? When has half the initial field energy been dissipated?

[Knowledge: lossy capacitor](solutions-2023.md#solution-2)

??? success "Answer"

    $$
    \tau=RC=\frac\epsilon\sigma
    $$

    is geometry-independent in this model, even though $R$ and $C$ separately change. Since $U(t)=U_0e^{-2t/\tau}$, half-energy dissipation occurs at

    $$
    \boxed{t=\frac\tau2\ln2.}
    $$

    Half-charge time is instead $\tau\ln2$. 先判断题目问的是电荷、能量还是功率，再使用指数。

## 4. A loaded RC circuit: initial and final states {#check-4}

A battery of emf $\mathcal E$ and series resistance $r$ feeds a parallel resistor $R$ and capacitor $C$. The initially uncharged capacitor is connected at $t=0$. Find its voltage $V_C(t)$ and the battery current immediately after connection and at long times.

[Knowledge: Kirchhoff and RC response](../07-dc-circuits-and-dielectrics.md#4-rc-charging-and-discharging)

??? success "Answer"

    The node rule is $(\mathcal E-V_C)/r=V_C/R+C\dot V_C$. Thus

    $$
    \boxed{V_C(t)=\frac{\mathcal E R}{r+R}(1-e^{-t/\tau}),\qquad
    \tau=C\frac{rR}{r+R}.}
    $$

    With $V_C(0^+)=0$, $I_{\rm battery}(0^+)=\mathcal E/r$. At long times, $I_C=0$, $V_C=\mathcal E R/(r+R)$, and $I_{\rm battery}(\infty)=\mathcal E/(r+R)$. 初始电容电压连续；最终电容支路断流，但电阻支路仍通电。

## 5. Crossed fields with an electron {#check-5}

Let $\mathbf E=E_0\hat{\mathbf y}$, $\mathbf B=B_0\hat{\mathbf z}$, $E_0,B_0>0$. An electron starts at rest. Find its initial acceleration, the mean drift over a cyclotron period, and the constant velocity that would produce no force from the outset.

[Knowledge: Lorentz force and crossed fields](../08-magnetic-force-and-motion.md#2-crossed-fields-and-thomsons-measurement)

??? success "Answer"

    Initially magnetic force is zero, so $\mathbf a(0)=-eE_0\hat{\mathbf y}/m_e$. The drift is

    $$
    \boxed{\mathbf v_D=\frac{\mathbf E\times\mathbf B}{B^2}=\frac{E_0}{B_0}\hat{\mathbf x}.}
    $$

    The same transverse velocity satisfies $\mathbf E+\mathbf v_D\times\mathbf B=0$ for either charge sign. Any added constant component along $\mathbf B$ also produces no force. 初始偏转与平均漂移是不同问题。

## 6. Replace the charged shell by a solid insulator {#check-6}

A uniformly **volume-charged insulating ball**, radius $R$ and total charge $Q$, rotates rigidly at $\boldsymbol\omega=\omega\hat{\mathbf z}$. Find its magnetic dipole moment and center field. Explain why the 2023 surface-shell coefficients cannot be retained.

[Knowledge: ring and shell superposition](solutions-2023.md#solution-3)

??? success "Answer"

    A spherical layer at radius $s$ has $dQ=3Qs^2ds/R^3$. Each layer uses the derived surface-shell results:

    $$
    d\mu=\frac{\omega s^2}{3}\,dQ,\qquad
    dB(O)=\frac{\mu_0\omega}{6\pi s}\,dQ.
    $$

    Therefore

    $$
    \boxed{\boldsymbol\mu=\frac{Q\omega R^2}{5}\hat{\mathbf z},\qquad
    \mathbf B(O)=\frac{\mu_0Q\omega}{4\pi R}\hat{\mathbf z}.}
    $$

    Charge now occupies all radii, requiring a volume integral. The surface-shell answers $Q\omega R^2/3$ and $\mu_0Q\omega/(6\pi R)$ describe a different distribution.

## 7. Induction where the magnetic field is zero {#check-7}

A long solenoid confines $\mathbf B(t)=(B_0t/t_0)\hat{\mathbf z}$ to radius $a$, during $0<t<t_0$. A fixed coaxial loop of radius $b>a$ lies outside it. Find the loop emf and the electric field at its wire. Is $B=0$ at the wire enough to rule out induction?

[Knowledge: induced electric field](../11-electromagnetic-induction.md#4-induced-electric-field-no-conductor-required)

??? success "Answer"

    Choose counterclockwise circulation seen from $+z$ as positive. The linked flux uses solenoid area $\pi a^2$, not loop area $\pi b^2$:

    $$
    \boxed{\mathcal E=-\frac{\pi a^2B_0}{t_0},\qquad
    \mathbf E(b)=-\frac{a^2B_0}{2bt_0}\hat{\boldsymbol\phi}.}
    $$

    The emf is clockwise even though the local magnetic field at the wire is zero. Faraday's law concerns changing flux through the loop, and the induced electric field extends outside the solenoid.

## 8. A source holding current fixed can absorb energy {#check-8}

Two linear coils have $L_1,L_2$ and positive mutual inductance $M$ for the chosen positive winding senses. Initially $i_1=I_1>0$, $i_2=0$. Hold $i_1$ fixed while a second source changes $i_2$ to $-I_2$, $I_2>0$. Find each source's work in this stage and the final magnetic energy.

[Knowledge: mutual-inductance work](../homework/06-inductance-and-ac-circuits.md#ch12-ex09)

??? success "Answer"

    $$
    W_1=\int I_1M\,di_2=-MI_1I_2,\qquad
    W_2=\int_0^{-I_2}L_2i_2\,di_2=\frac12L_2I_2^2.
    $$

    Adding the initial stored energy,

    $$
    \boxed{U_f=\frac12L_1I_1^2+\frac12L_2I_2^2-MI_1I_2.}
    $$

    Source 1 absorbs energy despite constant current. Physical inductances satisfy $M^2\leq L_1L_2$, so this quadratic energy cannot become negative. 互感项的符号由电流与绕向共同决定。

## 9. Double the resonant drive frequency {#check-9}

A series RLC circuit is driven by peak emf $\mathcal E_m\cos\omega t$, with $R>0$ and $\omega_0=1/\sqrt{LC}$. At $\omega=2\omega_0$, find the current amplitude, its phase relative to the source, and average resistor power. Contrast with resonance.

[Knowledge: impedance and phase](../13-lc-rlc-and-ac-circuits.md#4-series-rlc-impedance-and-phase)

??? success "Answer"

    $$
    X=\omega L-\frac1{\omega C}=\frac32\omega_0L>0,\qquad
    \boxed{I_m=\frac{\mathcal E_m}{\sqrt{R^2+(3\omega_0L/2)^2}}.}
    $$

    Current is $i=I_m\cos(2\omega_0t-\phi)$, with
    $\phi=\tan^{-1}[3\omega_0L/(2R)]>0$: it **lags** the source. Average power is $\langle P\rangle=I_m^2R/2$. At resonance $X=0$, $I_m=\mathcal E_m/R$, and the current is in phase. 峰值电流平方求平均功率时要除以 2。

## 10. A traveling electromagnetic wave {#check-10}

In vacuum,
$\mathbf E=60\cos(kx-\omega t)\hat{\mathbf y}\ \mathrm{V/m}$,
with frequency $f=50\ \mathrm{MHz}$. Find propagation direction, wavelength, $\mathbf B$, and mean intensity. Use $c=3.00\times10^8\ \mathrm{m/s}$ and $\epsilon_0=8.85\times10^{-12}\ \mathrm{F/m}$.

[Knowledge: plane waves](../14-maxwell-equations-and-waves.md#5-plane-waves-dispersion-and-transverse-structure)

??? success "Answer"

    Constant phase moves toward $+x$, so $\hat{\mathbf k}=\hat{\mathbf x}$. Then

    $$
    \lambda=\frac cf=6.00\ \mathrm m,\qquad
    \omega=2\pi f,\qquad k=\frac{2\pi}{\lambda},
    $$

    $$
    \boxed{\mathbf B=(2.00\times10^{-7}\ \mathrm T)\cos(kx-\omega t)\hat{\mathbf z},\qquad
    \langle S\rangle=\frac12\epsilon_0c(60)^2=4.78\ \mathrm{W/m^2}.}
    $$

    $\mathbf E\times\mathbf B$ points along $+x$, agreeing with propagation. The two fields are in phase; $60\ \mathrm{V/m}$ is peak amplitude, not RMS.

## 11. Dielectric and magnetic response {#check-11}

**(a)** Completely fill a vacuum parallel-plate capacitor with a linear dielectric of relative permittivity $\kappa$. Compare $C,V,E$ for fixed free plate charge and for fixed battery voltage.
**(b)** For a weak-field paramagnet obeying Curie's law, what happens to magnetization if absolute temperature doubles at fixed $B$?
**(c)** Can the same reversible linear law describe a ferromagnet's entire hysteresis loop?

[Knowledge: polarization](../07-dc-circuits-and-dielectrics.md#7-polarization-and-electric-displacement) · [Magnetic materials](../10-magnetic-dipoles-and-materials.md)

??? success "Answer"

    **(a)** $C=\kappa C_0$ in both cases. With fixed free $q$, $V=V_0/\kappa$ and $E=E_0/\kappa$. At fixed $V$, $E=E_0$ and the free charge rises to $\kappa q_0$. For the uniform linear medium $\mathbf P=\epsilon_0(\kappa-1)\mathbf E$; $\mathbf D$ counts free charge via its flux.

    **(b)** In the course's weak-field moment model, $M\simeq n\mu^2B/(k_BT)$, so doubling $T$ halves $M$. Independent permanent moments align more weakly relative to thermal agitation. Diamagnetism instead produces an induced moment opposing the applied field; it is not this Curie alignment model.

    **(c)** No. A hysteresis loop includes history dependence, remanence, and coercivity; one constant $\chi_m$ cannot describe the whole loop. Do not extend a weak-field linear formula beyond its material and field regime.

## 12. Displacement current during dielectric relaxation {#check-12}

An isolated parallel-plate capacitor contains a uniform weakly conducting dielectric of $\epsilon,\sigma$. Ignore edges and initial magnetic fields. As it discharges, the uniform gap field is $\mathbf E(t)=E_0e^{-\sigma t/\epsilon}\hat{\mathbf z}$. Find conduction and displacement current densities. Must the decreasing electric field generate a nonzero circulating magnetic field in this ideal gap model?

[Knowledge: Maxwell correction](../14-maxwell-equations-and-waves.md#1-why-magnetostatic-amperes-law-is-incomplete)

??? success "Answer"

    $$
    \boxed{\mathbf J_c=\sigma\mathbf E,\qquad
    \mathbf J_d=\epsilon\partial_t\mathbf E=-\sigma\mathbf E,\qquad
    \mathbf J_c+\mathbf J_d=0.}
    $$

    The total source in Ampère–Maxwell cancels. With the stated symmetry, no imposed magnetic field, and negligible edges, $\mathbf B=0$ is consistent; the displacement term alone cannot determine $\mathbf B$. Local energy conservation is also satisfied:

    $$
    \partial_t\left(\frac12\epsilon E^2\right)=-\sigma E^2=-\mathbf J_c\cdot\mathbf E.
    $$

    Stored electric energy becomes heat locally. 不能只看到电场随时间变，就漏掉同时存在的传导电流。
