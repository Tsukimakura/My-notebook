#!/usr/bin/env python3
"""Redraw the four figures in the user-supplied 2023 GP II midterm.

Authoring dependencies: NumPy, Matplotlib, Pillow. Sources and rights are
recorded in midterm/assets/README.md; the website uses optimized WebP files.
"""
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Arc, Circle, Ellipse, Rectangle
import numpy as np
from PIL import Image


DEST = Path(__file__).resolve().parents[1] / "docs/数理基础/general-physics-ii/midterm/assets"
BLUE, RED, GRAY, GREEN = "#2367a1", "#b73d3d", "#56616e", "#26735a"
plt.rcParams.update({"font.size": 11, "figure.facecolor": "white"})


def save(fig, name):
    DEST.mkdir(parents=True, exist_ok=True)
    temporary = DEST / (name + ".png")
    fig.savefig(temporary, dpi=180, bbox_inches="tight")
    with Image.open(temporary) as im:
        im.convert("RGB").save(temporary.with_suffix(".webp"), quality=93)
    temporary.unlink()
    plt.close(fig)
    print(name)


def line(ax, a, b, color=GRAY, **kwargs):
    ax.plot([a[0], b[0]], [a[1], b[1]], color=color, lw=1.5, **kwargs)


def arrow(ax, a, b, color=BLUE, double=False):
    ax.annotate("", xy=b, xytext=a, arrowprops={
        "arrowstyle": "<->" if double else "->", "color": color, "lw": 1.6})


def clean(ax, title, xlim, ylim):
    ax.set(title=title, aspect="equal", xlim=xlim, ylim=ylim)
    ax.axis("off")


def ground(ax):
    line(ax, (-.55, -.84), (-.55, -1.3))
    line(ax, (-.55, -1.3), (-.9, -1.3))
    line(ax, (-.9, -1.3), (-.9, -1.5))
    for width, y in [(.26, -1.5), (.18, -1.59), (.09, -1.68)]:
        line(ax, (-.9-width, y), (-.9+width, y))


def spheres():
    fig, axes = plt.subplots(2, 2, figsize=(10, 7.6))
    titles = ["(a) Isolated sphere", "(b) External charge; isolated",
              "(c) Grounded sphere", "(d) Image construction"]
    for number, (ax, title) in enumerate(zip(axes.flat, titles)):
        ax.add_patch(Circle((0, 0), 1, fc="#f2f5f8", ec=GRAY, lw=2))
        ax.plot(0, 0, "o", color=GRAY, ms=4)
        ax.text(-.24, -.08, "O", color=GRAY)
        if number != 3:
            arrow(ax, (0, 0), (.66, .75))
            ax.text(.19, .48, "R", color=BLUE)
        if number in (0, 1):
            ax.text(-1.2, .72, "+Q", color=RED)
        else:
            ax.text(-1.23, .72, "$Q_2$", color=BLUE)
            ground(ax)
        if number:
            ax.plot(2.65, 0, "o", color=RED, ms=5)
            ax.text(2.64, .18, "+q", ha="center", color=RED)
            line(ax, (0, 0), (2.65, 0), color=BLUE, ls="--")
            arrow(ax, (0, -.48), (2.65, -.48), double=True)
            ax.text(1.55, -.74, "d", color=BLUE)
        if number == 3:
            point = np.array([1.25, 1.65])
            image = np.array([.38, 0])
            ax.plot(*image, "o", color=GREEN, ms=5)
            ax.text(.36, -.22, "$-q'$", color=GREEN, fontsize=10)
            ax.plot(*point, "o", color=BLUE, ms=4)
            ax.text(point[0]+.1, point[1]+.03, "P", color=BLUE)
            line(ax, (0, 0), point, color=BLUE)
            line(ax, image, point, color=GREEN, ls=":")
            line(ax, (2.65, 0), point, color=RED, ls=":")
            ax.add_patch(Arc((0, 0), .6, .6, theta1=0,
                             theta2=np.rad2deg(np.arctan2(point[1], point[0])), ec=BLUE))
            ax.text(.3, .22, r"$\theta$", color=BLUE)
            arrow(ax, (0, -.95), (.38, -.95), double=True)
            ax.text(.19, -1.18, "a", color=BLUE, ha="center")
            ax.text(.42, .9, "R", color=BLUE)
        clean(ax, title, (-1.6, 3.15), (-1.85, 2.1))
    fig.tight_layout()
    save(fig, "sphere-images")


def capacitor():
    fig, ax = plt.subplots(figsize=(6.2, 5.4))
    ax.add_patch(Circle((0, 0), 1.55, fc="#e4eef5", ec=GRAY, lw=3))
    ax.add_patch(Circle((0, 0), .68, fc="white", ec=GRAY, lw=3))
    ax.plot(0, 0, "o", color=GRAY, ms=4)
    ax.text(-.22, -.05, "O")
    arrow(ax, (0, 0), (.34, .589))
    ax.text(.05, .38, "a", color=BLUE)
    arrow(ax, (0, 0), (1.40, .66))
    ax.text(.94, .23, "b", color=BLUE)
    ax.text(-.55, .85, "$+Q_0$", color=RED)
    ax.text(-.5, 1.63, "$-Q_0$", color=BLUE)
    ax.text(-.85, -.9, r"$\sigma,\ \epsilon_r$", color=BLUE, fontsize=16)
    clean(ax, "Q2: lossy dielectric between concentric electrodes", (-1.95, 1.95), (-1.85, 2))
    save(fig, "lossy-capacitor")


def rotating_sphere():
    fig, ax = plt.subplots(figsize=(6, 6))
    radius = 1.3
    theta = np.deg2rad(55)
    s, z = radius*np.sin(theta), radius*np.cos(theta)
    ax.add_patch(Circle((0, 0), radius, fc="#f2f5f8", ec=GRAY, lw=2))
    ax.add_patch(Ellipse((0, z), 2*s, .22, fc="#e4eef5", ec=BLUE, lw=1.5))
    line(ax, (0, -1.6), (0, 1.65), color=BLUE, ls="--")
    arrow(ax, (0, 1.5), (0, 2.15), color=RED)
    ax.text(.14, 1.93, r"$\omega$", color=RED)
    ax.text(-.2, 1.55, "z", color=BLUE)
    ax.plot(0, 0, "o", color=GRAY, ms=4)
    ax.text(-.22, -.13, "O")
    arrow(ax, (0, 0), (s, z))
    ax.text(.53, .25, "R", color=BLUE)
    arrow(ax, (0, z), (s, z), double=True)
    ax.text(.54, z+.16, "s", color=BLUE)
    ax.add_patch(Arc((0, 0), .7, .7, theta1=35, theta2=90, ec=BLUE))
    ax.text(.22, .42, r"$\theta$", color=BLUE)
    ax.text(.83, 1.19, "+Q", color=RED)
    clean(ax, "Q3: a latitude ring of the rotating charged surface", (-1.75, 1.75), (-1.75, 2.45))
    save(fig, "rotating-sphere")


def disk():
    fig, ax = plt.subplots(figsize=(7.4, 5.3))
    ax.add_patch(Rectangle((-1.7, -.2), 3.4, .2, fc="#e2e6eb", ec=GRAY))
    ax.add_patch(Ellipse((0, -.2), 3.4, .85, fc="#e2e6eb", ec=GRAY, lw=1.4))
    ax.add_patch(Ellipse((0, 0), 3.4, .85, fc="#f4f6f8", ec=GRAY, lw=1.5))
    line(ax, (-1.7, 0), (-1.7, -.2))
    line(ax, (1.7, 0), (1.7, -.2))
    for x in [-1.25, -.6, .6, 1.25]:
        arrow(ax, (x, -1.55), (x, -.8))
    ax.text(-1.7, -1.25, "B", color=BLUE)
    ax.plot([0, 1.7], [0, 0], "o", color=GRAY, ms=4)
    ax.text(.12, -.25, "O"); ax.text(1.81, -.19, "A")
    arrow(ax, (0, .04), (-1.65, .04), double=True)
    ax.text(-.85, .14, "a", color=BLUE)
    arrow(ax, (-.15, .25), (-.15, 1.1), color=RED)
    ax.text(-.49, .92, r"$\omega$", color=RED)
    line(ax, (0, 0), (0, 1.65))
    line(ax, (0, 1.65), (1.05, 1.65))
    ax.add_patch(Rectangle((1.05, 1.51), .42, .28, fc="white", ec=GRAY, lw=1.6))
    line(ax, (1.47, 1.65), (2.5, 1.65))
    line(ax, (2.5, 1.65), (2.5, 0)); line(ax, (2.5, 0), (1.7, 0))
    ax.text(1.26, 1.99, "R", ha="center", color=BLUE)
    arrow(ax, (2.5, .45), (2.5, 1.12), color=RED)
    ax.text(2.66, .8, "I", color=RED)
    line(ax, (-1.95, -.2), (-1.95, 0), color=BLUE)
    line(ax, (-2.02, -.2), (-1.88, -.2), color=BLUE)
    line(ax, (-2.02, 0), (-1.88, 0), color=BLUE)
    ax.text(-2.2, -.13, "h", color=BLUE)
    clean(ax, "Q4: center and rim brush contacts; total resistance R", (-2.45, 3.1), (-1.8, 2.35))
    save(fig, "faraday-disk")


if __name__ == "__main__":
    spheres()
    capacitor()
    rotating_sphere()
    disk()
