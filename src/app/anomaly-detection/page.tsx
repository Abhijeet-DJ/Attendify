
'use client';

import { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import AnomalyDetectionForm from '@/components/anomaly/AnomalyDetectionForm';
import AnomalyResultCard from '@/components/anomaly/AnomalyResultCard';
import type { AttendanceAnomalyInput, AttendanceAnomalyOutput } from '@/types';
// import { detectAttendanceAnomaly } from '@/ai/flows/attendance-anomaly-detection'; // AI flow will be re-integrated
// import { useUser, useAuth } from '@clerk/nextjs'; // Clerk removed
// import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FlaskConical, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// This page will be updated to use custom authentication.
// For now, it's a placeholder.
export default function AnomalyDetectionPage() {
  // const router = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AttendanceAnomalyOutput | null>(null);
  const [currentInput, setCurrentInput] = useState<AttendanceAnomalyInput | null>(null);

  const isSignedIn = false; // Placeholder
  const isAdmin = false; // Placeholder
  const isLoaded = true; // Placeholder

  // useEffect(() => {
  //   // Custom auth checks and redirection
  // }, [isSignedIn, isAdmin, isLoaded, router]);

  const handleDetectAnomaly = async (input: AttendanceAnomalyInput) => {
    setIsLoading(true);
    setAnalysisResult(null);
    setCurrentInput(input);
    try {
      // const result = await detectAttendanceAnomaly(input); // Re-enable with custom auth context
      // setAnalysisResult(result);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate AI call
      const mockResult: AttendanceAnomalyOutput = { isAnomaly: Math.random() > 0.5, explanation: "Mock analysis result."};
      setAnalysisResult(mockResult);
      toast({
        title: 'Analysis Complete (Mock)',
        description: mockResult.isAnomaly ? 'Anomaly detected.' : 'No anomaly detected.',
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

  if (!isLoaded) {
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
         <p className="text-muted-foreground">Please sign in as an admin to use this feature.</p>
         <Button asChild><Link href="/login">Sign In</Link></Button>
      </div>
    );
  }
  
  if (isSignedIn && !isAdmin) {
     return (
      <div className="flex h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-center space-y-4 p-6 text-center">
        <AlertTriangle className="h-12 w-12 text-destructive" />
        <p className="text-lg font-medium">Access Denied</p>
        <p className="text-muted-foreground">You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance Anomaly Detection"
        description="Use AI to identify unusual join/leave patterns. (Functionality pending sign-in)"
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
