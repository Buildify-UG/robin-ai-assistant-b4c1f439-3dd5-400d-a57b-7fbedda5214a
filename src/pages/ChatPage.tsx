import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, Plus, Mic, Copy, RotateCcw, Star, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Message as MessageType, Conversation } from '@/types';
import { getMessages, createMessage, updateConversation, getConversation } from '@/lib/db-service';
import { callAIAPI, generateConversationTitle } from '@/lib/ai-service';
import { getUserMemories } from '@/lib/db-service';
import { toast } from 'sonner';

export default function ChatPage() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!conversationId || !user) return;

    const loadConversation = async () => {
      try {
        setLoading(true);
        const conv = await getConversation(conversationId);
        setConversation(conv);

        const msgs = await getMessages(conversationId);
        setMessages(msgs);
      } catch (error) {
        console.error('Error loading conversation:', error);
        toast.error('Failed to load conversation');
      } finally {
        setLoading(false);
      }
    };

    loadConversation();
  }, [conversationId, user]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !conversationId || !user) return;

    try {
      setAiLoading(true);
      const userMessage = await createMessage(conversationId, 'user', inputValue);
      setMessages((prev) => [...prev, userMessage]);
      setInputValue('');

      // Get user memories for context
      const memories = await getUserMemories(user.id);

      // Call AI
      const aiMessages = messages.map((m) => ({
        role: m.sender_type as 'user' | 'assistant',
        content: m.text,
      }));
      aiMessages.push({ role: 'user', content: inputValue });

      const aiResponse = await callAIAPI(aiMessages, memories);

      if (aiResponse.error) {
        toast.error(aiResponse.error);
        return;
      }

      const assistantMessage = await createMessage(
        conversationId,
        'assistant',
        aiResponse.text
      );
      setMessages((prev) => [...prev, assistantMessage]);

      // Update conversation title if it's the first message
      if (messages.length === 0) {
        const title = await generateConversationTitle(inputValue);
        await updateConversation(conversationId, { title });
        setConversation((prev) => (prev ? { ...prev, title } : null));
      }

      // Update conversation updated_at
      await updateConversation(conversationId, {
        updated_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border p-4">
        <h1 className="text-lg font-semibold text-foreground">
          {conversation?.title || 'New Conversation'}
        </h1>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Start a conversation
                </h2>
                <p className="text-muted-foreground">
                  Ask Robin AI anything. It can help with questions, writing, math, coding, and more.
                </p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender_type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender_type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  {message.sender_type === 'assistant' && (
                    <div className="flex gap-2 mt-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          navigator.clipboard.writeText(message.text);
                          toast.success('Copied to clipboard');
                        }}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          {aiLoading && (
            <div className="flex justify-start">
              <div className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            </div>
          )}
        </div>
        <div ref={scrollRef} />
      </ScrollArea>

      {/* Message Composer */}
      <div className="border-t border-border p-4 bg-background">
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={() => {
              /* TODO: Show attachment menu */
            }}
          >
            <Plus className="w-5 h-5" />
          </Button>

          <Input
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={aiLoading}
            className="flex-1"
          />

          <Button
            size="icon"
            variant="outline"
            onClick={() => {
              /* TODO: Voice input */
            }}
          >
            <Mic className="w-5 h-5" />
          </Button>

          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || aiLoading}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
