
import { useMemo } from 'react';
import { PHI, PHI_SMALL, phi, rem, vw, vh } from '../lib/golden-ratio';

export const usePhi = (base = 1) =>
  useMemo(()=>({
    PHI,
    PHI_SMALL,
    phi: (p = 1) => base * phi(p),
    rem: (p = 1, prec?: number) => rem(base,p,prec),
    vw:  (p = 1, prec?: number) => vw(base,p,prec),
    vh:  (p = 1, prec?: number) => vh(base,p,prec),
  }),[base]);
