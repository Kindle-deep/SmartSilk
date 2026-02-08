import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, ShoppingCart } from "lucide-react";

const PRODUCTS = [
  { id: 1, name: "咖啡文化体验课", price: 299, originalPrice: 399, tag: "热销", image: "/coffee.jpg" },
  { id: 2, name: "意大利小提琴制作工坊", price: 599, originalPrice: 799, tag: "独家", image: "/violin.jpg" },
  { id: 3, name: "捷克水晶手工杯", price: 158, originalPrice: 220, tag: "精选", image: "/crystal.jpg" },
  { id: 4, name: "匈牙利刺绣围巾", price: 420, originalPrice: 550, tag: "新品", image: "/scarf.jpg" },
];

export default function ShopPage() {
  return (
    <div className="max-w-2xl mx-auto pb-24 bg-[#f5f7fa] min-h-screen">
      {/* 顶部搜索与分类 */}
      <div className="bg-white px-4 py-6 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input placeholder="搜索非遗文创..." className="pl-10 rounded-full bg-slate-100 border-none" />
          </div>
          <button className="p-2 bg-slate-100 rounded-full">
            <ShoppingCart className="w-5 h-5 text-slate-600" />
          </button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
          {["全部", "手工艺品", "文化课程", "艺术周边", "地方特产"].map((cat, i) => (
            <Badge key={cat} variant={i === 0 ? "default" : "outline"} className="whitespace-nowrap px-4 py-1">
              {cat}
            </Badge>
          ))}
        </div>
      </div>

      {/* 商品列表 - 修复了原图中元素间距不一的问题 */}
      <div className="grid grid-cols-2 gap-3 p-4">
        {PRODUCTS.map((product) => (
          <Card key={product.id} className="border-none shadow-sm overflow-hidden group">
            <div className="aspect-square bg-slate-200 relative">
              {product.tag && (
                <Badge className="absolute top-2 left-2 bg-[#667eea] hover:bg-[#667eea]">
                  {product.tag}
                </Badge>
              )}
              {/* 这里在实际项目中应使用 Next.js Image 组件 */}
            </div>
            <CardContent className="p-3">
              <h3 className="font-bold text-sm text-slate-800 line-clamp-2 mb-2 h-10">
                {product.name}
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-red-500 font-bold text-lg">¥{product.price}</span>
                <span className="text-slate-400 text-[10px] line-through">¥{product.originalPrice}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}