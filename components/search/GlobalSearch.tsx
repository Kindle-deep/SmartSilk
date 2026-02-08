"use client";

import * as React from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Search, Map, ShoppingBag, Globe, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export function GlobalSearch() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  // 监听快捷键 Cmd+K 或 Ctrl+K (适配 Web 端习惯)
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <>
      {/* 触发器：可以放在首页或导航栏 */}
      <div 
        onClick={() => setOpen(true)}
        className="relative w-full cursor-pointer"
      >
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <div className="w-full h-11 pl-10 pr-4 flex items-center rounded-full bg-slate-100 text-slate-400 text-sm border-none">
          搜索非遗、路线、文创...
          <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="输入关键字搜索..." />
        <CommandList>
          <CommandEmpty>未找到相关结果。</CommandEmpty>
          
          <CommandGroup heading="精选路线">
            <CommandItem onSelect={() => runCommand(() => router.push("/route"))}>
              <Map className="mr-2 h-4 w-4" />
              <span>巴尔干半岛探秘 7 日游</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/route"))}>
              <Map className="mr-2 h-4 w-4" />
              <span>多瑙河沿岸非遗考察</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="文创产品">
            <CommandItem onSelect={() => runCommand(() => router.push("/shop"))}>
              <ShoppingBag className="mr-2 h-4 w-4" />
              <span>捷克手工水晶杯</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/shop"))}>
              <ShoppingBag className="mr-2 h-4 w-4" />
              <span>塞尔维亚刺绣桌布</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="快速导航">
            <CommandItem onSelect={() => runCommand(() => router.push("/virtual"))}>
              <Globe className="mr-2 h-4 w-4" />
              <span>进入虚拟漫游</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}