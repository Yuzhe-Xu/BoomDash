# Sectors 49-50 Design

The two reference layouts are appended in image order. Yellow bodies are rocky planets, green outlines or filled corner regions are goals, red regions are asteroid hazards, and the dashed orbit in the references is represented by fixed-step motion data.

## Sector 49: Three-Body Orbit Gate

- Three rocky planets share a circular counterclockwise orbit around the upper-middle of the map. Their starting phases match the top, lower-left, and lower-right positions in the reference.
- Two rounded asteroid walls sit on the left and right sides of the orbit. The center gap is open at launch, but the moving planets make a straight flight collide with the top body.
- The intended route uses staged lateral blasts to pass one side of the lower pair, clear the orbiting bodies, and return to the small rounded goal above the orbit.

## Sector 50: Rotating Four-Point Core

- A rocky planet is fixed at the center of four triangular asteroid regions. The four triangles rotate counterclockwise around the planet at `0.1 rad/s`.
- The left and right rounded asteroid gates remain fixed below the rotating core. Region-level motion declarations keep these gates stationary while the central assembly rotates.
- Two top corner quarter-circle goals provide symmetric route choices. An unassisted launch is intercepted by the planet or the rotating asteroid assembly; timed blasts can cross a rotating diagonal gap and enter either corner.

Both sectors use eight bombs, fixed-step lifecycle evaluation, and shared rule geometry. Sector 50's region-level hazard motion is evaluated by `hazardsAtTime` for rendering, collision, and debug display, so pausing freezes the assembly without moving the side gates.

## Verification

`tests/Level49To50.test.ts` verifies append order, orbit phases and direction, corner goal closure, rotating central geometry, stationary side gates, direct-flight failures, and fixed-step success routes. Run `npm test` and `npm run build`; headed browser checks remain part of the pending batch verification.
