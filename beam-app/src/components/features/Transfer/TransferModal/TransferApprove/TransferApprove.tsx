import { waitMs } from '@onbeam/utils';
import { useState } from 'react';
import { flex, text, vstack } from '@onbeam/styled-system/patterns';
import { Button, Divider } from '@onbeam/ui';
import { ApproveStatus } from './TransferApprove.types';
import { TransferApproveStatusMessage } from './TransferApproveStatusMessage';
import { TransferApproveToken } from './TransferApproveToken';
import { handleTokenApproval } from './TransferApprove.utils';
import {
  TransferModalState,
  useTransferModalStore,
} from '../useTransferModalStore';
import { parseUnits } from 'viem';
import { useCurrencies } from '@/helpers';

export const TransferApprove = () => {
  const { getCurrency } = useCurrencies();
  const [status, setStatus] = useState(ApproveStatus.IDLE);
  const { unapprovedContracts } = useTransferModalStore();
  const [currentContractIndex, setCurrentContractIndex] = useState(0);

  const handleApprove = async (index: number) => {
    setStatus(ApproveStatus.APPROVING);
    const isLastContract = index === unapprovedContracts.length - 1;

    try {
      const { address, amount } = unapprovedContracts[index];
      const decimals = getCurrency({ address })?.decimals || 18;

      await handleTokenApproval(address, parseUnits(String(amount), decimals));

      setStatus(ApproveStatus.SUCCESS);

      /* Wait one second to show the success state */
      await waitMs(1000);

      if (isLastContract) {
        useTransferModalStore.setState({ state: TransferModalState.TRANSFER });
      } else {
        setCurrentContractIndex((prevState) => {
          const nextIndex = prevState + 1;
          handleApprove(nextIndex);
          return nextIndex;
        });
      }

      setStatus(ApproveStatus.IDLE);
    } catch {
      setStatus(ApproveStatus.ERROR);
    }
  };

  return (
    <div className={vstack({ align: 'center', gap: '6' })}>
      <p className={text({ style: 'sm', color: 'mono.300', mt: '5' })}>
        Approving {currentContractIndex + 1} of {unapprovedContracts.length}{' '}
        tokens
      </p>
      <div className={vstack({ align: 'center' })}>
        <TransferApproveToken
          status={status}
          symbol={
            getCurrency({
              address: unapprovedContracts[currentContractIndex].address,
            })?.symbol || ''
          }
          amount={unapprovedContracts[currentContractIndex].amount}
        />
        <TransferApproveStatusMessage status={status} />
      </div>
      <Divider />
      <div className={flex({ w: 'full', gap: '3', md: { gap: '6' } })}>
        <Button
          variant="secondary"
          size="lg"
          onClick={() =>
            useTransferModalStore.setState({ state: TransferModalState.IDLE })
          }
          disabled={status === ApproveStatus.APPROVING}
        >
          back
        </Button>
        <Button
          size="lg"
          onClick={() => handleApprove(currentContractIndex)}
          isLoading={status === ApproveStatus.APPROVING}
        >
          {status === ApproveStatus.ERROR ? 'retry' : 'approve'}
        </Button>
      </div>
    </div>
  );
};
