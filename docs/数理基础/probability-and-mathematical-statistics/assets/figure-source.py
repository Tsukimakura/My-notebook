"""Reproduce the six original illustrations; no separate open license declared.

Attribution: Tsukimakura's notebook. Conceptual sources: source-manifest.json.
Dependencies for regeneration only: numpy, matplotlib, pillow, Noto Sans CJK.
"""

from pathlib import Path
from io import BytesIO

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Circle, Rectangle, FancyBboxPatch
from matplotlib.font_manager import FontProperties
import numpy as np
from PIL import Image

OUT = Path(__file__).resolve().parent
FONT = "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc"
if Path(FONT).exists():
    from matplotlib import font_manager

    font_manager.fontManager.addfont(FONT)
    plt.rcParams["font.family"] = FontProperties(fname=FONT).get_name()
plt.rcParams.update({"font.size": 12, "axes.unicode_minus": False,
                     "svg.fonttype": "path", "figure.facecolor": "white"})
BLUE, GREEN, ORANGE, GRAY = "#2563a6", "#087f73", "#c46a17", "#64748b"


def save(fig, name):
    fig.savefig(OUT / (name + ".svg"), bbox_inches="tight")
    svg = OUT / (name + ".svg")
    svg.write_text("\n".join(line.rstrip() for line in svg.read_text().splitlines()) + "\n")
    raw = BytesIO()
    fig.savefig(raw, format="png", dpi=150, bbox_inches="tight")
    raw.seek(0)
    Image.open(raw).convert("RGB").save(OUT / (name + ".webp"), quality=92)
    plt.close(fig)


def event_operations():
    fig, axes = plt.subplots(2, 2, figsize=(11, 7))
    x, y = np.meshgrid(np.linspace(0, 4, 500), np.linspace(0, 2.7, 340))
    aa = (x - 1.55) ** 2 + (y - 1.35) ** 2 <= 0.9 ** 2
    bb = (x - 2.45) ** 2 + (y - 1.35) ** 2 <= 0.9 ** 2
    labels = [(aa | bb, r"$A\cup B$：至少一个发生 / Union"),
              (aa & bb, r"$A\cap B$：同时发生 / Intersection"),
              (aa & ~bb, r"$A-B$：A 发生且 B 不发生 / Difference"),
              (~aa, r"$A^c$：A 不发生 / Complement")]
    from matplotlib.colors import ListedColormap

    for ax, (region, title) in zip(axes.flat, labels):
        ax.pcolormesh(x, y, region.astype(int), cmap=ListedColormap(["#f8fafc", "#b8ddd6"]),
                      vmin=0, vmax=1, shading="auto", rasterized=True)
        ax.add_patch(Rectangle((0, 0), 4, 2.7, fill=False, lw=1.5, ec=GRAY))
        ax.add_patch(Circle((1.55, 1.35), 0.9, fill=False, ec=BLUE, lw=2))
        ax.add_patch(Circle((2.45, 1.35), 0.9, fill=False, ec=ORANGE, lw=2))
        ax.text(1.05, 1.35, "A", color=BLUE, fontsize=18, ha="center")
        ax.text(2.95, 1.35, "B", color=ORANGE, fontsize=18, ha="center")
        ax.text(0.15, 2.35, "S", color=GRAY)
        ax.set(title=title, xlim=(-0.05, 4.05), ylim=(-0.05, 2.75), aspect="equal")
        ax.axis("off")
    fig.tight_layout(pad=2)
    save(fig, "event-operations")


def frequency():
    fig, ax = plt.subplots(figsize=(10, 4.7))
    n = np.arange(1, 5001)
    rng = np.random.default_rng(20261006)
    for i, color in enumerate([BLUE, GREEN, ORANGE]):
        heads = rng.integers(0, 2, n.size)
        ax.plot(n, np.cumsum(heads) / n, lw=1.3, alpha=0.85, color=color,
                label=f"模拟 {i + 1} / Run {i + 1}")
    ax.axhline(0.5, ls="--", lw=1.5, color="#334155", label=r"$P(H)=0.5$")
    ax.set(xscale="log", xlim=(1, 5000), ylim=(-0.03, 1.03),
           xlabel="累计试验次数 n（对数刻度 / log scale）",
           ylabel=r"正面累计频率 $f_n(H)$",
           title="频率围绕概率波动：更多试验体现稳定趋势")
    ax.grid(alpha=0.15)
    ax.legend(loc="upper right", fontsize=10)
    fig.tight_layout()
    save(fig, "frequency-stability")


def birthday():
    fig, ax = plt.subplots(figsize=(9, 4.8))
    n = np.arange(1, 81)
    no_collision = np.cumprod(1 - np.arange(80) / 365)
    prob = 1 - no_collision
    ax.plot(n, prob, lw=2.5, color=BLUE)
    ax.axhline(0.5, ls="--", color=GRAY, lw=1)
    for k, shift in [(23, (8, -38)), (64, (-110, -40))]:
        v = prob[k - 1]
        ax.scatter([k], [v], color=ORANGE, zorder=3)
        ax.annotate(f"n={k}, P≈{v:.4f}", (k, v), xytext=shift,
                    textcoords="offset points", arrowprops={"arrowstyle": "-", "color": GRAY})
    ax.set(xlim=(1, 80), ylim=(0, 1.06), xlabel="人数 n / Number of people",
           ylabel="至少两人同生日的概率",
           title="生日问题：365 个日期，均匀且日期序列等可能")
    ax.grid(alpha=0.15)
    fig.tight_layout()
    save(fig, "birthday-probability")


def buffon():
    fig, axes = plt.subplots(1, 2, figsize=(11, 4.6))
    a, b, phi, dist = 1, 0.7, 0.9, 0.20
    ax = axes[0]
    for h in [0, a]:
        ax.plot([-0.6, 0.6], [h, h], color=BLUE, lw=2)
    dx, dy = b / 2 * np.cos(phi), b / 2 * np.sin(phi)
    ax.plot([-dx, dx], [dist - dy, dist + dy], color=ORANGE, lw=3)
    ax.scatter([0], [dist], color=ORANGE, zorder=4)
    ax.text(-0.12, dist + 0.1, "M", color=ORANGE)
    ax.annotate("", (0, 0), (0, dist), arrowprops={"arrowstyle": "<->", "color": GRAY})
    ax.text(-0.10, dist / 2, "x", va="center")
    ax.plot([-0.02, 0.48], [dist, dist], ls="--", color=GRAY, lw=1)
    ax.plot([dx, dx], [dist, dist + dy], ls="--", color=GRAY)
    ax.annotate("", (0.5, 0), (0.5, a), arrowprops={"arrowstyle": "<->", "color": BLUE})
    ax.text(0.52, 0.5, "a", color=BLUE, va="center")
    ax.text(dx + 0.04, dist + dy / 2, r"$\frac{b}{2}\sin\varphi$", va="center")
    angles = np.linspace(0, phi, 40)
    ax.plot(0.12 * np.cos(angles), dist + 0.12 * np.sin(angles), color=GRAY)
    ax.text(0.14, dist + 0.04, r"$\varphi$")
    ax.set(xlim=(-0.45, 0.78), ylim=(-0.15, 1.15), aspect="equal",
           title="物理空间：半针投影 ≥ 中点距离")
    ax.axis("off")
    ax = axes[1]
    angles = np.linspace(0, np.pi, 300)
    curve = b / 2 * np.sin(angles)
    ax.fill_between(angles, 0, curve, color="#b8ddd6", label="相交事件 A")
    ax.plot(angles, curve, color=GREEN, lw=2)
    ax.add_patch(Rectangle((0, 0), np.pi, a / 2, fill=False, ec=BLUE, lw=2))
    ax.text(np.pi / 2, 0.17, "A", ha="center", color=GREEN, fontsize=18)
    ax.text(0.15, 0.43, "S", color=BLUE, fontsize=16)
    ax.text(np.pi / 2, 0.37, r"$x=(b/2)\sin\varphi$", ha="center")
    ax.set(xlim=(0, np.pi), ylim=(0, 0.55), xlabel=r"方向角 $\varphi$",
           ylabel="距离 x", xticks=[0, np.pi / 2, np.pi],
           xticklabels=["0", r"$\pi/2$", r"$\pi$"], yticks=[0, b / 2, a / 2],
           yticklabels=["0", "b/2", "a/2"], title="参数空间：阴影面积 / 矩形面积")
    fig.tight_layout(pad=2)
    save(fig, "buffon-needle")


def tree():
    fig, ax = plt.subplots(figsize=(12, 6))
    ax.set(xlim=(0, 12), ylim=(-0.4, 6.3))
    ax.axis("off")
    ax.text(0.3, 3, "S", ha="center", va="center", fontsize=20, color=BLUE)
    for i, (label, q, y) in enumerate([("飞机 / Plane", 0.1, 5),
                                      ("火车 / Train", 0.2, 3),
                                      ("汽车 / Car", 0.3, 1)]):
        ax.plot([0.65, 3], [3, y], color=GRAY)
        ax.text(1.75, (3 + y) / 2 + 0.15, "1/3", color=BLUE)
        ax.text(3.15, y, label, va="center", fontsize=13)
        for late, dest, probability in [(True, y + 0.45, q), (False, y - 0.45, 1 - q)]:
            col = GREEN if late else GRAY
            ax.plot([4.8, 6.8], [y, dest], color=col, lw=1.7)
            ax.text(5.6, (y + dest) / 2 + (0.16 if late else -0.27),
                    f"{probability:.1f}", color=col)
            ax.text(6.95, dest, "迟到 / Late" if late else "未迟到 / On time",
                    va="center", color=col, fontsize=11)
            ax.text(9.25, dest, f"{probability / 3:.4f}", va="center", color=col)
        ax.text(10.6, y + 0.45, f"{i + 1}/6", va="center", color=GREEN, fontsize=14)
    ax.text(9.25, 6, "联合概率", ha="left", fontsize=12)
    ax.text(10.6, 6, "已知迟到后的后验", ha="left", fontsize=12)
    ax.text(0.5, -0.15, "沿路径乘：P(方式 ∩ 迟到) = (1/3) × P(迟到 | 方式)"
            "      跨路径加：P(迟到) = 0.2", fontsize=12, color=BLUE)
    ax.set_title("全概率与贝叶斯：先求路径联合概率，再按观测归一化", pad=18)
    fig.tight_layout()
    save(fig, "total-probability-tree")


def monty():
    fig, ax = plt.subplots(figsize=(11, 6.5))
    ax.set(xlim=(0, 11), ylim=(-0.4, 6.4))
    ax.axis("off")
    ax.text(0.15, 6, "初选都是 1 号门；主持人总打开未选的羊门", fontsize=15)
    for car, y in [(1, 4.6), (2, 2.8), (3, 1.0)]:
        opened = 2 if car == 3 else 3
        switched = 3 if opened == 2 else 2
        ax.text(0.2, y + 0.25, f"车在 {car} 号门\n先验 1/3", va="center", fontsize=12)
        for door in range(1, 4):
            x = 2.1 + (door - 1) * 1.8
            ax.add_patch(FancyBboxPatch((x, y - 0.4), 1.2, 1.05,
                         boxstyle="round,pad=0.04", facecolor="#f8fafc",
                         ec=BLUE if door == 1 else GRAY, lw=2 if door == 1 else 1))
            ax.text(x + 0.6, y + 0.31, f"Door {door}", ha="center", fontsize=11)
            ax.text(x + 0.6, y - 0.05, "Car / 车" if door == car else "Goat / 羊",
                    ha="center", color=ORANGE if door == car else GRAY, fontsize=11)
            if door == opened:
                ax.text(x + 0.6, y - 0.68, "主持人打开", ha="center", color=GRAY, fontsize=10)
        won = switched == car
        ax.text(8.0, y + 0.20, f"换至 {switched} 号门", color=GREEN, fontsize=13)
        ax.text(8.0, y - 0.18, "成功 / Win" if won else "失败 / Lose",
                color=GREEN if won else ORANGE, fontsize=13)
    ax.text(0.2, -0.16, "原先选错的两种情形，换门都成功 → 总体成功概率 2/3。"
            "车在 1 号门时，图示为主持人开 3 号门的一种情形。", fontsize=11, color=BLUE)
    fig.tight_layout()
    save(fig, "monty-hall")


if __name__ == "__main__":
    for draw in [event_operations, frequency, birthday, buffon, tree, monty]:
        draw()
