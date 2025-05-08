import { TransferBulkSchema } from './TransferBulk.utils';
import {
  fromTextareaString,
  parseFile,
  toTextareaString,
} from './TransferBulkForm.utils';
import {
  TransferModal,
  TransferModalState,
  useTransferModalStore,
} from '@/components/features/Transfer/TransferModal';
import { cx, css } from '@onbeam/styled-system/css';
import { vstack, flex, text } from '@onbeam/styled-system/patterns';
import { tile } from '@onbeam/styled-system/recipes';
import {
  toast,
  Label,
  Input,
  Dropzone,
  Button,
  ErrorMessage,
} from '@onbeam/ui';
import { DragEventHandler } from 'react';
import { Controller, SubmitHandler, useFormContext } from 'react-hook-form';
import { TransferSelectModal } from '../TransferSelectModal';

export const TransferBulkForm = () => {
  const {
    control,
    handleSubmit,
    register,
    setValue,
    formState: { errors },
    watch,
  } = useFormContext<TransferBulkSchema>();

  const mode = watch('mode');

  const handleDrop = async (files: File[]) => {
    try {
      const parsedData = await parseFile(files[0]);
      setValue('transactions', toTextareaString(parsedData), {
        shouldValidate: true,
        shouldTouch: true,
      });
      setValue('mode', 'text');
    } catch (error) {
      toast.error('Failed to parse file', {
        description:
          error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  };

  const onSubmit: SubmitHandler<TransferBulkSchema> = ({
    currencyAddress,
    transactions,
  }) => {
    useTransferModalStore.setState({
      isModalOpen: true,
      state: TransferModalState.IDLE,
      transactions: fromTextareaString(transactions).map((item) => ({
        recipient: item.recipient,
        tokens: [{ currencyAddress, amount: item.amount }],
      })),
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={vstack({ gap: '4' })}>
        <div className={cx(vstack({ gap: '3', p: '5' }), tile())}>
          <div className={vstack({ gap: '1' })}>
            <Controller
              control={control}
              name="currencyAddress"
              render={({ field: { value, onChange } }) => (
                <TransferSelectModal
                  label="Token"
                  selectedId={value}
                  onChange={onChange}
                />
              )}
            />
            {errors.currencyAddress && (
              <ErrorMessage>{errors.currencyAddress.message}</ErrorMessage>
            )}
          </div>
          <div className={vstack({ gap: '1' })}>
            <div
              className={flex({ align: 'center', justify: 'space-between' })}
            >
              <Label>Recipients and amounts</Label>
              <button
                className={text({
                  cursor: 'pointer',
                  style: 'sm',
                  transition: 'opacity',
                  _hover: { opacity: 0.6 },
                })}
                type="button"
                onClick={() =>
                  setValue('mode', mode === 'text' ? 'file' : 'text')
                }
              >
                {mode === 'text' ? 'Upload file' : 'Insert manually'}
              </button>
            </div>
            {mode === 'text' ? (
              <Input
                className={css({ h: '[11.25rem]' })}
                as="textarea"
                placeholder="0x9AEF69Fb0D8E30f53284F16FCf3455e6Fea31f8b 1.234 0x9fd0389e7beBF4bB555D41Fd01A86fCF8E2ac17b,56.789 0xBA9753E40186e24a931218d05b1ee8d8910403b3=1.234"
                onDragOver={
                  ((e) =>
                    e.dataTransfer.types.includes('Files') &&
                    setValue(
                      'mode',
                      'file',
                    )) as DragEventHandler<HTMLInputElement> &
                    DragEventHandler<HTMLTextAreaElement>
                }
                errorMessage={
                  errors.transactions && (
                    <ErrorMessage>{errors.transactions.message}</ErrorMessage>
                  )
                }
                {...register('transactions')}
              />
            ) : (
              <Dropzone
                className={css({ h: '[11.25rem]' })}
                i18n={{
                  placeholderSubtitle: 'CSV, XLSX, or TXT',
                }}
                options={{
                  accept: {
                    '': ['.csv', '.xls', '.xlsx', '.txt'],
                  },
                  onDrop: handleDrop,
                }}
              />
            )}
          </div>
        </div>
        <Button type="submit" size="lg">
          send
        </Button>
      </form>
      <TransferModal />
    </>
  );
};
