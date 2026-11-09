"""Optional, course-independent figure authoring. No files are written on import.

Matplotlib and Pillow are loaded only when drawing or exporting. These tools
are not dependencies of the website build or the AI request handler.
"""
from io import BytesIO
from math import isfinite
from pathlib import Path


COLORS = {"blue": "#2463a0", "green": "#13877e", "red": "#bd4141", "gray": "#536476"}


def canvas(*, figsize=(10, 6), xlim=(0, 10), ylim=(0, 6), title="", equal=False, axes=False):
    """Return an independent (figure, axes) without changing pyplot or rcParams."""
    from matplotlib.backends.backend_agg import FigureCanvasAgg
    from matplotlib.figure import Figure

    figure = Figure(figsize=figsize, facecolor="white")
    FigureCanvasAgg(figure)
    ax = figure.subplots()
    ax.set(xlim=xlim, ylim=ylim)
    if title:
        ax.set_title(title)
    if equal:
        ax.set_aspect("equal", adjustable="box")
    if not axes:
        ax.set_axis_off()
    return figure, ax


def label(ax, point, value, *, size=12, color=COLORS["gray"], font_family=None, **kwargs):
    """Add text; an optional font family uses Matplotlib's font discovery."""
    options = {"ha": "center", "va": "center", "fontsize": size, "color": color, **kwargs}
    if font_family:
        options["fontfamily"] = font_family
    return ax.text(*point, value, **options)


def arrow(ax, start, end, *, text="", color=COLORS["gray"], double=False,
          text_offset=(0, 0), text_options=None, **kwargs):
    """Draw an arrow and optionally label its midpoint in data coordinates."""
    properties = {"arrowstyle": "<->" if double else "->", "color": color, "lw": 1.6, **kwargs}
    artist = ax.annotate("", xy=end, xytext=start, arrowprops=properties)
    if text:
        midpoint = tuple((a + b) / 2 + offset for a, b, offset in zip(start, end, text_offset))
        label(ax, midpoint, text, **{"color": color, **(text_options or {})})
    return artist


def box(ax, center, text="", *, width=2.5, height=.8, color=COLORS["blue"],
        fill="#f3f7fb", text_options=None):
    """Draw a rounded box. Dimensions are explicit, in axes data coordinates."""
    from matplotlib.patches import FancyBboxPatch

    x, y = center
    patch = FancyBboxPatch((x - width / 2, y - height / 2), width, height,
                          boxstyle="round,pad=0.06", edgecolor=color, facecolor=fill, lw=1.5)
    ax.add_patch(patch)
    if text:
        label(ax, center, text, **{"color": color, **(text_options or {})})
    return patch


def save_figure(figure, destination, *, dpi=160, quality=92):
    """Export SVG, PNG or WebP to an explicit path; return the resulting Path.

    SVG retains text as editable text. WebP conversion uses an in-memory PNG,
    so no temporary image files are created. The caller retains the figure.
    """
    destination = Path(destination)
    kind = destination.suffix.lower()
    if kind not in {".svg", ".png", ".webp"}:
        raise ValueError("Choose a .svg, .png or .webp destination")
    if not isinstance(dpi, (int, float)) or not isfinite(dpi) or dpi <= 0:
        raise ValueError("dpi must be a positive finite number")
    if not isinstance(quality, int) or not 1 <= quality <= 100:
        raise ValueError("quality must be an integer from 1 to 100")

    import matplotlib

    destination.parent.mkdir(parents=True, exist_ok=True)
    with matplotlib.rc_context({"svg.fonttype": "none"}):
        if kind == ".webp":
            from PIL import Image

            with BytesIO() as buffer:
                figure.savefig(buffer, format="png", dpi=dpi, bbox_inches="tight")
                buffer.seek(0)
                with Image.open(buffer) as image:
                    image.convert("RGB").save(destination, format="WEBP", quality=quality)
        else:
            figure.savefig(destination, format=kind[1:], dpi=dpi, bbox_inches="tight")
    return destination
