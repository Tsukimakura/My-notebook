"""Reproduce original probability teaching diagrams.

Sources and rights: source-manifest.json and README.md.
Requires numpy, matplotlib, pillow and Noto Sans CJK.
No separate open license is declared for these notebook assets.
"""

from io import BytesIO
from math import comb, factorial
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.colors import ListedColormap
from matplotlib.font_manager import FontProperties, fontManager
from matplotlib.patches import Polygon
import numpy as np
from PIL import Image

OUT = Path(__file__).resolve().parent
FONT = Path("/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc")
if FONT.exists():
    fontManager.addfont(str(FONT))
    plt.rcParams["font.family"] = FontProperties(fname=str(FONT)).get_name()
plt.rcParams.update({
    "font.size": 11, "axes.unicode_minus": False,
    "svg.fonttype": "path", "figure.facecolor": "white",
    "axes.spines.top": False, "axes.spines.right": False,
})
BLUE, GREEN, ORANGE, GRAY = "#2563a6", "#087f73", "#c46a17", "#64748b"


def save(fig, name):
    svg = OUT / f"{name}.svg"
    fig.savefig(svg, bbox_inches="tight")
    svg.write_text("\n".join(line.rstrip() for line in svg.read_text().splitlines()) + "\n")
    stream = BytesIO()
    fig.savefig(stream, format="png", dpi=150, bbox_inches="tight")
    stream.seek(0)
    Image.open(stream).convert("RGB").save(OUT / f"{name}.webp", quality=91)
    plt.close(fig)


def pairwise():
    fig, (ax, side) = plt.subplots(1, 2, figsize=(10, 4.4),
                                  gridspec_kw={"width_ratios": [1.4, 1]})
    values = np.array([[1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 1, 1]])
    ax.imshow(values, cmap=ListedColormap(["#f1f5f9", "#a9d9d0"]),
              vmin=0, vmax=1, aspect="auto")
    for row in range(4):
        for col in range(3):
            ax.text(col, row, "发生" if values[row, col] else "不发生",
                    ha="center", va="center", color="#163640")
    ax.set_xticks(range(3), ["A", "B", "C"])
    ax.set_yticks(range(4), [f"结果 {i}：概率 1/4" for i in range(1, 5)])
    ax.set_title("四个等可能结果 / Four equally likely outcomes", pad=15)
    ax.tick_params(length=0)
    side.axis("off")
    side.text(0.05, 0.83, "每个事件发生于 2 行", fontsize=13)
    side.text(0.05, 0.68, r"$P(A)=P(B)=P(C)=1/2$")
    side.text(0.05, 0.48, "任意两事件共同发生于 1 行", fontsize=12)
    side.text(0.05, 0.35, r"$P(AB)=P(AC)=P(BC)=1/4$")
    side.text(0.05, 0.15, r"$P(ABC)=1/4\ne(1/2)^3$", color=ORANGE, fontsize=13)
    fig.tight_layout(pad=2)
    save(fig, "pairwise-independence")


def discrete():
    fig, axes = plt.subplots(1, 3, figsize=(12, 3.8))
    kb = np.arange(11)
    kp = np.arange(13)
    kg = np.arange(1, 13)
    pmfs = [
        (kb, [comb(10, int(k)) * .3 ** k * .7 ** (10-k) for k in kb],
         r"二项 / Binomial $B(10,0.3)$", BLUE),
        (kp, [np.exp(-3) * 3 ** int(k) / factorial(int(k)) for k in kp],
         r"泊松 / Poisson $\lambda=3$", GREEN),
        (kg, [.4 * .6 ** (k-1) for k in kg],
         r"几何 / Geometric $p=0.4$", ORANGE),
    ]
    for ax, (k, probs, title, color) in zip(axes, pmfs):
        ax.bar(k, probs, width=.65, color=color, alpha=.85)
        ax.set(title=title, xlabel="取值 k / Value", ylabel=r"$P(X=k)$", ylim=(0, .44))
        ax.set_xticks(k[::2])
        ax.grid(axis="y", alpha=.15)
    fig.tight_layout()
    save(fig, "discrete-models")


def cdf_density():
    fig, axes = plt.subplots(2, 2, figsize=(10, 7))
    ax = axes[0, 0]
    ax.bar([0, 1], [.6, .4], width=.18, color=BLUE)
    ax.set(xlim=(-.6, 1.6), ylim=(-.05, 1.08), title="离散 PMF / Bernoulli",
           ylabel=r"$P(X=k)$")
    ax = axes[0, 1]
    for xx, yy in [([-.6, 0], [0, 0]), ([0, 1], [.6, .6]), ([1, 1.6], [1, 1])]:
        ax.plot(xx, yy, color=BLUE, lw=2)
    ax.scatter([0, 1], [.6, 1], color=BLUE, zorder=4)
    ax.scatter([0, 1], [0, .6], facecolors="white", edgecolors=BLUE, zorder=4)
    ax.set(xlim=(-.6, 1.6), ylim=(-.05, 1.08), title="阶梯 CDF / Right-continuous",
           ylabel=r"$F(x)=P(X\leq x)$")
    ax = axes[1, 0]
    ax.plot([-.5, 0, 0, 2, 2, 2.5], [0, 0, .5, .5, 0, 0], color=GREEN, lw=2)
    ax.fill_between([0, 1.2], [0, 0], [.5, .5], color=GREEN, alpha=.2)
    ax.set(xlim=(-.5, 2.5), ylim=(-.05, 1.08), title=r"连续 PDF / $U(0,2)$",
           xlabel="x", ylabel=r"$f(x)$")
    ax.text(.12, .65, r"$P(0<X\leq1.2)=0.6$", fontsize=11)
    ax = axes[1, 1]
    ax.plot([-.5, 0, 2, 2.5], [0, 0, 1, 1], color=GREEN, lw=2)
    ax.scatter([1.2], [.6], color=GREEN)
    ax.plot([1.2, 1.2, -.5], [0, .6, .6], color=GRAY, ls="--", lw=1)
    ax.set(xlim=(-.5, 2.5), ylim=(-.05, 1.08), title="积分得到 CDF / Accumulated area",
           xlabel="x", ylabel=r"$F(x)$")
    for ax in axes.flat:
        ax.grid(alpha=.12)
    fig.tight_layout(pad=2)
    save(fig, "cdf-and-density")


def normal():
    fig, axes = plt.subplots(1, 2, figsize=(11, 4.2))
    x = np.linspace(-5, 6, 600)
    for mu, sigma, color in [(0, 1, BLUE), (2, 1, GREEN), (0, 1.7, ORANGE)]:
        pdf = np.exp(-.5 * ((x-mu)/sigma)**2) / (np.sqrt(2*np.pi) * sigma)
        axes[0].plot(x, pdf, color=color, lw=2,
                     label=fr"$\mu={mu},\ \sigma={sigma}$")
    axes[0].set(title="位置与尺度 / Location and scale", xlabel="x", ylabel="密度 / PDF")
    axes[0].legend(fontsize=10)
    z = np.linspace(-3.8, 3.8, 500)
    pdf = np.exp(-z*z/2) / np.sqrt(2*np.pi)
    axes[1].plot(z, pdf, lw=2, color=BLUE)
    mask = z >= .8
    axes[1].fill_between(z[mask], pdf[mask], color=ORANGE, alpha=.45)
    axes[1].axvline(.8, ls="--", color=ORANGE, lw=1.2)
    axes[1].text(.95, .23, r"$P(Z>0.8)$"+"\n"+r"$=1-\Phi(0.8)$", color=ORANGE)
    axes[1].set(title="标准化后的右尾 / Standard normal tail", xlabel="z", ylabel=r"$\varphi(z)$")
    for ax in axes:
        ax.set_ylim(0, .44)
        ax.grid(alpha=.13)
    fig.tight_layout()
    save(fig, "normal-distribution")


def branches():
    fig, axes = plt.subplots(1, 2, figsize=(11, 4.2))
    x = np.linspace(-1, 2, 400)
    axes[0].plot(x, abs(x), color=BLUE, lw=2)
    axes[0].axhline(.6, color=GREEN, ls="--")
    axes[0].scatter([-.6, .6], [.6, .6], color=GREEN, zorder=4)
    axes[0].axhline(1.5, color=ORANGE, ls="--")
    axes[0].scatter([1.5], [1.5], color=ORANGE, zorder=4)
    axes[0].set(xlim=(-1.15, 2.15), ylim=(-.05, 2.2),
                title=r"$|x|$：仅保留 $-1<x<2$ 内的反解", xlabel="x", ylabel="输出 / Output")
    axes[0].text(-.95, .72, "两个分支 / Two branches", color=GREEN, fontsize=10)
    axes[0].text(-.95, 1.63, "一个分支 / One branch", color=ORANGE, fontsize=10)
    x = np.linspace(0, 1.5*np.pi, 500)
    axes[1].plot(x, np.cos(x), color=BLUE, lw=2)
    axes[1].axhline(-.5, color=GREEN, ls="--")
    axes[1].scatter([2*np.pi/3, 4*np.pi/3], [-.5, -.5], color=GREEN, zorder=4)
    axes[1].axhline(.5, color=ORANGE, ls="--")
    axes[1].scatter([np.pi/3], [.5], color=ORANGE, zorder=4)
    axes[1].set(ylim=(-1.15, 1.15), title=r"$\cos x$：仅保留 $0<x<3\pi/2$ 内的反解",
                xlabel="x", ylabel="输出 / Output")
    axes[1].set_xticks([0, .5*np.pi, np.pi, 1.5*np.pi],
                       ["0", r"$\pi/2$", r"$\pi$", r"$3\pi/2$"])
    for ax in axes:
        ax.grid(alpha=.12)
    fig.tight_layout(pad=2)
    save(fig, "transformation-branches")


def square_axes(ax, xlim=(-.05, 1.08), ylim=(-.05, 1.08)):
    ax.set(xlim=xlim, ylim=ylim, xlabel="x", ylabel="y", aspect="equal")
    ax.grid(alpha=.12)


def support():
    fig, axes = plt.subplots(1, 2, figsize=(10, 4.6))
    for ax in axes:
        ax.add_patch(Polygon([(0, 0), (0, 1), (1, 1)], fc="#dceeea", ec=GREEN, lw=1.5))
        square_axes(ax)
    axes[0].plot([.35, .35], [.35, 1], color=ORANGE, lw=4)
    axes[0].text(.42, .68, r"$x<y<1$", color=ORANGE)
    axes[0].set_title("固定 x：沿 y 积分 / Vertical slice")
    axes[0].text(.04, -.25, r"$f_X(x)=\int_x^1 f(x,y)\,dy$",
                 transform=axes[0].transAxes)
    axes[1].plot([0, .7], [.7, .7], color=BLUE, lw=4)
    axes[1].text(.1, .78, r"$0<x<y$", color=BLUE)
    axes[1].set_title("固定 y：沿 x 积分 / Horizontal slice")
    axes[1].text(.04, -.25, r"$f_Y(y)=\int_0^y f(x,y)\,dx$",
                 transform=axes[1].transAxes)
    fig.tight_layout(pad=2)
    save(fig, "joint-support-and-marginals")


def conditional_regions():
    fig, axes = plt.subplots(1, 3, figsize=(13, 4.7))
    ax = axes[0]
    y = np.linspace(-1, 1, 400)
    ax.fill_betweenx(y, y*y, 1, color="#dceeea")
    ax.plot(y*y, y, color=GREEN, lw=2)
    ax.plot([1, 1], [-1, 1], color=GREEN)
    ax.plot([.25, 1], [.5, .5], color=ORANGE, lw=4)
    ax.scatter([.25, 1], [.5, .5], color=ORANGE)
    ax.text(.05, -.8, r"$x=y^2$", color=GREEN)
    ax.text(.32, .65, r"$Y=1/2$", color=ORANGE)
    square_axes(ax, (-.08, 1.12), (-1.1, 1.1))
    ax.set_title(r"A20：$y^2<x<1$")
    ax = axes[1]
    ax.add_patch(Polygon([(0, 0), (0, 1), (1, 1)], fc="#dceeea", ec=GREEN))
    ax.add_patch(Polygon([(0, 0), (0, 1), (.5, .5)], fc="#f5d6b0", ec=ORANGE, alpha=.9))
    ax.plot([0, 1], [1, 0], ls="--", color=ORANGE)
    ax.text(.03, .66, r"$x+y\leq1$", fontsize=10)
    square_axes(ax)
    ax.set_title("B4：支撑与事件相交")
    ax = axes[2]
    ax.add_patch(Polygon([(1, 2), (1, 4), (2, 4), (2, 3)], fc="#dceeea", ec=GREEN))
    ax.plot([1, 1.7], [2.7, 2.7], color=BLUE, lw=4)
    ax.plot([1, 2], [3.5, 3.5], color=ORANGE, lw=4)
    ax.axhline(3, color=GRAY, lw=1, ls="--")
    ax.text(1.04, 2.45, r"$x<y-1$", color=BLUE)
    ax.text(1.08, 3.7, r"$x<2$", color=ORANGE)
    square_axes(ax, (.8, 2.2), (1.8, 4.2))
    ax.set_title("B5：y=3 处积分上限改变")
    fig.tight_layout(pad=2)
    save(fig, "conditional-regions")


def bivariate():
    fig, axes = plt.subplots(1, 3, figsize=(11, 4))
    grid = np.linspace(-3, 3, 200)
    x, y = np.meshgrid(grid, grid)
    levels = [.01, .025, .05, .08, .12, .16, .2]
    for ax, rho in zip(axes, [-.6, 0, .6]):
        density = np.exp(-(x*x-2*rho*x*y+y*y)/(2*(1-rho*rho))) / (
            2*np.pi*np.sqrt(1-rho*rho))
        ax.contour(x, y, density, levels=levels, cmap="viridis")
        ax.axhline(0, color=GRAY, lw=.6, alpha=.5)
        ax.axvline(0, color=GRAY, lw=.6, alpha=.5)
        square_axes(ax, (-3, 3), (-3, 3))
        ax.set_title(fr"$\rho={rho}$" + ("\n独立 / Independent" if rho == 0 else "\n不独立 / Dependent"))
    fig.suptitle("二维标准正态：相同边际，不同联合分布", y=1.05, fontsize=13)
    fig.tight_layout()
    save(fig, "bivariate-normal")


if __name__ == "__main__":
    for draw in [pairwise, discrete, cdf_density, normal, branches,
                 support, conditional_regions, bivariate]:
        draw()
