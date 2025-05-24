
'use client';

import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

// This page will be updated to use custom authentication data later.
// For now, it's a placeholder.

export default function ProfilePage() {
  const isLoading = true; // Placeholder
  // const user = null; // Placeholder for user data

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-theme(spacing.16))] items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  // if (!user) {
  //   return <p className="p-6 text-center">Please log in to view your profile.</p>;
  // }

  return (
    <div className="space-y-6">
      <PageHeader title="My Profile" description="View your account details." />
      <Card className="mx-auto max-w-2xl shadow-lg bg-card">
        <CardHeader>
          <CardTitle className="text-2xl">Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>User profile information will be displayed here once sign-in is implemented.</p>
          {/* 
          Example structure for later:
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Name:</h3>
            <p className="text-sm text-foreground">{user.name}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Email:</h3>
            <p className="text-sm text-foreground">{user.email}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Role:</h3>
            <p className="text-sm text-foreground">{user.role}</p>
          </div>
          {user.registrationNumber && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Registration Number:</h3>
              <p className="text-sm text-foreground">{user.registrationNumber}</p>
            </div>
          )}
          {user.teacherId && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Teacher ID:</h3>
              <p className="text-sm text-foreground">{user.teacherId}</p>
            </div>
          )}
          */}
        </CardContent>
      </Card>
    </div>
  );
}
