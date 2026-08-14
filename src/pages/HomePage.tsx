import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Plus, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Conversation } from '@/types';
import { getConversations, createConversation } from '@/lib/db-service';
import { toast } from 'sonner';

export default function HomePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }

    const loadConversations = async () => {
      try {
        setLoading(true);
        const convs = await getConversations(user.id);
        setConversations(convs);
      } catch (error) {
        console.error('Error loading conversations:', error);
        toast.error('Failed to load conversations');
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [isAuthenticated, user, navigate]);

  const handleNewConversation = async () => {
    if (!user) return;

    try {
      const conv = await createConversation(user.id);
      navigate(`/chat/${conv.id}`);
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast.error('Failed to create conversation');
    }
  };

  if (authLoading) {
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
        <h1 className="text-2xl font-bold text-foreground">Robin AI</h1>
        <p className="text-sm text-muted-foreground">Your personal AI assistant</p>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 p-4">
        <div className="max-w-2xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-lg font-semibold text-foreground mb-2">
                No conversations yet
              </h2>
              <p className="text-muted-foreground mb-6">
                Start a new conversation to begin chatting with Robin AI
              </p>
              <Button onClick={handleNewConversation} size="lg">
                <Plus className="w-5 h-5 mr-2" />
                New Conversation
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-foreground">
                  Recent Conversations
                </h2>
                <Button onClick={handleNewConversation} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  New
                </Button>
              </div>

              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => navigate(`/chat/${conv.id}`)}
                  className="p-4 rounded-lg border border-border hover:bg-secondary cursor-pointer transition"
                >
                  <h3 className="font-medium text-foreground line-clamp-1">
                    {conv.title || 'Untitled Conversation'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(conv.updated_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* New Conversation Button */}
      {conversations.length > 0 && (
        <div className="border-t border-border p-4">
          <Button onClick={handleNewConversation} className="w-full">
            <Plus className="w-5 h-5 mr-2" />
            New Conversation
          </Button>
        </div>
      )}
    </div>
  );
}
