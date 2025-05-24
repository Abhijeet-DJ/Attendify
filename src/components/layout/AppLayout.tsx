
'use client';
import type { ReactNode } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import Header from './Header';
import NavMenu from './NavMenu';
import Logo from '@/components/shared/Logo';
// import { useUser } from '@clerk/nextjs'; // Clerk removed

// This component will be updated to use custom authentication state.
export default function AppLayout({ children }: { children: ReactNode }) {
  // const { user } = useUser(); // Clerk removed
  const user = null; // Placeholder for user data from custom auth

  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon" className="border-r">
        <SidebarHeader className="p-4 flex items-center justify-center group-data-[collapsible=icon]:justify-center">
          <Logo size="md" />
        </SidebarHeader>
        <SidebarContent className="p-2">
          <NavMenu customUser={user} /> {/* Pass custom user or role */}
        </SidebarContent>
        <SidebarFooter className="p-2">
           {/* Logout button will be added here with custom auth */}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <Header showSidebarTrigger={true} /> {/* Show sidebar trigger in AppLayout */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto bg-background">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
