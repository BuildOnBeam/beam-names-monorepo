import {
  handleTransferNfts,
  transferNftSchema,
  TransferNftSchemaType,
} from './NftTransferSend.utils';
import { flex, vstack } from '@onbeam/styled-system/patterns';
import { Button, Divider, ErrorMessage, Input, Label, toast } from '@onbeam/ui';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAccount } from 'wagmi';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useNftTransferStore,
  NftTransferState,
} from '@/components/features/NftOverview/NftTransfer/useNftTransferStore';
import { queryClient } from '@/components/Providers';
import { BaseError } from 'viem';

export const NftTransferSend = () => {
  const { selectedNfts, setState } = useNftTransferStore();
  const { address: userAddress } = useAccount();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TransferNftSchemaType>({
    resolver: zodResolver(transferNftSchema(userAddress)),
  });

  const onSubmit: SubmitHandler<TransferNftSchemaType> = async ({
    recipient,
  }) => {
    try {
      const transactionHash = await handleTransferNfts(
        recipient,
        selectedNfts.filter((nft) => nft.quantity),
      );

      queryClient.invalidateQueries({
        queryKey: ['nft-overview'],
      });

      setState({
        state: NftTransferState.SUCCESS,
        transactionHash,
      });
    } catch (error) {
      toast.error('Failed to send NFTs', {
        description:
          error instanceof BaseError
            ? error.shortMessage
            : 'Something went wrong, please try again later',
      });
    }
  };

  return (
    <form className={vstack({ gap: '6' })} onSubmit={handleSubmit(onSubmit)}>
      <Input
        label={<Label>Recipient address</Label>}
        placeholder="Recipient address"
        errorMessage={
          errors.recipient && (
            <ErrorMessage>{errors.recipient.message}</ErrorMessage>
          )
        }
        {...register('recipient')}
      />
      <Divider />
      <div className={flex({ w: 'full', gap: '3', md: { gap: '6' } })}>
        <Button
          variant="secondary"
          size="lg"
          onClick={() => setState({ state: NftTransferState.IDLE })}
          disabled={isSubmitting}
        >
          back
        </Button>
        <Button type="submit" size="lg" isLoading={isSubmitting}>
          send
        </Button>
      </div>
    </form>
  );
};
