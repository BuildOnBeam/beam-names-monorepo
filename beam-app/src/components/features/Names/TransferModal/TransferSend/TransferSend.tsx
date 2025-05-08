import { StatusCircle } from '@/components';
import { SendStatus } from './TransferSend.types';
import { flex, vstack } from '@onbeam/styled-system/patterns';
import { Button, Divider, toast } from '@onbeam/ui';
import {
  TransferModalState,
  useTransferModalStore,
} from '../useTransferModalStore';
import { useState } from 'react';
import {
  handleTransferTokens,
  statusMap,
  statusMessageMap,
} from './TransferSend.utils';
import { css } from '@onbeam/styled-system/css';
import { BaseError } from 'viem';
import { useMount } from '@onbeam/utils';
import { FailedIcon } from '@/icons';
import { motion } from 'motion/react';
import { useCurrencies } from '@/helpers';
import { useBalance } from '@onbeam/features';

export const TransferSend = () => {
  const [status, setStatus] = useState(SendStatus.PENDING);
  const { refetchBalances } = useBalance();
  const { currencies } = useCurrencies();
  const { transactions } = useTransferModalStore();

  /* We trigger handleSend once (on component mount) to enhance the flow for the user. */
  useMount(() => handleSend());

  const handleSend = async () => {
    try {
      setStatus(SendStatus.PENDING);

      const transactionHash = await handleTransferTokens(
        transactions,
        currencies,
      );

      refetchBalances();

      useTransferModalStore.setState({
        state: TransferModalState.SUCCESS,
        transactionHash,
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to send tokens', {
        description:
          error instanceof BaseError
            ? error.shortMessage
            : 'Something went wrong, please try again later',
      });
      setStatus(SendStatus.ERROR);
    }
  };

  const statusMessage = statusMessageMap[status];

  return (
    <div className={vstack({ gap: '6' })}>
      <div className={vstack({ align: 'center', gap: '5', my: '5' })}>
        <StatusCircle status={statusMap[status]}>
          {status === SendStatus.ERROR && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <FailedIcon />
            </motion.div>
          )}
        </StatusCircle>
        <p className={css(statusMessage.styles)}>{statusMessage.description}</p>
      </div>
      <Divider />
      <div className={flex({ w: 'full', gap: '3', md: { gap: '6' } })}>
        <Button
          variant="secondary"
          size="lg"
          onClick={() =>
            useTransferModalStore.setState({ state: TransferModalState.IDLE })
          }
          disabled={status === SendStatus.PENDING}
        >
          back
        </Button>
        <Button
          type="submit"
          size="lg"
          isLoading={status === SendStatus.PENDING}
          onClick={handleSend}
        >
          {status === SendStatus.ERROR ? 'retry' : 'send'}
        </Button>
      </div>
    </div>
  );
};
