import { Address } from 'viem';

export enum TransferModalState {
  IDLE = 'IDLE',
  APPROVE = 'APPROVE',
  TRANSFER = 'TRANSFER',
  SUCCESS = 'SUCCESS',
}

export type Transaction = {
  recipient: Address;
  tokens: {
    currencyAddress: Address;
    amount?: number;
  }[];
};

export type TransferModalStoreState = {
  state: TransferModalState;
  transactions: Transaction[];
  unapprovedContracts: { address: Address; amount: number }[];
  isModalOpen: boolean;
  transactionHash?: string;
};

export type TransferModalStoreActions = {
  reset: () => void;
};
