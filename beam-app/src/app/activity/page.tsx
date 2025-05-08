import { DisconnectedBoundary, SectionHeader } from '@/components';
import { Activity } from '@/components/features/Activity';

export default function ActivityPage() {
  return (
    <DisconnectedBoundary>
      <SectionHeader title="Activity" />
      <Activity />
    </DisconnectedBoundary>
  );
}
