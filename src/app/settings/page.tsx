'use client';

import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Construction, Settings as SettingsIcon } from 'lucide-react';

export default function SettingsPage() {
  const { user, isLoaded: userLoaded } = useUser();
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  const isAdmin = user?.primaryEmailAddress?.emailAddress === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  useEffect(() => {
     if (authLoaded && userLoaded) {
      if (isSignedIn && !isAdmin) {
        router.replace('/dashboard'); 
      }
      // If not signedIn, Clerk middleware should handle redirection.
    }
  }, [isSignedIn, isAdmin, authLoaded, userLoaded, router]);

  if (!authLoaded || !userLoaded) {
    return (
      <div className="flex h-[calc(100vh-theme(spacing.16))] items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

   if (isSignedIn && !isAdmin) {
     return (
      <div className="flex h-[calc(100vh-theme(spacing.16))] items-center justify-center">
         <p>Access Denied. Redirecting...</p>
        <LoadingSpinner size="xl" />
      </div>
    );
  }
  
  if (!isSignedIn) {
    return (
     <div className="flex h-[calc(100vh-theme(spacing.16))] items-center justify-center">
        <p>Access Denied. Please sign in.</p>
       <LoadingSpinner size="xl" />
     </div>
   );
 }


  return (
    <div className="space-y-6">
      <PageHeader
        title="Application Settings"
        description="Manage Attendify configuration (Admin only)."
      />
      <Card className="shadow-lg bg-card">
        <CardHeader className="flex flex-row items-center gap-3">
          <SettingsIcon className="h-6 w-6 text-primary" />
          <div>
            <CardTitle>Settings</CardTitle>
            <CardDescription>
              This area is under construction. Future settings will be available here.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <Construction className="h-20 w-20 text-muted-foreground mb-6" />
          <p className="text-xl font-medium text-foreground">
            Settings Page - Coming Soon!
          </p>
          <p className="text-md text-muted-foreground mt-2">
            We are working hard to bring you more customization options for Zoom integration,
            notification preferences, and user role management.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
