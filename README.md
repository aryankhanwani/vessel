# VESSEL

A single-page, scroll-driven site for an imagined creative & production studio.

The whole page is one continuous camera take over one WebGL frame. There is no
navbar, no body, no footer — seven **acts** of scroll instead, with the fixed
chrome living in the four corners and a tick rail down the right edge.

The studio's identity is the technique: a **lathe**. Every form on the page is a
drawn profile revolved around an axis, and the scroll is what turns it.

## Running it

```bash
npm install     # .npmrc sets legacy-peer-deps (R3F declares an optional Expo peer)
npm run dev     # http://localhost:3000
npm run build
```

## The seven acts

| # | Act | What the scroll does |
|---|-----|----------------------|
| 00 | Threshold | A vase profile draws itself as a 1px line beside the opening statement |
| 01 | Turning | That profile revolves 0 → 360°, surface trailing behind the cutting edge |
| 02 | Index | Six disciplines, each landing on a different part of the grid |
| 03 | Works | Four projects, each a held frame read as a spread across three corners |
| 04 | Corridor | An endless archive of turned forms is pulled past the lens |
| 05 | Manifesto | Fragments arrive and stay, assembling a paragraph across the frame |
| 06 | Sign-off | The form collapses back into the line it came from |

Act lengths live in `lib/acts.ts` — change a `vh` there and everything else
(camera, rail, beat timings, the index overlay's jump targets) follows.

## How it is built

**One mutable object, no scroll renders.** `lib/state.ts` holds scroll progress,
per-act progress, velocity and pointer. ScrollTrigger writes it, `useFrame` and
one rAF loop read it. React never sees a scroll frame.

**The lathe is hand-rolled.** `lib/lathe.ts` allocates its buffers once and
rewrites positions and normals in place, so a form can morph between silhouettes
*and* unfurl around its axis at 60fps. three's own `LatheGeometry` rebuilds every
buffer on any change, which is far too costly per frame. Normals come from the
2D profile tangent rotated around Y — exact, and much cheaper than
`computeVertexNormals()`. Profiles are Catmull-Rom splines resampled to a fixed
count so any two can be blended (`lib/profiles.ts`).

**Beats.** `components/Beat.tsx` is the workhorse: a fragment with an enter and
exit window expressed in its act's own 0–1 progress. One held frame can carry a
dozen pieces of copy that arrive and leave on their own schedule. All beats share
a single rAF loop that writes styles directly to the elements.

**Placement is manual.** `components/Cell.tsx` puts every piece of copy on a
12×12 grid by hand, with a separate position for narrow screens. Nothing is
centred and no two things sit in the same place twice.

**Camera.** `components/three/Rig.tsx` is a shot list — one per act, ends
authored to meet, so the page is a single take. Lateral offsets scale with the
viewport so a shot framed for a desktop doesn't push the form off a phone.

## Palette

Near-black, bone, and one oxidised ember used sparingly. No gradients as colour —
falloff happens in WebGL. Light comes from local `Lightformer`s (a cold key wall
left, an ember rim right), so nothing is fetched at runtime.

Type is Instrument Serif for voice, Inter 200/300 for asides, JetBrains Mono for
instrument readouts. Nothing heavier than 400.

## Performance notes

- No image, video or HDRI assets — dust sprites and the environment are generated at runtime.
- The hero rebuilds ~12k vertices per frame in place; the corridor is 14 static geometries recycled through a 60-unit loop.
- `Governor` in `Scene.tsx` sheds post-processing once, permanently, if frames are consistently over 90ms.
- `prefers-reduced-motion` disables smooth scrolling, grain animation and post-processing. Beats still work — they are scroll-position driven, not time driven.
