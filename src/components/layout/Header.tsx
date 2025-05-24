
'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import Logo from '@/components/shared/Logo';
import { useIsMobile } from '@/hooks/use-mobile';
import { UserButton, SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

export default function Header({ showSidebarTrigger = true }: { showSidebarTrigger?: boolean }) {
  const isMobile = useIsMobile();
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-card/80 px-4 backdrop-blur-md sm:px-6 md:px-8">
      <div className="flex items-center gap-4">
        {showSidebarTrigger && <SidebarTrigger />}
        {showSidebarTrigger && isMobile && <Logo size="sm" />} 
        {!showSidebarTrigger && isMobile && <Logo size="sm" /> }
      </div>
      <div className="flex items-center gap-4">
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <Button variant="outline" size="sm">Sign In</Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button size="sm">Sign Up</Button>
          </SignUpButton>
        </SignedOut>
      </div>
    </header>
  );
}
