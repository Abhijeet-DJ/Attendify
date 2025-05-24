
'use client';

import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, CheckCircle, Clock, Users, AlertTriangle, ListChecks, FlaskConical } from 'lucide-react';
import { useUser, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation'; // Kept for potential future use, but direct redirect removed
import { useEffect } from 'react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Mock data - replace with actual data fetching
const summaryData = {
  totalStudents: 125,
  upcomingMeetings: 3,
  attendanceRate: 92.5,
  recentAnomalies: 5,
};

export default function DashboardPage() {
  const { user, isLoaded: userLoaded } = useUser();
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  // const router = useRouter(); // No longer immediately redirecting from this page based on role

  const isAdmin = user?.primaryEmailAddress?.emailAddress === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  // Effect to redirect non-admins is removed. 
  // Access control is primarily handled by:
  // 1. Middleware (protecting the route)
  // 2. NavMenu (not showing the link to non-admins)
  // 3. Conditional rendering within this page (showing "Access Denied" message)
  // useEffect(() => {
  //   if (authLoaded && userLoaded) {
  //     if (isSignedIn && !isAdmin) {
  //       // router.replace('/attendance'); 
  //     }
  //   }
  // }, [isSignedIn, isAdmin, authLoaded, userLoaded, router]);

  if (!authLoaded || !userLoaded) {
    return (
      <div className="flex h-[calc(100vh-theme(spacing.16))] items-center justify-center">
        <LoadingSpinner size="xl"/>
      </div>
    );
  }
  
  if (!isSignedIn) {
    // This should ideally be caught by middleware.
    return (
      <div className="flex h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-center space-y-4 p-6 text-center">
         <p className="text-lg font-medium">Access Denied</p>
         <p className="text-muted-foreground">Please sign in to view the dashboard.</p>
      </div>
    );
  }

  if (!isAdmin) {
    // Non-admin signed-in users should not see the dashboard.
    // NavMenu prevents navigation here. If they land here directly, show access denied.
     return (
      <div className="flex h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-center space-y-4 p-6 text-center">
        <AlertTriangle className="h-12 w-12 text-destructive" />
        <p className="text-lg font-medium">Access Denied</p>
        <p className="text-muted-foreground">You do not have permission to view this page.</p>
        <Button asChild variant="outline">
            <Link href="/attendance">Go to My Attendance</Link>
        </Button>
      </div>
    );
  }
  
  // User is signed in and is an admin
  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Dashboard"
        description="Overview of attendance and class activities."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData.totalStudents}</div>
            <p className="text-xs text-muted-foreground">+5 since last month</p>
          </CardContent>
        </Card>
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Meetings</CardTitle>
            <Clock className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData.upcomingMeetings}</div>
            <p className="text-xs text-muted-foreground">Next meeting in 2 days</p>
          </CardContent>
        </Card>
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Attendance Rate</CardTitle>
            <CheckCircle className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData.attendanceRate}%</div>
            <p className="text-xs text-muted-foreground">+1.2% from last week</p>
          </CardContent>
        </Card>
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Anomalies</CardTitle>
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData.recentAnomalies}</div>
             <Link href="/anomaly-detection" className="text-xs text-primary hover:underline">
                View Details
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Attendance Overview</CardTitle>
            <CardDescription>Visual representation of attendance trends.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center bg-muted/30 rounded-b-lg">
            <div className="text-center text-muted-foreground">
              <BarChart className="mx-auto h-12 w-12 mb-2" />
              <p>Attendance chart will be displayed here.</p>
              <p className="text-xs">(Using Recharts or a similar library)</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Navigate to key management areas.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            <Button className="w-full justify-start" asChild>
              <Link href="/attendance-management"><ListChecks className="mr-2 h-4 w-4" />Manage Attendance Records</Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/anomaly-detection"><FlaskConical className="mr-2 h-4 w-4" />Detect Attendance Anomalies</Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/users"><Users className="mr-2 h-4 w-4" />Manage Users</Link> 
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
