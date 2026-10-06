#!/usr/bin/env python3
"""Reproduce the original General Physics II explanatory figures.

Requires numpy, matplotlib and Pillow; these are optional figure-authoring
dependencies, not part of the site's build environment. No lecture images
are copied. Rendered WebP files are committed alongside the notes.
"""

from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Circle, Rectangle, Ellipse
import numpy as np
from PIL import Image


DEST = Path(__file__).resolve().parents[1] / "docs/数理基础/general-physics-ii/assets"
BLUE, RED, GRAY = "#2367a1", "#c43c39", "#526171"
plt.rcParams.update({"font.size": 11, "axes.spines.top": False,
                     "axes.spines.right": False, "figure.facecolor": "white"})


def save(fig, name):
    DEST.mkdir(parents=True, exist_ok=True)
    path = DEST / (name + ".webp")
    fig.savefig(path.with_suffix(".png"), dpi=160, bbox_inches="tight")
    with Image.open(path.with_suffix(".png")) as im:
        im.convert("RGB").save(path, quality=92)
    path.with_suffix(".png").unlink()
    plt.close(fig)
    print(path)


def arrow(ax, start, end, color=BLUE, **kwargs):
    ax.annotate("", xy=end, xytext=start,
                arrowprops=dict(arrowstyle="->", color=color, lw=1.6, **kwargs))


def point(ax, xy, label, positive=True, radius=.09):
    ax.add_patch(Circle(xy, radius, color=RED if positive else BLUE, zorder=8))
    ax.annotate(label, xy, xytext=(7, 8), textcoords="offset points",
                color=RED if positive else BLUE, zorder=9)


def field(charges, extent=3, n=240):
    x = np.linspace(-extent, extent, n)
    y = np.linspace(-extent, extent, n)
    X, Y = np.meshgrid(x, y)
    ex, ey, v = np.zeros_like(X), np.zeros_like(X), np.zeros_like(X)
    mask = np.zeros_like(X, dtype=bool)
    for q, cx, cy in charges:
        dx, dy = X-cx, Y-cy
        r2 = dx*dx+dy*dy
        mask |= r2 < .12**2
        safe = np.maximum(r2, .12**2)
        ex += q*dx/safe**1.5
        ey += q*dy/safe**1.5
        v += q/np.sqrt(safe)
    return x, y, np.ma.array(ex, mask=mask), np.ma.array(ey, mask=mask), np.ma.array(v, mask=mask)


def panel(ax, title, lim=3):
    ax.set(xlim=(-lim, lim), ylim=(-lim, lim), aspect="equal", title=title)
    ax.set_xticks([])
    ax.set_yticks([])


def main():
    fig, axes = plt.subplots(1, 2, figsize=(10, 4.5))
    for ax, charges, title in zip(axes, [[(1, -1, 0), (1, 1, 0)], [(1, -1, 0), (-1, 1, 0)]],
                                  ["Two equal positive charges", "Electric dipole"]):
        x, y, ex, ey, v = field(charges)
        ax.streamplot(x, y, ex, ey, density=1.25, color=BLUE, linewidth=.8, arrowsize=1)
        for q, cx, cy in charges:
            point(ax, (cx, cy), "+q" if q > 0 else "-q", q > 0)
        panel(ax, title)
    fig.text(.5, .01, "Streamline placement is numerical; line density is not a calibrated measure of |E|.", ha="center", fontsize=10)
    save(fig, "charge-field-lines")

    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    ax = axes[0]
    panel(ax, "Dipole in a uniform field", 1.5)
    for y in [-1, -.5, 0, .5, 1]:
        arrow(ax, (-1.4, y), (1.4, y), color="#c5d4e3")
    a = np.array([.65, .55])
    ax.plot([-a[0], a[0]], [-a[1], a[1]], color=GRAY, lw=3)
    point(ax, a, "+q")
    point(ax, -a, "-q", False)
    arrow(ax, a, a+[.6, 0], RED)
    arrow(ax, -a, -a-[.6, 0], BLUE)
    arrow(ax, -a*.7, a*.7, GRAY)
    ax.text(-.1, .15, "p", color=GRAY)
    ax.text(.7, -1.25, "E →")
    ax.text(-1.4, 1.25, "Torque turns p toward E")
    t = np.linspace(0, np.pi, 300)
    axes[1].plot(t/np.pi*180, -np.cos(t), color=BLUE)
    axes[1].scatter([0, 180], [-1, 1], color=[BLUE, RED])
    axes[1].set(xlabel=r"Angle $\theta$ (degrees)", ylabel=r"$U/(pE)$", title=r"$U=-pE\cos\theta$")
    axes[1].text(10, -.85, "Stable")
    axes[1].text(115, .8, "Unstable")
    save(fig, "dipole-torque-energy")

    fig, axes = plt.subplots(1, 2, figsize=(10, 4.2))
    ax = axes[0]
    ax.add_patch(Ellipse((0, 0), 2.2, .65, fill=False, lw=2, edgecolor=BLUE))
    ax.plot([0, 0], [-.5, 2.3], color=GRAY)
    point(ax, (0, 1.9), "P(0,0,z)", radius=.055)
    for x in [-1.05, 1.05]:
        point(ax, (x, 0), "dq", radius=.045)
        arrow(ax, (x, 0), (0, 1.9), color="#adb8c3")
    arrow(ax, (0, 1.9), (.48, 2.45), RED)
    arrow(ax, (0, 1.9), (-.48, 2.45), RED)
    arrow(ax, (0, 1.9), (0, 2.7), BLUE)
    ax.text(.5, 1.1, r"$s=\sqrt{R^2+z^2}$")
    ax.text(.22, 2.7, r"$E_z$")
    ax.set(xlim=(-1.7, 1.7), ylim=(-.6, 3.1), title="Ring: transverse components cancel", aspect="equal")
    ax.axis("off")
    u = np.linspace(0, 5, 400)
    axes[1].plot(u, u/(1+u*u)**1.5, label=r"Ring: $E_z/(kQ/R^2)$")
    axes[1].plot(u, 1-u/np.sqrt(1+u*u), label=r"Disk: $E_z/(\sigma/2\epsilon_0)$")
    axes[1].set(xlabel=r"$z/R$ ($z>0$)", ylabel="Normalized axial field", title="Different normalizations; compare shapes")
    axes[1].legend(fontsize=9)
    save(fig, "ring-disk-axis")

    fig, axes = plt.subplots(1, 3, figsize=(12, 3.7))
    ax = axes[0]
    ax.add_patch(Circle((0, 0), .65, color="#e2eaf2"))
    ax.add_patch(Circle((0, 0), 1.2, fill=False, ls="--", color=BLUE))
    for t in np.linspace(0, 2*np.pi, 8, endpoint=False):
        v = np.array([np.cos(t), np.sin(t)])
        arrow(ax, .8*v, 1.55*v)
    panel(ax, "Sphere: radial E", 1.8)
    ax.text(-1.5, -1.6, r"Flux = $E(4\pi r^2)$")
    ax = axes[1]
    ax.axhline(0, color=RED, lw=4)
    ax.add_patch(Rectangle((-.55, -.8), 1.1, 1.6, fill=False, ls="--", edgecolor=BLUE))
    for x in [-1, 0, 1]:
        arrow(ax, (x, .1), (x, 1.3))
        arrow(ax, (x, -.1), (x, -1.3))
    panel(ax, "Sheet: pillbox", 1.8)
    ax.text(-1.5, -1.6, r"Flux = $2EA$")
    ax = axes[2]
    ax.axvline(0, color=RED, lw=4)
    ax.add_patch(Rectangle((-.8, -.9), 1.6, 1.8, fill=False, ls="--", edgecolor=BLUE))
    for y in [-.6, 0, .6]:
        arrow(ax, (.05, y), (1.35, y))
        arrow(ax, (-.05, y), (-1.35, y))
    panel(ax, "Line: coaxial cylinder (side view)", 1.8)
    ax.text(-1.5, -1.6, r"Flux = $E(2\pi rL)$")
    save(fig, "gaussian-surfaces")

    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    r = np.linspace(.001, 3, 600)
    axes[0].plot(r, np.where(r <= 1, r, 1/r**2), label="Uniform insulating ball")
    axes[0].plot(r, np.where(r < 1, 0, 1/r**2), ls="--", label="Conducting sphere")
    axes[0].set(ylabel=r"$E_r/(kQ/R^2)$", title="Electric field")
    axes[1].plot(r, np.where(r <= 1, (3-r*r)/2, 1/r), label="Uniform insulating ball")
    axes[1].plot(r, np.where(r < 1, 1, 1/r), ls="--", label="Conducting sphere")
    axes[1].set(ylabel=r"$V/(kQ/R)$", title=r"Potential: $V(\infty)=0$")
    for ax in axes:
        ax.axvline(1, color=GRAY, ls=":")
        ax.set(xlabel=r"$r/R$", ylim=(-.05, 1.65))
        ax.legend(fontsize=9)
    save(fig, "sphere-field-potential")

    fig, ax = plt.subplots(figsize=(8.5, 4.5))
    ax.axis("off")
    nodes = [(0, 0), (2, 3), (4, 0)]
    for xy, label in zip(nodes, [r"Charge density $\rho$", r"Electric field $\mathbf{E}$", r"Potential $V$"]):
        ax.text(*xy, label, ha="center", bbox=dict(boxstyle="round,pad=.6", fc="#e7eff6", ec=BLUE))
    for start, end in [((.4, .5), (1.6, 2.5)), ((2.4, 2.5), (3.6, .5)), ((3.1, 0), (.9, 0))]:
        ax.annotate("", xy=end, xytext=start,
                    arrowprops=dict(arrowstyle="<->", color=BLUE, lw=1.6))
    ax.text(-.05, 1.55, r"$\nabla\cdot\mathbf{E}=\rho/\epsilon_0$", rotation=54)
    ax.text(2.8, 1.6, r"$\mathbf{E}=-\nabla V$", rotation=-54)
    ax.text(2, -.6, r"$\nabla^2 V=-\rho/\epsilon_0$", ha="center")
    ax.text(2, 1, r"Electrostatics: $\nabla\times\mathbf{E}=0$", ha="center")
    ax.text(2, -1.1, "Source equations require boundary conditions to determine a solution.", ha="center", fontsize=10)
    ax.set(xlim=(-1.3, 5.3), ylim=(-1.3, 3.6))
    save(fig, "electrostatics-triangle")

    fig, ax = plt.subplots(figsize=(7, 5))
    x, y, ex, ey, v = field([(1, 0, 1), (-1, 0, -1)], extent=2.7)
    ax.streamplot(x, y, ex, ey, color=BLUE, density=1.2, linewidth=.8)
    yy = np.linspace(-2.7, 2.7, len(y))
    upper = np.ma.array(v, mask=np.ma.getmaskarray(v) | (yy[:, None] <= 0))
    ax.contour(x, y, upper, levels=[.15, .3, .6, 1, 2, 4], colors=RED, linewidths=.8)
    ax.axhspan(-2.7, 0, facecolor="#e8ebee", alpha=.8, zorder=4)
    ax.axhline(0, color=GRAY, lw=3, zorder=5)
    point(ax, (0, 1), "+q (real)")
    point(ax, (0, -1), "-q (image)", False)
    ax.text(-2.5, .12, "Grounded plane: V = 0", zorder=6)
    ax.text(-2.5, -2.3, "Lower half: auxiliary construction only", zorder=6)
    panel(ax, "Image method: field lines and equipotentials", 2.7)
    save(fig, "grounded-plane-image")

    fig, axes = plt.subplots(1, 2, figsize=(10, 4.5))
    ax = axes[0]
    x = np.linspace(-3, 3, 240)
    X, Z = np.meshgrid(x, x)
    r2 = X**2+Z**2
    safe = np.maximum(r2, 1)
    ex = 3*X*Z/safe**2.5
    ez = 1+(3*Z**2/safe-1)/safe**1.5
    mask = r2 <= 1.03
    ax.streamplot(x, x, np.ma.array(ex, mask=mask), np.ma.array(ez, mask=mask), density=1.3, color=BLUE, linewidth=.8)
    ax.add_patch(Circle((0, 0), 1, color="#e0e5ea", zorder=5))
    ax.text(0, 0, "E = 0", ha="center", zorder=6)
    ax.text(-.2, .76, "+ +", color=RED, zorder=6)
    ax.text(-.2, -.85, "- -", color=BLUE, zorder=6)
    panel(ax, r"Neutral sphere in $\mathbf{E}_0=E_0\hat z$")
    t = np.linspace(0, np.pi, 300)
    axes[1].plot(t*180/np.pi, 3*np.cos(t), color=BLUE)
    axes[1].axhline(0, color=GRAY, lw=.6)
    axes[1].set(xlabel=r"Polar angle $\theta$ (degrees)", ylabel=r"$\sigma/(\epsilon_0 E_0)$", title="Induced surface charge")
    save(fig, "sphere-uniform-field")

    fig, axes = plt.subplots(1, 2, figsize=(10, 3.7))
    for ax, real, img, title in [(axes[0], 2, .5, "Exterior problem: real q outside"),
                                  (axes[1], .5, 2, "Cavity problem: real q inside")]:
        ax.add_patch(Circle((0, 0), 1, fill=False, lw=2, edgecolor=GRAY))
        ax.axhline(0, color="#bcc4cc", lw=.7)
        point(ax, (real, 0), "q")
        point(ax, (img, 0), "q' (image)", False)
        ax.plot(0, 0, "k.")
        ax.text(-.9, .7, "R")
        ax.text(-1.05, -1.45, r"$b=R^2/a,\quad q'=-qR/a$")
        ax.set(xlim=(-1.2, 2.7), ylim=(-1.65, 1.4), aspect="equal", title=title)
        ax.axis("off")
    save(fig, "spherical-image-geometry")

    fig, axes = plt.subplots(1, 2, figsize=(10, 3.8))
    rng = np.random.default_rng(17)
    steps = rng.normal(size=(24, 2))*.23
    path = np.vstack(([0, 0], np.cumsum(steps, axis=0)))
    drift = path+np.column_stack((np.linspace(0, 2.3, len(path)), np.zeros(len(path))))
    axes[0].plot(*path.T, color=GRAY, label="Random motion (schematic)")
    axes[0].plot(*drift.T, color=BLUE, label="Random + mean drift")
    axes[0].set(title="Drift is superposed on microscopic motion", aspect="equal")
    axes[0].legend(fontsize=8)
    ax = axes[1]
    ax.add_patch(Rectangle((0, -.5), 3, 1, fc="#edf2f7", ec=GRAY))
    ax.plot([2, 2], [-.65, .65], color=RED, lw=2)
    ax.text(2, .8, "Cross section A")
    arrow(ax, (.3, 0), (1.4, 0))
    ax.text(.45, .18, r"$\mathbf{J}$ (positive charge flow)")
    arrow(ax, (1.4, -.95), (.3, -.95), RED)
    ax.text(.35, -1.3, "Electron drift (charge -e)")
    ax.text(0, 1.3, r"$i=\int\mathbf{J}\cdot d\mathbf{A}$")
    ax.set(xlim=(-.2, 3.2), ylim=(-1.5, 1.65), title="Current and electron velocity")
    ax.axis("off")
    save(fig, "current-drift")

    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    ax = axes[0]
    ax.plot([-.8, .8], [.6, .6], color=RED, lw=5)
    ax.plot([-.8, .8], [-.6, -.6], color=BLUE, lw=5)
    for x in [-.5, 0, .5]:
        arrow(ax, (x, .5), (x, -.5))
    ax.text(-.75, .8, "+q, plate area A")
    ax.text(-.75, -.95, "-q")
    ax.text(1, 0, "d")
    ax.text(-1.1, -1.5, r"$C=\epsilon_0 A/d$")
    panel(ax, "Parallel plates (edge effects neglected)", 1.8)
    ax = axes[1]
    for radius, color in [(.55, RED), (1.15, BLUE)]:
        ax.add_patch(Circle((0, 0), radius, fill=False, lw=3, edgecolor=color))
    arrow(ax, (0, 0), (.55, 0), RED)
    arrow(ax, (0, 0), (0, 1.15), BLUE)
    ax.text(.2, -.2, "a")
    ax.text(.1, .8, "b")
    ax.text(-1.3, -1.55, r"$C=2\pi\epsilon_0 L/\ln(b/a)$")
    panel(ax, "Coaxial cylinders (cross section)", 1.8)
    save(fig, "capacitor-geometries")


if __name__ == "__main__":
    main()
