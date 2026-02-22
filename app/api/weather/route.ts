import { NextResponse } from "next/server";

type QWeatherCityLookupResponse = {
  code: string;
  location?: Array<{
    id: string;
    name: string;
    adm1?: string;
    country?: string;
  }>;
};

type QWeatherNowResponse = {
  code: string;
  now?: {
    temp: string;
    humidity: string;
    windSpeed: string;
    icon: string;
    text: string;
  };
};

export async function GET(request: Request) {
  const key = process.env.QWEATHER_API_KEY;
  const searchParams = new URL(request.url).searchParams;
  const city = searchParams.get("city")?.trim();

  if (!key) {
    return NextResponse.json({ message: "服务端未配置和风天气 Key" }, { status: 500 });
  }

  if (!city) {
    return NextResponse.json({ message: "缺少城市参数" }, { status: 400 });
  }

  try {
    const lookupUrl = `https://geoapi.qweather.com/v2/city/lookup?location=${encodeURIComponent(city)}&number=1&lang=zh&key=${encodeURIComponent(key)}`;
    const lookupRes = await fetch(lookupUrl, { cache: "no-store" });
    if (!lookupRes.ok) {
      throw new Error(`城市查询失败: ${lookupRes.status}`);
    }

    const lookupData = (await lookupRes.json()) as QWeatherCityLookupResponse;
    const location = lookupData.location?.[0];
    if (lookupData.code !== "200" || !location?.id) {
      return NextResponse.json({ message: "未找到该城市" }, { status: 404 });
    }

    const nowUrl = `https://devapi.qweather.com/v7/weather/now?location=${encodeURIComponent(location.id)}&lang=zh&key=${encodeURIComponent(key)}`;
    const nowRes = await fetch(nowUrl, { cache: "no-store" });
    if (!nowRes.ok) {
      throw new Error(`天气查询失败: ${nowRes.status}`);
    }

    const nowData = (await nowRes.json()) as QWeatherNowResponse;
    if (nowData.code !== "200" || !nowData.now) {
      throw new Error("天气数据为空");
    }

    return NextResponse.json({
      locationName: `${location.name}${location.adm1 ? ` · ${location.adm1}` : ""}${location.country ? ` · ${location.country}` : ""}`,
      temperature: Number(nowData.now.temp),
      humidity: Number(nowData.now.humidity),
      windSpeed: Number(nowData.now.windSpeed),
      weatherCode: nowData.now.icon,
      weatherText: nowData.now.text,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "天气查询失败" },
      { status: 500 }
    );
  }
}
