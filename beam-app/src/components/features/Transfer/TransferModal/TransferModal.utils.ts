import { TransferOverview } from './TransferOverview';
import { TransferModalState } from './useTransferModalStore';
import { ReactNode } from 'react';
import { TransferApprove } from './TransferApprove';
import { TransferSend } from './TransferSend';
import { TransferSuccess } from './TransferSuccess';

export const transferScreenMap: Record<
  TransferModalState,
  {
    component: () => ReactNode;
    title?: string;
    description?: string;
  }
> = {
  [TransferModalState.IDLE]: {
    component: TransferOverview,
    title: 'Send tokens',
    description:
      'Gas fees are required to pay for sending tokens to other addresses. Please ensure you have the required amount of gas, and that you have verified the transaction before proceeding.',
  },
  [TransferModalState.APPROVE]: {
    component: TransferApprove,
    title: 'Approve tokens',
    description:
      'To proceed, you need to allow the smart contract to access your token balance and send the specified amount on your behalf.',
  },
  [TransferModalState.TRANSFER]: {
    component: TransferSend,
    title: 'Send tokens',
    description:
      'Gas fees are required to pay for sending tokens to other addresses. Please ensure you have the required amount of gas, and that you have verified the transaction before proceeding.',
  },
  [TransferModalState.SUCCESS]: {
    component: TransferSuccess,
    title: 'Tokens sent',
  },
};
