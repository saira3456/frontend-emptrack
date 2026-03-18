'use client';

import { Bell, Shield, Eye, Lock, Users, Database } from 'lucide-react';
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function SettingsPage() {
  return (
    <AppLayout userName="Admin User" userRole="Administrator">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage system settings and preferences</p>
      </div>

      {/* Settings Grid */}
      <div className="space-y-6 max-w-4xl">
        {/* Notification Settings */}
        <Card className="border-border/40 bg-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-primary" />
              <div>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Manage notification preferences</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/40">
              <div>
                <p className="font-medium text-foreground">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive updates via email</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/40">
              <div>
                <p className="font-medium text-foreground">Leave Approvals</p>
                <p className="text-sm text-muted-foreground">Notify on leave requests</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/40">
              <div>
                <p className="font-medium text-foreground">Attendance Updates</p>
                <p className="text-sm text-muted-foreground">Daily attendance summary</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/40">
              <div>
                <p className="font-medium text-foreground">Payroll Alerts</p>
                <p className="text-sm text-muted-foreground">Salary processing notifications</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="border-border/40 bg-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-primary" />
              <div>
                <CardTitle>Security</CardTitle>
                <CardDescription>Manage security and access settings</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/40">
              <div>
                <p className="font-medium text-foreground">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
              </div>
              <Button variant="outline" size="sm" className="border-border/40">
                Enable
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/40">
              <div>
                <p className="font-medium text-foreground">Session Timeout</p>
                <p className="text-sm text-muted-foreground">Automatically logout after inactivity</p>
              </div>
              <Button variant="outline" size="sm" className="border-border/40">
                Configure
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/40">
              <div>
                <p className="font-medium text-foreground">Login History</p>
                <p className="text-sm text-muted-foreground">View recent login attempts</p>
              </div>
              <Button variant="outline" size="sm" className="border-border/40">
                View
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/40">
              <div>
                <p className="font-medium text-foreground">API Keys</p>
                <p className="text-sm text-muted-foreground">Manage API access tokens</p>
              </div>
              <Button variant="outline" size="sm" className="border-border/40">
                Manage
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card className="border-border/40 bg-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-primary" />
              <div>
                <CardTitle>Privacy</CardTitle>
                <CardDescription>Control data visibility and sharing</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/40">
              <div>
                <p className="font-medium text-foreground">Profile Visibility</p>
                <p className="text-sm text-muted-foreground">Allow other employees to see your profile</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/40">
              <div>
                <p className="font-medium text-foreground">Activity Tracking</p>
                <p className="text-sm text-muted-foreground">Allow system to track activity logs</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/40">
              <div>
                <p className="font-medium text-foreground">Data Sharing</p>
                <p className="text-sm text-muted-foreground">Share anonymous data for analytics</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card className="border-border/40 bg-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-primary" />
              <div>
                <CardTitle>System</CardTitle>
                <CardDescription>System-wide configuration</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/40">
              <div>
                <p className="font-medium text-foreground">Theme</p>
                <p className="text-sm text-muted-foreground">Dark Mode is currently enabled</p>
              </div>
              <Button variant="outline" size="sm" className="border-border/40">
                Change
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/40">
              <div>
                <p className="font-medium text-foreground">Language</p>
                <p className="text-sm text-muted-foreground">English</p>
              </div>
              <Button variant="outline" size="sm" className="border-border/40">
                Change
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/40">
              <div>
                <p className="font-medium text-foreground">Timezone</p>
                <p className="text-sm text-muted-foreground">UTC-05:00 (Eastern Time)</p>
              </div>
              <Button variant="outline" size="sm" className="border-border/40">
                Change
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/40">
              <div>
                <p className="font-medium text-foreground">Backup & Restore</p>
                <p className="text-sm text-muted-foreground">Manage system backups</p>
              </div>
              <Button variant="outline" size="sm" className="border-border/40">
                Configure
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Access Control */}
        <Card className="border-border/40 bg-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <CardTitle>Access Control</CardTitle>
                <CardDescription>Manage user roles and permissions</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Manage Roles & Permissions
            </Button>
            <Button variant="outline" className="w-full border-border/40">
              User Directory
            </Button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-500/20 bg-card">
          <CardHeader className="border-b border-red-500/20">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-red-500" />
              <div>
                <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
                <CardDescription>Irreversible actions</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20">
              <p className="font-medium text-foreground mb-2">Clear All Logs</p>
              <p className="text-sm text-muted-foreground mb-3">This will permanently delete all system activity logs</p>
              <Button variant="outline" className="text-red-600 dark:text-red-400 border-red-500/30 hover:bg-red-500/10">
                Clear Logs
              </Button>
            </div>
            <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20">
              <p className="font-medium text-foreground mb-2">Reset System</p>
              <p className="text-sm text-muted-foreground mb-3">This will reset the entire system to default settings</p>
              <Button variant="outline" className="text-red-600 dark:text-red-400 border-red-500/30 hover:bg-red-500/10">
                Reset System
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
