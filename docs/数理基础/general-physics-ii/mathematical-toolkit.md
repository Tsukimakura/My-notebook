---
title: "General Physics II · Mathematical Toolkit"
status: draft
tags: [math-physics, physics, vector-calculus, mathematical-methods]
created: 2026-10-06
updated: 2026-10-06
sources:
  - "~/GP-docs/lecture01(1).pdf, PDF pp. 39–45"
  - "~/GP-docs/lecture02(1).pdf, PDF pp. 33–41"
  - "~/GP-docs/lecture03(1).pdf, PDF pp. 37–39"
  - "~/GP-docs/lecture04(2).pdf, PDF pp. 29–33"
  - "Classroom explanations of expansions, gradients, line/surface integrals, and spherical divergence in classes 1–4"
---

# General Physics II · Mathematical Toolkit

[Course index](index.md) · [Formula sheet](quick-reference.md)

This page collects the mathematical support supplied with lectures 1–4. Some appendix details were assigned for independent reading rather than fully developed in class. They support the first six classes and introduce no additional physics syllabus.

## 1. Vectors, components, and projections

Write $\mathbf A=A_x\hat{\mathbf x}+A_y\hat{\mathbf y}+A_z\hat{\mathbf z}$. In a Cartesian orthonormal basis,

$$
|\mathbf A|=\sqrt{A_x^2+A_y^2+A_z^2},\qquad
\mathbf A\cdot\mathbf B=A_xB_x+A_yB_y+A_zB_z=AB\cos\theta.
$$

The dot product extracts a projected contribution, as in work or flux. The component along a unit vector $\hat{\mathbf n}$ is $\mathbf A\cdot\hat{\mathbf n}$; the projected vector is $(\mathbf A\cdot\hat{\mathbf n})\hat{\mathbf n}$.

The cross product has magnitude $AB\sin\theta$ and direction from the right-hand rule:

$$
\mathbf A\times\mathbf B=
\begin{pmatrix}
A_yB_z-A_zB_y\\
A_zB_x-A_xB_z\\
A_xB_y-A_yB_x
\end{pmatrix},\qquad
\mathbf A\times\mathbf B=-\mathbf B\times\mathbf A.
$$

It represents torque $\mathbf r\times\mathbf F$ and the oriented area of a parallelogram. Having a magnitude and direction does not by itself make a quantity a vector; vector addition and transformation rules must also hold. Finite three-dimensional rotations, for example, are not generally added as ordinary vectors.

**中文提示：**点乘用于取投影，叉乘用于取有向面积和力矩。先明确向量的起点、终点、方向，再代入坐标分量。

## 2. Taylor expansion and controlled approximations

For a sufficiently smooth function near zero,

$$
f(x)=f(0)+f'(0)x+\frac{f''(0)}{2!}x^2+\cdots.
$$

Useful small-parameter forms are

$$
\begin{aligned}
(1+x)^\alpha&=1+\alpha x+\tfrac12\alpha(\alpha-1)x^2+O(x^3),\\
\frac1{1+x}&=1-x+x^2+O(x^3),\\
\sqrt{1+x}&=1+\tfrac12x-\tfrac18x^2+O(x^3),\\
e^x&=1+x+\tfrac12x^2+O(x^3),\\
\sin x&=x-\tfrac16x^3+O(x^5),\\
\cos x&=1-\tfrac12x^2+O(x^4),\\
\ln(1+x)&=x-\tfrac12x^2+O(x^3).
\end{aligned}
$$

Use dimensionless expansion parameters. For a far-field problem $r\gg d$, the small parameter is $d/r$, not the dimensional distance $d$ by itself. For example,

$$
\frac1{(r+d)^2}=\frac1{r^2}\left(1+\frac dr\right)^{-2}
=\frac1{r^2}-\frac{2d}{r^3}+O\left(\frac{d^2}{r^4}\right).
$$

In a dipole, leading monopole terms cancel. Keep enough terms **before subtracting** to retain the first nonzero answer. The same lesson applies to estimating the far field of a disk and the narrow-gap limit of a coaxial capacitor.

## 3. Line integrals（曲线积分）

Parameterize a curve by $\mathbf r(t)=(x(t),y(t),z(t))$, $t_i\le t\le t_f$:

$$
d\boldsymbol\ell=\frac{d\mathbf r}{dt}\,dt,\qquad
\int_C\mathbf A\cdot d\boldsymbol\ell
=\int_{t_i}^{t_f}\mathbf A(\mathbf r(t))\cdot\frac{d\mathbf r}{dt}\,dt.
$$

The vector displacement includes direction and reverses when the curve is traversed backward. A scalar line integral instead uses positive arc length,

$$
d\ell=\left|\frac{d\mathbf r}{dt}\right|dt,\qquad
Q=\int_C\lambda\,d\ell.
$$

Do not replace the vector displacement in work with its magnitude unless the required directional projection is already included.

For a potential field $\mathbf A=\nabla f$, the fundamental theorem gives $\int_i^f\nabla f\cdot d\boldsymbol\ell=f_f-f_i$. For $\mathbf E=-\nabla V$, the minus sign reverses the potential difference.

## 4. Surface integrals and normals（曲面积分）

A scalar surface integral adds a quantity per unit area: $Q=\int_S\sigma_s\,dA$. A flux integral uses an oriented normal: $\Phi=\int_S\mathbf A\cdot\hat{\mathbf n}\,dA$.

For a surface $z=f(x,y)$, an upward normal and area element satisfy

$$
\hat{\mathbf n}=\frac{(-f_x,-f_y,1)}{\sqrt{1+f_x^2+f_y^2}},\qquad
dA=\sqrt{1+f_x^2+f_y^2}\,dx\,dy.
$$

Thus the product simplifies:

$$
d\mathbf A=(-f_x,-f_y,1)\,dx\,dy,
$$

and for the upward-oriented surface,

$$
\int_S\mathbf A\cdot d\mathbf A
=\int_D[-A_xf_x-A_yf_y+A_z]_{z=f(x,y)}\,dx\,dy.
$$

This is evaluated on the surface, so any apparent $z$ dependence must be replaced by $f(x,y)$. A downward orientation changes the flux sign. Scalar area does not change sign.

More generally, for $\mathbf r(u,v)$,

$$
d\mathbf A=\left(\frac{\partial\mathbf r}{\partial u}\times\frac{\partial\mathbf r}{\partial v}\right)du\,dv,
\qquad dA=\left|\frac{\partial\mathbf r}{\partial u}\times\frac{\partial\mathbf r}{\partial v}\right|du\,dv.
$$

## 5. Spherical coordinates（球坐标）

Use $r\ge0$, polar angle $0\le\theta\le\pi$ measured from $+z$, and azimuth $0\le\phi<2\pi$ measured from $+x$ toward $+y$:

$$
x=r\sin\theta\cos\phi,\qquad
y=r\sin\theta\sin\phi,\qquad z=r\cos\theta.
$$

The basis $\hat{\mathbf r},\hat{\boldsymbol\theta},\hat{\boldsymbol\phi}$ is orthonormal locally but changes with position. The differential displacement is

$$
d\boldsymbol\ell=\hat{\mathbf r}\,dr
+\hat{\boldsymbol\theta}\,r\,d\theta
+\hat{\boldsymbol\phi}\,r\sin\theta\,d\phi.
$$

The volume and spherical-surface elements are

$$
d\mathcal V=r^2\sin\theta\,dr\,d\theta\,d\phi,\qquad
dA\big|_{r=R}=R^2\sin\theta\,d\theta\,d\phi.
$$

The solid-angle element is $d\Omega=\sin\theta\,d\theta\,d\phi$, integrating to $4\pi$ over a sphere.

### Gradient and divergence

For a scalar,

$$
\nabla V=\hat{\mathbf r}\frac{\partial V}{\partial r}
+\hat{\boldsymbol\theta}\frac1r\frac{\partial V}{\partial\theta}
+\hat{\boldsymbol\phi}\frac1{r\sin\theta}\frac{\partial V}{\partial\phi}.
$$

For a vector field with spherical components,

$$
\nabla\cdot\mathbf A=
\frac1{r^2}\frac{\partial}{\partial r}(r^2A_r)
+\frac1{r\sin\theta}\frac{\partial}{\partial\theta}(\sin\theta A_\theta)
+\frac1{r\sin\theta}\frac{\partial A_\phi}{\partial\phi}.
$$

For radial $\mathbf A=A_r(r)\hat{\mathbf r}$ this reduces to $r^{-2}d(r^2A_r)/dr$. For a spherically symmetric potential,

$$
\nabla^2V=\frac1{r^2}\frac{d}{dr}\left(r^2\frac{dV}{dr}\right),\qquad r>0.
$$

These factors account for the change of geometry and basis; Cartesian component formulas cannot be copied unchanged into spherical components.

## 6. Two integral theorems

The divergence theorem relates a volume to its closed outward boundary:

$$
\int_{\mathcal V}\nabla\cdot\mathbf A\,d\mathcal V
=\oint_{\partial\mathcal V}\mathbf A\cdot d\mathbf A.
$$

Stokes's theorem relates an oriented surface to its oriented boundary curve:

$$
\int_S(\nabla\times\mathbf A)\cdot d\mathbf A
=\oint_{\partial S}\mathbf A\cdot d\boldsymbol\ell.
$$

Both require appropriate regularity, or careful treatment of excluded singularities. A field proportional to $\hat{\mathbf r}/r^2$ is not smooth at the origin, so an ordinary zero-divergence calculation at $r>0$ cannot discard its point source.

### Why zero curl needs a domain condition

On the punctured $xy$ plane, take

$$
\mathbf A=\left(-\frac y{x^2+y^2},\frac x{x^2+y^2},0\right).
$$

Its curl vanishes away from the axis, but a loop once around the origin has integral $2\pi$. Any spanning disk intersects the excluded singular axis, so one cannot apply the smooth-field version of Stokes's theorem there. There is no globally single-valued potential on the punctured domain. This mathematical example explains the qualifier used in classes 3–4.

## 7. Dirac delta and ideal point charges

The delta distribution is defined by integration against a smooth test function:

$$
\int_{-\infty}^{\infty}\delta(x-a)f(x)\,dx=f(a).
$$

It has unit inverse length, and its integral is one. The slide shorthand “zero except at one point, infinite there” is a mnemonic; $\delta$ is not an ordinary function whose value at the point is a number.

In three dimensions,

$$
\delta^{(3)}(\mathbf r)=\delta(x)\delta(y)\delta(z),\qquad
\rho_q(\mathbf r)=q\delta^{(3)}(\mathbf r-\mathbf r_0).
$$

Its volume integral gives $q$ when the point is inside. The distributional Coulomb identities are

$$
\nabla\cdot\frac{\hat{\mathbf r}}{r^2}=4\pi\delta^{(3)}(\mathbf r),\qquad
\nabla^2\frac1r=-4\pi\delta^{(3)}(\mathbf r).
$$

These reconcile local differentiation away from the origin with the nonzero flux through an enclosing sphere.

## References

Lecture 1 appendices provide vector algebra and expansions; lecture 2 appendices provide spherical coordinates and surface integration; lecture 3's appendix provides parameterized line integration; lecture 4 appendices provide spherical divergence and delta distributions. The domain counterexample is an explanatory mathematical addition, not a claim that it was separately lectured.
