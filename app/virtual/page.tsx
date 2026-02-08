import { VirtualCard } from "@/components/VirtualCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ROAM_DATA = [
  { id: 1, title: "卡莱梅格丹要塞", location: "塞尔维亚 · 贝尔格莱德", image: "/fortress.jpg" },
  { id: 2, title: "莫斯塔尔古桥", location: "波黑 · 莫斯塔尔", image: "/bridge.jpg" },
  { id: 3, title: "布拉格广场", location: "捷克 · 布拉格", image: "/prague.jpg" },
  { id: 4, title: "布达皇宫", location: "匈牙利 · 布达佩斯", image: "/palace.jpg" },
];

export default function VirtualPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24">
      {/* 头部装饰 */}
      <div className="relative h-40 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[#667eea]/20 blur-3xl rounded-full -top-20" />
        <h1 className="text-2xl font-black tracking-widest z-10">云游非遗 · 17国</h1>
      </div>

      <div className="px-6 space-y-6">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-slate-900 border-slate-800 w-full justify-start overflow-x-auto no-scrollbar">
            <TabsTrigger value="all">全部地标</TabsTrigger>
            <TabsTrigger value="history">历史建筑</TabsTrigger>
            <TabsTrigger value="culture">文化空间</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* 3D 卡片列表 - 修复了小程序列表平铺无深度感的问题 */}
        <div className="grid grid-cols-1 gap-6">
          {ROAM_DATA.map((item) => (
            <VirtualCard 
              key={item.id}
              title={item.title}
              location={item.location}
              image={item.image}
            />
          ))}
        </div>
      </div>

      {/* 模拟底部的 3D 提示器 */}
      <div className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-[#667eea] px-4 py-2 rounded-full text-xs font-bold animate-bounce shadow-[0_0_20px_rgba(102,126,234,0.5)]">
        滑动卡片体验视差
      </div>
    </div>
  );
}