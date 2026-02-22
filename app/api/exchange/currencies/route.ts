import { NextResponse } from "next/server";

type GetGeoApiCurrencyListResponse = {
  status?: string;
  currencies?: Record<string, string>;
  error?: {
    message?: string;
    code?: string;
  };
};

export async function GET() {
  const apiKey = process.env.GETGEOAPI_KEY;

  if (!apiKey) {
    return NextResponse.json({ message: "服务端未配置汇率 API Key" }, { status: 500 });
  }

  try {
    const url =
      `https://api.getgeoapi.com/v2/currency/list` +
      `?api_key=${encodeURIComponent(apiKey)}` +
      `&format=json`;

    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`币种列表请求失败: ${response.status}`);
    }

    const data = (await response.json()) as GetGeoApiCurrencyListResponse;
    if (data.status !== "success" || !data.currencies) {
      throw new Error(data.error?.message || "获取币种列表失败");
    }

    const currencies = Object.entries(data.currencies)
      .map(([code, name]) => ({ code, name }))
      .sort((left, right) => left.code.localeCompare(right.code));

    return NextResponse.json({ currencies });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "获取币种列表失败" },
      { status: 500 }
    );
  }
}
