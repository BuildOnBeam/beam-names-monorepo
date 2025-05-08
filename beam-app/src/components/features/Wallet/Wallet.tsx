import { css } from '@onbeam/styled-system/css';
import { Button, Divider } from '@onbeam/ui';
import { WalletNFTs } from './WalletNFTs';
import { WalletCurrencies } from './WalletCurrencies';
import { NFTCount } from '@/components/shared/NFTCount';
import { SectionHeader } from '@/components/shared/SectionHeader';
import Link from 'next/link';

export const Wallet = () => {
  return (
    <>
      <SectionHeader as="h2" title="My Tokens">
        <Button as={Link} href="/tokens" size="sm">
          view all
        </Button>
      </SectionHeader>
      <WalletCurrencies />
      <Divider className={css({ my: '6' })} />
      <SectionHeader
        as="h2"
        title={
          <>
            My NFTs <NFTCount />
          </>
        }
      >
        <Button as={Link} href="/nfts" size="sm">
          view all
        </Button>
      </SectionHeader>
      <WalletNFTs />
    </>
  );
};
