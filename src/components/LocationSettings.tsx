import { motion } from "motion/react";
import { ArrowLeft, MapPin, Navigation, Target, Clock, Star, Plus, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { useState } from "react";

interface LocationSettingsProps {
  onBack: () => void;
}

export function LocationSettings({ onBack }: LocationSettingsProps) {
  const [settings, setSettings] = useState({
    locationTracking: true,
    autoDetection: true,
    nearbyNotifications: true,
    travelRecommendations: false,
    shareLocation: false
  });

  const [favoriteAreas, setFavoriteAreas] = useState([
    { id: 1, name: "강남구", description: "직장 근처", color: "bg-blue-500" },
    { id: 2, name: "홍대", description: "주말 단골", color: "bg-red-500" },
    { id: 3, name: "명동", description: "쇼핑 갈 때", color: "bg-green-500" }
  ]);

  const updateSetting = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const removeFavoriteArea = (id: number) => {
    setFavoriteAreas(prev => prev.filter(area => area.id !== id));
  };

  return (
    <div className="h-screen bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white px-4 py-4 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-bold">위치 설정</h1>
            <p className="text-sm text-gray-500">현재 위치 및 선호 지역 설정</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Current Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="w-5 h-5 text-blue-500" />
              현재 위치
            </CardTitle>
            <CardDescription>
              위치 기반 맛집 추천을 위한 설정
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">위치 추적 허용</h4>
                <p className="text-sm text-gray-500">GPS를 통한 현재 위치 파악</p>
              </div>
              <Switch
                checked={settings.locationTracking}
                onCheckedChange={(checked) => updateSetting("locationTracking", checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">자동 위치 감지</h4>
                <p className="text-sm text-gray-500">앱 실행 시 자동으로 위치 확인</p>
              </div>
              <Switch
                checked={settings.autoDetection}
                onCheckedChange={(checked) => updateSetting("autoDetection", checked)}
                disabled={!settings.locationTracking}
              />
            </div>
            {settings.locationTracking && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-green-50 border border-green-200 rounded-lg p-3"
              >
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-green-700">현재 위치: 서울시 강남구</span>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  마지막 업데이트: 방금 전
                </p>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-500" />
              위치 기반 알림
            </CardTitle>
            <CardDescription>
              위치에 따른 맞춤 알림 설정
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">주변 맛집 알림</h4>
                <p className="text-sm text-gray-500">근처 인기 맛집 알림</p>
              </div>
              <Switch
                checked={settings.nearbyNotifications}
                onCheckedChange={(checked) => updateSetting("nearbyNotifications", checked)}
                disabled={!settings.locationTracking}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">여행지 추천</h4>
                <p className="text-sm text-gray-500">새로운 지역 방문 시 맛집 추천</p>
              </div>
              <Switch
                checked={settings.travelRecommendations}
                onCheckedChange={(checked) => updateSetting("travelRecommendations", checked)}
                disabled={!settings.locationTracking}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">위치 정보 공유</h4>
                <p className="text-sm text-gray-500">리뷰 작성 시 위치 정보 포함</p>
              </div>
              <Switch
                checked={settings.shareLocation}
                onCheckedChange={(checked) => updateSetting("shareLocation", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Favorite Areas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              선호 지역
            </CardTitle>
            <CardDescription>
              자주 방문하는 지역을 등록하여 맞춤 추천 받기
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              {favoriteAreas.map((area) => (
                <motion.div
                  key={area.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${area.color}`} />
                    <div>
                      <h4 className="font-medium">{area.name}</h4>
                      <p className="text-sm text-gray-500">{area.description}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => removeFavoriteArea(area.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                // 지역 추가 로직
                console.log("Add new favorite area");
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              선호 지역 추가
            </Button>
          </CardContent>
        </Card>

        {/* Distance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-500" />
              검색 범위
            </CardTitle>
            <CardDescription>
              주변 맛집 검색 시 거리 범위 설정
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {["500m", "1km", "2km", "5km", "제한 없음"].map((distance, index) => (
                <div key={distance} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="distance"
                    value={distance}
                    defaultChecked={index === 2}
                    className="text-red-500"
                  />
                  <label className="font-medium">{distance}</label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">개인정보 보호</h4>
                <p className="text-sm text-yellow-600 mt-1">
                  위치 정보는 맛집 추천 목적으로만 사용되며, 개인을 식별할 수 있는 정확한 위치는 저장되지 않습니다. 
                  언제든지 설정을 변경할 수 있습니다.
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