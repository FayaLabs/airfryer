#!/usr/bin/env python3
"""Builder for brand/system/airfryer-design-system.html (HÖR-inspired, Airfryer).
Re-runnable: reads assets from _src/, writes the self-contained HTML."""
import base64, pathlib
HERE = pathlib.Path(__file__).parent
S = HERE / "_src"
def u(n):
    m = "png" if n.endswith(".png") else "jpeg"
    return f"data:image/{m};base64," + base64.b64encode((S/n).read_bytes()).decode()
LOU = u("lou-mono-closed.png")
TH = {k: u(f"th-{k}.jpg") for k in ["seed-selector","soulfie","kmni","le-bulla","marco-boarelli","dj-tortuga"]}

COLORS = [
 ("Well","#141210",0,"Player, header ticker"),
 ("Ink","#1C1A17",0,"Fundo da pagina"),
 ("Surface","#232019",0,"Cards, tabs, footer"),
 ("Raised","#2C2720",0,"Hover, menu"),
 ("Line","#36312A",0,"Bordas, divisores"),
 ("Cream","#ECE6DB",1,"Texto padrao"),
 ("Muted","#9A9088",0,"Datas, legendas"),
 ("Faint","#6A625A",0,"Apoio"),
]
# accent set — semantic, one per context
ACCENTS = [
 ("Heat","#FF6A1F","Acao primaria, House"),
 ("Rosa","#E5216E","Afro House, destaque"),
 ("Azul","#1BA3DD","Indie / Progressive"),
 ("Lima","#B6E34A","Disco / Soul"),
]
TYPE = [
 ("Display / 800","Let’s make noise.","72 / 68 · 800 · tracking -.04","d"),
 ("Headline / 700","We record everything.","40 / 44 · 700","h"),
 ("Title / 600","AFC/016 — Seed Selector","24 / 28 · 600","t"),
 ("Accent italic","Picks #016 by the room","22 / 28 · 400 · serif italic","i"),
 ("Subtitle / 500","Not for content. For memory.","18 / 22 · 500","s"),
 ("Body / 400","An invite-only community born in a Barcelona living room; every set recorded.","16 / 26 · 400","b"),
 ("Meta / mono","AFC/016 · House · São Paulo · 4667 views","13 · 600 · Muted","m"),
]
SHAPE = [("Window lg","26px","Hero, mascote, media"),("Window md","16px","Cards, botoes"),
         ("Window sm","10px","Chips, thumbs"),("Pill","999px","Nav, badges, REC")]
# card: num, thumb, artist, genre, accent-var
CARDS = [
 ("016",TH["seed-selector"],"Seed Selector","House · São Paulo","var(--heat)"),
 ("015",TH["soulfie"],"Soulfie","Disco · Soul","var(--lima)"),
 ("014",TH["kmni"],"KMNI","Afro House · Cameroon","var(--rosa)"),
 ("B48",TH["le-bulla"],"Le Bulla","Indie Dance","var(--azul)"),
 ("009",TH["marco-boarelli"],"Marco Boarelli","Progressive","var(--azul)"),
 ("B48",TH["dj-tortuga"],"DJ Tortuga","Disco House","var(--lima)"),
]
PLAY_SVG = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M6 4.5 L19 12 L6 19.5 Z" fill="currentColor"/></svg>'

def col_cards(items, accent=False):
    out=""
    for row in items:
        if accent:
            nm,hx,us=row; lt=0
        else:
            nm,hx,lt,us=row
        tc="#1C1A17" if lt else "#ECE6DB"
        out+=f'<div class="col"><div class="chip" style="background:{hx}"></div><div class="meta"><span class="nm">{nm}</span><span class="hx">{hx}</span></div><div class="use">{us}</div></div>'
    return out
def type_rows():
    return "".join(f'<div class="trow"><div class="tl"><div class="lbl">{lb}</div><div class="spec">{sp}</div></div><div class="t-{cl}">{sm}</div></div>' for lb,sm,sp,cl in TYPE)
def shape_rows():
    out=""
    for nm,v,us in SHAPE:
        r={"Window lg":"26px","Window md":"16px","Window sm":"10px","Pill":"999px"}[nm]
        out+=f'<div class="shrow"><div class="shdemo" style="border-radius:{r}"></div><div><div class="nm">{nm} <span class="hx">{v}</span></div><div class="use">{us}</div></div></div>'
    return out
def scard(num,thumb,artist,genre,accent):
    return (f'<a class="scard" href="#" style="--genre:{accent}">'
            f'<div class="acc"></div>'
            f'<div class="ph"><img src="{thumb}" alt="{artist}">'
            f'<span class="chipn">AFC/{num}</span>'
            f'<span class="scrim"></span>'
            f'<span class="play" role="button" aria-label="Play {artist}" tabindex="0">{PLAY_SVG}</span></div>'
            f'<div class="sb"><div class="ar">{artist}</div>'
            f'<div class="ge"><span class="dot"></span>{genre}</div></div></a>')

CSS = """
*{box-sizing:border-box;margin:0;padding:0}
:root{
 --well:#141210;--ink:#1C1A17;--surface:#232019;--raised:#2C2720;--line:#36312A;
 --cream:#ECE6DB;--muted:#9A9088;--faint:#6A625A;--heat:#FF6A1F;--heat-deep:#C64A12;
 --rosa:#E5216E;--azul:#1BA3DD;--lima:#B6E34A;
 --disp:"Helvetica Neue",Arial,sans-serif;--serif:Georgia,serif;--mono:ui-monospace,"SF Mono",Menlo,monospace;
 --w-lg:26px;--w-md:16px;--w-sm:10px;--ease:cubic-bezier(.2,.7,.2,1);
}
html{scroll-behavior:smooth}
body{background:var(--ink);color:var(--cream);font-family:var(--disp);-webkit-font-smoothing:antialiased;line-height:1.3}
.wrap{max-width:1200px;margin:0 auto;padding:0 24px}
.kick{font:600 11px/1 var(--mono);letter-spacing:.22em;text-transform:uppercase;color:var(--muted)}
a{color:inherit;text-decoration:none}
:focus-visible{outline:2px solid var(--heat);outline-offset:3px;border-radius:6px}
.bar{position:sticky;top:0;z-index:30;background:rgba(20,18,16,.9);backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}
.bar .in{display:flex;align-items:center;gap:16px;height:56px;max-width:1200px;margin:0 auto;padding:0 24px}
.logo{font-weight:800;letter-spacing:-.02em;font-size:18px;text-transform:uppercase}
.rec{display:inline-flex;align-items:center;gap:7px;border:1px solid var(--heat);color:var(--heat);border-radius:999px;padding:5px 11px;font:700 10px/1 var(--mono);letter-spacing:.14em}
.rec .dot{width:7px;height:7px;border-radius:50%;background:var(--heat);animation:p 1.6s infinite}
@keyframes p{0%{box-shadow:0 0 0 0 rgba(255,106,31,.55)}100%{box-shadow:0 0 0 9px rgba(255,106,31,0)}}
.now{flex:1;min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;font:600 12px/1 var(--mono);color:var(--muted)}
.now b{color:var(--cream)}
.nav{display:flex;gap:2px}.nav a{font:600 12px/1 var(--disp);padding:8px 10px;border-radius:999px;color:var(--muted);transition:.15s var(--ease)}
.nav a:hover{color:var(--cream);background:var(--raised)}.nav a.on{color:var(--heat)}
.members{border:1px solid var(--cream);border-radius:999px;padding:7px 14px;font:600 12px/1 var(--disp)}
@media(max-width:900px){.nav,.now{display:none}}
.hero{padding:64px 0 36px;display:grid;grid-template-columns:1fr 260px;gap:40px;align-items:center}
.giant{font-weight:800;letter-spacing:-.045em;line-height:.9;font-size:clamp(46px,7.5vw,96px)}.giant .o{color:var(--heat)}
.lead{margin-top:22px;max-width:60ch;color:var(--muted);font-size:16px;line-height:1.55}.lead b{color:var(--cream)}
.heromark{background:var(--surface);border:1px solid var(--line);border-radius:var(--w-lg);aspect-ratio:1;display:grid;place-items:center;overflow:hidden}
.heromark img{width:88%;height:88%;object-fit:contain}
@media(max-width:820px){.hero{grid-template-columns:1fr}.heromark{max-width:220px}}
.sec{padding:48px 0;border-top:1px solid var(--line)}
.sec-h{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:26px}
.sec-h h2{font-weight:800;font-size:clamp(20px,2.6vw,30px);letter-spacing:-.02em;text-transform:uppercase}
.cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px}
.col{border:1px solid var(--line);border-radius:var(--w-md);overflow:hidden;background:var(--surface)}
.col .chip{height:74px}.col .meta{padding:11px 13px 2px;display:flex;justify-content:space-between;align-items:baseline}
.col .nm{font-weight:700;font-size:13px}.col .hx{font:600 10px/1 var(--mono);color:var(--muted)}
.col .use{padding:4px 13px 13px;font:500 11px/1.4 var(--mono);color:var(--muted)}
.note{color:var(--muted);font:500 12px/1.6 var(--mono);margin-top:16px;max-width:76ch}.note b{color:var(--cream)}
.trow{display:grid;grid-template-columns:200px 1fr;gap:24px;align-items:baseline;border-top:1px solid var(--line);padding:18px 0}
.trow:first-child{border-top:0}.tl .lbl{font-weight:700;font-size:13px}.tl .spec{font:600 11px/1.4 var(--mono);color:var(--muted);margin-top:4px}
.t-d{font-weight:800;font-size:46px;letter-spacing:-.04em;line-height:.95}.t-h{font-weight:700;font-size:30px;letter-spacing:-.02em}
.t-t{font-weight:600;font-size:22px}.t-i{font-family:var(--serif);font-style:italic;font-size:22px}.t-s{font-weight:500;font-size:18px}
.t-b{font-weight:400;font-size:16px;line-height:1.6;max-width:62ch;color:#d9d1c6}.t-m{font:600 13px/1.4 var(--mono);color:var(--muted)}
@media(max-width:700px){.trow{grid-template-columns:1fr;gap:8px}}
.shapes{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px}
.shrow{display:flex;gap:14px;align-items:center;border:1px solid var(--line);border-radius:var(--w-md);padding:14px;background:var(--surface)}
.shdemo{width:54px;height:54px;background:var(--heat);flex:none}.shrow .nm{font-weight:700;font-size:13px}.shrow .hx{font:600 11px/1 var(--mono);color:var(--muted)}.shrow .use{font:500 11px/1.4 var(--mono);color:var(--muted);margin-top:3px}
.comp{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px}
.card{border:1px solid var(--line);border-radius:var(--w-md);padding:20px;background:var(--surface)}
.card .ct{font-weight:700;font-size:12px;letter-spacing:.04em;margin-bottom:14px;color:var(--muted);text-transform:uppercase}
.btn{display:inline-flex;align-items:center;gap:8px;border-radius:999px;padding:11px 17px;font-weight:700;font-size:14px;cursor:pointer;border:0;transition:.15s var(--ease)}
.btn-o{background:var(--heat);color:#1a1205}.btn-o:hover{background:var(--heat-deep);color:#fff}
.btn-g{background:transparent;color:var(--cream);border:1px solid var(--cream)}.btn-g:hover{background:var(--cream);color:var(--ink)}
.badge{display:inline-flex;align-items:center;gap:6px;background:var(--heat);color:#1a1205;border-radius:6px;padding:5px 9px;font:800 10px/1 var(--mono);letter-spacing:.1em}
.gpill{display:inline-block;border:1px solid var(--line);border-radius:999px;padding:6px 13px;font:600 12px/1 var(--disp);color:var(--cream);margin:3px;transition:.15s var(--ease);cursor:pointer}
.gpill:hover{background:var(--heat);color:#1a1205;border-color:var(--heat)}
.sortbar{display:flex;gap:10px;align-items:center;font:600 12px/1 var(--mono);color:var(--muted)}.sortbar .on{color:var(--heat)}
.lib{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
@media(max-width:820px){.lib{grid-template-columns:1fr 1fr}}@media(max-width:520px){.lib{grid-template-columns:1fr}}
/* --- session card (improved) --- */
.scard{position:relative;border:1px solid var(--line);border-radius:var(--w-md);overflow:hidden;background:var(--surface);transition:transform .18s var(--ease),border-color .18s var(--ease);display:block;color:inherit}
.scard:hover{transform:translateY(-3px);border-color:var(--genre)}
.scard .acc{height:3px;background:var(--genre)}
.scard .ph{position:relative;aspect-ratio:16/10;overflow:hidden}
.scard .ph img{width:100%;height:100%;object-fit:cover;filter:saturate(1.04) contrast(1.03);transition:transform .35s var(--ease)}
.scard:hover .ph img{transform:scale(1.045)}
.scard .chipn{position:absolute;top:10px;left:11px;z-index:2;font:800 11px/1 var(--mono);color:#fff;letter-spacing:.06em;text-shadow:0 1px 5px rgba(0,0,0,.7)}
.scard .scrim{position:absolute;inset:0;background:radial-gradient(120% 90% at 50% 48%,transparent 40%,rgba(10,8,6,.5));opacity:.5;transition:opacity .18s var(--ease)}
.scard:hover .scrim{opacity:.85}
.scard .play{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) scale(.92);z-index:3;
 width:56px;height:56px;border-radius:50%;display:grid;place-items:center;cursor:pointer;
 color:var(--cream);background:rgba(20,18,16,.5);border:1.5px solid rgba(236,230,219,.6);
 backdrop-filter:blur(3px);opacity:.85;transition:all .18s var(--ease)}
.scard .play svg{margin-left:2px}
.scard:hover .play,.scard .play:focus-visible{opacity:1;transform:translate(-50%,-50%) scale(1.08);
 background:var(--genre);border-color:var(--genre);color:var(--ink)}
.scard .sb{padding:13px 15px}.scard .ar{font-weight:700;font-size:16px}
.scard .ge{display:flex;align-items:center;gap:7px;font:600 11px/1.4 var(--mono);color:var(--muted);text-transform:uppercase;letter-spacing:.07em;margin-top:6px}
.scard .ge .dot{width:8px;height:8px;border-radius:50%;background:var(--genre);flex:none}
@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}.scard:hover{transform:none}.scard:hover .ph img{transform:none}}
.mascot{display:grid;grid-template-columns:300px 1fr;gap:34px;align-items:center}
.mascot .box{background:var(--surface);border:1px solid var(--line);border-radius:var(--w-lg);overflow:hidden;aspect-ratio:1;display:grid;place-items:center}
.mascot .box img{width:90%;height:90%;object-fit:contain}
.mini{display:flex;gap:10px;margin-top:14px}.sw-mini{width:52px;height:52px;border-radius:12px;border:1px solid var(--line);display:grid;place-items:center;font:700 10px/1 var(--mono)}
@media(max-width:720px){.mascot{grid-template-columns:1fr}}
.foot{color:var(--muted);font:500 12px/1.7 var(--mono);padding:36px 0 80px;border-top:1px solid var(--line)}.foot b{color:var(--cream)}
"""

HTML = """<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>Airfryer — Design System</title>
<style>%%CSS%%</style></head><body>
<div class="bar"><div class="in">
 <span class="logo">Airfryer</span>
 <span class="rec"><span class="dot"></span>REC</span>
 <span class="now">Now on air: <b>AFC/016 — Seed Selector</b> · House · São Paulo</span>
 <nav class="nav"><a class="on">Library</a><a>Experience</a><a>Community</a><a>Shop</a></nav>
 <span class="members">Members</span>
</div></div>
<div class="wrap">
 <section class="hero"><div>
   <div class="kick">Design system · 2026-11-03</div>
   <h1 class="giant" style="margin-top:14px">Airfryer<br><span class="o">design</span> system.</h1>
   <p class="lead">No espírito broadcast do <b>HÖR</b>: base escura, hierarquia por <b>tamanho + cor</b>, e uma cor-assinatura — o <b>Heat</b>, o laranja das sessões. Rosa, azul e lima entram como <b>acentos semânticos</b> (um por contexto), nunca todos juntos. Assinatura de forma: o raio <b>“janela da airfryer”</b>.</p>
  </div><div class="heromark"><img src="%%LOU%%" alt="Lou"></div></section>
</div>
<div class="wrap">
 <section class="sec"><div class="sec-h"><h2>Cor — papéis</h2><span class="kick">base neutra</span></div>
  <div class="cols">%%COLS%%</div></section>
 <section class="sec"><div class="sec-h"><h2>Cor — acentos</h2><span class="kick">semânticos · 1 por contexto</span></div>
  <div class="cols">%%ACC%%</div>
  <p class="note"><b>Regra:</b> o <b>Heat</b> é o acento primario. Rosa/azul/lima são um set opcional usado por <b>sentido</b> (ex.: cor por gênero na Library), sempre <b>um por contexto</b> e acompanhado de texto/ícone — nunca cor sozinha, nunca os quatro misturados. É assim que a cor vive forte sem virar “kids”.</p>
 </section>
 <section class="sec"><div class="sec-h"><h2>Tipografia</h2><span class="kick">hierarquia por tamanho+cor</span></div>
  <div class="type">%%TYPE%%</div>
  <p class="note">Hierarquia por <b>tamanho e cor</b> (como o HÖR). Nosso tempero: <b>display 800</b> + <b>itálico serifado</b> para acentos editoriais. Pro: <b>Neue Haas / Söhne / Archivo</b> + mono <b>JetBrains</b>.</p></section>
 <section class="sec"><div class="sec-h"><h2>Forma &amp; movimento</h2><span class="kick">janela da airfryer</span></div>
  <div class="shapes">%%SHAPE%%</div>
  <p class="note">Assinatura = raio par da <b>janela da airfryer</b> (vs canto assimétrico do HÖR). Movimento: hover <b>150–180ms</b> ease-out, card sobe 3px + imagem dá zoom leve, play cresce e preenche; REC pulsa 1.6s. Tudo sob <b>prefers-reduced-motion</b>.</p></section>
 <section class="sec"><div class="sec-h"><h2>Componentes</h2><span class="kick">estados ao vivo</span></div>
  <div class="comp">
   <div class="card"><div class="ct">Botões</div><button class="btn btn-o">Watch the session</button><div style="height:10px"></div><button class="btn btn-g">Request an invite</button></div>
   <div class="card"><div class="ct">Status</div><span class="badge">● LIVE</span> <span class="badge" style="background:transparent;color:var(--heat);border:1px solid var(--heat)">REC</span> <span class="gpill" style="cursor:default">Sold out</span></div>
   <div class="card"><div class="ct">Gênero (hover)</div><span class="gpill">House</span><span class="gpill">Afro House</span><span class="gpill">Disco</span></div>
   <div class="card"><div class="ct">Sort</div><div class="sortbar"><span>Sort:</span><span class="on">Newest</span><span>Popular</span><span>Oldest</span></div></div>
  </div></section>
 <section class="sec"><div class="sec-h"><h2>Library — cards</h2><span class="kick">play em SVG · cor por gênero</span></div>
  <div class="lib">%%LIB%%</div>
  <p class="note">Play agora é <b>SVG</b> (não glifo), botão central 56px (toque ok), aparece/preenche no hover e no foco de teclado. Uma barra fina no topo + o ponto do gênero trazem o <b>acento semântico</b> por card.</p></section>
 <section class="sec"><div class="sec-h"><h2>Mascote — Lou</h2><span class="kick">marca de linha · gaveta fechada</span></div>
  <div class="mascot"><div class="box"><img src="%%LOU%%" alt="Lou"></div>
   <div><p class="lead" style="margin-top:0">Marca de linha (creme sobre ink), adulta e gráfica, <b>gaveta fechada</b>. A cor vem do sistema, nunca espalhada no personagem. A arte explosiva da Pri fica nos key visuals/camisa.</p>
    <div class="mini"><div class="sw-mini" style="background:#1C1A17;color:#ECE6DB">creme</div><div class="sw-mini" style="background:#ECE6DB;color:#1C1A17">ink</div><div class="sw-mini" style="background:#FF6A1F;color:#1a1205">heat</div></div></div></div></section>
 <div class="foot"><b>Diferenças do HÖR (de propósito):</b> acento Heat laranja ≠ verde ácido · ink quente ≠ carvão frio · display 800 ≠ peso 400 · raio janela ≠ canto assimétrico · mascote airfryer · numeração AFC/ · acentos por gênero · foto documental real.<br>Direction, not final art.</div>
</div></body></html>"""

HTML = (HTML.replace("%%CSS%%",CSS).replace("%%LOU%%",LOU)
 .replace("%%COLS%%",col_cards(COLORS))
 .replace("%%ACC%%",col_cards(ACCENTS,accent=True))
 .replace("%%TYPE%%",type_rows()).replace("%%SHAPE%%",shape_rows())
 .replace("%%LIB%%","".join(scard(*c) for c in CARDS)))
(HERE/"airfryer-design-system.html").write_text(HTML)
print("built", len(HTML), "bytes")
