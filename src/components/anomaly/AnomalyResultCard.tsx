import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import type { AttendanceAnomalyOutput, AttendanceAnomalyInput } from '@/types';
import { ScrollArea } from '../ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface AnomalyResultCardProps {
  result: AttendanceAnomalyOutput;
  input: AttendanceAnomalyInput;
}

export default function AnomalyResultCard({ result, input }: AnomalyResultCardProps) {
  const formatTimestamp = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleString();
    } catch (e) {
      return "Invalid Date";
    }
  };

  return (
    <Card className={`border-2 ${result.isAnomaly ? 'border-destructive bg-destructive/5' : 'border-green-500 bg-green-500/5'}`}>
      <CardHeader className="flex flex-row items-start gap-3 space-y-0">
        {result.isAnomaly ? (
          <AlertTriangle className="h-7 w-7 text-destructive flex-shrink-0 mt-1" />
        ) : (
          <CheckCircle2 className="h-7 w-7 text-green-600 flex-shrink-0 mt-1" />
        )}
        <div className="flex-grow">
          <CardTitle className={result.isAnomaly ? 'text-destructive' : 'text-green-700 dark:text-green-500'}>
            {result.isAnomaly ? 'Anomaly Detected' : 'No Anomaly Detected'}
          </CardTitle>
          <CardDescription>For Student ID: <span className="font-semibold text-foreground">{input.studentId}</span>, Meeting ID: <span className="font-semibold text-foreground">{input.meetingId}</span></CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`rounded-md p-3 text-sm ${result.isAnomaly ? 'bg-destructive/10 text-destructive' : 'bg-green-500/10 text-green-700 dark:text-green-400'}`}>
            <p className="font-semibold">AI Explanation:</p>
            <p>{result.explanation || (result.isAnomaly ? 'Unusual pattern observed.' : 'The attendance pattern appears normal.')}</p>
        </div>
        
        <div>
          <h4 className="text-sm font-semibold mb-1 text-muted-foreground">Submitted Join/Leave Events ({input.joinLeaveEvents.length}):</h4>
          <ScrollArea className="h-[150px] rounded-md border bg-background p-2">
            {input.joinLeaveEvents.length > 0 ? (
              <Table className="text-xs">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Type</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {input.joinLeaveEvents.map((event, index) => (
                    <TableRow key={index}>
                      <TableCell className={`capitalize font-medium ${event.type === 'join' ? 'text-green-600' : 'text-red-600'}`}>
                        {event.type}
                      </TableCell>
                      <TableCell>{formatTimestamp(event.timestamp)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="p-4 text-center text-muted-foreground">No events submitted.</p>
            )}
          </ScrollArea>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground pt-4">
        <Info className="h-3 w-3 mr-1.5 flex-shrink-0" />
        This analysis is based on the provided data and the configured AI model.
      </CardFooter>
    </Card>
  );
}
