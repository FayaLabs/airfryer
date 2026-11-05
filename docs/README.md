# Docs

| Looking for | Go to |
|---|---|
| Steps to put the new site live | [cutover.md](cutover.md) |
| Colours, type and components | [`brand/system/airfryer-design-system.html`](../brand/system/airfryer-design-system.html) |
| Commit and PR rules | [`AGENTS.md`](../AGENTS.md) |
| Process map, live at `/processo/` | [`public/processo/`](../public/processo/) |
| Salva Discos dossier, live at `/salvadiscos/` | [`public/salvadiscos/`](../public/salvadiscos/) |
| Tooling that prints the Salva Discos dossier to PDF | [`legacy/salvadiscos/`](../legacy/salvadiscos/) |
| Old partnerships dossier, replaced by the `/partnerships` page | [`legacy/partnerships/`](../legacy/partnerships/) |

## Design rules

- **Heat yellow (`#FDD327`) marks the main action and the current state only.**
  Secondary buttons are cream, and accented words are cream serif italic.
- **Genre colours** (rosa, azul, lima) appear once per Library card, always next
  to the genre's name.
- **The final logo and mascot are hand-made SVG.** The current Lou images are AI
  stand-ins, and AI is otherwise for key visuals only. Never generate a real
  person's face.

## Kept out of this repository

This repository is public, so these stay on local machines. `.gitignore` covers
the paths below.

- `docs/refs/`: teardowns of HÖR and Boiler Room, with third-party screenshots
  and fonts.
- `brand/explorations/`: image generation work, 253 MB.
- `brand/direction-*/` and `brand/AUDIT.md`: earlier brand directions and the
  audit made before the rebrand.
