
import { useMemo } from 'react';
import { createSpacingScale, createTypoScale } from '../src/lib/golden-ratio';

export const usePhiSpacing = (baseRem = 1) =>
  useMemo(()=>({
    spacing: createSpacingScale(baseRem),
    fontSize: createTypoScale(baseRem),
  }),[baseRem]);
