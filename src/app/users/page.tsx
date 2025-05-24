
'use client';

import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Users as UsersIcon, UserPlus, Info, AlertTriangle } from 'lucide-react'; // Removed Edit, Trash2
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
// import { getUsers } from '@/app/actions/userActions'; // Will be re-added
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

// This page will be updated to use custom authentication and fetch data.
// For now, it's a placeholder.
export default function UserManagementPage() {
  const { toast } = useToast();
  const [currentUsers, setCurrentUsers] = useState<UserProfile[]>([]);
  const isLoadingUsers = true; // Placeholder
  const isSignedIn = false; // Placeholder
  const isAdmin = false; // Placeholder

  // useEffect(() => {
  //   if (isSignedIn && isAdmin) {
  //     fetchUsersFromDb();
  //   }
  // }, [isSignedIn, isAdmin]);

  // const fetchUsersFromDb = async () => { /* ... */ };
  
  const getInitials = (name: string | null | undefined, email: string) => {
    if (name && name.trim() !== '') return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0,2);
    if (email) {
      const namePart = email.split('@')[0];
      return namePart.substring(0, 2).toUpperCase();
    }
    return 'U';
  };
  
  if (!isSignedIn && !isLoadingUsers) {
    return (
      <div className="flex h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-center space-y-4 p-6 text-center">
         <p className="text-lg font-medium">Access Denied</p>
         <p className="text-muted-foreground">Please sign in as an admin to manage users.</p>
         <Button asChild><Link href="/login">Sign In</Link></Button>
      </div>
    );
  }

  if (isLoadingUsers) {
    return (
      <div className="flex h-[calc(100vh-theme(spacing.16))] items-center justify-center">
        <LoadingSpinner size="xl" />
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
        title="User Database View"
        description="View user records from the application's MongoDB database. (Functionality pending sign-in)"
        actions={
          <Button onClick={() => toast({ title: "Add User (Not Implemented)"})} className="shadow-sm hover:shadow-md transition-shadow">
            <UserPlus className="mr-2 h-4 w-4" /> Add User (Demo)
          </Button>
        }
      />
      <Card className="mt-6 bg-card border-blue-500 border-2 shadow-lg">
        <CardHeader className="flex flex-row items-start space-x-3">
            <Info className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
            <div>
                <CardTitle className="text-blue-700 dark:text-blue-400">User Management Information</CardTitle>
                <CardDescription className="text-sm text-foreground/80">
                    This page displays users from this application's MongoDB 'users' collection.
                    With custom authentication, user creation happens via the sign-up page.
                </CardDescription>
            </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-foreground">
            User editing and deletion functionalities will be built as part of the custom admin features.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg bg-card">
        <CardHeader>
          <CardTitle>Users in Local Database ({currentUsers.length})</CardTitle>
          <CardDescription>
            List of users from the MongoDB 'users' collection. (Data loading soon)
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
                {/* <TableHead className="text-right">Actions (Demo)</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.length > 0 ? currentUsers.map((dbUser) => (
                <TableRow key={dbUser._id?.toString()} className="hover:bg-muted/50 transition-colors">
                  <TableCell>
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={dbUser.avatarUrl || ''} alt={dbUser.name || dbUser.email} data-ai-hint="user avatar" />
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
                  {/* <TableCell className="text-right space-x-1">
                    Demo buttons removed for now
                  </TableCell> */}
                </TableRow>
              )) : (
                 <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No users found or data is loading. Sign in as admin to see data.
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
