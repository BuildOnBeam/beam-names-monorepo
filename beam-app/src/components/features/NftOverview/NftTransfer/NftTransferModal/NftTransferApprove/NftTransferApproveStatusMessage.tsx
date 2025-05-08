import { ErrorIcon, SuccessIcon } from '@onbeam/icons';
import { flex, text } from '@onbeam/styled-system/patterns';
import { AnimatePresence, motion } from 'motion/react';
import { ApproveStatus } from './NftTransferApprove.types';
import { ReactNode } from 'react';
import { css } from '@onbeam/styled-system/css';
import { SystemStyleObject } from '@onbeam/styled-system/types';

const statusMessageMap: Partial<
  Record<
    ApproveStatus,
    { icon: ReactNode; description: string; styles: SystemStyleObject }
  >
> = {
  [ApproveStatus.ERROR]: {
    icon: <ErrorIcon width={18} height={18} />,
    description: 'Failed to approve collection, please try again',
    styles: css.raw({ color: 'red.500' }),
  },
  [ApproveStatus.SUCCESS]: {
    icon: <SuccessIcon width={18} height={18} />,
    description: 'Collection approved successfully',
    styles: css.raw({ color: 'green.400' }),
  },
};

export const NftTransferApproveStatusMessage = ({
  status,
}: { status: ApproveStatus }) => {
  const statusMessage = statusMessageMap[status];

  return (
    <AnimatePresence>
      {statusMessage && (
        <motion.div
          className={flex({
            gap: '2',
            justify: 'center',
            align: 'center',
          })}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          {statusMessage.icon}
          <p className={text({ style: 'base', ...statusMessage.styles })}>
            {statusMessage.description}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
