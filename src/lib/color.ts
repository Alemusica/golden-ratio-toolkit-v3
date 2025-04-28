/**
 * Golden‑Ratio Toolkit • Color helpers (OKLCH)
 * -------------------------------------------------
 * Utilities for generating harmonious colour palettes whose
 * hues are spaced by the golden angle (~137.508°).  We emit
 * colours in the OKLCH space so that perceptual lightness is
 * preserved across the wheel.  All helpers are side‑effect‑free
 * and tree‑shakable.
 *
 * Usage:
 *   import {
 *     goldenHue,
 *     oklch,
 *     createGoldenHueScale,
 *   } from "./color";
 *
 *   const primary = oklch(0.78, 0.16, goldenHue(0));
 *   const palette = createGoldenHueScale(6); // 6‑colour palette
 *
 * Why OKLCH? — It is perceptually uniform, meaning equal
 * increments in C (chroma) or L (lightness) correspond to
 * roughly equal perceived changes.  That keeps the palette in
 * “vera armonia e pace vera”.
 */

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/**
 * Golden angle in degrees (360° / φ²)
 * Ref: https://en.wikipedia.org/wiki/Golden_angle
 */
export const GOLDEN_ANGLE_DEG = 137.50776405003785;

// Default perceptual values – tweak to taste or pass via options
const DEFAULT_LIGHTNESS = 0.78; // 0–1 (OKLCH L*)
const DEFAULT_CHROMA = 0.16;    // 0–~0.4 safe for WCAG AA on white

// ---------------------------------------------------------------------------
// Core helpers
// ---------------------------------------------------------------------------

/**
 * Returns the n‑th hue (deg 0‑360) rotated by the golden angle.
 */
export function goldenHue(index: number, baseHue = 0): number {
  const hue = (baseHue + index * GOLDEN_ANGLE_DEG) % 360;
  return hue < 0 ? hue + 360 : hue;
}

/**
 * Helper to format an OKLCH string with desired precision.
 */
export function oklch(
  lightness: number,
  chroma: number,
  hueDeg: number,
  precision: number = 3
): string {
  const L = lightness.toFixed(precision);
  const C = chroma.toFixed(precision);
  const H = hueDeg.toFixed(1);
  return `oklch(${L} ${C} ${H})`;
}

/**
 * Create an array of OKLCH colours whose hues follow the golden angle.
 *
 * @param steps   Number of colours to generate (≥ 1)
 * @param opts    Optional overrides for base hue, lightness, chroma, precision
 * @returns       String array of `length === steps`, each `"oklch(L C H)"`
 */
export interface GoldenHueOptions {
  /** Starting hue (deg). *Default 0* */
  baseHue?: number;
  /** Lightness 0–1 (OKLCH). *Default 0.78* */
  lightness?: number;
  /** Chroma 0–≈0.4 for safe SRGB. *Default 0.16* */
  chroma?: number;
  /** Decimal places for L & C. *Default 3* */
  precision?: number;
}

export function createGoldenHueScale(
  steps: number,
  opts: GoldenHueOptions = {}
): string[] {
  if (steps < 1 || !Number.isFinite(steps)) {
    throw new RangeError("steps must be a positive integer ≥ 1");
  }

  const {
    baseHue = 0,
    lightness = DEFAULT_LIGHTNESS,
    chroma = DEFAULT_CHROMA,
    precision = 3,
  } = opts;

  return Array.from({ length: steps }, (_, i) =>
    oklch(lightness, chroma, goldenHue(i, baseHue), precision)
  );
}

// ---------------------------------------------------------------------------
// Named exports for treeshaking friendliness
// ---------------------------------------------------------------------------
export const phiHue = goldenHue; // alias for consistency with spacing helpers
