import { SphereTileProps } from './SphereTile.types';
import { SphereIcon } from '@/icons';
import { css } from '@onbeam/styled-system/css';
import {
  flex,
  linkOverlay,
  text,
  vstack,
} from '@onbeam/styled-system/patterns';
import { Button } from '@onbeam/ui';

export const SphereTile = ({
  nftCount = 0,
  isLarge: isLargeInitial,
  isCentered: isCenteredInitial,
}: SphereTileProps) => {
  const isLarge = isLargeInitial || nftCount < 2;
  const isCentered = isCenteredInitial || nftCount > 1;

  return (
    <div
      className={vstack({
        pos: 'relative',
        w: 'full',
        minW: '[16rem]',
        align: 'center',
        justify: 'center',
        px: '5',
        py: '20',
        border: '1px solid',
        borderColor: 'mono.0/10',
        rounded: 'md',
        transition: 'colors',
        gridColumn: '[span 1]',
        lg: {
          gridColumn: '[span var(--columns)]',
          '&[data-large="true"]': {
            px: '20',
          },
          '&[data-center="false"]': {
            alignItems: 'flex-start',
          },
        },
        _hover: {
          bg: 'mono.300/5',
        },
      })}
      data-large={isLarge}
      data-center={isCentered}
      style={{ '--columns': 3 - nftCount }}
    >
      <SphereIcon
        className={css({ mt: '-8', ml: '-7' })}
        width={156}
        height={98}
      />
      <h4
        className={text({
          textAlign: 'center',
          mt: '1',
          mb: '9',
          maxW: '[16rem]',
          lg: {
            '&[data-large="true"]': {
              textStyle: 'xl',
            },
            '&[data-center="false"]': {
              textAlign: 'left',
            },
          },
        })}
        data-large={isLarge}
        data-center={isCentered}
      >
        Refresh your collection with new items & collectibles.
      </h4>
      <div
        className={flex({
          align: 'center',
          gap: '3',
          direction: 'column',
          lg: {
            '&[data-large="true"]': {
              gap: '5',
            },
            '&[data-center="false"]': {
              flexDir: 'row',
            },
          },
        })}
        data-large={isLarge}
        data-center={isCentered}
      >
        <a
          className={linkOverlay()}
          href="https://sphere.market/"
          target="_blank"
          rel="noreferrer"
        >
          <Button as="span" size="sm">
            explore Sphere
          </Button>
        </a>
        <span className={text({ style: 'sm', color: 'mono.300' })}>
          Over 150,000 assets available
        </span>
      </div>
    </div>
  );
};
