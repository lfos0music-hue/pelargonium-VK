import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { Product } from './types';
import { useAuth } from './AuthContext';
import { AddProductDialog } from './components/AddProductDialog';
import { AdminPanel } from './components/AdminPanel';
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
        <header className="sticky top-0 z-50 w-full border-b bg-white/60 backdrop-blur-lg">
          <div className="container mx-auto px-4 pr-24 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2.5 rounded-2xl shadow-sm rotate-3">
                <Flower2 className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl font-serif font-bold leading-none">
                  Пеларгонии <span className="text-primary italic">России</span>
                </h1>
                <span className="text-[10px] uppercase tracking-[0.2em] font-medium opacity-60">Коллекционные сорта</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isAdmin && (
                <div className="flex items-center gap-2 mr-2">
                  <AdminPanel />
                  <AddProductDialog />
                </div>
              )}
              
              {!authLoading && (
                user ? (
                  <Button variant="ghost" size="sm" onClick={logout} className="gap-2 rounded-full px-4">
                    <LogOut className="h-4 w-4" />
                    Выйти
                  </Button>
                ) : (
                  <Button variant="default" size="default" onClick={login} className="gap-2 rounded-full px-8 font-bold shadow-lg shadow-primary/20">
                    <LogIn className="h-4 w-4" />
                    Войти
                  </Button>
                )
              )}
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <Flower2 className="absolute -top-20 -left-20 w-96 h-96 rotate-12" />
            <Flower2 className="absolute -bottom-20 -right-20 w-96 h-96 -rotate-12" />
          </div>
          <div className="container mx-auto text-center max-w-3xl relative z-10">
            <h2 className="text-4xl font-serif font-bold mb-6 sm:text-6xl leading-[1.1]">
              Искусство выращивания <br/>
              <span className="text-primary italic">совершенства</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Откройте для себя мир редких и коллекционных пеларгоний. Бережная доставка из сердца России в ваш дом.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold uppercase tracking-widest text-primary/60">
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>Прямой заказ</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
                <Flower2 className="h-3.5 w-3.5" />
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
