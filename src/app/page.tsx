
'use client';

// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@clerk/nextjs'; // Clerk removed
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/shared/Logo';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  // const router = useRouter();
  // const { isSignedIn, isLoaded } = useAuth(); // Clerk removed

  // useEffect(() => {
  //   if (isLoaded && isSignedIn) {
  //     router.replace('/dashboard');
  //   }
  // }, [isSignedIn, isLoaded, router]);

  // For now, assume not loaded or not signed in to show landing page
  // Actual loading state and redirection will be handled by custom auth logic later
  const isLoaded = true; // Placeholder
  const isSignedIn = false; // Placeholder

  if (!isLoaded) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
        <LoadingSpinner className="h-12 w-12 text-primary" />
        <p className="ml-4 mt-4 text-muted-foreground">Initializing Attendify...</p>
      </div>
    );
  }

  if (isSignedIn) {
    // This state should be brief as the useEffect will redirect.
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
        <LoadingSpinner className="h-12 w-12 text-primary" />
        <p className="ml-4 mt-4 text-muted-foreground">Redirecting to dashboard...</p>
      </div>
    );
  }

  // If loaded and not signed in, show a public landing page content
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-background to-secondary/10 p-4">
      <Card className="w-full max-w-md shadow-xl rounded-lg">
        <CardHeader className="items-center text-center pt-8">
          <div className="mb-6">
            <Logo size="lg" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">Welcome to Attendify</CardTitle>
          <CardDescription className="text-md text-muted-foreground pt-2">
            Streamline your Zoom meeting attendance tracking with AI-powered insights.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6 py-8">
          <p className="text-center text-foreground">
            Get started by creating an account or signing in if you already have one.
          </p>
          <div className="flex w-full gap-3">
            <Button className="flex-1" asChild>
              <Link href="/signup">Create Account</Link>
            </Button>
            <Button variant="outline" className="flex-1" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Attendify. All rights reserved.
      </footer>
    </div>
  );
}
