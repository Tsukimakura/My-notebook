---
title: "Homework Figure Sources and Reproduction"
status: draft
tags: [math-physics, physics, figures, sources]
created: 2026-11-08
updated: 2026-11-08
sources:
  - "课程资料/普通物理学-II/homework/chap02.pdf, Exercise 9"
  - "课程资料/普通物理学-II/homework/chap05.pdf, Exercises 3, 4"
  - "课程资料/普通物理学-II/homework/chap07.pdf, Figures 7.7 and 7.9"
  - "课程资料/普通物理学-II/homework/chap08.pdf, Exercise 3; chap09.pdf, Exercise 9"
  - "课程资料/普通物理学-II/homework/chap11.pdf, Exercises 3, 4"
  - "课程资料/普通物理学-II/homework/chap13.pdf, Figure 13.2"
---

# Homework Figure Sources and Reproduction

[Homework index](../index.md) · [Course figure records](../../assets/README.md)

All eight WebP figures were drawn specifically for these solutions. No original PDF page or screenshot is embedded. Circuit redraws retain the source connections, component values, source polarity, and current conventions; geometric illustrations are schematic.

| Asset | Source / construction | Use |
| --- | --- | --- |
| `wheatstone-bridge.webp` | Redrawn from `chap07.pdf`, Fig. 7.7, PDF p. 9 / printed p. 62 | Ch. 7, Ex. 3: four-arm bridge, $C\to D$ current, source positive toward $B$ |
| `rc-network.webp` | Redrawn from `chap07.pdf`, Fig. 7.9, PDF p. 10 / printed p. 63 | Ch. 7, Ex. 5: three branches and charging-current convention |
| `ac-network.webp` | Redrawn from `chap13.pdf`, Fig. 13.2, PDF p. 8 / printed p. 122 | Ch. 13, Ex. 2: series $C,L$ feeding parallel $L,R$; source value is peak |
| `induced-current-waveforms.webp` | Original computed plot, $I=2\sin(100\pi t)$ A and $i=-4.46490384\cos(100\pi t)$ mA | Ch. 11, Ex. 3(d), one full period with separate vertical scales |
| `induced-electric-field.webp` | Original computed plot, $E(r,t)/E(R,t)=r/R$ inside and $R/r$ outside | Ch. 11, Ex. 4(b), fixed time |
| `junction-charge-and-field.webp` | Original plot derived from `chap02.pdf`, Ex. 9, PDF p. 8 / printed p. 16 | Piecewise charge density and signed field of the p–n model |
| `conductor-images.webp` | New construction diagrams for `chap05.pdf`, Ex. 3 and 4, PDF p. 9 / printed p. 42 | Isolated-sphere and grounded-corner images |
| `magnetic-force-geometries.webp` | New geometry diagrams for `chap08.pdf`, Ex. 3, PDF p. 8 / printed p. 72, and `chap09.pdf`, Ex. 9, PDF p. 13 / printed p. 87 | Field-covered arc and test-wire segment in a toroid |

## Attribution and license

The chapter PDFs are the supplied General Physics II course handouts; their underlying exercise and circuit designs remain attributed to those materials. No separate reuse license for the source handouts was supplied. The original calculated plots and independently created annotations/layout are offered under **CC BY 4.0**, attributed to this notebook's contributors. This statement does not relicense the source handouts or claim authorship of their exercises.

## Reproduction

From the repository root, with Python, NumPy, Matplotlib, and Pillow installed:

```bash
MPLCONFIGDIR=/tmp/gp2-matplotlib python3 scripts/generate_gp2_homework_figures.py
```

The script is an authoring source; the site build uses the committed optimized WebP assets directly. Values, polarities, and curves are specified in the script, so the illustrations can be edited and regenerated.
