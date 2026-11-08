---
title: "2023 Midterm · Sources and Figures"
status: draft
tags: [math-physics, physics, midterm, sources, figures]
created: 2026-11-08
updated: 2026-11-08
sources:
  - "2023 midterm images supplied by the user: printed pp. 2, 3, 5, 7, 9"
  - "Instructor's current midterm requirements supplied by the user"
---

# 2023 Midterm · Sources and Figures

[Midterm index](../index.md) · [Question paper](../paper-2023.md)

## Source record

Five images were supplied: the formula page numbered 2 and question pages numbered 3, 5, 7, and 9. The year 2023 comes from the user's description. The supplied pages do not establish an exam duration, institution, or an official marking scheme; none is inferred here. Question wording is transcribed into English Markdown, with mathematical notation normalized.

The current instructor announcement sets the scope as electrostatics through Chapter 14, with formulas provided and emphasis on understanding. It gives no topic weights. The 2023 questions are examples of style; they are not a complete forecast of current coverage.

## Source issues and solution assumptions

| Source | Issue | Treatment |
| --- | --- | --- |
| Formula sheet, p. 2 | Prints $u_B=\mu_0B^2/2$ | Preserve the printed form in the annotated table, then correct it to $B^2/(2\mu_0)$ |
| Q1(d), p. 3 | Calls grounded-sphere charge uniform despite an external point charge | Preserve the wording in the paper; solve the zero-potential image problem and show the nonuniform density |
| Q2, p. 5 | Gives initial charge but no voltage-source circuit | State the free-discharge interpretation, with homogeneous $\epsilon=\epsilon_0\epsilon_r$ and $\sigma$ |
| Q3(a), p. 7 | Uses $\sigma(\theta)=dq/d\theta$ and $J(\theta)=\sigma(\theta)/T$ | Keep these definitions; distinguish charge/current per polar angle from conventional surface/volume densities |
| Q4(c), p. 9 | No mass or moment of inertia supplied | Give the result in terms of $\mathcal I$; mass/density formulas are conditional extensions |
| Q4(b,c), p. 9 | No friction or circuit inductance specified | Use the course's frictionless resistive model; state how non-negligible inductance changes the equations |

## Figure inventory

| WebP file | Source | Construction |
| --- | --- | --- |
| `sphere-images.webp` | Fig. 1, p. 3 | Four panels retaining $R,d,a,\theta,Q,Q_2,q,-q'$ and grounded/isolated connections |
| `lossy-capacitor.webp` | Fig. 2, p. 5 | Concentric electrode cross-section, $a,b,\epsilon_r,\sigma,\pm Q_0$ |
| `rotating-sphere.webp` | Fig. 3, p. 7 | Latitude-ring geometry, $R,\theta,s$, axial rotation |
| `faraday-disk.webp` | Fig. 4, p. 9 | Thin disk, axial field/rotation, center–rim brush circuit and resistance |

All four are new schematic redraws of the supplied problem geometries. Source exam text and designs remain attributed to the supplied paper; no open license for that paper was provided. The contributors' independently drawn layouts and annotations are available under **CC BY 4.0**, without relicensing the source paper. No original exam screenshot is embedded.

## Reproduction

Authoring dependencies are Python, NumPy, Matplotlib, and Pillow. From the repository root:

```bash
MPLCONFIGDIR=/tmp/gp2-matplotlib python3 scripts/generate_gp2_midterm_figures.py
```

The site uses the optimized WebP assets; these packages are not additional build requirements. The introductory notes, study plan, and twelve transfer problems are new teaching material derived from the course notes, not part of the original exam. The current plan allocates 20 hours of guided learning, 2 hours of short breaks, and 2 hours of flexible time; advanced exercises are optional within that budget.
