import { motion } from "motion/react";
import { ArrowLeft, Heart, MapPin, Star, Clock, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface BookmarkedRestaurantsProps {
  onBack: () => void;
  onRestaurantSelect?: (restaurant: any) => void;
}

export function BookmarkedRestaurants({ onBack, onRestaurantSelect }: BookmarkedRestaurantsProps) {
  // 북마크한 맛집 목록 (mock data)
  const bookmarkedRestaurants = [
    {
      id: '1',
      name: '강남 갈비천왕',
      category: '한식',
      rating: 4.8,
      reviewCount: 2341,
      location: '강남구 역삼동',
      distance: '0.5km',
      priceRange: '25,000원~35,000원',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
      tags: ['갈비', '한우', '모임'],
      openHours: '11:00 - 22:00',
      bookmarkedAt: '2일 전'
    },
    {
      id: '2',
      name: '스시 오마카세 혼',
      category: '일식',
      rating: 4.9,
      reviewCount: 892,
      location: '강남구 신사동',
      distance: '1.2km',
      priceRange: '80,000원~120,000원',
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop',
      tags: ['오마카세', '스시', '고급'],
      openHours: '18:00 - 23:00',
      bookmarkedAt: '1주 전'
    },
    {
      id: '3',
      name: '트러플 파스타 하우스',
      category: '이탈리안',
      rating: 4.7,
      reviewCount: 1567,
      location: '서초구 반포동',
      distance: '2.1km',
      priceRange: '18,000원~28,000원',
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop',
      tags: ['파스타', '트러플', '데이트'],
      openHours: '11:30 - 21:30',
      bookmarkedAt: '3일 전'
    },
    {
      id: '4',
      name: '청담 BBQ 프리미엄',
      category: '양식',
      rating: 4.6,
      reviewCount: 987,
      location: '강남구 청담동',
      distance: '1.8km',
      priceRange: '45,000원~65,000원',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
      tags: ['스테이크', 'BBQ', '프리미엄'],
      openHours: '17:00 - 24:00',
      bookmarkedAt: '5일 전'
    },
    {
      id: '5',
      name: '마라탕 신촌 본점',
      category: '중식',
      rating: 4.4,
      reviewCount: 1234,
      location: '마포구 신촌동',
      distance: '3.2km',
      priceRange: '12,000원~18,000원',
      image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop',
      tags: ['마라탕', '얼큰', '혼밥'],
      openHours: '10:00 - 02:00',
      bookmarkedAt: '1주 전'
    }
  ];

  const handleRestaurantClick = (restaurant: any) => {
    if (onRestaurantSelect) {
      onRestaurantSelect(restaurant);
    }
  };

  return (
    <div className="h-screen bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white px-4 py-4 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            <h1 className="text-lg font-bold">북마크한 맛집</h1>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2 ml-12">
          저장한 맛집 {bookmarkedRestaurants.length}곳
        </p>
      </div>

      {/* Restaurant List */}
      <div className="px-4 py-4 space-y-4 pb-20">
        {bookmarkedRestaurants.map((restaurant, index) => (
          <motion.div
            key={restaurant.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileTap={{ scale: 0.98 }}
            className="cursor-pointer"
            onClick={() => handleRestaurantClick(restaurant)}
          >
            <Card className="shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-0">
                <div className="relative">
                  <ImageWithFallback
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  
                  {/* Bookmark Badge */}
                  <div className="absolute top-3 right-3">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                      <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
                      {restaurant.category}
                    </Badge>
                  </div>
                </div>

                <div className="p-4">
                  {/* Restaurant Info */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{restaurant.name}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="font-medium">{restaurant.rating}</span>
                          <span className="text-gray-500 text-sm">({restaurant.reviewCount})</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Location & Distance */}
                  <div className="flex items-center gap-1 text-gray-600 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{restaurant.location}</span>
                    <span className="text-sm">• {restaurant.distance}</span>
                  </div>

                  {/* Price Range */}
                  <div className="flex items-center gap-1 text-gray-600 mb-3">
                    <span className="text-sm">💰 {restaurant.priceRange}</span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {restaurant.tags.map((tag, tagIndex) => (
                      <Badge 
                        key={tagIndex} 
                        variant="outline" 
                        className="text-xs px-2 py-1"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Additional Info */}
                  <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-3">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{restaurant.openHours}</span>
                    </div>
                    <span>북마크: {restaurant.bookmarkedAt}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* Empty State (만약 북마크가 없다면) */}
        {bookmarkedRestaurants.length === 0 && (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500 mb-2">
              아직 북마크한 맛집이 없어요
            </h3>
            <p className="text-sm text-gray-400">
              마음에 드는 맛집을 북마크해보세요!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}