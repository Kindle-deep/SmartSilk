"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  ChevronRight,
  Package,
  Heart,
  Ticket,
  History,
  HelpCircle,
  LogOut,
  Settings,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_DUJIAO_API ?? "https://demo.dujiaoka.com/api/v1";

type UserProfile = {
  id: number;
  email: string;
  nickname?: string;
  locale?: string;
};

type StatusMessage =
  | { type: "success" | "error" | "info"; text: string }
  | null;

type ApiOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Record<string, string | number | boolean | null | undefined>;
  token?: string;
};

export default function UserPage() {
  const router = useRouter();
  const [registerForm, setRegisterForm] = useState({
    email: "",
    password: "",
    code: "",
    agreement: true,
  });
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [statusMessage, setStatusMessage] = useState<StatusMessage>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [codeLoading, setCodeLoading] = useState(false);

  const handleLogout = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("dujiao_token");
    }
    setToken(null);
    setUser(null);
    setStatusMessage({ type: "info", text: "已退出登录" });
    setDrawerOpen(false);
  }, []);

  const callApi = useCallback(
    async <T = unknown>(path: string, options: ApiOptions = {}) => {
      const { method = "GET", body, query, token: overrideToken } = options;
      const normalizedBase = API_BASE.replace(/\/$/, "");
      const normalizedPath = path.startsWith("/") ? path : `/${path}`;
      const url = new URL(`${normalizedBase}${normalizedPath}`);
      if (query) {
        Object.entries(query).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, String(value));
          }
        });
      }

      const headers: Record<string, string> = {};
      if (body) {
        headers["Content-Type"] = "application/json";
      }
      const authToken = overrideToken ?? token;
      if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
      }

      const response = await fetch(url.toString(), {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      const payload = await response
        .json()
        .catch(() => ({ status_code: -1, msg: "无法解析响应" }));

      if (!response.ok || payload.status_code !== 0) {
        throw new Error(payload.msg || response.statusText || "请求失败");
      }

      return payload.data as T;
    },
    [token]
  );

  const persistToken = useCallback((nextToken: string) => {
    setToken(nextToken);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("dujiao_token", nextToken);
    }
  }, []);

  const handleSendCode = async () => {
    if (!registerForm.email) {
      setStatusMessage({ type: "error", text: "请填写注册邮箱" });
      return;
    }
    setStatusMessage(null);
    setCodeLoading(true);
    try {
      await callApi("/auth/send-verify-code", {
        method: "POST",
        body: { email: registerForm.email, purpose: "register" },
      });
      setStatusMessage({ type: "success", text: "验证码已发送，请查收" });
    } catch (error) {
      setStatusMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "验证码发送失败，请稍后重试",
      });
    } finally {
      setCodeLoading(false);
    }
  };

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!registerForm.agreement) {
      setStatusMessage({
        type: "error",
        text: "需要先同意服务条款才能注册",
      });
      return;
    }
    setStatusMessage(null);
    setAuthLoading(true);
    try {
      const payload = await callApi<{
        user: UserProfile;
        token: string;
      }>("/auth/register", {
        method: "POST",
        body: {
          email: registerForm.email,
          password: registerForm.password,
          code: registerForm.code,
          agreement_accepted: true,
        },
      });
      persistToken(payload.token);
      setUser(payload.user);
      setStatusMessage({ type: "success", text: "注册并登录成功" });
      setDrawerOpen(false);
    } catch (error) {
      setStatusMessage({
        type: "error",
        text: error instanceof Error ? error.message : "注册失败，请重试",
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage(null);
    setAuthLoading(true);
    try {
      const payload = await callApi<{
        user: UserProfile;
        token: string;
      }>("/auth/login", {
        method: "POST",
        body: {
          email: loginForm.email,
          password: loginForm.password,
        },
      });
      persistToken(payload.token);
      setUser(payload.user);
      setStatusMessage({ type: "success", text: "登录成功" });
      setDrawerOpen(false);
    } catch (error) {
      setStatusMessage({
        type: "error",
        text: error instanceof Error ? error.message : "登录失败，请检查邮箱或密码",
      });
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const savedToken = window.localStorage.getItem("dujiao_token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }
    let active = true;
    (async () => {
      try {
        const profile = await callApi<UserProfile>("/me");
        if (active) {
          setUser(profile);
        }
      } catch {
        if (active) {
          setStatusMessage({
            type: "error",
            text: "登录已过期，请重新登录",
          });
          handleLogout();
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [token, callApi, handleLogout]);

  const statusClassName =
    statusMessage?.type === "error"
      ? "text-destructive"
      : statusMessage?.type === "success"
      ? "text-emerald-500"
      : "text-slate-400";

  const handleQuickAction = useCallback(
    (label: string) => {
      if (!token) {
        setStatusMessage({ type: "info", text: "请先登录后再使用该功能" });
        setDrawerOpen(true);
        return;
      }

      if (label === "订单") {
        router.push("/user/orders");
        return;
      }

      setStatusMessage({ type: "info", text: `${label} 功能即将开放` });
    },
    [router, token]
  );

  return (
    <div className="pb-24">
      <div className="relative bg-gradient-to-br from-[#667eea] to-[#764ba2] h-48 flex flex-col justify-end px-6 pb-6 text-white">
        <div className="flex items-start justify-between gap-6">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-4 rounded-xl transition hover:bg-white/10 p-1"
          >
            <Avatar className="h-16 w-16 border-2 border-white/50">
              <AvatarImage src="/avatar-placeholder.png" />
              <AvatarFallback className="bg-white/20 text-white">
                {user?.nickname?.[0] ?? "访"}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1 text-left">
              <h2 className="text-xl font-bold">
                {user?.nickname ?? "非遗探索者"}
              </h2>
              <p className="text-xs text-white/70">
                {user ? `UID: ${user.id}` : "点击头像登录"}
              </p>
            </div>
          </button>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={user ? "secondary" : "outline"}>
              {user ? "已登录" : "游客"}
            </Badge>
            {user && (
              <Button
                variant="ghost"
                size="sm"
                className="text-white/80 hover:text-white"
                onClick={handleLogout}
              >
                <LogOut className="size-4" /> 退出登录
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 -mt-6 space-y-6 max-w-5xl mx-auto">
        <Card className="border-none shadow-md">
          <CardContent className="grid grid-cols-4 gap-2 py-4 px-2">
            {[
              { label: "订单", icon: Package },
              { label: "收藏", icon: Heart },
              { label: "卡券", icon: Ticket },
              { label: "足迹", icon: History },
            ].map((item) => (
              <button
                key={item.label}
                className="flex flex-col items-center gap-2 hover:bg-slate-50 py-2 rounded-lg transition-colors"
                type="button"
                onClick={() => handleQuickAction(item.label)}
              >
                <item.icon className="w-5 h-5 text-slate-600" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            ))}
          </CardContent>
        </Card>

        {statusMessage && (
          <p className={`px-1 text-sm ${statusClassName}`}>{statusMessage.text}</p>
        )}

        <Card className="border-none shadow-sm overflow-hidden">
          {[{ label: "多语言设置", icon: Settings, sub: "简体中文" }, { label: "关于智汇丝韵", icon: HelpCircle, sub: "v2.0.1" }].map((item, index) => (
            <div key={item.label}>
              <button className="w-full flex items-center justify-between gap-3 p-4 hover:bg-slate-50 transition-colors" type="button">
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-slate-400" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <span className="text-xs">{item.sub}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
              {index === 0 && <Separator className="bg-slate-50" />}
            </div>
          ))}
        </Card>
      </div>

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="gap-4">
          <DrawerHeader className="text-left">
            <div className="flex items-start justify-between gap-3">
              <div>
                <DrawerTitle>登录 / 注册</DrawerTitle>
                <DrawerDescription>
                  通过 Dujiao Next 账号同步订单与会员权益。
                </DrawerDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setDrawerOpen(false)}>
                关闭
              </Button>
            </div>
          </DrawerHeader>
          <div className="px-4">
            <Tabs defaultValue="login">
              <TabsList>
                <TabsTrigger value="login">登录</TabsTrigger>
                <TabsTrigger value="register">注册</TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="pt-4">
                <form className="space-y-3" onSubmit={handleLogin}>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600">邮箱</label>
                    <Input
                      type="email"
                      placeholder="user@example.com"
                      value={loginForm.email}
                      onChange={(event) =>
                        setLoginForm((prev) => ({
                          ...prev,
                          email: event.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600">密码</label>
                    <Input
                      type="password"
                      placeholder="至少 8 位"
                      value={loginForm.password}
                      onChange={(event) =>
                        setLoginForm((prev) => ({
                          ...prev,
                          password: event.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <Button type="submit" disabled={authLoading} className="w-full">
                    登录
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="register" className="pt-4">
                <form className="space-y-3" onSubmit={handleRegister}>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600">邮箱</label>
                    <Input
                      type="email"
                      placeholder="user@example.com"
                      value={registerForm.email}
                      onChange={(event) =>
                        setRegisterForm((prev) => ({
                          ...prev,
                          email: event.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600">密码</label>
                    <Input
                      type="password"
                      placeholder="至少 8 位"
                      value={registerForm.password}
                      onChange={(event) =>
                        setRegisterForm((prev) => ({
                          ...prev,
                          password: event.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600">验证码</label>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="6 位数字"
                        value={registerForm.code}
                        onChange={(event) =>
                          setRegisterForm((prev) => ({
                            ...prev,
                            code: event.target.value,
                          }))
                        }
                        required
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleSendCode}
                        disabled={codeLoading}
                      >
                        {codeLoading ? "发送中" : "发送验证码"}
                      </Button>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-xs text-slate-500">
                    <input
                      type="checkbox"
                      checked={registerForm.agreement}
                      onChange={(event) =>
                        setRegisterForm((prev) => ({
                          ...prev,
                          agreement: event.target.checked,
                        }))
                      }
                    />
                    我已阅读并同意服务协议
                  </label>
                  <Button type="submit" disabled={authLoading} className="w-full">
                    注册并登录
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            {statusMessage && (
              <p className={`mt-3 text-sm ${statusClassName}`}>{statusMessage.text}</p>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
