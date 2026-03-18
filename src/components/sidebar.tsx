'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BarChart3, Users, Building2, Briefcase, Calendar, DollarSign, FileText, Settings, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navigationItems = [
  { label: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { label: 'Employees', href: '/employees', icon: Users },
  { label: 'Departments', href: '/departments', icon: Building2 },
  { label: 'Projects', href: '/projects', icon: Briefcase },
  { label: 'Attendance', href: '/attendance', icon: Calendar },
  { label: 'Salaries', href: '/salaries', icon: DollarSign },
  { label: 'Reports', href: '/reports', icon: FileText },
];

const bottomItems = [
  { label: 'Profile', href: '/profile', icon: User },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
  if (confirm('Are you sure you want to logout?')) {
    // Clear everything
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
      localStorage.clear(); // Extra safety
    }
    
    // Force hard redirect to login
    window.location.href = '/';
  }
};

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-50">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <span className="text-sidebar-primary-foreground font-bold text-sm">E</span>
          </div>
          <span className="font-semibold text-foreground">EmpTrack</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  'w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  isActive && 'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary'
                )}
              >
                <Icon className="w-4 h-4 mr-3" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Bottom items */}
      <div className="border-t border-sidebar-border p-3 space-y-1">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  'w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  isActive && 'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary'
                )}
              >
                <Icon className="w-4 h-4 mr-3" />
                {item.label}
              </Button>
            </Link>
          );
        })}
        
        {/* Logout Button */}
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="w-4 h-4 mr-3" />
          Logout
        </Button>
      </div>
    </aside>
  );
}