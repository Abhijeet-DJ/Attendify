
'use client';

import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, CheckCircle, Clock, Users, AlertTriangle, ListChecks, FlaskConical } from 'lucide-react';
import { useUser, useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getDashboardSummaryData, type DashboardSummaryData } from '@/app/actions/dashboardActions';
import { useToast } from '@/hooks/use-toast';


export default function DashboardPage() {
  const { user, isLoaded: userLoaded } = useUser();
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const { toast } = useToast();

  const [summaryData, setSummaryData] = useState<DashboardSummaryData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const isAdmin = user?.primaryEmailAddress?.emailAddress === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  useEffect(() => {
    if (isSignedIn && isAdmin) {
      const fetchData = async () => {
        setIsLoadingData(true);
        try {
          const data = await getDashboardSummaryData();
          setSummaryData(data);
        } catch (error) {
          console.error("Failed to fetch dashboard summary data:", error);
          toast({
            title: "Error Fetching Dashboard Data",
            description: "Could not load summary information.",
            variant: "destructive",
          });
          // Set to default error state or empty state
          setSummaryData({
            totalStudents: 0,
            upcomingMeetings: 0,
            recentAnomalies: 0,
            averageAttendanceRate: "Error",
          });
        } finally {
          setIsLoadingData(false);
        }
      };
      fetchData();
    } else if (isSignedIn && !isAdmin) {
      setIsLoadingData(false); // No data to load for non-admins on this page
    }
  }, [isSignedIn, isAdmin, toast]);


  if (!authLoaded || !userLoaded || (isLoadingData && isSignedIn && isAdmin) ) {
    return (
      <div className="flex h-[calc(100vh-theme(spacing.16))] items-center justify-center">
        <LoadingSpinner size="xl"/>
      </div>
    );
  }
  
  if (!isSignedIn) {
    return (
      <div className="flex h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-center space-y-4 p-6 text-center">
         <p className="text-lg font-medium">Access Denied</p>
         <p className="text-muted-foreground">Please sign in to view the dashboard.</p>
      </div>
    );
  }

  if (!isAdmin) {
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
  
  // User is signed in, is an admin, and data has been attempted to load
  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Dashboard"
        description="Overview of attendance and class activities from the database."
      />

      {summaryData ? (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students (DB)</CardTitle>
                <Users className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summaryData.totalStudents}</div>
                <p className="text-xs text-muted-foreground">From 'users' collection</p>
              </CardContent>
            </Card>
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Meetings (DB)</CardTitle>
                <Clock className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summaryData.upcomingMeetings}</div>
                <p className="text-xs text-muted-foreground">From 'meetings' collection</p>
              </CardContent>
            </Card>
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Attendance Rate</CardTitle>
                <CheckCircle className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summaryData.averageAttendanceRate}</div>
                <p className="text-xs text-muted-foreground">(Calculation placeholder)</p>
              </CardContent>
            </Card>
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Anomalies (DB)</CardTitle>
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summaryData.recentAnomalies}</div>
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
                  <Link href="/users"><Users className="mr-2 h-4 w-4" />Manage Users (DB View)</Link> 
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <p className="text-muted-foreground">Loading dashboard data or no data available...</p>
        </div>
      )}
    </div>
  );
}
