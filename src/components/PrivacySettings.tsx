import { motion } from "motion/react";
import { ArrowLeft, Shield, Eye, EyeOff, Users, Lock, Download, Trash2, FileText, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { useState } from "react";

interface PrivacySettingsProps {
  onBack: () => void;
}

export function PrivacySettings({ onBack }: PrivacySettingsProps) {
  const [settings, setSettings] = useState({
    profileVisibility: true,
    reviewVisibility: true,
    locationSharing: false,
    activityTracking: true,
    personalizedAds: false,
    dataAnalytics: true,
    marketingEmails: false,
    thirdPartySharing: false
  });

  const updateSetting = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const privacyCategories = [
    {
      title: "프로필 공개 설정",
      description: "다른 사용자에게 보여지는 정보",
      icon: Users,
      items: [
        {
          key: "profileVisibility",
          label: "프로필 공개",
          description: "다른 사용자가 내 프로필을 볼 수 있음",
          value: settings.profileVisibility
        },
        {
          key: "reviewVisibility",
          label: "리뷰 공개",
          description: "작성한 리뷰를 다른 사용자가 볼 수 있음",
          value: settings.reviewVisibility
        }
      ]
    },
    {
      title: "위치 정보",
      description: "위치 데이터 사용 및 공유 설정",
      icon: Shield,
      items: [
        {
          key: "locationSharing",
          label: "위치 정보 공유",
          description: "리뷰 작성 시 위치 정보 포함",
          value: settings.locationSharing
        }
      ]
    },
    {
      title: "데이터 사용",
      description: "서비스 개선을 위한 데이터 활용",
      icon: FileText,
      items: [
        {
          key: "activityTracking",
          label: "활동 추적",
          description: "앱 사용 패턴 분석을 통한 서비스 개선",
          value: settings.activityTracking
        },
        {
          key: "dataAnalytics",
          label: "데이터 분석",
          description: "익명화된 데이터를 통한 통계 분석",
          value: settings.dataAnalytics
        }
      ]
    },
    {
      title: "광고 및 마케팅",
      description: "맞춤형 광고 및 마케팅 정보 수신",
      icon: Eye,
      items: [
        {
          key: "personalizedAds",
          label: "맞춤형 광고",
          description: "관심사 기반 광고 표시",
          value: settings.personalizedAds
        },
        {
          key: "marketingEmails",
          label: "마케팅 이메일",
          description: "프로모션 및 이벤트 정보 수신",
          value: settings.marketingEmails
        }
      ]
    },
    {
      title: "제3자 공유",
      description: "파트너사와의 정보 공유 설정",
      icon: AlertTriangle,
      items: [
        {
          key: "thirdPartySharing",
          label: "제3자 정보 공유",
          description: "파트너 맛집과 예약 정보 공유",
          value: settings.thirdPartySharing
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
            <h1 className="font-bold">개인정보 보호</h1>
            <p className="text-sm text-gray-500">데이터 및 개인정보 설정</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Privacy Overview */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-blue-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-800">개인정보 보호 정책</h3>
                <p className="text-sm text-blue-600 mt-1">
                  FoodieClips는 사용자의 개인정보를 안전하게 보호합니다. 
                  모든 데이터는 암호화되어 저장되며, 사용자의 동의 없이 제3자에게 제공되지 않습니다.
                </p>
                <Button variant="outline" size="sm" className="mt-2 text-blue-600 border-blue-300">
                  자세히 보기
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings Categories */}
        {privacyCategories.map((category, categoryIndex) => {
          const Icon = category.icon;
          return (
            <Card key={categoryIndex}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className="w-5 h-5 text-purple-500" />
                  {category.title}
                </CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {category.items.map((item, itemIndex) => (
                  <div key={item.key}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1 mr-4">
                        <h4 className="font-medium">{item.label}</h4>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                      <Switch
                        checked={item.value}
                        onCheckedChange={(checked) => updateSetting(item.key, checked)}
                      />
                    </div>
                    {itemIndex < category.items.length - 1 && <Separator />}
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5 text-green-500" />
              데이터 관리
            </CardTitle>
            <CardDescription>
              내 데이터 다운로드 및 삭제 요청
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">데이터 다운로드</h4>
                <p className="text-sm text-gray-500">내가 등록한 모든 데이터를 다운로드</p>
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                다운로드
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">데이터 삭제</h4>
                <p className="text-sm text-gray-500">개인 데이터 영구 삭제 요청</p>
              </div>
              <Button variant="outline" size="sm" className="text-red-600 border-red-200">
                <Trash2 className="w-4 h-4 mr-1" />
                삭제 요청
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Cookie Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-500" />
              쿠키 설정
            </CardTitle>
            <CardDescription>
              웹사이트 쿠키 사용 설정
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">필수 쿠키</h4>
                  <p className="text-sm text-gray-500">서비스 이용에 필요한 쿠키</p>
                </div>
                <Badge variant="secondary">필수</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">성능 쿠키</h4>
                  <p className="text-sm text-gray-500">서비스 성능 개선용 쿠키</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">광고 쿠키</h4>
                  <p className="text-sm text-gray-500">맞춤형 광고 제공용 쿠키</p>
                </div>
                <Switch />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact for Privacy */}
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-4">
            <div className="text-center space-y-3">
              <h4 className="font-medium">개인정보 문의</h4>
              <p className="text-sm text-gray-600">
                개인정보 처리에 대한 문의나 불만이 있으시면 언제든지 연락주세요.
              </p>
              <div className="text-sm text-gray-500">
                <p>이메일: privacy@foodieclips.com</p>
                <p>전화: 02-1234-5678</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="pb-20" />
      </div>
    </div>
  );
}