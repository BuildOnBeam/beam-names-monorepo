import { MAX_NFTS_PER_TRANSFER } from '@/components/features/NftOverview/NftTransfer/useNftTransferStore/useNftTransferStore.utils';
import { NFTTileProps } from './NFTTile.types';
import { SphereIcon } from '@/icons';
import { LedOnIcon, LedOutlineIcon } from '@onbeam/icons';
import { cx, css } from '@onbeam/styled-system/css';
import {
  vstack,
  flex,
  text,
  linkOverlay,
} from '@onbeam/styled-system/patterns';
import { tile } from '@onbeam/styled-system/recipes';
import { Divider, Tooltip } from '@onbeam/ui';
import { formatNumber } from '@onbeam/utils';
import { AnimatePresence, motion } from 'motion/react';

export const NFTTile = ({
  href,
  name,
  quantityOwned,
  image,
  isSelected,
  isSelecting,
  hasSelectedMax,
  onClick,
}: NFTTileProps) => (
  <Tooltip
    label={`You've reached the limit of ${MAX_NFTS_PER_TRANSFER} NFTs per transfer.`}
    disabled={isSelected || !hasSelectedMax}
  >
    <div
      className={cx(
        'group',
        tile({ isInteractive: true }),
        vstack({
          pos: 'relative',
          textAlign: 'left',
          w: 'full',
          p: '4',
          minW: '[16rem]',
          transition: 'all',
          outline: '3px solid transparent',
          overflow: 'hidden',
          '&[data-selecting="true"]:not([data-selected="true"])': {
            opacity: 0.5,
            _focusWithin: {
              outline: '3px solid',
              outlineColor: 'mono.300',
            },
          },
          '&[data-selected="true"]': {
            outline: '3px solid',
            outlineColor: 'mono.300',
          },
        }),
      )}
      data-selecting={isSelecting}
      data-selected={isSelected}
      data-has-selected-max={hasSelectedMax}
    >
      <h3 className={text({ style: 'xl', pr: '5', truncate: true })}>{name}</h3>
      <span className={text({ style: 'sm', color: 'mono.300', mb: '4' })}>
        {formatNumber(quantityOwned)} Owned
      </span>
      {isSelecting && (
        <div className={css({ pos: 'absolute', top: '2', right: '2' })}>
          {isSelected ? (
            <LedOnIcon width={32} height={32} />
          ) : (
            <LedOutlineIcon
              className={css({
                transition: 'opacity',
                md: { opacity: 0, _groupHover: { opacity: 1 } },
              })}
              width={32}
              height={32}
            />
          )}
        </div>
      )}
      <div
        className={css({
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'mono.0/12',
          rounded: 'sm',
        })}
      >
        <img
          src={image || '/images/fallback.png'}
          alt={name}
          className={css({
            w: 'full',
            h: 'auto',
            aspectRatio: '1/1',
            objectFit: 'contain',
            transition: 'all',
            pointerEvents: 'none',
            _groupHover: {
              scale: '[1.1]',
            },
          })}
        />
      </div>
      <AnimatePresence initial={false}>
        {isSelecting ? (
          <button
            type="button"
            className={cx(
              css({ cursor: 'pointer', _disabled: { cursor: 'not-allowed' } }),
              linkOverlay(),
            )}
            onClick={onClick}
            disabled={hasSelectedMax && !isSelected}
          />
        ) : (
          <motion.div
            key="sphere-link"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Divider className={css({ mt: '4' })} />
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View on Sphere"
              className={cx(
                flex({
                  mb: '-3',
                  align: 'center',
                  justify: 'center',
                  textStyle: 'base',
                  color: 'mono.200',
                }),
                linkOverlay(),
              )}
            >
              View on
              <SphereIcon className={css({ ml: '-1.5' })} aria-hidden="true" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </Tooltip>
);
