
'use client';

import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Users, Clock, CheckCircle, AlertTriangle, ListChecks, FlaskConical } from 'lucide-react';
// import { useEffect, useState } from 'react'; // Will be needed when fetching data
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
// import { getDashboardSummaryData, type DashboardSummaryData } from '@/app/actions/dashboardActions';
// import { useToast } from '@/hooks/use-toast';

// This page will be updated to use custom authentication and fetch data.
// For now, it's a placeholder.

export default function DashboardPage() {
  // const { toast } = useToast();
  // const [summaryData, setSummaryData] = useState<DashboardSummaryData | null>(null);
  const isLoadingData = true; // Placeholder
  const isSignedIn = false; // Placeholder for auth state
  const isAdmin = false; // Placeholder for role state

  // useEffect(() => {
  //   if (isSignedIn && isAdmin) {
  //     // Fetch data
  //   }
  // }, [isSignedIn, isAdmin, toast]);

  if (!isSignedIn && !isLoadingData) { // Show if not signed in and not loading (i.e. auth check complete)
    return (
      <div className="flex h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-center space-y-4 p-6 text-center">
         <p className="text-lg font-medium">Access Denied</p>
         <p className="text-muted-foreground">Please sign in to view the dashboard.</p>
         <Button asChild><Link href="/login">Sign In</Link></Button>
      </div>
    );
  }
  
  if (isLoadingData) { // Generic loading for auth check or data fetch
    return (
      <div className="flex h-[calc(100vh-theme(spacing.16))] items-center justify-center">
        <LoadingSpinner size="xl"/>
      </div>
    );
  }

  if (isSignedIn && !isAdmin) {
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
  
  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Dashboard"
        description="Overview of attendance and class activities. (Data loading soon)"
      />
       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">Loading data...</p>
            </CardContent>
          </Card>
           <Card className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Meetings</CardTitle>
                <Clock className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">--</div>
                <p className="text-xs text-muted-foreground">Loading data...</p>
              </CardContent>
            </Card>
            <Card className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Attendance</CardTitle>
                 <CheckCircle className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">N/A</div>
                 <p className="text-xs text-muted-foreground">(Calculation pending)</p>
              </CardContent>
            </Card>
             <Card className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Anomalies</CardTitle>
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">--</div>
                <Link href="/anomaly-detection" className="text-xs text-primary hover:underline">
                    Analyze New Data
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
                  <p>Attendance chart (future enhancement).</p>
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
