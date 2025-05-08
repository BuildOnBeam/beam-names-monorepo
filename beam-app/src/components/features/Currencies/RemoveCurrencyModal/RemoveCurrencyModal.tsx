import { vstack } from '@onbeam/styled-system/patterns';
import { Modal, Divider, Button, ModalPrimitive, toast } from '@onbeam/ui';
import { CurrencyModalItem } from '../CurrencyModalItem';
import { RemoveCurrencyModalProps } from './RemoveCurrencyModal.types';
import { useCurrencies } from '@/helpers';

export const RemoveCurrencyModal = ({
  currency,
  trigger,
}: RemoveCurrencyModalProps) => {
  const removeCurrency = useCurrencies((state) => state.removeCurrency);

  const handleRemoveCurrency = () => {
    removeCurrency(currency.address);
    toast.success('Token removed', {
      description: `${currency.name} has been removed from your wallet`,
    });
  };

  return (
    <Modal
      title="Remove token"
      description="Are you sure you want to remove this token?"
      trigger={trigger}
    >
      <div className={vstack({ gap: '6' })}>
        <Divider />
        <CurrencyModalItem {...currency} />
        <ModalPrimitive.Close asChild>
          <Button size="lg" onClick={handleRemoveCurrency}>
            confirm
          </Button>
        </ModalPrimitive.Close>
      </div>
    </Modal>
  );
};
