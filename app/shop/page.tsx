"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Search, ShoppingCart, Loader2, QrCode, ExternalLink } from "lucide-react";

type LocaleText = Record<string, string>;

type ApiResponse<T> = {
  status_code: number;
  msg: string;
  data: T;
  pagination?: {
    page: number;
    page_size: number;
    total: number;
    total_page: number;
  };
};

type Category = {
  id: number;
  slug: string;
  name: LocaleText;
};

type ManualFormField = {
  key: string;
  type?: string;
  required?: boolean;
  label?: LocaleText;
  placeholder?: LocaleText;
};

type Product = {
  id: number;
  category_id: number;
  slug: string;
  title: LocaleText;
  description?: LocaleText;
  price_amount: string;
  price_currency: string;
  images?: string[];
  tags?: string[];
  fulfillment_type?: string;
  manual_form_schema?: {
    fields?: ManualFormField[];
  };
  promotion_price_amount?: string;
  is_sold_out?: boolean;
};

type PaymentChannel = {
  id: number;
  name: string;
  channel_type: string;
  interaction_mode: string;
};

type SiteConfig = {
  payment_channels?: PaymentChannel[];
};

type OrderResponse = {
  id: number;
  total_amount: string;
};

type PaymentLaunch = {
  payment_id: number;
  interaction_mode: string;
  pay_url?: string;
  qr_code?: string;
};

const LOCAL_CATEGORIES: Category[] = [
  {
    id: 1,
    slug: "europe-handmade",
    name: { "zh-CN": "手工纪念", "en-US": "Handmade Souvenirs" },
  },
  {
    id: 2,
    slug: "europe-snacks",
    name: { "zh-CN": "风味食品", "en-US": "European Snacks" },
  },
  {
    id: 3,
    slug: "europe-lifestyle",
    name: { "zh-CN": "生活器物", "en-US": "Lifestyle Items" },
  },
];

const LOCAL_PRODUCTS: Product[] = [
  {
    id: 101,
    category_id: 1,
    slug: "czech-handpainted-magnet-set",
    title: { "zh-CN": "捷克手绘城市冰箱贴（3枚）" },
    description: { "zh-CN": "布拉格老城主题，小体积易携带，适合送礼。" },
    price_amount: "59.00",
    promotion_price_amount: "49.00",
    price_currency: "CNY",
    images: ["/images/shop/czech-magnet.jpg"],
    tags: ["捷克", "热卖"],
    fulfillment_type: "manual",
  },
  {
    id: 102,
    category_id: 1,
    slug: "hungary-danube-postcard-box",
    title: { "zh-CN": "匈牙利多瑙河明信片礼盒" },
    description: { "zh-CN": "含布达佩斯经典景点卡片，附封蜡贴纸。" },
    price_amount: "45.00",
    price_currency: "CNY",
    images: ["/images/shop/hungary-postcard.jpg"],
    tags: ["匈牙利", "旅行"],
    fulfillment_type: "manual",
  },
  {
    id: 103,
    category_id: 2,
    slug: "italy-pasta-gift-pack",
    title: { "zh-CN": "意大利螺旋意面礼装（500g）" },
    description: { "zh-CN": "日常烹饪友好，适合家庭备餐与伴手礼。" },
    price_amount: "39.00",
    price_currency: "CNY",
    images: ["/images/shop/italy-pasta.jpg"],
    tags: ["意大利", "食品"],
    fulfillment_type: "manual",
  },
  {
    id: 104,
    category_id: 2,
    slug: "greece-herb-sea-salt",
    title: { "zh-CN": "希腊香草海盐调味罐" },
    description: { "zh-CN": "地中海风味，适配沙拉、牛排和烤蔬菜。" },
    price_amount: "36.00",
    price_currency: "CNY",
    images: ["/images/shop/greece-sea-salt.jpg"],
    tags: ["希腊", "厨房"],
    fulfillment_type: "manual",
  },
  {
    id: 105,
    category_id: 3,
    slug: "bosnia-copper-coffee-spoon",
    title: { "zh-CN": "波黑铜柄咖啡勺" },
    description: { "zh-CN": "莫斯塔尔古桥主题雕纹，小巧实用。" },
    price_amount: "68.00",
    promotion_price_amount: "55.00",
    price_currency: "CNY",
    images: ["/images/shop/bosnia-coffee-spoon.jpg"],
    tags: ["波黑", "手作"],
    fulfillment_type: "manual",
  },
  {
    id: 106,
    category_id: 3,
    slug: "poland-amber-keychain",
    title: { "zh-CN": "波兰琥珀风钥匙挂件" },
    description: { "zh-CN": "轻便耐用，通勤钥匙与背包都可搭配。" },
    price_amount: "29.00",
    price_currency: "CNY",
    images: ["/images/shop/poland-amber-keychain.jpg"],
    tags: ["波兰", "日常"],
    fulfillment_type: "manual",
  },
];

const API_BASE = (process.env.NEXT_PUBLIC_DUJIAO_API_BASE_URL || "/api/v1").replace(/\/$/, "");

function resolveProductImage(path?: string) {
  if (!path) return "";
  return path.startsWith("/") ? path : `/${path}`;
}

function toWebpApiUrl(src?: string, width = 640, quality = 72) {
  const resolved = resolveProductImage(src);
  if (!resolved) return "";
  return `/api/image/webp?src=${encodeURIComponent(resolved)}&w=${width}&quality=${quality}`;
}

function getLocaleText(text?: LocaleText) {
  if (!text) return "";
  return text["zh-CN"] || text["zh"] || text["en-US"] || Object.values(text)[0] || "";
}

async function dujiaoFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(`网络错误：${response.status}`);
  }

  const result = (await response.json()) as ApiResponse<T>;
  if (result.status_code !== 0) {
    throw new Error(result.msg || "请求失败");
  }
  return result.data;
}

export default function ShopPage() {
  const [categories, setCategories] = useState<Category[]>(LOCAL_CATEGORIES);
  const [products] = useState<Product[]>(LOCAL_PRODUCTS);
  const [channels, setChannels] = useState<PaymentChannel[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<number | "all">("all");
  const [keyword, setKeyword] = useState("");
  const [loadingBase, setLoadingBase] = useState(true);
  const [error, setError] = useState("");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedChannelId, setSelectedChannelId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [guestEmail, setGuestEmail] = useState("");
  const [orderPassword, setOrderPassword] = useState("");
  const [manualFormData, setManualFormData] = useState<Record<string, string>>({});
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [orderAmount, setOrderAmount] = useState<string>("");
  const [paymentResult, setPaymentResult] = useState<PaymentLaunch | null>(null);
  const [checkoutError, setCheckoutError] = useState("");

  const manualFields = useMemo(
    () => selectedProduct?.manual_form_schema?.fields || [],
    [selectedProduct]
  );

  const filteredProducts = useMemo(() => {
    const keywordText = keyword.trim().toLowerCase();
    return products.filter((product) => {
      const matchCategory = activeCategoryId === "all" || product.category_id === activeCategoryId;
      if (!matchCategory) {
        return false;
      }

      if (!keywordText) {
        return true;
      }

      const title = getLocaleText(product.title).toLowerCase();
      const description = getLocaleText(product.description).toLowerCase();
      return title.includes(keywordText) || description.includes(keywordText);
    });
  }, [activeCategoryId, keyword, products]);

  useEffect(() => {
    const loadBaseData = async () => {
      setLoadingBase(true);
      setError("");
      try {
        const configData = await dujiaoFetch<SiteConfig>("/public/config");
        setCategories(LOCAL_CATEGORIES);
        setChannels(configData.payment_channels || []);
      } catch (err) {
        setCategories(LOCAL_CATEGORIES);
        setChannels([]);
        setError(err instanceof Error ? err.message : "基础数据加载失败");
      } finally {
        setLoadingBase(false);
      }
    };

    loadBaseData();
  }, []);

  const openCheckout = (product: Product) => {
    setCheckoutError("");
    setPaymentResult(null);
    setOrderId(null);
    setOrderAmount("");
    setQuantity(1);
    setManualFormData({});
    setSelectedProduct(product);
    setSelectedChannelId(channels[0]?.id || null);
    setDrawerOpen(true);
  };

  const handleCreateOrderAndPay = async () => {
    if (!selectedProduct) return;
    if (!guestEmail.trim() || !orderPassword.trim()) {
      setCheckoutError("请填写游客邮箱和查询密码");
      return;
    }
    if (!selectedChannelId) {
      setCheckoutError("请选择支付渠道");
      return;
    }

    for (const field of manualFields) {
      if (field.required && !manualFormData[field.key]?.trim()) {
        setCheckoutError(`请填写：${getLocaleText(field.label) || field.key}`);
        return;
      }
    }

    setCreatingOrder(true);
    setCheckoutError("");

    try {
      const orderBody: Record<string, unknown> = {
        email: guestEmail.trim(),
        order_password: orderPassword.trim(),
        items: [
          {
            product_id: selectedProduct.id,
            quantity,
            fulfillment_type: selectedProduct.fulfillment_type || "manual",
          },
        ],
      };

      if (manualFields.length > 0) {
        orderBody.manual_form_data = {
          [String(selectedProduct.id)]: manualFormData,
        };
      }

      const createdOrder = await dujiaoFetch<OrderResponse>("/guest/orders", {
        method: "POST",
        body: JSON.stringify(orderBody),
      });

      setOrderId(createdOrder.id);
      setOrderAmount(createdOrder.total_amount);

      const payment = await dujiaoFetch<PaymentLaunch>("/guest/payments", {
        method: "POST",
        body: JSON.stringify({
          email: guestEmail.trim(),
          order_password: orderPassword.trim(),
          order_id: createdOrder.id,
          channel_id: selectedChannelId,
        }),
      });

      setPaymentResult(payment);
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : "下单或支付发起失败");
    } finally {
      setCreatingOrder(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-24 bg-[#f5f7fa] min-h-screen">
      <div className="bg-white px-4 py-6 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="搜索商品..."
              className="pl-10 rounded-full bg-slate-100 border-none"
            />
          </div>
          <div className="p-2 bg-slate-100 rounded-full">
            <ShoppingCart className="w-5 h-5 text-slate-600" />
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
          <Button
            size="sm"
            variant={activeCategoryId === "all" ? "default" : "outline"}
            className="rounded-full"
            onClick={() => setActiveCategoryId("all")}
          >
            全部
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              size="sm"
              variant={activeCategoryId === category.id ? "default" : "outline"}
              className="rounded-full"
              onClick={() => setActiveCategoryId(category.id)}
            >
              {getLocaleText(category.name)}
            </Button>
          ))}
        </div>
      </div>

      {error ? (
        <div className="px-4 py-3 text-sm text-red-500">{error}</div>
      ) : null}

      {loadingBase ? (
        <div className="p-6 flex items-center justify-center text-slate-500 text-sm">
          <Loader2 className="w-4 h-4 mr-2 animate-spin" /> 数据加载中...
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-3 p-4">
        {filteredProducts.map((product, index) => (
          <Card
            key={product.id}
            className="border-none shadow-sm overflow-hidden group cursor-pointer"
            onClick={() => openCheckout(product)}
          >
            <div className="aspect-square bg-slate-200 relative overflow-hidden">
              {resolveProductImage(product.images?.[0]) ? (
                <Image
                  src={toWebpApiUrl(product.images?.[0], 560, 72)}
                  alt={getLocaleText(product.title)}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                  priority={index < 4}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-[0.3em] text-slate-400">
                  暂无图
                </div>
              )}
              {(product.tags || []).slice(0, 1).map((tag) => (
                <Badge key={tag} className="absolute top-2 left-2 bg-[#667eea] hover:bg-[#667eea]">
                  {tag}
                </Badge>
              ))}
              {product.is_sold_out ? (
                <Badge variant="destructive" className="absolute top-2 right-2">
                  售罄
                </Badge>
              ) : null}
            </div>
            <CardContent className="p-3">
              <h3 className="font-bold text-sm text-slate-800 line-clamp-2 mb-2 h-10">
                {getLocaleText(product.title)}
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-red-500 font-bold text-lg">¥{product.promotion_price_amount || product.price_amount}</span>
                {product.promotion_price_amount ? (
                  <span className="text-slate-400 text-[10px] line-through">¥{product.price_amount}</span>
                ) : null}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!loadingBase && filteredProducts.length === 0 ? (
        <div className="px-4 py-8 text-center text-sm text-slate-500">暂无商品</div>
      ) : null}

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>{selectedProduct ? getLocaleText(selectedProduct.title) : "购买商品"}</DrawerTitle>
            <DrawerDescription>填写订单信息并发起支付</DrawerDescription>
          </DrawerHeader>

          <div className="px-4 pb-4 space-y-4 overflow-y-auto">
            <div className="rounded-lg border p-3 bg-slate-50">
              <p className="text-sm text-slate-600">价格</p>
              <p className="text-xl font-bold text-red-500">
                ¥{selectedProduct?.promotion_price_amount || selectedProduct?.price_amount || "0.00"}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">游客邮箱</p>
              <Input
                value={guestEmail}
                onChange={(event) => setGuestEmail(event.target.value)}
                placeholder="请输入邮箱"
                type="email"
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">查询密码</p>
              <Input
                value={orderPassword}
                onChange={(event) => setOrderPassword(event.target.value)}
                placeholder="用于后续查询游客订单"
                type="password"
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">购买数量</p>
              <Input
                type="number"
                min={1}
                value={quantity}
                onChange={(event) => {
                  const value = Number(event.target.value || 1);
                  setQuantity(Number.isNaN(value) || value < 1 ? 1 : value);
                }}
              />
            </div>

            {manualFields.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm font-medium">交付信息</p>
                {manualFields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <p className="text-sm text-slate-600">
                      {getLocaleText(field.label) || field.key}
                      {field.required ? <span className="text-red-500"> *</span> : null}
                    </p>
                    <Input
                      value={manualFormData[field.key] || ""}
                      onChange={(event) =>
                        setManualFormData((previous) => ({
                          ...previous,
                          [field.key]: event.target.value,
                        }))
                      }
                      placeholder={getLocaleText(field.placeholder) || "请输入"}
                    />
                  </div>
                ))}
              </div>
            ) : null}

            <div className="space-y-2">
              <p className="text-sm font-medium">支付方式</p>
              <div className="flex flex-wrap gap-2">
                {channels.map((channel) => (
                  <Button
                    key={channel.id}
                    size="sm"
                    variant={selectedChannelId === channel.id ? "default" : "outline"}
                    onClick={() => setSelectedChannelId(channel.id)}
                  >
                    {channel.name}
                  </Button>
                ))}
              </div>
            </div>

            {checkoutError ? <p className="text-sm text-red-500">{checkoutError}</p> : null}

            {orderId ? (
              <div className="rounded-lg border p-3 text-sm space-y-1 bg-slate-50">
                <p>订单 ID：{orderId}</p>
                <p>订单金额：¥{orderAmount}</p>
              </div>
            ) : null}

            {paymentResult ? (
              <div className="rounded-lg border p-3 text-sm space-y-2">
                <p className="font-medium">支付已创建（ID: {paymentResult.payment_id}）</p>
                {paymentResult.pay_url ? (
                  <Button asChild className="w-full">
                    <a href={paymentResult.pay_url} target="_blank" rel="noreferrer">
                      前往支付 <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                ) : null}
                {paymentResult.qr_code ? (
                  <div className="rounded-md bg-slate-100 p-2">
                    <p className="text-xs text-slate-600 mb-1 flex items-center gap-1">
                      <QrCode className="w-3.5 h-3.5" /> 二维码内容
                    </p>
                    <p className="break-all text-xs">{paymentResult.qr_code}</p>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          <DrawerFooter>
            <Button onClick={handleCreateOrderAndPay} disabled={creatingOrder || !selectedProduct}>
              {creatingOrder ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {creatingOrder ? "处理中..." : "下单并支付"}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">关闭</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}