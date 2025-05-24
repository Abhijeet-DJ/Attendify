'use client';

import PageHeader from '@/components/shared/PageHeader';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { updateProfile as firebaseUpdateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase/config'; // Import auth object
import { UserContextType } from '@/context/AuthContext';

export default function ProfilePage() {
  const { user, loading, setUser: updateUserInContext } = useAuth() as any; // Add setUser to useAuth if not present or handle state update differently
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setPhotoURL(user.photoURL || '');
    }
  }, [user]);

  const getInitials = (name: string | null | undefined, email: string | null | undefined) => {
    if (name && name.trim() !== '') return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0,2);
    if (email) {
        const namePart = email.split('@')[0];
        return namePart.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) {
        toast({ title: 'Error', description: 'Not authenticated.', variant: 'destructive' });
        return;
    }
    setIsSubmitting(true);
    try {
        await firebaseUpdateProfile(auth.currentUser, { displayName, photoURL });
        
        // Update user in context if setUser is available
        if (updateUserInContext) {
            const updatedUser: UserContextType = { ...user, displayName, photoURL };
            updateUserInContext(updatedUser);
        }

        toast({ title: 'Profile Updated', description: 'Your profile has been updated.' });
    } catch (error: any) {
        console.error('Error updating profile:', error);
        toast({ title: 'Update Failed', description: error.message || 'Could not update profile.', variant: 'destructive' });
    } finally {
        setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-theme(spacing.16))] items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (!user) {
    // Should be redirected by AppShell, but as a fallback:
    return <p className="p-6 text-center">Please log in to view your profile.</p>;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="My Profile" description="View and manage your account details." />
      <Card className="mx-auto max-w-2xl shadow-lg bg-card">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={photoURL || user.photoURL || ''} alt={displayName || user.displayName || user.email || 'User'} data-ai-hint="user portrait professional" />
              <AvatarFallback>{getInitials(displayName || user.displayName, user.email)}</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <CardTitle className="text-2xl">{displayName || user.displayName || 'User'}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
              <CardDescription className="mt-1 text-xs">Role: {user.isAdmin ? 'Administrator' : 'Student'}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value={user.email || ''} disabled className="mt-1 bg-muted/50 cursor-not-allowed" />
              <p className="text-sm text-muted-foreground mt-1">Email address cannot be changed.</p>
            </div>
            <div>
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your Full Name"
                className="mt-1"
              />
            </div>
             <div>
              <Label htmlFor="photoURL">Photo URL</Label>
              <Input
                id="photoURL"
                type="url"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                placeholder="https://example.com/your-image.png"
                className="mt-1"
              />
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto shadow-sm hover:shadow-md transition-shadow">
              {isSubmitting ? <LoadingSpinner size="sm" className="mr-2" /> : null}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
