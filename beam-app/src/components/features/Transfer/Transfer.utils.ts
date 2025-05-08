import { Currency } from '@/helpers';
import { compareAddresses, isNumber } from '@onbeam/utils';
import { Address, isAddress } from 'viem';
import { z } from 'zod';

export const TRANSFER_ITEM_LIMIT = 25;

type Currencies = (Currency & { balance?: number })[];

const tokensSchema = (currencies: Currencies) =>
  z.array(
    z
      .object({
        amount: z
          .number({
            invalid_type_error: 'Please enter an amount greater than zero',
          })
          .positive('Please enter an amount greater than zero')
          .optional(),
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
      })
      .superRefine(({ amount, currencyAddress }, ctx) => {
        const balance = currencies.find((c) =>
          compareAddresses(c.address, currencyAddress),
        )?.balance;

        if (!isNumber(balance)) return;

        if ((amount || 0) > balance) {
          ctx.addIssue({
            path: ['amount'],
            code: z.ZodIssueCode.custom,
            message:
              'Please ensure that the desired transfer amount does not exceed your balance',
          });
        }
      }),
  );

const recipientSchema = (userAddress?: Address) =>
  z
    .custom<Address>(isAddress, {
      message: 'Please enter a valid recipient address',
    })
    .refine((value) => !compareAddresses(value, userAddress), {
      message:
        "Please use a different address, you can't transfer to the same address that you're currently connected with",
    });

export const transferSchema = (currencies: Currencies, userAddress?: Address) =>
  z
    .object({
      transactions: z.array(
        z.object({
          tokens: tokensSchema(currencies),
          recipient: recipientSchema(userAddress),
        }),
      ),
    })
    .superRefine(({ transactions }, ctx) => {
      const balances = Object.fromEntries(
        currencies.map(({ address, balance }) => [
          address.toLowerCase(),
          balance || 0,
        ]),
      );

      transactions
        .flatMap((transaction, transactionIndex) =>
          transaction.tokens.map((token, tokenIndex) => ({
            ...token,
            transactionIndex,
            tokenIndex,
          })),
        )
        .reduce(
          (
            totals,
            { amount, currencyAddress, transactionIndex, tokenIndex },
          ) => {
            const key = currencyAddress.toLowerCase();
            const newTotal = (totals[key] || 0) + (amount || 0);
            totals[key] = newTotal;

            if (newTotal > (balances[key] || 0)) {
              ctx.addIssue({
                path: [
                  'transactions',
                  transactionIndex,
                  'tokens',
                  tokenIndex,
                  'amount',
                ],
                code: z.ZodIssueCode.custom,
                message:
                  'Please ensure the total amount does not exceed your balance',
              });
            }

            return totals;
          },
          {} as Record<string, number>,
        );
    });

export type TransferSchema = z.TypeOf<ReturnType<typeof transferSchema>>;
