import { ReactNode } from 'react';
import { Sidebar } from './sidebar';
import { Navbar } from './navbar';

interface AppLayoutProps {
  children: ReactNode;
  userName?: string;
  userRole?: string;
}

export function AppLayout({ children, userName, userRole }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Navbar userName={userName} userRole={userRole} />
      <main className="ml-64 mt-16 p-6 min-h-screen">
        {children}
      </main>
    </div>
  );
}
