import { flex, text, vstack } from '@onbeam/styled-system/patterns';
import { Button, Divider, IconButton, Input, toast } from '@onbeam/ui';
import { css, cx } from '@onbeam/styled-system/css';
import { tile } from '@onbeam/styled-system/recipes';
import { DashIcon, PlusIcon } from '@onbeam/icons';
import { BaseError } from 'viem';
import {
  useNftTransferStore,
  NftTransferState,
} from '@/components/features/NftOverview/NftTransfer';
import { useState } from 'react';
import { getUnapprovedContracts } from './NftTransferOverview.utils';

export const NftTransferOverview = () => {
  const [isLoading, setLoading] = useState(false);
  const { selectedNfts, selectNft, setState } = useNftTransferStore();

  const handleContinue = async () => {
    try {
      setLoading(true);

      if (!selectedNfts.some((nft) => nft.quantity))
        throw new BaseError('Please select at least one item to transfer');

      /* If we're transferring a single NFT, we can skip the approval step since we won't be using the TokenBeamer contract. */
      if (selectedNfts.length === 1) {
        setState({ state: NftTransferState.TRANSFER });
        return;
      }

      const unapprovedContracts = await getUnapprovedContracts(selectedNfts);

      if (unapprovedContracts.length) {
        setState({
          state: NftTransferState.APPROVE,
          unapprovedContracts,
        });
      } else {
        setState({ state: NftTransferState.TRANSFER });
      }
    } catch (error) {
      toast.error('Failed to continue', {
        description:
          error instanceof BaseError
            ? error.shortMessage
            : 'Something went wrong, please try again later',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <div className={vstack({ gap: '4' })}>
          <p className={text({ style: 'sm', color: 'mono.200' })}>
            Transferring {selectedNfts.length}{' '}
            {selectedNfts.length > 1 ? 'items' : 'item'}
          </p>
          {selectedNfts.map((nft) => (
            <div
              key={nft.id + nft.contract}
              className={cx(
                tile(),
                flex({
                  p: '4',
                  gap: '4',
                  align: 'center',
                  transition: 'opacity',
                  '&[data-has-quantity="false"]': {
                    opacity: 0.8,
                  },
                  mdDown: {
                    flexWrap: 'wrap',
                  },
                }),
              )}
              data-has-quantity={!!nft.quantity}
            >
              <div
                className={flex({
                  gap: '4',
                  align: 'center',
                  overflow: 'hidden',
                  '&[data-has-quantity="false"]': {
                    opacity: 0.4,
                  },
                })}
                data-has-quantity={!!nft.quantity}
              >
                <img
                  className={css({
                    objectFit: 'contain',
                    w: '[3.75rem]',
                    h: '[3.75rem]',
                    border: '1px solid',
                    borderColor: 'mono.0/12',
                    rounded: 'sm',
                  })}
                  src={nft.image || '/images/fallback.png'}
                  alt={nft.name}
                />
                <div className={vstack({ overflow: 'hidden' })}>
                  <p className={text({ style: 'xl', truncate: true })}>
                    {nft.name}
                  </p>
                  <p className={text({ style: 'sm', color: 'mono.300' })}>
                    {nft.quantityOwned} Owned
                  </p>
                </div>
              </div>
              <div
                className={flex({
                  gap: '3',
                  ml: 'auto',
                })}
              >
                <IconButton
                  onClick={() =>
                    selectNft({
                      ...nft,
                      quantity: Math.max(nft.quantity - 1, 0),
                    })
                  }
                  disabled={!nft.quantity}
                >
                  <DashIcon />
                </IconButton>
                <Input
                  className={css({
                    flex: '1',
                    h: '[2.125rem]',
                    w: '[3.5rem]',
                  })}
                  inputClassName={css({
                    textAlign: 'center',
                    '&::-webkit-inner-spin-button, &::-webkit-outer-spin-button':
                      {
                        WebkitAppearance: 'none',
                        appearance: 'none',
                        m: '0',
                      },
                  })}
                  type="number"
                  value={nft.quantity || ''}
                  max={nft.quantityOwned}
                  onChange={(e) =>
                    selectNft({
                      ...nft,
                      quantity: Math.max(
                        Math.min(Number(e.target.value), nft.quantityOwned),
                        0,
                      ),
                    })
                  }
                  size="sm"
                />
                <IconButton
                  onClick={() =>
                    selectNft({
                      ...nft,
                      quantity: Math.min(nft.quantity + 1, nft.quantityOwned),
                    })
                  }
                  disabled={nft.quantity === nft.quantityOwned}
                >
                  <PlusIcon />
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Divider />
      <Button size="lg" onClick={handleContinue} isLoading={isLoading}>
        continue
      </Button>
    </>
  );
};
