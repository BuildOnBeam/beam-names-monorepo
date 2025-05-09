// src/components/TransferItem.tsx
'use client';

import { TransferSchema } from '../Transfer.utils';
import { TransferItemTokenInput } from './TransferItemTokenInput';
import { PlusIcon } from '@onbeam/icons';
import { css, cx } from '@onbeam/styled-system/css';
import { flex, text, vstack } from '@onbeam/styled-system/patterns';
import { tile } from '@onbeam/styled-system/recipes';
import { Button, ErrorMessage, Input, Tooltip } from '@onbeam/ui';
import { padString, waitMs } from '@onbeam/utils';
import { motion } from 'motion/react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Address } from 'viem';
import { useState } from 'react';
import { resolveBeamName } from '../utils/ens';

const TRANSFER_TOKEN_LIMIT = 10;

type Props = {
  transactionIndex: number;
  onRemove(): void;
};

export const TransferItem = ({ transactionIndex, onRemove }: Props) => {
  const [isRemoved, setRemoved] = useState(false);
  const [resolvedAddress, setResolvedAddress] = useState<string | null>(null);
  const [originalInput, setOriginalInput] = useState<string | null>(null);
  const [resolveError, setResolveError] = useState<string | null>(null);

  const {
    control,
    register,
    setValue,
    formState: { errors },
  } = useFormContext<TransferSchema>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `transactions.${transactionIndex}.tokens`,
  });

  const handleRemove = async () => {
    setRemoved(true);
    await waitMs(300);
    onRemove();
  };

  const handleResolve = async () => {
    setResolveError(null);
    setResolvedAddress(null);
    setOriginalInput(null);

    const recipientInput = control._formValues.transactions[transactionIndex].recipient;
    if (!recipientInput) {
      setResolveError('Please enter a recipient');
      return;
    }

    try {
      setOriginalInput(recipientInput);
      setValue(`transactions.${transactionIndex}.beamName`, recipientInput);
      if (recipientInput.endsWith('.beam')) {
        const address = await resolveBeamName(recipientInput);
        setResolvedAddress(address);
        setValue(`transactions.${transactionIndex}.recipient`, address as Address, {
          shouldValidate: true,
        });
      } else {
        setResolvedAddress(recipientInput);
        setValue(`transactions.${transactionIndex}.recipient`, recipientInput as Address, {
          shouldValidate: true,
        });
      }
    } catch (err) {
      setResolveError(`Failed to resolve ${recipientInput}: ${err.message}`);
    }
  };


  const hasHitLimit = fields.length >= TRANSFER_TOKEN_LIMIT;

  return (
    <motion.div
      className={css({ w: 'full', overflow: 'hidden' })}
      animate={isRemoved ? { height: 0, opacity: 0 } : { height: 'auto', opacity: 1 }}
      {...(!!transactionIndex && { initial: { height: 0, opacity: 0 } })}
    >
      <motion.div className={cx(tile(), vstack({ p: '5', mb: '4' }))}>
        <div
          className={flex({
            justify: 'space-between',
            align: 'center',
            gap: '3',
            mb: '3',
          })}
        >
          <p className={text({ color: 'mono.200' })}>
            send_item_{padString(transactionIndex + 1, 2, '0')}
          </p>
          {!!transactionIndex && (
            <Button onClick={handleRemove} size="sm">
              delete
            </Button>
          )}
        </div>
        {fields.map((field, tokenIndex) => (
          <TransferItemTokenInput
            key={field.id}
            transactionIndex={transactionIndex}
            tokenIndex={tokenIndex}
            onRemove={() => remove(tokenIndex)}
          />
        ))}
        <div className={vstack({ gap: '3' })}>
          <Tooltip
            label={`You've reached the limit of ${TRANSFER_TOKEN_LIMIT} tokens.`}
            disabled={!hasHitLimit}
          >
            <Button
              className="group"
              onClick={() => append({ currencyAddress: '' as Address })}
              size="lg"
              disabled={hasHitLimit}
            >
              <PlusIcon className={css({ _groupDisabled: { opacity: 0.1 } })} />
              add token
            </Button>
          </Tooltip>
          <div className={flex({ gap: '2', align: 'center' })}>
            <Input
              placeholder="Recipient address or beam name"
              errorMessage={
                (errors.transactions?.[transactionIndex]?.recipient?.message || resolveError) && (
                  <ErrorMessage>
                    {errors.transactions?.[transactionIndex]?.recipient?.message || resolveError}
                  </ErrorMessage>
                )
              }
              {...register(`transactions.${transactionIndex}.recipient`)}
            />
            <Button onClick={handleResolve} size="sm">
              Resolve
            </Button>
          </div>
          {originalInput && resolvedAddress && (
            <div className={vstack({ gap: '1', align: 'start' })}>
              {originalInput.endsWith('.beam') && (
                <p className={text({ fontWeight: 'bold', fontSize: 'sm' })}>
                  Name: {originalInput}
                </p>
              )}
              <p
                className={text({
                  fontStyle: 'italic',
                  fontSize: 'xs',
                  color: 'mono.200',
                })}
              >
                Address: {resolvedAddress}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};