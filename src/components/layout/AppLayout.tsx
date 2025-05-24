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
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { signOutUser } from '@/lib/firebase/auth'; 
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOutUser();
      toast({ title: 'Signed Out', description: 'You have been successfully signed out.' });
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({ title: 'Sign Out Failed', description: 'Could not sign out. Please try again.', variant: 'destructive' });
    }
  };
  
  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon" className="border-r">
        <SidebarHeader className="p-4 flex items-center justify-center group-data-[collapsible=icon]:justify-center">
          <Logo size="md" />
        </SidebarHeader>
        <SidebarContent className="p-2">
          <NavMenu user={user} />
        </SidebarContent>
        <SidebarFooter className="p-2">
           <Button variant="ghost" className="w-full justify-start gap-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" onClick={handleSignOut}
            title="Logout"
           >
            <LogOut className="h-4 w-4" />
            <span className="group-data-[collapsible=icon]:hidden">Logout</span>
          </Button>
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
