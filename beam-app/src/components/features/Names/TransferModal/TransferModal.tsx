import { Divider, Modal, PoweredByBeamBanner } from '@onbeam/ui';
import { vstack } from '@onbeam/styled-system/patterns';
import { transferScreenMap } from './TransferModal.utils';
import {
  TransferModalState,
  useTransferModalStore,
} from './useTransferModalStore';
import { useFormContext } from 'react-hook-form';

export const TransferModal = () => {
  const { state, isModalOpen } = useTransferModalStore();
  const { component: Screen, title, description } = transferScreenMap[state];
  const { reset: resetForm } = useFormContext();

  const handleModalChange = (open: boolean) => {
    useTransferModalStore.setState({ isModalOpen: open });
    if (state === TransferModalState.SUCCESS) {
      resetForm();
    }
  };

  return (
    <Modal
      title={title}
      description={description}
      hideDescription={!description}
      open={isModalOpen}
      onOpenChange={handleModalChange}
    >
      <div className={vstack({ gap: '6' })}>
        {!!description && <Divider />}
        <Screen />
        <PoweredByBeamBanner />
      </div>
    </Modal>
  );
};
