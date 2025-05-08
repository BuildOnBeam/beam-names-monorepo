import { useContext } from 'react';
import { NftTransferStore } from './useNftTransferStore.types';
import { NftTransferStoreContext } from './NftTransferStoreProvider';
import { useStore } from 'zustand';

export function useNftTransferStore<T>(
  selector: (state: NftTransferStore) => T,
): T;
export function useNftTransferStore(): NftTransferStore;
export function useNftTransferStore<T = NftTransferStore>(
  selector?: (state: NftTransferStore) => T,
): T {
  const store = useContext(NftTransferStoreContext);

  if (!store)
    throw new Error(
      'useNftTransferStore has to be wrapped in a NftTransferStoreProvider component.',
    );

  return useStore(store, selector || ((state) => state as T));
}
