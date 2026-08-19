import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function WritingAssistant() {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'write' | 'rewrite' | 'grammar' | 'summarize' | 'tone'>('write');

  const handleProcess = async () => {
    if (!text.trim()) {
      toast.error('Please enter some text');
      return;
    }

    setLoading(true);
    try {
      // This will call the AI service
      const response = await fetch('/api/writing-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, mode }),
      });

      if (!response.ok) throw new Error('Failed to process text');
      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to process text');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
        {(['write', 'rewrite', 'grammar', 'summarize', 'tone'] as const).map((m) => (
          <Button
            key={m}
            variant={mode === m ? 'default' : 'outline'}
            onClick={() => setMode(m)}
            className="capitalize text-xs"
          >
            {m}
          </Button>
        ))}
      </div>

      <Card className="p-4 space-y-4">
        <div>
          <label className="text-sm font-medium">Input Text</label>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter or paste your text here..."
            className="mt-2 min-h-32"
          />
        </div>

        <Button onClick={handleProcess} disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            'Process'
          )}
        </Button>

        {result && (
          <div>
            <label className="text-sm font-medium">Result</label>
            <div className="mt-2 p-4 bg-secondary rounded-lg text-foreground whitespace-pre-wrap">
              {result}
            </div>
            <Button
              variant="outline"
              className="mt-2 w-full"
              onClick={() => {
                navigator.clipboard.writeText(result);
                toast.success('Copied to clipboard');
              }}
            >
              Copy Result
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
