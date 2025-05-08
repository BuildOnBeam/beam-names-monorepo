import { GetCollectionsV7ResponseCollectionsItem } from '@/api/reservoir-api';
import { ApproveStatus } from './NftTransferApprove.types';
import { text } from '@onbeam/styled-system/patterns';
import { css } from '@onbeam/styled-system/css';
import {
  StatusCircle,
  StatusCircleStatus,
} from '@/components/shared/StatusCircle';

const statusMap: Partial<Record<ApproveStatus, StatusCircleStatus>> = {
  [ApproveStatus.APPROVING]: 'loading',
  [ApproveStatus.ERROR]: 'error',
  [ApproveStatus.SUCCESS]: 'success',
};

export const NftTransferApproveCollection = ({
  status,
  image,
  name,
}: { status: ApproveStatus } & GetCollectionsV7ResponseCollectionsItem) => (
  <>
    <StatusCircle status={statusMap[status]}>
      <img
        className={css({
          w: 'full',
          h: 'full',
          objectFit: 'cover',
          rounded: 'full',
          bg: 'mono.900',
        })}
        src={image || '/images/fallback.png'}
        alt={`${name} logo`}
      />
    </StatusCircle>
    <p className={text({ style: 'xl', my: '5' })}>{name}</p>
  </>
);
