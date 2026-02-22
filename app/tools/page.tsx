"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, CloudSun, PhoneCall, RefreshCw } from "lucide-react";

type WeatherData = {
	locationName: string;
	temperature: number;
	humidity: number;
	windSpeed: number;
	weatherCode: string;
	weatherText: string;
};

type HotlineItem = {
	label: string;
	phone: string;
	note: string;
};

type HotlineCountry = {
	country: string;
	code: string;
	tourismComplaint: HotlineItem[];
	emergencyRescue: HotlineItem[];
};

type CurrencyOption = {
	code: string;
	name: string;
};

const DEFAULT_CURRENCIES: CurrencyOption[] = [
	{ code: "CNY", name: "Chinese Yuan" },
	{ code: "USD", name: "US Dollar" },
	{ code: "EUR", name: "Euro" },
	{ code: "JPY", name: "Japanese Yen" },
	{ code: "GBP", name: "Pound Sterling" },
	{ code: "RUB", name: "Russian Ruble" },
	{ code: "TRY", name: "Turkish Lira" },
	{ code: "AED", name: "UAE Dirham" },
	{ code: "SGD", name: "Singapore Dollar" },
	{ code: "HKD", name: "Hong Kong Dollar" },
];

const HOTLINE_DATA: HotlineCountry[] = [
	{
		country: "中国",
		code: "CN",
		tourismComplaint: [
			{ label: "全国旅游服务热线", phone: "12345", note: "可转旅游投诉建议" },
			{ label: "消费者投诉热线", phone: "12315", note: "旅游消费纠纷可咨询" },
		],
		emergencyRescue: [
			{ label: "报警", phone: "110", note: "警务紧急求助" },
			{ label: "医疗急救", phone: "120", note: "紧急医疗救援" },
			{ label: "火警", phone: "119", note: "火灾及抢险" },
		],
	},
	{
		country: "日本",
		code: "JP",
		tourismComplaint: [
			{ label: "Japan Visitor Hotline", phone: "+81-50-3816-2787", note: "24小时多语种旅游协助" },
		],
		emergencyRescue: [
			{ label: "报警", phone: "110", note: "警察求助" },
			{ label: "急救/消防", phone: "119", note: "医疗与消防" },
		],
	},
	{
		country: "泰国",
		code: "TH",
		tourismComplaint: [
			{ label: "Tourist Police", phone: "1155", note: "旅游警察热线" },
			{ label: "TAT Call Center", phone: "1672", note: "旅游信息与投诉引导" },
		],
		emergencyRescue: [
			{ label: "报警", phone: "191", note: "警方紧急求助" },
			{ label: "医疗急救", phone: "1669", note: "急救中心" },
			{ label: "消防", phone: "199", note: "火警救援" },
		],
	},
	{
		country: "土耳其",
		code: "TR",
		tourismComplaint: [
			{ label: "Tourism Info/Complaint", phone: "176", note: "旅游咨询与投诉转接" },
		],
		emergencyRescue: [
			{ label: "统一紧急号码", phone: "112", note: "医疗、消防、警务统一入口" },
		],
	},
	{
		country: "阿联酋",
		code: "AE",
		tourismComplaint: [
			{ label: "Dubai Consumer", phone: "+971-600-545555", note: "旅游消费争议可咨询" },
		],
		emergencyRescue: [
			{ label: "报警", phone: "999", note: "警方紧急求助" },
			{ label: "医疗急救", phone: "998", note: "紧急医疗" },
			{ label: "消防", phone: "997", note: "火灾救援" },
		],
	},
];

export default function ToolsPage() {
	const [city, setCity] = useState("北京");
	const [weather, setWeather] = useState<WeatherData | null>(null);
	const [weatherLoading, setWeatherLoading] = useState(false);
	const [weatherError, setWeatherError] = useState("");

	const [amount, setAmount] = useState("100");
	const [fromCurrency, setFromCurrency] = useState("USD");
	const [toCurrency, setToCurrency] = useState("CNY");
	const [exchangeResult, setExchangeResult] = useState<number | null>(null);
	const [exchangeDate, setExchangeDate] = useState("");
	const [exchangeLoading, setExchangeLoading] = useState(false);
	const [exchangeError, setExchangeError] = useState("");
	const [currencies, setCurrencies] = useState<CurrencyOption[]>(DEFAULT_CURRENCIES);
	const [currencyListError, setCurrencyListError] = useState("");

	const [selectedCountry, setSelectedCountry] = useState("CN");

	const hotlineInfo = useMemo(
		() => HOTLINE_DATA.find((item) => item.code === selectedCountry) || HOTLINE_DATA[0],
		[selectedCountry]
	);

	useEffect(() => {
		let active = true;

		const loadCurrencies = async () => {
			try {
				const response = await fetch("/api/exchange/currencies");
				if (!response.ok) {
					throw new Error("币种列表加载失败");
				}

				const data = (await response.json()) as { currencies?: CurrencyOption[] };
				if (!active || !data.currencies || data.currencies.length === 0) {
					return;
				}

				setCurrencies(data.currencies);
				const currencyCodes = new Set(data.currencies.map((item) => item.code));

				if (!currencyCodes.has(fromCurrency)) {
					setFromCurrency(data.currencies[0].code);
				}
				if (!currencyCodes.has(toCurrency)) {
					setToCurrency(data.currencies[1]?.code || data.currencies[0].code);
				}
				setCurrencyListError("");
			} catch {
				if (active) {
					setCurrencyListError("币种列表在线加载失败，已使用默认币种");
				}
			}
		};

		loadCurrencies();

		return () => {
			active = false;
		};
	}, []);

	const searchWeather = async () => {
		if (!city.trim()) {
			setWeatherError("请输入城市名称");
			return;
		}

		setWeatherLoading(true);
		setWeatherError("");

		try {
			const weatherRes = await fetch(`/api/weather?city=${encodeURIComponent(city.trim())}`);
			if (!weatherRes.ok) {
				const errorJson = (await weatherRes.json().catch(() => null)) as
					| { message?: string }
					| null;
				throw new Error(errorJson?.message || "天气接口请求失败");
			}

			const weatherJson = (await weatherRes.json()) as WeatherData;
			setWeather(weatherJson);
		} catch (error) {
			setWeather(null);
			setWeatherError(error instanceof Error ? error.message : "天气查询失败");
		} finally {
			setWeatherLoading(false);
		}
	};

	const convertCurrency = async () => {
		const num = Number(amount);
		if (!Number.isFinite(num) || num <= 0) {
			setExchangeError("请输入有效金额");
			return;
		}

		setExchangeLoading(true);
		setExchangeError("");
		try {
			const res = await fetch(
				`/api/exchange?from=${encodeURIComponent(fromCurrency)}&to=${encodeURIComponent(toCurrency)}&amount=${encodeURIComponent(String(num))}`
			);
			if (!res.ok) {
				const errorJson = (await res.json().catch(() => null)) as
					| { message?: string }
					| null;
				throw new Error(errorJson?.message || "汇率接口请求失败");
			}

			const data = (await res.json()) as { result?: number; updatedDate?: string };
			const value = data.result;
			if (typeof value !== "number") {
				throw new Error("未获取到汇率结果");
			}

			setExchangeResult(value);
			setExchangeDate(data.updatedDate || "");
		} catch (error) {
			setExchangeResult(null);
			setExchangeDate("");
			setExchangeError(error instanceof Error ? error.message : "汇率换算失败");
		} finally {
			setExchangeLoading(false);
		}
	};

	return (
		<div className="mx-auto flex w-full max-w-4xl flex-col gap-4 p-4 pb-24">
			<div className="space-y-2">
				<h1 className="text-2xl font-semibold">旅行工具箱</h1>
				<p className="text-sm text-muted-foreground">
					提供天气查询、汇率换算与当地旅游投诉/紧急救援热线。
				</p>
			</div>

			<Tabs defaultValue="weather" className="w-full">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="weather">天气</TabsTrigger>
					<TabsTrigger value="exchange">汇率</TabsTrigger>
					<TabsTrigger value="hotline">热线</TabsTrigger>
				</TabsList>

				<TabsContent value="weather" className="mt-4">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<CloudSun className="size-4" /> 当地天气查询
							</CardTitle>
							<CardDescription>输入城市名称，获取实时天气信息。</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex flex-col gap-2 sm:flex-row">
								<Input
									placeholder="例如：北京 / Tokyo / Dubai"
									value={city}
									onChange={(event) => setCity(event.target.value)}
								/>
								<Button onClick={searchWeather} disabled={weatherLoading}>
									{weatherLoading ? "查询中..." : "查询天气"}
								</Button>
							</div>

							{weatherError ? (
								<div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
									<AlertTriangle className="size-4" />
									<span>{weatherError}</span>
								</div>
							) : null}

							{weather ? (
								<div className="space-y-3 rounded-lg border p-4">
									<div className="flex flex-wrap items-center gap-2">
										<Badge>{weather.locationName}</Badge>
										<Badge variant="secondary">{weather.weatherText}</Badge>
									</div>
									<Separator />
									<div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
										<div>
											<p className="text-muted-foreground">温度</p>
											<p className="font-medium">{weather.temperature}°C</p>
										</div>
										<div>
											<p className="text-muted-foreground">湿度</p>
											<p className="font-medium">{weather.humidity}%</p>
										</div>
										<div>
											<p className="text-muted-foreground">风速</p>
											<p className="font-medium">{weather.windSpeed} km/h</p>
										</div>
										<div>
											<p className="text-muted-foreground">天气码</p>
											<p className="font-medium">{weather.weatherCode}</p>
										</div>
									</div>
								</div>
							) : null}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="exchange" className="mt-4">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<RefreshCw className="size-4" /> 汇率换算
							</CardTitle>
							<CardDescription>按最新公开汇率进行金额换算。</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 gap-2 sm:grid-cols-4">
								<Input
									type="number"
									min="0"
									step="0.01"
									value={amount}
									onChange={(event) => setAmount(event.target.value)}
									placeholder="金额"
								/>

								<select
									className="h-9 rounded-md border bg-background px-3 text-sm"
									value={fromCurrency}
									onChange={(event) => setFromCurrency(event.target.value)}
								>
									{currencies.map((currency) => (
										<option key={currency.code} value={currency.code}>
											{currency.code}
										</option>
									))}
								</select>

								<select
									className="h-9 rounded-md border bg-background px-3 text-sm"
									value={toCurrency}
									onChange={(event) => setToCurrency(event.target.value)}
								>
									{currencies.map((currency) => (
										<option key={currency.code} value={currency.code}>
											{currency.code}
										</option>
									))}
								</select>

								<Button onClick={convertCurrency} disabled={exchangeLoading || fromCurrency === toCurrency}>
									{exchangeLoading ? "换算中..." : "立即换算"}
								</Button>
							</div>

							{currencyListError ? (
								<p className="text-xs text-muted-foreground">{currencyListError}</p>
							) : null}

							{exchangeError ? (
								<div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
									<AlertTriangle className="size-4" />
									<span>{exchangeError}</span>
								</div>
							) : null}

							{exchangeResult !== null ? (
								<div className="rounded-lg border p-4 text-sm">
									<p className="text-muted-foreground">换算结果</p>
									<p className="mt-1 text-lg font-semibold">
										{amount} {fromCurrency} = {exchangeResult.toFixed(2)} {toCurrency}
									</p>
									{exchangeDate ? (
										<p className="mt-1 text-xs text-muted-foreground">汇率日期：{exchangeDate}</p>
									) : null}
								</div>
							) : null}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="hotline" className="mt-4">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<PhoneCall className="size-4" /> 旅游投诉与紧急救援热线
							</CardTitle>
							<CardDescription>按国家查看常用求助电话，出行前建议再次核对当地官方信息。</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<select
								className="h-9 w-full rounded-md border bg-background px-3 text-sm"
								value={selectedCountry}
								onChange={(event) => setSelectedCountry(event.target.value)}
							>
								{HOTLINE_DATA.map((item) => (
									<option key={item.code} value={item.code}>
										{item.country}
									</option>
								))}
							</select>

							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div className="rounded-lg border p-4">
									<p className="mb-3 font-medium">旅游投诉/咨询</p>
									<div className="space-y-3">
										{hotlineInfo.tourismComplaint.map((item) => (
											<div key={item.label} className="rounded-md border p-3">
												<p className="text-sm font-medium">{item.label}</p>
												<p className="text-sm">{item.phone}</p>
												<p className="text-xs text-muted-foreground">{item.note}</p>
											</div>
										))}
									</div>
								</div>

								<div className="rounded-lg border p-4">
									<p className="mb-3 font-medium">紧急救援</p>
									<div className="space-y-3">
										{hotlineInfo.emergencyRescue.map((item) => (
											<div key={item.label} className="rounded-md border p-3">
												<p className="text-sm font-medium">{item.label}</p>
												<p className="text-sm">{item.phone}</p>
												<p className="text-xs text-muted-foreground">{item.note}</p>
											</div>
										))}
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
