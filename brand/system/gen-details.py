#!/usr/bin/env python3
"""Rota A graphic detail elements as clean SVG. Hand-made vector system pieces
(sunburst, stripes, window frame, heat waves, star, vinyl) + a preview page."""
import math, pathlib

OUT = pathlib.Path(__file__).parent / "details"
OUT.mkdir(parents=True, exist_ok=True)

ESPRESSO = "#24160F"
BUTTER   = "#F6D78B"
HEAT     = "#FF7A3D"
LAMP     = "#F3E6D2"

def write(name, svg):
    (OUT / name).write_text(svg.strip() + "\n")
    print("wrote", name)

# --- Sunburst: alternating rays from center -------------------------------
def sunburst(n=24):
    cx = cy = 100
    r = 150
    wedges = []
    step = 360 / n
    for i in range(n):
        a0 = math.radians(i * step)
        a1 = math.radians((i + 0.5) * step)
        x0, y0 = cx + r * math.cos(a0), cy + r * math.sin(a0)
        x1, y1 = cx + r * math.cos(a1), cy + r * math.sin(a1)
        wedges.append(f'<path d="M{cx} {cy} L{x0:.1f} {y0:.1f} L{x1:.1f} {y1:.1f} Z" fill="{HEAT}"/>')
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
<g>{''.join(wedges)}</g>
</svg>'''

# --- Footer stripes: heat / butter / lamp ---------------------------------
def stripes():
    cols = [HEAT, BUTTER, LAMP, ESPRESSO]
    bars = "".join(f'<rect x="0" y="{i*12}" width="200" height="12" fill="{c}"/>' for i, c in enumerate(cols))
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 48" fill="none">{bars}</svg>'''

# --- Airfryer window frame: rounded rectangle "window" --------------------
def window_frame():
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240" fill="none">
<rect x="10" y="10" width="180" height="220" rx="46" fill="none" stroke="{BUTTER}" stroke-width="6"/>
<rect x="22" y="22" width="156" height="196" rx="36" fill="none" stroke="{HEAT}" stroke-width="3"/>
<line x1="40" y1="200" x2="160" y2="200" stroke="{BUTTER}" stroke-width="4" stroke-linecap="round" opacity="0.5"/>
</svg>'''

# --- Heat waves: rising wavy lines ----------------------------------------
def heatwaves():
    lines = []
    for k, y in enumerate((60, 100, 140)):
        d = f"M20 {y}"
        for x in range(20, 190, 20):
            d += f" q10 -14 20 0 t20 0"
        col = (HEAT, BUTTER, LAMP)[k]
        lines.append(f'<path d="{d}" fill="none" stroke="{col}" stroke-width="5" stroke-linecap="round"/>')
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">{''.join(lines)}</svg>'''

# --- Star / sparkle mark (the asterisk accent) ----------------------------
def star():
    cx = cy = 100
    pts = []
    outer, inner = 90, 20
    for i in range(8):
        a = math.radians(i * 45)
        rr = outer if i % 2 == 0 else inner
        pts.append(f"{cx + rr*math.cos(a):.1f},{cy + rr*math.sin(a):.1f}")
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
<polygon points="{' '.join(pts)}" fill="{HEAT}"/>
</svg>'''

# --- Vinyl record: concentric grooves -------------------------------------
def vinyl():
    rings = "".join(f'<circle cx="100" cy="100" r="{r}" fill="none" stroke="{ESPRESSO}" stroke-width="1.4" opacity="0.5"/>' for r in range(40, 92, 6))
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
<circle cx="100" cy="100" r="96" fill="#1a110b"/>
<circle cx="100" cy="100" r="95" fill="none" stroke="{BUTTER}" stroke-width="2" opacity="0.3"/>
{rings}
<circle cx="100" cy="100" r="30" fill="{HEAT}"/>
<circle cx="100" cy="100" r="4" fill="{ESPRESSO}"/>
</svg>'''

elements = {
    "sunburst.svg": sunburst(),
    "stripes.svg": stripes(),
    "window-frame.svg": window_frame(),
    "heatwaves.svg": heatwaves(),
    "star.svg": star(),
    "vinyl.svg": vinyl(),
}
for name, svg in elements.items():
    write(name, svg)

# --- Preview page (self-contained; SVGs inlined) --------------------------
cards = ""
for name in elements:
    svg = (OUT / name).read_text()
    label = name.replace(".svg", "")
    cards += f'''<figure><div class="box">{svg}</div><figcaption>{label}</figcaption></figure>'''

preview = f'''<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Rota A — Detalhes</title>
<style>
:root{{--espresso:{ESPRESSO};--butter:{BUTTER};--heat:{HEAT};--lamp:{LAMP};}}
body{{margin:0;background:var(--espresso);color:var(--lamp);font-family:'Work Sans',system-ui,sans-serif;padding:32px}}
h1{{font-family:'Shrikhand',Georgia,serif;color:var(--butter);font-weight:400}}
.grid{{display:grid;gap:20px;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));max-width:1100px}}
figure{{margin:0;background:#2d1d13;border:1px solid #4a3324;border-radius:14px;overflow:hidden}}
.box{{aspect-ratio:1;display:grid;place-items:center;padding:24px}}
.box svg{{width:100%;height:100%;max-width:140px}}
figcaption{{padding:10px 14px;font:500 13px/1 ui-monospace,monospace;color:var(--heat)}}
</style></head><body>
<h1>Rota A — Detalhes visuais (SVG)</h1>
<p style="opacity:.7">Elementos vetoriais do sistema, cores espresso/butter/heat/lamp. Prontos pra usar em moldura, rodapé, fundo e marca-d'água.</p>
<div class="grid">{cards}</div>
</body></html>'''
(OUT / "index.html").write_text(preview)
print("wrote index.html")
