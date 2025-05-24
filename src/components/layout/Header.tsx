
'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import Logo from '@/components/shared/Logo';
import { useIsMobile } from '@/hooks/use-mobile';
// import { UserButton, SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/nextjs'; // Clerk removed
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // To get current path for conditional rendering

export default function Header({ showSidebarTrigger = true }: { showSidebarTrigger?: boolean }) {
  const isMobile = useIsMobile();
  const pathname = usePathname();

  // Placeholder for authentication state - this will be replaced by actual session logic
  // For now, assume user is signed out to show Sign In/Up buttons
  const isSignedIn = false; // TODO: Replace with actual auth state
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-card/80 px-4 backdrop-blur-md sm:px-6 md:px-8">
      <div className="flex items-center gap-4">
        {showSidebarTrigger && <SidebarTrigger />}
        {showSidebarTrigger && isMobile && <Logo size="sm" />} 
        {!showSidebarTrigger && isMobile && <Logo size="sm" /> }
      </div>
      <div className="flex items-center gap-4">
        {/* This section will be updated with session logic in the next phase */}
        {!isSignedIn && !isAuthPage && (
          <>
            <Button variant="outline" size="sm" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </>
        )}
        {/* {isSignedIn && (
          // Placeholder for UserButton or similar once session is active
          // <UserButton afterSignOutUrl="/" /> 
        )} */}
      </div>
    </header>
  );
}
