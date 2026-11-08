---
title: "General Physics II · Formula Sheet and Conceptual Checks"
status: draft
tags: [math-physics, physics, electrostatics, quick-reference]
created: 2026-10-06
updated: 2026-11-08
sources:
  - "General Physics II, supplied lectures 1–15 and classroom transcripts; see source-map.md"
---

# General Physics II · Formula Sheet and Conceptual Checks

[Course index](index.md) · [Mathematical toolkit](mathematical-toolkit.md)

Use this sheet after reading the derivations. Unless otherwise specified, formulas assume vacuum and the geometric idealizations stated in the corresponding chapters.

## 1. Charge, fields, and potentials

| Relation | Formula | Condition / interpretation |
| --- | --- | --- |
| Point-charge field | $\mathbf E=kq\mathbf R/R^3$ | $\mathbf R$ points from source to observation; $R>0$. |
| Force on charge | $\mathbf F=q\mathbf E_{\mathrm{ext}}$ | Exclude its own field. |
| Continuous-source field | $\mathbf E=k\int\mathbf R\,dq/R^3$ | Sum vectors and use source/observation coordinates consistently. |
| Flux | $\Phi_E=\int_S\mathbf E\cdot\hat{\mathbf n}\,dA$ | Closed surfaces use outward normals. |
| Gauss's law | $\oint_S\mathbf E\cdot d\mathbf A=Q_{\mathrm{enc}}/\epsilon_0$ | All charges contribute to the field; only enclosed charge determines net flux. |
| Potential difference | $V_f-V_i=-\int_i^f\mathbf E\cdot d\boldsymbol\ell$ | Electrostatic field, with a consistent reference. |
| Localized-source potential | $V=k\int dq/R$ | Zero at infinity when the integral converges. |
| Potential energy change | $\Delta U=q\Delta V$ | Signed test charge, fixed external sources. |
| Field from potential | $\mathbf E=-\nabla V$ | Differentiate in observation coordinates. |
| Pair assembly energy | $U=\sum_{i<j}kq_iq_j/r_{ij}$ | Each pair once; exclude point-charge self-energy. |

## 2. Standard geometries

| Source | Field or potential | Scope |
| --- | --- | --- |
| Uniform ring, radius $R$ | $E_z=kQz/(R^2+z^2)^{3/2}$; $V=kQ/\sqrt{R^2+z^2}$ | On axis; finite ring, zero potential at infinity. |
| Uniform disk, radius $R$ | $E_z=\sigma_s[1-z/\sqrt{z^2+R^2}]/(2\epsilon_0)$ | On positive axis $z>0$. |
| Same disk potential | $V=\sigma_s(\sqrt{z^2+R^2}-|z|)/(2\epsilon_0)$ | On axis; both sides. |
| Infinite sheet | $E=|\sigma_s|/(2\epsilon_0)$ | One prescribed sheet; field away from positive sheet. |
| Two opposite infinite sheets | $E=|\sigma_s|/\epsilon_0$ between; zero outside | Equal and opposite sheet densities. |
| Infinite line | $\mathbf E=\lambda\hat{\mathbf r}/(2\pi\epsilon_0r)$ | Cylindrical radial distance $r>0$. |
| Infinite-line potential difference | $V(r)-V(r_0)=-\lambda\ln(r/r_0)/(2\pi\epsilon_0)$ | Finite reference radius; do not set zero at infinity. |
| Uniform insulating ball, inside | $E_r=kQr/R^3$; $V=kQ(3-r^2/R^2)/(2R)$ | $r<R$; total $Q$ uniformly in volume. |
| Spherical conductor, inside | $E=0$; $V=kQ/R$ | Equilibrium; isolated sphere without other sources. |
| Either spherical source, outside | $E_r=kQ/r^2$; $V=kQ/r$ | Full spherical symmetry, zero potential at infinity. |

## 3. Dipoles and local field equations

$$
\mathbf p=q\mathbf d,\qquad
V_{\mathrm{dip}}\simeq\frac{k\mathbf p\cdot\hat{\mathbf r}}{r^2},\qquad
\mathbf E_{\mathrm{dip}}\simeq\frac{k}{r^3}[3(\mathbf p\cdot\hat{\mathbf r})\hat{\mathbf r}-\mathbf p].
$$

The finite-dipole approximation requires $r\gg d$. In a uniform external field,

$$
\mathbf F_{\mathrm{net}}=0,\qquad \boldsymbol\tau=\mathbf p\times\mathbf E,\qquad
U=-\mathbf p\cdot\mathbf E.
$$

Electrostatics in vacuum obeys

$$
\nabla\times\mathbf E=0,\qquad
\nabla\cdot\mathbf E=\frac{\rho_q}{\epsilon_0},\qquad
\nabla^2V=-\frac{\rho_q}{\epsilon_0}.
$$

## 4. Conductors and image methods

| Result | Formula / condition |
| --- | --- |
| Equilibrium in metal | $\mathbf E=0$, no excess bulk volume charge, $V=V_c$. |
| Surface boundary | $\mathbf E_{\mathrm{vac}}=(\sigma_s/\epsilon_0)\hat{\mathbf n}$, with normal out of metal. |
| Charged cavity | $Q_{\mathrm{inner}}=-q$; isolated conductor has $Q_{\mathrm{outer}}=Q_c+q$. |
| Grounded plane image | Real $q$ at $z=d$; image $-q$ at $z=-d$; physical region $z>0$. |
| Plane density | $\sigma_s(s)=-qd/[2\pi(s^2+d^2)^{3/2}]$. |
| Plane attraction | $\mathbf F=-kq^2\hat{\mathbf z}/(4d^2)$. |
| Plane assembly energy | $U=-kq^2/(4d)$; do not count image as an independent real particle. |
| Uniform-field sphere | $\mathbf p_{\mathrm{ind}}=4\pi\epsilon_0R^3\mathbf E_0$; $\sigma_s=3\epsilon_0E_0\cos\theta$. |
| Spherical image location | $b=R^2/a$, $q'=-qR/a$; image must lie outside physical region. |

**For the spherical image, distinguish cases:** outside a grounded sphere ($a>R$), total induced charge equals $q'$. Inside a spherical cavity ($a<R$), inner-wall charge equals $-q$, not $q'$. See the full [spherical construction](05-conductors-and-image-charges.md).

## 5. Transport and capacitance

| Relation | Formula | Condition |
| --- | --- | --- |
| Current | $i=\int_S\mathbf J\cdot d\mathbf A$ | Oriented section. |
| Carrier current density | $\mathbf J=nq_c\mathbf v_d$ | Sum over species if needed. |
| Electron drift | $\mathbf v_d=-e\tau\mathbf E/m_e$ | Steady Drude model. |
| Conductivity | $\sigma_{\mathrm{cond}}=ne^2\tau/m_e$ | One-carrier free-electron model. |
| Resistivity | $\rho_{\mathrm{res}}=1/\sigma_{\mathrm{cond}}$ | Isotropic linear response. |
| Wire resistance | $R=\rho_{\mathrm{res}}L/A$ | Uniform one-dimensional axial flow. |
| Mean free path | $\ell\sim v_{\mathrm{micro}}\tau$ | Microscopic speed, not drift speed. |
| Charge conservation | $\partial_t\rho_q+\nabla\cdot\mathbf J=0$ | Fixed-volume local continuity. |
| Capacitance | $C=q/(V_+-V_-)$ | $q$ is positive plate-charge magnitude. |
| Parallel plates | $C=\epsilon_0A/d$ | Neglect fringes; vacuum gap. |
| Coaxial cylinders | $C=2\pi\epsilon_0L/\ln(b/a)$ | $b>a$; long cylinders, vacuum gap. |
| Parallel capacitors | $C_{\mathrm{eq}}=\sum_iC_i$ | Same voltage. |
| Series capacitors | $1/C_{\mathrm{eq}}=\sum_i1/C_i$ | Neutral floating intermediate nodes, ideal lumped elements. |

## 6. Conceptual checks（自测）

1. **Can $V=0$ where $\mathbf E\ne0$?** Yes: the perpendicular bisector plane of a dipole is an example.
2. **Can $\mathbf E=0$ where $V\ne0$?** Yes: the interior of a charged conducting sphere with zero at infinity.
3. **Does zero enclosed charge imply zero field?** No; it only implies zero net closed-surface flux.
4. **Can an equilibrium conductor's charged cavity have a field?** Yes. Zero field applies to the metal material; an empty closed cavity is a separate uniqueness result.
5. **Does grounding make a conductor neutral?** No. It fixes potential while permitting charge exchange.
6. **Is zero dipole torque necessarily stable?** No. Anti-alignment also has zero torque but is unstable.
7. **Is the field radial everywhere outside a sphere in a uniform external field?** No. It is normal at the surface, with a generally nonzero exterior angular component.
8. **Does a current-carrying resistive wire have zero internal field?** No. Its steady current needs an internal field.
9. **Are slow electron drift and fast circuit response contradictory?** No; drift, microscopic motion, and signal propagation are different quantities.
10. **Does impurity scattering always exchange energy?** No. Static impurity scattering can be elastic and still relax momentum.
11. **Does geometry change leave a capacitor's charge fixed?** Only if the electrical connection imposes that condition; a voltage source instead fixes voltage.
12. **Can every conductor problem use one image charge?** No. The construction must satisfy all source, boundary, and total-charge conditions.

## 7. Circuit transients and material response

| Relation | Formula | Condition |
| --- | --- | --- |
| Source emf | $\mathcal E=dW_{\mathrm{source}}/dq$ | Energy per charge, not force. |
| Resistor power | $P_R=i^2R=v^2/R$ | Passive resistor. |
| Capacitor energy | $U_C=q^2/(2C)=Cv^2/2$ | Constant linear capacitance. |
| RC charging | $q=C\mathcal E(1-e^{-t/(RC)})$ | Initially uncharged, constant ideal source. |
| RC discharge | $q=q_0e^{-t/(RC)}$ | Closed resistive source-free path. |
| Polarization sources | $\rho_b=-\nabla\cdot\mathbf P$, $\sigma_b=\mathbf P\cdot\hat{\mathbf n}$ | Normal out of dielectric. |
| Displacement | $\mathbf D=\epsilon_0\mathbf E+\mathbf P$; $\nabla\cdot\mathbf D=\rho_f$ | $\mathbf D=\epsilon\mathbf E$ additionally assumes linear isotropic response. |
| Dipole response | $M=n\mu\tanh[\mu B/(k_BT)]$ | Independent two-state moments. |
| Curie limit | $M\propto B/T$ | Weak field relative to thermal energy; coefficient depends on moment model. |

## 8. Magnetic force and source fields

| Relation | Formula | Scope |
| --- | --- | --- |
| Lorentz force | $\mathbf F=q(\mathbf E+\mathbf v\times\mathbf B)$ | One common reference frame. |
| Gyromotion | $r_L=mv_\perp/(|q|B)$; $\omega_c=|q|B/m$ | Nonrelativistic, uniform $\mathbf B$. |
| Hall coefficient | $R_H=E_y/(J_xB_z)=1/(nq_c)$ | One-carrier model and stated axes. |
| Wire force | $d\mathbf F=i\,d\boldsymbol\ell\times\mathbf B$ | Conventional-current element. |
| Loop moment | $\boldsymbol\mu=NiA\hat{\mathbf n}$ | Planar winding. |
| Torque and energy | $\boldsymbol\tau=\boldsymbol\mu\times\mathbf B$; $U=-\boldsymbol\mu\cdot\mathbf B$ | Fixed moment in external field. |
| Biot–Savart | $d\mathbf B=\mu_0i\,d\boldsymbol\ell'\times\hat{\mathbf R}/(4\pi R^2)$ | Steady source; source-to-observation separation. |
| Infinite wire | $B=\mu_0i/(2\pi r)$ | Outside wire; inside uniform solid wire $B=\mu_0ir/(2\pi R^2)$. |
| Circular coil axis | $B_z=\mu_0NiR^2/[2(R^2+z^2)^{3/2}]$ | Coil radius $R$. |
| Current sheet | $B=\mu_0|K|/2$ on each side | Opposite directions on the two sides. |
| Long solenoid | $B\simeq\mu_0ni$ | Interior, far from ends. |
| Ideal toroid | $B=\mu_0Ni/(2\pi r)$ | Inside windings; ideal leakage-free geometry. |

## 9. Induction and inductance

$$
\mathcal E=\oint_{C(t)}(\mathbf E+\mathbf u\times\mathbf B)\cdot d\boldsymbol\ell
=-\frac{d\Phi_B}{dt},\qquad
\Lambda=Li,\quad\mathcal E_L=-L\dot i,\quad v_L=L\dot i.
$$

| Relation | Formula | Condition |
| --- | --- | --- |
| Solenoid inductance | $L=\mu_0N^2A/\ell$ | Long air-core coil. |
| RL switch-on | $i=(\mathcal E/R)(1-e^{-tR/L})$ | Initial zero current. |
| Magnetic energy | $U_B=Li^2/2$ | Constant linear $L$. |
| Vacuum field energy | $u=\epsilon_0E^2/2+B^2/(2\mu_0)$ | Matter needs its material-response energy treatment. |
| Mutual emf | $\mathcal E_2=-M\dot i_1$ | Fixed reciprocal geometry, with winding signs specified. |

## 10. Oscillations and AC

$$
\omega_0=\frac1{\sqrt{LC}},\quad
\beta=\frac R{2L},\quad
\omega_d=\sqrt{\omega_0^2-\beta^2}\quad(\beta<\omega_0).
$$

For $e^{j\Omega t}$ phasors,

$$
\widetilde Z_R=R,\qquad
\widetilde Z_L=j\Omega L,\qquad
\widetilde Z_C=\frac1{j\Omega C},\qquad
\widetilde Z_{\mathrm{RLC}}=R+j\left(\Omega L-\frac1{\Omega C}\right).
$$

With $\phi=\arg\widetilde Z$ and voltage proportional to $\cos\Omega t$, current is $I_m\cos(\Omega t-\phi)$. Current resonance is at $\Omega=\omega_0$, with $I_{m,\max}=\mathcal E_m/R$ for $R>0$. Half-power width is $\Delta\Omega=R/L$, and $\mathcal Q=\omega_0L/R$. Average resistive power is $I_m^2R/2$.

## 11. Maxwell equations, waves, and light

$$
\begin{aligned}
\nabla\cdot\mathbf E&=\rho_q/\epsilon_0,&\nabla\cdot\mathbf B&=0,\\
\nabla\times\mathbf E&=-\partial_t\mathbf B,&
\nabla\times\mathbf B&=\mu_0\mathbf J+\mu_0\epsilon_0\partial_t\mathbf E.
\end{aligned}
$$

| Relation | Formula | Condition |
| --- | --- | --- |
| Vacuum wave speed | $c=1/\sqrt{\mu_0\epsilon_0}$ | Source-free wave propagation. |
| Traveling plane wave | $\mathbf B=\hat{\mathbf k}\times\mathbf E/c$ | Transverse, in-phase fields; $E=cB$. |
| Poynting vector | $\mathbf S=\mathbf E\times\mathbf B/\mu_0$ | Vacuum energy flux. |
| Sinusoidal intensity | $I=\epsilon_0cE_m^2/2$ | Peak field amplitude $E_m$. |
| Isotropic spreading | $I=P/(4\pi r^2)$ | Lossless isotropic far field. |
| Radiation pressure | $I/c$ absorbed; $2I/c$ reflected | Normal incidence, ideal surfaces in vacuum. |
| Refractive index | $n=c/v_{\mathrm{ph}}=\sqrt{\epsilon_r\mu_r}$ | Appropriate frequency, homogeneous isotropic transparent medium. |
| Wavelength in medium | $\lambda=\lambda_0/n$ | Frequency fixed at stationary boundary. |
| Direction laws | $\theta_r=\theta_i$; $n_1\sin\theta_i=n_2\sin\theta_t$ | Angles to the normal. |
| Critical angle | $\sin\theta_c=n_2/n_1$ | $n_1>n_2$; total reflection for larger angles. |
| Boundary phase matching | $\omega_i=\omega_r=\omega_t$, $\mathbf k_{i,\parallel}=\mathbf k_{r,\parallel}=\mathbf k_{t,\parallel}$ | Stationary planar interface. |

## 12. Further conceptual checks

1. **Does induced current always oppose the external field?** It opposes the flux change, so it can reinforce a decreasing external field.
2. **Does every induced emf require changing $B$ at a fixed point?** No; motion can change enclosed flux.
3. **Can a scalar potential alone describe induced $\mathbf E$?** Generally no; nonzero circulation requires a nonconservative contribution.
4. **Do all sinusoidal circuit frequencies equal $1/\sqrt{LC}$?** No; free damped and driven responses have different relevant frequencies.
5. **Do half-amplitude points define a half-power width?** No; power is proportional to amplitude squared.
6. **Does a traveling plane wave exchange $u_E$ and $u_B$ alternately like an LC circuit?** No; they are equal and in phase in that wave.
7. **Does total internal reflection require zero field outside?** No; an evanescent field can remain.
8. **Is every Fermat path a global time minimum?** The general statement is stationarity.

## 13. Calculation checklist

Specify region, source, boundary/initial data, signs and approximations. Distinguish total/free/bound charge, fixed/moving contours, and fixed charge/voltage. Check dimensions, limits, interfaces and conservation before interpreting a result.

## References

The six main chapters contain derivations and source attributions. [Source map](source-map.md) gives the original files and progress boundaries; [figure notes](assets/README.md) explains visualization conventions.
