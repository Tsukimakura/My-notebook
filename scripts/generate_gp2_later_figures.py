#!/usr/bin/env python3
"""Original figures for General Physics II, lectures 7–15 (CC BY 4.0).

Optional authoring dependencies: NumPy, Matplotlib, Pillow. Run from any cwd;
the committed WebP files are sufficient to build the documentation site.
"""

from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Arc, Circle, Rectangle
import numpy as np
from PIL import Image


DEST = Path(__file__).resolve().parents[1] / "docs/数理基础/general-physics-ii/assets"
BLUE, RED, GREEN, GRAY = "#2367a1", "#c43c39", "#268364", "#637181"
plt.rcParams.update({"font.size": 11, "figure.facecolor": "white",
                     "axes.spines.top": False, "axes.spines.right": False})


def save(fig, name):
    DEST.mkdir(parents=True, exist_ok=True)
    png = DEST / (name + ".png")
    fig.savefig(png, dpi=160, bbox_inches="tight")
    with Image.open(png) as im:
        im.convert("RGB").save(png.with_suffix(".webp"), quality=92)
    png.unlink()
    plt.close(fig)
    print(name)


def arrow(ax, a, b, color=BLUE, **kw):
    props = dict(arrowstyle="->", color=color, lw=1.7)
    props.update(kw)
    ax.annotate("", xy=b, xytext=a, arrowprops=props)


def clean(ax, title, xlim=(-2, 2), ylim=(-1.5, 1.5)):
    ax.set(title=title, xlim=xlim, ylim=ylim, aspect="equal")
    ax.axis("off")


def main():
    t = np.linspace(0, 5, 400)
    fig, axes = plt.subplots(1, 2, figsize=(10, 3.6))
    axes[0].plot(t, 1-np.exp(-t), label=r"$q/(C\mathcal{E})$")
    axes[0].plot(t, np.exp(-t), label=r"$i/(\mathcal{E}/R)$")
    axes[0].set(xlabel=r"$t/(RC)$", title="Charging: initial q = 0")
    axes[0].legend()
    axes[1].plot(t, np.exp(-t), label=r"$q/q_0$")
    axes[1].plot(t, np.exp(-2*t), label=r"$U/U_0$")
    axes[1].set(xlabel=r"$t/(RC)$", title="Discharging: energy falls twice as fast")
    axes[1].legend()
    save(fig, "rc-transients-energy")

    fig, axes = plt.subplots(1, 2, figsize=(10, 3.8))
    for ax, title, labels in [(axes[0], "Polarization in a filled capacitor", True),
                              (axes[1], "Fixed charge vs fixed voltage", False)]:
        if labels:
            ax.add_patch(Rectangle((-.95, -.7), 1.9, 1.4, fc="#e5f0ea", ec=GREEN))
            ax.plot([-1.15, 1.15], [.9, .9], color=RED, lw=4)
            ax.plot([-1.15, 1.15], [-.9, -.9], color=BLUE, lw=4)
            ax.text(-1.1, 1.1, "+ free charge", color=RED)
            ax.text(-1.1, -1.25, "- free charge", color=BLUE)
            for x in [-.6, 0, .6]:
                ax.text(x, .48, "-", color=BLUE, ha="center")
                ax.text(x, -.58, "+", color=RED, ha="center")
                arrow(ax, (x, .26), (x, -.3), GREEN)
            ax.text(1.05, 0, "P", color=GREEN)
            ax.text(-1.75, 0, "E", color=BLUE)
            arrow(ax, (-1.4, .4), (-1.4, -.4))
            clean(ax, title)
        else:
            ax.text(.02, .8, r"$C=\kappa C_0$", transform=ax.transAxes, fontsize=18)
            ax.text(.02, .52, r"Isolated: $q=q_0$, $V=V_0/\kappa$", transform=ax.transAxes)
            ax.text(.02, .3, r"Battery attached: $V=V_0$, $q=\kappa q_0$", transform=ax.transAxes)
            ax.text(.02, .08, "Bound charges oppose the original field;\nthe electrical connection sets what stays fixed.", transform=ax.transAxes)
            ax.set_title(title)
            ax.axis("off")
    save(fig, "dielectric-polarization")

    fig = plt.figure(figsize=(10, 4))
    ax = fig.add_subplot(121, projection="3d")
    s = np.linspace(0, 5*np.pi, 500)
    ax.plot(np.cos(s), np.sin(s), s/4, color=BLUE)
    ax.quiver(0, 0, 0, 0, 0, 4.2, color=RED, arrow_length_ratio=.08)
    ax.text(0, 0, 4.35, "B")
    ax.set(xlabel="x", ylabel="y", zlabel="z", title="Helix: constant speed in uniform B")
    ax = fig.add_subplot(122)
    ax.add_patch(Rectangle((-1.6, -.65), 3.2, 1.3, fc="#edf2f7", ec=GRAY))
    arrow(ax, (-1.1, 0), (.8, 0))
    ax.text(-1.2, .14, r"$J_x>0$")
    ax.text(.85, .13, r"$\odot B_z$")
    for x in [-1, -.3, .4, 1.1]:
        ax.text(x, .45, "-", color=BLUE)
        ax.text(x, -.53, "+", color=RED)
    arrow(ax, (0, -.4), (0, .38), RED)
    ax.text(.13, -.22, r"$E_y>0$")
    ax.text(-1.6, -1.1, r"Positive carriers: $E_y/(J_xB_z)=1/(nq_c)$")
    clean(ax, "Hall balance: E = -v_d × B", (-2, 2), (-1.4, 1.4))
    save(fig, "magnetic-motion-hall")

    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    ax = axes[0]
    for r in [.45, .9, 1.35]:
        ax.add_patch(Circle((0, 0), r, fill=False, color=BLUE))
        arrow(ax, (r, 0), (r-.05, .25))
    ax.text(0, 0, r"$\odot i$", ha="center", va="center", fontsize=18)
    clean(ax, "Current out of page: counterclockwise B")
    r = np.linspace(0, 3, 400)
    b = np.where(r <= 1, r, 1/np.maximum(r, 1e-8))
    axes[1].plot(r, b, color=BLUE)
    axes[1].axvline(1, ls=":", color=GRAY)
    axes[1].set(xlabel=r"$r/R$", ylabel=r"$B/[\mu_0 i/(2\pi R)]$", title="Solid wire: uniform current density")
    save(fig, "current-magnetic-fields")

    fig, axes = plt.subplots(1, 2, figsize=(10, 3.6))
    z = np.linspace(-5, 5, 500)
    axes[0].plot(z, 1/(1+z*z)**1.5, color=BLUE)
    axes[0].set(xlabel=r"$z/R$", ylabel=r"$B/[\mu_0Ni/(2R)]$", title="Circular coil: exact axial field")
    length = 6
    b = .5*((z+length/2)/np.sqrt(1+(z+length/2)**2)-(z-length/2)/np.sqrt(1+(z-length/2)**2))
    axes[1].plot(z, b, color=BLUE)
    for end in [-3, 3]: axes[1].axvline(end, color=GRAY, ls=":")
    axes[1].set(xlabel=r"$z/R$ (ends at $\pm3R$)", ylabel=r"$B/(\mu_0ni)$", title="Finite solenoid: length = 6R")
    save(fig, "coil-solenoid-axis")

    fig, axes = plt.subplots(1, 2, figsize=(10, 3.6))
    x = np.linspace(-3, 3, 500)
    axes[0].plot(x, np.tanh(x), label=r"$M/(n\mu)=\tanh x$")
    axes[0].plot(x, x, ls=":", color=GRAY, label="Weak-field tangent")
    axes[0].set(xlabel=r"$x=\mu B/(k_BT)$", ylim=(-1.2, 1.2), title="Independent two-state moments")
    axes[0].legend(fontsize=9)
    axes[1].plot(x, np.tanh(1.8*(x-.6)), color=BLUE)
    axes[1].plot(x, np.tanh(1.8*(x+.6)), color=RED)
    axes[1].axhline(0, color=GRAY, lw=.6)
    axes[1].axvline(0, color=GRAY, lw=.6)
    axes[1].set(xlabel="Applied H (schematic units)", ylabel="M (schematic units)", title="Ferromagnetic hysteresis: schematic")
    save(fig, "magnetic-response")

    fig, axes = plt.subplots(1, 2, figsize=(10, 3.8))
    ax = axes[0]
    ax.add_patch(Rectangle((-2, -1.2), 2, 2.4, fc="#e6edf5", ec="none"))
    for x in [-1.7, -1.1, -.4]:
        for y in [-.8, 0, .8]: ax.text(x, y, "×", color=BLUE, ha="center", va="center")
    ax.add_patch(Rectangle((-.7, -.65), 2, 1.3, fill=False, lw=2, ec=GRAY))
    arrow(ax, (.3, .65), (.9, .65), RED)
    arrow(ax, (1.3, .4), (1.3, -.2), RED)
    arrow(ax, (.4, -.65), (-.2, -.65), RED)
    arrow(ax, (-.7, -.3), (-.7, .3), RED)
    arrow(ax, (-.7, 0), (-1.5, 0), GREEN)
    arrow(ax, (.8, .95), (1.65, .95))
    ax.text(1.2, 1.05, "v")
    ax.text(-1.8, 1.05, "B into page")
    ax.text(-1.8, -1.5, "Drag opposes motion; induced flux opposes its change.", fontsize=9)
    clean(ax, "A resistive loop leaving a magnetic field", (-2, 2), (-1.65, 1.5))
    ax = axes[1]
    ax.add_patch(Circle((0, 0), .75, fc="#e6edf5", ec=GRAY))
    for r in [.45, 1.1]:
        ax.add_patch(Circle((0, 0), r, fill=False, ls="--", ec=BLUE))
        arrow(ax, (r, 0), (r-.05, -.25), RED)
    ax.text(0, 0, r"$\odot\ \dot B>0$", ha="center", va="center")
    ax.text(-1.6, -1.45, "Clockwise induced E exists without a conducting ring.", fontsize=9)
    clean(ax, "Changing flux creates circulation of E", (-2, 2), (-1.65, 1.5))
    save(fig, "faraday-induction")

    fig, axes = plt.subplots(1, 2, figsize=(10, 3.6))
    axes[0].plot(t, 1-np.exp(-t), label=r"$i/(\mathcal{E}/R)=V_R/\mathcal{E}$")
    axes[0].plot(t, np.exp(-t), label=r"$V_L/\mathcal{E}$")
    axes[0].set(xlabel=r"$t/(L/R)$", title="RL switch-on: initial i = 0")
    axes[0].legend(fontsize=9)
    ax = axes[1]
    for cx in [-.9, .9]:
        for offset in [-.15, 0, .15]:
            theta = np.linspace(0, 2*np.pi, 100)
            ax.plot(cx+offset+.22*np.cos(theta), .8*np.sin(theta), color=BLUE if cx<0 else RED)
    for y in [-.3, 0, .3]: arrow(ax, (-1, y), (1, y), GREEN)
    ax.text(-1.6, 1, "Coil 1")
    ax.text(.5, 1, "Coil 2")
    ax.text(-1.6, -1.3, r"$\Lambda_{21}=Mi_1,\quad\mathcal{E}_2=-M\,di_1/dt$")
    clean(ax, "Mutual induction: linked flux, no wire contact")
    save(fig, "rl-mutual-inductance")

    fig, ax = plt.subplots(figsize=(7.5, 3.7))
    tt = np.linspace(0, 12, 800)
    for beta, label in [(.18, "Underdamped"), (1, "Critical"), (1.8, "Overdamped")]:
        if beta<1:
            w=np.sqrt(1-beta**2);q=np.exp(-beta*tt)*(np.cos(w*tt)+beta/w*np.sin(w*tt))
        elif beta==1:q=(1+tt)*np.exp(-tt)
        else:
            a=np.sqrt(beta**2-1)
            q=np.exp(-beta*tt)*(np.cosh(a*tt)+beta/a*np.sinh(a*tt))
        ax.plot(tt,q,label=label)
    ax.axhline(0, color=GRAY, lw=.6)
    ax.set(xlabel=r"$\omega_0t$", ylabel=r"$q/q(0)$", title="Free RLC response: same initial charge, zero initial current")
    ax.legend()
    save(fig,"rlc-damping")

    fig, ax = plt.subplots(figsize=(7.5, 3.7))
    w = np.linspace(.2, 2, 800)
    for rr in [.2,.6,1.2]:
        ax.plot(w,1/np.sqrt(rr**2+(w-1/w)**2),label=f"R√(C/L) = {rr}")
    ax.axvline(1,ls=":",color=GRAY)
    ax.set(xlabel=r"$\Omega/\omega_0$",ylabel=r"$I_m/[\mathcal{E}_m\sqrt{C/L}]$",title="Series RLC: current resonance at Ω = ω₀")
    ax.legend()
    save(fig,"rlc-resonance")

    fig, axes=plt.subplots(1,2,figsize=(10,3.6))
    x=np.linspace(0,2*np.pi,400)
    axes[0].plot(x,np.cos(x),label=r"$E_y/E_m$")
    axes[0].plot(x,np.cos(x),ls="--",label=r"$cB_z/E_m$")
    axes[0].set(xlabel=r"Phase $kx-\omega t$",title="Vacuum plane wave: E and B are in phase")
    axes[0].legend()
    axes[1].plot(x,np.cos(x)**2,label=r"$u_E/(\epsilon_0E_m^2/2)$")
    axes[1].plot(x,np.cos(x)**2,ls="--",label=r"$u_B/(\epsilon_0E_m^2/2)$")
    axes[1].set(xlabel=r"Phase $kx-\omega t$",title="Equal energy densities at every phase")
    axes[1].legend(fontsize=9)
    save(fig,"plane-wave-energy")

    fig, axes=plt.subplots(1,2,figsize=(10,4))
    for ax, n1,n2,deg,title in [(axes[0],1,1.5,40,"Refraction toward the normal"),
                               (axes[1],1.5,1,55,"Total internal reflection")]:
        ax.axhspan(-1.6,0,color="#e5eff5")
        ax.axhline(0,color=GRAY)
        ax.axvline(0,color=GRAY,ls="--",lw=.7)
        th=np.deg2rad(deg);a=np.array([np.sin(th),np.cos(th)])*1.7
        arrow(ax,(-a[0],a[1]),(0,0),BLUE)
        arrow(ax,(0,0),(a[0],a[1]),RED)
        ax.add_patch(Arc((0,0),1,1,theta1=90,theta2=90+deg,color=BLUE))
        ax.text(-.6,.5,r"$\theta_i$")
        ax.text(-1.9,1.4,f"n₁ = {n1}")
        ax.text(-1.9,-1.4,f"n₂ = {n2}")
        if n1*np.sin(th)<n2:
            tr=np.arcsin(n1*np.sin(th)/n2)
            arrow(ax,(0,0),(1.7*np.sin(tr),-1.7*np.cos(tr)),GREEN)
            ax.text(.1,-.55,r"$\theta_t$")
        else:
            ax.text(-1.3,-.7,"No propagating\ntransmitted ray",color=GREEN)
        clean(ax,title,(-2,2),(-1.65,1.65))
    save(fig,"reflection-refraction")


if __name__ == "__main__":
    main()
