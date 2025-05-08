import { Button, Popover } from '@onbeam/ui';
import Link from 'next/link';
import { CurrencyActionsProps } from './CurrencyActions.types';
import { vstack } from '@onbeam/styled-system/patterns';
import { compareAddresses } from '@onbeam/utils';
import { RemoveCurrencyModal } from '../RemoveCurrencyModal';
import { defaultCurrencies } from '@/constants/currencies';

export const CurrencyActions = ({
  currency,
  trigger,
}: CurrencyActionsProps) => {
  const isDefaultCurrency = defaultCurrencies.some((c) =>
    compareAddresses(c.address, currency.address),
  );

  return (
    <Popover size="sm" trigger={trigger}>
      <div className={vstack({ gap: '2' })}>
        <Button as={Link} href={`/send?currency=${currency.symbol}`} size="sm">
          send
        </Button>
        <Button as={Link} href={`/swap?currency=${currency.symbol}`} size="sm">
          swap
        </Button>
        <Button
          as={Link}
          href={`/bridge?currency=${currency.symbol}`}
          size="sm"
        >
          bridge
        </Button>
        {!isDefaultCurrency && (
          <RemoveCurrencyModal
            currency={currency}
            trigger={<Button size="sm">remove</Button>}
          />
        )}
      </div>
    </Popover>
  );
};
