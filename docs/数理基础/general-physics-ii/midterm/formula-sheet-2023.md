---
title: "2023 Midterm · Annotated Formula Sheet"
status: draft
tags: [math-physics, physics, midterm, formulas]
created: 2026-11-08
updated: 2026-11-10
sources:
  - "2023 midterm formula-sheet image supplied by the user, printed p. 2"
---

# 2023 Midterm · Annotated Formula Sheet

[中文公式速解与补充](formula-guide.md) · [Midterm index](index.md) · [Question paper](paper-2023.md) · [Full course formula reference](../quick-reference.md) · [Physical definitions and units](essential-notes.md)

The tables reproduce all 31 relations on the supplied sheet, grouped by topic. Conditions and symbol explanations are added. This is the **2023** sheet; the instructor has said formulas will also be provided for the current exam, but has not supplied its final sheet here.

## 1. Electrostatics and dipoles

| Supplied relation | How to use it |
| --- | --- |
| $\mathbf E=\dfrac{q}{4\pi\epsilon_0r^2}\hat{\mathbf r}$ | A stationary point charge in vacuum; for an extended source integrate vector contributions. |
| $\epsilon_0\oint_S\mathbf E\cdot d\mathbf A=q_{\rm enc}$ | Closed surface, outward normal. Extracting $E$ requires sufficient symmetry. |
| $V_f-V_i=-\int_i^f\mathbf E\cdot d\mathbf s$ | Electrostatic field; fix the integration direction and potential reference. |
| $\mathbf E=-\nabla V$ | Spatial derivative of a scalar electrostatic potential. |
| $\mathbf p=q\mathbf d$ | $\mathbf d$ points from negative to positive charge. |
| $\boldsymbol\tau_E=\mathbf p\times\mathbf E$ | External field; in a uniform field a dipole has torque but zero net force. |
| $\nabla\cdot\mathbf E=\rho_q/\epsilon_0$ | Here $\rho_q$ is **charge density**, not resistivity. In a dielectric this counts total free plus bound charge. |

For the spherical dielectric in Q2, use $\mathbf D=\epsilon\mathbf E$ and $\oint\mathbf D\cdot d\mathbf A=Q_{\rm free}$, with $\epsilon=\epsilon_0\epsilon_r$. Do not insert only free charge into the vacuum $\epsilon_0$ formula and ignore polarization.

## 2. Transport, emf, and Hall effect

| Supplied relation | How to use it |
| --- | --- |
| $\rho_{\rm res}=\dfrac1\sigma=\dfrac{m}{ne^2\tau}$ | Resistivity and the one-electron-carrier Drude model; $\tau$ is mean free time. |
| $\mathbf E=\rho_{\rm res}\mathbf J$ | Isotropic local Ohm's law for a stationary conductor. |
| $\mathcal E=dW/dq$ | Source work per unit charge; emf has units V and need not be a scalar-potential difference around a loop. |
| $P=i^2R$ | Joule heating of a resistor; check which branch current is $i$. |
| $R_H=\dfrac{E_H}{BJ}=\dfrac1{nq_c}$ | Single-carrier Hall coefficient with consistent signed transverse directions; $E_H$ is the Hall field and $q_c$ the carrier charge. |

The original uses $\rho$ for both resistivity and charge density on different lines. It also uses $\tau$ for collision time, while torque is a vector; identify the quantity from its equation and units.

## 3. Magnetic forces and fields

| Supplied relation | How to use it |
| --- | --- |
| $\mathbf F=q\mathbf E+q\mathbf v\times\mathbf B$ | Total force on a moving charge; magnetic force alone does no work. |
| $\mathbf F_B=i\mathbf L\times\mathbf B$ | Straight segment in uniform $\mathbf B$; otherwise use $\int i\,d\boldsymbol\ell\times\mathbf B$. |
| $\boldsymbol\mu=Ni\mathbf A$ | Oriented area vector, chosen by the right-hand rule for the positive current. |
| $\boldsymbol\tau_B=\boldsymbol\mu\times\mathbf B$ | Torque on a small loop in an external uniform field. |
| $d\mathbf B=\dfrac{\mu_0}{4\pi}\dfrac{i\,d\mathbf s\times\hat{\mathbf r}}{r^2}$ | Biot–Savart law; displacement points from source element to observation. |
| $\oint\mathbf B\cdot d\mathbf s=\mu_0i_{\rm enc}$ | Magnetostatic Ampère law; changing electric flux requires the Maxwell term below. |
| $\oint_S\mathbf B\cdot d\mathbf A=0$ | No net magnetic flux through a closed surface. |
| $\nabla\cdot\mathbf B=0$ | Local version; does not imply $\mathbf B=0$. |

## 4. Induction, energy, and oscillations

| Supplied relation | How to use it |
| --- | --- |
| $\oint\mathbf E\cdot d\mathbf s=-\dfrac d{dt}\int\mathbf B\cdot d\mathbf A$ | Fixed contour and surface, with right-hand orientation. For moving material include motional emf. |
| $U_C=q^2/(2C)$ | Linear capacitor; also $U_C=CV^2/2$. |
| $u_E=\epsilon_0E^2/2$ | Vacuum electric energy density. A uniform linear nondispersive dielectric uses $\epsilon E^2/2$. |
| $L=N\Phi_B/i$ | Self-flux **linkage** divided by current; $\Phi_B$ is the flux per turn for equivalent turns. |
| $U_L=Li^2/2$ | Linear inductor; $L$ fixed. |
| $u_B=\mu_0B^2/2$ **as printed; incorrect** | Use $\boxed{u_B=B^2/(2\mu_0)}$ in vacuum or a nonmagnetic medium. |
| $M=N_2\Phi_{21}/i_1$ | Flux linkage of coil 2 caused by coil 1; sign depends on chosen winding senses. |
| $\omega_0=1/\sqrt{LC}$ | Natural angular frequency of an ideal LC circuit. Damping and driven resonance require their stated conditions. |
| $\omega=2\pi/T$ | $\omega$ is angular frequency in rad/s; $f=1/T$ in Hz. |

**Magnetic-energy correction.** Dividing $B^2$ by $\mu_0$ gives J/m³; multiplying by $\mu_0$ does not. The correct expression also follows from the course's solenoid-energy derivation. This typo is in the supplied image, not a different convention.

For the moving disk, the useful general emf is
$\mathcal E=\oint(\mathbf E+\mathbf u\times\mathbf B)\cdot d\boldsymbol\ell$.
Its entire disk flux is constant while its center–rim motional emf is nonzero; choose the actual circuit path.

## 5. Time-dependent Maxwell equations

| Supplied relation | How to use it |
| --- | --- |
| $\nabla\times\mathbf E=-\partial\mathbf B/\partial t$ | An induced field generally cannot be described by $-\nabla V$ alone. |
| $\nabla\times\mathbf B=\mu_0\mathbf J+\mu_0\epsilon_0\partial\mathbf E/\partial t$ | Vacuum Ampère–Maxwell law with **total** current density. In a simple dielectric the free-current form uses $\epsilon\partial\mathbf E/\partial t$. |

The 2023 page does not list every Chapter 14 wave relation. Be able to obtain or use

$$
c=\frac1{\sqrt{\mu_0\epsilon_0}},\qquad
\mathbf B=\frac1c\hat{\mathbf k}\times\mathbf E,\qquad
\mathbf S=\frac{\mathbf E\times\mathbf B}{\mu_0},\qquad
\langle S\rangle=\frac12\epsilon_0cE_m^2
$$

for a single traveling vacuum plane wave. These are **course supplements**, not additional relations transcribed from the old sheet. The full derivation is in [Chapter 14](../14-maxwell-equations-and-waves.md).

## Constants printed on the sheet

| Constant | Printed value |
| --- | --- |
| Elementary-charge magnitude $e$ | $1.6\times10^{-19}\ \mathrm C$; an electron has charge $-e$ |
| Electron mass $m_e$ | $0.91\times10^{-30}\ \mathrm{kg}$ |
| Boltzmann constant $k_B$ | $1.38\times10^{-23}\ \mathrm{J/K}$ |
| Vacuum permittivity $\epsilon_0$ | $8.85\times10^{-12}\ \mathrm{C^2/(N\,m^2)}$ |
| Vacuum permeability $\mu_0$ | $4\pi\times10^{-7}\ \mathrm{T\,m/A}$ |

符号识别比抄公式更重要：$R$ 可能是球半径或电阻，$\sigma$ 可能是电导率、面电荷密度，或 Q3 中的 $dq/d\theta$。先定义再代入。
