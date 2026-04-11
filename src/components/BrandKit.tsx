import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Flower2 } from 'lucide-react';

export const BrandKit: React.FC = () => {
  return (
    <div className="space-y-8 p-6 bg-background min-h-screen">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-serif font-bold text-primary">Дизайн-кит для ВК</h2>
        <p className="text-muted-foreground">
          Используйте эти шаблоны для оформления приложения в панели VK Developers. 
          Сделайте скриншот нужной области для загрузки.
        </p>
      </div>

      <div className="grid gap-8">
        {/* Icon 112x112 */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold">Иконка (112x112)</h3>
          <div className="flex items-center gap-6">
            <div 
              id="icon-112"
              className="w-[112px] h-[112px] bg-primary rounded-2xl flex items-center justify-center shadow-lg overflow-hidden"
            >
              <Flower2 className="w-16 h-16 text-white" />
            </div>
            <div className="text-sm text-muted-foreground">
              Минималистичная иконка для каталога.
            </div>
          </div>
        </section>

        {/* Banner 278x174 */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold">Баннер (278x174)</h3>
          <div className="flex flex-col gap-4">
            <div 
              id="banner-278"
              className="w-[278px] h-[174px] bg-white border rounded-xl shadow-md overflow-hidden flex flex-col items-center justify-center p-4 text-center relative"
            >
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <Flower2 className="w-40 h-40 -rotate-12 -translate-x-10 -translate-y-10" />
              </div>
              <Flower2 className="w-10 h-10 text-primary mb-2" />
              <h4 className="font-serif text-xl font-bold leading-tight">Пеларгонии<br/><span className="text-primary">России</span></h4>
            </div>
            <div className="text-sm text-muted-foreground">
              Малый баннер для карточки приложения.
            </div>
          </div>
        </section>

        {/* Large Banner 576x288 */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold">Большой баннер (576x288)</h3>
          <div className="flex flex-col gap-4">
            <div 
              id="banner-576"
              className="w-[576px] h-[288px] bg-primary rounded-3xl shadow-xl overflow-hidden flex relative"
            >
              <div className="flex-1 flex flex-col justify-center p-12 text-white z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Flower2 className="w-6 h-6" />
                  <span className="text-xs uppercase tracking-widest font-medium opacity-80">Официальный магазин</span>
                </div>
                <h4 className="font-serif text-5xl font-bold leading-none mb-6">Пеларгонии<br/>России</h4>
                <div className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary rounded-full text-sm font-bold">
                  Перейти в каталог
                </div>
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-white/10 backdrop-blur-sm flex items-center justify-center">
                 <Flower2 className="w-64 h-64 text-white/20 rotate-12" />
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Главный баннер для страницы приложения.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
