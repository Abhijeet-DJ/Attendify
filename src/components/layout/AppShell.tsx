'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { useAuth } from '@clerk/nextjs'; // Changed from custom useAuth
import AppLayout from './AppLayout';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
// MinimalLayout might not be needed if Clerk handles all auth screens externally
// import MinimalLayout from './MinimalLayout';

export default function AppShell({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth(); // Clerk's useAuth hook
  const pathname = usePathname();

  // Clerk's middleware and <SignedIn>/<SignedOut> components largely handle redirection.
  // This useEffect might be simplified or removed depending on how Clerk is configured
  // for redirects (e.g. via environment variables like NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL)
  // For now, we rely on Clerk's default behavior and middleware.

  if (!isLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <LoadingSpinner className="h-12 w-12 text-primary" />
      </div>
    );
  }

  // Clerk typically handles its own sign-in/sign-up pages.
  // The concept of specific /login or /signup routes within the app might change.
  // If you are using Clerk's components (e.g., <SignIn /> <SignUp />) on custom pages,
  // then MinimalLayout might still be relevant for those.
  // However, the quickstart uses <SignInButton /> which modals over the current page or redirects.

  // If Clerk redirects to its own pages for auth, AppLayout will always be used for authenticated users.
  // Non-authenticated users will see Clerk's UI or be on public pages not wrapped by AppLayout.
  // This component might simplify to just choosing AppLayout if signed in, or children if public.
  // For routes protected by middleware, this component won't render if user is not signed in.

  // For a typical setup where Clerk middleware protects routes:
  if (isSignedIn) {
    return <AppLayout>{children}</AppLayout>;
  }
  
  // If it's a public page (not caught by middleware for redirection) or Clerk's auth pages:
  // This case might not be hit often if middleware protects most routes that aren't Clerk's own.
  // If you have truly public pages, they would just render children directly without AppLayout.
  // The provided example doesn't show a separate MinimalLayout for Clerk.
  // The `clerkMiddleware` will handle unauthenticated access to protected routes.
  // So, if we reach here and user is not signedIn, it's likely a public page or Clerk's page.
  return <>{children}</>;

  // If you had specific non-protected routes that need a minimal layout:
  // const isPublicAppPage = pathname === '/some-public-page-with-minimal-layout';
  // if (isPublicAppPage) {
  //   return <MinimalLayout>{children}</MinimalLayout>;
  // }
  //
  // If signed in, use AppLayout for all app content.
  // if (isSignedIn) {
  // return <AppLayout>{children}</AppLayout>;
  // }
  //
  // If not signed in and not a specific public app page, it's likely Clerk's auth flow or root public pages.
  // return <>{children}</>;
}
