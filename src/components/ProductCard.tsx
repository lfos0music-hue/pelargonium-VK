import React from 'react';
import { Product } from '@/src/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Trash2, Package } from 'lucide-react';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/src/firebase';
import { handleFirestoreError, OperationType } from '@/src/lib/utils';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  isAdmin: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, isAdmin }) => {
  const handleBuy = () => {
    // VK Group messages link pattern: https://vk.com/im?sel=-GROUP_ID
    // Since we don't have the specific Group ID yet, we'll use a placeholder or generic VK link
    // The user can configure this later.
    const vkLink = `https://vk.com/im?media=&sel=-225432123&msg_body=Здравствуйте! Хочу купить пеларгонию: ${product.name}`;
    window.open(vkLink, '_blank');
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
    <Card className="overflow-hidden flex flex-col h-full group transition-all hover:shadow-md">
      <div className="relative aspect-square overflow-hidden bg-muted">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="object-cover w-full h-full transition-transform group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <Package className="h-12 w-12 opacity-20" />
          </div>
        )}
        {product.category && (
          <Badge className="absolute top-2 left-2 bg-white/80 text-black hover:bg-white/90 backdrop-blur-sm">
            {product.category}
          </Badge>
        )}
      </div>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {product.description || 'Нет описания'}
        </p>
        <div className="text-xl font-bold text-primary">
          {product.price} ₽
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 gap-2">
        <Button className="flex-1 gap-2" onClick={handleBuy}>
          <MessageCircle className="h-4 w-4" />
          Купить
        </Button>
        {isAdmin && (
          <Button variant="outline" size="icon" className="text-destructive hover:bg-destructive/10" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
