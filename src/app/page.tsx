'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs'; // Changed from custom useAuth
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function HomePage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth(); // Clerk's useAuth hook

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        // User is signed in, redirect to dashboard or desired page
        // Clerk's middleware or <SignedIn> might handle this more declaratively.
        // NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL can also control this.
        router.replace('/dashboard');
      } else {
        // User is not signed in.
        // Clerk typically handles showing its sign-in UI.
        // If you have a specific public landing page, you might redirect there.
        // For now, if not signed in and on '/', let Clerk handle it (e.g. show sign-in button from layout)
        // or redirect to where SignInButton would take them if defined.
        // If NEXT_PUBLIC_CLERK_SIGN_IN_URL is set, could redirect there.
        // router.replace(process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || '/'); // Example
        // No explicit redirect here, rely on middleware or UI buttons in Header
      }
    }
  }, [isSignedIn, isLoaded, router]);

  // Show a loading spinner while Clerk is determining auth state
  if (!isLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <LoadingSpinner className="h-12 w-12 text-primary" />
      </div>
    );
  }
  
  // If loaded and not signed in, this page content might be shown briefly
  // before user clicks sign-in or if this is a public landing page.
  // If signed in, the useEffect above will redirect.
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      {/* Content for public landing page or a loading state before redirect */}
      <LoadingSpinner className="h-12 w-12 text-primary" />
      <p className="ml-4">Loading Attendify...</p>
    </div>
  );
}
