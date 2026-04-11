import React, { useState } from 'react';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '@/src/firebase';
import { handleFirestoreError, OperationType } from '@/src/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle, Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { resizeImage } from '@/src/lib/imageUtils';

export const AddProductDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    category: '',
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const resized = await resizeImage(file);
      setImagePreview(resized);
      setFormData({ ...formData, imageUrl: resized });
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("Ошибка при обработке фото");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      toast.error("Пожалуйста, добавьте фото товара");
      return;
    }
    setLoading(true);

    try {
      const path = 'products';
      const priceNum = parseFloat(formData.price);
      
      if (isNaN(priceNum)) {
        toast.error("Пожалуйста, введите корректную цену");
        setLoading(false);
        return;
      }

      await addDoc(collection(db, path), {
        ...formData,
        price: priceNum,
        inStock: true,
        createdAt: Timestamp.now(),
      });
      
      toast.success('Товар успешно добавлен!');
      setOpen(false);
      
      // Reset form state after a short delay to allow dialog to close
      setTimeout(() => {
        setFormData({ name: '', description: '', price: '', imageUrl: '', category: '' });
        setImagePreview(null);
      }, 300);
    } catch (error: any) {
      console.error("Add product error:", error);
      if (error.message?.includes('permission-denied')) {
        toast.error("Ошибка доступа: у вас нет прав на добавление товаров");
      } else {
        toast.error("Не удалось добавить товар. Попробуйте еще раз.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Добавить товар
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Новый товар</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Фото товара</Label>
            <div className="flex flex-col items-center gap-4 p-4 border-2 border-dashed rounded-lg bg-slate-50">
              {imagePreview ? (
                <div className="relative w-full aspect-square max-h-[200px] rounded-md overflow-hidden border">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => { setImagePreview(null); setFormData({...formData, imageUrl: ''}); }}
                    className="absolute top-2 right-2 p-1 bg-white/80 rounded-full shadow-sm hover:bg-white"
                  >
                    <X className="h-4 w-4 text-destructive" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center gap-2 cursor-pointer w-full py-4">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Нажмите, чтобы выбрать фото</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Название сорта</Label>
            <Input 
              id="name" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Напр. Appleblossom Rosebud"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Цена (₽)</Label>
            <Input 
              id="price" 
              type="number" 
              required 
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Категория</Label>
            <Input 
              id="category" 
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Зональная, Плющелистная..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea 
              id="description" 
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Особенности сорта, ухода..."
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Сохранить'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
