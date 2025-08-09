# Starlight Encounters (SFW)

A tiny, SFW visual-novel style demo with clearly adult anime-style characters (25+). No explicit content.

## Run
- Open `index.html` in a modern browser (Chrome/Edge/Firefox). No build needed.
- Save/Load uses localStorage.

## Customize
- Dialogue and flow live in `script.js` inside the `script` object.
- Characters live in `script.js` under `characters`. You can set `sprite` URLs and tweak name colors.
- Backgrounds: call `setBackground('path/to/image.jpg')` per node by adding `bg: 'path'` to nodes. The demo omits images to stay self-contained.
- Sprites: set `sprite` on characters and they will show when that character is the speaker.

## Notes
- All characters are 25+, and the script stays SFW. Please keep additions non-explicit.
- You can add your own images under an `assets/` folder and reference them from nodes/characters.