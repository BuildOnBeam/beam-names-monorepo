import { Currency } from '@/helpers';
import { compareAddresses } from '@onbeam/utils';

export const matchCurrencySearch = (token: Currency, query: string) =>
  token.name.toLowerCase().includes(query.toLowerCase()) ||
  token.symbol.toLowerCase().includes(query.toLowerCase()) ||
  compareAddresses(token.address, query);
