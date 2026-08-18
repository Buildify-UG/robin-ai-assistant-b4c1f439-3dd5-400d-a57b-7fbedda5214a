import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Search, Trash2, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Conversation } from '@/types';
import { getConversations, deleteConversation } from '@/lib/db-service';
import { toast } from 'sonner';
import BottomNav from '@/components/BottomNav';

export default function HistoryPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
        setFilteredConversations(convs);
      } catch (error) {
        console.error('Error loading conversations:', error);
        toast.error('Failed to load conversations');
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [isAuthenticated, user, navigate]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = conversations.filter(
      (conv) =>
        conv.title?.toLowerCase().includes(query.toLowerCase()) ||
        conv.id.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredConversations(filtered);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this conversation?')) {
      try {
        await deleteConversation(id);
        setConversations(conversations.filter((c) => c.id !== id));
        setFilteredConversations(filteredConversations.filter((c) => c.id !== id));
        toast.success('Conversation deleted');
      } catch (error) {
        console.error('Error deleting conversation:', error);
        toast.error('Failed to delete conversation');
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background pb-20">
      <div className="border-b border-border p-4">
        <h1 className="text-2xl font-bold text-foreground mb-4">Chat History</h1>
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 max-w-2xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 'No conversations found' : 'No conversations yet'}
              </p>
              <Button onClick={() => navigate('/')}>
                <Plus className="w-4 h-4 mr-2" />
                Start New Chat
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  className="p-4 rounded-lg border border-border hover:bg-secondary transition flex justify-between items-center group"
                >
                  <div
                    onClick={() => navigate(`/chat/${conv.id}`)}
                    className="flex-1 cursor-pointer"
                  >
                    <h3 className="font-medium text-foreground line-clamp-1">
                      {conv.title || 'Untitled Conversation'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(conv.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(conv.id)}
                    className="opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      <BottomNav />
    </div>
  );
}
