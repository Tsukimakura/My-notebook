#!/usr/bin/env python3
"""Reproduce the GP II homework diagrams and computed plots.

Optional authoring dependencies: NumPy, Matplotlib, Pillow. Circuit/geometry
redraws follow the sources listed in homework/assets/README.md; computed plots
are original CC BY 4.0. Committed WebP assets suffice for the website build.
"""

from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Circle, Polygon, Rectangle
import numpy as np
from PIL import Image


DEST = Path(__file__).resolve().parents[1] / "docs/数理基础/general-physics-ii/homework/assets"
BLUE, RED, GREEN, GRAY = "#2367a1", "#ba3838", "#26755a", "#596773"
plt.rcParams.update({"font.size": 11, "figure.facecolor": "white",
                     "axes.spines.top": False, "axes.spines.right": False})


def save(fig, name):
    DEST.mkdir(parents=True, exist_ok=True)
    png = DEST / (name + ".png")
    fig.savefig(png, dpi=170, bbox_inches="tight")
    with Image.open(png) as im:
        im.convert("RGB").save(png.with_suffix(".webp"), quality=92)
    png.unlink()
    plt.close(fig)
    print(name)


def line(ax, a, b, **kwargs):
    ax.plot([a[0], b[0]], [a[1], b[1]], color=GRAY, lw=1.7, **kwargs)


def arrow(ax, a, b, color=BLUE):
    ax.annotate("", xy=b, xytext=a,
                arrowprops={"arrowstyle": "->", "color": color, "lw": 1.7})


def component(ax, a, b, kind, label, offset=.28):
    a, b = np.array(a, float), np.array(b, float)
    u = (b-a) / np.linalg.norm(b-a)
    v = np.array([-u[1], u[0]])
    c = (a+b)/2
    line(ax, a, c-.32*u)
    line(ax, c+.32*u, b)
    if kind == "r":
        pts = [c+x*u+y*v for x, y in [(-.32, -.12), (.32, -.12), (.32, .12), (-.32, .12)]]
        ax.add_patch(Polygon(pts, closed=True, fc="white", ec=GRAY, lw=1.6))
    elif kind in ("c", "battery"):
        for sign in (-1, 1):
            size = .22 if kind == "c" or sign == 1 else .12
            q = c+sign*.075*u
            line(ax, q-size*v, q+size*v)
        # Leads terminate at the plates rather than at the generic component gap.
        line(ax, c-.32*u, c-.075*u)
        line(ax, c+.075*u, c+.32*u)
        if kind == "battery":
            q = c+.21*u-.17*v
            ax.text(*q, "+", ha="center", va="center", color=RED, fontsize=11)
    elif kind == "l":
        t = np.linspace(0, 1, 180)
        pts = c[:, None]+u[:, None]*(.64*t-.32)+v[:, None]*(.12*(1-np.cos(8*np.pi*t)))
        ax.plot(*pts, color=GRAY, lw=1.7)
    q = c+offset*v
    ax.text(*q, label, ha="center", va="center", color=BLUE,
            bbox={"facecolor": "white", "edgecolor": "none", "pad": .5})


def clean(ax, title, xlim, ylim):
    ax.set(title=title, xlim=xlim, ylim=ylim, aspect="equal")
    ax.axis("off")


def circuits():
    fig, ax = plt.subplots(figsize=(7, 6))
    a, b, c, d = (0, 1.8), (4, 1.8), (2, 3.4), (2, .2)
    for start, end, name, offset in [(a,c,"$r_1$",.27), (c,b,"$r_3$",.27),
                                     (a,d,"$r_2$",-.27), (d,b,"$r_4$",-.27),
                                     (c,d,"$r_g$",.28)]:
        component(ax, start, end, "r", name, offset)
    line(ax, a, (0,-1)); line(ax, b, (4,-1))
    component(ax, (0,-1), (2,-1), "battery", r"$\mathcal{E}$")
    component(ax, (2,-1), (4,-1), "r", "$r_0$")
    for name, point, dx, dy in [("A",a,-.23,0), ("B",b,.23,0),
                                ("C",c,0,.25), ("D",d,0,-.26)]:
        ax.plot(*point, "o", color=GRAY, ms=4)
        ax.text(point[0]+dx, point[1]+dy, name, ha="center", va="center")
    arrow(ax, (1.65,2.55), (1.65,1.45), RED)
    ax.text(1.45,2,"$I$", color=RED)
    clean(ax, "Ch. 7, Ex. 3: positive bridge current C to D", (-.5,4.5), (-1.5,4))
    save(fig, "wheatstone-bridge")

    fig, ax = plt.subplots(figsize=(8,4.6))
    line(ax, (0,0), (0,2.6)); line(ax, (5,.0), (5,2.6))
    component(ax, (0,2.6), (2.3,2.6), "c", "$C$")
    ax.text(1.42,2.28,"+", color=RED)
    component(ax, (2.3,2.6), (5,2.6), "r", "$r_3$")
    component(ax, (0,1.3), (5,1.3), "r", "$r_2$")
    component(ax, (0,0), (2,0), "battery", r"$\mathcal{E}$")
    component(ax, (2,0), (4,0), "r", "$r_1$")
    line(ax, (4,0), (4.2,0)); line(ax, (4.2,0), (4.65,.27)); line(ax, (4.8,0), (5,0))
    ax.plot([4.2,4.8],[0,0],"o",color=GRAY,ms=3)
    ax.text(4.5,-.38,"close at t = 0",ha="center",fontsize=9)
    ax.text(-.24,1.3,"A",ha="center"); ax.text(5.24,1.3,"B",ha="center")
    arrow(ax, (4.4,3.15), (3.1,3.15)); ax.text(3.75,3.3,r"$i=\dot q$",ha="center",color=BLUE)
    clean(ax,"Ch. 7, Ex. 5: initially uncharged capacitor",(-.5,5.5),(-.65,3.7))
    save(fig,"rc-network")

    fig, ax = plt.subplots(figsize=(8,4.8))
    ax.add_patch(Circle((0,1.2),.4,fc="white",ec=GRAY,lw=1.7))
    t=np.linspace(-.27,.27,80); ax.plot(t,1.2+.12*np.sin(2*np.pi*t/.36),color=BLUE,lw=1.6)
    line(ax,(0,1.6),(0,2.8)); line(ax,(0,.8),(0,0))
    component(ax,(0,2.8),(1.8,2.8),"c",r"$3\,\mu\mathrm{F}$")
    component(ax,(1.8,2.8),(3.6,2.8),"l",r"$0.2\,\mathrm{H}$")
    line(ax,(3.6,2.8),(5,2.8)); line(ax,(0,0),(5,0))
    component(ax,(3.6,0),(3.6,2.8),"l",r"$1\,\mathrm{H}$",.46)
    component(ax,(5,0),(5,2.8),"r",r"$100\,\Omega$",-.56)
    ax.text(-.58,1.45,r"$\mathcal{E}_m=150\,\mathrm{V}$",ha="right",color=BLUE)
    ax.text(-.58,.94,"60 Hz",ha="right",color=BLUE)
    clean(ax,"Ch. 13, Ex. 2: peak phasors",(-2.5,6.1),(-.35,3.5))
    save(fig,"ac-network")


def plots():
    t=np.linspace(0,.020,501)
    fig, axes=plt.subplots(2,1,figsize=(8,5),sharex=True)
    axes[0].plot(1000*t,2*np.sin(100*np.pi*t),color=BLUE,lw=2)
    axes[0].set(ylabel="Solenoid current (A)",title="Ch. 11, Ex. 3: one period, T = 20 ms")
    axes[1].plot(1000*t,-4.464903841963173*np.cos(100*np.pi*t),color=RED,lw=2)
    axes[1].set(ylabel="Induced current (mA)",xlabel="Time (ms)",xticks=[0,5,10,15,20])
    for ax in axes: ax.axhline(0,color=GRAY,lw=.7); ax.grid(alpha=.2)
    fig.tight_layout(); save(fig,"induced-current-waveforms")

    fig,ax=plt.subplots(figsize=(7,3.8))
    x=np.linspace(0,1,151); y=np.linspace(1,4,300)
    ax.plot(x,x,color=BLUE,lw=2,label=r"Inside: $E/E(R)=r/R$")
    ax.plot(y,1/y,color=RED,lw=2,label=r"Outside: $E/E(R)=R/r$")
    ax.axvline(1,color=GRAY,ls="--",lw=1)
    ax.plot(1,1,"o",color=GREEN); ax.text(1.12,1.0,"maximum at r = R",color=GREEN)
    ax.set(xlabel="$r/R$",ylabel="$E(r,t)/E(R,t)$",ylim=(0,1.18),
           title="Ch. 11, Ex. 4: field magnitude at fixed time")
    ax.legend(loc="upper right",bbox_to_anchor=(1,.88)); ax.grid(alpha=.18)
    save(fig,"induced-electric-field")

    fig,axes=plt.subplots(2,1,figsize=(7,4.6),sharex=True)
    axes[0].step([-1.5,-1,0,1,1.5],[0,-1,1,0,0],where="post",color=RED,lw=2)
    axes[0].set(ylabel=r"$\rho/\rho_0$",title="Ch. 2, Ex. 9: planar junction")
    z=np.linspace(-1.5,1.5,601); ez=-np.maximum(1-np.abs(z),0)
    axes[1].plot(z,ez,color=BLUE,lw=2)
    axes[1].set(xlabel="$z/a$",ylabel=r"$\epsilon_0 E_z/(\rho_0a)$",xticks=[-1,0,1])
    for ax in axes: ax.axhline(0,color=GRAY,lw=.7); ax.grid(alpha=.2)
    fig.tight_layout(); save(fig,"junction-charge-and-field")


def geometries():
    fig,axes=plt.subplots(1,2,figsize=(10,4.3))
    ax=axes[0]; ax.add_patch(Rectangle((-1.7,-1.7),1.7,3.4,fc="#e3e9ef",ec="none"))
    ax.add_patch(Rectangle((0,-1.7),1.7,1.7,fc="#e3e9ef",ec="none"))
    line(ax,(0,0),(0,1.7)); line(ax,(0,0),(1.7,0))
    for point,label,color in [((1,1),"Q (real)",RED),((-1,1),"-Q",BLUE),
                               ((1,-1),"-Q",BLUE),((-1,-1),"+Q",RED)]:
        ax.plot(*point,"o",color=color,ms=9)
        ax.text(point[0],point[1]+.21,label,ha="center",color=color)
    arrow(ax,(.92,.92),(.35,.35),GREEN)
    ax.text(.9,.35,"force",color=GREEN)
    ax.text(-.9,.1,"V = 0",color=GRAY)
    clean(ax,"Ch. 5, Ex. 4: grounded corner",(-1.7,1.8),(-1.7,1.8))
    ax=axes[1]; ax.add_patch(Circle((0,0),1,fc="#edf2f6",ec=GRAY,lw=1.5))
    line(ax,(-1.2,0),(2.6,0))
    for x,label,color in [(2.2,"Q",RED),(.455,r"$q'=-QR/d$",BLUE),(0,r"$q_c=Q_0+QR/d$",GREEN)]:
        ax.plot(x,0,"o",color=color,ms=8)
        ypos=.35 if x>0 else -.5
        ax.annotate(label,xy=(x,0),xytext=(x,ypos),ha="center",color=color,fontsize=10)
    arrow(ax,(0,-1.24),(2.2,-1.24)); ax.text(1.1,-1.48,"d",ha="center")
    arrow(ax,(0,.0),(-.7,.7)); ax.text(-.6,.37,"R",color=BLUE)
    ax.text(.47,-.26,r"$b=R^2/d$",ha="left",fontsize=9)
    clean(ax,"Ch. 5, Ex. 3: fixed-charge sphere",(-1.5,3),(-1.7,1.8))
    fig.tight_layout(); save(fig,"conductor-images")

    fig,axes=plt.subplots(1,2,figsize=(10,4.3))
    ax=axes[0]; R=1.2; a=.5; root=np.sqrt(R*R-a*a)
    ax.add_patch(Rectangle((-1.6,a),3.2,1.1,fc="#e8f1fa",ec="none"))
    ax.add_patch(Circle((0,0),R,fc="none",ec=GRAY,lw=1.5))
    theta=np.linspace(np.arcsin(a/R),np.pi-np.arcsin(a/R),120)
    ax.plot(R*np.cos(theta),R*np.sin(theta),color=RED,lw=3)
    line(ax,(-1.6,0),(1.6,0)); line(ax,(0,-1.5),(0,1.6))
    ax.plot([-1.6,1.6],[a,a],ls="--",color=BLUE,lw=1)
    arrow(ax,(root,a),(root-.35,a+.35),RED)
    arrow(ax,(0,.2),(0,1.45),GREEN); ax.text(.1,1.4,"F",color=GREEN)
    ax.text(-1.5,1.4,r"$\odot\ B$",color=BLUE)
    ax.text(1.34,a-.16,"y = a",color=BLUE,fontsize=9)
    ax.text(1.38,-.2,"x"); ax.text(.12,-1.3,"y")
    clean(ax,"Ch. 8, Ex. 3: only the red arc feels B",(-1.65,1.85),(-1.55,1.75))
    ax=axes[1]
    ax.add_patch(Rectangle((.8,-.7),1.6,1.4,fc="#edf2f6",ec=GRAY))
    line(ax,(0,0),(3.2,0)); ax.plot([.8,2.4],[0,0],color=RED,lw=4)
    arrow(ax,(1.1,.0),(2.1,.0),RED); ax.text(1.6,-.25,"i",color=RED,ha="center")
    for x in [1,1.6,2.2]: arrow(ax,(x,.12),(x,.6),BLUE)
    ax.text(1.6,.85,r"$\mathbf{B}=\mu_0NI\hat{\mathbf{y}}/(2\pi x)$",ha="center",color=BLUE)
    ax.text(.8,-1.03,"R - a",ha="center"); ax.text(2.4,-1.03,"R + a",ha="center")
    ax.text(2.75,.4,r"$\odot\ \mathbf{F}$",color=GREEN)
    ax.text(.08,-.23,"0"); ax.text(3.1,-.23,"x")
    clean(ax,"Ch. 9, Ex. 9: toroid mid-plane segment",(-.2,3.7),(-1.4,1.5))
    fig.tight_layout(); save(fig,"magnetic-force-geometries")


if __name__ == "__main__":
    circuits()
    plots()
    geometries()
