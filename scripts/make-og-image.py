"""Generate public/og-image.png, the social-preview card.

Typographic only: no gradients, no ornament, per BRAND.md. Needs Pillow and the
Inter / JetBrains Mono TTFs; `fonts/` is populated by scripts/fetch-og-fonts.sh.

    python3 scripts/make-og-image.py public/og-image.png

Regenerate whenever the headline or the brand colour changes. The dimensions are
declared to crawlers in src/lib/og.ts; keep them in step.
"""
from PIL import Image, ImageDraw, ImageFont
import glob, os, sys

W, H = 1200, 630
SCALE = 2  # render at 2x then downsample, for clean edges

INK_50, INK_900, INK_600, INK_200 = "#FCF9FA", "#1F1A1C", "#6C6366", "#E9E4E5"
TYRIAN = "#66023C"

def font_path(family, style):
    for f in glob.glob(os.path.join(os.path.dirname(__file__), "fonts", "*.ttf")):
        if ImageFont.truetype(f, 12).getname() == (family, style):
            return f
    raise SystemExit(f"missing font: {family} {style}")

INTER_SEMI = font_path("Inter", "SemiBold")
INTER_REG = font_path("Inter", "Regular")
MONO_MED = font_path("JetBrains Mono", "Medium")

def f(path, size):
    return ImageFont.truetype(path, size * SCALE)

def wrap(draw, text, font, max_w):
    if "\n" in text:
        return text.split("\n")
    words, lines, cur = text.split(), [], ""
    for w in words:
        trial = f"{cur} {w}".strip()
        if draw.textlength(trial, font=font) <= max_w:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines

def build(out):
    img = Image.new("RGB", (W * SCALE, H * SCALE), INK_50)
    d = ImageDraw.Draw(img)

    # Left rule in the anchor colour, the one piece of brand furniture.
    d.rectangle([0, 0, 14 * SCALE, H * SCALE], fill=TYRIAN)

    x = 96 * SCALE
    right = (W - 96) * SCALE
    measure = right - x

    # Mono eyebrow
    eyebrow = f(MONO_MED, 20)
    d.text((x, 104 * SCALE), "S O F T W A R E   E N G I N E E R   ·   R E S E A R C H E R",
           font=eyebrow, fill=INK_600)

    # Name
    name = f(INTER_SEMI, 82)
    d.text((x - 4 * SCALE, 150 * SCALE), "Sinclair Nzenwata", font=name, fill=TYRIAN)

    # Headline, wrapped
    head = f(INTER_REG, 36)
    y = 268 * SCALE
    for line in wrap(d, "Building at the intersection of AI research\nand real-world engineering.", head, int(measure * 0.84)):
        d.text((x, y), line, font=head, fill=INK_900)
        y += 50 * SCALE

    # Stack line: specific, per the brand's "every claim carries a detail" rule
    stack = f(MONO_MED, 21)
    d.text((x, 398 * SCALE), "Go  ·  TypeScript  ·  Python  ·  PostgreSQL  ·  AI systems",
           font=stack, fill=INK_600)

    # Hairline
    rule_y = 466 * SCALE
    d.rectangle([x, rule_y, right, rule_y + 1 * SCALE], fill=INK_200)

    # Footer row: domain left, credential right
    foot = f(MONO_MED, 22)
    d.text((x, 506 * SCALE), "sinclairnzenwata.com", font=foot, fill=INK_900)
    cred = "Ball State University"
    d.text((right - d.textlength(cred, font=foot), 506 * SCALE), cred, font=foot, fill=INK_600)

    img.resize((W, H), Image.LANCZOS).save(out, "PNG", optimize=True)
    print("wrote", out)

build(sys.argv[1] if len(sys.argv) > 1 else "og-image.png")
