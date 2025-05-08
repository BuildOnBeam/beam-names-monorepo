import { Button, Divider } from '@onbeam/ui';
import { useNftTransferStore } from './useNftTransferStore';
import { motion } from 'motion/react';
import { css } from '@onbeam/styled-system/css';
import { flex, text } from '@onbeam/styled-system/patterns';
import { NftTransferModal } from './NftTransferModal';
import { useRef } from 'react';
import { pluralize } from '@onbeam/utils';
import { useSticky } from '@/helpers';

type Props = {
  isAllSelected: boolean;
  onSelectAll(): void;
};

export const NftTransfer = ({ isAllSelected, onSelectAll }: Props) => {
  const { selectedNfts } = useNftTransferStore();
  const ref = useRef<HTMLDivElement>(null);
  const isSticky = useSticky(ref);

  return (
    <motion.div
      ref={ref}
      className={css({
        pos: 'sticky',
        top: '[-1px]',
        zIndex: '10',
        mx: '-4',
        px: '4',
        transition: 'colors',
        '&[data-stuck="true"]': {
          bg: 'mono.450',
        },
      })}
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      data-stuck={isSticky}
    >
      <div
        className={flex({
          gap: '4',
          justify: 'space-between',
          align: 'center',
          my: '4',
        })}
      >
        <p
          className={text({
            style: 'base',
            color: 'mono.200',
            smDown: { display: 'none' },
          })}
        >
          You've selected {selectedNfts.length}{' '}
          {pluralize(selectedNfts.length, 'NFT')}.
        </p>
        <div
          className={flex({
            gap: '4',
            smDown: { w: 'full', gap: '3', justifyContent: 'flex-end' },
          })}
        >
          <Button variant="secondary" onClick={onSelectAll}>
            {isAllSelected ? 'deselect all' : 'select all'}
          </Button>
          <NftTransferModal />
        </div>
      </div>
      <Divider />
    </motion.div>
  );
};
