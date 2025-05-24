
import type { ReactNode } from 'react';
import Header from './Header';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header showSidebarTrigger={false} /> {/* Sidebar trigger is not needed on public layout */}
      <main className="flex-1 flex flex-col bg-background"> {/* Ensure main content area can grow */}
        {children}
      </main>
    </div>
  );
}
