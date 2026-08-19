import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, ArrowRightLeft } from 'lucide-react';
import { toast } from 'sonner';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'sw', name: 'Kiswahili' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
];

export default function Translator() {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('sw');

  const handleTranslate = async () => {
    if (!text.trim()) {
      toast.error('Please enter text to translate');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, sourceLang, targetLang }),
      });

      if (!response.ok) throw new Error('Translation failed');
      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Translation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setText(result);
    setResult('');
  };

  return (
    <div className="space-y-4">
      <Card className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">From</label>
            <Select value={sourceLang} onValueChange={setSourceLang}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">To</label>
            <Select value={targetLang} onValueChange={setTargetLang}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleSwap}
          className="w-full"
        >
          <ArrowRightLeft className="w-4 h-4 mr-2" />
          Swap Languages
        </Button>

        <div>
          <label className="text-sm font-medium">Text to Translate</label>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to translate..."
            className="mt-2 min-h-32"
          />
        </div>

        <Button onClick={handleTranslate} disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Translating...
            </>
          ) : (
            'Translate'
          )}
        </Button>

        {result && (
          <div>
            <label className="text-sm font-medium">Translation</label>
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
              Copy Translation
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
