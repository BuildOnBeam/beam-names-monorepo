import { vstack, flex } from '@onbeam/styled-system/patterns';
import { PlusIcon } from '@onbeam/icons';
import { Button, Tooltip } from '@onbeam/ui';
import { TransferItem } from './TransferItem';
import { TRANSFER_ITEM_LIMIT, TransferSchema } from './Transfer.utils';
import { SubmitHandler, useFieldArray, useFormContext } from 'react-hook-form';
import { Address } from 'viem';
import {
  TransferModal,
  TransferModalState,
  useTransferModalStore,
} from './TransferModal';
import { css } from '@onbeam/styled-system/css';

export const TransferForm = () => {
  const { control, handleSubmit } = useFormContext<TransferSchema>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'transactions',
  });

  const hasHitLimit = fields.length >= TRANSFER_ITEM_LIMIT;

  const onSubmit: SubmitHandler<TransferSchema> = ({ transactions }) => {
    console.log("submitting", transactions);
    useTransferModalStore.setState({
      isModalOpen: true,
      state: TransferModalState.IDLE,
      transactions,
    });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={vstack({ align: 'center' })}
      >
        {fields.map((field, index) => (
          <TransferItem
            key={field.id}
            transactionIndex={index}
            onRemove={() => remove(index)}
          />
        ))}
        <div className={flex({ gap: '3', w: 'full' })}>
          <Tooltip
            label={`You've reached the limit of ${TRANSFER_ITEM_LIMIT} items.`}
            disabled={!hasHitLimit}
          >
            <Button
              className="group"
              onClick={() =>
                append(
                  {
                    tokens: [{ currencyAddress: '' as Address }],
                    recipient: '' as Address,
                    beamName: ''
                  },
                  {
                    focusName: `transactions.${fields.length}.tokens.0.amount`,
                  },
                )
              }
              size="lg"
              disabled={hasHitLimit}
            >
              <PlusIcon className={css({ _groupDisabled: { opacity: 0.1 } })} />
              add item
            </Button>
          </Tooltip>
          <Button type="submit" size="lg">
            send
          </Button>
        </div>
      </form>
      <TransferModal />
    </>
  );
};
