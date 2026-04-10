import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { Product } from './types';
import { useAuth } from './AuthContext';
import { AddProductDialog } from './components/AddProductDialog';
import { ProductCard } from './components/ProductCard';
import { Button } from '@/components/ui/button';
import { Loader2, LogIn, LogOut, Flower2, ShoppingBag } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  const { user, loading: authLoading, isAdmin, login, logout } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(productsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching products:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-full">
                <Flower2 className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-xl font-bold tracking-tight hidden sm:block">
                Пеларгонии <span className="text-primary">России</span>
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {isAdmin && <AddProductDialog />}
              
              {!authLoading && (
                user ? (
                  <Button variant="ghost" size="sm" onClick={logout} className="gap-2">
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Выйти</span>
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={login} className="gap-2">
                    <LogIn className="h-4 w-4" />
                    Войти
                  </Button>
                )
              )}
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="bg-white border-b py-12 px-4">
          <div className="container mx-auto text-center max-w-2xl">
            <h2 className="text-3xl font-extrabold mb-4 sm:text-4xl">
              Коллекционные пеларгонии с доставкой
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Заказывайте лучшие сорта напрямую через ВКонтакте. Быстрая доставка по всей России.
            </p>
            <div className="flex items-center justify-center gap-8 text-sm font-medium text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-primary" />
                <span>Прямой заказ</span>
              </div>
              <div className="flex items-center gap-2">
                <Flower2 className="h-4 w-4 text-primary" />
                <span>Сортовые растения</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 flex-grow">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-muted-foreground animate-pulse">Загружаем каталог...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} isAdmin={isAdmin} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed">
              <Flower2 className="h-16 w-16 mx-auto text-muted-foreground/20 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Каталог пока пуст</h3>
              <p className="text-muted-foreground">
                {isAdmin ? 'Начните с добавления первого товара!' : 'Заходите позже, мы скоро добавим новые сорта.'}
              </p>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t py-8 px-4 mt-auto">
          <div className="container mx-auto text-center">
            <p className="text-sm text-muted-foreground">
              © 2026 Пеларгонии России. Все права защищены.
            </p>
          </div>
        </footer>

        <Toaster position="top-center" />
      </div>
    </ErrorBoundary>
  );
}
