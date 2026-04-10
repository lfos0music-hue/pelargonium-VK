import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '@/src/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings, UserPlus, Trash2, Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export const AdminPanel: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newModeratorEmail, setNewModeratorEmail] = useState('');
  const [moderators, setModerators] = useState<string[]>([]);

  const fetchModerators = async () => {
    try {
      const docRef = doc(db, 'config', 'moderators');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setModerators(docSnap.data().emails || []);
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

  const handleAddModerator = async () => {
    if (!newModeratorEmail) return;
    setLoading(true);
    try {
      const docRef = doc(db, 'config', 'moderators');
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        await setDoc(docRef, { emails: [newModeratorEmail] });
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
      toast.error("Ошибка при добавлении модератора");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveModerator = async (email: string) => {
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
      toast.error("Ошибка при удалении модератора");
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
            <Label>Добавить модератора (Email)</Label>
            <div className="flex gap-2">
              <Input 
                placeholder="example@gmail.com" 
                value={newModeratorEmail}
                onChange={(e) => setNewModeratorEmail(e.target.value)}
              />
              <Button onClick={handleAddModerator} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Модераторы смогут добавлять, редактировать и удалять товары.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Список модераторов</Label>
            <div className="border rounded-lg divide-y bg-slate-50 max-h-[200px] overflow-y-auto">
              {moderators.length > 0 ? (
                moderators.map((email) => (
                  <div key={email} className="flex items-center justify-between p-3">
                    <span className="text-sm font-medium">{email}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveModerator(email)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
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
