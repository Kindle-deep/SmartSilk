import { readFile } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

export const runtime = "nodejs";

type ErrorBody = { message: string };

const PUBLIC_DIR = path.join(process.cwd(), "public");

function jsonError(message: string, status: number) {
  const body: ErrorBody = { message };
  return Response.json(body, { status });
}

function parseQuality(value: string | null) {
  if (!value) {
    return 75;
  }

  const quality = Number(value);
  if (!Number.isInteger(quality) || quality < 1 || quality > 100) {
    return null;
  }

  return quality;
}

function parseWidth(value: string | null) {
  if (!value) {
    return undefined;
  }

  const width = Number(value);
  if (!Number.isInteger(width) || width < 1 || width > 4096) {
    return null;
  }

  return width;
}

function toAbsolutePublicPath(src: string) {
  const trimmed = src.trim();
  if (!trimmed.startsWith("/")) {
    return null;
  }

  const safeRelative = path.normalize(trimmed).replace(/^([/\\])+/, "");
  const absolutePath = path.resolve(PUBLIC_DIR, safeRelative);

  if (!absolutePath.startsWith(PUBLIC_DIR)) {
    return null;
  }

  return absolutePath;
}

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const src = searchParams.get("src");

  if (!src) {
    return jsonError("缺少 src 参数", 400);
  }

  const quality = parseQuality(searchParams.get("quality"));
  if (quality === null) {
    return jsonError("quality 需为 1-100 的整数", 400);
  }

  const width = parseWidth(searchParams.get("w"));
  if (width === null) {
    return jsonError("w 需为 1-4096 的整数", 400);
  }

  const absoluteImagePath = toAbsolutePublicPath(src);
  if (!absoluteImagePath) {
    return jsonError("src 仅支持 public 目录下的绝对路径，例如 /images/shop/a.jpg", 400);
  }

  try {
    const input = await readFile(absoluteImagePath);

    let transformer = sharp(input, { failOn: "none" }).rotate();
    if (width) {
      transformer = transformer.resize({ width, withoutEnlargement: true });
    }

    const output = await transformer.webp({ quality }).toBuffer();
    const payload = new Uint8Array(output);

    return new Response(payload, {
      status: 200,
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=31536000, immutable",
        Vary: "Accept",
      },
    });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "图片转换失败", 500);
  }
}
