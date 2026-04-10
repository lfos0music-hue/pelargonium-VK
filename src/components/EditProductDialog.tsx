import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/src/firebase';
import { handleFirestoreError, OperationType } from '@/src/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit, Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { resizeImage } from '@/src/lib/imageUtils';
import { Product } from '@/src/types';

interface EditProductDialogProps {
  product: Product;
}

export const EditProductDialog: React.FC<EditProductDialogProps> = ({ product }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(product.imageUrl);
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description || '',
    price: product.price.toString(),
    imageUrl: product.imageUrl,
    category: product.category || '',
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
    setLoading(true);

    try {
      const docRef = doc(db, 'products', product.id!);
      await updateDoc(docRef, {
        ...formData,
        price: parseFloat(formData.price),
      });
      
      toast.success('Товар обновлен');
      setOpen(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `products/${product.id}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="outline" size="icon" className="hover:bg-primary/10">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Редактировать товар</DialogTitle>
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
            <Label htmlFor="edit-name">Название сорта</Label>
            <Input 
              id="edit-name" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-price">Цена (₽)</Label>
            <Input 
              id="edit-price" 
              type="number" 
              required 
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-category">Категория</Label>
            <Input 
              id="edit-category" 
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-description">Описание</Label>
            <Textarea 
              id="edit-description" 
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Сохранить изменения'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
