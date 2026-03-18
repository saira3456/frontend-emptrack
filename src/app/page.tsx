'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, login } = useAuth();
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect immediately
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        router.push('/dashboard');
      } else {
        router.push('/employee');
      }
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      // No need to redirect here - useEffect will handle it
    } catch (err) {
      console.error('❌ Login error:', err);
      setError(err instanceof Error ? err.message : 'Login failed');
      setIsLoading(false);
    }
  };

  // Show loading while checking auth
  if (user || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-foreground">
            {user ? 'Redirecting...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      {/* Animated background elements */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl opacity-30"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">EmpTrack</h1>
          <p className="text-muted-foreground">HR Management System</p>
        </div>

        {/* Login Card */}
        <Card className="border-border/40 backdrop-blur-sm bg-card/80">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@emptrack.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background border-border/40 text-foreground placeholder:text-muted-foreground focus:border-primary"
                  required
                  disabled={isLoading || authLoading}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-foreground">
                    Password
                  </Label>
                  <Link href="#" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </Link>
                  <Link href="#" className="text-xs text-primary hover:underline">
                    Reset password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background border-border/40 text-foreground placeholder:text-muted-foreground focus:border-primary"
                  required
                  disabled={isLoading || authLoading}
                />
              </div>

              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading || authLoading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium h-11"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 space-y-3">
                <div className="space-y-2">
                  <div 
                    className="p-2 bg-primary/5 rounded cursor-pointer hover:bg-primary/10 transition-colors"
                    onClick={() => {
                      setEmail('admin@emptrack.com');
                      setPassword('password');
                    }}
                  >
                    <p className="text-xs font-medium text-foreground">Admin Account:</p>
                    <p className="text-xs text-muted-foreground font-mono">admin@emptrack.com / password</p>
                  </div>
                </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          © 2026 EmpTrack. All rights reserved.
        </p>
      </div>
    </div>
  );
}