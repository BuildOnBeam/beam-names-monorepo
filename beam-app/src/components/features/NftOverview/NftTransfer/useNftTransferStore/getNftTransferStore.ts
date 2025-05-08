import { create } from 'zustand/react';
import {
  NftTransferState,
  NftTransferStore,
  NftTransferStoreState,
} from './useNftTransferStore.types';

export const initialState: NftTransferStoreState = {
  state: NftTransferState.IDLE,
  isSelecting: false,
  selectedNfts: [],
  unapprovedContracts: [],
  isModalOpen: false,
};

export const getNftTransferStore = () =>
  create<NftTransferStore>((set) => ({
    ...initialState,
    setState: (state) => set(state),
    setSelecting: (isSelecting) => set({ isSelecting, selectedNfts: [] }),
    selectNft: (nft) => {
      set((state) => {
        const { selectedNfts } = state;

        const existingNft = selectedNfts.some(
          ({ id, contract }) => id === nft.id && contract === nft.contract,
        );

        const updatedNfts = selectedNfts.map((selectedNft) =>
          selectedNft.id === nft.id && selectedNft.contract === nft.contract
            ? nft
            : selectedNft,
        );

        return {
          selectedNfts: existingNft ? updatedNfts : [...updatedNfts, nft],
        };
      });
    },
    deselectNft: (nft) =>
      set((state) => ({
        selectedNfts: state.selectedNfts.filter(
          ({ id, contract }) => id !== nft.id || contract !== nft.contract,
        ),
      })),
    setModalOpen: (open) =>
      set({ isModalOpen: open, ...(open && { state: NftTransferState.IDLE }) }),
    reset: () => {
      const { state: _state, ...restState } = initialState;
      set(restState);
    },
  }));
