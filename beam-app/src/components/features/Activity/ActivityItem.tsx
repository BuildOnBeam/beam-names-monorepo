import { getExplorerUrl } from '@/helpers/getExplorerUrl';
import { ActivityItemProps } from './ActivityItem.types';
import { ForwardIcon } from '@onbeam/icons';
import { css, cx } from '@onbeam/styled-system/css';
import {
  flex,
  linkOverlay,
  text,
  vstack,
} from '@onbeam/styled-system/patterns';
import { formatAddress, formatTokenAmount } from '@onbeam/utils';
import { format } from 'date-fns';

export const ActivityItem = ({
  hash,
  from,
  to,
  value,
  timestamp,
}: ActivityItemProps) => (
  <div
    className={flex({
      p: '2',
      pos: 'relative',
      w: 'full',
      direction: 'column',
      gap: '2',
      justify: 'space-between',
      rounded: 'md',
      transition: 'colors',
      md: {
        alignItems: 'center',
        flexDir: 'row',
      },
      _hover: {
        bg: 'mono.250',
      },
    })}
  >
    <div className={vstack()}>
      <a
        href={getExplorerUrl(hash)}
        target="_blank"
        rel="noopener noreferrer"
        className={cx(
          linkOverlay(),
          text({ style: 'base', md: { textStyle: 'md' } }),
        )}
      >
        {formatAddress(hash)}
      </a>
      <span className={text({ style: 'xs', color: 'mono.300' })}>
        {format(timestamp, 'PPpp')}
      </span>
    </div>
    <div className={flex({ gap: '4' })}>
      <div className={flex({ gap: '2' })}>
        <div className={vstack()}>
          <span className={text({ style: 'sm' })}>{formatAddress(from)}</span>
          <span className={text({ style: 'xs', color: 'mono.300' })}>From</span>
        </div>
        <ForwardIcon width={16} height={16} />
        <div className={vstack()}>
          <span className={text({ style: 'sm' })}>{formatAddress(to)}</span>
          <span className={text({ style: 'xs', color: 'mono.300' })}>To</span>
        </div>
      </div>
      <span
        className={css({
          h: '[2rem]',
          w: '[1px]',
          bg: 'mono.0/5',
        })}
      />
      <div className={vstack({ w: '[5rem]' })}>
        <span className={text({ style: 'sm' })}>
          {formatTokenAmount(value, { symbol: 'BEAM' })}
        </span>
        <span className={text({ style: 'xs', color: 'mono.300' })}>Value</span>
      </div>
    </div>
  </div>
);
