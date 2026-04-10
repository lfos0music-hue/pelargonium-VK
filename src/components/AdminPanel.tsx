import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '@/src/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings, UserPlus, Trash2, Loader2, ShieldCheck, Users } from 'lucide-react';
import { toast } from 'sonner';
import bridge from '@vkontakte/vk-bridge';

export const AdminPanel: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newModeratorEmail, setNewModeratorEmail] = useState('');
  const [newModeratorVkId, setNewModeratorVkId] = useState('');
  const [moderatorEmails, setModeratorEmails] = useState<string[]>([]);
  const [moderatorVkIds, setModeratorVkIds] = useState<number[]>([]);

  const fetchModerators = async () => {
    try {
      const docRef = doc(db, 'config', 'moderators');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setModeratorEmails(data.emails || []);
        setModeratorVkIds(data.vkIds || []);
      }
    } catch (error) {
      console.error("Error fetching moderators:", error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchModerators();
    }
  }, [open]);

  const handleAddModeratorEmail = async () => {
    if (!newModeratorEmail) return;
    setLoading(true);
    try {
      const docRef = doc(db, 'config', 'moderators');
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        await setDoc(docRef, { emails: [newModeratorEmail], vkIds: [] });
      } else {
        await updateDoc(docRef, {
          emails: arrayUnion(newModeratorEmail)
        });
      }
      
      toast.success(`Модератор ${newModeratorEmail} добавлен`);
      setNewModeratorEmail('');
      fetchModerators();
    } catch (error) {
      console.error("Error adding moderator:", error);
      toast.error("Ошибка при добавлении");
    } finally {
      setLoading(false);
    }
  };

  const handleAddModeratorVkId = async (id?: number) => {
    const vkId = id || parseInt(newModeratorVkId);
    if (isNaN(vkId)) {
      toast.error("Введите корректный VK ID");
      return;
    }
    setLoading(true);
    try {
      const docRef = doc(db, 'config', 'moderators');
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        await setDoc(docRef, { emails: [], vkIds: [vkId] });
      } else {
        await updateDoc(docRef, {
          vkIds: arrayUnion(vkId)
        });
      }
      
      toast.success(`Модератор с VK ID ${vkId} добавлен`);
      setNewModeratorVkId('');
      fetchModerators();
    } catch (error) {
      console.error("Error adding VK moderator:", error);
      toast.error("Ошибка при добавлении");
    } finally {
      setLoading(false);
    }
  };

  const handlePickFriend = async () => {
    try {
      // VKWebAppGetFriends returns a list of friends the user picked
      const result = await bridge.send('VKWebAppGetFriends', { multi: false });
      if (result.users && result.users.length > 0) {
        const friend = result.users[0];
        handleAddModeratorVkId(friend.id);
      }
    } catch (error) {
      console.error("Error picking friend:", error);
      // User might have cancelled
    }
  };

  const handleRemoveModeratorEmail = async (email: string) => {
    setLoading(true);
    try {
      const docRef = doc(db, 'config', 'moderators');
      await updateDoc(docRef, {
        emails: arrayRemove(email)
      });
      toast.success(`Модератор ${email} удален`);
      fetchModerators();
    } catch (error) {
      console.error("Error removing moderator:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveModeratorVkId = async (vkId: number) => {
    setLoading(true);
    try {
      const docRef = doc(db, 'config', 'moderators');
      await updateDoc(docRef, {
        vkIds: arrayRemove(vkId)
      });
      toast.success(`VK ID ${vkId} удален`);
      fetchModerators();
    } catch (error) {
      console.error("Error removing VK moderator:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          Управление
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Панель администратора
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <Label>Добавить модератора ВК</Label>
            <div className="flex flex-col gap-2">
              <Button variant="secondary" onClick={handlePickFriend} className="gap-2 w-full">
                <Users className="h-4 w-4" />
                Выбрать из друзей ВК
              </Button>
              <div className="flex gap-2">
                <Input 
                  placeholder="Или введите VK ID вручную" 
                  value={newModeratorVkId}
                  onChange={(e) => setNewModeratorVkId(e.target.value)}
                  type="number"
                />
                <Button onClick={() => handleAddModeratorVkId()} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Добавить по Email (Google)</Label>
            <div className="flex gap-2">
              <Input 
                placeholder="example@gmail.com" 
                value={newModeratorEmail}
                onChange={(e) => setNewModeratorEmail(e.target.value)}
              />
              <Button onClick={handleAddModeratorEmail} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Список модераторов</Label>
            <div className="border rounded-lg divide-y bg-slate-50 max-h-[250px] overflow-y-auto">
              {moderatorVkIds.length > 0 || moderatorEmails.length > 0 ? (
                <>
                  {moderatorVkIds.map((id) => (
                    <div key={`vk-${id}`} className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-100 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded">VK</div>
                        <span className="text-sm font-medium">ID: {id}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveModeratorVkId(id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {moderatorEmails.map((email) => (
                    <div key={`email-${email}`} className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-2">
                        <div className="bg-slate-200 text-slate-700 text-[10px] font-bold px-1.5 py-0.5 rounded">EMAIL</div>
                        <span className="text-sm font-medium">{email}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveModeratorEmail(email)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </>
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Список модераторов пуст
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
