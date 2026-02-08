"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Slider } from "@/components/ui/slider";
import { Sparkles, Loader2 } from "lucide-react";
import { DateRange } from "react-day-picker";
import { differenceInCalendarDays, format } from "date-fns";
import { zhCN } from "date-fns/locale";

const DESTINATIONS = [
  { id: "praha", title: "布拉格 · 捷克", detail: "查理大桥 · 玻璃工艺坊", tag: "哥特 × 新艺术" },
  { id: "budapest", title: "布达佩斯 · 匈牙利", detail: "多瑙河夜航 · 民族舞蹈", tag: "温泉 × 音乐" },
  { id: "sarajevo", title: "萨拉热窝 · 波黑", detail: "奥斯曼手工市集", tag: "咖啡 × 铜艺" },
  { id: "krakow", title: "克拉科夫 · 波兰", detail: "琥珀镶嵌 · 木偶剧场", tag: "中世纪城墙" },
];

const PREFERENCE_TAGS = [
  "手工工坊探访",
  "民俗音乐体验",
  "沉浸式戏剧",
  "非遗大师课堂",
  "夜间市集",
  "自然疗愈",
  "美食与酒",
  "亲子互动",
];

const TRAVEL_STYLES = [
  { id: "immersive", label: "沉浸慢游", note: "住进当地社区，深聊匠人故事" },
  { id: "balanced", label: "平衡体验", note: "文化与自然交错，节奏适中" },
  { id: "flash", label: "高效速览", note: "紧凑安排，打卡标志性非遗" },
];

const COMPANIONS = [
  { id: "solo", label: "独旅", note: "为自我充电的灵感之旅" },
  { id: "couple", label: "双人", note: "与伴侣共赴浪漫非遗" },
  { id: "family", label: "亲子", note: "适合孩子参与的互动体验" },
  { id: "friends", label: "好友", note: "小团队共创回忆" },
];

export default function AIRoutePage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [budget, setBudget] = useState([5000]);
  const [destination, setDestination] = useState(DESTINATIONS[0].id);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({ from: undefined, to: undefined });
  const [preferences, setPreferences] = useState<string[]>(["手工工坊探访"]);
  const [travelStyle, setTravelStyle] = useState(TRAVEL_STYLES[0].id);
  const [companion, setCompanion] = useState(COMPANIONS[1].id);
  const [notes, setNotes] = useState("");

  const formatDate = (date?: Date) => (date ? format(date, "yyyy.MM.dd") : "待定");
  const tripLength =
    dateRange?.from && dateRange?.to
      ? differenceInCalendarDays(dateRange.to, dateRange.from) + 1
      : undefined;

  const togglePreference = (tag: string) => {
    setPreferences((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    );
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    const normalizedDates = {
      from: dateRange?.from?.toISOString() ?? null,
      to: dateRange?.to?.toISOString() ?? null,
    };
    const payload = {
      destination,
      preferences,
      travelStyle,
      companion,
      budget: budget[0],
      notes,
      dates: normalizedDates,
    };
    console.log("AI itinerary payload", payload);

    setTimeout(() => {
      setIsGenerating(false);
      router.push("/route/result");
    }, 1500);
  };

  const selectedDestination = DESTINATIONS.find((item) => item.id === destination);
  const travelStyleMeta = TRAVEL_STYLES.find((item) => item.id === travelStyle);
  const companionMeta = COMPANIONS.find((item) => item.id === companion);

  return (
    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="text-[#667eea] w-6 h-6" />
          AI 智能定制路线
        </h1>
        <p className="text-slate-500 text-sm">告诉 AI 你的喜好，一键生成专属非遗旅程</p>
      </header>

      <section className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">目的地灵感池</CardTitle>
            <CardDescription>选择最触动你的城市或文化场景</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {DESTINATIONS.map((spot) => {
                const isActive = spot.id === destination;
                return (
                  <button
                    type="button"
                    key={spot.id}
                    onClick={() => setDestination(spot.id)}
                    className={`rounded-2xl border px-4 py-3 text-left transition-all ${
                      isActive
                        ? "border-slate-900 bg-slate-900 text-white shadow-xl shadow-slate-900/20"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
                    }`}
                    aria-pressed={isActive}
                  >
                    <div className="text-sm font-semibold">{spot.title}</div>
                    <p className={`text-xs mt-1 ${isActive ? "text-white/80" : "text-slate-500"}`}>
                      {spot.detail}
                    </p>
                    <span className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${
                      isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                    }`}>
                      {spot.tag}
                    </span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">行程参数</CardTitle>
            <CardDescription>锁定时间与节奏，AI 才能安排合适的深度体验</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-3xl border border-slate-200 bg-white p-3">
                <Calendar
                  mode="range"
                  numberOfMonths={1}
                  selected={dateRange}
                  onSelect={setDateRange}
                  locale={zhCN}
                  fromMonth={new Date()}
                  className="w-full"
                />
              </div>

              <div className="flex flex-col justify-between gap-4 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm">
                <div>
                  <p className="text-xs font-semibold text-slate-500">出发 - 返回</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {formatDate(dateRange?.from)}
                    <span className="mx-2 text-xs text-slate-400">to</span>
                    {formatDate(dateRange?.to)}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="rounded-2xl bg-white p-3 shadow-sm">
                    <p className="text-slate-400">旅程时长</p>
                    <p className="mt-1 text-base font-semibold text-slate-900">
                      {tripLength ? `${tripLength} 天` : "待定"}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white p-3 shadow-sm">
                    <p className="text-slate-400">推荐到达日</p>
                    <p className="mt-1 text-base font-semibold text-slate-900">
                      {dateRange?.from ? format(dateRange.from, "eee", { locale: zhCN }) : "-"}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  已根据东欧节庆季调优，建议至少 5 天以体验匠人课堂与沉浸式晚宴。
                </p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-2">旅行节奏</p>
                <div className="flex flex-col gap-2">
                  {TRAVEL_STYLES.map((style) => {
                    const isActive = travelStyle === style.id;
                    return (
                      <button
                        type="button"
                        key={style.id}
                        onClick={() => setTravelStyle(style.id)}
                        className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition-colors ${
                          isActive
                            ? "border-indigo-500 bg-indigo-50 text-indigo-950"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
                        }`}
                        aria-pressed={isActive}
                      >
                        <div className="font-semibold">{style.label}</div>
                        <p className="text-xs mt-1 text-slate-500">{style.note}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500 mb-2">同行角色</p>
                <div className="flex flex-col gap-2">
                  {COMPANIONS.map((item) => {
                    const isActive = companion === item.id;
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setCompanion(item.id)}
                        className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition-colors ${
                          isActive
                            ? "border-emerald-500 bg-emerald-50 text-emerald-950"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
                        }`}
                        aria-pressed={isActive}
                      >
                        <div className="font-semibold">{item.label}</div>
                        <p className="text-xs mt-1 text-slate-500">{item.note}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">体验偏好</CardTitle>
            <CardDescription>可多选，AI 会根据热度搭配活动占比</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {PREFERENCE_TAGS.map((tag) => {
                const isActive = preferences.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => togglePreference(tag)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                    aria-pressed={isActive}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">预算区间</CardTitle>
            <CardDescription>用于智能匹配交通、住宿与私享体验</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm font-semibold">
              <span>预计预算</span>
              <span className="text-[#667eea]">¥{budget[0].toLocaleString("zh-CN")}</span>
            </div>
            <Slider value={budget} onValueChange={setBudget} max={20000} step={500} />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>¥3,000</span>
              <span>¥20,000+</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">补充需求</CardTitle>
            <CardDescription>例如记忆中的味道、想见的匠人或身体状况</CardDescription>
          </CardHeader>
          <CardContent>
            <textarea
              className="w-full min-h-28 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
              placeholder="想告诉 AI 的任何细节..."
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </CardContent>
        </Card>

        <Card className="bg-slate-900 text-white">
          <CardHeader>
            <CardTitle className="text-base">行程摘要</CardTitle>
            <CardDescription className="text-white/70">
              生成前再确认一次，确保推荐结果贴心精准
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-white/60">目的地</p>
              <p className="font-semibold">{selectedDestination?.title}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-white/60">节奏</p>
                <p className="font-semibold">{travelStyleMeta?.label}</p>
              </div>
              <div>
                <p className="text-white/60">同行</p>
                <p className="font-semibold">{companionMeta?.label}</p>
              </div>
            </div>
            <div>
              <p className="text-white/60">偏好</p>
              <p className="font-semibold">{preferences.join(" · ") || "未选择"}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-white/60">出发</p>
                <p className="font-semibold">{formatDate(dateRange?.from)}</p>
              </div>
              <div>
                <p className="text-white/60">返回</p>
                <p className="font-semibold">{formatDate(dateRange?.to)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <Button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="w-full h-12 bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:opacity-90 text-lg rounded-xl transition-all"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            AI 正在规划中...
          </>
        ) : (
          "开始生成定制方案"
        )}
      </Button>
    </div>
  );
}