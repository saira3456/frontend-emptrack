'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Spinner } from '@/components/ui/spinner';
import Link from 'next/link';
import { Menu, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmployeeLayoutWrapperProps {
  children: React.ReactNode;
}

export function EmployeeLayoutWrapper({ children }: EmployeeLayoutWrapperProps) {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner />
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Employee Portal Navbar */}
      <nav className="border-b border-border bg-card sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold text-foreground">EmpTrack</h1>
              <p className="text-xs text-muted-foreground">Employee Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Quick navigation */}
        <div className="px-6 py-3 border-t border-border/50 overflow-x-auto">
          <div className="flex gap-2">
            <Link href="/employee" className="px-3 py-1 rounded-full text-sm bg-primary/10 text-primary hover:bg-primary/20 transition-colors whitespace-nowrap">
              Dashboard
            </Link>
            <Link href="/employee/projects" className="px-3 py-1 rounded-full text-sm text-muted-foreground hover:bg-muted transition-colors whitespace-nowrap">
              Projects
            </Link>
            <Link href="/employee/attendance" className="px-3 py-1 rounded-full text-sm text-muted-foreground hover:bg-muted transition-colors whitespace-nowrap">
              Attendance
            </Link>
            <Link href="/employee/salary" className="px-3 py-1 rounded-full text-sm text-muted-foreground hover:bg-muted transition-colors whitespace-nowrap">
              Salary
            </Link>
            <Link href="/employee/leave" className="px-3 py-1 rounded-full text-sm text-muted-foreground hover:bg-muted transition-colors whitespace-nowrap">
              Leave
            </Link>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
