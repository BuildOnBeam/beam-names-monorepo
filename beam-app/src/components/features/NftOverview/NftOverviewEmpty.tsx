import { SphereTile } from '@/components';
import { css } from '@onbeam/styled-system/css';
import { flex } from '@onbeam/styled-system/patterns';
import { Divider } from '@onbeam/ui';

export const NftOverviewEmpty = () => (
  <>
    <p
      className={flex({
        flexGrow: '1',
        color: 'mono.300',
        textStyle: 'base',
        my: '8',
        justify: 'center',
        align: 'center',
        textAlign: 'center',
      })}
    >
      You don't own any NFTs in this wallet yet.
      <br /> Once you collect, mint, or receive some, they will appear here.
    </p>
    <Divider className={css({ mb: '4' })} />
    <SphereTile isCentered isLarge />
  </>
);
