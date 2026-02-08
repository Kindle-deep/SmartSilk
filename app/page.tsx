// app/page.tsx
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { Sparkles, Globe, Tv, ShoppingBag, Compass, ArrowUpRight } from "lucide-react";

const MENU = [
  { title: "AI路线规划", icon: Sparkles, color: "bg-indigo-500", href: "/route" },
  { title: "各国非遗", icon: Globe, color: "bg-pink-500", href: "/heritage" },
  { title: "虚拟漫游", icon: Tv, color: "bg-cyan-500", href: "/virtual" },
  { title: "文创商城", icon: ShoppingBag, color: "bg-emerald-500", href: "/shop" },
];

const HERO_STATS = [
  { label: "精选非遗体验", value: "120+" },
  { label: "深度路线", value: "36" },
  { label: "实时讲解", value: "24/7" },
];

export default function HomePage() {
  return (
    <main className="space-y-10 pb-16">
      <section className="relative overflow-hidden rounded-b-[48px] bg-gradient-to-br from-amber-100 via-rose-100 to-sky-100 shadow-xl">
        <div className="absolute inset-0">
          <div className="absolute -top-10 right-6 h-48 w-48 rounded-full bg-rose-300/50 blur-3xl" />
          <div className="absolute bottom-0 left-10 h-56 w-56 rounded-full bg-sky-300/40 blur-3xl" />
          <div className="absolute top-1/3 right-12 h-24 w-24 rounded-full border border-white/40" />
        </div>

        <div className="relative px-6 pt-6">
          <div className="mb-8">
            <GlobalSearch />
          </div>

          <div className="space-y-4 text-center text-slate-900">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
              <Compass className="h-3 w-3" />
              Smart Silk Journey
            </span>
            <h1 className="text-3xl font-black leading-tight">
              AI 带你沉浸式探访东欧非遗之心
            </h1>
            <p className="text-sm text-slate-600">
              智能行程规划、沉浸式漫游与文创好物一次体验，解锁“丝韵”文化背后的故事。
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 px-4 sm:flex-row sm:justify-center">
            <a
              href="/route"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20"
            >
              立即定制行程
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </a>
            <a
              href="/virtual"
              className="inline-flex items-center justify-center rounded-full border border-slate-900/20 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-900 backdrop-blur"
            >
              先去虚拟漫游
            </a>
          </div>

          <div className="mt-10 flex flex-col gap-4 rounded-3xl border border-white/40 bg-white/50 p-4 backdrop-blur">
            <div className="grid grid-cols-3 text-center text-sm font-semibold text-slate-900">
              {HERO_STATS.map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-black">{stat.value}</div>
                  <div className="text-xs text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500">
              融合当地手工艺人、策展人和 AI 导航师，只为打造沉浸、真实的旅程体验。
            </p>
          </div>
        </div>
      </section>

      <div className="px-4 grid grid-cols-2 gap-4">
        {MENU.map((item) => (
          <a href={item.href} key={item.title} className="bg-white p-4 rounded-2xl shadow-sm flex flex-col items-center border border-slate-50 active:scale-95 transition-transform">
            <div className={`${item.color} p-3 rounded-2xl mb-2 text-white`}>
              <item.icon className="w-6 h-6" />
            </div>
            <span className="font-bold text-sm">{item.title}</span>
          </a>
        ))}
      </div>
    </main>
  );
}