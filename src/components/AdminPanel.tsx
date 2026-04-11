import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '@/src/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings, UserPlus, Trash2, Loader2, ShieldCheck, Users, Palette } from 'lucide-react';
import { toast } from 'sonner';
import bridge from '@vkontakte/vk-bridge';
import { BrandKit } from './BrandKit';

export const AdminPanel: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pickingFriend, setPickingFriend] = useState(false);
  const [newModeratorEmail, setNewModeratorEmail] = useState('');
  const [newModeratorVkId, setNewModeratorVkId] = useState('');
  const [moderatorEmails, setModeratorEmails] = useState<string[]>([]);
  const [moderatorVkIds, setModeratorVkIds] = useState<number[]>([]);
  const [vkStatus, setVkStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

  const checkVkConnection = async () => {
    try {
      const userInfo = await Promise.race([
        bridge.send('VKWebAppGetUserInfo'),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000))
      ]);
      if (userInfo) setVkStatus('connected');
    } catch (e) {
      setVkStatus('disconnected');
    }
  };

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
      checkVkConnection();
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

  const handleAddModeratorVkId = async (idOrName?: string | number) => {
    let input = idOrName !== undefined ? idOrName.toString() : newModeratorVkId.trim();
    
    if (!input) return;

    // Clean up input if it's a URL
    if (input.includes('vk.com/')) {
      // Handle mobile convo links like https://m.vk.com/mail/convo/223601986
      if (input.includes('/mail/convo/')) {
        input = input.split('/mail/convo/').pop()?.split('?')[0] || '';
      } else {
        input = input.split('vk.com/').pop()?.split('?')[0] || '';
      }
    }
    input = input.replace(/https?:\/\//, '').replace(/\//g, '').split('?')[0];

    if (!input) {
      toast.error("Не удалось распознать ID или ссылку");
      return;
    }

    setLoading(true);
    try {
      let finalVkId: number;

      // If it's not a pure number, try to resolve screen name
      if (!/^\d+$/.test(input)) {
        toast.info("Определяем ID по имени...");
        
        const urlParams = new URLSearchParams(window.location.search);
        const appId = parseInt(urlParams.get('vk_app_id') || '54536832'); // Use ID from screenshot as fallback
        
        try {
          // Add timeouts to bridge calls to prevent hangs
          const tokenRes = await Promise.race([
            bridge.send("VKWebAppGetAuthToken", { app_id: appId, scope: "" }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), 5000))
          ]) as any;

          const resolveRes = await Promise.race([
            bridge.send("VKWebAppCallAPIMethod", {
              method: "utils.resolveScreenName",
              params: {
                screen_name: input,
                v: "5.131",
                access_token: tokenRes.access_token
              }
            }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), 5000))
          ]) as any;

          if (resolveRes.response && resolveRes.response.type === 'user') {
            finalVkId = resolveRes.response.object_id;
          } else {
            throw new Error("User not found");
          }
        } catch (bridgeError) {
          console.error("Bridge resolve failed:", bridgeError);
          toast.error("Не удалось связаться с ВК для поиска по имени. Пожалуйста, введите цифровой ID.");
          setLoading(false);
          return;
        }
      } else {
        finalVkId = parseInt(input);
      }

      const docRef = doc(db, 'config', 'moderators');
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        await setDoc(docRef, { emails: [], vkIds: [finalVkId] });
      } else {
        await updateDoc(docRef, {
          vkIds: arrayUnion(finalVkId)
        });
      }
      
      toast.success(`Модератор добавлен (ID: ${finalVkId})`);
      setNewModeratorVkId('');
      fetchModerators();
    } catch (error: any) {
      console.error("Error adding VK moderator:", error);
      toast.error("Не удалось найти пользователя. Проверьте имя или ID.");
    } finally {
      setLoading(false);
    }
  };

  const handlePickFriend = async () => {
    if (pickingFriend) return;
    setPickingFriend(true);
    try {
      console.log("Attempting to pick friend via VK Bridge...");
      
      // Check if we are likely inside VK (iframe or mobile app)
      const isVK = window.location.search.includes('vk_app_id') || 
                   window.location.search.includes('vk_platform');

      if (!isVK) {
        toast.error("Эта кнопка работает только внутри приложения ВКонтакте. В браузере введите ID друга вручную.");
        setPickingFriend(false);
        return;
      }

      // 1. Get App ID from URL
      const urlParams = new URLSearchParams(window.location.search);
      const appId = parseInt(urlParams.get('vk_app_id') || '0');
      
      if (!appId) {
        toast.error("Не удалось определить ID приложения. Пожалуйста, введите ID вручную.");
        setPickingFriend(false);
        return;
      }

      toast.info("Запрашиваем доступ...");
      
      // 2. Request 'friends' scope token
      try {
        await bridge.send("VKWebAppGetAuthToken", { 
          app_id: appId, 
          scope: "friends" 
        });
      } catch (tokenError) {
        console.error("Token request failed:", tokenError);
      }

      toast.info("Открываем список друзей...");
      
      // 3. Show the friend picker UI
      const result = await bridge.send('VKWebAppGetFriends', { multi: false });
      
      if (result && result.users && result.users.length > 0) {
        const friend = result.users[0];
        await handleAddModeratorVkId(friend.id);
      }
    } catch (error: any) {
      console.error("Error picking friend:", error);
      toast.error("Не удалось открыть список. Попробуйте ввести ID вручную.");
    } finally {
      setPickingFriend(false);
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
      <DialogTrigger
        render={
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            Управление
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Панель администратора
            </div>
            <div className="flex items-center gap-1.5">
              <div className={`h-2 w-2 rounded-full ${
                vkStatus === 'connected' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 
                vkStatus === 'disconnected' ? 'bg-red-500' : 'bg-slate-300 animate-pulse'
              }`} />
              <span className="text-[10px] uppercase tracking-wider font-bold opacity-50">
                {vkStatus === 'connected' ? 'VK Connected' : 
                 vkStatus === 'disconnected' ? 'VK Offline' : 'Checking...'}
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <Label>Оформление</Label>
            <Dialog>
              <DialogTrigger
                render={
                  <Button variant="outline" className="w-full gap-2">
                    <Palette className="h-4 w-4" />
                    Открыть Дизайн-кит (Баннеры ВК)
                  </Button>
                }
              />
              <DialogContent className="max-w-[700px] max-h-[90vh] overflow-y-auto">
                <BrandKit />
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Добавить модератора ВК</Label>
              <a 
                href="https://vk.com/faq18062" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[10px] text-primary hover:underline flex items-center gap-1"
              >
                Как узнать ID (через сообщения)?
              </a>
            </div>
            <div className="flex flex-col gap-2">
              <Button 
                variant="secondary" 
                onClick={handlePickFriend} 
                className="gap-2 w-full"
                disabled={pickingFriend}
              >
                {pickingFriend ? <Loader2 className="h-4 w-4 animate-spin" /> : <Users className="h-4 w-4" />}
                Выбрать из друзей ВК
              </Button>
              <div className="flex gap-2">
                <Input 
                  placeholder="Или введите VK ID или ссылку" 
                  value={newModeratorVkId}
                  onChange={(e) => setNewModeratorVkId(e.target.value)}
                  type="text"
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
