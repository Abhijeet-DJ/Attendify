// src/app/signup/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import Link from 'next/link';
import Logo from '@/components/shared/Logo';

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [fullNameWithId, setFullNameWithId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'teacher' | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!role) {
      setError('Please select a role.');
      setIsLoading(false);
      return;
    }
    if (!fullNameWithId.includes('_')) {
        setError('Full Name must include an underscore followed by your ID (e.g., John Doe_S12345 or Jane Smith_T101).');
        setIsLoading(false);
        return;
    }


    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullNameWithId, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      toast({
        title: 'Sign Up Successful',
        description: 'You can now sign in with your new account.',
      });
      router.push('/login'); // Redirect to login page after successful signup
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'Sign Up Failed',
        description: err.message || 'Could not create account.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-secondary/10 p-4">
      <Card className="w-full max-w-md shadow-xl rounded-lg">
         <CardHeader className="items-center text-center pt-8">
            <div className="mb-6">
                <Logo size="lg" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">Create your Attendify Account</CardTitle>
            <CardDescription className="text-md text-muted-foreground pt-2">
                Enter your details to get started.
            </CardDescription>
        </CardHeader>
        <CardContent className="py-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="fullNameWithId">Full Name & ID</Label>
              <Input
                id="fullNameWithId"
                type="text"
                value={fullNameWithId}
                onChange={(e) => setFullNameWithId(e.target.value)}
                placeholder="e.g., John Doe_S12345 or Jane Smith_T101"
                required
                className="mt-1"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Enter your full name followed by an underscore and your ID (e.g., S12345 for students, T101 for teachers).
              </p>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={(value) => setRole(value as 'student' | 'teacher')}>
                <SelectTrigger id="role" className="w-full mt-1">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
              Create Account
            </Button>
          </form>
           <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
