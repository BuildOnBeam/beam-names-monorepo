import { useNftTransferStore } from '@/components/features/NftOverview/NftTransfer/useNftTransferStore';
import { StatusCircle } from '@/components';
import { getExplorerUrl } from '@/helpers';
import { text, vstack } from '@onbeam/styled-system/patterns';
import { Button, Divider } from '@onbeam/ui';
import { SuccessIcon } from '@/icons';
import { motion } from 'motion/react';

export const NftTransferSuccess = () => {
  const { transactionHash, reset } = useNftTransferStore();

  return (
    <div className={vstack({ align: 'center', gap: '6', pt: '10' })}>
      <StatusCircle status="success" transition={{ delay: 0.3 }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <SuccessIcon />
        </motion.div>
      </StatusCircle>
      <motion.p
        className={text({ color: 'green.400', mb: '10' })}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        NFTs sent successfully
      </motion.p>
      <Divider />
      <div className={vstack({ w: 'full', gap: '2' })}>
        {transactionHash && (
          <Button
            as="a"
            size="lg"
            variant="secondary"
            href={getExplorerUrl(transactionHash)}
            target="_blank"
            rel="noopener noreferrer"
          >
            view transaction
          </Button>
        )}
        <Button size="lg" onClick={reset}>
          close
        </Button>
      </div>
    </div>
  );
};
