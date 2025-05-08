import { Address } from 'viem';

export enum NftTransferState {
  IDLE = 'IDLE',
  APPROVE = 'APPROVE',
  TRANSFER = 'TRANSFER',
  SUCCESS = 'SUCCESS',
}

export type SelectedNft = {
  id: string;
  contract: string;
  kind: 721 | 1155;
  quantity: number;
  quantityOwned: number;
  name: string;
  image: string;
};

export type NftTransferStoreState = {
  state: NftTransferState;
  isSelecting: boolean;
  selectedNfts: SelectedNft[];
  unapprovedContracts: Address[];
  isModalOpen: boolean;
  transactionHash?: string;
};

export type NftTransferStoreActions = {
  setState: (state: Partial<NftTransferStoreState>) => void;
  setSelecting: (isSelecting: boolean) => void;
  selectNft: (nft: SelectedNft) => void;
  deselectNft: (nft: Pick<SelectedNft, 'id' | 'contract'>) => void;
  setModalOpen: (isOpen: boolean) => void;
  reset: () => void;
};

export type NftTransferStore = NftTransferStoreState & NftTransferStoreActions;
