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
import type { UserResource } from '@clerk/types'; // Import Clerk's UserResource type

interface NavMenuProps {
  clerkUser: UserResource | null | undefined; // Use Clerk's user type
}

export default function NavMenu({ clerkUser }: NavMenuProps) {
  const pathname = usePathname();
  
  // Determine admin status based on Clerk user's email and environment variable
  const isAdmin = clerkUser?.primaryEmailAddress?.emailAddress === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  const baseItems = [
    { href: '/profile', label: 'Profile', icon: UserCircle },
  ];

  let menuItems = [
    { href: '/attendance', label: 'My Attendance', icon: ListChecks },
    ...baseItems,
  ];

  if (isAdmin) {
    menuItems = [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/attendance-management', label: 'Manage Attendance', icon: ListChecks },
      { href: '/anomaly-detection', label: 'Anomaly Detection', icon: FlaskConical },
      { href: '/users', label: 'User Management', icon: Users },
      ...baseItems,
      { href: '/settings', label: 'Settings', icon: Settings },
    ];
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
