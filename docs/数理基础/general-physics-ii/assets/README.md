---
title: "General Physics II · Figure Sources and Reproduction"
status: draft
tags: [math-physics, physics, figures]
created: 2026-10-06
updated: 2026-11-08
sources:
  - "Repository script scripts/generate_gp2_figures.py"
  - "Repository script scripts/generate_gp2_later_figures.py"
  - "General Physics II lectures 1–15; provenance in ../source-map.md"
---

# General Physics II · Figure Sources and Reproduction

[Course index](../index.md) · [Source map](../source-map.md)

All **23 WebP figures are original diagrams or computed plots**: eleven for classes 1–6 and twelve added for classes 7–15. Mathematical sources are the corresponding chapter equations and course materials listed in the [source map](../source-map.md); no third-party bitmap or slide artwork is embedded.

The original figures and their authoring script are made available under **CC BY 4.0**; attribute them to *Tsukimakura's notebook — General Physics II figures*. This permission applies to these new figures and the authoring script, not to the local course PDFs, screenshots, or demonstration archive. See the [CC BY 4.0 license](https://creativecommons.org/licenses/by/4.0/).

## Figure inventory

| File | Content / mathematical basis |
| --- | --- |
| `charge-field-lines.webp` | Numerical superposition of two equal positive charges and of a dipole. |
| `dipole-torque-energy.webp` | Dipole forces in a uniform field and $U=-pE\cos\theta$. |
| `ring-disk-axis.webp` | Ring symmetry/projection and dimensionless ring/disk field shapes. |
| `gaussian-surfaces.webp` | Spherical, planar, and cylindrical Gaussian surfaces and flux factors. |
| `sphere-field-potential.webp` | Exact radial field/potential curves for a uniform insulating ball and an isolated spherical conductor. |
| `electrostatics-triangle.webp` | Relations between $\rho_q$, $\mathbf E$, and $V$. |
| `grounded-plane-image.webp` | Auxiliary image construction, physical upper-region field lines, and equipotential contours. |
| `sphere-uniform-field.webp` | Exterior field of a neutral conducting sphere in a uniform field and its cosine surface density. |
| `spherical-image-geometry.webp` | Physical/image locations for exterior-sphere and cavity problems. |
| `current-drift.webp` | Qualitative random-plus-drift motion and current-section geometry. |
| `capacitor-geometries.webp` | Parallel-plate and coaxial-cylinder geometries. |
| `rc-transients-energy.webp` | Class 7: RC charge/current response and energy-decay rate. |
| `dielectric-polarization.webp` | Class 7 / class 8 opening: free/bound surface charges and connection constraints. |
| `magnetic-motion-hall.webp` | Class 8: helix and explicitly signed positive-carrier Hall balance. |
| `current-magnetic-fields.webp` | Class 9: current circulation and the uniformly current-carrying solid wire. |
| `coil-solenoid-axis.webp` | Class 10: exact circular-loop and finite-solenoid axial fields. |
| `magnetic-response.webp` | Class 10: normalized two-state magnetization and schematic hysteresis. |
| `faraday-induction.webp` | Class 11: extracted-loop drag and induced-field circulation. |
| `rl-mutual-inductance.webp` | Class 12: RL transient and shared flux between circuits. |
| `rlc-damping.webp` | Class 13: exact free responses for common initial charge and zero current. |
| `rlc-resonance.webp` | Class 13 / class 14 opening: exact series-circuit current response at three resistances. |
| `plane-wave-energy.webp` | Class 14: field phase and equal instantaneous energy densities. |
| `reflection-refraction.webp` | Class 15: Snell geometry and total internal reflection. |

## Reproduction

Editable sources are `scripts/generate_gp2_figures.py` (classes 1–6) and `scripts/generate_gp2_later_figures.py` (classes 7–15). Plotting libraries are optional authoring dependencies; the site builds from the committed WebP files.

With Python, NumPy, Matplotlib, and Pillow available, run from the repository root:

```bash
MPLCONFIGDIR=/tmp/gp2-matplotlib python3 scripts/generate_gp2_figures.py
MPLCONFIGDIR=/tmp/gp2-matplotlib python3 scripts/generate_gp2_later_figures.py
```

The script uses a fixed random seed for the drift sketch and exports images at 160 dpi before WebP conversion. All figure labels are English so the mathematical labels remain portable across systems without Chinese fonts.

## Interpretation limits

- Numerical streamlines are visualization samples. Their algorithmic density does not represent an exact number of field lines per area and should not be used to infer a field-strength ratio.
- Charge singularities are masked in field plots.
- Field-line figures show planar slices of three-dimensional point-charge fields.
- The lower half of the plane-image figure is an auxiliary construction, not the physical field inside the conductor.
- The conductor's interior is excluded from the uniform-field sphere's exterior streamlines.
- The ring and disk curves have explicitly different normalizations; compare their shapes rather than their absolute values.
- The random-plus-drift figure is schematic, not a simulated scattering trajectory or a fitted material measurement.
- The hysteresis curves illustrate remanence/coercivity; they are not measured data or a fitted magnetic material model.
- The Hall sketch uses positive carriers, $J_x>0$, and $B_z>0$; changing carrier sign reverses its transverse charge pattern.
- Induction arrows use the field/motion directions explicitly drawn; colors are visual aids, not universal sign conventions.
- The optical sketch draws no propagating transmitted ray during total reflection, but does not imply that the evanescent field vanishes.
