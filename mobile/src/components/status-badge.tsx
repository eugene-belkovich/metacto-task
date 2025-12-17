import { Badge } from '@/components/ui/badge';
import type { FeatureStatus } from '@/types/feature';

interface StatusBadgeProps {
  status: FeatureStatus;
}

const statusLabels: Record<FeatureStatus, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
  rejected: 'Rejected',
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return <Badge variant={status}>{statusLabels[status]}</Badge>;
}
