# Sectors 36-39 Design

## Reference Mapping

Sector 35 remains the previously released concentric planet, asteroid ring, and outer dust ring. The four supplied reference layouts are added in order as sectors 36-39.

## Sector 36: Planetary Cup

- A rocky planet sits above a circular goal.
- A lower open asteroid annulus forms a cup below the goal; its opening is the approach window.
- The ship must leave the center lane, pass outside the cup, and return through the gap between the planet and goal. The planet's gravity makes a late correction unreliable.

## Sector 37: Twin-Planet Channel

- Two equal rocky planets flank the center lane.
- The goal is centered above them and there are no asteroid or dust regions.
- The center channel is intentionally readable, while an off-center launch is pulled toward one of the two wells. This is a calibration level for managing symmetrical gravity.

## Sector 38: Triangle And Dust

- Two planets guard the upper approach.
- A red triangle blocks the direct center route.
- A rounded rectangular dust field occupies the lower flight path. It slows the ship but does not fail it, so the player must preserve an impulse for the triangle and then correct between the two planets.

## Sector 39: Orbiting Gate

- A large offset circular dust field surrounds a rocky planet.
- One circular asteroid moves around the planet using the fixed-step hazard motion clock.
- The rounded-rectangle goal is in the upper-right corner. The intended route crosses the dust with speed, avoids the moving asteroid, and exits toward the corner rather than aiming directly at the gravity well.

All regions use the existing circle, ring, triangle, and rounded-rectangle definitions. Rendering, sampled-region contact, dust drag, dynamic geometry, and debug display continue to read the same level data; only planet contact uses a ship-segment sweep.

## Verification

`tests/Level36To39.test.ts` verifies append order, reference geometry, direct hazard failures, the sector 37 center route, and sector 39's moving hazard definition. `npm test` and `npm run build` are required before release.
