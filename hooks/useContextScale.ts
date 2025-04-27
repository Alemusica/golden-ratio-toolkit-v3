
import { useMemo } from 'react';
import {
  createContextScale,
  getContextUnit,
  UnitString,
  hashContext
} from '../lib/golden-ratio';

export const useContextScale = <T extends string>(
  map: Record<T, number>,
  base = 1,
  unit: 'rem' | 'px' | 'vw' | 'vh' = 'rem',
  prec = 3
) =>
  useMemo(()=>createContextScale(map, base, unit, prec),
    [hashContext(map), base, unit, prec]);

export const useContextUnit = <T extends string>(
  map: Record<T, number>,
  a: T, b: T,
  base = 1,
  unit: 'rem' | 'px' | 'vw' | 'vh' = 'rem',
  prec = 3
): UnitString =>
  useMemo(()=>getContextUnit(map,a,b,base,unit,prec),
    [hashContext(map), a, b, base, unit, prec]);
