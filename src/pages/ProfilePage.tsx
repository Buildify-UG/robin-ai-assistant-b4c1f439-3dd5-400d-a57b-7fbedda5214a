import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Loader2, LogOut, Moon, Globe } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { User, UserMemory } from '@/types';
import { updateUser, getUserMemories, deleteMemory, logout } from '@/lib/auth';
import { toast } from 'sonner';
import BottomNav from '@/components/BottomNav';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [memories, setMemories] = useState<UserMemory[]>([]);
  const [memoriesLoading, setMemoriesLoading] = useState(false);
  const [editingName, setEditingName] = useState(user?.name || '');
  const [language, setLanguage] = useState(user?.language || 'en');
  const [darkMode, setDarkMode] = useState(user?.dark_mode || false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    user?.notifications_enabled ?? true
  );
  const [memoryEnabled, setMemoryEnabled] = useState(user?.memory_enabled ?? true);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }

    const loadMemories = async () => {
      try {
        setMemoriesLoading(true);
        const userMemories = await getUserMemories(user.id);
        setMemories(userMemories);
      } catch (error) {
        console.error('Error loading memories:', error);
      } finally {
        setMemoriesLoading(false);
      }
    };

    loadMemories();
  }, [isAuthenticated, user, navigate]);

  const handleUpdateProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      await updateUser(user.id, {
        name: editingName,
        language,
        dark_mode: darkMode,
        notifications_enabled: notificationsEnabled,
        memory_enabled: memoryEnabled,
      });
      toast.success('Profile updated');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMemory = async (memoryId: string) => {
    if (window.confirm('Delete this memory?')) {
      try {
        await deleteMemory(memoryId);
        setMemories(memories.filter((m) => m.id !== memoryId));
        toast.success('Memory deleted');
      } catch (error) {
        console.error('Error deleting memory:', error);
        toast.error('Failed to delete memory');
      }
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      try {
        await logout();
        navigate('/login');
        toast.success('Logged out');
      } catch (error) {
        console.error('Logout error:', error);
        toast.error('Failed to logout');
      }
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-background pb-20">
      <div className="border-b border-border p-4">
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 max-w-2xl mx-auto">
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="memories">Memories</TabsTrigger>
            </TabsList>

            {/* Account Tab */}
            <TabsContent value="account" className="space-y-4">
              <Card className="p-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={user.email}
                      disabled
                      className="bg-muted"
                    />
                  </div>

                  <div>
                    <Label htmlFor="joined">Member Since</Label>
                    <Input
                      id="joined"
                      value={new Date(user.created_at).toLocaleDateString()}
                      disabled
                      className="bg-muted"
                    />
                  </div>

                  <Button onClick={handleUpdateProfile} disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </div>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-4">
              <Card className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="language">Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="sw">Kiswahili</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="darkMode">Dark Mode</Label>
                    <Switch
                      id="darkMode"
                      checked={darkMode}
                      onCheckedChange={setDarkMode}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifications">Notifications</Label>
                    <Switch
                      id="notifications"
                      checked={notificationsEnabled}
                      onCheckedChange={setNotificationsEnabled}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="memory">Memory System</Label>
                    <Switch
                      id="memory"
                      checked={memoryEnabled}
                      onCheckedChange={setMemoryEnabled}
                    />
                  </div>

                  <Button onClick={handleUpdateProfile} disabled={loading} className="w-full">
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Preferences'
                    )}
                  </Button>
                </div>
              </Card>
            </TabsContent>

            {/* Memories Tab */}
            <TabsContent value="memories" className="space-y-4">
              <Card className="p-4">
                <h3 className="font-semibold text-foreground mb-4">Saved Memories</h3>
                {memoriesLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : memories.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Ask Robin AI to remember something for you
                  </p>
                ) : (
                  <div className="space-y-3">
                    {memories.map((memory) => (
                      <div
                        key={memory.id}
                        className="p-3 rounded-lg border border-border flex justify-between items-start gap-3"
                      >
                        <div className="flex-1">
                          <p className="text-foreground text-sm">{memory.text}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {memory.enabled ? 'Active' : 'Disabled'} • {new Date(memory.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteMemory(memory.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>

          {/* Logout Button */}
          <div className="mt-6">
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </ScrollArea>

      <BottomNav />
    </div>
  );
}
