import React, { useState } from 'react';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '@/src/firebase';
import { handleFirestoreError, OperationType } from '@/src/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const AddProductDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    category: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const path = 'products';
      await addDoc(collection(db, path), {
        ...formData,
        price: parseFloat(formData.price),
        inStock: true,
        createdAt: Timestamp.now(),
      });
      
      toast.success('Товар успешно добавлен!');
      setOpen(false);
      setFormData({ name: '', description: '', price: '', imageUrl: '', category: '' });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'products');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Добавить товар
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Новый товар</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
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
            <Label htmlFor="imageUrl">Ссылка на фото</Label>
            <Input 
              id="imageUrl" 
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://..."
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
