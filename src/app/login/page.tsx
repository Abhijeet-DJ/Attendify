// src/app/login/page.tsx
'use client';

// import { SignIn } from "@clerk/nextjs"; // Clerk removed
import Logo from '@/components/shared/Logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import Link from 'next/link';

// This is a placeholder login page.
// Sign-in functionality will be implemented in the next phase.

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    // Simulate API call for now
    await new Promise(resolve => setTimeout(resolve, 1000));
    setError("Sign-in functionality is not yet implemented.");
    toast({
      title: 'Sign In (Not Implemented)',
      description: 'This feature is coming soon!',
      variant: 'default',
    });
    setIsLoading(false);

    // TODO: Implement actual sign-in API call in the next phase
    // try {
    //   const res = await fetch('/api/auth/login', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email, password }),
    //   });
    //   const data = await res.json();
    //   if (!res.ok) throw new Error(data.message || 'Login failed');
    //   toast({ title: 'Login Successful' });
    //   router.push('/dashboard'); // Or appropriate redirect
    // } catch (err: any) {
    //   setError(err.message);
    //   toast({ title: 'Login Failed', description: err.message, variant: 'destructive' });
    // } finally {
    //   setIsLoading(false);
    // }
  };


  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-secondary/10 p-4">
      <Card className="w-full max-w-md shadow-xl rounded-lg">
        <CardHeader className="items-center text-center pt-8">
            <div className="mx-auto mb-6 flex justify-center">
                <Logo size="lg" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">Sign In to Attendify</CardTitle>
            <CardDescription className="text-md text-muted-foreground pt-2">Access your dashboard and manage attendance.</CardDescription>
        </CardHeader>
        <CardContent className="py-8">
          {/* <SignIn path="/login" routing="path" signUpUrl="/signup" /> // Clerk removed */}
          <form onSubmit={handleSubmit} className="space-y-6">
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
                className="mt-1"
              />
            </div>
             {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
              Sign In
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-semibold text-primary hover:underline">
              Create Account
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
