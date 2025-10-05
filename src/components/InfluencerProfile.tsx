import { ArrowLeft, Users, Heart, MessageCircle, MoreVertical, Grid, List } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface InfluencerProfileProps {
  influencer?: any;
  onBack: () => void;
}

const videos = [
  {
    id: 1,
    thumbnail: "https://images.unsplash.com/photo-1487769723072-0e6602799af7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBmb29kJTIwcmVzdGF1cmFudCUyMGRpc2h8ZW58MXx8fHwxNzU5MjkwNjAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "홍대 갈비찜 맛집",
    likes: "12.5K",
    comments: "320",
    duration: "0:45"
  },
  {
    id: 2,
    thumbnail: "https://images.unsplash.com/photo-1697652973385-ccf1e85496b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYW1lbiUyMG5vb2RsZXMlMjBib3dsfGVufDF8fHx8MTc1OTI5MDYwMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "강남 숨은 라멘집",
    likes: "8.9K",
    comments: "185",
    duration: "1:12"
  },
  {
    id: 3,
    thumbnail: "https://images.unsplash.com/photo-1635042931262-abe2f6d864e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNzZXJ0JTIwY2FmZSUyMHN3ZWV0c3xlbnwxfHx8fDE3NTkyOTA2MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "신상 디저트 카페",
    likes: "15.2K",
    comments: "412",
    duration: "0:38"
  },
  {
    id: 4,
    thumbnail: "https://images.unsplash.com/photo-1632558610168-8377309e34c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBiYnElMjBtZWF0fGVufDF8fHx8MTc1OTI5MDYwMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "청담 고기집 후기",
    likes: "25.6K",
    comments: "542",
    duration: "1:35"
  },
  {
    id: 5,
    thumbnail: "https://images.unsplash.com/photo-1727198826083-6693684e4fc1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMHJlc3RhdXJhbnQlMjBmb29kfGVufDF8fHx8MTc1OTIxNjc3OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "이태원 피자 맛집",
    likes: "19.8K",
    comments: "276",
    duration: "0:52"
  },
  {
    id: 6,
    thumbnail: "https://images.unsplash.com/photo-1487769723072-0e6602799af7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBmb29kJTIwcmVzdGF1cmFudCUyMGRpc2h8ZW58MXx8fHwxNzU5MjkwNjAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "한식 맛집 투어",
    likes: "32.1K",
    comments: "687",
    duration: "2:14"
  }
];

export function InfluencerProfile({ influencer, onBack }: InfluencerProfileProps) {
  // 전달받은 인플루언서 데이터가 있으면 사용, 없으면 기본 데이터 사용
  const profileData = influencer || {
    username: "푸디제인",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b890?w=200&h=200&fit=crop&crop=face",
    verified: true
  };
  return (
    <div className="h-screen bg-white pt-16 pb-16 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="font-semibold">프로필</h1>
        <Button variant="ghost" size="icon">
          <MoreVertical className="w-5 h-5" />
        </Button>
      </div>

      {/* Profile Info */}
      <div className="p-6 text-center border-b border-gray-100">
        <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-red-100">
          <AvatarImage src={profileData.avatar} />
          <AvatarFallback>{profileData.username[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div className="flex items-center justify-center gap-2 mb-2">
          <h2 className="text-xl font-bold">{profileData.username}</h2>
          {profileData.verified && (
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          )}
        </div>
        
        <p className="text-gray-600 mb-4">서울 맛집 탐험가 🍽️ 매일 새로운 맛집 소개</p>
        
        {/* Stats Removed */}
        <div className="flex justify-center gap-8 mb-6">
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">125</div>
            <div className="text-sm text-gray-500">영상</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">48.2K</div>
            <div className="text-sm text-gray-500">팔로워</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">892</div>
            <div className="text-sm text-gray-500">팔로잉</div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button className="flex-1 bg-red-500 hover:bg-red-600 text-white">
            <Users className="w-4 h-4 mr-2" />
            팔로우
          </Button>
          <Button variant="outline" className="flex-1 border-red-200 text-red-600 hover:bg-red-50">
            협업 요청
          </Button>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="flex-1">
        <Tabs defaultValue="videos" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white border-b border-gray-100">
            <TabsTrigger value="videos" className="data-[state=active]:text-red-500 data-[state=active]:border-b-2 data-[state=active]:border-red-500">
              <Grid className="w-4 h-4 mr-2" />
              영상
            </TabsTrigger>
            <TabsTrigger value="liked" className="data-[state=active]:text-red-500 data-[state=active]:border-b-2 data-[state=active]:border-red-500">
              <Heart className="w-4 h-4 mr-2" />
              좋아요
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="videos" className="p-4">
            <div className="grid grid-cols-3 gap-1">
              {videos.map((video) => (
                <div key={video.id} className="aspect-square relative group">
                  <ImageWithFallback
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  
                  {/* Duration Badge */}
                  <Badge className="absolute bottom-2 right-2 bg-black/70 text-white text-xs">
                    {video.duration}
                  </Badge>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="flex items-center justify-center gap-4 text-xs">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {video.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          {video.comments}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="liked" className="p-4">
            <div className="text-center py-12 text-gray-500">
              <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>좋아요 한 영상이 없습니다</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}