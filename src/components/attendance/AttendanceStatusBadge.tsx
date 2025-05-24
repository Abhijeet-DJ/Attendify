import { Badge } from '@/components/ui/badge';
import type { AttendanceStatus } from '@/types';
import { cn } from '@/lib/utils';

interface AttendanceStatusBadgeProps {
  status: AttendanceStatus;
  className?: string;
}

export default function AttendanceStatusBadge({ status, className }: AttendanceStatusBadgeProps) {
  let variantStyles = '';

  switch (status) {
    case 'Present':
      // Use primary for Present
      variantStyles = 'bg-primary text-primary-foreground hover:bg-primary/90 border-transparent';
      break;
    case 'Absent':
      variantStyles = 'bg-destructive text-destructive-foreground hover:bg-destructive/90 border-transparent';
      break;
    case 'Late':
      // Use accent for Late (muted purple)
      variantStyles = 'bg-accent text-accent-foreground hover:bg-accent/90 border-transparent';
      break;
    case 'Excused':
      variantStyles = 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent';
      break;
    case 'Partial':
      // Use a slightly different shade or outline for Partial
      variantStyles = 'border-yellow-500 text-yellow-700 bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-600 dark:bg-yellow-600/20';
      break;
    default:
      variantStyles = 'bg-muted text-muted-foreground hover:bg-muted/80 border-transparent';
  }

  return (
    <Badge className={cn('font-semibold', variantStyles, className)}>
      {status}
    </Badge>
  );
}
