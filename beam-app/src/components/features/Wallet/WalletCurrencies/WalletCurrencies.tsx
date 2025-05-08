'use client';

import { useCurrencies } from '@/helpers';
import { CurrencyTile } from './CurrencyTile';
import { SendIcon, ArrowUpDownIcon } from '@onbeam/icons';
import { css, cx } from '@onbeam/styled-system/css';
import { flex, vstack } from '@onbeam/styled-system/patterns';
import { gridBackground, tile } from '@onbeam/styled-system/recipes';
import { Button, Divider } from '@onbeam/ui';
import Link from 'next/link';
import { Fragment } from 'react';

export const WalletCurrencies = () => {
  const { currencies } = useCurrencies();
  const topCurrencies = currencies.slice(0, 3);

  return (
    <div
      className={cx(
        tile(),
        vstack({
          gap: '4',
          p: '4',
          md: {
            p: '0',
            bg: '[unset]',
            border: 'none',
            shadow: '[none]',
          },
        }),
      )}
    >
      <div className={flex({ gap: '4', md: { display: 'none' } })}>
        <Button
          as={Link}
          href="/send"
          className={css({ rounded: 'md', gap: '2' })}
          size="lg"
        >
          <SendIcon width={24} height={24} />
          send
        </Button>
        <Button
          as={Link}
          href="/swap"
          className={css({ rounded: 'md', gap: '2' })}
          size="lg"
        >
          <ArrowUpDownIcon width={24} height={24} />
          swap
        </Button>
      </div>
      <div
        className={cx(
          gridBackground(),
          flex({
            bg: 'mono.650',
            direction: 'column',
            mx: '-4',
            md: {
              bg: '[unset]',
              mx: '0',
              flexDir: 'row',
              gap: '4',
              _after: { display: 'none' },
            },
          }),
        )}
      >
        {topCurrencies.map((currency) => (
          <Fragment key={currency.address}>
            <CurrencyTile currency={currency} />
            <Divider className={css({ md: { display: 'none' } })} />
          </Fragment>
        ))}
      </div>
    </div>
  );
};
