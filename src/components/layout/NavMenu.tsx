
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FlaskConical,
  ListChecks,
  UserCircle,
  Settings,
  Users,
} from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import type { SafeUserProfile } from '@/types'; // Use SafeUserProfile for custom user

interface NavMenuProps {
  customUser: SafeUserProfile | null | undefined; // Use custom user type
}

export default function NavMenu({ customUser }: NavMenuProps) {
  const pathname = usePathname();
  
  // Determine admin status based on custom user's role and environment variable
  const isAdmin = customUser?.role === 'admin' && customUser?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  // const isTeacher = customUser?.role === 'teacher';
  // const isStudent = customUser?.role === 'student';

  // For now, show a basic menu. This will be expanded with role-based logic.
  let menuItems = [
    { href: '/', label: 'Home', icon: LayoutDashboard }, // Temp home link
    { href: '/profile', label: 'Profile', icon: UserCircle },
    // { href: '/attendance', label: 'My Attendance', icon: ListChecks },
  ];

  if (customUser) { // If user is signed in (placeholder logic)
    menuItems = [
        { href: '/attendance', label: 'My Attendance', icon: ListChecks },
        { href: '/profile', label: 'Profile', icon: UserCircle },
    ];
    if (isAdmin) {
        menuItems = [
          { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { href: '/attendance-management', label: 'Manage Attendance', icon: ListChecks },
          { href: '/anomaly-detection', label: 'Anomaly Detection', icon: FlaskConical },
          { href: '/users', label: 'User Management', icon: Users },
          { href: '/profile', label: 'Profile', icon: UserCircle },
          { href: '/settings', label: 'Settings', icon: Settings },
        ];
    }
  } else {
    // Menu for signed-out users (or if user data is not yet available)
     menuItems = [ { href: '/', label: 'Home', icon: LayoutDashboard } ];
  }
  
  return (
    <SidebarMenu>
      {menuItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/' && item.href.length > 1 && pathname.length > item.href.length)}
            tooltip={{ children: item.label, side: 'right', align: 'center' }}
            className="justify-start"
          >
            <Link href={item.href} className="flex items-center gap-2">
              <item.icon className="h-4 w-4 flex-shrink-0" />
              <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
