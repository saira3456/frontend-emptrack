'use client';

import { useState, useEffect } from 'react';
import { Bell, Search, User, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface NavbarProps {
  userName?: string;
  userRole?: string;
}

export function Navbar({ userName: propUserName, userRole: propUserRole }: NavbarProps) {
  const router = useRouter();
  const [userName, setUserName] = useState(propUserName || 'Admin User');
  const [userRole, setUserRole] = useState(propUserRole || 'Administrator');

  useEffect(() => {
    // Get user data from localStorage
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setUserName(user.name || user.email || 'User');
          setUserRole(user.role || 'employee');
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }
    }
  }, []);

const handleLogout = () => {
  if (confirm('Are you sure you want to logout?')) {
    // Clear everything
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
    }
    
    // Force hard redirect to login
    window.location.href = '/';
  }
};

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-card border-b border-border/40 flex items-center justify-between px-6 z-40">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search employees, departments..."
            className="pl-10 bg-background border-border/40 text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Right items */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 pl-2 pr-4 hover:bg-accent/50">
              <Avatar className="w-8 h-8 border-2 border-primary/20">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {userName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-foreground leading-none">{userName}</p>
                <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              onClick={() => handleNavigation('/profile')}
              className="cursor-pointer"
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={() => handleNavigation('/settings')}
              className="cursor-pointer"
            >
              <span className="w-4 h-4 mr-2">⚙️</span>
              Settings
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              onClick={handleLogout}
              className="text-destructive cursor-pointer hover:bg-destructive/10 focus:bg-destructive/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}