
'use client';

import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { useUser, useAuth } from '@clerk/nextjs'; // Clerk removed
// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Construction, Settings as SettingsIcon, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// This page will be updated to use custom authentication.
// For now, it's a placeholder.
export default function SettingsPage() {
  // const router = useRouter();
  const isSignedIn = false; // Placeholder
  const isAdmin = false; // Placeholder
  const isLoaded = true; // Placeholder

  // useEffect(() => {
  //    // Custom auth checks and redirection
  // }, [isSignedIn, isAdmin, isLoaded, router]);

  if (!isLoaded) {
    return (
      <div className="flex h-[calc(100vh-theme(spacing.16))] items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

   if (!isSignedIn) {
    return (
     <div className="flex h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-center space-y-4 p-6 text-center">
        <p className="text-lg font-medium">Access Denied</p>
        <p className="text-muted-foreground">Please sign in as an admin to view settings.</p>
        <Button asChild><Link href="/login">Sign In</Link></Button>
     </div>
   );
 }

  if (isSignedIn && !isAdmin) {
     return (
      <div className="flex h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-center space-y-4 p-6 text-center">
        <AlertTriangle className="h-12 w-12 text-destructive" />
        <p className="text-lg font-medium">Access Denied</p>
        <p className="text-muted-foreground">You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Application Settings"
        description="Manage Attendify configuration (Admin only). (Functionality pending sign-in)"
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
            Custom application settings will be available here after sign-in is implemented.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
