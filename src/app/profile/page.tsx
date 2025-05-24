
'use client';

import PageHeader from '@/components/shared/PageHeader';
import { useUser } from '@clerk/nextjs'; 
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Badge } from '@/components/ui/badge';
import { parseClerkUsername, type ParsedClerkUsername } from '@/lib/utils';
import { InfoIcon } from 'lucide-react';

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
  
  let parsedUsernameData: ParsedClerkUsername = { parsedFullName: null, extractedId: null };
  if (isLoaded && user) {
    parsedUsernameData = parseClerkUsername(user.username);
  }

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
              <div className="mt-2">
                <Badge variant={isAdmin ? "default" : "secondary"} className="text-xs">
                  Role: {isAdmin ? 'Administrator' : 'Student/Teacher (based on ID)'}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Clerk Username:</h3>
            <p className="text-sm text-foreground">{user.username || 'Not set'}</p>
          </div>

          {parsedUsernameData.parsedFullName && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Parsed Full Name (from Username):</h3>
              <p className="text-sm text-foreground">{parsedUsernameData.parsedFullName}</p>
            </div>
          )}
          {parsedUsernameData.extractedId && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Extracted ID (from Username):</h3>
              <p className="text-sm text-foreground">{parsedUsernameData.extractedId}</p>
               <p className="text-xs text-muted-foreground mt-1">
                (This ID is assumed to be your Registration Number if you are a student, or Teacher ID if you are a teacher).
              </p>
            </div>
          )}
          
          <p className="text-sm text-muted-foreground pt-2">
            Your basic profile information from Clerk is displayed above. 
            To manage your account settings (e.g., change password, set up 2FA), please use the "Manage account" option available in the user menu by clicking your avatar in the top-right corner of the page.
          </p>
        </CardContent>
        <CardFooter className="flex-col items-start text-xs text-muted-foreground bg-muted/50 p-4 rounded-b-lg">
            <div className="flex items-start">
                <InfoIcon className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-blue-500"/>
                <div>
                    <p className="font-semibold text-foreground">Username Convention for ID Extraction:</p>
                    <p>
                        For this application to extract a Registration/Teacher ID, your Clerk <span className="font-semibold">Username</span> should be set in the format: <span className="italic">YourFullName_YourID</span>.
                    </p>
                    <p className="mt-1">
                        Example for a student: <span className="italic">JohnDoe_S12345</span>. Example for a teacher: <span className="italic">JaneSmith_T987</span>.
                    </p>
                    <p className="mt-1">
                        You can typically set or update your username via the "Manage account" option in the user menu (top-right).
                    </p>
                </div>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}
