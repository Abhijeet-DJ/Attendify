
'use client';

import type { ReactNode } from 'react';
import { useAuth } from '@clerk/nextjs';
import AppLayout from './AppLayout';
import PublicLayout from './PublicLayout';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { cn } from '@/lib/utils';

export default function AppShell({ children, className }: { children: ReactNode, className?: string }) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <div className={cn("flex h-screen w-full items-center justify-center bg-background", className)}>
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (isSignedIn) {
    return <AppLayout>{children}</AppLayout>;
  }
  
  return <PublicLayout>{children}</PublicLayout>;
}
