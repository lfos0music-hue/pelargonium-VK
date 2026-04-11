import React from 'react';
import { Product } from '@/src/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Trash2, Package, Edit } from 'lucide-react';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/src/firebase';
import { handleFirestoreError, OperationType } from '@/src/lib/utils';
import { toast } from 'sonner';
import { EditProductDialog } from './EditProductDialog';

import bridge from '@vkontakte/vk-bridge';

interface ProductCardProps {
  product: Product;
  isAdmin: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, isAdmin }) => {
  const handleBuy = () => {
    // ВАЖНО: Используем ID вашей группы из ссылки
    const groupId = 'pelargoniuman'; 
    const message = encodeURIComponent(`Здравствуйте! Хочу купить пеларгонию: ${product.name}`);
    const vkLink = `https://vk.me/${groupId}?ref=catalog&ref_source=${message}`;
    
    (bridge.send as any)('VKWebAppOpenURL', { url: vkLink });
  };

  const handleDelete = async () => {
    if (!confirm(`Вы уверены, что хотите удалить ${product.name}?`)) return;
    
    try {
      await deleteDoc(doc(db, 'products', product.id!));
      toast.success('Товар удален');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${product.id}`);
    }
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full group transition-all hover:shadow-xl border-none bg-white/80 backdrop-blur-sm rounded-[2rem]">
      <div className="relative aspect-square overflow-hidden bg-muted m-2 rounded-[1.5rem]">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <Package className="h-12 w-12 opacity-20" />
          </div>
        )}
        {product.category && (
          <Badge className="absolute top-3 left-3 bg-white/90 text-primary hover:bg-white backdrop-blur-md border-none px-3 py-1 text-[10px] uppercase tracking-wider font-bold">
            {product.category}
          </Badge>
        )}
      </div>
      <CardHeader className="p-6 pb-2">
        <CardTitle className="text-xl font-serif font-bold line-clamp-1 group-hover:text-primary transition-colors">
          {product.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-6 font-medium leading-relaxed">
          {product.description || 'Нет описания'}
        </p>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-serif font-bold text-primary">
            {product.price}
          </span>
          <span className="text-sm font-serif font-bold text-primary opacity-60">₽</span>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0 gap-3">
        <Button className="flex-1 gap-2 rounded-full h-12 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all" onClick={handleBuy}>
          <MessageCircle className="h-4 w-4" />
          Заказать
        </Button>
        {isAdmin && (
          <div className="flex gap-2">
            <EditProductDialog product={product} />
            <Button variant="outline" size="icon" className="text-destructive hover:bg-destructive/10" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
