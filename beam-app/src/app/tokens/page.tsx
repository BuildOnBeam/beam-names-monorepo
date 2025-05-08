import { DisconnectedBoundary } from '@/components';
import { Currencies } from '@/components/features/Currencies';

export default function TokensPage() {
  return (
    <DisconnectedBoundary>
      <Currencies />
    </DisconnectedBoundary>
  );
}
