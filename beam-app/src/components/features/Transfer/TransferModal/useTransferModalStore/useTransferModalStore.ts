import {
  TransferModalState,
  TransferModalStoreActions,
  TransferModalStoreState,
} from './useTransferModalStore.types';
import { create } from 'zustand/react';

export const initialState: TransferModalStoreState = {
  state: TransferModalState.IDLE,
  transactions: [],
  unapprovedContracts: [],
  isModalOpen: false,
};

export const useTransferModalStore = create<
  TransferModalStoreState & TransferModalStoreActions
>((set) => ({
  ...initialState,
  reset: () => {
    const { state: _state, ...restState } = initialState;
    set(restState);
  },
}));
