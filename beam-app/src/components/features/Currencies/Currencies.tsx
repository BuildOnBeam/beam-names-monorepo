'use client';

import { PlusIcon } from '@onbeam/icons';
import { css, cx } from '@onbeam/styled-system/css';
import { flex, grid, text, vstack } from '@onbeam/styled-system/patterns';
import { tile } from '@onbeam/styled-system/recipes';
import { Button, Divider } from '@onbeam/ui';
import { CurrencyListItem } from './CurrencyListItem';
import { useState } from 'react';
import { AddCurrencyModal } from './AddCurrencyModal';
import { RefetchBalancesButton } from './RefetchBalancesButton';
import {
  defaultCurrencies,
  recommendedCurrencies,
} from '@/constants/currencies';
import { RecommendedCurrencyItem } from './RecommendedCurrencyItem';
import { compareAddresses } from '@onbeam/utils';
import { AnimatePresence, motion, Reorder } from 'motion/react';
import { Currency, useCurrencies } from '@/helpers';
import { matchCurrencySearch } from './Currencies.utils';
import {
  EmptyResults,
  SearchBar,
  SectionHeader,
  SkeletonList,
} from '@/components';

export const Currencies = () => {
  const { currencies, isLoading } = useCurrencies();
  const [search, setSearch] = useState('');

  const handleReorder = (currencies: Currency[]) => {
    if (search) return;
    useCurrencies.setState({ currencies });
  };

  const notAddedRecommendedCurrencies = recommendedCurrencies.filter(
    (rc) => !currencies.some((c) => compareAddresses(c.address, rc.address)),
  );

  const filteredCurrencies = currencies.filter(
    (currency) => !search || matchCurrencySearch(currency, search),
  );

  return (
    <>
      <SectionHeader title="All Tokens" backHref="/">
        <Button
          size="sm"
          iconLeft={<PlusIcon />}
          className={css({ ml: 'auto' })}
          onClick={() =>
            useCurrencies.setState({ isAddCurrencyModalOpen: true })
          }
        >
          add token
        </Button>
      </SectionHeader>
      <div
        className={cx(
          tile(),
          vstack({ p: '4', flexGrow: '1', overflow: 'hidden' }),
        )}
      >
        <div className={flex({ gap: '3', align: 'center' })}>
          <SearchBar
            placeholder="Search token"
            value={search}
            setValue={setSearch}
          />
          <RefetchBalancesButton />
        </div>
        <div className={flex({ gap: '4', align: 'center', my: '4' })}>
          <h3 className={text({ style: 'base', whiteSpace: 'nowrap' })}>
            Favorite Tokens
          </h3>
          <Divider />
        </div>
        <Reorder.Group
          axis="y"
          values={filteredCurrencies}
          onReorder={handleReorder}
          className={vstack({
            rounded: 'sm',
            border: '1px solid',
            borderColor: 'mono.900',
            overflow: 'hidden',
          })}
          layout
          layoutRoot
        >
          {isLoading ? (
            <div className={vstack({ gap: '0.5' })}>
              <SkeletonList
                count={defaultCurrencies.length}
                className={css({ h: '[4.25rem]', rounded: 'none' })}
              />
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {!!filteredCurrencies.length ? (
                filteredCurrencies.map((currency, index) => (
                  <CurrencyListItem
                    key={currency.address}
                    currency={currency}
                    isDragDisabled={!!search.length}
                    isLast={index === filteredCurrencies.length - 1}
                  />
                ))
              ) : (
                <motion.div
                  key="empty"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <EmptyResults
                    className={css({ py: '16' })}
                    noun="tokens"
                    onClear={() => setSearch('')}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </Reorder.Group>
        <AnimatePresence initial={false}>
          {!!notAddedRecommendedCurrencies.length && (
            <motion.div
              className={css({ mt: 'auto' })}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <div className={flex({ gap: '4', align: 'center', my: '4' })}>
                <h3 className={text({ style: 'base', whiteSpace: 'nowrap' })}>
                  Other Tokens
                </h3>
                <Divider />
              </div>
              <div
                className={grid({
                  gap: '4',
                  columns: { base: 1, sm: 2, md: 3 },
                })}
              >
                {isLoading ? (
                  <SkeletonList
                    count={recommendedCurrencies.length}
                    className={css({ h: '[3.875rem]' })}
                  />
                ) : (
                  <AnimatePresence initial={false} mode="popLayout">
                    {notAddedRecommendedCurrencies.map((currency) => (
                      <motion.div
                        key={currency.address}
                        initial={{
                          scale: 0,
                          height: 0,
                        }}
                        animate={{
                          scale: 1,
                          height: 'auto',
                        }}
                        exit={{
                          scale: 0,
                          height: 0,
                        }}
                        layout
                      >
                        <RecommendedCurrencyItem currency={currency} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <AddCurrencyModal />
    </>
  );
};
