'use client';

import { Mail, Phone, MapPin, Briefcase, Building2, Calendar } from 'lucide-react';
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ProfilePage() {
  return (
    <AppLayout userName="Admin User" userRole="Administrator">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
        <p className="text-muted-foreground mt-2">Manage your account information</p>
      </div>

      {/* Profile Header Card */}
      <Card className="border-border/40 bg-card mb-8">
        <CardContent className="pt-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src="" />
              <AvatarFallback className="text-lg font-semibold">AU</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground">Admin User</h2>
              <p className="text-muted-foreground">System Administrator</p>
              <p className="text-sm text-muted-foreground mt-2">admin@emptrack.com</p>
            </div>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Personal Information */}
        <Card className="border-border/40 bg-card lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Basic account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-foreground">First Name</Label>
                <Input disabled value="Admin" className="mt-2 bg-muted text-foreground" />
              </div>
              <div>
                <Label className="text-foreground">Last Name</Label>
                <Input disabled value="User" className="mt-2 bg-muted text-foreground" />
              </div>
            </div>
            <div>
              <Label className="text-foreground">Email Address</Label>
              <Input disabled value="admin@emptrack.com" className="mt-2 bg-muted text-foreground" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-foreground">Phone</Label>
                <Input disabled value="+1 (555) 123-4567" className="mt-2 bg-muted text-foreground" />
              </div>
              <div>
                <Label className="text-foreground">Date of Birth</Label>
                <Input disabled value="1985-05-15" type="date" className="mt-2 bg-muted text-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="border-border/40 bg-card">
          <CardHeader>
            <CardTitle>Account Stats</CardTitle>
            <CardDescription>Your account overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-border/40">
              <Briefcase className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Position</p>
                <p className="font-medium text-foreground">Administrator</p>
              </div>
            </div>
            <div className="flex items-center gap-3 pb-4 border-b border-border/40">
              <Building2 className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="font-medium text-foreground">Administration</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Join Date</p>
                <p className="font-medium text-foreground">Jan 15, 2024</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Professional Information */}
      <Card className="border-border/40 bg-card mb-8">
        <CardHeader>
          <CardTitle>Professional Information</CardTitle>
          <CardDescription>Work-related details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-foreground">Employee ID</Label>
              <Input disabled value="EMP-0001" className="mt-2 bg-muted text-foreground" />
            </div>
            <div>
              <Label className="text-foreground">Role</Label>
              <Input disabled value="System Administrator" className="mt-2 bg-muted text-foreground" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-foreground">Department</Label>
              <Input disabled value="Administration" className="mt-2 bg-muted text-foreground" />
            </div>
            <div>
              <Label className="text-foreground">Manager</Label>
              <Input disabled value="N/A" className="mt-2 bg-muted text-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card className="border-border/40 bg-card">
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>Security and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full border-border/40 justify-start">
            Change Password
          </Button>
          <Button variant="outline" className="w-full border-border/40 justify-start">
            Two-Factor Authentication
          </Button>
          <Button variant="outline" className="w-full border-border/40 justify-start">
            Email Notifications
          </Button>
          <Button variant="outline" className="w-full border-border/40 justify-start text-destructive hover:text-destructive">
            Logout
          </Button>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
