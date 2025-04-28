
// ──────────────────────────────────────────────────────────────
// File: lib/golden-ratio.ts  ✧  Golden‑Ratio Toolkit (v3.0)
// ──────────────────────────────────────────────────────────────

export const PHI = 1.618033988749895;
export const PHI_SMALL = 1 / PHI;            // φ⁻¹
export const PHI_SQUARED = PHI * PHI;        // φ²

// ─── core math with cache ────────────────────────────────────
const _cache: Record<number, number> = {};
for (let p = -10; p <= 10; p++) _cache[p] = Math.pow(PHI, p); // warm‑up

export const phi = /* @__PURE__ */ (power: number = 1): number =>
  _cache[power] ?? (_cache[power] = Math.pow(PHI, power));

/** High‑precision variant (to 1‑15 significant digits). */
export const phiPrecise = (power: number = 1, digits: number = 15): number =>
  parseFloat(Math.pow(PHI, power).toPrecision(Math.min(Math.max(digits, 1), 21)));

// ─── unit factory ─────────────────────────────────────────────
type Unit = 'rem' | 'px' | 'vw' | 'vh' | '%' | 'em' | (string & {});
export type UnitString<U extends string = Unit> = `${number}${U}`;

export const toUnit = /* @__PURE__ */ <U extends string>(unit: U, prec = 3) =>
  (base = 1, power = 1, precision = prec): UnitString<U> =>
    `${+(base * phi(power)).toFixed(precision)}${unit}` as UnitString<U>;

export const rem = toUnit('rem');
export const px  = toUnit('px', 0);
export const em  = toUnit('em');
export const vw  = toUnit('vw');
export const vh  = toUnit('vh');
export const pct = toUnit('%');

// ─── responsive clamp ────────────────────────────────────────
export const phiClamp = (
  min: number,
  powerSpan = 1,
  minW = 320,
  maxW = 1920,
  unit: Unit = 'rem',
  prec = 3,
): string => {
  const max = min * phi(powerSpan);
  const fmt = (v: number) => v.toFixed(prec);
  return `clamp(${fmt(min)}${unit}, calc(${fmt(min)}${unit} + (${fmt(max - min)} * ((100vw - ${minW}px) / (${maxW} - ${minW})))), ${fmt(max)}${unit})`;
};

// ─── scales ──────────────────────────────────────────────────
export const createSpacingScale = (base = 0.25, prec = 3) => {
  const toRem = toUnit('rem', prec);
  const keys = ['0','px','0.5','1','2','3','4','5','6','8','10','12','16','20','24','32'];
  const powers = [Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY,-1,0,1,2,3,4,5,6,7,8,9,10,11,12];
  return keys.reduce<Record<string,string>>((o,k,i)=>{
    if(k==='0') o[k]='0';
    else if(k==='px') o[k]='1px';
    else o[k]=toRem(base,powers[i]);
    return o;
  },{});
};

export const createTypoScale = (base = 1, prec = 3) => {
  const toRem = toUnit('rem', prec);
  const keys = ['3xs','2xs','xs','sm','base','md','lg','xl','2xl','3xl','4xl','5xl'];
  const powers = [-3,-2,-1,-0.5,0,0.5,1,1.5,2,3,4,5];
  return keys.reduce<Record<string,string>>((o,k,i)=>(o[k]=toRem(base,powers[i]),o),{});
};

// ─── contextual scales & ratios ───────────────────────────────
export function createContextScale<T extends string, U extends Unit = 'rem'>(
  context: Record<T, number>,
  base = 1,
  unit: U = 'rem' as U,
  prec = 3
): Record<T, UnitString<U>> {
  const toU = toUnit(unit, prec);
  return Object.fromEntries(
    Object.entries(context).map(([k,p])=>[k,toU(base,p as number)])
  ) as Record<T, UnitString<U>>;
}

export const getContextRatio = <T extends string>(
  context: Record<T, number>,
  a: T, b: T
) => phi(context[a] - context[b]);

export const getContextUnit = <T extends string, U extends Unit = 'rem'>(
  context: Record<T, number>,
  a: T, b: T,
  base = 1, unit: U = 'rem' as U, prec = 3
): UnitString<U> =>
  `${+(base * getContextRatio(context,a,b)).toFixed(prec)}${unit}` as UnitString<U>;

// hash helper for React deps
export const hashContext = (ctx: Record<string, number>) =>
  Object.entries(ctx).sort().map(([k,v])=>k+v).join('|');

// ─── tailwind & css-vars ─────────────────────────────────────
export const createTailwindPlugin = () => ({
  handler({ addBase }: { addBase: (o: Record<string, any>) => void }) {
    addBase({ ':root': { '--phi': PHI, '--phi-small': PHI_SMALL, '--phi-squared': PHI_SQUARED } });
  }
});

export const phiCSS = (prec = 6) =>
  `:root{--phi:${PHI.toFixed(prec)};--phi-small:${PHI_SMALL.toFixed(prec)};--phi-squared:${PHI_SQUARED.toFixed(prec)};}`;
