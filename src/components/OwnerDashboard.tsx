import { ArrowLeft, Plus, Users, Eye, TrendingUp, Calendar, Settings, Star, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface OwnerDashboardProps {
  onBack: () => void;
}

const stats = [
  { label: "이번 달 조회수", value: "45.2K", change: "+12.3%", icon: Eye },
  { label: "방문 유입", value: "127", change: "+8.7%", icon: Users },
  { label: "영상 개수", value: "23", change: "+3", icon: TrendingUp },
  { label: "평점", value: "4.8", change: "+0.2", icon: Star },
];

const collaborationRequests = [
  {
    id: 1,
    influencer: {
      name: "푸디제인",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b890?w=100&h=100&fit=crop&crop=face",
      followers: "48.2K",
      verified: true
    },
    message: "안녕하세요! 맛집 소개 영상을 찍고 싶어서 연락드립니다.",
    date: "2024-01-15",
    status: "pending"
  },
  {
    id: 2,
    influencer: {
      name: "라멘러버",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      followers: "23.8K",
      verified: false
    },
    message: "라멘 전문 인플루언서입니다. 협업 가능할까요?",
    date: "2024-01-14",
    status: "pending"
  }
];

const recentVideos = [
  {
    id: 1,
    title: "홍대 갈비찜 맛집 리뷰",
    views: "12.5K",
    likes: "892",
    comments: "156",
    date: "2024-01-10"
  },
  {
    id: 2,
    title: "점심 메뉴 추천",
    views: "8.3K",
    likes: "534",
    comments: "89",
    date: "2024-01-08"
  }
];

export function OwnerDashboard({ onBack }: OwnerDashboardProps) {
  return (
    <div className="h-screen bg-gray-50 pt-16 pb-16 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-semibold">사장님 대시보드</h1>
        </div>
        <Button variant="ghost" size="icon">
          <Settings className="w-5 h-5" />
        </Button>
      </div>

      {/* Restaurant Info */}
      <div className="p-4 bg-white mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-yellow-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-2xl">명</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">명가갈비찜</h2>
            <p className="text-gray-600">홍대입구역 2번 출구</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge className="bg-red-50 text-red-600 border-red-200">한식</Badge>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">4.8</span>
              </div>
            </div>
          </div>
        </div>
        
        <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          인플루언서 협업 요청하기
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="w-5 h-5 text-gray-400" />
                    <Badge variant="secondary" className="text-green-600 bg-green-50">
                      {stat.change}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="collaborations" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white">
            <TabsTrigger value="collaborations" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
              협업 요청
            </TabsTrigger>
            <TabsTrigger value="videos" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
              영상 성과
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
              분석
            </TabsTrigger>
          </TabsList>

          <TabsContent value="collaborations" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">협업 요청 ({collaborationRequests.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {collaborationRequests.map((request) => (
                    <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={request.influencer.avatar} />
                          <AvatarFallback>{request.influencer.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{request.influencer.name}</span>
                            {request.influencer.verified && (
                              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                              </div>
                            )}
                            <Badge variant="secondary" className="text-xs">
                              {request.influencer.followers} 팔로워
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{request.message}</p>
                          <p className="text-xs text-gray-400">{request.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white">
                          수락
                        </Button>
                        <Button size="sm" variant="outline">
                          거절
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="videos" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">최근 영상 성과</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentVideos.map((video) => (
                    <div key={video.id} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2">{video.title}</h3>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-900">{video.views}</div>
                          <div className="text-gray-500">조회수</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-900">{video.likes}</div>
                          <div className="text-gray-500">좋아요</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-900">{video.comments}</div>
                          <div className="text-gray-500">댓글</div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">{video.date}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-4">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">월별 방문 유입</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">1월</span>
                      <span className="text-sm font-medium">127명</span>
                    </div>
                    <Progress value={85} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">12월</span>
                      <span className="text-sm font-medium">98명</span>
                    </div>
                    <Progress value={65} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">11월</span>
                      <span className="text-sm font-medium">73명</span>
                    </div>
                    <Progress value={48} className="h-2" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">인기 메뉴</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">갈비찜 (대)</span>
                      <span className="text-sm font-medium">68%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">갈비찜 (중)</span>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">냉면</span>
                      <span className="text-sm font-medium">32%</span>
                    </div>
                    <Progress value={32} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}