'use client';

import { getStatusAnimationMap, statusColorMap } from './StatusCircle.utils';
import { StatusCircleProps } from './StatusCircle.types';
import { css, cx } from '@onbeam/styled-system/css';
import { flex } from '@onbeam/styled-system/patterns';
import { token } from '@onbeam/styled-system/tokens';
import { motion } from 'motion/react';

export const StatusCircle = ({
  status,
  className,
  children,
  transition,
  ...props
}: StatusCircleProps) => (
  <div
    className={cx(
      flex({
        pos: 'relative',
        w: '[10rem]',
        h: '[10rem]',
        align: 'center',
        justify: 'center',
      }),
      className,
    )}
    {...props}
  >
    <svg
      className={css({ pos: 'absolute', inset: '0', rotate: '[-90deg]' })}
      width={160}
      height={160}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx={80}
        cy={80}
        r={76}
        stroke={token('colors.mono.1000')}
        strokeWidth={8}
      />
      {status && (
        <motion.circle
          key={status}
          cx={80}
          cy={80}
          r={76}
          stroke={statusColorMap[status]}
          strokeWidth={2}
          {...getStatusAnimationMap(transition)[status]}
        />
      )}
    </svg>
    {children}
  </div>
);
