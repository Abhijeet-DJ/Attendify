'use client';

import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Users as UsersIcon, UserPlus, Edit, Trash2 } from 'lucide-react';
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
import { mockUsers } from '@/lib/mockData'; 
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function UserManagementPage() {
  const { user, isLoaded: userLoaded } = useUser();
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const isAdmin = user?.primaryEmailAddress?.emailAddress === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  useEffect(() => {
    if (authLoaded && userLoaded) {
      if (isSignedIn && !isAdmin) {
        router.replace('/dashboard'); 
      }
      // If not signedIn, Clerk middleware should handle redirection.
    }
  }, [isSignedIn, isAdmin, authLoaded, userLoaded, router]);

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
        title="User Management"
        description="View and manage user accounts and roles (Admin only)."
        actions={
          <Button onClick={() => handleDemoAction('Add New User')} className="shadow-sm hover:shadow-md transition-shadow">
            <UserPlus className="mr-2 h-4 w-4" /> Add New User
          </Button>
        }
      />
      <Card className="shadow-lg bg-card">
        <CardHeader>
          <CardTitle>All Users ({mockUsers.length}) - Mock Data</CardTitle>
          <CardDescription>
            List of mock users. Actual user management is handled via your Clerk dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Avatar</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role (Mock)</TableHead>
                <TableHead className="text-right">Actions (Demo)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.map((mockUser) => (
                <TableRow key={mockUser.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell>
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={mockUser.photoURL || ''} alt={mockUser.name || mockUser.email} data-ai-hint="user avatar" />
                        <AvatarFallback>{getInitials(mockUser.name, mockUser.email)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{mockUser.name || 'N/A'}</TableCell>
                  <TableCell>{mockUser.email}</TableCell>
                  <TableCell>
                    <Badge variant={mockUser.role === 'admin' ? 'default' : 'secondary'} 
                           className={`${mockUser.role === 'admin' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'} font-semibold`}>
                      {mockUser.role.charAt(0).toUpperCase() + mockUser.role.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => handleDemoAction('Edit User')} title="Edit User">
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDemoAction('Delete User')} title="Delete User">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
       <Card className="mt-6 bg-card">
        <CardHeader>
            <CardTitle>User Management - Important Note</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <UsersIcon className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-foreground">
            This page uses mock data for demonstration.
          </p>
          <p className="text-sm text-muted-foreground">
            Actual user creation, editing, role assignment, and deletion are managed through your <a href="https://dashboard.clerk.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Clerk Dashboard</a>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
