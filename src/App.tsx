import { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { Product } from './types';
import { useAuth } from './AuthContext';
import { AddProductDialog } from './components/AddProductDialog';
import { AdminPanel } from './components/AdminPanel';
import { ProductCard } from './components/ProductCard';
import { Features, AboutSection, CareTips, DeliveryInfo } from './components/InfoSections';
import { Button } from '@/components/ui/button';
import { Loader2, LogIn, LogOut, Flower2, ShoppingBag, ChevronDown } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  const { user, loading: authLoading, isAdmin, login, logout } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const catalogRef = useRef<HTMLElement>(null);
  const deliveryRef = useRef<HTMLDivElement>(null);

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToDelivery = () => {
    deliveryRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
      <div className="flex flex-col w-full bg-slate-50">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-xl">
          <div className="container mx-auto px-4 h-16 sm:h-24 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <div className="bg-primary p-2 sm:p-3 rounded-2xl shadow-lg shadow-primary/20 rotate-3">
                <Flower2 className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl sm:text-3xl font-serif font-bold leading-none tracking-tight">
                  Пеларгонии <span className="text-primary italic">России</span>
                </h1>
                <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.2em] font-bold opacity-50 mt-1">Коллекционные сорта</span>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-3">
              {isAdmin && (
                <div className="hidden sm:flex items-center gap-2 bg-slate-100 p-1 rounded-2xl">
                  <AdminPanel />
                  <AddProductDialog />
                </div>
              )}
              
              {!authLoading && (
                user ? (
                  <Button variant="ghost" size="sm" onClick={logout} className="h-9 sm:h-11 gap-2 rounded-xl px-3 sm:px-5 text-sm font-medium hover:bg-red-50 hover:text-red-600 transition-colors">
                    <LogOut className="h-4 w-4" />
                    <span className="hidden xs:inline">Выйти</span>
                  </Button>
                ) : (
                  <Button variant="default" size="default" onClick={login} className="h-10 sm:h-12 gap-2 rounded-2xl px-5 sm:px-8 font-bold shadow-xl shadow-primary/25 hover:scale-105 active:scale-95 transition-all">
                    <LogIn className="h-4 w-4" />
                    <span>Войти</span>
                  </Button>
                )
              )}
            </div>
          </div>
          {/* Mobile Admin Bar */}
          {isAdmin && (
            <div className="sm:hidden flex items-center justify-center gap-4 py-2 bg-slate-50 border-t">
              <AdminPanel />
              <AddProductDialog />
            </div>
          )}
        </header>

        {/* Hero Section */}
        <section className="relative py-12 sm:py-20 px-4 overflow-hidden">
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
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <button 
                onClick={scrollToDelivery}
                className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-primary hover:text-white rounded-2xl shadow-md hover:shadow-xl transition-all group font-bold text-sm"
              >
                <ShoppingBag className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>Прямой заказ</span>
              </button>
              <button 
                onClick={scrollToCatalog}
                className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-primary hover:text-white rounded-2xl shadow-md hover:shadow-xl transition-all group font-bold text-sm"
              >
                <Flower2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>Сортовые растения</span>
              </button>
            </div>
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce opacity-20 hidden sm:block">
            <ChevronDown className="h-8 w-8" />
          </div>
        </section>

        <Features />
        <AboutSection />

        {/* Main Content */}
        <main ref={catalogRef} className="container mx-auto px-4 py-16 flex-grow scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-serif font-bold mb-4">Наш каталог</h2>
            <p className="text-muted-foreground text-sm">Выберите свой идеальный сорт из нашей актуальной коллекции.</p>
          </div>
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

        <CareTips />
        <div ref={deliveryRef} className="scroll-mt-24">
          <DeliveryInfo />
        </div>

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
