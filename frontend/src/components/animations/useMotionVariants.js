import { useMemo } from 'react';
import { containerStagger, listItem, fadeUp, scalePop } from './presets';

export const useMotionVariants = (opts = {}) => {
  const { stagger = 0.08 } = opts;

  return useMemo(() => ({
    container: containerStagger(stagger),
    item: listItem,
    fadeUp,
    scalePop
  }), [stagger]);
};

export default useMotionVariants;