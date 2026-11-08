---
title: "Homework 2 · Potential and Local Field Laws"
status: draft
tags: [math-physics, physics, homework, potential, gauss-law]
created: 2026-11-08
updated: 2026-11-08
sources:
  - "课程资料/普通物理学-II/homework/chap03.pdf, Exercises 2, 4, 7, PDF pp. 7–8 (printed pp. 23–24)"
  - "课程资料/普通物理学-II/homework/chap04.pdf, Exercises 2, 5, PDF pp. 8–9 (printed pp. 32–33)"
---

# Homework 2 · Potential and Local Field Laws

[All assignments](index.md) · [Previous](01-electric-fields-and-gauss-law.md) · [Next](03-conductors-and-circuits.md).

## Ch. 3, Ex. 2 · Field from an exponential potential {#ch03-ex02}

**Problem.** Given $V=V_0\exp[-(x^2+y^2+az)/a^2]$, where $V_0>0$ is a potential and $a>0$ a length, find $\mathbf E(x,y,z)$.

**Method:** [Recovering the field from potential](../03-electric-potential.md#9-from-potential-back-to-field).

**Solution.** Differentiate the exponent component by component:

$$
\partial_xV=-\frac{2x}{a^2}V,\qquad
\partial_yV=-\frac{2y}{a^2}V,\qquad
\partial_zV=-\frac1aV.
$$

Therefore

$$
\boxed{\mathbf E=-\nabla V
=V_0e^{-(x^2+y^2+az)/a^2}
\left(\frac{2x}{a^2}\hat{\mathbf x}+\frac{2y}{a^2}\hat{\mathbf y}+\frac1a\hat{\mathbf z}\right).}
$$

The original exponent contains $az$, not $z^2$（不要按球对称势处理）. Each coefficient has units of inverse length.

## Ch. 3, Ex. 4 · Potential of a thick spherical shell {#ch03-ex04}

**Problem.** A spherical shell occupies $R_1<r<R_2$ and has uniform **volume** charge density $\rho$. With $V(\infty)=0$, find $V(r)$ everywhere.

**Method:** [Gauss's law](../02-continuous-charge-and-gauss-law.md#6-how-symmetry-makes-gausss-law-useful), then [field-to-potential integration](../03-electric-potential.md#8-field-to-potential-example-a-uniformly-charged-ball).

**Solution.** Enclosed charge gives

$$
E_r(r)=\begin{cases}
0,&r<R_1,\\
\dfrac{\rho}{3\epsilon_0}\left(r-\dfrac{R_1^3}{r^2}\right),&R_1<r<R_2,\\
\dfrac{\rho(R_2^3-R_1^3)}{3\epsilon_0r^2},&r>R_2.
\end{cases}
$$

Use $V(r)=\int_r^\infty E_r(s)\,ds$, splitting the integral at $R_1,R_2$. In the material, for example,

$$
V(r)=\frac{\rho(R_2^3-R_1^3)}{3\epsilon_0R_2}
+\frac{\rho}{3\epsilon_0}\int_r^{R_2}\left(s-\frac{R_1^3}{s^2}\right)ds.
$$

The result is

$$
\boxed{V(r)=\begin{cases}
\dfrac{\rho(R_2^2-R_1^2)}{2\epsilon_0},&0\leq r\leq R_1,\\[3pt]
\dfrac{\rho}{3\epsilon_0}\left(\dfrac{3R_2^2-r^2}{2}-\dfrac{R_1^3}{r}\right),&R_1<r<R_2,\\[3pt]
\dfrac{\rho(R_2^3-R_1^3)}{3\epsilon_0r},&r\geq R_2.
\end{cases}}
$$

Both $V$ and $-dV/dr=E_r$ match at the boundaries. 内腔中场为零，但电势为非零常数；不能给每段积分独立选择零点。

## Ch. 3, Ex. 7 · Paths and equipotentials {#ch03-ex07}

**Problem.** $\mathbf E=(E_0/a)(y\hat{\mathbf x}+x\hat{\mathbf y})$ everywhere, with $E_0,a>0$ and $V(0)=0$. (a) Find $V(x,y,0)$ along the two axis-aligned paths, first along $x$ then $y$, and in reverse order. (b) Find the equipotential branch through $(a,a,0)$ and show the field is perpendicular to it.

**Method:** [Potential as a line integral](../03-electric-potential.md#3-electric-potential) and [equipotentials](../03-electric-potential.md#4-equipotential-surfaces).

**Solution. (a)** On the first leg of either path the tangential field vanishes. Thus

$$
V_{x\text{ then }y}=-\frac{E_0}{a}\int_0^y x\,dy'
=-\frac{E_0xy}{a},\qquad
V_{y\text{ then }x}=-\frac{E_0}{a}\int_0^x y\,dx'
=-\frac{E_0xy}{a}.
$$

**(b)** At $(a,a)$, $V=-E_0a$. The required connected branch is

$$
\boxed{xy=a^2,\qquad x>0,\ y>0.}
$$

Since $dy/dx=-y/x$, a tangent is $\mathbf t=(1,-y/x,0)$. Then
$\mathbf E\cdot\mathbf t=(E_0/a)(y-y)=0$. Only the first-quadrant branch contains the specified point.

## Ch. 4, Ex. 2 · Quadratic potential, curl, and charge {#ch04-ex02}

**Problem.** $V=A(x^2+y^2)+Bz^2$, with $A,B>0$. (a) Find $\mathbf E$. (b) Show $\nabla\times\mathbf E=0$. (c) Find $\rho(x,y,z)$ using local Gauss's law.

**Method:** [Gradient](../04-triangle-of-electrostatics.md#1-gradient-local-change-of-a-scalar-field), [curl](../04-triangle-of-electrostatics.md#2-curl-local-circulation), and [Poisson's equation](../04-triangle-of-electrostatics.md#5-poissons-and-laplaces-equations).

**Solution. (a)** $\boxed{\mathbf E=-2Ax\hat{\mathbf x}-2Ay\hat{\mathbf y}-2Bz\hat{\mathbf z}}$.

**(b)** Each component depends only on its own coordinate, so all cross derivatives vanish: $\boxed{\nabla\times\mathbf E=0}$.

**(c)**

$$
\boxed{\rho=\epsilon_0\nabla\cdot\mathbf E=-\epsilon_0(4A+2B).}
$$

This also follows from $\rho=-\epsilon_0\nabla^2V$. The density is uniform and negative; the field converges toward the origin.

## Ch. 4, Ex. 5 · Six-face flux versus volume charge {#ch04-ex05}

**Problem.** In a region containing the box below,
$\mathbf E=E_0[(1+xy/a^2)\hat{\mathbf x}+x^2\hat{\mathbf y}/(2a^2)]$, with $E_0,a>0$.
(a) Find $\rho$, and evaluate $\rho,\mathbf E$ at the origin.
(b) Directly sum the outward flux through the six faces of $0\leq x\leq a$, $0\leq y\leq b$, $0\leq z\leq c$, where $b,c>0$.
(c) Integrate $\rho$ over the box and verify Gauss's theorem and law.

**Method:** [Local Gauss's law](../04-triangle-of-electrostatics.md#3-deriving-local-gausss-law-from-a-small-box) and [divergence theorem](../04-triangle-of-electrostatics.md#4-divergence-theorem-and-globallocal-equivalence).

**Solution. (a)**

$$
\boxed{\rho=\epsilon_0\left(\partial_xE_x+\partial_yE_y\right)
=\frac{\epsilon_0E_0y}{a^2},\qquad
\rho(0)=0,\quad\mathbf E(0)=E_0\hat{\mathbf x}.}
$$

局部电荷密度为零，并不意味着该点电场为零。

**(b)** Keep each outward normal's sign:

| Face | Outward flux |
| --- | --- |
| $x=a$ | $E_0c\int_0^b(1+y/a)dy=E_0bc+E_0b^2c/(2a)$ |
| $x=0$ | $-E_0bc$ |
| $y=b$ | $E_0c\int_0^a x^2/(2a^2)dx=E_0ac/6$ |
| $y=0$ | $-E_0ac/6$ |
| $z=c$ and $z=0$ | $0$ on each |

Hence $\boxed{\Phi=E_0b^2c/(2a)}$.

**(c)**

$$
Q_{\rm enc}=\int_0^a\!dx\int_0^b\!dy\int_0^c\!dz\,
\frac{\epsilon_0E_0y}{a^2}
=\frac{\epsilon_0E_0b^2c}{2a}
=\epsilon_0\Phi.
$$

Thus the direct surface integral equals both $\int\nabla\cdot\mathbf E\,dV$ and $Q_{\rm enc}/\epsilon_0$.
