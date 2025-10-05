import { motion } from "motion/react";
import { ArrowLeft, Bell, BellOff, Clock, MapPin, Star, Calendar, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { useState } from "react";

interface NotificationSettingsProps {
  onBack: () => void;
}

export function NotificationSettings({ onBack }: NotificationSettingsProps) {
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: false,
    reservationUpdates: true,
    newRestaurants: true,
    influencerPosts: false,
    marketingEmails: false,
    weeklyDigest: true,
    locationBased: true,
    sounds: true,
    vibration: true
  });

  const updateSetting = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const notificationCategories = [
    {
      title: "예약 및 주문",
      description: "예약 확인, 변경, 취소 알림",
      icon: Calendar,
      items: [
        {
          key: "reservationUpdates",
          label: "예약 업데이트",
          description: "예약 상태 변경 시 알림",
          value: settings.reservationUpdates
        }
      ]
    },
    {
      title: "맛집 정보",
      description: "새로운 맛집 및 추천 정보",
      icon: Star,
      items: [
        {
          key: "newRestaurants",
          label: "신규 맛집",
          description: "새로운 맛집 등록 시 알림",
          value: settings.newRestaurants
        },
        {
          key: "locationBased",
          label: "주변 맛집",
          description: "내 위치 기반 맛집 추천",
          value: settings.locationBased
        }
      ]
    },
    {
      title: "인플루언서",
      description: "팔로우한 인플루언서 활동",
      icon: MessageSquare,
      items: [
        {
          key: "influencerPosts",
          label: "새 게시물",
          description: "팔로우한 인플루언서의 새 리뷰",
          value: settings.influencerPosts
        }
      ]
    },
    {
      title: "마케팅",
      description: "이벤트 및 프로모션 정보",
      icon: Star,
      items: [
        {
          key: "marketingEmails",
          label: "프로모션 알림",
          description: "할인 및 이벤트 정보",
          value: settings.marketingEmails
        },
        {
          key: "weeklyDigest",
          label: "주간 요약",
          description: "주간 맛집 트렌드 요약",
          value: settings.weeklyDigest
        }
      ]
    }
  ];

  return (
    <div className="h-screen bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white px-4 py-4 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-bold">알림 설정</h1>
            <p className="text-sm text-gray-500">푸시 알림 및 이메일 설정</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Master Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-red-500" />
              알림 방식
            </CardTitle>
            <CardDescription>
              알림을 받을 방식을 선택하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">푸시 알림</h4>
                <p className="text-sm text-gray-500">앱 내 푸시 알림 활성화</p>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => updateSetting("pushNotifications", checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">이메일 알림</h4>
                <p className="text-sm text-gray-500">이메일로 알림 받기</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">알림음</h4>
                <p className="text-sm text-gray-500">알림 수신 시 소리</p>
              </div>
              <Switch
                checked={settings.sounds}
                onCheckedChange={(checked) => updateSetting("sounds", checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">진동</h4>
                <p className="text-sm text-gray-500">알림 수신 시 진동</p>
              </div>
              <Switch
                checked={settings.vibration}
                onCheckedChange={(checked) => updateSetting("vibration", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Categories */}
        {notificationCategories.map((category, categoryIndex) => {
          const Icon = category.icon;
          return (
            <Card key={categoryIndex}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className="w-5 h-5 text-blue-500" />
                  {category.title}
                </CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {category.items.map((item, itemIndex) => (
                  <div key={item.key}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{item.label}</h4>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                      <Switch
                        checked={item.value}
                        onCheckedChange={(checked) => updateSetting(item.key, checked)}
                        disabled={!settings.pushNotifications && !settings.emailNotifications}
                      />
                    </div>
                    {itemIndex < category.items.length - 1 && <Separator />}
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}

        {/* Status Info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Bell className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800">알림 권한 안내</h4>
                <p className="text-sm text-blue-600 mt-1">
                  푸시 알림을 받으려면 브라우저에서 알림 권한을 허용해주세요. 
                  설정은 언제든지 변경 가능합니다.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="pb-20" />
      </div>
    </div>
  );
}