/**
 * Golden‑Ratio Toolkit • Layout helpers (rectangles & corner radii)
 * -----------------------------------------------------------------
 * Utilities for computing sizes that remain mathematically bound to
 * φ.  They cover two common UI needs:
 *   1. **Golden rectangles** – ensure a width / height pair follows
 *      the φ:1 proportion.
 *   2. **Rounded‑corner radii** – generate radii that are a further
 *      golden subdivision of the shortest rectangle side so that
 *      bevels themselves feel in‑harmony with the host component.
 *
 * All helpers are side‑effect‑free and tree‑shakable.
 */

import { phi } from "./golden-ratio";

// ---------------------------------------------------------------------------
// Golden rectangle helpers
// ---------------------------------------------------------------------------

export interface GoldenRect {
  width: number;
  height: number;
}

/**
 * Given one side, compute the other so that `height / width = φ`.
 * If both sides are provided we adjust the missing one only when
 * it breaks the ratio (within ε tolerance).
 */
export function goldenRectangle({
  width,
  height,
}: Partial<GoldenRect> & { width?: number; height?: number }): GoldenRect {
  if (width == null && height == null) {
    throw new Error("Provide at least width or height");
  }
  const ratio = phi(1); // φ ≈ 1.618
  const eps = 0.0001; // tolerance for floating‑point comparison

  if (width != null && height != null) {
    // Adjust the lesser‑significant side only if ratio breached
    const current = height / width;
    if (Math.abs(current - ratio) < eps) return { width, height };
    // Prefer keeping the larger dim unchanged
    if (current > ratio) {
      // height too big → scale width
      return { width: height / ratio, height };
    }
    // width too big → scale height
    return { width, height: width * ratio };
  }

  if (width != null) return { width, height: width * ratio };
  return { height, width: height! / ratio };
}

// ---------------------------------------------------------------------------
// Corner radius helpers
// ---------------------------------------------------------------------------

export interface GoldenRadiusOptions {
  /**
   * Which power of φ to divide by.  1 → side / φ, 2 → side / φ², …
   * Defaults to 2 so that the radius is a gentle ~0.382× of the
   * shorter side (visually pleasing, rarely over‑rounded).
   */
  power?: number;
}

/**
 * Compute a corner radius that is a golden subdivision of the smallest side.
 *
 * Example – a 400×250 card: `minSide = 250`, radius = 250 / φ² ≈ 95px.
 */
export function goldenCornerRadius(
  { width, height }: GoldenRect,
  opts: GoldenRadiusOptions = {}
): number {
  const { power = 2 } = opts;
  const minSide = Math.min(width, height);
  return minSide / phi(power);
}
