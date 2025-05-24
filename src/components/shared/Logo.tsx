import { ClipboardCheck } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Logo({ size = 'md', className }: LogoProps) {
  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-7 w-7',
    lg: 'h-9 w-9',
  };
  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <ClipboardCheck className={`${sizeClasses[size]} text-primary`} />
      <span className={`font-bold ${textSizeClasses[size]} text-sidebar-foreground group-data-[collapsible=icon]:hidden`}>
        Attendify
      </span>
    </div>
  );
}
