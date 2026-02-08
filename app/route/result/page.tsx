"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	MapPin,
	Calendar as CalendarIcon,
	ChevronLeft,
	Share2,
	Download,
	Hotel,
	Utensils,
	Camera,
	Sparkles,
	BrainCircuit,
	Clock,
	ArrowRight,
} from "lucide-react";

const metaSummary = [
	{
		icon: CalendarIcon,
		label: "出发日",
		value: "2026.05.15",
		hint: "避开布拉格之春返程客流",
	},
	{
		icon: Hotel,
		label: "住宿",
		value: "河景艺宿 · 4 晚",
		hint: "步行 5 分钟直达匠人社区",
	},
	{
		icon: Utensils,
		label: "风味",
		value: "共食仪式 · 3 场",
		hint: "含 2 次素食菜单",
	},
];

const serviceHighlights = [
	{
		icon: Camera,
		title: "玻璃工坊深潜",
		detail: "AI 锁定查理大桥旁私人工作室，错峰 10:30-12:00 共创体验。",
	},
	{
		icon: Sparkles,
		title: "匠人社群",
		detail: "Day 1-2 社区配比 70%，保留原汁原味的创作对谈。",
	},
	{
		icon: BrainCircuit,
		title: "动态调度",
		detail: "根据实时客流，午后改走小城宫阶梯线，避开旅行团。",
	},
];

const dayPlans = [
	{
		day: "DAY 1",
		title: "匠心序章 · 小城区",
		focus: ["玻璃热熔体验", "伏尔塔瓦河夜景"],
		slots: [
			{
				time: "09:30",
				title: "河景慢醒",
				description: "入住 Mala Strana 艺宿，礼宾送上定制香氛与手冲。",
			},
			{
				time: "11:00",
				title: "私人玻璃工坊",
				description: "与第四代匠人共创杯具，AI 翻译术语并记录设计。",
			},
			{
				time: "19:00",
				title: "城堡夜行",
				description: "错峰穿行皇宫阶梯，捕捉暮色布拉格全景。",
			},
		],
	},
	{
		day: "DAY 2",
		title: "工坊联动 · 老城芯",
		focus: ["木艺共创", "匠人共食"],
		slots: [
			{
				time: "08:30",
				title: "咖啡巡礼",
				description: "AI 标记无麸质友好烘焙店，提供匠人早茶。",
			},
			{
				time: "13:30",
				title: "木艺共创",
				description: "进入 Kampa Maker Lab，完成旅行纪念音响外壳。",
			},
			{
				time: "18:30",
				title: "匠人共食",
				description: "封闭式晚宴，主厨以玻璃纹理为灵感设计菜单。",
			},
		],
	},
	{
		day: "DAY 3-5",
		title: "延展灵感 · 别样慢游",
		focus: ["城市微探险", "AI 实时微调"],
		slots: [
			{
				time: "全天",
				title: "河岸漫步 + 市集",
				description: "AI 实时推送本地 pop-up，留白 40% 供自由创作。",
			},
			{
				time: "晚上",
				title: "即兴音乐",
				description: "预约跨界音乐会，与当地编曲师同台 jam session。",
			},
		],
	},
];

function TypewriterReasoning({ text }: { text: string }) {
	const [displayedText, setDisplayedText] = useState("");

	useEffect(() => {
		let i = 0;
		const timer = setInterval(() => {
			setDisplayedText(text.slice(0, i));
			i += 1;
			if (i > text.length) {
				clearInterval(timer);
			}
		}, 30);

		return () => clearInterval(timer);
	}, [text]);

	return (
		<p className="text-xs text-slate-600 leading-relaxed min-h-[3em]">
			{displayedText}
			<span className="animate-pulse"> |</span>
		</p>
	);
}

export default function RouteResultPage() {
	const aiAnalysis =
		"根据您选择的【布拉格 · 沉浸慢游】与【手工工坊】偏好，AI 已重排 Day 1-2 匠人社区比例，并在 10:30-15:30 之间避开高峰游客。特别锁定查理大桥旁私人玻璃工作室，确保 1:2 导师陪同。";

	return (
		<div className="min-h-screen bg-slate-50 pb-28">
			<div className="bg-slate-900 text-white p-6 pt-12 rounded-b-[32px] shadow-2xl relative overflow-hidden">
				<div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-20 -mt-20 blur-3xl" />
				<div className="flex justify-between items-center mb-8 relative z-10">
					<Link href="/route">
						<Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
							<ChevronLeft className="w-6 h-6" />
						</Button>
					</Link>
					<div className="flex gap-2">
						<Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
							<Share2 className="w-5 h-5" />
						</Button>
						<Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
							<Download className="w-5 h-5" />
						</Button>
					</div>
				</div>
				<div className="space-y-4 relative z-10">
					<div className="flex items-center gap-2">
						<Badge className="bg-[#667eea] hover:bg-[#667eea] border-none text-white px-3">
							<Sparkles className="w-3 h-3 mr-1" /> AI 已定制
						</Badge>
						<Badge variant="outline" className="text-white/40 border-white/20 font-light">
							2026.05.15 出发
						</Badge>
					</div>
					<h1 className="text-3xl font-bold tracking-tight">布拉格 · 匠心艺游</h1>
					<div className="flex items-center gap-6 text-xs text-white/60">
						<span className="flex items-center gap-1.5">
							<Clock className="w-3.5 h-3.5" /> 5 天 4 晚
						</span>
						<span className="flex items-center gap-1.5">
							<MapPin className="w-3.5 h-3.5" /> 捷克 · 布拉格
						</span>
					</div>
				</div>
			</div>

			<div className="px-6 -mt-6 space-y-6 relative z-20">
				<Card className="border-none shadow-xl bg-white/90 backdrop-blur-md border border-white/40">
					<CardContent className="p-5 flex gap-4 items-start">
						<div className="bg-indigo-50 p-2.5 rounded-2xl shrink-0">
							<BrainCircuit className="w-6 h-6 text-[#667eea]" />
						</div>
						<div className="space-y-2">
							<h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">ai 推理摘要</h3>
							<TypewriterReasoning text={aiAnalysis} />
						</div>
					</CardContent>
				</Card>

				<div className="grid gap-3 md:grid-cols-3">
					{metaSummary.map((item) => (
						<Card key={item.label} className="border border-slate-200/70">
							<CardContent className="p-4 flex items-center gap-3">
								<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
									<item.icon className="w-5 h-5 text-slate-700" />
								</div>
								<div>
									<p className="text-xs uppercase tracking-wide text-slate-500">{item.label}</p>
									<p className="text-base font-semibold text-slate-900">{item.value}</p>
									<p className="text-xs text-slate-500 mt-1">{item.hint}</p>
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				<Card className="bg-white border border-slate-200/70">
					<CardContent className="p-5">
						<p className="text-xs uppercase tracking-[0.3em] text-slate-400">Service highlight</p>
						<div className="mt-4 grid gap-4 md:grid-cols-3">
							{serviceHighlights.map((item) => (
								<div key={item.title} className="flex items-start gap-3">
									<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
										<item.icon className="w-5 h-5 text-slate-700" />
									</div>
									<div>
										<h4 className="text-sm font-semibold text-slate-900">{item.title}</h4>
										<p className="text-xs text-slate-600 leading-relaxed">{item.detail}</p>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="px-6 mt-8 space-y-5">
				{dayPlans.map((plan) => (
					<Card key={plan.day} className="border border-slate-200/80">
						<CardContent className="p-5">
							<div className="flex flex-wrap items-center justify-between gap-3">
								<div>
									<p className="text-xs uppercase tracking-[0.3em] text-slate-400">{plan.day}</p>
									<h3 className="text-lg font-semibold text-slate-900">{plan.title}</h3>
								</div>
								<div className="flex flex-wrap gap-2">
									{plan.focus.map((tag) => (
										<Badge key={tag} variant="secondary" className="bg-slate-100 text-slate-700 border border-slate-200">
											{tag}
										</Badge>
									))}
								</div>
							</div>
							<div className="mt-4 space-y-3">
								{plan.slots.map((slot) => (
									<div key={`${plan.day}-${slot.time}-${slot.title}`} className="flex gap-3">
										<div className="w-16 text-xs font-semibold text-slate-500">{slot.time}</div>
										<div className="flex-1 border-l border-dashed border-slate-200 pl-4">
											<p className="text-sm font-semibold text-slate-900">{slot.title}</p>
											<p className="text-xs text-slate-600 leading-relaxed">{slot.description}</p>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				))}
			</div>
			</div>
	);
}
