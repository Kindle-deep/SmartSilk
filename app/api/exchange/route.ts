import { NextResponse } from "next/server";

type GetGeoApiConvertResponse = {
  status?: string;
  updated_date?: string;
  rates?: Record<
    string,
    {
      currency_name?: string;
      rate?: string;
      rate_for_amount?: string;
    }
  >;
  error?: {
    message?: string;
    code?: string;
  };
};

export async function GET(request: Request) {
  const apiKey = process.env.GETGEOAPI_KEY;
  const searchParams = new URL(request.url).searchParams;

  const from = searchParams.get("from")?.trim().toUpperCase();
  const to = searchParams.get("to")?.trim().toUpperCase();
  const amount = searchParams.get("amount")?.trim();

  if (!apiKey) {
    return NextResponse.json({ message: "服务端未配置汇率 API Key" }, { status: 500 });
  }

  if (!from || !to || !amount) {
    return NextResponse.json({ message: "缺少汇率查询参数" }, { status: 400 });
  }

  const amountNumber = Number(amount);
  if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
    return NextResponse.json({ message: "金额参数无效" }, { status: 400 });
  }

  try {
    const url =
      `https://api.getgeoapi.com/v2/currency/convert` +
      `?api_key=${encodeURIComponent(apiKey)}` +
      `&from=${encodeURIComponent(from)}` +
      `&to=${encodeURIComponent(to)}` +
      `&amount=${encodeURIComponent(String(amountNumber))}` +
      `&format=json`;

    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`汇率接口请求失败: ${response.status}`);
    }

    const data = (await response.json()) as GetGeoApiConvertResponse;

    if (data.status !== "success") {
      throw new Error(data.error?.message || "汇率查询失败");
    }

    const targetRate = data.rates?.[to]?.rate_for_amount;
    const convertedAmount = Number(targetRate);

    if (!Number.isFinite(convertedAmount)) {
      throw new Error("未获取到汇率结果");
    }

    return NextResponse.json({
      result: convertedAmount,
      updatedDate: data.updated_date || "",
    });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "汇率换算失败" },
      { status: 500 }
    );
  }
}
