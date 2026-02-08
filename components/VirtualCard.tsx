"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { MouseEvent } from "react";
import { Badge } from "@/components/ui/badge";
import { PlayCircle } from "lucide-react";

interface VirtualCardProps {
  title: string;
  location: string;
  image: string;
}

export function VirtualCard({ title, location, image }: VirtualCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // 增加平滑的弹簧效果
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative h-64 w-full rounded-2xl cursor-pointer group"
    >
      {/* 背景图片 */}
      <div 
        className="absolute inset-0 rounded-2xl bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="absolute inset-0 bg-black/30 rounded-2xl group-hover:bg-black/20 transition-colors" />
      </div>

      {/* 悬浮层内容 */}
      <div 
        style={{ transform: "translateZ(50px)" }} 
        className="absolute inset-0 p-6 flex flex-col justify-end text-white"
      >
        <Badge className="w-fit mb-2 bg-white/20 backdrop-blur-md border-none">
          3D 全景漫游
        </Badge>
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-sm opacity-80 flex items-center gap-1">
          <PlayCircle className="w-4 h-4" /> {location}
        </p>
      </div>
    </motion.div>
  );
}