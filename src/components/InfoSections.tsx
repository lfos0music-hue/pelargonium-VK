import React from 'react';
import { Truck, Heart, ShieldCheck, Sprout, Sun, Droplets, Thermometer } from 'lucide-react';

export const Features: React.FC = () => {
  const features = [
    {
      icon: <Sprout className="h-6 w-6" />,
      title: "Здоровые саженцы",
      description: "Каждое растение проходит тщательный отбор и подготовку перед отправкой."
    },
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: "Гарантия сорта",
      description: "Мы гарантируем 100% соответствие заявленному сорту из нашей коллекции."
    },
    {
      icon: <Truck className="h-6 w-6" />,
      title: "Бережная доставка",
      description: "Специальная упаковка защищает цветы от повреждений и перепадов температур."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="flex flex-col items-center text-center p-6 rounded-3xl hover:bg-slate-50 transition-colors">
              <div className="bg-primary/10 p-4 rounded-2xl text-primary mb-4">
                {f.icon}
              </div>
              <h3 className="text-lg font-bold mb-2 font-serif">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const AboutSection: React.FC = () => {
  return (
    <section className="py-20 bg-slate-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 relative">
            <div className="relative z-10 rounded-[3rem] overflow-hidden bg-white p-2 shadow-2xl border border-slate-100">
              <img 
                src="https://images.unsplash.com/photo-1516706562676-0f39a235ee91?auto=format&fit=crop&q=80&w=1000&h=1000" 
                alt="Pelargoniums in pots" 
                className="w-full h-full object-cover rounded-[2.5rem]"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-primary rounded-full -z-0 opacity-10 blur-3xl"></div>
            <div className="absolute -top-10 -left-10 w-72 h-72 bg-accent rounded-full -z-0 opacity-10 blur-3xl"></div>
          </div>
          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold leading-tight">
              Наша страсть — <br/>
              <span className="text-primary italic">красота в каждом лепестке</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Мы занимаемся коллекционированием и выращиванием редких сортов пеларгоний уже более 10 лет. Наша миссия — сделать эти удивительные растения доступными для каждого любителя цветов в России.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Каждый цветок в нашем каталоге выращен с любовью и вниманием в нашей частной оранжерее. Мы знаем всё о характере каждого сорта и с радостью делимся этим опытом с вами.
            </p>
            <div className="pt-4 flex items-center gap-4">
              <div className="flex -space-x-3">
                {[
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100",
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100",
                  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100"
                ].map((url, i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                    <img src={url} alt="Customer" referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                Более 500 довольных клиентов
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const CareTips: React.FC = () => {
  const tips = [
    {
      icon: <Sun className="h-5 w-5" />,
      title: "Свет",
      text: "Пеларгонии любят яркий свет, но берегите их от полуденного солнца."
    },
    {
      icon: <Droplets className="h-5 w-5" />,
      title: "Полив",
      text: "Поливайте умеренно, когда верхний слой почвы подсохнет. Не заливайте!"
    },
    {
      icon: <Thermometer className="h-5 w-5" />,
      title: "Температура",
      text: "Оптимально 18-24°C. Зимой любят прохладу, но не ниже 10°C."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-serif font-bold mb-4">Секреты ухода</h2>
          <p className="text-muted-foreground">Простые правила, которые помогут вашим цветам радовать вас долгим и пышным цветением.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tips.map((tip, i) => (
            <div key={i} className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 hover:shadow-lg transition-all group">
              <div className="bg-white w-12 h-12 rounded-2xl flex items-center justify-center text-primary shadow-sm mb-6 group-hover:scale-110 transition-transform">
                {tip.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 font-serif">{tip.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{tip.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const DeliveryInfo: React.FC = () => {
  return (
    <section className="py-20 bg-primary text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 opacity-10 translate-x-1/4 -translate-y-1/4">
        <Truck className="w-96 h-96 rotate-12" />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-6">Доставка по всей России</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="bg-white/20 p-3 rounded-xl h-fit">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Надежная упаковка</h4>
                  <p className="text-white/70 text-sm">Используем многослойный картон и утеплитель в холодное время года.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-white/20 p-3 rounded-xl h-fit">
                  <Truck className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Почта и СДЭК</h4>
                  <p className="text-white/70 text-sm">Отправляем проверенными службами с возможностью отслеживания посылки.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 bg-white/10 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/20">
            <h3 className="text-xl font-bold mb-4">Как сделать заказ?</h3>
            <ol className="space-y-4 text-sm">
              <li className="flex gap-3">
                <span className="bg-white text-primary w-6 h-6 rounded-full flex items-center justify-center font-bold shrink-0">1</span>
                <span>Выберите понравившиеся сорта в каталоге выше.</span>
              </li>
              <li className="flex gap-3">
                <span className="bg-white text-primary w-6 h-6 rounded-full flex items-center justify-center font-bold shrink-0">2</span>
                <span>Нажмите кнопку «Заказать» — откроется диалог с нами в ВК.</span>
              </li>
              <li className="flex gap-3">
                <span className="bg-white text-primary w-6 h-6 rounded-full flex items-center justify-center font-bold shrink-0">3</span>
                <span>Мы уточним наличие и рассчитаем стоимость доставки.</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};
