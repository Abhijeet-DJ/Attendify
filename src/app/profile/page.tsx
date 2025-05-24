
'use client';

import PageHeader from '@/components/shared/PageHeader';
import { useUser } from '@clerk/nextjs'; 
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Badge } from '@/components/ui/badge';

export default function ProfilePage() {
  const { user, isLoaded } = useUser(); 

  const getInitials = (name: string | null | undefined, fallbackEmail?: string | null) => {
    if (name && name.trim() !== '') return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0,2);
    if (fallbackEmail) {
        const namePart = fallbackEmail.split('@')[0];
        return namePart.substring(0, 2).toUpperCase();
    }
    return 'U';
  };
  
  const isAdmin = user?.primaryEmailAddress?.emailAddress === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  
  // Access potential custom attributes from Clerk's public metadata
  // Assuming you configure these as 'registration_number' and 'teacher_id' in Clerk
  const registrationNumber = user?.publicMetadata?.registration_number as string | undefined;
  const teacherId = user?.publicMetadata?.teacher_id as string | undefined;


  if (!isLoaded) {
    return (
      <div className="flex h-[calc(100vh-theme(spacing.16))] items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (!user) {
    // Should be redirected by Clerk middleware if route is protected
    return <p className="p-6 text-center">Please log in to view your profile.</p>;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="My Profile" description="View your account details." />
      <Card className="mx-auto max-w-2xl shadow-lg bg-card">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.imageUrl || ''} alt={user.fullName || user.primaryEmailAddress?.emailAddress || 'User'} data-ai-hint="user portrait professional" />
              <AvatarFallback>{getInitials(user.fullName, user.primaryEmailAddress?.emailAddress)}</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <CardTitle className="text-2xl">{user.fullName || 'User'}</CardTitle>
              <CardDescription>{user.primaryEmailAddress?.emailAddress}</CardDescription>
              <div className="mt-2 space-y-1">
                <Badge variant={isAdmin ? "default" : "secondary"} className="text-xs">
                  Role: {isAdmin ? 'Administrator' : 'Student'}
                </Badge>
                {registrationNumber && (
                  <Badge variant="outline" className="text-xs ml-2">
                    Registration #: {registrationNumber}
                  </Badge>
                )}
                {teacherId && (
                  <Badge variant="outline" className="text-xs ml-2">
                    Teacher ID: {teacherId}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Your basic profile information is displayed above. 
            To manage your account (e.g., change password, set up 2FA), please use the "Manage account" option available in the user menu by clicking your avatar in the top-right corner of the page.
          </p>
          <p className="text-xs text-muted-foreground">
            Note: Registration Number or Teacher ID are typically collected during sign-up via custom fields configured in your Clerk dashboard and may be stored as public metadata.
            If you also sync this data to this application's local database, it will appear on the admin User Management page.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
