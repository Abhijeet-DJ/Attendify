'use client';

import PageHeader from '@/components/shared/PageHeader';
import { useUser } from '@clerk/nextjs'; // Clerk's useUser
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button'; // Button for explicit link removed
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
// import { ExternalLink } from 'lucide-react'; // No longer needed for the explicit link

export default function ProfilePage() {
  const { user, isLoaded } = useUser(); // Clerk's hook

  const getInitials = (name: string | null | undefined, fallbackEmail?: string | null) => {
    if (name && name.trim() !== '') return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0,2);
    if (fallbackEmail) {
        const namePart = fallbackEmail.split('@')[0];
        return namePart.substring(0, 2).toUpperCase();
    }
    return 'U';
  };
  
  const isAdmin = user?.primaryEmailAddress?.emailAddress === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

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
              <CardDescription className="mt-1 text-xs">Role: {isAdmin ? 'Administrator' : 'Student'}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Your basic profile information is displayed above. 
            To manage your account (e.g., change password, set up 2FA), please use the "Manage account" option available in the user menu by clicking your avatar in the top-right corner of the page.
          </p>
          {/* 
            The explicit link to Clerk's hosted profile or an embedded component has been removed.
            Users should be directed to use the <UserButton /> in the header for profile management.
            If you decide to embed Clerk's <UserProfile /> component on this page or a dedicated one (e.g. /user-profile),
            you would uncomment and use the code below, and potentially set NEXT_PUBLIC_CLERK_USER_PROFILE_URL in .env
            to point to that dedicated page.
          */}
          {/* <div className="mt-4 rounded-lg border">
               <ClerkUserProfile path="/profile" routing="path" />
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
