# 🦋 Golden-Ratio Toolkit *v3.0*

A **tiny, tree-shakable TypeScript library** for building interfaces and design-systems whose rhythm, spacing and typography all follow the golden ratio (φ ≈ 1 .618).

* **Zero-dependency core** (ESM + CJS)
* **Cache-backed math** for lightning-fast runtime
* **High-precision mode** for scientific or generative-art work
* **Unit helpers, scales, responsive clamp**
* **Context-aware tokens** that keep headings, body-copy and gaps harmonious
* **First-class React hooks**
* **Tailwind / CSS-var generators**
* Complete **Vitest suite** and dual-build via *tsup*

---

## Installation

### Via GitHub (until npm publish)

```bash
# default branch
npm install github:alemusica/golden-ratio-toolkit-v3

# specific tag
npm install github:alemusica/golden-ratio-toolkit-v3#v3.0.0
```

<details>
<summary>Planned npm publish</summary>

```bash
npm install golden-ratio-toolkit-v3   # or pnpm / yarn
```

> The package ships as **ESM** (`dist/index.js`) and **CommonJS** (`dist/index.cjs`); typings included.
</details>

---

## Quick start

```ts
import { rem, phiClamp, createSpacingScale } from 'golden-ratio-toolkit-v3';

const h1     = rem(1, 2);          // → '2.618rem'
const fluid  = phiClamp(1);        // clamp(1rem, …, 1.618rem)

const space  = createSpacingScale(); 
// { '2': '0.405rem', '3': '0.654rem', … }
```

### React

```tsx
import { usePhi, usePhiSpacing, useContextScale } from 'golden-ratio-toolkit-v3/hooks';

function Card() {
  const { rem }     = usePhi();              // 1rem × φⁿ
  const { spacing } = usePhiSpacing(1);      // spacing.xl, lg …
  const headings    = useContextScale({ h1: 3, h2: 2 });

  return (
    <article style={{ padding: spacing.lg }}>
      <h1 style={{ fontSize: headings.h1 }}>Title</h1>
      <p style={{ fontSize: rem(0) }}>Body copy</p>
    </article>
  );
}
```

### Tailwind

```js
// tailwind.config.js
const { createTailwindPlugin } = require('golden-ratio-toolkit-v3');

module.exports = {
  plugins: [createTailwindPlugin()],
};
```

---

## API reference

| Category      | Functions / constants |
|---------------|-----------------------|
| **Math**      | `PHI`, `PHI_SMALL`, `PHI_SQUARED`, `phi(power)`, `phiPrecise(power, digits)` |
| **Units**     | `toUnit(unit, precision)`, **shortcuts** `rem`, `px`, `em`, `vw`, `vh`, `pct` |
| **Responsive**| `phiClamp(min, powerSpan, minW, maxW, unit, precision)` |
| **Scales**    | `createSpacingScale(base?, prec?)`, `createTypoScale(base?, prec?)` |
| **Contextual**| `createContextScale(map, base?, unit?, prec?)`, `getContextRatio(map, a, b)`, `getContextUnit(map, a, b, base?, unit?, prec?)` |
| **Hash helper** | `hashContext(map)` – stable key for React deps |
| **CSS / build** | `phiCSS(prec)`, `createTailwindPlugin()` |
| **Hooks**       | `usePhi`, `usePhiSpacing`, `useContextScale`, `useContextUnit` |
| **Precision**   | `phiPrecise()` for 1-15 significant digits |

---

## Contextual scales 🌻

Keep H1, H2 and body copy perpetually harmonious:

```ts
const ratioMap = { h1: 3, h2: 2, body: 0 };   // φ-powers
const tokens   = createContextScale(ratioMap);
// { h1: '4.236rem', h2: '2.618rem', body: '1rem' }

getContextUnit(ratioMap, 'h1', 'h2'); // '1.618rem'
```

Use `hashContext(ratioMap)` as a dependency key so hooks don’t recalc on every render.

---

## High-precision mode 🔬

```ts
phiPrecise(1, 12);  // 1.61803398875  (12 significant digits)
```

Ideal for algorithmic art where rounding errors are visible.

---

## Bundling & tree-shaking

Built with **tsup**:

```
dist/
  index.js        (ESM, side-effects-free)
  index.cjs       (CommonJS)
  index.d.ts
```

`package.json` sets proper `exports` + `sideEffects:false` so unused helpers drop out of your bundle.

---

## Tests

```bash
pnpm test
```

Coverage: constants, cache hits, custom units, clamp edge-cases, contextual maps, precision paths.

---

## Contributing

1. `pnpm i`
2. `pnpm dev` – rebuild on change
3. `pnpm test --watch`
4. PRs welcome! Check `/docs` branch for storybook playground.

---

## License

MIT © 2025 Alessio Ivoy Cazzaniga
