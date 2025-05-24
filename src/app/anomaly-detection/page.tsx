'use client';

import { useState, useEffect } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import AnomalyDetectionForm from '@/components/anomaly/AnomalyDetectionForm';
import AnomalyResultCard from '@/components/anomaly/AnomalyResultCard';
import type { AttendanceAnomalyInput, AttendanceAnomalyOutput } from '@/types';
import { detectAttendanceAnomaly } from '@/ai/flows/attendance-anomaly-detection';
import { useUser, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FlaskConical } from 'lucide-react';

export default function AnomalyDetectionPage() {
  const { user, isLoaded: userLoaded } = useUser();
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AttendanceAnomalyOutput | null>(null);
  const [currentInput, setCurrentInput] = useState<AttendanceAnomalyInput | null>(null);

  const isAdmin = user?.primaryEmailAddress?.emailAddress === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  useEffect(() => {
    if (authLoaded && userLoaded) {
      if (isSignedIn && !isAdmin) {
        router.replace('/dashboard'); 
      }
      // If not signedIn, Clerk middleware should handle redirection.
    }
  }, [isSignedIn, isAdmin, authLoaded, userLoaded, router]);

  const handleDetectAnomaly = async (input: AttendanceAnomalyInput) => {
    setIsLoading(true);
    setAnalysisResult(null);
    setCurrentInput(input);
    try {
      const result = await detectAttendanceAnomaly(input);
      setAnalysisResult(result);
      toast({
        title: 'Analysis Complete',
        description: result.isAnomaly ? 'Anomaly detected.' : 'No anomaly detected.',
      });
    } catch (error) {
      console.error('Error detecting anomaly:', error);
      toast({
        title: 'Analysis Failed',
        description: 'Could not perform anomaly detection. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!authLoaded || !userLoaded) {
    return (
      <div className="flex h-[calc(100vh-theme(spacing.16))] items-center justify-center">
        <LoadingSpinner size="xl"/>
      </div>
    );
  }

  if (isSignedIn && !isAdmin) {
     return (
      <div className="flex h-[calc(100vh-theme(spacing.16))] items-center justify-center">
         <p>Access Denied. Redirecting...</p>
        <LoadingSpinner size="xl" />
      </div>
    );
  }
  
  if (!isSignedIn) {
     return (
      <div className="flex h-[calc(100vh-theme(spacing.16))] items-center justify-center">
         <p>Access Denied. Please sign in.</p>
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance Anomaly Detection"
        description="Use AI to identify unusual join/leave patterns in student attendance."
      />
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Analyze Attendance Data</CardTitle>
            <CardDescription>Enter student and meeting details along with join/leave events to detect anomalies.</CardDescription>
          </CardHeader>
          <CardContent>
            <AnomalyDetectionForm onSubmit={handleDetectAnomaly} isLoading={isLoading} />
          </CardContent>
        </Card>
        
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Analysis Result</CardTitle>
                <CardDescription>The outcome of the anomaly detection will appear here.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading && (
                    <div className="flex flex-col items-center justify-center h-full min-h-[200px]">
                        <LoadingSpinner className="h-10 w-10 mb-4" />
                        <p className="text-muted-foreground">Analyzing data...</p>
                    </div>
                )}
                {!isLoading && analysisResult && currentInput && (
                    <AnomalyResultCard result={analysisResult} input={currentInput} />
                )}
                {!isLoading && !analysisResult && (
                    <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center text-muted-foreground">
                        <FlaskConical className="h-12 w-12 mb-4 text-gray-400" />
                        <p>No analysis performed yet.</p>
                        <p className="text-sm">Submit data on the left to see results.</p>
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
