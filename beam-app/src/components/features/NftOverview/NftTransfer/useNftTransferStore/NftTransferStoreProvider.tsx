'use client';

import { getNftTransferStore } from './getNftTransferStore';
import { PropsWithChildren, useRef } from 'react';
import { createContext } from 'react';

type NftTransferStore = ReturnType<typeof getNftTransferStore>;

export const NftTransferStoreContext = createContext<NftTransferStore | null>(
  null,
);

export const NftTransferStoreProvider = ({ children }: PropsWithChildren) => {
  const storeRef = useRef<NftTransferStore>(null);

  if (storeRef.current === null) {
    storeRef.current = getNftTransferStore();
  }

  return (
    <NftTransferStoreContext.Provider value={storeRef.current}>
      {children}
    </NftTransferStoreContext.Provider>
  );
};
