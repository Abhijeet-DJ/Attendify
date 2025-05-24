
'use client';

import type { ReactNode } from 'react';
// import { useAuth } from '@clerk/nextjs'; // Clerk removed
import AppLayout from './AppLayout';
import PublicLayout from './PublicLayout';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { cn } from '@/lib/utils';

// This component will be updated to use custom authentication state.
// For now, it assumes a signed-out state for simplicity until session management is built.
export default function AppShell({ children, className }: { children: ReactNode, className?: string }) {
  const isLoaded = true; // Placeholder: In custom auth, this would come from your auth context/hook
  const isSignedIn = false; // Placeholder: In custom auth, this would come from your auth context/hook

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
  
  // Default to PublicLayout until session management is implemented
  return <PublicLayout>{children}</PublicLayout>;
}
