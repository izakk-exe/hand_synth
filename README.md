# Hand Synth

Webcam-driven musical instrument and 3D sensory playground. Runs as a desktop app on Windows.

**Built by 1Z4K**

![modes](https://img.shields.io/badge/modes-music%20%7C%20sensory%20%7C%20patch-ff2d7a)
![tracking](https://img.shields.io/badge/tracking-MediaPipe%20Hands-44e0ff)
![render](https://img.shields.io/badge/render-Three.js%20%7C%20WebGL-9cff6b)
![audio](https://img.shields.io/badge/audio-Tone.js-c689ff)

---

## What it does

Three modes you can switch between at any time (press `1`, `2`, or `3`):

### 🎵 Music mode
A gesture-controlled synthesizer with a huge pitch display for singing over.
- **Right hand** = melody (one note at a time — the highest extended finger wins)
- **Left hand** = chord bed (the number of extended fingers picks I / IV / V / vi / ii)
- Pentatonic lock over diatonic chords, so nothing clashes
- Choose a key, pick a sound (piano / pad / pluck / organ / flute), optional metronome
- Record the whole performance as a `.webm` audio file

### 🌀 Sensory mode
3D wireframe objects you summon and manipulate with your hands.
- **Pinch** thumb + index → the object materializes between your fingertips
- **Spread your fingers** → the object grows along with the thumb-index distance
- **Two pinches** (one hand each) → stretch the object between your two pinch points
- **Two closed fists** → rotate the object on itself (roll from the hand-to-hand line, yaw/pitch from midpoint translation)
- **One closed fist** → translate the object
- **✕** button in the top-right → dismiss the summoned object

Scenes:
- `air draw` — pinch to draw 3D strokes, release to materialize them (auto-filled shape with wireframe outline); re-pinch to grab, two pinches to scale
- `sculpt` — a deformable wireframe cube with 8 corner handles; pinch a handle to drag it, both fists to spin
- `ball` — a deformable orb with 6 directional handles, same interaction grammar as sculpt
- `cards` — a fan of textured cards between your two pinch points
- `canvas` — your webcam feed stretched onto a floating 3D plane
- `taffy` — an iridescent twisted column with real-time shader
- `sphere` / `blob` / `wave` / `galaxy` — holographic 3D primitives driven by hand position
- `metaballs` / `warp grid` / `paint` — 2D canvas effects (metaballs, deformable mesh, color trails)

### ◈ Patch mode
A visual node graph you can wire together to build your own gesture-driven instrument.
- Drag outputs → inputs to make bezier wires between nodes
- Nodes: `hand`, `osc`, `map`, `lerp`, `sphere`, `cube`, `trail`, `tone`
- Each frame, nodes are evaluated left-to-right; visual + audio sinks fire into the live scene
- Two preset patches: *hand → sphere* and *hand → tone*

---

## Install

Download the latest release from the [Releases](../../releases) tab, or build from source (below).

Two choices:
- **`HandSynth-x.x.x-x64-win.exe`** — classic installer, creates desktop + start-menu shortcuts, no admin required
- **`HandSynth-x.x.x-portable.exe`** — single file, copy anywhere (USB stick, Dropbox folder), double-click to run

### Minimum specs
- Windows 10 or 11, 64-bit
- Webcam
- 4 GB RAM
- Any GPU with WebGL (software fallback included for older machines)
- No internet needed after download

The app is unsigned — on first launch Windows may show "unknown publisher"; click **More info → Run anyway**.

---

## Build from source

Requires Node.js LTS ([download](https://nodejs.org)).

```bash
# clone the repo
git clone <your-repo-url>
cd hand_synth

# run in dev (fast, no packaging)
install\RUN_DEV.bat

# build the Windows installer + portable exe
install\BUILD.bat
# → outputs land in install/output/
```

What the build does:
1. Checks for Node.js (installs via winget if missing)
2. Downloads MediaPipe Hands + Tone.js + Three.js into `vendor/` so the app runs offline
3. Installs Electron + electron-builder locally
4. Packs the Windows installer and portable exe (~92 MB each)

---

## Tech stack

| Layer | Library |
|-------|---------|
| Shell | Electron 32 |
| Hand tracking | MediaPipe Hands (WASM) |
| 3D rendering | Three.js r160 (PBR + custom GLSL) |
| 2D rendering | Canvas 2D + mix-blend-mode |
| Audio | Tone.js (poly/mono synths, envelope filtering, recorder) |
| Packaging | electron-builder (NSIS + portable) |

All vendored libs are MIT / Apache 2.0 licensed and downloaded at build time.

---

## Project structure

```
hand_synth/
├── index.html          app UI + all scene code (one-file app)
├── main.js             electron window + camera permissions + GPU switches
├── preload.js          window-controls bridge
├── package.json        electron-builder config
├── fetch_vendor.js     downloads mediapipe + tone + three into vendor/
└── install/            installation bay
    ├── BUILD.bat       one-click Windows build
    ├── RUN_DEV.bat     dev launcher (no packaging)
    ├── CLEAN.bat       wipe node_modules + dist + vendor + output
    ├── LISEZ-MOI.txt   French end-user instructions
    └── output/         .exe files appear here after BUILD.bat
```

---

## License

Source: MIT (see [LICENSE](LICENSE))

The compiled binaries bundle Electron and its dependencies, each under their own license (BSD / MIT / Apache 2.0).

---

**Built by 1Z4K**
