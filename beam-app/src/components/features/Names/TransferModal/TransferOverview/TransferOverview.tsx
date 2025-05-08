import {
  TransferModalState,
  useTransferModalStore,
} from '../useTransferModalStore';
import { useCurrencies } from '@/helpers';
import { Button, Divider, toast } from '@onbeam/ui';
import { useState } from 'react';
import { BaseError } from 'viem';
import { getUnapprovedContracts } from './TransferOverview.utils';
import { TransferOverviewItem } from './TransferOverviewItem';
import { TransferOverviewBulkItems } from './TransferOverviewBulkItems';
import { TRANSFER_ITEM_LIMIT } from '@/components/features/Transfer/Transfer.utils';
import { vstack } from '@onbeam/styled-system/patterns';

export const TransferOverview = () => {
  const [isLoading, setLoading] = useState(false);
  const { currencies } = useCurrencies();
  const { transactions } = useTransferModalStore();

  const handleContinue = async () => {
    try {
      setLoading(true);

      const isTransferringSingleToken =
        transactions.length === 1 && transactions[0].tokens.length === 1;

      /* If we're transferring a single token, we can skip the approval step since we won't be using the TokenBeamer contract. */
      if (isTransferringSingleToken) {
        useTransferModalStore.setState({
          state: TransferModalState.TRANSFER,
        });
        return;
      }

      const unapprovedContracts = await getUnapprovedContracts(
        transactions,
        currencies,
      );

      if (unapprovedContracts.length) {
        useTransferModalStore.setState({
          state: TransferModalState.APPROVE,
          unapprovedContracts,
        });
      } else {
        useTransferModalStore.setState({ state: TransferModalState.TRANSFER });
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
      {transactions.length > TRANSFER_ITEM_LIMIT ? (
        <TransferOverviewBulkItems transactions={transactions} />
      ) : (
        <div className={vstack({ gap: '4' })}>
          {transactions.map((transaction, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: https://www.youtube.com/watch?v=EYkDiAfZ1ss
            <TransferOverviewItem key={index} index={index} {...transaction} />
          ))}
        </div>
      )}
      <Divider />
      <Button size="lg" onClick={handleContinue} isLoading={isLoading}>
        continue
      </Button>
    </>
  );
};
