import { Currency } from '@/helpers';
import { ReactNode } from 'react';

export type RemoveCurrencyModalProps = {
  currency: Currency;
  trigger: ReactNode;
};
