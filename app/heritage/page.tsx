"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  MapPin,
  Calendar,
  Sparkles,
  ArrowUpRight,
  UserCircle2,
  Info,
  Lightbulb,
  Compass,
  Heart,
  Share2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
// 引入 shadcn 的 Drawer 组件
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

// 这里是你提供的完整 heritageList 数据
const heritageList = [
  {
    id: 1,
    country: "阿尔巴尼亚",
    name: "民间低声部复调音乐",
    year: "2008",
    category: "音乐舞蹈",
    description: "南部托斯克斯人与来布斯人的平行复调，低音声部'Iso'源自拜占庭教堂音乐。",
    tags: ["复调音乐", "男性表演", "婚丧节日"],
    fullDescription: "阿尔巴尼亚传统复调音乐分南北两大风格，南部托斯克斯人与来布斯人的平行复调为其核心。低音声部'Iso'源自拜占庭教堂音乐，有二至四声部结构，多为男性表演，广泛用于婚丧、丰收、宗教等民俗节日。",
    value: "体现了阿尔巴尼亚南部社群的文化认同，是巴尔干地区独特的复调音乐传统。",
    inheritance: "家庭与社区口传身教，近年通过文化旅游与研究推动传承。",
    tips: "可在吉诺卡斯特拉等民俗节日现场聆听，或前往地拉那国家民俗博物馆了解。",
    image: "/images/heritage/albania_music.jpg"
  },
    {
        id: 2,
        country: "波黑",
        flag: "/images/flags/bosnia.png",
        name: "Zmijanje刺绣",
        year: "2014",
        category: "手工艺",
        description: "白色底布配深蓝线十字绣，即兴几何纹样装饰女装与家居织物。",
        tags: ["十字绣", "女性传承", "社群创作"],
        fullDescription: "波黑Zmijanje刺绣是贾察山地区妇女传承的传统手工艺，以白色底布配植物染深蓝线，用十字绣绣制即兴几何纹样。传统用于装饰女装（含婚纱）、头巾、床单等。图案丰富度曾体现妇女社会地位，多为妇女群体边绣边唱边聊的集体创作。",
        value: "兼具艺术价值与社群凝聚意义，是波黑女性文化的独特表达。",
        inheritance: "技艺靠口头与实操传承，绣者会灵活改编图案。",
        tips: "萨拉热窝老城的手工艺品市场可购买到传统刺绣作品。",
        image: "/images/heritage/bosnia_embroidery.jpg"
      },
      {
        id: 3,
        country: "保加利亚",
        flag: "/images/flags/bulgaria.png",
        name: "奇普罗夫齐地毯织造",
        year: "2014",
        category: "手工艺",
        description: "东北部妇女传承的手工技艺，以对称几何纹样为特色，织前祈祷织中唱歌。",
        tags: ["地毯织造", "女性技艺", "文化认同"],
        fullDescription: "保加利亚奇普罗夫齐传统地毯织造是该国东北部奇普罗夫齐镇妇女传承的手工技艺。以立式手摇织机织双面平毯，原料多为羊毛，天然染料呈柔和色调。以对称几何纹样为特色，织前祈祷，织中唱歌讲故事，完工后裹婴祈健康。",
        value: "深深融入当地社会文化生活，是保加利亚文化遗产的重要组成部分。",
        inheritance: "由母辈向女儿口传身教，家庭内部代代相传。",
        tips: "索非亚国家民族志博物馆展示精美地毯，奇普罗夫齐镇有织造工作坊体验。",
        image: "/images/heritage/bulgaria_carpet.jpg"
      },
      {
        id: 4,
        country: "克罗地亚",
        flag: "/images/flags/croatia.png",
        name: "儿童木制玩具制作",
        year: "2009",
        category: "手工艺",
        description: "哈瓦斯科-扎国基村民传承的木质玩具手工制作，男性雕刻女性绘制。",
        tags: ["木质玩具", "手工制作", "儿童教育"],
        fullDescription: "克罗地亚北部哈瓦斯科-扎国基的朝圣路线沿线，村民传承着儿童木质玩具手工制作工艺。当地男性采来柳树、酸橙树等软木雕刻，女性用天然涂料即兴绘制花卉、几何图案。玩具样式百年间基本不变，涵盖哨子、木马等经典款，也新增了小汽车等现代造型。",
        value: "既是传统手工艺，也是乡村儿童的音乐启蒙教具，深受当地人喜爱。",
        inheritance: "技艺世代相传，在家庭和社区中教授。",
        tips: "萨格勒布手工艺品市场可购买，部分教区集会也有销售。",
        image: "/images/heritage/croatia_toy.jpg"
      },
      {
        id: 5,
        country: "土耳其",
        flag: "/images/flags/turkey.png",
        name: "土耳其咖啡文化",
        year: "2013",
        category: "饮食文化",
        description: "首个饮品类非遗，铜壶慢煮细磨咖啡，配咖啡渣占卜特色仪式。",
        tags: ["咖啡文化", "社交仪式", "传统饮品"],
        fullDescription: "土耳其咖啡文化是首个入选UNESCO的饮品类非遗，16世纪源自奥斯曼帝国。核心是用铜壶Cezve小火慢煮细磨咖啡粉，不滤渣盛于小杯，配清水与软糖。饮用前先喝水净味蕾，仪式渗透订婚、节庆等场合，咖啡渣占卜是其特色。",
        value: "象征土耳其的好客、友谊与高雅生活方式，是重要的社交媒介。",
        inheritance: "靠家庭与社区口传身教，咖啡馆是主要传承场所。",
        tips: "伊斯坦布尔老城咖啡馆可体验完整仪式，大巴扎有传统咖啡器具出售。",
        image: "/images/heritage/turkey_coffee.jpg"
      },
      {
        id: 6,
        country: "意大利",
        flag: "/images/flags/italy.png",
        name: "克雷莫纳小提琴制作",
        year: "2012",
        category: "手工艺",
        description: "16世纪发端，斯特拉迪瓦里等大师铸就传奇，纯手工制作独一无二。",
        tags: ["小提琴", "手工制作", "音乐艺术"],
        fullDescription: "意大利克雷莫纳传统小提琴制作技艺16世纪发端，阿玛蒂、斯特拉迪瓦里等大师铸就传奇。核心为纯手工无工业材料，以云杉面板、枫木背侧板，经自然风干，围绕内模手工塑装70余木件，按声学特性精修，每把琴独一无二。",
        value: "兼具声学与工艺价值，是克雷莫纳文化认同与艺术凝聚的核心标志。",
        inheritance: "靠制琴学校+工坊师徒制传承，传统技法代代相传。",
        tips: "克雷莫纳小提琴博物馆展示名琴，部分工坊可预约参观制作过程。",
        image: "/images/heritage/italy_violin.jpg"
      },
      {
        id: 7,
        country: "波兰",
        flag: "/images/flags/poland.png",
        name: "树林养蜂文化",
        year: "2020",
        category: "传统知识",
        description: "森林地区树木蜂房中繁育野生蜜蜂的知识、技能、仪式和信仰。",
        tags: ["养蜂", "传统知识", "生态保护"],
        fullDescription: "树林养蜂文化涉及与森林地区的树木蜂房或原木蜂房中繁育野生蜜蜂的有关知识、技能、做法、仪式和信仰。树林养蜂人以一种特殊的方式照养蜜蜂，尽可能减少对其自然生命周期的干扰。这种文化催生了多种社会实践，以及烹饪和医学传统。",
        value: "培养团体归属感，提高对环境责任的共同认知，是可持续生计的典范。",
        inheritance: "主要在树林养蜂家庭内部和兄弟之间进行传承。",
        tips: "波兰比亚沃维耶扎原始森林周边可参观传统养蜂，品尝天然蜂蜜产品。",
        image: "/images/heritage/poland_beekeeping.jpg"
      },
      {
        id: 8,
        country: "塞尔维亚",
        flag: "/images/flags/serbia.png",
        name: "Slava家庭守护神纪念日",
        year: "2014",
        category: "节庆仪式",
        description: "东正教家庭守护神纪念日，塞尔维亚核心文化标识，点圣烛制蛋糕仪式。",
        tags: ["家庭节日", "宗教仪式", "社群凝聚"],
        fullDescription: "塞尔维亚Slava是东正教家庭守护神纪念日，是塞尔维亚核心文化标识。守护圣徒多从父系继承，常见如圣尼古拉、圣乔治等。仪式含点圣烛、主妇制装饰Slava蛋糕，浇酒并画十字切块，无血献祭与宴请亲友。",
        value: "以家庭为单位传承，是社群凝聚与文化认同的核心载体。",
        inheritance: "家庭内部代代相传，每个塞尔维亚家庭都有自己的Slava传统。",
        tips: "每年11月至次年1月是Slava集中期，可受邀体验塞尔维亚家庭的传统庆祝。",
        image: "/images/heritage/serbia_slava.jpg"
      },
      {
        id: 9,
        country: "捷克",
        flag: "/images/flags/czech.png",
        name: "捷克新兵舞",
        year: "2008",
        category: "音乐舞蹈",
        description: "斯洛伐克南摩拉维亚男子即兴舞蹈，起源于18世纪军队招募舞蹈形式。",
        tags: ["男子舞蹈", "即兴表演", "社区庆祝"],
        fullDescription: "斯洛伐克新兵舞是斯洛伐克南摩拉维亚、捷克林兹地区男子表演的即兴舞蹈，起源于18世纪军队招募的舞蹈形式。舞蹈以新匈牙利歌曲伴奏，分歌曲、慢舞、快舞三部分，无严格编舞，是舞者的自发表达，含跳跃竞赛等竞技元素。",
        value: "当地风俗、仪式、庆祝的核心部分，也登上国际民间艺术节舞台。",
        inheritance: "各乡镇民间舞团演绎传承，在社区庆祝活动中教授年轻人。",
        tips: "夏季hody社区庆祝活动中可观赏现场表演，布拉格民俗节也有展示。",
        image: "/images/heritage/czech_dance.jpg"
      }
];

const CATEGORIES = ["全部", "手工艺", "音乐舞蹈", "饮食文化", "节庆仪式", "传统知识"];

export default function HeritagePage() {
  const [activeTab, setActiveTab] = useState("全部");
  const [selectedItem, setSelectedItem] = useState<typeof heritageList[0] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredHeritage = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    return heritageList.filter((item) => {
      const matchCategory = activeTab === "全部" || item.category === activeTab;
      const searchableText = [
        item.name,
        item.country,
        item.description,
        item.fullDescription,
        ...(item.tags ?? []),
      ]
        .join(" ")
        .toLowerCase();
      const matchKeyword = !keyword || searchableText.includes(keyword);
      return matchCategory && matchKeyword;
    });
  }, [activeTab, searchTerm]);

  const topTags = useMemo(() => {
    const tagMap = heritageList
      .flatMap((item) => item.tags ?? [])
      .reduce<Record<string, number>>((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {});
    return Object.entries(tagMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([tag]) => tag);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 pb-32">
      <section className="mx-4 mt-6 rounded-[28px] border border-slate-200/60 bg-white/80 p-4 shadow-sm sm:mx-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="h-12 w-full rounded-2xl border-slate-200 bg-white pl-12 text-sm"
            placeholder="搜索国家、项目或标签"
          />
        </div>
      </section>

      <nav className="relative z-20 mt-4 flex gap-3 overflow-x-auto px-4 pb-6 sm:px-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`whitespace-nowrap rounded-2xl border px-6 py-3 text-xs font-bold shadow-md transition ${
              activeTab === cat
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-500 hover:border-slate-400"
            }`}
          >
            {cat}
          </button>
        ))}
      </nav>

      <section className="mx-4 mb-8 space-y-3 rounded-[28px] border border-slate-200/80 bg-white/80 px-5 py-4 shadow-sm sm:mx-6">
        <p className="text-[11px] font-semibold tracking-[0.2em] text-slate-500">热门标签</p>
        <div className="flex flex-wrap gap-2">
          {topTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchTerm(tag)}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600 transition hover:bg-emerald-50"
            >
              #{tag}
            </button>
          ))}
        </div>
      </section>

      <main className="grid gap-6 px-4 sm:grid-cols-2 sm:px-6 xl:grid-cols-3">
        {filteredHeritage.length === 0 && (
          <div className="col-span-full rounded-3xl border border-dashed border-slate-300 bg-white/80 px-8 py-16 text-center text-slate-500 shadow-sm">
            <p className="text-base font-semibold">未找到匹配的项目</p>
            <p className="mt-2 text-sm text-slate-400">请尝试更换筛选条件或使用不同的关键词。</p>
          </div>
        )}

        {filteredHeritage.map((item) => (
          <Drawer key={item.id}>
            {/* 使用 DrawerTrigger 包裹卡片 */}
            <DrawerTrigger asChild>
              <Card
                className="group overflow-hidden rounded-[32px] border border-transparent bg-white shadow-lg transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-2xl"
                onClick={() => setSelectedItem(item)}
              >
                <div className="relative aspect-[4/3]">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                  <div className="absolute bottom-4 left-5 right-5 text-white">
                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-white/70">
                      <Badge className="bg-white/15 text-[10px] uppercase tracking-wide text-white" variant="secondary">
                        {item.category}
                      </Badge>
                      <span className="flex items-center gap-1 text-white/70">
                        <Calendar className="h-3 w-3" /> {item.year}
                      </span>
                    </div>
                    <h3 className="mt-2 text-xl font-bold">{item.name}</h3>
                    <p className="mt-1 flex items-center gap-1 text-xs text-white/80">
                      <MapPin className="h-3 w-3" /> {item.country}
                    </p>
                  </div>
                </div>
                <CardContent className="space-y-4 p-5">
                  <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {(item.tags ?? []).slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-[11px] text-slate-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <UserCircle2 className="h-3.5 w-3.5" /> 传承人网络
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-slate-400 transition group-hover:text-emerald-500" />
                  </div>
                </CardContent>
              </Card>
            </DrawerTrigger>

            {/* 抽屉内容详情 */}
            <DrawerContent className="max-h-[92vh] rounded-t-[40px] border-none bg-white">
              <div className="mx-auto w-12 h-1.5 rounded-full bg-slate-200 mt-4 mb-2" />
              
              {selectedItem && (
                <div className="overflow-y-auto px-6 pb-12">
                  <DrawerHeader className="px-0 py-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <Badge className="bg-indigo-50 text-indigo-600 border-none hover:bg-indigo-50 uppercase text-[10px] tracking-widest px-2 py-0.5">
                          {selectedItem.category}
                        </Badge>
                        <DrawerTitle className="text-2xl font-black text-slate-900 pt-2 leading-tight">
                          {selectedItem.name}
                        </DrawerTitle>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="rounded-full bg-slate-50"><Share2 className="w-4 h-4 text-slate-400" /></Button>
                        <Button variant="ghost" size="icon" className="rounded-full bg-slate-50"><Heart className="w-4 h-4 text-slate-400" /></Button>
                      </div>
                    </div>
                  </DrawerHeader>

                  <div className="space-y-8">
                    {/* 顶部图片展示 */}
                    <div className="relative h-56 w-full rounded-[32px] overflow-hidden shadow-inner">
                      <Image src={selectedItem.image} alt={selectedItem.name} fill className="object-cover" />
                      <div className="absolute top-4 left-4">
                         <Badge className="bg-black/20 backdrop-blur-md border-none text-white text-[10px]">
                           <Calendar className="w-3 h-3 mr-1" /> {selectedItem.year} 年入选
                         </Badge>
                      </div>
                    </div>

                    {/* 详细描述 */}
                    <section className="space-y-3">
                      <div className="flex items-center gap-2 text-slate-900 font-bold">
                        <Info className="w-4 h-4 text-indigo-500" /> 档案详述
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {selectedItem.fullDescription}
                      </p>
                    </section>

                    {/* 价值与建议 - 左右并排 */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-3xl bg-amber-50/50 border border-amber-100">
                         <h4 className="text-xs font-bold text-amber-700 mb-1 flex items-center gap-1">
                           <Sparkles className="w-3 h-3" /> 文化价值
                         </h4>
                         <p className="text-[11px] text-amber-900/70 leading-normal">{selectedItem.value}</p>
                      </div>
                      <div className="p-4 rounded-3xl bg-blue-50/50 border border-blue-100">
                         <h4 className="text-xs font-bold text-blue-700 mb-1 flex items-center gap-1">
                           <Compass className="w-3 h-3" /> 体验建议
                         </h4>
                         <p className="text-[11px] text-blue-900/70 leading-normal">{selectedItem.tips}</p>
                      </div>
                    </div>

                    {/* 传承现状 */}
                    <div className="p-5 rounded-3xl bg-slate-900 text-white relative overflow-hidden">
                      <Lightbulb className="absolute -right-2 -top-2 w-16 h-16 text-white/5" />
                      <h4 className="text-xs font-bold text-indigo-300 mb-2">传承现状</h4>
                      <p className="text-xs text-white/70 leading-relaxed">{selectedItem.inheritance}</p>
                    </div>
                  </div>

                  <DrawerFooter className="px-0 pt-8 flex-row gap-3">
                    <Link href="/route" className="flex-1">
                      <Button className="w-full h-12 bg-slate-900 text-white rounded-xl font-bold">
                        加入我的 AI 行程
                      </Button>
                    </Link>
                    <DrawerClose asChild>
                      <Button variant="outline" className="h-12 px-6 rounded-xl border-slate-200 text-slate-500">
                        关闭
                      </Button>
                    </DrawerClose>
                  </DrawerFooter>
                </div>
              )}
            </DrawerContent>
          </Drawer>
        ))}
      </main>
    </div>
  );
}