import React from 'react';
import { Flower2, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';

export const BrandKit: React.FC = () => {
  return (
    <div className="space-y-12 p-8 bg-slate-50 min-h-screen pb-20">
      <div className="max-w-4xl mx-auto space-y-4">
        <h2 className="text-4xl font-serif font-bold text-slate-900">Брендинг для ВКонтакте</h2>
        <p className="text-slate-500 text-lg">
          Ниже представлены все необходимые изображения для прохождения модерации. 
          Сделайте скриншот каждой области и загрузите в панель управления VK Developers.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid gap-16">
        
        {/* SECTION: ICONS */}
        <section className="space-y-8">
          <div className="border-b pb-2">
            <h3 className="text-2xl font-serif font-bold">1. Иконки (Вкладка "Иконки")</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-end">
            {/* Universal 576x576 */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Универсальная (576x576)</p>
              <div id="icon-576" className="w-[288px] h-[288px] bg-primary rounded-[60px] flex items-center justify-center shadow-2xl shadow-primary/20">
                <Flower2 className="w-40 h-40 text-white" />
              </div>
            </div>

            {/* Catalog 278x278 */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Для каталога (278x278)</p>
              <div id="icon-278" className="w-[139px] h-[139px] bg-primary rounded-[30px] flex items-center justify-center shadow-xl shadow-primary/20">
                <Flower2 className="w-20 h-20 text-white" />
              </div>
            </div>

            {/* Small 150x150 */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Маленькая (150x150)</p>
              <div id="icon-150" className="w-[75px] h-[75px] bg-primary rounded-[15px] flex items-center justify-center shadow-lg shadow-primary/20">
                <Flower2 className="w-10 h-10 text-white" />
              </div>
            </div>

            {/* Favicon 32x32 */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Фавикон (32x32)</p>
              <div id="icon-32" className="w-[32px] h-[32px] bg-primary rounded-[6px] flex items-center justify-center">
                <Flower2 className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: SNIPPET */}
        <section className="space-y-8">
          <div className="border-b pb-2">
            <h3 className="text-2xl font-serif font-bold">2. Изображения (Большой сниппет)</h3>
          </div>
          
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Большой сниппет (1120x630)</p>
            <div 
              id="snippet-1120" 
              className="w-full max-w-[800px] aspect-[1120/630] bg-primary rounded-[40px] overflow-hidden relative flex items-center shadow-2xl"
            >
              <div className="absolute inset-0 opacity-10">
                <Flower2 className="absolute -top-20 -left-20 w-96 h-96 rotate-12 text-white" />
                <Flower2 className="absolute -bottom-20 -right-20 w-96 h-96 -rotate-12 text-white" />
              </div>
              <div className="relative z-10 p-16 text-white space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
                    <Flower2 className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-bold uppercase tracking-[0.3em] opacity-80">Pelargoniums of Russia</span>
                </div>
                <h4 className="text-6xl font-serif font-bold leading-none">
                  Коллекционные <br/>сорта с доставкой
                </h4>
                <div className="inline-flex items-center gap-3 px-8 py-4 bg-white text-primary rounded-full font-bold shadow-lg">
                  Открыть каталог
                </div>
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-black/20 to-transparent flex items-center justify-center">
                <Flower2 className="w-64 h-64 text-white/10 rotate-12" />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: SCREENSHOTS */}
        <section className="space-y-8">
          <div className="border-b pb-2">
            <h3 className="text-2xl font-serif font-bold">3. Скриншоты (600x1200)</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Screenshot 1: Home */}
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Главный экран</p>
              <div className="w-full aspect-[600/1200] bg-white rounded-[40px] border-8 border-slate-900 overflow-hidden relative shadow-2xl">
                <div className="p-6 space-y-8">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                      <Flower2 className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-serif font-bold text-sm text-slate-900">Пеларгонии России</span>
                  </div>
                  <div className="space-y-4">
                    <h5 className="text-3xl font-serif font-bold leading-tight">Искусство <br/>совершенства</h5>
                    <div className="h-40 bg-slate-100 rounded-2xl flex items-center justify-center">
                      <Flower2 className="w-20 h-20 text-primary/20" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="aspect-square bg-slate-50 rounded-xl border p-2 flex flex-col justify-between">
                        <div className="w-full h-2/3 bg-slate-100 rounded-lg" />
                        <div className="h-2 w-full bg-slate-200 rounded" />
                        <div className="h-2 w-1/2 bg-primary/20 rounded" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Screenshot 2: Features */}
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Преимущества</p>
              <div className="w-full aspect-[600/1200] bg-primary rounded-[40px] border-8 border-slate-900 overflow-hidden relative shadow-2xl flex flex-col justify-center p-10 text-white">
                <div className="space-y-12">
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                      <ShieldCheck className="w-8 h-8" />
                    </div>
                    <h5 className="text-2xl font-bold">Гарантия сорта</h5>
                    <p className="text-white/60">Только проверенные и здоровые растения из частной коллекции.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                      <Truck className="w-8 h-8" />
                    </div>
                    <h5 className="text-2xl font-bold">Бережная доставка</h5>
                    <p className="text-white/60">Надежная упаковка, гарантирующая сохранность при пересылке.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <h5 className="text-2xl font-bold">Удобный заказ</h5>
                    <p className="text-white/60">Выбирайте и заказывайте прямо внутри ВКонтакте.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Screenshot 3: Catalog */}
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Каталог</p>
              <div className="w-full aspect-[600/1200] bg-white rounded-[40px] border-8 border-slate-900 overflow-hidden relative shadow-2xl">
                <div className="p-6 space-y-6">
                  <h5 className="text-2xl font-serif font-bold">Наш ассортимент</h5>
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex gap-4 p-3 border rounded-2xl">
                        <div className="w-20 h-20 bg-slate-100 rounded-xl" />
                        <div className="flex-1 space-y-2 py-1">
                          <div className="h-3 w-3/4 bg-slate-200 rounded" />
                          <div className="h-3 w-1/2 bg-slate-100 rounded" />
                          <div className="h-6 w-16 bg-primary/10 rounded-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 p-6 bg-slate-50 rounded-3xl border border-dashed text-center">
                    <Flower2 className="w-12 h-12 text-primary/20 mx-auto mb-2" />
                    <p className="text-xs text-slate-400">Более 50 редких сортов</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
