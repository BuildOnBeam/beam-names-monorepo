import { NftTransferState } from '@/components/features/NftOverview/NftTransfer/useNftTransferStore';
import { NftTransferOverview } from './NftTransferOverview';
import { ReactNode } from 'react';
import { NftTransferApprove } from './NftTransferApprove';
import { NftTransferSend } from './NftTransferSend';
import { NftTransferSuccess } from './NftTransferSuccess';

export const transferScreenMap: Record<
  NftTransferState,
  {
    component: () => ReactNode;
    title?: string;
    description?: string;
  }
> = {
  [NftTransferState.IDLE]: {
    component: NftTransferOverview,
    title: 'Send tokens',
    description:
      'Gas fees are required to pay for sending tokens to other addresses. Please ensure you have the required amount of gas, and that you have verified the transaction before proceeding.',
  },
  [NftTransferState.APPROVE]: {
    component: NftTransferApprove,
    title: 'Approve Collections',
    description:
      'To proceed, you need to allow the smart contract to access all of your tokens within this collection and  send tokens on your behalf.',
  },
  [NftTransferState.TRANSFER]: {
    component: NftTransferSend,
    title: 'Send tokens',
    description:
      'Gas fees are required to pay for sending tokens to other addresses. Please ensure you have the required amount of gas, and that you have verified the transaction before proceeding.',
  },
  [NftTransferState.SUCCESS]: {
    component: NftTransferSuccess,
    title: 'Tokens Sent',
  },
};
