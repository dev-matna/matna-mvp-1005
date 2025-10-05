import { motion } from "motion/react";
import { 
  Heart, 
  Bookmark, 
  Calendar, 
  Settings, 
  Bell, 
  MapPin, 
  User,
  Edit,
  Shield,
  HelpCircle,
  LogOut
} from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface MyProfileProps {
  onBack: () => void;
  onDashboardAccess: () => void;
  onTestAccess?: () => void;
  onBookmarksAccess?: () => void;
  onReservationsAccess?: () => void;
  onNotificationsAccess?: () => void;
  onLocationAccess?: () => void;
  onAccountAccess?: () => void;
  onPrivacyAccess?: () => void;
  onSupportAccess?: () => void;
}

export function MyProfile({ 
  onBack, 
  onDashboardAccess, 
  onTestAccess, 
  onBookmarksAccess, 
  onReservationsAccess,
  onNotificationsAccess,
  onLocationAccess,
  onAccountAccess,
  onPrivacyAccess,
  onSupportAccess
}: MyProfileProps) {
  const [tapCount, setTapCount] = useState(0);

  // 숨겨진 사장님 대시보드 접근 (프로필 사진 5번 탭)
  const handleAvatarTap = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);
    
    if (newCount >= 5) {
      onDashboardAccess();
      setTapCount(0);
    }
    
    // 3초 후 카운트 리셋
    setTimeout(() => {
      setTapCount(0);
    }, 3000);
  };

  const mockUser = {
    name: "김푸디",
    username: "foodie_kim",
    email: "foodie.kim@example.com",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b890?w=100&h=100&fit=crop&crop=face",
    bio: "맛집 탐험가 🍴 서울 곳곳의 숨은 맛집을 찾아다녀요!",
    followersCount: 1234,
    followingCount: 567,
    bookmarkedCount: 89,
    reservationCount: 23
  };

  const menuItems = [
    {
      icon: Heart,
      title: "북마크한 맛집",
      description: "저장한 맛집 목록",
      count: mockUser.bookmarkedCount,
      color: "text-red-500",
      action: onBookmarksAccess
    },
    {
      icon: Calendar,
      title: "예약 내역",
      description: "지난 예약과 예정된 예약",
      count: mockUser.reservationCount,
      color: "text-green-500",
      action: onReservationsAccess
    }
  ];

  const settingItems = [
    { icon: Bell, title: "알림 설정", description: "푸시 알림 및 이메일 설정", action: onNotificationsAccess },
    { icon: MapPin, title: "위치 설정", description: "현재 위치 및 선호 지역 설정", action: onLocationAccess },
    { icon: User, title: "계정 관리", description: "프로필 수정 및 계정 설정", action: onAccountAccess },
    { icon: Shield, title: "개인정보 보호", description: "데이터 및 개인정보 설정", action: onPrivacyAccess },
    { icon: HelpCircle, title: "고객센터", description: "도움말 및 문의사항", action: onSupportAccess },
    ...(onTestAccess ? [{ icon: Settings, title: "🔍 데이터베이스 테스트", description: "개발자용 - API 및 데이터 확인", action: onTestAccess }] : [])
  ];

  return (
    <div className="h-screen bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white px-4 py-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">마이페이지</h1>
          <Button variant="ghost" size="icon" onClick={onBack}>
            <Edit className="w-5 h-5" />
          </Button>
        </div>

        {/* Profile Section */}
        <div className="flex items-center gap-4">
          <motion.div
            whileTap={{ scale: 0.95 }}
            onClick={handleAvatarTap}
            className="relative"
          >
            <Avatar className="w-16 h-16">
              <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
              <AvatarFallback>{mockUser.name[0]}</AvatarFallback>
            </Avatar>
            {tapCount > 0 && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">{tapCount}</span>
              </div>
            )}
          </motion.div>
          
          <div className="flex-1">
            <h2 className="text-lg font-bold">{mockUser.name}</h2>
            <p className="text-gray-600 text-sm">@{mockUser.username}</p>
            <p className="text-gray-500 text-xs mt-1">{mockUser.bio}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-around mt-4 pt-4 border-t">
          <div className="text-center">
            <p className="font-bold text-lg">{mockUser.followersCount}</p>
            <p className="text-gray-500 text-xs">팔로워</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg">{mockUser.followingCount}</p>
            <p className="text-gray-500 text-xs">팔로잉</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg">{mockUser.bookmarkedCount}</p>
            <p className="text-gray-500 text-xs">북마크</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg">{mockUser.reservationCount}</p>
            <p className="text-gray-500 text-xs">예약</p>
          </div>
        </div>
      </div>

      {/* Content Menu */}
      <div className="px-4 mt-6">
        <h3 className="text-sm font-medium text-gray-500 mb-3">나의 활동</h3>
        <div className="space-y-3">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                whileTap={{ scale: 0.98 }}
                className="cursor-pointer"
                onClick={item.action}
              >
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-gray-100 ${item.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-gray-100">
                        {item.count}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Settings Menu */}
      <div className="px-4 mt-8">
        <h3 className="text-sm font-medium text-gray-500 mb-3">설정</h3>
        <Card className="shadow-sm">
          <CardContent className="p-0">
            {settingItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index}>
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50"
                    onClick={item.action}
                  >
                    <Icon className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.title}</h4>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full" />
                  </motion.div>
                  {index < settingItems.length - 1 && <Separator />}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Logout */}
      <div className="px-4 mt-6 pb-20">
        <motion.div
          whileTap={{ scale: 0.98 }}
          className="cursor-pointer"
        >
          <Card className="shadow-sm border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 text-red-500">
                <LogOut className="w-5 h-5" />
                <span className="font-medium">로그아웃</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}