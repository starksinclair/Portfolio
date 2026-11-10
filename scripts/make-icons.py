"""Generate the site mark and every icon file that references it.

The mark is a plumb bob: a datum bar, a thread, and a weight hanging from it.
See BRAND.md section 8 for why that shape and not another. It is defined once
here, as geometry on a 32-unit grid, and every output is drawn from the same
numbers, so the SVG in the tab bar and the PNG on a home screen cannot drift.

    python3 scripts/make-icons.py          # writes into public/

Outputs: icon.svg, favicon.ico (16/32/48), apple-touch-icon.png (180),
icon-192.png and icon-512.png (maskable). Needs Pillow; no SVG rasteriser is
required because the PNGs are drawn, not converted.
"""
from PIL import Image, ImageDraw
import os, sys

TYRIAN = "#66023C"
INK_50 = "#FCF9FA"

GRID = 32  # the mark is designed on a 32-unit square
SS = 8     # supersampling factor; drawn at 8x, downsampled once

# --- the mark -----------------------------------------------------------
# Vertically centred in the grid: 3.6 at the top of the datum bar, 28.4 at the
# tip of the bob, so 3.6 of clear space above and below. The body is taller
# than the taper on purpose; the other way round it reads as a download arrow.
DATUM = (6.0, 3.6, 26.0, 5.4)            # the fixed thing you measure against
THREAD = (14.9, 5.4, 17.1, 12.6)         # the line that finds true vertical
BOB = [                                  # the weight: a body, then a short taper
    (11.3, 12.6), (20.7, 12.6), (20.7, 21.5), (16.0, 28.4), (11.3, 21.5),
]


def draw_mark(d, x, y, size, fill):
    """Draw the mark with its 32-unit box at (x, y), `size` units square."""
    u = size / GRID

    def p(px, py):
        return (x + px * u, y + py * u)

    d.rectangle([p(DATUM[0], DATUM[1]), p(DATUM[2], DATUM[3])], fill=fill)
    d.rectangle([p(THREAD[0], THREAD[1]), p(THREAD[2], THREAD[3])], fill=fill)
    d.polygon([p(px, py) for px, py in BOB], fill=fill)


def tile(size, mark_ratio, radius_ratio, bg=TYRIAN, fg=INK_50):
    """A square icon: the mark centred on a Tyrian field."""
    s = size * SS
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    if radius_ratio:
        d.rounded_rectangle([0, 0, s - 1, s - 1], radius=s * radius_ratio, fill=bg)
    else:
        d.rectangle([0, 0, s, s], fill=bg)
    m = s * mark_ratio
    draw_mark(d, (s - m) / 2, (s - m) / 2, m, fg)
    return img.resize((size, size), Image.LANCZOS)


def hinted_16(bg=TYRIAN, fg=INK_50):
    """The 16px frame, drawn on the pixel grid rather than downsampled.

    A 1.8-unit datum bar is two thirds of a pixel at this size, so the scaled
    version renders it as grey haze. These rectangles are whole pixels: the
    mark loses its taper angle and keeps its silhouette, which is the right
    trade in a tab bar.
    """
    img = Image.new("RGBA", (16, 16), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([0, 0, 15, 15], radius=3, fill=bg)
    for x, y, w, h in (
        (3, 2, 10, 2),   # datum bar
        (7, 4, 2, 4),    # thread
        (5, 8, 6, 4),    # bob body
        (6, 12, 4, 1),   # taper
        (7, 13, 2, 1),   # tip
    ):
        d.rectangle([x, y, x + w - 1, y + h - 1], fill=fg)
    return img


def svg():
    """The same geometry as SVG. Light and dark get the same field colour: a
    tab bar is chrome, not page background, so the mark must hold in both."""
    r = 6.4  # 20% of the 32-unit grid
    n = lambda v: f"{round(v, 2):g}"  # binary floats would print 1.8000000000000003
    pts = " ".join(f"{n(px)},{n(py)}" for px, py in BOB)
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {GRID} {GRID}" role="img" aria-label="Sinclair Nzenwata">
  <title>Sinclair Nzenwata</title>
  <rect width="{GRID}" height="{GRID}" rx="{r}" fill="{TYRIAN}"/>
  <g fill="{INK_50}">
    <rect x="{n(DATUM[0])}" y="{n(DATUM[1])}" width="{n(DATUM[2] - DATUM[0])}" height="{n(DATUM[3] - DATUM[1])}"/>
    <rect x="{n(THREAD[0])}" y="{n(THREAD[1])}" width="{n(THREAD[2] - THREAD[0])}" height="{n(THREAD[3] - THREAD[1])}"/>
    <polygon points="{pts}"/>
  </g>
</svg>
"""


def build(out_dir):
    os.makedirs(out_dir, exist_ok=True)

    with open(os.path.join(out_dir, "icon.svg"), "w") as f:
        f.write(svg())

    # Favicon: rounded field, generous mark. At 16px the silhouette is all a
    # reader gets, so each size is drawn at its own scale rather than
    # downsampled from one big one.
    sizes = [48, 32, 16]
    frames = [tile(48, 0.74, 0.20), tile(32, 0.74, 0.20), hinted_16()]
    # Pillow picks a frame per requested size by matching dimensions, and
    # scales the base image for anything it cannot match; the largest goes
    # first so a mismatch would degrade rather than blur up from 16px.
    frames[0].save(
        os.path.join(out_dir, "favicon.ico"),
        format="ICO",
        sizes=[(n, n) for n in sizes],
        append_images=frames[1:],
    )

    # Apple and Android mask these themselves, so they get a full-bleed square
    # and a smaller mark that stays inside the maskable safe zone (the middle
    # 80%, measured as a circle).
    tile(180, 0.56, 0).convert("RGB").save(
        os.path.join(out_dir, "apple-touch-icon.png"), "PNG", optimize=True
    )
    for n in (192, 512):
        tile(n, 0.56, 0).convert("RGB").save(
            os.path.join(out_dir, f"icon-{n}.png"), "PNG", optimize=True
        )

    print("wrote icon.svg, favicon.ico, apple-touch-icon.png, icon-192.png, icon-512.png")


build(sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), "..", "public"))
