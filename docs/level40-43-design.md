# Sectors 40-43 Design

## Reference Mapping

The four supplied layouts are added in order as sectors 40-43. Yellow bodies are rocky planets, green regions are goals, and the dashed paths in the references are represented by kinematic circular planet orbits. Orbiting planets keep their own gravity and collision radius while their centers move from the fixed-step simulation clock.

## Sector 40: Counterclockwise Scout

- A large rocky planet is the central gravity core.
- A smaller planet starts at the upper-right point of a wide counterclockwise orbit around the core.
- The rounded-rectangle goal is above the orbit. A straight launch falls into the core; two corrections bend the ship around the lower side of the gravity well and back into the goal.

## Sector 41: Twin Converging Orbits

- Two equal planets start on the lower-left and lower-right sides of mirrored circular orbits.
- The left planet travels upward on the left side and the right planet travels upward on the right side, leaving a readable center channel at launch.
- The centered rounded-rectangle goal rewards holding the ship in the channel. A lateral correction moves the ship into one of the moving gravity wells.

## Sector 42: Crossing Orbits

- The left planet starts low on the left and rises along its orbit.
- The right planet starts high on the right and descends along the same orbital family, matching the staggered reference composition.
- The center goal remains visible, but an unassisted flight meets the crossing right-hand gravity well. Two timed impulses create the required side step and return to the center approach.

## Sector 43: Three-Body Corner Gate

- A large rocky planet sits below and right of center as the main gravity well.
- Two smaller planets orbit it counterclockwise on different radii, one beginning at the left side and one above-right.
- The goal is a top-right quarter-circle closed by the map's top and right edges. The ship must leave the core's direct approach, then enter the boundary goal from below-left after the moving guards open the route.

All goals remain rule-based circles, rounded rectangles, or boundary-closed quarter circles. Planet positions are evaluated through `planetsAtTime` for gravity, swept collision, rendering, and debug display. The new motion does not alter planet spin or the existing speed-cap and fixed-step rules.

## Verification

`tests/Level40To43.test.ts` verifies append order, reference placement, orbit direction and radius, direct planet failures, the sector 41 center route, the recommended two-blast routes for sectors 42-43, and pause freezing. `npm test` and `npm run build` are required before release.
