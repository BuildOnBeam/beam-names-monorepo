import { ErrorIcon } from '@onbeam/icons';
import { vstack, flex, text, link } from '@onbeam/styled-system/patterns';
import { Modal, Divider, Input, Label, Button, toast } from '@onbeam/ui';
import Link from 'next/link';
import { ChangeEvent, useState } from 'react';
import { isAddress } from 'viem';
import { CurrencyModalItem } from '../CurrencyModalItem';
import { findCurrency } from './AddCurrencyModal.utils';
import { Currency, useCurrencies } from '@/helpers';

export const AddCurrencyModal = () => {
  const { isAddCurrencyModalOpen, addCurrency } = useCurrencies();
  const [hasError, setError] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [foundCurrency, setFoundCurrency] = useState<Currency>();

  // To test:
  // Mainnet BSHIB: 0x0b6f9c8890de568ec4001318af8a9d628d3e8f0f
  // Testnet HUGECAT: 0x0436556334b4557234631052ea3a1770601d188b
  const handleSearch = async (e: ChangeEvent<HTMLInputElement>) => {
    setError(false);
    setLoading(false);
    setFoundCurrency(undefined);

    const value = e.target.value;
    if (!isAddress(value)) return;

    setLoading(true);

    const token = await findCurrency(value);

    if (token) {
      setFoundCurrency(token);
    } else {
      setError(true);
    }
    setLoading(false);
  };

  const handleAddCurrency = () => {
    if (!foundCurrency) return;
    addCurrency(foundCurrency);
    toast.success('Token added', {
      description: `${foundCurrency.name} has been added to your wallet`,
    });
    useCurrencies.setState({ isAddCurrencyModalOpen: false });
    reset();
  };

  const reset = () => {
    setFoundCurrency(undefined);
    setError(false);
    setLoading(false);
  };

  return (
    <Modal
      title="Add token"
      description="You are now adding a custom token through manually adding its address. It is your responsibility to check the accuracy and reliability of the contract address."
      open={isAddCurrencyModalOpen}
      onOpenChange={(isOpen) => {
        reset();
        useCurrencies.setState({ isAddCurrencyModalOpen: isOpen });
      }}
    >
      <div className={vstack({ gap: '6' })}>
        <Divider />
        <div className={vstack({ gap: '3' })}>
          <Input
            disabled={isLoading}
            label={<Label>Token address</Label>}
            placeholder="0x2963…"
            onChange={handleSearch}
          />
          {hasError && (
            <div
              className={flex({
                gap: '2',
                align: 'center',
                textStyle: 'base',
              })}
            >
              <ErrorIcon height={18} width={18} />
              <p className={text({ color: 'red.500' })}>
                We are not able to find a token
              </p>
              <Link
                href="mailto:support@onbeam.com"
                className={link({ color: 'mono.300', ml: 'auto' })}
              >
                contact support
              </Link>
            </div>
          )}
        </div>
        {foundCurrency && <CurrencyModalItem {...foundCurrency} />}
        <Button
          size="lg"
          isLoading={isLoading}
          disabled={!foundCurrency}
          onClick={handleAddCurrency}
        >
          confirm
        </Button>
      </div>
    </Modal>
  );
};
