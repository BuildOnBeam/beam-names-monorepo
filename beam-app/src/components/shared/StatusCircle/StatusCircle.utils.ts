import { token } from '@onbeam/styled-system/tokens';
import { Transition } from 'motion/react';

export const statusColorMap = {
  success: token('colors.green.400'),
  error: token('colors.red.500'),
  loading: token('colors.mono.300'),
};

export const getStatusAnimationMap = (transition?: Transition) => ({
  success: {
    initial: { pathLength: 0 },
    animate: { pathLength: 1.01 },
    transition: { type: 'spring', duration: 1, bounce: 0, ...transition },
  },
  error: {
    initial: { pathLength: 0 },
    animate: { pathLength: 1.01 },
    transition: { type: 'spring', duration: 1, bounce: 0, ...transition },
  },
  loading: {
    initial: { pathLength: 0.25 },
    animate: { rotate: 360 },
    transition: {
      ease: 'linear',
      duration: 1,
      repeat: Number.POSITIVE_INFINITY,
      ...transition,
    },
  },
});
