
import { describe, it, expect } from 'vitest';
import {
  PHI, PHI_SMALL, PHI_SQUARED,
  phi, phiPrecise,
  rem, px, vw, vh,
  createTypoScale, createSpacingScale,
  phiClamp, toUnit,
  createContextScale, getContextRatio, getContextUnit
} from '../src/lib/golden-ratio';

describe('Golden-ratio utilities', () => {
  it('constants', () => {
    expect(PHI).toBeCloseTo(1.6180339887);
    expect(PHI_SMALL).toBeCloseTo(0.6180339887);
    expect(PHI_SQUARED).toBeCloseTo(2.6180339887);
  });
  it('phi cache', () => {
    expect(phi(3)).toBe(phi(3));
  });
  it('phiPrecise digits', () => {
    expect(phiPrecise(1,12).toPrecision(12)).toBe('1.61803398875');
  });
  it('units', () => {
    expect(rem()).toBe('1.618rem');
    expect(px(10)).toBe('16px');
  });
  it('clamp', () => {
    expect(phiClamp(1)).toContain('clamp(');
  });
  it('scales', () => {
    expect(createTypoScale().lg).toBe('1.618rem');
    expect(createSpacingScale()['2']).toBe('0.405rem');
  });
  it('context', () => {
    const map = { h1:3,h2:2 } as const;
    expect(createContextScale(map).h1).toBe('4.236rem');
    expect(getContextRatio(map,'h1','h2')).toBeCloseTo(1.618);
    expect(getContextUnit(map,'h1','h2')).toBe('1.618rem');
  });
});
