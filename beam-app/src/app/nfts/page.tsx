import { DisconnectedBoundary, NFTCount, SectionHeader } from '@/components';
import { NftOverview } from '@/components/features/NftOverview';
import { NftTransferStoreProvider } from '@/components/features/NftOverview/NftTransfer/useNftTransferStore/NftTransferStoreProvider';

export default function NftsPage() {
  return (
    <DisconnectedBoundary>
      <NftTransferStoreProvider>
        <SectionHeader
          title={
            <>
              My NFTs <NFTCount />
            </>
          }
          backHref="/"
        />
        <NftOverview />
      </NftTransferStoreProvider>
    </DisconnectedBoundary>
  );
}
