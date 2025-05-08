import { compareAddresses, waitMs } from '@onbeam/utils';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { flex, text, vstack } from '@onbeam/styled-system/patterns';
import { css } from '@onbeam/styled-system/css';
import { Button, Divider, Skeleton } from '@onbeam/ui';
import { getCollections } from '@/actions';
import {
  useNftTransferStore,
  NftTransferState,
} from '@/components/features/NftOverview/NftTransfer';
import { ApproveStatus } from './NftTransferApprove.types';
import { NftTransferApproveStatusMessage } from './NftTransferApproveStatusMessage';
import { NftTransferApproveCollection } from './NftTransferApproveCollection';
import { handleContractApproval } from './NftTransferApprove.utils';

export const NftTransferApprove = () => {
  const [status, setStatus] = useState(ApproveStatus.IDLE);
  const { unapprovedContracts, setState } = useNftTransferStore();
  const [currentContractIndex, setCurrentContractIndex] = useState(0);

  const { data } = useQuery({
    queryKey: ['nft-transfer-collections'],
    queryFn: () => getCollections({ contract: unapprovedContracts }),
  });

  const currentCollection = data?.collections?.find((collection) =>
    compareAddresses(collection.id, unapprovedContracts[currentContractIndex]),
  );

  const handleApprove = async (index: number) => {
    setStatus(ApproveStatus.APPROVING);
    const isLastContract = index === unapprovedContracts.length - 1;

    try {
      await handleContractApproval(unapprovedContracts[index]);
      setStatus(ApproveStatus.SUCCESS);

      /* Wait one second to show the success state */
      await waitMs(1000);

      if (isLastContract) {
        setState({ state: NftTransferState.TRANSFER });
      } else {
        setCurrentContractIndex((prevState) => {
          const nextIndex = prevState + 1;
          handleApprove(nextIndex);
          return nextIndex;
        });
      }

      setStatus(ApproveStatus.IDLE);
    } catch {
      setStatus(ApproveStatus.ERROR);
    }
  };

  return (
    <div className={vstack({ align: 'center', gap: '6' })}>
      <p className={text({ style: 'sm', color: 'mono.300', mt: '5' })}>
        Approving {currentContractIndex + 1} of {unapprovedContracts.length}{' '}
        collections
      </p>
      <div className={vstack({ align: 'center' })}>
        {currentCollection ? (
          <NftTransferApproveCollection
            status={status}
            {...currentCollection}
          />
        ) : (
          <>
            <Skeleton
              className={css({ w: '[10rem]', h: '[10rem]', rounded: 'full' })}
            />
            <Skeleton
              className={css({ w: '[12rem]', h: '[1.75rem]', my: '5' })}
            />
          </>
        )}
        <NftTransferApproveStatusMessage status={status} />
      </div>
      <Divider />
      <div className={flex({ w: 'full', gap: '3', md: { gap: '6' } })}>
        <Button
          variant="secondary"
          size="lg"
          onClick={() => setState({ state: NftTransferState.IDLE })}
          disabled={status === ApproveStatus.APPROVING}
        >
          back
        </Button>
        <Button
          size="lg"
          onClick={() => handleApprove(currentContractIndex)}
          isLoading={status === ApproveStatus.APPROVING}
        >
          {status === ApproveStatus.ERROR ? 'retry' : 'approve'}
        </Button>
      </div>
    </div>
  );
};
