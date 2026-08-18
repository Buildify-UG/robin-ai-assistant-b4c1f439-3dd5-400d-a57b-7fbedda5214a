import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import {
  Pen,
  Globe,
  Calculator,
  BookOpen,
  Wrench,
  Plus,
} from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import WritingAssistant from '@/components/tools/WritingAssistant';
import Translator from '@/components/tools/Translator';
import MathAssistant from '@/components/tools/MathAssistant';
import StudyAssistant from '@/components/tools/StudyAssistant';
import EngineeringTools from '@/components/tools/EngineeringTools';

export default function ToolsPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('writing');

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-background pb-20">
      <div className="border-b border-border p-4">
        <h1 className="text-2xl font-bold text-foreground mb-4">AI Tools</h1>
        <p className="text-muted-foreground">
          Specialized AI assistants for different tasks
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 max-w-4xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="writing" title="Writing">
                <Pen className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="translator" title="Translator">
                <Globe className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="math" title="Math">
                <Calculator className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="study" title="Study">
                <BookOpen className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="engineering" title="Engineering">
                <Wrench className="w-4 h-4" />
              </TabsTrigger>
            </TabsList>

            <TabsContent value="writing">
              <WritingAssistant />
            </TabsContent>

            <TabsContent value="translator">
              <Translator />
            </TabsContent>

            <TabsContent value="math">
              <MathAssistant />
            </TabsContent>

            <TabsContent value="study">
              <StudyAssistant />
            </TabsContent>

            <TabsContent value="engineering">
              <EngineeringTools />
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>

      <BottomNav />
    </div>
  );
}
