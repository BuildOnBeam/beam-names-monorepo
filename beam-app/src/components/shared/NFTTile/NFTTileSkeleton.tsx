import { css, cx } from '@onbeam/styled-system/css';
import { vstack } from '@onbeam/styled-system/patterns';
import { tile } from '@onbeam/styled-system/recipes';
import { Divider, Skeleton } from '@onbeam/ui';

export const NFTTileSkeleton = () => (
  <div
    className={cx(
      tile(),
      vstack({
        textAlign: 'left',
        w: 'full',
        p: '4',
        minW: '[16rem]',
        transition: 'all',
        outline: '3px solid transparent',
        rounded: 'md',
      }),
    )}
  >
    <Skeleton
      className={css({ h: '[1.5rem]', w: '1/2', mb: '1.5', bg: 'mono.250' })}
    />
    <Skeleton
      className={css({ h: '[1rem]', w: '1/4', mb: '4', bg: 'mono.250' })}
    />
    <Skeleton
      className={css({
        w: 'full',
        h: 'auto',
        aspectRatio: '1/1',
        bg: 'mono.250',
      })}
    />
    <Divider className={css({ my: '4' })} />
    <Skeleton
      className={css({ h: '[1.375rem]', w: '1/2', mx: 'auto', bg: 'mono.250' })}
    />
  </div>
);
