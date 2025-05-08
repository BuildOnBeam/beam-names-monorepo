import { Currency } from '@/helpers';

export type CurrencyListItemProps = {
  currency: Currency;
  isDragDisabled?: boolean;
  isLast?: boolean;
};
