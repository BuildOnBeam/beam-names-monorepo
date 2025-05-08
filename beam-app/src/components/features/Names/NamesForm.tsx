// app/Names/NamesForm.tsx
'use client';

import React, { useState } from 'react';
import { create } from 'zustand';
import { SubmitHandler, useFormContext } from 'react-hook-form';
import { vstack, flex, text } from '@onbeam/styled-system/patterns';
import { css } from '@onbeam/styled-system/css';
import { Button, Input, ErrorMessage, Modal } from '@onbeam/ui';
import { NameSchema } from './Name.utils';
import { useAccount, useWriteContract } from 'wagmi';
import { namehash } from 'viem/ens';
import { ENS_CONTRACTS } from '@/config/ensContracts';
import { encodeFunctionData, formatEther } from 'viem';
import { usePublicClient } from 'wagmi';
import { Address } from 'viem';

type NameModalStore = {
  isModalOpen: boolean;
  name: string;
  status: 'idle' | 'committing' | 'waiting' | 'registering' | 'success' | 'error';
  txHash?: string;
  error?: string;
  showSuccessAlert: boolean;
  setState: (state: Partial<NameModalStore>) => void;
};

export const useNameModalStore = create<NameModalStore>((set) => ({
  isModalOpen: false,
  name: '',
  status: 'idle',
  txHash: undefined,
  error: undefined,
  showSuccessAlert: false,
  setState: (newState) => set((state) => ({ ...state, ...newState })),
}));

export const NameModal: React.FC = () => {
  const { isModalOpen, name, status, txHash, error, showSuccessAlert, setState } = useNameModalStore();
  const { address } = useAccount();

  const handleClose = () => {
    setState({ isModalOpen: false, name: '', status: 'idle', txHash: undefined, error: undefined, showSuccessAlert: false });
  };

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={handleClose} title="Confirm Name Registration">
        <div className={vstack({ gap: '4', p: '4' })}>
          <p className={text({ fontWeight: 'bold', fontSize: 'sm' })}>
            Name: {name}.beam
          </p>
          {address && (
            <p
              className={text({
                fontStyle: 'italic',
                fontSize: 'xs',
                color: 'mono.200',
              })}
            >
              Address: {address}
            </p>
          )}
          {status === 'committing' && (
            <p className={text({ color: 'mono.200' })}>
              Committing name reservation...
            </p>
          )}
          {status === 'waiting' && (
            <p className={text({ color: 'mono.200' })}>
              Waiting 1 minute before registering...
            </p>
          )}
          {status === 'registering' && (
            <p className={text({ color: 'mono.200' })}>
              Registering name, confirm the transaction in your wallet...
            </p>
          )}
          {status === 'success' && txHash && (
            <div className={vstack({ gap: '2' })}>
              <p className={text({ color: 'green.500' })}>
                Name registered successfully!
              </p>
              <p>
                <a
                  href={`https://subnets.avax.network/beam/testnet/explorer/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={text({ color: 'blue.500' })}
                >
                  View Transaction on Explorer
                </a>
              </p>
              <Button onClick={handleClose} size="lg">
                Close
              </Button>
            </div>
          )}
          {status === 'error' && error && (
            <div className={vstack({ gap: '2' })}>
              <p className={text({ color: 'red.500' })}>{error}</p>
              <Button onClick={handleClose} size="lg">
                Close
              </Button>
            </div>
          )}
        </div>
      </Modal>
      {showSuccessAlert && (
        <div
          className={css({
            position: 'fixed',
            top: '4',
            right: '4',
            bg: 'green.500',
            color: 'white',
            p: '4',
            borderRadius: 'md',
            boxShadow: 'lg',
            zIndex: 1000,
          })}
        >
          <p className={text({ fontWeight: 'bold' })}>
            Success: {name}.beam has been registered!
          </p>
          <Button
            size="sm"
            onClick={() => setState({ showSuccessAlert: false })}
            className={css({ mt: '2' })}
          >
            Close
          </Button>
        </div>
      )}
    </>
  );
};

export const NamesForm = () => {
  const { control, handleSubmit, register, formState: { errors }, watch } = useFormContext<NameSchema>();
  const [priceWei, setPriceWei] = useState<bigint | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();

  const name = watch('name');

  const checkAvailabilityAndPrice = async () => {
    if (!name || errors.name) return;

    try {
      const controller = {
        address: ENS_CONTRACTS.CONTROLLER_ADDRESS as Address,
        abi: [
          {
            inputs: [{ name: 'name', type: 'string' }],
            name: 'available',
            outputs: [{ name: '', type: 'bool' }],
            stateMutability: 'view',
            type: 'function',
          },
        ],
      };

      const priceOracle = {
        address: ENS_CONTRACTS.PRICE_ORACLE_ADDRESS as Address,
        abi: [
          {
            inputs: [
              { name: 'name', type: 'string' },
              { name: 'expires', type: 'uint256' },
              { name: 'duration', type: 'uint256' },
            ],
            name: 'price',
            outputs: [
              {
                components: [
                  { name: 'base', type: 'uint256' },
                  { name: 'premium', type: 'uint256' },
                ],
                name: '',
                type: 'tuple',
              },
            ],
            stateMutability: 'view',
            type: 'function',
          },
        ],
      };

      const available = await publicClient.readContract({
        ...controller,
        functionName: 'available',
        args: [name],
      });

      setIsAvailable(available);

      if (available) {
        const priceData = await publicClient.readContract({
          ...priceOracle,
          functionName: 'price',
          args: [name, 0n, 31536000n], // 1 year
        });

        const totalPrice = priceData.base + (priceData.premium || 0n);
        setPriceWei(totalPrice);
      } else {
        setPriceWei(null);
      }
    } catch (err) {
      console.error('Error checking availability/price:', err);
    }
  };

  const onSubmit: SubmitHandler<NameSchema> = async ({ name, duration, owner }) => {
    if (!isAvailable || !priceWei) return;

    try {
      const domain = `${name}.beam`;
      const node = namehash(domain);
      const secret = '0x' + Buffer.from('secret').toString('hex').padEnd(64, '0');

      const setAddrData = encodeFunctionData({
        abi: [
          {
            name: 'setAddr',
            type: 'function',
            inputs: [
              { name: 'node', type: 'bytes32' },
              { name: 'addr', type: 'address' },
            ],
            outputs: [],
            stateMutability: 'nonpayable',
          },
        ],
        functionName: 'setAddr',
        args: [node, owner],
      });

      // Step 1: Make commitment
      useNameModalStore.setState({ isModalOpen: true, name, status: 'committing' });

      const commitmentHash = await publicClient.readContract({
        address: ENS_CONTRACTS.CONTROLLER_ADDRESS as Address,
        abi: [
          {
            inputs: [
              { name: 'name', type: 'string' },
              { name: 'owner', type: 'address' },
              { name: 'duration', type: 'uint256' },
              { name: 'secret', type: 'bytes32' },
              { name: 'resolver', type: 'address' },
              { name: 'data', type: 'bytes[]' },
              { name: 'reverseRecord', type: 'bool' },
              { name: 'fuses', type: 'uint16' },
            ],
            name: 'makeCommitment',
            outputs: [{ name: '', type: 'bytes32' }],
            stateMutability: 'view',
            type: 'function',
          },
        ],
        functionName: 'makeCommitment',
        args: [
          name,
          owner,
          BigInt(duration),
          secret as `0x${string}`,
          ENS_CONTRACTS.RESOLVER_ADDRESS as Address,
          [setAddrData],
          false,
          0,
        ],
      });

      await writeContractAsync({
        address: ENS_CONTRACTS.CONTROLLER_ADDRESS as Address,
        abi: [
          {
            inputs: [{ name: 'commitment', type: 'bytes32' }],
            name: 'commit',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
        ],
        functionName: 'commit',
        args: [commitmentHash],
      });

      // Step 2: Wait for minCommitmentAge (1 minute)
      useNameModalStore.setState({ status: 'waiting' });
      await new Promise((resolve) => setTimeout(resolve, 60000)); // 1 minute

      // Step 3: Register the name
      useNameModalStore.setState({ status: 'registering' });

      const txHash = await writeContractAsync({
        address: ENS_CONTRACTS.CONTROLLER_ADDRESS as Address,
        abi: [
          {
            inputs: [
              { name: 'name', type: 'string' },
              { name: 'owner', type: 'address' },
              { name: 'duration', type: 'uint256' },
              { name: 'secret', type: 'bytes32' },
              { name: 'resolver', type: 'address' },
              { name: 'data', type: 'bytes[]' },
              { name: 'reverseRecord', type: 'bool' },
              { name: 'fuses', type: 'uint16' },
            ],
            name: 'register',
            outputs: [],
            stateMutability: 'payable',
            type: 'function',
          },
        ],
        functionName: 'register',
        args: [
          name,
          owner,
          BigInt(duration),
          secret as `0x${string}`,
          ENS_CONTRACTS.RESOLVER_ADDRESS as Address,
          [setAddrData],
          false,
          0,
        ],
        value: priceWei,
      });

      useNameModalStore.setState({
        status: 'success',
        txHash,
        showSuccessAlert: true,
      });
    } catch (err) {
      useNameModalStore.setState({
        status: 'error',
        error: `Failed to register name: ${err.message}`,
      });
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={vstack({ align: 'center', gap: '4' })}
      >
        <div className={flex({ gap: '2', align: 'center' })}>
          <Input
            placeholder="Enter name (e.g., alice for alice.beam)"
            {...register('name', { onChange: checkAvailabilityAndPrice })}
            errorMessage={errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
          />
          <span className={text({ fontSize: 'sm', color: 'mono.200' })}>.beam</span>
        </div>
        {isAvailable !== null && (
          <p className={text({ color: isAvailable ? 'green.500' : 'red.500' })}>
            {isAvailable ? `${name}.beam is available` : `${name}.beam is not available`}
          </p>
        )}
        {priceWei && isAvailable && (
          <p className={text({ fontSize: 'sm', color: 'mono.200' })}>
            Price: {formatEther(priceWei)} BEAM
          </p>
        )}
        <Button type="submit" size="lg" disabled={!isAvailable || !priceWei || !address}>
          Buy Name
        </Button>
      </form>
      <NameModal />
    </>
  );
};