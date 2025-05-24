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
import { useUser } from '@clerk/nextjs'; // Using Clerk's useUser

// Sign out is handled by Clerk's UserButton, so custom sign out logic is removed.

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user } = useUser(); // Get user from Clerk
  
  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon" className="border-r">
        <SidebarHeader className="p-4 flex items-center justify-center group-data-[collapsible=icon]:justify-center">
          <Logo size="md" />
        </SidebarHeader>
        <SidebarContent className="p-2">
          {/* Pass relevant user information or let NavMenu fetch it internally */}
          <NavMenu clerkUser={user} /> 
        </SidebarContent>
        <SidebarFooter className="p-2">
           {/* Logout button is removed as Clerk's UserButton in Header handles this */}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto bg-background">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
