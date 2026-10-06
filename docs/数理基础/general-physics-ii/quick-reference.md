---
title: "General Physics II · Formula Sheet and Conceptual Checks"
status: draft
tags: [math-physics, physics, electrostatics, quick-reference]
created: 2026-10-06
updated: 2026-10-06
sources:
  - "General Physics II, supplied lectures 1–6 and their classroom transcripts; see source-map.md"
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

## 7. Final calculation checklist

Specify the region and references; draw signed sources and normals; use symmetry; keep dimensions consistent; verify source singularities; check total charge and boundary conditions; test limiting cases. For piecewise potentials, match the same additive reference across regions.

## References

The six main chapters contain derivations and source attributions. [Source map](source-map.md) gives the original files and progress boundaries; [figure notes](assets/README.md) explains visualization conventions.
