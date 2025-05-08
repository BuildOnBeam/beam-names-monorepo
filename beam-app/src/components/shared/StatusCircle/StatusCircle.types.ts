import { Transition } from 'motion/react';
import { HTMLAttributes } from 'react';

export type StatusCircleStatus = 'success' | 'error' | 'loading';

export type StatusCircleProps = {
  status?: StatusCircleStatus;
  transition?: Transition;
} & HTMLAttributes<HTMLDivElement>;
