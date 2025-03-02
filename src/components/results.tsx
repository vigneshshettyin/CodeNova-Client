import { CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ResultsProps {
  results: Array<{
    input: string;
    expected: string;
    actual: string;
    success: boolean;
    error: string | null;
  }>;
  loading: boolean;
}

export function Results({ results, loading }: ResultsProps) {
  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Results</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            <p className="text-sm text-muted-foreground">Running your code...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (results.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            Run your code to see results here
          </p>
        </CardContent>
      </Card>
    );
  }

  const passedCount = results.filter(r => r.success).length;
  const totalCount = results.length;

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Results</CardTitle>
          <div className="text-sm">
            Passed: <span className="font-medium">{passedCount}/{totalCount}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[300px] overflow-y-auto">
        {results.map((result, index) => (
          <div key={index} className="space-y-2">
            {index > 0 && <Separator className="my-4" />}
            <div className="flex items-center gap-2">
              {result.success ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive" />
              )}
              <h3 className="text-sm font-medium">
                Test Case #{index + 1} - {result.success ? 'Passed' : 'Failed'}
              </h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-xs mb-1">Input:</p>
                <pre className="text-xs bg-muted p-2 rounded-md overflow-x-auto whitespace-pre-wrap">
                  {result.input}
                </pre>
              </div>
              <div>
                <p className="text-xs mb-1">Expected Output:</p>
                <pre className="text-xs bg-muted p-2 rounded-md overflow-x-auto whitespace-pre-wrap">
                  {result.expected}
                </pre>
              </div>
            </div>
            
            <div className="mt-2">
              <p className="text-xs mb-1">Actual Output:</p>
              <pre className={`text-xs p-2 rounded-md overflow-x-auto whitespace-pre-wrap ${
                result.success ? 'bg-green-500/10' : 'bg-destructive/10'
              }`}>
                {result.actual}
              </pre>
            </div>
            
            {result.error && (
              <Alert variant="destructive" className="mt-2">
                <AlertDescription>
                  <pre className="text-xs whitespace-pre-wrap">{result.error}</pre>
                </AlertDescription>
              </Alert>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}