"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, ChevronRight } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_DUJIAO_API ?? "https://demo.dujiaoka.com/api/v1";

type OrderItem = {
  id: number;
  title?: Record<string, string>;
  quantity: number;
  total_price: string;
};

type Order = {
  id: number;
  order_no: string;
  status: string;
  currency: string;
  total_amount: string;
  created_at: string;
  items: OrderItem[];
};

const statusLabelMap: Record<string, string> = {
  pending_payment: "待支付",
  paid: "已支付",
  fulfilling: "备货中",
  partially_delivered: "部分交付",
  delivered: "已交付",
  completed: "已完成",
  canceled: "已取消",
};

const statusVariantMap: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  pending_payment: "destructive",
  paid: "secondary",
  fulfilling: "secondary",
  partially_delivered: "secondary",
  delivered: "default",
  completed: "default",
  canceled: "outline",
};

export default function UserOrdersPage() {
  const router = useRouter();
  const [token] = useState<string | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }
    return window.localStorage.getItem("dujiao_token");
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(Boolean(token));
  const [message, setMessage] = useState(token ? "" : "请先登录后查看订单");

  useEffect(() => {
    if (!token) {
      return;
    }

    const controller = new AbortController();

    fetch(`${API_BASE}/orders?page=1&page_size=20`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      signal: controller.signal,
    })
      .then(async (response) => {
        const payload = (await response.json()) as {
          status_code: number;
          msg: string;
          data?: Order[];
        };
        if (!response.ok || payload.status_code !== 0) {
          throw new Error(payload.msg || "订单加载失败");
        }
        setOrders(Array.isArray(payload.data) ? payload.data : []);
      })
      .catch((error) => {
        if (controller.signal.aborted) {
          return;
        }
        setMessage(error instanceof Error ? error.message : "订单加载失败");
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">用户中心</p>
            <h1 className="text-xl font-semibold">我的订单</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={() => router.push("/user")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> 返回
          </Button>
        </div>

        <Card className="border-none shadow">
          <CardHeader>
            <CardTitle>订单列表</CardTitle>
            <CardDescription>点击任意订单进入详情页</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading && <p className="text-sm text-slate-500">订单加载中…</p>}
            {message && <p className="text-sm text-destructive">{message}</p>}
            {!loading && !message && orders.length === 0 && (
              <p className="text-sm text-slate-500">暂无订单记录</p>
            )}
            {!loading && !message && orders.length > 0 && (
              <div className="space-y-3">
                {orders.map((order) => (
                  <button
                    key={order.id}
                    type="button"
                    onClick={() =>
                      router.push(`/user/orders/${encodeURIComponent(order.order_no)}`)
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-slate-300"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{order.order_no}</p>
                        <p className="text-xs text-slate-400">
                          {new Date(order.created_at).toLocaleString("zh-CN", {
                            hour12: false,
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={statusVariantMap[order.status] ?? "default"}>
                          {statusLabelMap[order.status] ?? order.status}
                        </Badge>
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      合计：{order.currency} {order.total_amount} · 共 {order.items.length} 件
                    </p>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
