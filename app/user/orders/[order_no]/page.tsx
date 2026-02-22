"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_DUJIAO_API ?? "https://demo.dujiaoka.com/api/v1";

type OrderItem = {
  id: number;
  title?: Record<string, string>;
  quantity: number;
  total_price: string;
  fulfillment_type?: string;
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

const getSnapshotTitle = (snapshot?: Record<string, string>) => {
  if (!snapshot) {
    return "商品";
  }
  return (
    snapshot["zh-CN"] ??
    snapshot["en-US"] ??
    snapshot[Object.keys(snapshot)[0]] ??
    "商品"
  );
};

export default function OrderDetailPage() {
  const { order_no: orderNoParam } = useParams();
  const orderNo = Array.isArray(orderNoParam) ? orderNoParam[0] : orderNoParam;
  const router = useRouter();
  const [token] = useState<string | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }
    return window.localStorage.getItem("dujiao_token");
  });
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(Boolean(orderNo && token));
  const [statusMessage, setStatusMessage] = useState(() => {
    if (!orderNo) {
      return "订单号缺失";
    }
    if (!token) {
      return "请先登录以查看订单详情";
    }
    return "";
  });

  useEffect(() => {
    if (!orderNo) {
      return;
    }
    if (!token) {
      return;
    }

    const controller = new AbortController();

    fetch(`${API_BASE}/orders/by-order-no/${encodeURIComponent(orderNo)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    })
      .then(async (response) => {
        const payload = (await response.json()) as {
          status_code: number;
          msg: string;
          data?: Order;
        };
        if (!response.ok || payload.status_code !== 0) {
          throw new Error(payload.msg || "无法获取订单");
        }
        setOrder(payload.data ?? null);
      })
      .catch((error) => {
        if (controller.signal.aborted) {
          return;
        }
        setStatusMessage(error instanceof Error ? error.message : "订单加载失败");
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [orderNo, token]);

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">订单详情</p>
            <h1 className="text-xl font-semibold">{orderNo ?? "未知订单"}</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={() => router.push("/user")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> 返回
          </Button>
        </div>

        <Card className="border-none shadow">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>
                  {order ? `订单 ${order.order_no}` : "正在加载订单"}
                </CardTitle>
                <CardDescription>
                  {order
                    ? new Date(order.created_at).toLocaleString("zh-CN", {
                        hour12: false,
                      })
                    : statusMessage || "请稍候..."}
                </CardDescription>
              </div>
              {order && (
                <Badge variant={statusVariantMap[order.status] ?? "default"}>
                  {statusLabelMap[order.status] ?? order.status}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {statusMessage && !order && (
              <p className="text-sm text-destructive">{statusMessage}</p>
            )}
            {loading && <p className="text-sm text-slate-500">订单加载中…</p>}
            {order && (
              <>
                <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                  <div>
                    合计：{order.currency} {order.total_amount}
                  </div>
                  <div>
                    状态：{statusLabelMap[order.status] ?? order.status}
                  </div>
                </div>
                <Separator className="bg-slate-100" />
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-slate-700">商品清单</h3>
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
                    >
                      <div className="flex items-center justify-between text-sm text-slate-600">
                        <p className="font-medium">{getSnapshotTitle(item.title)}</p>
                        <span className="text-xs">{item.fulfillment_type ?? "手动交付"}</span>
                      </div>
                      <p className="text-xs text-slate-500">
                        数量 {item.quantity} · 小计 {order.currency} {item.total_price}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
