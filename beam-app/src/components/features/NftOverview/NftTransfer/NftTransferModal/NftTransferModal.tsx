import { Button, Divider, Modal, PoweredByBeamBanner } from '@onbeam/ui';
import { vstack } from '@onbeam/styled-system/patterns';
import { transferScreenMap } from './NftTransferModal.utils';
import {
  useNftTransferStore,
  NftTransferState,
} from '@/components/features/NftOverview/NftTransfer';
import { css } from '@onbeam/styled-system/css';

export const NftTransferModal = () => {
  const { state, selectedNfts, isModalOpen, reset, setModalOpen } =
    useNftTransferStore();
  const { component: Screen, title, description } = transferScreenMap[state];

  const handleOpenChange = (open: boolean) => {
    /* If the modal is closed and the transfer state is success, reset the store. */
    if (!open && state === NftTransferState.SUCCESS) {
      reset();
      return;
    }

    setModalOpen(open);
  };

  return (
    <Modal
      title={title}
      description={description}
      hideDescription={!description}
      trigger={
        <Button
          className={css({ smDown: { w: '[8.25rem]' } })}
          disabled={!selectedNfts.length}
        >
          send{' '}
          <span className={css({ sm: { display: 'none' } })}>
            ({selectedNfts.length})
          </span>
        </Button>
      }
      open={isModalOpen}
      onOpenChange={handleOpenChange}
    >
      <div className={vstack({ gap: '6' })}>
        {!!description && <Divider />}
        <Screen />
        <PoweredByBeamBanner />
      </div>
    </Modal>
  );
};
