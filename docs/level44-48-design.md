# Sectors 44-48 Design

The five reference layouts are registered in image order. Yellow bodies are rocky planets, green outlines are goals, red shapes are asteroid hazards, gray shapes are dust, and dashed arrows are represented by the corresponding fixed-step motion definitions.

## Sector 44: Nested Gravity Orbits

- A small inner planet and a larger outer planet travel counterclockwise on concentric orbits around the central circular goal.
- The outer planet blocks an unassisted center launch. The intended route uses early lateral corrections to pass the moving outer body, then returns through the gap between the two orbits.

## Sector 45: Twin Arc Walls

- Two large ring-segment asteroid walls sweep from the upper map toward the lower map, matching the two red arcs in the reference.
- The top-left quarter-circle goal is reached by taking the narrow left approach around the inner arc wall. The second wall prevents a casual right-side shortcut.

## Sector 46: Diagonal Crossing

- Two rotated rounded-rectangle asteroid regions frame a diagonal dust bridge.
- A rocky planet begins at the lower-left end of the dashed diagonal and moves up and right with a fixed linear velocity. The ship must first clear the moving planet and lower red region, then correct left through the dust bridge toward the top-left goal.

## Sector 47: Bottom-left Wall Gate

- A vertical rounded-rectangle asteroid wall rises from the bottom edge. A matching dust column occupies its upper continuation.
- The rocky sentinel remains in the upper-right quadrant. The goal is a bottom-left quarter-circle closed by the left and bottom map edges, so the ship must go above the wall before turning back into the lower gate.

## Sector 48: Dust Twin Wells

- A full-map rounded-rectangle dust field applies low continuous drag.
- Two static rocky planets form upper and lower gravity wells, with two rounded asteroid guards on each side. The central circular goal is approached by alternating around the side guards and returning to the upper center.

All five sectors use eight bombs, fixed-step lifecycle evaluation, and shared rule geometry for rendering, collision, and debug display. Sector 46's linear planet motion is evaluated by `planetsAtTime`; pausing still freezes the simulation clock and therefore freezes the moving planet.

## Verification

`tests/Level44To48.test.ts` verifies append order, reference geometry, orbit directions, linear planet motion, the bottom boundary goal, dust/hazard composition, and direct-flight failure behavior. Run `npm test` and `npm run build` before release.
