
'use client';

import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Users as UsersIcon, UserPlus, Edit, Trash2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { UserProfile } from '@/types';
import { getUsers } from '@/app/actions/userActions';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function UserManagementPage() {
  const { user, isLoaded: userLoaded } = useUser();
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [currentUsers, setCurrentUsers] = useState<UserProfile[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  const isAdmin = user?.primaryEmailAddress?.emailAddress === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  useEffect(() => {
    if (authLoaded && userLoaded) {
      if (isSignedIn && !isAdmin) {
        router.replace('/dashboard'); 
      } else if (isSignedIn && isAdmin) {
        fetchUsersFromDb();
      }
    }
  }, [isSignedIn, isAdmin, authLoaded, userLoaded, router]);

  const fetchUsersFromDb = async () => {
    setIsLoadingUsers(true);
    try {
      const usersFromDb = await getUsers();
      setCurrentUsers(usersFromDb);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast({
        title: "Error Fetching Users",
        description: "Could not retrieve user records from the database.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleDemoAction = (actionName: string) => {
    toast({
      title: "Demo Feature",
      description: `${actionName} functionality is not implemented in this demo. User management should be done via the Clerk dashboard.`,
    });
  };
  
  const getInitials = (name: string | null | undefined, email: string) => {
    if (name && name.trim() !== '') return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0,2);
    const namePart = email.split('@')[0];
    return namePart.substring(0, 2).toUpperCase();
  };

  if (!authLoaded || !userLoaded || (isSignedIn && isAdmin && isLoadingUsers)) {
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
        title="User Database View"
        description="View user records from the application's MongoDB database (Admin only)."
        actions={
          <Button onClick={() => handleDemoAction('Add New User to DB')} className="shadow-sm hover:shadow-md transition-shadow">
            <UserPlus className="mr-2 h-4 w-4" /> Add User (Demo)
          </Button>
        }
      />
      <Card className="mt-6 bg-card border-blue-500 border-2 shadow-lg">
        <CardHeader className="flex flex-row items-start space-x-3">
            <Info className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
            <div>
                <CardTitle className="text-blue-700 dark:text-blue-400">Important: User Management via Clerk</CardTitle>
                <CardDescription className="text-sm text-foreground/80">
                    This page displays users from this application's MongoDB 'users' collection (populated by a seed script).
                </CardDescription>
            </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-foreground">
            Actual user authentication, sign-up, and core profile management are handled by **Clerk**.
          </p>
          <p className="text-sm text-foreground">
            To manage your application's users (invite, delete, change Clerk roles/metadata), please use your <a href="https://dashboard.clerk.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">Clerk Dashboard</a>.
          </p>
           <p className="text-xs text-muted-foreground">
            To have new users who sign up via Clerk automatically appear in this MongoDB table (along with any custom fields like Registration Number or Teacher ID collected during Clerk sign-up), a webhook synchronization mechanism would need to be implemented between Clerk and this application.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg bg-card">
        <CardHeader>
          <CardTitle>Users in Local Database ({currentUsers.length})</CardTitle>
          <CardDescription>
            List of users from the MongoDB 'users' collection. These are primarily from the initial data seed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Avatar</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>App Role (DB)</TableHead>
                <TableHead>Specific ID (DB)</TableHead>
                <TableHead className="text-right">Actions (Demo)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.length > 0 ? currentUsers.map((dbUser) => (
                <TableRow key={dbUser.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell>
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={dbUser.avatarUrl || dbUser.photoURL || ''} alt={dbUser.name || dbUser.email} data-ai-hint="user avatar" />
                        <AvatarFallback>{getInitials(dbUser.name, dbUser.email)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{dbUser.name || 'N/A'}</TableCell>
                  <TableCell>{dbUser.email}</TableCell>
                  <TableCell>
                    <Badge variant={dbUser.role === 'admin' ? 'default' : 'secondary'} 
                           className={`${dbUser.role === 'admin' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'} font-semibold`}>
                      {dbUser.role.charAt(0).toUpperCase() + dbUser.role.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {dbUser.registrationNumber && <span className="text-xs">Reg: {dbUser.registrationNumber}</span>}
                    {dbUser.teacherId && <span className="text-xs">Teacher: {dbUser.teacherId}</span>}
                    {!dbUser.registrationNumber && !dbUser.teacherId && <span className="text-xs text-muted-foreground">N/A</span>}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => handleDemoAction('Edit User in DB')} title="Edit User in DB">
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDemoAction('Delete User from DB')} title="Delete User from DB">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                 <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No users found in the local database.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
