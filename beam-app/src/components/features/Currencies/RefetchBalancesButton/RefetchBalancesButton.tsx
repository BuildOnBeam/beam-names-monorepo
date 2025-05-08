import { useBalance } from '@onbeam/features';
import { RefreshIcon } from '@onbeam/icons';
import { css } from '@onbeam/styled-system/css';
import { IconButton } from '@onbeam/ui';
import { motion, useAnimationControls } from 'motion/react';

export const RefetchBalancesButton = () => {
  const controls = useAnimationControls();
  const { refetchBalances } = useBalance();

  const handleRefetchBalances = async () => {
    controls.start({
      rotate: 360,
      transition: {
        type: 'spring',
        duration: 1.2,
        repeat: Number.POSITIVE_INFINITY,
      },
    });

    await refetchBalances();
    await controls.start({
      rotate: 360,
      transition: { type: 'spring', duration: 1.2 },
    });

    controls.set({ rotate: 0 });
  };

  return (
    <IconButton
      className={css({ flexShrink: 0 })}
      onClick={handleRefetchBalances}
      aria-label="Refresh balances"
      title="Refresh balances"
    >
      <motion.div animate={controls}>
        <RefreshIcon className={css({ w: '[1.25rem]', h: '[1.25rem]' })} />
      </motion.div>
    </IconButton>
  );
};
