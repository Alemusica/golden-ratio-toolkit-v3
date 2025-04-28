import plugin from "tailwindcss/plugin";
import { createScale } from "./golden-ratio";

export interface TailwindGoldenRatioOptions {
  base?: number; // e.g. 1rem
  steps?: number;
}

export const createTailwindPlugin = (opts: TailwindGoldenRatioOptions = {}) =>
  plugin(({ addBase, theme }) => {
    const scale = createScale(opts.base ?? 1, opts.steps ?? 5);
    const vars = Object.fromEntries(
      scale.map((v, i) => [
        `--phi-${i}`,
        `${v}rem`,
      ])
    );

    addBase({
      ":root": vars,
    });
  });