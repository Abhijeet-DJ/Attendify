'use client';

import PageHeader from '@/components/shared/PageHeader';
import { useUser, UserProfile as ClerkUserProfile } from '@clerk/nextjs'; // Clerk's useUser
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ExternalLink } from 'lucide-react';

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
            Your profile information is managed by Clerk.
          </p>
          <div>
            {/* Option 1: Link to Clerk's hosted profile page */}
             <Button asChild className="w-full sm:w-auto shadow-sm hover:shadow-md transition-shadow">
               <a href={process.env.NEXT_PUBLIC_CLERK_USER_PROFILE_URL || '/user'} target="_blank" rel="noopener noreferrer">
                 Manage Profile on Clerk <ExternalLink className="ml-2 h-4 w-4" />
               </a>
             </Button>
             <p className="text-xs text-muted-foreground mt-1"> (Opens Clerk's profile management page)</p>
            
            {/* Option 2: Embed Clerk's <UserProfile /> component if preferred 
                This requires `NEXT_PUBLIC_CLERK_USER_PROFILE_URL` to be set in .env usually.
                If you want to embed it here:
            */}
            {/* <div className="mt-4 rounded-lg border">
                 <ClerkUserProfile path="/profile" routing="path" />
            </div> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
