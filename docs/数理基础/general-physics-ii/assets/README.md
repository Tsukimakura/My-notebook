---
title: "General Physics II · Figure Sources and Reproduction"
status: draft
tags: [math-physics, physics, figures]
created: 2026-10-06
updated: 2026-10-06
sources:
  - "Repository script scripts/generate_gp2_figures.py"
  - "General Physics II lectures 1–6, mathematical concepts listed in ../source-map.md"
---

# General Physics II · Figure Sources and Reproduction

[Course index](../index.md) · [Source map](../source-map.md)

All eleven WebP files in this directory are **original explanatory diagrams or computed plots**, created for these notes. No textbook artwork, lecture-slide bitmap, classroom screenshot, or third-party image is embedded. The diagrams express the physics developed in the supplied lessons; numerical plots are generated directly from the equations.

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

## Reproduction

The editable originals are the equation-based plotting instructions in `scripts/generate_gp2_figures.py`, relative to the repository root. The site itself only needs the committed WebP files; plotting libraries are optional authoring dependencies and are not added to the normal MkDocs environment.

With Python, NumPy, Matplotlib, and Pillow available, run from the repository root:

```bash
MPLCONFIGDIR=/tmp/gp2-matplotlib python3 scripts/generate_gp2_figures.py
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
