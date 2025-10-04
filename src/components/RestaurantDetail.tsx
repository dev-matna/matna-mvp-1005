import { ArrowLeft, Play, Star, MapPin, Clock, Phone, Share, Bookmark, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface RestaurantDetailProps {
  restaurant: any;
  onBack: () => void;
}

const menuItems = [
  { name: "갈비찜 (대)", price: "35,000원", description: "2-3인분, 특제 양념으로 조린 갈비찜" },
  { name: "갈비찜 (중)", price: "25,000원", description: "1-2인분, 부드러운 갈비살" },
  { name: "갈비탕", price: "12,000원", description: "진한 육수의 갈비탕" },
  { name: "냉면", price: "8,000원", description: "시원한 물냉면 또는 비빔냉면" },
];

const relatedVideos = [
  {
    id: 1,
    thumbnail: "https://images.unsplash.com/photo-1487769723072-0e6602799af7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBmb29kJTIwcmVzdGF1cmFudCUyMGRpc2h8ZW58MXx8fHwxNzU5MjkwNjAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "갈비찜 먹방",
    views: "12.5K"
  },
  {
    id: 2,
    thumbnail: "https://images.unsplash.com/photo-1697652973385-ccf1e85496b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYW1lbiUyMG5vb2RsZXMlMjBib3dsfGVufDF8fHx8MTc1OTI5MDYwMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "냉면 리뷰",
    views: "8.2K"
  }
];

export function RestaurantDetail({ restaurant, onBack }: RestaurantDetailProps) {
  return (
    <div className="h-screen bg-white pt-16 pb-16 overflow-y-auto">
      {/* Header with Video */}
      <div className="relative">
        <div className="aspect-video bg-gray-200 relative">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1487769723072-0e6602799af7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBmb29kJTIwcmVzdGF1cmFudCUyMGRpc2h8ZW58MXx8fHwxNzU5MjkwNjAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt={restaurant?.name || "맛집"}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <Button size="lg" className="bg-white/20 backdrop-blur-md text-white hover:bg-white/30">
              <Play className="w-6 h-6 mr-2" />
              영상 재생
            </Button>
          </div>
        </div>
        
        {/* Back Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="absolute top-4 left-4 bg-black/20 backdrop-blur-md text-white hover:bg-black/30"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button variant="ghost" size="icon" className="bg-black/20 backdrop-blur-md text-white hover:bg-black/30">
            <Share className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="bg-black/20 backdrop-blur-md text-white hover:bg-black/30">
            <Bookmark className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{restaurant?.name || "명가갈비찜"}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className="bg-red-50 text-red-600 border-red-200">한식</Badge>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">4.8</span>
                <span className="text-gray-500 text-sm">(327개 리뷰)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Location & Info */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-gray-400" />
            <span className="text-gray-700">서울 마포구 홍대입구역 2번 출구 도보 3분</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-gray-400" />
            <span className="text-gray-700">11:30 - 22:00 (브레이크타임 15:00-17:00)</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-gray-400" />
            <span className="text-gray-700">02-1234-5678</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <Button className="flex-1 bg-red-500 hover:bg-red-600 text-white">
            <Calendar className="w-4 h-4 mr-2" />
            예약하기
          </Button>
          <Button variant="outline" className="flex-1 border-red-200 text-red-600 hover:bg-red-50">
            길찾기
          </Button>
        </div>

        <Separator className="my-6" />

        {/* Menu */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">메뉴</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {menuItems.map((item, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                  </div>
                  <span className="font-semibold text-red-600 ml-4">{item.price}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Separator className="my-6" />

        {/* Related Videos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">관련 영상</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {relatedVideos.map((video) => (
                <div key={video.id} className="relative">
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <ImageWithFallback
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <Play className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-sm font-medium mt-2">{video.title}</p>
                  <p className="text-xs text-gray-500">조회수 {video.views}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="h-8" /> {/* Bottom spacing */}
      </div>
    </div>
  );
}