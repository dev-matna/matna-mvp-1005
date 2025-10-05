import React from "react";
import { MapPin, TrendingUp } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { motion } from "motion/react";

export type FeedMode = 'trending' | 'nearby';

interface TopBarProps {
  feedMode: FeedMode;
  immersiveMode: boolean;
  onFeedModeChange: (mode: FeedMode) => void;
}

export function TopBar({ feedMode, immersiveMode, onFeedModeChange }: TopBarProps) {
  return (
    <motion.div 
      className="absolute top-0 left-0 right-0 bg-black/20 backdrop-blur-sm z-50"
      initial={{ opacity: 1, y: 0 }}
      animate={{ 
        opacity: immersiveMode ? 0 : 1,
        y: immersiveMode ? -100 : 0
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{ pointerEvents: immersiveMode ? 'none' : 'auto' }}
    >
      {/* Feed Mode Tabs */}
      <div className="px-4 pt-4 pb-3">
        <Tabs value={feedMode} onValueChange={(value) => onFeedModeChange(value as FeedMode)} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-black/30 backdrop-blur-sm">
            <TabsTrigger 
              value="trending" 
              className="flex items-center gap-2 text-white/80 data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:backdrop-blur-md"
            >
              <TrendingUp className="w-4 h-4" />
              트렌딩
            </TabsTrigger>
            <TabsTrigger 
              value="nearby"
              className="flex items-center gap-2 text-white/80 data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:backdrop-blur-md"
            >
              <MapPin className="w-4 h-4" />
              내 주변
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Location indicator for nearby mode */}
      {feedMode === 'nearby' && (
        <div className="px-4 pb-2">
          <div className="flex items-center gap-1 text-white/70 text-sm">
            <MapPin className="w-3 h-3" />
            <span>현재 위치: 강남구 기준</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}