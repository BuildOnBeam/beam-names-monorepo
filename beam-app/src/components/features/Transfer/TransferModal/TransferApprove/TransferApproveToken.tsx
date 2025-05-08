import { ApproveStatus } from './TransferApprove.types';
import { text } from '@onbeam/styled-system/patterns';
import {
  StatusCircle,
  StatusCircleStatus,
} from '@/components/shared/StatusCircle';
import { formatTokenAmount } from '@onbeam/utils';
import { CurrencyIcon } from '@onbeam/icons';

const statusMap: Partial<Record<ApproveStatus, StatusCircleStatus>> = {
  [ApproveStatus.APPROVING]: 'loading',
  [ApproveStatus.ERROR]: 'error',
  [ApproveStatus.SUCCESS]: 'success',
};

type Props = { status: ApproveStatus; symbol: string; amount: number };

export const TransferApproveToken = ({ status, symbol, amount }: Props) => (
  <>
    <StatusCircle status={statusMap[status]}>
      {<CurrencyIcon symbol={symbol} size={64} />}
    </StatusCircle>
    <p className={text({ style: 'xl', my: '5' })}>
      {formatTokenAmount(amount, { symbol })}
    </p>
  </>
);
