# Sector 35 Design

## Layout

Sector 35 translates the reference image into a vertical, static concentric challenge:

- The goal is a small circular region at `(195, 92)`, above the ring system.
- The rocky planet is centered at `(195, 430)` with radius `58`.
- The closed asteroid annulus uses inner radius `88` and outer radius `116`.
- The outer closed dust annulus uses inner radius `132` and outer radius `162`.
- The ship starts at the normal bottom deployment position and has eight bombs.

Both annuli are represented by the existing rule-based ring geometry. The same regions drive rendering, sampled-region contact checks, dust drag, and debug display; the planet uses the separate swept collision check. There are no moving hazards or special-case physics.

## Intended Play

The direct vertical route reaches the asteroid annulus before the planet and fails immediately. The intended decision is to use impulses to move through the narrow left-side corridor outside the outer annulus, then recover toward the goal above the ring. The dust annulus slows the ship while it is crossed, so late corrections are costly. The planet's gravity pulls the ship back toward the center throughout the flight.

## Verification

`tests/Level35.test.ts` verifies catalog append order, concentric radii, goal placement, direct-flight asteroid failure, and safe corridor geometry around both rings.
