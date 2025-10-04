import { motion } from "motion/react";
import { 
  Flame, 
  MapPin, 
  Clock, 
  Star, 
  TrendingUp,
  ChefHat,
  Coffee,
  Pizza,
  Soup,
  IceCream,
  ChevronRight,
  Calendar,
  Users,
  CheckCircle,
  AlertCircle,
  CalendarDays
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ReservationSheet } from "./ReservationSheet";

interface HomeScreenProps {
  onExploreClick: () => void;
  onCategoryClick: (category: string) => void;
  reservations: any[];
  onReservationComplete: (reservation: any) => void;
  onReservationsClick?: () => void;
}

const trendingRestaurants = [
  {
    id: 1,
    name: "강남 갈비천왕",
    category: "한식",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1695114094688-c9f8a28316ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjByZXN0YXVyYW50JTIwZm9vZCUyMHRyZW5kaW5nfGVufDF8fHx8MTc1OTMwODk2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    viewCount: "12.5K",
    location: "강남구",
    trend: "+25%"
  },
  {
    id: 2,
    name: "홍대 BBQ 스팟",
    category: "고기구이",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1709433420549-06e96379c2b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBiYnElMjBncmlsbGVkJTIwbWVhdHxlbnwxfHx8fDE3NTkxODg1ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    viewCount: "8.9K",
    location: "홍대입구",
    trend: "+18%"
  },
  {
    id: 3,
    name: "치킨 마스터 압구정점",
    category: "치킨",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1741004418691-e68682816528?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBmcmllZCUyMGNoaWNrZW4lMjBjcmlzcHl8ZW58MXx8fHwxNzU5MzA4OTcxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    viewCount: "15.2K",
    location: "압구정동",
    trend: "+32%"
  }
];

const categories = [
  { id: "korean", name: "한식", icon: ChefHat, color: "bg-red-500", count: 156 },
  { id: "cafe", name: "카페", icon: Coffee, color: "bg-amber-500", count: 89 },
  { id: "western", name: "양식", icon: Pizza, color: "bg-orange-500", count: 67 },
  { id: "japanese", name: "일식", icon: Soup, color: "bg-green-500", count: 43 },
  { id: "dessert", name: "디저트", icon: IceCream, color: "bg-pink-500", count: 34 }
];

const hotInfluencers = [
  {
    id: 1,
    username: "푸드킹잭슨",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    followers: "125K",
    isLive: true
  },
  {
    id: 2,
    username: "맛집헌터민지",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b890?w=100&h=100&fit=crop&crop=face",
    followers: "89K",
    isLive: false
  },
  {
    id: 3,
    username: "서울맛지도",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    followers: "203K",
    isLive: true
  }
];

const quickReservationRestaurants = [
  {
    id: 1,
    name: "강남 갈비천왕",
    category: "한식",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1695114094688-c9f8a28316ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjByZXN0YXVyYW50JTIwZm9vZCUyMHRyZW5kaW5nfGVufDF8fHx8MTc1OTMwODk2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    location: "강남구 역삼동",
    availableSlots: ["18:00", "18:30", "19:00", "19:30", "20:00"],
    isPopular: true
  },
  {
    id: 2,
    name: "홍대 BBQ 스팟",
    category: "고기구이",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1709433420549-06e96379c2b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBiYnElMjBncmlsbGVkJTIwbWVhdHxlbnwxfHx8fDE3NTkxODg1ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    location: "홍대입구",
    availableSlots: ["17:30", "18:00", "18:30", "19:00"],
    isPopular: false
  },
  {
    id: 3,
    name: "치킨 마스터 압구정점",
    category: "치킨",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1741004418691-e68682816528?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBmcmllZCUyMGNoaWNrZW4lMjBjcmlzcHl8ZW58MXx8fHwxNzU5MzA4OTcxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    location: "압구정동",
    availableSlots: ["19:00", "19:30", "20:00", "20:30"],
    isPopular: true
  }
];

export function HomeScreen({ onExploreClick, onCategoryClick, reservations, onReservationComplete, onReservationsClick }: HomeScreenProps) {
  const upcomingReservations = reservations.filter(r => r.status === 'confirmed');
  const hasUpcomingReservations = upcomingReservations.length > 0;
  return (
    <div className="h-screen bg-gray-50 overflow-y-auto pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">FoodieClips</h1>
            <p className="text-sm text-gray-600">맛집 탐험의 시작</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="w-4 h-4" />
            <span>서울시 강남구</span>
          </div>
        </div>

        {/* Quick Status */}
        {hasUpcomingReservations && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4"
          >
            <Card 
              className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200 cursor-pointer hover:shadow-md transition-shadow"
              onClick={onReservationsClick}
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-gray-700">
                      다가오는 예약 {upcomingReservations.length}개
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <span>상세보기</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* My Reservations */}
      {hasUpcomingReservations && (
        <div className="px-4 mt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-bold text-gray-900">내 예약</h2>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-red-500"
              onClick={onReservationsClick}
            >
              전체보기
            </Button>
          </div>

          <div className="space-y-3">
            {upcomingReservations.slice(0, 2).map((reservation) => (
              <motion.div
                key={reservation.id}
                whileTap={{ scale: 0.98 }}
                className="cursor-pointer"
                onClick={onReservationsClick}
              >
                <Card className="shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-gray-900 truncate">{reservation.restaurant}</h3>
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-600 flex-shrink-0">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            확정
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center gap-1">
                            <CalendarDays className="w-4 h-4 flex-shrink-0" />
                            <span>{reservation.date} {reservation.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 flex-shrink-0" />
                            <span>{reservation.guests}명</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{reservation.location}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end justify-between ml-4 h-20">
                        <Badge variant="outline" className="text-xs">
                          {reservation.category}
                        </Badge>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="px-4 mt-6">
        <motion.div
          whileTap={{ scale: 0.98 }}
          onClick={onExploreClick}
          className="cursor-pointer"
        >
          <Card className="bg-gradient-to-r from-red-500 to-yellow-500 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between text-white">
                <div>
                  <h3 className="text-lg font-bold mb-1">지금 핫한 맛집 영상</h3>
                  <p className="text-sm opacity-90">바로 시청하고 예약까지!</p>
                </div>
                <div className="flex items-center gap-2">
                  <Flame className="w-6 h-6" />
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Categories */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">카테고리</h2>
          <Button variant="ghost" size="sm" className="text-red-500">
            전체보기
          </Button>
        </div>
        
        <div className="grid grid-cols-5 gap-3">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => onCategoryClick(category.id)}
                className="cursor-pointer"
              >
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full ${category.color} flex items-center justify-center mb-2 shadow-md`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">{category.name}</span>
                  <span className="text-xs text-gray-500">{category.count}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Trending Restaurants */}
      <div className="px-4 mt-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-bold text-gray-900">트렌딩 맛집 TOP 3</h2>
          </div>
          <Button variant="ghost" size="sm" className="text-red-500">
            더보기
          </Button>
        </div>

        <div className="space-y-3">
          {trendingRestaurants.map((restaurant, index) => (
            <motion.div
              key={restaurant.id}
              whileTap={{ scale: 0.98 }}
              className="cursor-pointer"
            >
              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-lg overflow-hidden">
                        <ImageWithFallback
                          src={restaurant.image}
                          alt={restaurant.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -top-2 -left-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900">{restaurant.name}</h3>
                        <Badge variant="secondary" className="text-xs bg-red-100 text-red-600">
                          {restaurant.trend}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span>{restaurant.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{restaurant.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          <span>{restaurant.viewCount} 조회</span>
                        </div>
                      </div>
                      
                      <Badge variant="outline" className="mt-1 text-xs">
                        {restaurant.category}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Hot Influencers */}
      <div className="px-4 mt-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-bold text-gray-900">HOT 인플루언서</h2>
          </div>
          <Button variant="ghost" size="sm" className="text-red-500">
            더보기
          </Button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4">
          {hotInfluencers.map((influencer) => (
            <motion.div
              key={influencer.id}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0 cursor-pointer"
            >
              <Card className="w-32 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <div className="relative mb-3">
                    <Avatar className="w-16 h-16 mx-auto">
                      <AvatarImage src={influencer.avatar} alt={influencer.username} />
                      <AvatarFallback>{influencer.username[0]}</AvatarFallback>
                    </Avatar>
                    {influencer.isLive && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      </div>
                    )}
                  </div>
                  
                  <h4 className="font-medium text-sm text-gray-900 mb-1 truncate">
                    {influencer.username}
                  </h4>
                  <p className="text-xs text-gray-500">{influencer.followers} 팔로워</p>
                  
                  {influencer.isLive && (
                    <Badge variant="destructive" className="mt-2 text-xs">
                      LIVE
                    </Badge>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Reservation */}
      <div className="px-4 mt-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-bold text-gray-900">빠른 예약</h2>
          </div>
          <Button variant="ghost" size="sm" className="text-red-500">
            더보기
          </Button>
        </div>

        <div className="space-y-3">
          {quickReservationRestaurants.slice(0, 2).map((restaurant) => (
            <ReservationSheet
              key={restaurant.id}
              restaurant={restaurant}
              onReservationComplete={onReservationComplete}
              onModalClose={() => {
                // HomeScreen에서는 특별한 동작 없음 (영상이 없으므로)
              }}
            >
              <motion.div
                whileTap={{ scale: 0.98 }}
                className="cursor-pointer"
              >
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-lg overflow-hidden">
                          <ImageWithFallback
                            src={restaurant.image}
                            alt={restaurant.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {restaurant.isPopular && (
                          <div className="absolute -top-2 -left-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                            <Flame className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900">{restaurant.name}</h3>
                          {restaurant.isPopular && (
                            <Badge variant="destructive" className="text-xs">
                              인기
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span>{restaurant.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{restaurant.location}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {restaurant.category}
                          </Badge>
                          <span className="text-xs text-green-600">오늘 예약 가능</span>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>가능한 시간: {restaurant.availableSlots.slice(0, 3).join(', ')}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-2">
                        <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white">
                          예약
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </ReservationSheet>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-4 mt-8 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-bold text-gray-900">예약 현황</h2>
        </div>

        <Card className="shadow-sm">
          <CardContent className="p-4">
            {!hasUpcomingReservations ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="font-medium text-gray-700 mb-2">첫 번째 맛집 예약을 해보세요!</h3>
                <p className="text-sm text-gray-500 mb-4">인플루언서가 추천하는 핫한 맛집들이 기다리고 있어요</p>
                <div className="space-y-2">
                  <Button 
                    onClick={onExploreClick}
                    className="bg-gradient-to-r from-red-500 to-yellow-500 hover:from-red-600 hover:to-yellow-600 text-white w-full"
                  >
                    🎬 맛집 영상 보러가기
                  </Button>
                  <p className="text-xs text-gray-400">
                    위의 "빠른 예약"으로도 바로 예약할 수 있어요!
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="text-lg font-bold text-green-600">{upcomingReservations.length}</div>
                    <div className="text-xs text-green-600">예정된 예약</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-lg font-bold text-blue-600">0</div>
                    <div className="text-xs text-blue-600">대기중</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-lg font-bold text-gray-600">3</div>
                    <div className="text-xs text-gray-600">총 방문</div>
                  </div>
                </div>

                <Button 
                  onClick={onExploreClick}
                  variant="outline"
                  className="w-full"
                >
                  새로운 맛집 탐색하기
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}