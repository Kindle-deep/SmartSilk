import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Settings, 
  ChevronRight, 
  Package, 
  Heart, 
  Ticket, 
  History, 
  HelpCircle,
  LogOut 
} from "lucide-react";

export default function UserPage() {
  return (
    <div className="pb-24">
      {/* 顶部个人背景 - 修复了微信小程序中背景图易错位的问题 */}
      <div className="bg-gradient-to-br from-[#667eea] to-[#764ba2] h-48 flex flex-col justify-end px-6 pb-6 text-white">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-white/50">
            <AvatarImage src="/avatar-placeholder.png" />
            <AvatarFallback className="bg-white/20 text-white">UN</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h2 className="text-xl font-bold">非遗探索者</h2>
            <p className="text-xs text-white/70">会员 ID: 20260208</p>
          </div>
        </div>
      </div>

      {/* 核心功能网格 */}
      <div className="px-4 -mt-6">
        <Card className="border-none shadow-md">
          <CardContent className="grid grid-cols-4 py-4 px-2">
            {[
              { label: "订单", icon: Package },
              { label: "收藏", icon: Heart },
              { label: "卡券", icon: Ticket },
              { label: "足迹", icon: History },
            ].map((item) => (
              <button key={item.label} className="flex flex-col items-center gap-2 hover:bg-slate-50 py-2 rounded-lg transition-colors">
                <item.icon className="w-5 h-5 text-slate-600" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 系统列表 - 使用 ShadcnUI 风格进行间距优化 */}
      <div className="mt-6 px-4 space-y-3">
        <Card className="border-none shadow-sm overflow-hidden">
          {[
            { label: "多语言设置", icon: Settings, sub: "简体中文" },
            { label: "关于智汇丝韵", icon: HelpCircle, sub: "v2.0.1" },
          ].map((item, i) => (
            <div key={item.label}>
              <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-slate-400" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <span className="text-xs">{item.sub}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
              {i === 0 && <Separator className="bg-slate-50" />}
            </div>
          ))}
        </Card>

        <Button variant="ghost" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 mt-4">
          <LogOut className="w-4 h-4 mr-2" /> 退出登录
        </Button>
      </div>
    </div>
  );
}