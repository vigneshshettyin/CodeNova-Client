import { PlusCircle, Trash2, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

interface TestCasesProps {
  testCases: Array<{ input: string; expectedOutput: string }>;
  setTestCases: (testCases: Array<{ input: string; expectedOutput: string }>) => void;
  onSubmit: () => void;
  loading: boolean;
}

export function TestCases({ testCases, setTestCases, onSubmit, loading }: TestCasesProps) {
  const handleAddTestCase = () => {
    setTestCases([...testCases, { input: '', expectedOutput: '' }]);
  };

  const handleRemoveTestCase = (index: number) => {
    if (testCases.length > 1) {
      const newTestCases = [...testCases];
      newTestCases.splice(index, 1);
      setTestCases(newTestCases);
    }
  };

  const handleInputChange = (index: number, field: 'input' | 'expectedOutput', value: string) => {
    const newTestCases = [...testCases];
    newTestCases[index][field] = value;
    setTestCases(newTestCases);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Test Cases</CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAddTestCase}
              className="flex items-center gap-1"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add Test Case</span>
            </Button>
            <Button 
              onClick={onSubmit} 
              disabled={loading}
              className="flex items-center gap-1"
              size="sm"
            >
              {loading ? (
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
              ) : (
                <Play className="h-4 w-4" />
              )}
              <span>Run Code</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[300px] overflow-y-auto">
        {testCases.map((testCase, index) => (
          <div key={index} className="space-y-2">
            {index > 0 && <Separator className="my-4" />}
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Test Case #{index + 1}</h3>
              {testCases.length > 1 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleRemoveTestCase(index)}
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs mb-1 block">Input</label>
                <Textarea
                  placeholder="Enter input values"
                  value={testCase.input}
                  onChange={(e) => handleInputChange(index, 'input', e.target.value)}
                  className="font-mono text-sm"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-xs mb-1 block">Expected Output</label>
                <Textarea
                  placeholder="Enter expected output"
                  value={testCase.expectedOutput}
                  onChange={(e) => handleInputChange(index, 'expectedOutput', e.target.value)}
                  className="font-mono text-sm"
                  rows={3}
                />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}