'use client';

import { usePathname, useRouter }
from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AppLayout from './AppLayout';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import MinimalLayout from './MinimalLayout';

export default function AppShell({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      const isAuthPage = pathname === '/login' || pathname === '/signup';
      if (!user && !isAuthPage) {
        router.push('/login');
      }
      if (user && isAuthPage) {
        router.push('/dashboard');
      }
    }
  }, [user, loading, pathname, router]);


  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <LoadingSpinner className="h-12 w-12 text-primary" />
      </div>
    );
  }
  
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  if (!user && !isAuthPage) {
     // Still loading or redirecting
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <LoadingSpinner className="h-12 w-12 text-primary" />
      </div>
    );
  }

  if (isAuthPage) {
    return <MinimalLayout>{children}</MinimalLayout>;
  }

  if (user) {
    return <AppLayout>{children}</AppLayout>;
  }
  
  // Fallback for unhandled cases, e.g. user is null but not on auth page (should be redirected)
  // Or if user is non-null but somehow not caught by AppLayout case.
  return <MinimalLayout>{children}</MinimalLayout>;
}
