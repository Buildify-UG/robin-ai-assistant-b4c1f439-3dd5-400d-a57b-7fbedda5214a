import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Search, Trash2, Plus, Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Favorite, Message } from '@/types';
import { getFavorites, removeFavorite, getMessageById } from '@/lib/db-service';
import { toast } from 'sonner';
import BottomNav from '@/components/BottomNav';

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<(Favorite & { message?: Message })[]>([]);
  const [filteredFavorites, setFilteredFavorites] = useState<(Favorite & { message?: Message })[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }

    const loadFavorites = async () => {
      try {
        setLoading(true);
        const favs = await getFavorites(user.id);
        
        // Load message details for each favorite
        const favoritesWithMessages = await Promise.all(
          favs.map(async (fav) => {
            try {
              const message = await getMessageById(fav.message_id);
              return { ...fav, message };
            } catch (error) {
              return fav;
            }
          })
        );
        
        setFavorites(favoritesWithMessages);
        setFilteredFavorites(favoritesWithMessages);
      } catch (error) {
        console.error('Error loading favorites:', error);
        toast.error('Failed to load favorites');
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [isAuthenticated, user, navigate]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = favorites.filter(
      (fav) =>
        fav.message?.text.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredFavorites(filtered);
  };

  const handleRemove = async (id: string) => {
    try {
      await removeFavorite(id);
      setFavorites(favorites.filter((f) => f.id !== id));
      setFilteredFavorites(filteredFavorites.filter((f) => f.id !== id));
      toast.success('Removed from favorites');
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove favorite');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background pb-20">
      <div className="border-b border-border p-4">
        <h1 className="text-2xl font-bold text-foreground mb-4">Favorites</h1>
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search favorites..."
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
          ) : filteredFavorites.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 'No favorites found' : 'Save useful AI answers here'}
              </p>
              <Button onClick={() => navigate('/')}>
                <Plus className="w-4 h-4 mr-2" />
                Start Chatting
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFavorites.map((fav) => (
                <div
                  key={fav.id}
                  className="p-4 rounded-lg border border-border hover:bg-secondary transition group"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div
                      onClick={() => navigate(`/chat/${fav.conversation_id}`)}
                      className="flex-1 cursor-pointer"
                    >
                      <p className="text-foreground line-clamp-3">
                        {fav.message?.text || 'Message not found'}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {new Date(fav.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemove(fav.id)}
                      className="opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
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
