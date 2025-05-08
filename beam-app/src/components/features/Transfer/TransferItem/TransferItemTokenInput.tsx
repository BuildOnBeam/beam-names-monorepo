import { TransferSchema } from '../Transfer.utils';
import { DEFAULT_CHAIN_ID } from '@/constants';
import { useBalance, useConversionRate } from '@onbeam/features';
import { css } from '@onbeam/styled-system/css';
import { flex } from '@onbeam/styled-system/patterns';
import { Button, DappInputField, ErrorMessage } from '@onbeam/ui';
import {
  compareAddresses,
  formatTokenAmount,
  isBeamConnector,
  waitMs,
} from '@onbeam/utils';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Address } from 'viem';
import { useCurrencies } from '@/helpers';
import { TransferSelectModal } from '../TransferSelectModal';
import { nativeCurrency } from '@/constants/currencies';
import { getRemainingAmountAfterGas } from './TransferItemTokenInput.utils';
import { useAccount } from 'wagmi';

type Props = {
  transactionIndex: number;
  tokenIndex: number;
  onRemove(): void;
};

export const TransferItemTokenInput = ({
  transactionIndex,
  tokenIndex,
  onRemove,
}: Props) => {
  const [isMaxLoading, setIsMaxLoading] = useState(false);
  const [isRemoved, setRemoved] = useState(false);
  const { connector, address } = useAccount();
  const { getBalance } = useBalance();
  const { getConversionRate } = useConversionRate();
  const { currencies } = useCurrencies();
  const {
    control,
    watch,
    register,
    setValue,
    formState: { errors },
  } = useFormContext<TransferSchema>();

  const { currencyAddress, amount } =
    watch(`transactions.${transactionIndex}.tokens.${tokenIndex}`) || {};

  const selectedCurrency = currencies.find((currency) =>
    compareAddresses(currency.address, currencyAddress),
  );

  const { balance, formattedBalance } =
    getBalance({
      address: selectedCurrency?.address || ('' as Address),
      chainId: DEFAULT_CHAIN_ID,
    }) || {};

  const usdValue =
    (getConversionRate(selectedCurrency?.symbol || ('' as Address)) || 0) *
    (amount || 0);

  const error =
    errors?.transactions?.[transactionIndex]?.tokens?.[tokenIndex]?.amount
      ?.message ||
    errors?.transactions?.[transactionIndex]?.tokens?.[tokenIndex]
      ?.currencyAddress?.message;

  const setAmount = (amount: number) =>
    setValue(
      `transactions.${transactionIndex}.tokens.${tokenIndex}.amount`,
      Math.max(Math.trunc(amount * 10_000) / 10_000, 0),
      {
        shouldValidate: true,
        shouldTouch: true,
      },
    );

  const handleMax = async () => {
    const isNative = compareAddresses(
      selectedCurrency?.address,
      nativeCurrency.address,
    );

    if (!isNative || isBeamConnector(connector)) {
      setAmount(formattedBalance || 0);
      return;
    }

    setIsMaxLoading(true);

    const amount = await getRemainingAmountAfterGas({ balance, address });

    setAmount(amount);
    setIsMaxLoading(false);
  };

  const handleRemove = async () => {
    setRemoved(true);
    await waitMs(300);
    onRemove();
  };

  return (
    <motion.div
      className={css({ overflow: 'hidden' })}
      animate={
        isRemoved ? { height: 0, opacity: 0 } : { height: 'auto', opacity: 1 }
      }
      {...(!!tokenIndex && { initial: { height: 0, opacity: 0 } })}
    >
      <div className={css({ pb: '3' })}>
        <DappInputField
          nativeBalance={formatTokenAmount(formattedBalance, {
            prefix: 'balance: ',
          })}
          currency={selectedCurrency?.symbol}
          usdBalance={usdValue}
          bottomRightAddon={
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleMax}
              isLoading={isMaxLoading}
            >
              max
            </Button>
          }
          topRightAddon={
            <div className={flex({ align: 'center', gap: '2' })}>
              {!!tokenIndex && (
                <Button onClick={handleRemove} size="sm">
                  delete
                </Button>
              )}
              <Controller
                control={control}
                name={`transactions.${transactionIndex}.tokens.${tokenIndex}.currencyAddress`}
                render={({ field: { value, onChange } }) => (
                  <TransferSelectModal selectedId={value} onChange={onChange} />
                )}
              />
            </div>
          }
          hasError={!!error}
          {...register(
            `transactions.${transactionIndex}.tokens.${tokenIndex}.amount`,
            { valueAsNumber: true },
          )}
        />
        <ErrorMessage className={css({ px: '3' })}>{error}</ErrorMessage>
      </div>
    </motion.div>
  );
};
