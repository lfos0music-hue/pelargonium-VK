import React, { useState } from 'react';
import { Flower2, ShoppingBag, ShieldCheck, Truck, Download, Loader2 } from 'lucide-react';
import { toPng } from 'html-to-image';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const BrandKit: React.FC = () => {
  const [downloading, setDownloading] = useState<string | null>(null);

  const downloadImage = async (id: string, fileName: string, width: number, height: number) => {
    const element = document.getElementById(`${id}-capture`);
    if (!element) return;

    setDownloading(id);
    try {
      // Ensure the element is visible for capture but stays off-screen
      const dataUrl = await toPng(element, {
        width: width,
        height: height,
        pixelRatio: 1,
        skipAutoScale: true,
      });
      
      const link = document.createElement('a');
      link.download = `${fileName}.png`;
      link.href = dataUrl;
      link.click();
      toast.success(`Файл ${fileName}.png скачан`);
    } catch (err) {
      console.error('Download failed', err);
      toast.error('Не удалось скачать изображение');
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="space-y-12 p-8 bg-slate-50 min-h-screen pb-20 overflow-x-hidden">
      {/* HIDDEN CAPTURE TARGETS - These are rendered at 1:1 scale off-screen */}
      <div className="fixed top-[-5000px] left-[-5000px] pointer-events-none">
        {/* Icon 576 */}
        <div id="icon-576-capture" style={{ width: '576px', height: '576px' }} className="bg-[#15803d] flex items-center justify-center">
          <Flower2 size={380} color="white" strokeWidth={1.5} />
        </div>
        
        {/* Icon 278 */}
        <div id="icon-278-capture" style={{ width: '278px', height: '278px' }} className="bg-[#15803d] flex items-center justify-center">
          <Flower2 size={180} color="white" strokeWidth={1.5} />
        </div>

        {/* Icon 96 (Splash Screen) */}
        <div id="icon-96-capture" style={{ width: '96px', height: '96px' }} className="bg-[#15803d] flex items-center justify-center">
          <Flower2 size={64} color="white" strokeWidth={1.5} />
        </div>

        {/* Icon 32 (Favicon) */}
        <div id="icon-32-capture" style={{ width: '32px', height: '32px' }} className="bg-[#15803d] flex items-center justify-center">
          <Flower2 size={24} color="white" strokeWidth={1.5} />
        </div>

        {/* Snippet 1120x630 */}
        <div id="snippet-1120-capture" style={{ width: '1120px', height: '630px' }} className="bg-[#15803d] flex items-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <Flower2 size={500} className="absolute -top-20 -left-20 rotate-12 text-white" />
            <Flower2 size={500} className="absolute -bottom-20 -right-20 -rotate-12 text-white" />
          </div>
          <div className="relative z-10 p-20 text-white space-y-8 w-full">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
                <Flower2 size={40} />
              </div>
              <span className="text-2xl font-bold uppercase tracking-[0.4em] opacity-80">Pelargoniums of Russia</span>
            </div>
            <h4 className="text-9xl font-serif font-bold leading-tight">
              Коллекционные <br/>сорта
            </h4>
            <div className="inline-flex items-center gap-4 px-12 py-6 bg-white text-[#15803d] rounded-full text-3xl font-bold shadow-2xl">
              Открыть каталог
            </div>
          </div>
        </div>

        {/* Screenshot 1: 600x1200 */}
        <div id="screen-1-capture" style={{ width: '600px', height: '1200px' }} className="bg-white text-slate-900 p-12 flex flex-col gap-16">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-[#15803d] rounded-3xl flex items-center justify-center">
              <Flower2 size={48} color="white" />
            </div>
            <span className="font-serif font-bold text-4xl">Пеларгонии России</span>
          </div>
          <div className="space-y-8">
            <h5 className="text-8xl font-serif font-bold leading-tight">Искусство <br/>цветения</h5>
            <div className="h-[400px] bg-slate-50 rounded-[60px] flex items-center justify-center border-2 border-dashed border-slate-200">
              <Flower2 size={200} className="text-[#15803d]/10" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-square bg-slate-50 rounded-[40px] border-2 p-6 flex flex-col justify-between">
                <div className="w-full h-2/3 bg-slate-100 rounded-3xl" />
                <div className="h-4 w-full bg-slate-200 rounded-full" />
                <div className="h-4 w-1/2 bg-[#15803d]/20 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Screenshot 2: 600x1200 (Features) */}
        <div id="screen-2-capture" style={{ width: '600px', height: '1200px' }} className="bg-[#15803d] text-white p-16 flex flex-col justify-center gap-20">
          <div className="space-y-8">
            <div className="w-32 h-32 bg-white/20 rounded-[40px] flex items-center justify-center">
              <ShieldCheck size={64} />
            </div>
            <h5 className="text-6xl font-bold">Гарантия сорта</h5>
            <p className="text-3xl text-white/70 leading-relaxed">Только проверенные и здоровые растения из частной коллекции.</p>
          </div>
          <div className="space-y-8">
            <div className="w-32 h-32 bg-white/20 rounded-[40px] flex items-center justify-center">
              <Truck size={64} />
            </div>
            <h5 className="text-6xl font-bold">Бережная доставка</h5>
            <p className="text-3xl text-white/70 leading-relaxed">Надежная упаковка, гарантирующая сохранность при пересылке по всей России.</p>
          </div>
          <div className="space-y-8">
            <div className="w-32 h-32 bg-white/20 rounded-[40px] flex items-center justify-center">
              <ShoppingBag size={64} />
            </div>
            <h5 className="text-6xl font-bold">Удобный заказ</h5>
            <p className="text-3xl text-white/70 leading-relaxed">Выбирайте любимые сорта и оформляйте заказ прямо в ВК.</p>
          </div>
        </div>

        {/* Screenshot 3: 600x1200 (Catalog) */}
        <div id="screen-3-capture" style={{ width: '600px', height: '1200px' }} className="bg-white text-slate-900 p-12 flex flex-col gap-12">
          <h5 className="text-6xl font-serif font-bold">Наш ассортимент</h5>
          <div className="space-y-8">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex gap-8 p-8 border-2 border-slate-100 rounded-[50px] items-center">
                <div className="w-32 h-32 bg-slate-50 rounded-[32px] flex items-center justify-center">
                  <Flower2 size={48} className="text-[#15803d]/20" />
                </div>
                <div className="flex-1 space-y-4">
                  <div className="h-6 w-3/4 bg-slate-200 rounded-full" />
                  <div className="h-6 w-1/2 bg-slate-100 rounded-full" />
                  <div className="h-10 w-32 bg-[#15803d]/10 rounded-full" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-auto p-12 bg-slate-50 rounded-[60px] text-center space-y-4 border-2 border-dashed border-slate-200">
            <Flower2 size={64} className="text-[#15803d]/20 mx-auto" />
            <p className="text-2xl text-slate-400 font-medium">Более 100 редких сортов <br/>в вашей коллекции</p>
          </div>
        </div>
      </div>

      {/* VISUAL UI FOR THE USER */}
      <div className="max-w-4xl mx-auto space-y-4">
        <h2 className="text-4xl font-serif font-bold text-slate-900">Брендинг для ВКонтакте</h2>
        <p className="text-slate-500 text-lg">
          Нажмите кнопку «Скачать PNG». Файлы будут сохранены с **идеальными размерами**, 
          которые требует модерация ВК. Вам не нужно ничего обрезать!
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid gap-16">
        {/* ICONS PREVIEW */}
        <section className="space-y-8">
          <div className="border-b pb-2">
            <h3 className="text-2xl font-serif font-bold">1. Иконки</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Универсальная (576x576)</p>
                <Button onClick={() => downloadImage('icon-576', 'vk_icon_576', 576, 576)} disabled={!!downloading}>
                  {downloading === 'icon-576' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
                  Скачать PNG
                </Button>
              </div>
              <div className="w-48 h-48 bg-[#15803d] rounded-[40px] flex items-center justify-center shadow-xl">
                <Flower2 size={100} color="white" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Для каталога (278x278)</p>
                <Button onClick={() => downloadImage('icon-278', 'vk_icon_278', 278, 278)} disabled={!!downloading}>
                  {downloading === 'icon-278' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
                  Скачать PNG
                </Button>
              </div>
              <div className="w-32 h-32 bg-[#15803d] rounded-3xl flex items-center justify-center shadow-lg">
                <Flower2 size={60} color="white" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Экран запуска (96x96)</p>
                <Button onClick={() => downloadImage('icon-96', 'vk_icon_96', 96, 96)} disabled={!!downloading}>
                  {downloading === 'icon-96' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
                  Скачать PNG
                </Button>
              </div>
              <div className="w-24 h-24 bg-[#15803d] rounded-2xl flex items-center justify-center shadow-md">
                <Flower2 size={40} color="white" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Фавикон (32x32)</p>
                <Button onClick={() => downloadImage('icon-32', 'vk_icon_32', 32, 32)} disabled={!!downloading}>
                  {downloading === 'icon-32' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
                  Скачать PNG
                </Button>
              </div>
              <div className="w-12 h-12 bg-[#15803d] rounded-lg flex items-center justify-center shadow-sm">
                <Flower2 size={20} color="white" />
              </div>
            </div>
          </div>
        </section>

        {/* SNIPPET PREVIEW */}
        <section className="space-y-8">
          <div className="border-b pb-2">
            <h3 className="text-2xl font-serif font-bold">2. Большой сниппет</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between max-w-[600px]">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Сниппет (1120x630)</p>
              <Button onClick={() => downloadImage('snippet-1120', 'vk_snippet_1120', 1120, 630)} disabled={!!downloading}>
                {downloading === 'snippet-1120' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
                Скачать PNG
              </Button>
            </div>
            <div className="w-full max-w-[600px] aspect-[1120/630] bg-[#15803d] rounded-[32px] flex items-center p-8 relative overflow-hidden shadow-2xl">
              <div className="relative z-10 text-white space-y-4">
                <div className="flex items-center gap-2 opacity-80">
                  <Flower2 size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Pelargoniums</span>
                </div>
                <h4 className="text-3xl font-serif font-bold leading-tight">Коллекционные сорта</h4>
                <div className="px-4 py-2 bg-white text-[#15803d] rounded-full text-xs font-bold inline-block">Каталог</div>
              </div>
            </div>
          </div>
        </section>

        {/* SCREENSHOTS PREVIEW */}
        <section className="space-y-8">
          <div className="border-b pb-2">
            <h3 className="text-2xl font-serif font-bold">3. Скриншоты</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <Button className="w-full" variant="outline" onClick={() => downloadImage('screen-1', 'vk_screen_1', 600, 1200)} disabled={!!downloading}>
                {downloading === 'screen-1' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
                Скачать Скрин 1
              </Button>
              <div className="aspect-[600/1200] bg-white border-4 border-slate-200 rounded-2xl shadow-sm flex items-center justify-center">
                <span className="text-slate-300 text-xs">Главный экран</span>
              </div>
            </div>
            <div className="space-y-4">
              <Button className="w-full" variant="outline" onClick={() => downloadImage('screen-2', 'vk_screen_2', 600, 1200)} disabled={!!downloading}>
                {downloading === 'screen-2' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
                Скачать Скрин 2
              </Button>
              <div className="aspect-[600/1200] bg-[#15803d] rounded-2xl shadow-sm flex items-center justify-center">
                <span className="text-white/30 text-xs">Преимущества</span>
              </div>
            </div>
            <div className="space-y-4">
              <Button className="w-full" variant="outline" onClick={() => downloadImage('screen-3', 'vk_screen_3', 600, 1200)} disabled={!!downloading}>
                {downloading === 'screen-3' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
                Скачать Скрин 3
              </Button>
              <div className="aspect-[600/1200] bg-white border-4 border-slate-200 rounded-2xl shadow-sm flex items-center justify-center">
                <span className="text-slate-300 text-xs">Каталог</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: MODERATION CHECKLIST */}
        <section className="space-y-8">
          <div className="border-b pb-2">
            <h3 className="text-2xl font-serif font-bold">5. Чек-лист перед модерацией</h3>
          </div>
          <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
            <div className="p-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                  <div className="w-2 h-2 rounded-full bg-green-600" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold">Вкладка "Отображение"</p>
                  <p className="text-sm text-slate-500">Установлен размер 1000x800 и режим "Над окном".</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                  <div className="w-2 h-2 rounded-full bg-green-600" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold">Вкладка "Оформление"</p>
                  <p className="text-sm text-slate-500">Загружены все 4 иконки, сниппет и 3 скриншота из этого раздела.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                  <div className="w-2 h-2 rounded-full bg-green-600" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold">Вкладка "Информация"</p>
                  <p className="text-sm text-slate-500">Заполнено название, описание и выбрана категория "Магазины".</p>
                </div>
              </div>
              <div className="pt-6 border-t">
                <p className="text-sm font-medium text-slate-900">После этого перейдите в раздел "Модерация" и нажмите кнопку "Отправить".</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
