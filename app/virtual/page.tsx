import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type SiteItem = {
  id: number;
  category: "all" | "history" | "culture";
  title: string;
  location: string;
  year: string;
  criteria: string;
  summary: string;
  image: string;
  imageSource: string;
  imageLicense: string;
  source: string;
};

const REAL_SITES: SiteItem[] = [
  {
    id: 1,
    category: "history",
    title: "Old Bridge Area of the Old City of Mostar",
    location: "波黑 · 莫斯塔尔",
    year: "2005",
    criteria: "(vi)",
    summary:
      "联合国教科文组织将其描述为多元文化城市聚落的代表，并强调古桥及古城是和解与共存的象征。",
    image: "/images/virtual/mostar.jpg",
    imageSource: "https://commons.wikimedia.org/wiki/File:Stari_Most22.jpg",
    imageLicense: "Wikimedia Commons（CC BY-SA，可商用）",
    source: "https://whc.unesco.org/en/list/946/",
  },
  {
    id: 2,
    category: "culture",
    title: "Historic Centre of Prague",
    location: "捷克 · 布拉格",
    year: "1992",
    criteria: "(ii)(iv)(vi)",
    summary:
      "UNESCO 认定其体现从中世纪持续演进的城市格局，并对中东欧城市发展产生长期影响。",
    image: "/images/virtual/prague.jpg",
    imageSource: "https://commons.wikimedia.org/wiki/File:Prague_old_town_square_panorama.jpg",
    imageLicense: "Wikimedia Commons（CC BY-SA，可商用）",
    source: "https://whc.unesco.org/en/list/616/",
  },
  {
    id: 3,
    category: "history",
    title: "Budapest, including the Banks of the Danube, the Buda Castle Quarter and Andrássy Avenue",
    location: "匈牙利 · 布达佩斯",
    year: "1987（2002年扩展）",
    criteria: "(ii)(iv)",
    summary:
      "该遗产地覆盖多瑙河两岸与布达城堡区，展示罗马、哥特到近代城市化的连续历史层次。",
    image: "/images/virtual/budapest.jpg",
    imageSource: "https://commons.wikimedia.org/wiki/File:Budapest_Hungary_08.jpg",
    imageLicense: "Wikimedia Commons（CC BY-SA，可商用）",
    source: "https://whc.unesco.org/en/list/400/",
  },
];

function SiteList({ items }: { items: SiteItem[] }) {
  return (
    <div className="grid gap-4">
      {items.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <div className="relative h-48 w-full">
            <Image src={item.image} alt={item.title} fill className="object-cover" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
            <div className="absolute left-4 bottom-4 right-4">
              <p className="text-white text-sm font-semibold line-clamp-2">{item.title}</p>
              <p className="text-white/85 text-xs mt-1">{item.location}</p>
            </div>
          </div>
          <CardHeader className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">世界遗产</Badge>
              <Badge variant="outline">列入年份：{item.year}</Badge>
              <Badge variant="outline">标准：{item.criteria}</Badge>
            </div>
            <CardTitle className="text-base leading-6">{item.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <p className="text-sm leading-6">{item.summary}</p>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm">
                <a href={item.source} target="_blank" rel="noreferrer">
                  查看 UNESCO 原文
                </a>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <a href={item.imageSource} target="_blank" rel="noreferrer">
                  图片来源
                </a>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">{item.imageLicense}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function VirtualPage() {
  return (
    <main className="min-h-screen pb-24">
      <div className="px-6 pt-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">虚拟漫游</h1>
          <p className="text-sm text-muted-foreground">
            页面内容基于 UNESCO World Heritage Centre 公开信息整理，便于快速了解中东欧代表性文化地标。
          </p>
          <p className="text-xs text-muted-foreground">
            图片来自 Wikimedia Commons（可免费商用，具体署名与条款以各图片页面为准）。
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="all">全部</TabsTrigger>
            <TabsTrigger value="history">历史建筑</TabsTrigger>
            <TabsTrigger value="culture">文化空间</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <SiteList items={REAL_SITES} />
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <SiteList items={REAL_SITES.filter((item) => item.category === "history")} />
          </TabsContent>

          <TabsContent value="culture" className="mt-4">
            <SiteList items={REAL_SITES.filter((item) => item.category === "culture")} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}