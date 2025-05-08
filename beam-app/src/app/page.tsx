import { DisconnectedBoundary } from '@/components';
import { Wallet } from '@/components/features/Wallet';

export default function HomePage() {
  return (
    <DisconnectedBoundary>
      <Wallet />
    </DisconnectedBoundary>
  );
}
