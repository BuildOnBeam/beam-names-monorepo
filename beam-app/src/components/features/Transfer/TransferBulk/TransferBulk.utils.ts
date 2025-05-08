import { fromTextareaString } from './TransferBulkForm.utils';
import { Currency } from '@/helpers';
import { compareAddresses } from '@onbeam/utils';
import { Address, isAddress } from 'viem';
import { z } from 'zod';

const TRANSACTION_LIMIT = 500;

type Currencies = (Currency & { balance?: number })[];

export const transferBulkSchema = (currencies: Currencies) =>
  z
    .object({
      mode: z.enum(['text', 'file']),
      currencyAddress: z
        .custom<Address>(isAddress, {
          message: 'Please select a valid token',
        })
        .refine(
          (value) =>
            currencies.some((currency) =>
              compareAddresses(currency.address, value),
            ),
          {
            message: 'Please select a valid token',
          },
        ),
      transactions: z.string(),
    })
    .superRefine(({ transactions, currencyAddress }, ctx) => {
      try {
        const parsedData = fromTextareaString(transactions);

        if (parsedData.length < 1) {
          throw new Error('Add at least one row');
        }

        if (parsedData.length > TRANSACTION_LIMIT) {
          throw new Error(
            `Please ensure you don't exceed ${TRANSACTION_LIMIT} rows`,
          );
        }

        const totalAmount = parsedData.reduce(
          (acc, { amount }) => acc + amount,
          0,
        );

        const balance =
          currencies.find(({ address }) =>
            compareAddresses(address, currencyAddress),
          )?.balance || 0;

        if (totalAmount > balance) {
          throw new Error(
            'Please ensure the total amount does not exceed your balance',
          );
        }
      } catch (error) {
        ctx.addIssue({
          path: ['transactions'],
          code: z.ZodIssueCode.custom,
          message:
            error instanceof Error ? error.message : 'Unknown error occurred',
        });
      }
    });

export type TransferBulkSchema = z.TypeOf<
  ReturnType<typeof transferBulkSchema>
>;
