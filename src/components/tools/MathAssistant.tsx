import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function MathAssistant() {
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSolve = async () => {
    if (!problem.trim()) {
      toast.error('Please enter a math problem');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/math-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem }),
      });

      if (!response.ok) throw new Error('Failed to solve');
      const data = await response.json();
      setSolution(data.solution);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to solve problem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4 space-y-4">
        <div>
          <label className="text-sm font-medium">Math Problem</label>
          <Textarea
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="Enter your math problem or question..."
            className="mt-2 min-h-32"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Include equations, formulas, or describe the problem clearly
          </p>
        </div>

        <Button onClick={handleSolve} disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Solving...
            </>
          ) : (
            'Solve Step by Step'
          )}
        </Button>

        {solution && (
          <div>
            <label className="text-sm font-medium">Solution</label>
            <div className="mt-2 p-4 bg-secondary rounded-lg text-foreground whitespace-pre-wrap max-h-96 overflow-y-auto">
              {solution}
            </div>
            <Button
              variant="outline"
              className="mt-2 w-full"
              onClick={() => {
                navigator.clipboard.writeText(solution);
                toast.success('Copied to clipboard');
              }}
            >
              Copy Solution
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
