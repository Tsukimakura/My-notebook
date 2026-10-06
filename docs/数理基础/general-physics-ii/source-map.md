---
title: "General Physics II · Source Map and Scope"
status: draft
tags: [math-physics, physics, course, sources]
created: 2026-10-06
updated: 2026-10-06
sources:
  - "~/GP-docs/: six lecture PDFs, six classroom transcript/screenshot directories, and demo1.zip"
---

# General Physics II · Source Map and Scope

[Course index](index.md)

This page records the inputs used to prepare the first-six-class notes. Local source names are provenance identifiers; the original PDFs and transcripts remain in `~/GP-docs/` and are not duplicated into the published website. **Page numbers below refer to the one-based PDF page index**, which can differ from the printed slide counter.

## 1. Source inventory and class mapping

The classroom sequence is established from the opening recaps and lesson content, not simply from file counts. There are **six PDFs, six timestamped transcripts, 242 classroom screenshots, and one demonstration archive**. Screenshot sets include repeated screens, desktop/application views, breaks, and post-class material; these do not all represent additional lecture topics.

| Class | PDF and page count | Transcript directory | Screenshots | Principal teaching interval / topic |
| --- | --- | --- | --- | --- |
| 1 | `lecture01(1).pdf` — 45 pp. | `course_87159_sub_1967533` | 52 | Approximately 19:09–98:39: charge, Coulomb's law, field visualization, dipole field, torque, and energy. Earlier minutes introduce the course. |
| 2 | `lecture02(1).pdf` — 41 pp. | `course_87159_sub_1968597` | 33 | Approximately 03:19–16:36: dipole/material/multipole recap; 17:12–95:16: continuous charge, rings/disks, flux, Gauss's law, and symmetry. |
| 3 | `lecture03(1).pdf` — 39 pp. | `course_87159_sub_1970155` | 51 | Approximately 13:09–96:44: conservative fields, work/energy, potential, equipotentials, charge-system energy, rods/disks, and potential derivatives. |
| 4 | `lecture04(2).pdf` — 33 pp. | `course_87159_sub_1971496` | 33 | Approximately 00:13–93:00: gradient, uniform-ball potential, curl, divergence, Poisson's equation, and spherical divergence. |
| 5 | `lecture05(1).pdf` — 32 pp. | `course_87159_sub_1973619` | 29 | Approximately 02:00–92:04: conductor equilibrium, shielding, image plane, uniform-field sphere, and spherical images. |
| 6 | `lecture06(1).pdf` — 38 pp. | `course_87159_sub_1974844` | 44 | Approximately 04:20–99:09: current and Drude transport, thermal links, continuity, capacitance, combinations, and material appendices. |

Each directory contains `course_content.md` and files named `ppt_NNN.png`. The images were inspected as source context and topic/progress checks. Published figures are newly drawn diagrams and calculated plots, not copied screenshots.

## 2. Where the PDF content appears

| Notes | Core PDF material | Classroom supplements / support |
| --- | --- | --- |
| [Charge and electric field](01-charge-and-electric-field.md) | Lecture 1 pp. 4–32 | Dipole energy and stability at the end of class 1; ferroelectricity, piezoelectricity, and higher multipoles at the start of class 2. |
| [Continuous charge and Gauss's law](02-continuous-charge-and-gauss-law.md) | Lecture 2 pp. 3–8, 10–30 | Symmetry arguments, solid-angle interpretation, limiting-case checks, and the local/global problem-solving comparison. |
| [Electric potential](03-electric-potential.md) | Lecture 3 pp. 3–32 | Explicit conservative-field reasoning and curl in class 3; uniform insulating ball's potential in class 4, approximately 24–29 minutes. |
| [Electrostatics triangle](04-triangle-of-electrostatics.md) | Lecture 4 pp. 4–26 | Inverse density calculation, geometric versus true divergence, and spherical divergence. |
| [Conductors and images](05-conductors-and-image-charges.md) | Lecture 5 pp. 5–30 | Uniform-field sphere at approximately 60:47–70:40; spherical image construction at approximately 71:27–90:28. |
| [Current, resistance, capacitance](06-current-resistance-and-capacitance.md) | Lecture 6 pp. 3–28 and 33–38 | Copper density and mean free path at approximately 35–40 minutes; Fermi motion at 40–48; thermal transport at 54–64; displacement-current preview at 68–70; capacitor combinations at 88–89. |
| [Mathematical toolkit](mathematical-toolkit.md) | Lecture 1 pp. 39–45; lecture 2 pp. 33–41; lecture 3 pp. 37–39; lecture 4 pp. 29–33 | Supporting appendices; not all were taught in equal detail. |

Reading and summary slides are used to organize and cross-check the notes. A Tronclass quiz placeholder without the actual question is not reconstructed as an invented quiz. Breaks, conversations after class, and uncertain speech fragments are not converted into physics claims.

## 3. Demonstration archive

`demo1.zip` contains:

- `demo1.ipynb`: a dipole example and a linear quadrupole example.
- `ElectricFieldLines.py`: charge collection, Coulomb-field summation, grid setup, and Matplotlib streamline visualization.

The source uses the three-dimensional point-charge kernel sampled on a two-dimensional grid. That distinction, and the difference between streamline placement and physically calibrated line density, are explained in class-1 notes. The notebook's code was inspected; its mathematical method informs the new field-line figures. The original code is not copied into the site's assets.

## 4. Editorial corrections and clarifications

Automatic recognition often renders 电场 as “电厂”, 电势 as “电视”, 力矩 as “例句”, and 电偶极矩 as several unrelated phrases. Such recognition errors are normalized to the physical terminology. The following ambiguities require more than spelling correction:

| Issue in source wording | Treatment in the notes |
| --- | --- |
| Dipole torque order or an isolated missing energy minus sign | Derive $\boldsymbol\tau=\mathbf p\times\mathbf E$ and $U=-\mathbf p\cdot\mathbf E$; check stability. |
| Describing a dipole as inevitably settling into its minimum | Distinguish restoring torque and undamped oscillation from relaxation with dissipation. |
| Converse piezoelectric response described as a phase transition | Describe field-induced strain; a phase transition is not required. |
| Empty cavity field inferred only from zero enclosed charge | Use equipotential boundary and uniqueness, in addition to Gauss's law. |
| Shielding phrased as complete independence without conditions | Specify fixed internal total charge, external conditions, and grounded versus isolated shells. |
| Uniform-field sphere described as radial outside | Derive both $E_r$ and $E_\theta$; only the surface tangential component must vanish. |
| Sphere image example shifts between inside and outside | State both domains, verify inversion geometry, and separate $Q_{\mathrm{inner}}=-q$ from exterior $Q_{\mathrm{ind}}=q'$. |
| Sphere-shell potential uses an undifferentiated radius | Separate cavity radius from outer-surface radius when discussing an isolated shell's potential. |
| Copper's roughly 63.5 value called an atomic number | Use molar mass when deriving carrier density. |
| Classical electron speed called a mean speed | Identify the equipartition expression as RMS speed and label its classical assumption. |
| Low-temperature electrons implied to stop | Retain the classroom's Fermi-motion refinement and give a clearly labeled free-electron estimate. |
| Impurity scattering described as necessarily inelastic | Explain momentum relaxation and the possibility of elastic impurity scattering. |
| Superconductivity described as collision-free classical pairs | Give a limited quantum-phase/pairing overview and avoid interpreting the cartoon literally. |

Worked limits, some numerical checks, the uniqueness proof, and the mathematical domain counterexample are explanatory derivations added to make the notes self-contained. They are not presented as verbatim classroom statements.

## 5. Scope boundary

The main lecture content has reached **coaxial capacitance**, its geometric interpretation, series/parallel combinations, and brief material appendices by the end of class 6. Supporting mathematical appendices are collected separately.

The screened-potential exercise on lecture 4 PDF p. 27 has no clearly corresponding developed classroom solution and is omitted from the completed lesson sequence. The post-class Feynman-history/cargo-cult material in lecture 1 is used only for the broad independent-reasoning lesson, rather than reproducing long quotations or treating it as a physics derivation.

Magnetic-field calculations, full Maxwell equations, dielectric polarization theory, capacitor energy density, full circuit analysis, RC charging/discharging, optics, and quantum-mechanical calculations are not expanded into new lesson chapters. Brief mentions of displacement current, Hall/Peltier effects, Fermi motion, and BCS are included only to the extent needed for the classroom discussion.

## 6. External checks

The local materials are the primary basis. A small number of textbook/university sources support corrections where the recognition text or simplified slide wording can mislead:

- [Feynman Lectures, Vol. II, chapter 6](https://www.feynmanlectures.caltech.edu/II_06.html): sphere in a uniform field; grounded versus isolated spherical images.
- [MIT OCW 2.57, complete 2004 transport notes](https://ocw.mit.edu/courses/2-57-nano-to-macro-transport-processes-spring-2012/2e4ecaa5cf55f03bcefbc8ccce79aed6_MIT2_57S12_lec_notes_2004.pdf): Wiedemann–Franz relation and Lorenz number.
- [OpenStax, University Physics Vol. 3, §9.8](https://openstax.org/books/university-physics-volume-3/pages/9-8-superconductivity): zero resistance, Cooper pairing, and the distinction from a perfect conductor.

The notes remain `draft` so subsequent textbook review and future course corrections can be recorded explicitly.
