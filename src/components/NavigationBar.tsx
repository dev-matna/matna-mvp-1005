import { motion } from "motion/react";
import { Home, Search, User } from "lucide-react";
import { Button } from "./ui/button";
import { ScreenType } from "../App";

interface NavigationBarProps {
  currentScreen: ScreenType;
  immersiveMode: boolean;
  onScreenChange: (screen: ScreenType) => void;
  isPC?: boolean;
}

const navItems = [
  { id: "home" as ScreenType, icon: Home, label: "홈" },
  { id: "explore" as ScreenType, icon: Search, label: "탐색" },
  { id: "my" as ScreenType, icon: User, label: "마이" },
];

export function NavigationBar({ currentScreen, immersiveMode, onScreenChange, isPC = false }: NavigationBarProps) {
  // 네비게이션에 표시할 화면들만 필터링
  const showNavigation = ['home', 'explore', 'my'].includes(currentScreen);
  
  if (!showNavigation) return null;

  return (
    <div 
      className="fixed bottom-0 bg-black backdrop-blur-md border-t border-gray-800 z-50"
      style={{
        left: isPC ? '50%' : '0',
        right: isPC ? 'auto' : '0',
        width: isPC ? '375px' : '100%',
        transform: isPC ? 'translateX(-50%)' : 'none',
      }}
    >
      <div className="flex items-center justify-around py-2 px-8">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          
          return (
            <motion.div
              key={item.id}
              whileTap={{ scale: 0.9 }}
              className="flex flex-col items-center"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onScreenChange(item.id)}
                className={`hover:bg-gray-800 w-12 h-8 p-0 ${
                  isActive ? "text-red-500" : "text-white"
                }`}
              >
                <Icon className="w-6 h-6" />
              </Button>
              
              <span className={`text-xs mt-1 ${
                isActive ? "text-red-500" : "text-white"
              }`}>
                {item.label}
              </span>
              
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="w-1 h-1 bg-red-500 rounded-full mt-1"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}