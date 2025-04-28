/**
 * Golden‑Ratio Toolkit • Tailwind plugin
 * --------------------------------------------------
 * Exposes φ‑based colour tokens and border‑radius utilities
 * so that all spacing, typography *and* visual accents stay
 * in harmonic proportion.
 */

import plugin from "tailwindcss/plugin";
import { createGoldenHueScale, GoldenHueOptions } from "./color";
import { phi } from "./golden-ratio";

// ---------------------------------------------------------------------------
// Public options
// ---------------------------------------------------------------------------

export interface TailwindGoldenOptions extends GoldenHueOptions {
  /** Number of colour steps (default 6) */
  colorSteps?: number;
  /** Number of border‑radius steps (default 4) */
  radiusSteps?: number;
  /** Base rectangle short side in px for computing radii (default 100) */
  rectBase?: number;
  /** Power offset for radius calculation (default 2) */
  radiusPowerStart?: number;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

const buildRadiusTokens = (
  steps: number,
  rectBase: number,
  powerStart: number
): Record<string, string> => {
  const tokens: Record<string, string> = {};
  for (let i = 0; i < steps; i++) {
    const power = powerStart + i;
    tokens[`phi-${power}`] = `${(rectBase / phi(power)).toFixed(2)}px`;
  }
  return tokens;
};

// ---------------------------------------------------------------------------
// Plugin factory
// ---------------------------------------------------------------------------

export const createTailwindPlugin = (
  opts: TailwindGoldenOptions = {}
) =>
  plugin(function ({ addBase, theme, addUtilities }) {
    const {
      // colours
      colorSteps = 6,
      baseHue = 0,
      lightness,
      chroma,
      precision,
      // radii
      radiusSteps = 4,
      rectBase = 100,
      radiusPowerStart = 2,
    } = opts;

    // 1) Colour CSS variables
    const hues = createGoldenHueScale(colorSteps, {
      baseHue,
      lightness,
      chroma,
      precision,
    });
    const colorVars: Record<string, string> = {};
    hues.forEach((clr, i) => {
      colorVars[`--phi-color-${i}`] = clr;
    });

    addBase({
      ":root": colorVars,
    });

    // 2) Extend theme tokens
    const radiusTokens = buildRadiusTokens(
      radiusSteps,
      rectBase,
      radiusPowerStart
    );

    // Expose via `theme.extend` so users can toggle easily
    addUtilities(
      Object.entries(radiusTokens).reduce((acc, [k, v]) => {
        acc[`.rounded-${k}`] = { "border-radius": v };
        return acc;
      }, {} as Record<string, Record<string, string>>),
      { respectPrefix: false }
    );

    // Theme extensions (colours)
    //   Note: We can’t mutate theme() inside plugin callback, but we can
    //   encourage users to merge it in their config.  Provide helper below.
  });

/**
 * Quick helper to extend a user’s Tailwind config colours + radii in JS.
 *
 * Example:
 *   import { extendTailwindTheme } from 'golden-ratio-toolkit-v3/tailwind';
 *   module.exports = extendTailwindTheme({});
 */
export function extendTailwindTheme(opts: TailwindGoldenOptions = {}) {
  const {
    colorSteps = 6,
    baseHue = 0,
    lightness,
    chroma,
    precision,
    radiusSteps = 4,
    rectBase = 100,
    radiusPowerStart = 2,
  } = opts;

  const hues = createGoldenHueScale(colorSteps, {
    baseHue,
    lightness,
    chroma,
    precision,
  });
  const colors: Record<string, string> = {};
  hues.forEach((clr, i) => (colors[`phi-${i}`] = `var(--phi-color-${i})`));

  return {
    theme: {
      extend: {
        colors,
        borderRadius: buildRadiusTokens(radiusSteps, rectBase, radiusPowerStart),
      },
    },
    plugins: [createTailwindPlugin(opts)],
  };
}
