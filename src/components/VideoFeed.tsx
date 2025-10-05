import React from "react";
import { motion, PanInfo } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { VideoCard } from "./VideoCard";
import { FeedMode } from "./TopBar";
import { toast } from "sonner";
import { videoAPI } from "../utils/api";
import { useAudio } from "../utils/AudioContext";

interface Restaurant {
  name: string;
  location: string;
  rating: number;
  priceRange: string;
  category: string;
}

interface Video {
  id: string;
  videoUrl: string;
  thumbnail: string;
  title: string;
  user: {
    username: string;
    avatar: string;
    verified?: boolean;
    followers?: string;
  };
  restaurant: Restaurant;
  likes: number;
  isBookmarked: boolean;
}

const mockVideos: Video[] = [
  {
    id: "1",
    videoUrl: "https://www.youtube.com/embed/xZUaA5mmRl0?autoplay=1&mute=1&loop=1&controls=0&rel=0&modestbranding=1&playsinline=1&playlist=xZUaA5mmRl0",
    thumbnail: "https://img.youtube.com/vi/xZUaA5mmRl0/maxresdefault.jpg",
    title: "다가생구이 맛집 발견! 🔥 이 생고기 진짜 대박이에요 #마포맛집 #생구이 #맛스타그램",
    user: {
      username: "foodie_jane",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b890?w=100&h=100&fit=crop&crop=face",
      verified: true,
      followers: "89K",
    },
    restaurant: {
      name: "다가생구이",
      location: "서울 마포구 새창로4길 16-10 1층",
      rating: 4.8,
      priceRange: "25,000원~40,000원",
      category: "한식"
    },
    likes: 125400,
    isBookmarked: false,
  },
  {
    id: "1-2",
    videoUrl: "https://www.youtube.com/embed/odcA1IP2yL8?autoplay=1&mute=1&loop=1&controls=0&rel=0&modestbranding=1&playsinline=1&playlist=odcA1IP2yL8",
    thumbnail: "https://img.youtube.com/vi/odcA1IP2yL8/maxresdefault.jpg",
    title: "다가생구이 사장님이 직접 알려주는 비법! 🔥 이래서 맛있구나 #마포맛집 #생구이 #요리비법",
    user: {
      username: "foodie_jane",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b890?w=100&h=100&fit=crop&crop=face",
      verified: true,
      followers: "89K",
    },
    restaurant: {
      name: "다가생구이",
      location: "서울 마포구 새창로4길 16-10 1층",
      rating: 4.8,
      priceRange: "25,000원~40,000원",
      category: "한식"
    },
    likes: 89300,
    isBookmarked: true,
  },
  {
    id: "1-3",
    videoUrl: "https://www.youtube.com/embed/nMBE0myRTFU?autoplay=1&mute=1&loop=1&controls=0&rel=0&modestbranding=1&playsinline=1&playlist=nMBE0myRTFU",
    thumbnail: "https://img.youtube.com/vi/nMBE0myRTFU/maxresdefault.jpg",
    title: "다가생구이 숨은 메뉴 공개! 🥩 현지인만 아는 특별한 맛 #마포맛집 #생구이 #숨은메뉴",
    user: {
      username: "meat_master",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      verified: true,
      followers: "203K",
    },
    restaurant: {
      name: "다가생구이",
      location: "서울 마포구 새창로4길 16-10 1층",
      rating: 4.8,
      priceRange: "25,000원~40,000원",
      category: "한식"
    },
    likes: 156700,
    isBookmarked: false,
  },
  {
    id: "2-2",
    videoUrl: "https://www.youtube.com/embed/RW3IjL-uKKQ?autoplay=1&mute=1&loop=1&controls=0&rel=0&modestbranding=1&playsinline=1&playlist=RW3IjL-uKKQ",
    thumbnail: "https://img.youtube.com/vi/RW3IjL-uKKQ/maxresdefault.jpg",
    title: "이치라쿠 라멘 숨은 메뉴 공개! 🍜 현지인만 아는 특별한 맛 #강남맛집 #라멘 #숨은메뉴",
    user: {
      username: "ramen_lover",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      verified: false,
      followers: "67K",
    },
    restaurant: {
      name: "이치라쿠 라멘",
      location: "강남역 11번 출구",
      rating: 4.6,
      priceRange: "12,000원~18,000원",
      category: "일식"
    },
    likes: 67800,
    isBookmarked: false,
  },
  {
    id: "2-3",
    videoUrl: "https://www.youtube.com/embed/YgRBs6Y-4Gs?autoplay=1&mute=1&loop=1&controls=0&rel=0&modestbranding=1&playsinline=1&playlist=YgRBs6Y-4Gs",
    thumbnail: "https://img.youtube.com/vi/YgRBs6Y-4Gs/maxresdefault.jpg",
    title: "이치라쿠 라멘 사장님 인터뷰! 🍜 일본에서 온 진짜 레시피 #강남맛집 #라멘 #사장님인터뷰",
    user: {
      username: "food_reporter",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      verified: true,
      followers: "125K",
    },
    restaurant: {
      name: "이치라쿠 라멘",
      location: "강남역 11번 출구",
      rating: 4.6,
      priceRange: "12,000원~18,000원",
      category: "일식"
    },
    likes: 145600,
    isBookmarked: false,
  },
  {
    id: "3",
    videoUrl: "https://www.youtube.com/embed/xZUaA5mmRl0?autoplay=1&mute=1&loop=1&controls=0&rel=0&modestbranding=1&playsinline=1&playlist=xZUaA5mmRl0",
    thumbnail: "https://img.youtube.com/vi/xZUaA5mmRl0/maxresdefault.jpg",
    title: "서울 최고의 고기집 🥩 이 마블링 실화냐? #고기맛집 #한우 #서울맛집",
    user: {
      username: "meat_master",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      verified: true,
      followers: "203K",
    },
    restaurant: {
      name: "프리미엄 한우",
      location: "청담동 로데오거리",
      rating: 4.9,
      priceRange: "80,000원~120,000원",
      category: "한식"
    },
    likes: 256800,
    isBookmarked: false,
  },
  {
    id: "4",
    videoUrl: "https://www.youtube.com/embed/odcA1IP2yL8?autoplay=1&mute=1&loop=1&controls=0&rel=0&modestbranding=1&playsinline=1&playlist=odcA1IP2yL8",
    thumbnail: "https://img.youtube.com/vi/odcA1IP2yL8/maxresdefault.jpg",
    title: "신상 디저트 카페 ✨ 이 케이크 비주얼 미쳤다! #디저트카페 #케이크 #신상맛집",
    user: {
      username: "dessert_queen",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      verified: false,
      followers: "45K",
    },
    restaurant: {
      name: "달콤한 하루",
      location: "가로수길 중앙",
      rating: 4.7,
      priceRange: "8,000원~15,000원",
      category: "디저트"
    },
    likes: 67300,
    isBookmarked: false,
  },
  {
    id: "5",
    videoUrl: "https://www.youtube.com/embed/nMBE0myRTFU?autoplay=1&mute=1&loop=1&controls=0&rel=0&modestbranding=1&playsinline=1&playlist=nMBE0myRTFU",
    thumbnail: "https://img.youtube.com/vi/nMBE0myRTFU/maxresdefault.jpg",
    title: "이태원 진짜 맛있는 피자집 🍕 현지인이 인정한 그 맛! #이태원맛집 #피자 #이탈리안",
    user: {
      username: "pizza_hunter",
      avatar: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&crop=face",
      verified: true,
      followers: "156K",
    },
    restaurant: {
      name: "나폴리 피자하우스",
      location: "이태원역 1번 출구",
      rating: 4.5,
      priceRange: "18,000원~28,000원",
      category: "양식"
    },
    likes: 198500,
    isBookmarked: true,
  },
];

interface VideoFeedProps {
  feedMode: FeedMode;
  immersiveMode: boolean;
  onRestaurantSelect: (restaurant: any) => void;
  onInfluencerSelect: (influencer: any) => void;
  onReservationComplete?: (reservationData: any) => void;
  onImmersiveModeToggle?: () => void;
}

export function VideoFeed({ feedMode, immersiveMode, onRestaurantSelect, onInfluencerSelect, onReservationComplete, onImmersiveModeToggle }: VideoFeedProps) {
  const { globalMuted } = useAudio();
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentRestaurantIndex, setCurrentRestaurantIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const constraintsRef = useRef(null);

  // 초기 데이터 로드
  const loadInitialVideos = async () => {
    try {
      setIsInitialLoading(true);
      const response = await videoAPI.getVideos(0, 10, feedMode);
      setVideos(response.videos);
      setHasMore(response.hasMore);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error loading initial videos:", error);
      toast.error("영상을 불러오는데 실패했습니다");
      // 실패 시 목업 데이터 사용
      setVideos(mockVideos);
    } finally {
      setIsInitialLoading(false);
    }
  };

  // 더 많은 영상 로드
  const loadMoreVideos = async () => {
    if (isLoading || !hasMore) return;
    
    try {
      setIsLoading(true);
      const response = await videoAPI.getVideos(currentPage, 10, feedMode);
      
      setVideos(prev => {
        const updatedVideos = [...prev, ...response.videos];
        // 메모리 최적화: 100개 이상이면 앞쪽 20개 제거
        if (updatedVideos.length > 100) {
          const trimmedVideos = updatedVideos.slice(20);
          // 현재 인덱스도 조정
          setCurrentIndex(prevIndex => Math.max(0, prevIndex - 20));
          setCurrentPage(prev => Math.max(0, prev - 2)); // 페이지도 조정
          return trimmedVideos;
        }
        return updatedVideos;
      });
      
      setHasMore(response.hasMore);
      setCurrentPage(prev => prev + 1);
    } catch (error) {
      console.error("Error loading more videos:", error);
      toast.error("추가 영상을 불러오는데 실패했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 로드 및 feedMode 변경 시 데이터 리로드
  useEffect(() => {
    loadInitialVideos();
    setCurrentIndex(0);
    setCurrentRestaurantIndex(0);
  }, [feedMode]);

  // 무한 스크롤 트리거
  useEffect(() => {
    if (videos.length === 0) return;
    
    const processedVideos = getProcessedVideos();
    const groupedByRestaurant = processedVideos.reduce((acc, video) => {
      const restaurantName = video.restaurant.name;
      if (!acc[restaurantName]) {
        acc[restaurantName] = [];
      }
      acc[restaurantName].push(video);
      return acc;
    }, {} as Record<string, Video[]>);
    
    const restaurantNames = Object.keys(groupedByRestaurant);
    
    // 끝에서 2개 레스토랑 남았을 때 새 데이터 로드
    if (currentIndex >= restaurantNames.length - 2 && hasMore && !isLoading) {
      loadMoreVideos();
    }
  }, [currentIndex, videos, hasMore, isLoading]);

  // feedMode에 따른 영상 정렬 및 필터링
  const getProcessedVideos = () => {
    let processedVideos = [...videos];
    
    if (feedMode === 'trending') {
      // 트렌딩 알고리즘: 좋아요 수, 전환율, 최근 성과 기반 정렬
      processedVideos.sort((a, b) => {
        // 간단한 트렌딩 스코어 계산 (실제로는 더 복잡한 알고리즘)
        const scoreA = a.likes * 0.6 + (a.restaurant.rating * 10000) * 0.4;
        const scoreB = b.likes * 0.6 + (b.restaurant.rating * 10000) * 0.4;
        return scoreB - scoreA;
      });
    } else if (feedMode === 'nearby') {
      // 내 주변 알고리즘: 거리 기반 (mock으로 강남구 기준)
      const nearbyAreas = ['강남', '서초', '송파', '마포', '용산'];
      processedVideos.sort((a, b) => {
        const aIsNearby = nearbyAreas.some(area => a.restaurant.location.includes(area));
        const bIsNearby = nearbyAreas.some(area => b.restaurant.location.includes(area));
        
        if (aIsNearby && !bIsNearby) return -1;
        if (!aIsNearby && bIsNearby) return 1;
        
        // 같은 지역이면 평점 순
        return b.restaurant.rating - a.restaurant.rating;
      });
    }
    
    return processedVideos;
  };

  const processedVideos = getProcessedVideos();

  // 레스토랑별로 영상 그룹화
  const groupedByRestaurant = processedVideos.reduce((acc, video) => {
    const restaurantName = video.restaurant.name;
    if (!acc[restaurantName]) {
      acc[restaurantName] = [];
    }
    acc[restaurantName].push(video);
    return acc;
  }, {} as Record<string, Video[]>);

  const restaurantNames = Object.keys(groupedByRestaurant);
  const currentRestaurant = restaurantNames[currentIndex];
  const currentRestaurantVideos = groupedByRestaurant[currentRestaurant] || [];
  const currentVideo = currentRestaurantVideos[currentRestaurantIndex];

  const handleBookmark = async (videoId: string) => {
    try {
      const response = await videoAPI.toggleBookmark(videoId);
      
      // 로컬 상태 업데이트
      setVideos(prev => prev.map(video => 
        video.id === videoId 
          ? { ...video, isBookmarked: response.isBookmarked }
          : video
      ));
      
      toast.success(
        response.isBookmarked 
          ? "북마크에 추가되었습니다 ⭐" 
          : "북마크에서 제거되었습니다"
      );
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast.error("북마크 처리 중 오류가 발생했습니다");
    }
  };

  const handleShare = (videoId: string) => {
    console.log("공유하기:", videoId);
  };

  const handleReservationComplete = (reservationData: any) => {
    console.log("예약 완료:", reservationData);
    // App.tsx의 콜백 호출하여 예약 목록 업데이트
    if (onReservationComplete) {
      onReservationComplete(reservationData);
    }
    // 토스트 메시지로 예약 완료 알림
    toast.success(`🎉 ${reservationData.restaurant}에 예약이 완료되었습니다!`);
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100;
    const absX = Math.abs(info.offset.x);
    const absY = Math.abs(info.offset.y);
    
    // 수직 드래그가 더 클 때 - 다른 레스토랑으로 이동
    if (absY > absX) {
      if (info.offset.y < -threshold && currentIndex < restaurantNames.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setCurrentRestaurantIndex(0); // 새 레스토랑의 첫 번째 영상으로
      } else if (info.offset.y > threshold && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
        setCurrentRestaurantIndex(0); // 새 레스토랑의 첫 번째 영상으로
      }
    }
    // 수평 드래그가 더 클 때 - 같은 레스토랑 내 다른 영상으로 이동 또는 가게 정보로 이동
    else if (absX > absY) {
      if (info.offset.x > threshold && currentRestaurantIndex > 0) {
        // 왼쪽 스와이프: 이전 영상으로
        setCurrentRestaurantIndex(prev => prev - 1);
      } else if (info.offset.x < -threshold) {
        // 오른쪽 스와이프
        if (currentRestaurantIndex < currentRestaurantVideos.length - 1) {
          // 다음 영상이 있으면 다음 영상으로
          setCurrentRestaurantIndex(prev => prev + 1);
        } else {
          // 마지막 영상에서 오른쪽 스와이프하면 가게 정보 페이지로
          onRestaurantSelect(currentVideo.restaurant);
        }
      }
    }
  };

  return (
    <div className="relative h-screen overflow-hidden bg-black">
      {/* Initial Loading */}
      {isInitialLoading && (
        <div className="flex items-center justify-center h-full bg-black">
          <div className="text-center">
            <div className="w-12 h-12 border-3 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg">FoodieClips 로딩 중...</p>
            <p className="text-white/60 text-sm mt-2">맛있는 영상들을 준비하고 있어요 🍽️</p>
          </div>
        </div>
      )}

      {/* Video Feed */}
      {!isInitialLoading && (
        <div className="relative h-full" ref={constraintsRef}>
        <motion.div
          className="w-full h-full"
          drag
          dragConstraints={constraintsRef}
          onDragEnd={handleDragEnd}
          dragElastic={0.1}
        >
          {currentVideo && (
            <VideoCard
              key={currentVideo.id}
              {...currentVideo}
              isActive={true}
              immersiveMode={immersiveMode}
              restaurantVideoCount={currentRestaurantVideos.length}
              currentRestaurantVideoIndex={currentRestaurantIndex}
              onBookmark={() => handleBookmark(currentVideo.id)}
              onShare={() => handleShare(currentVideo.id)}
              onRestaurantClick={() => onRestaurantSelect(currentVideo.restaurant)}
              onInfluencerClick={() => onInfluencerSelect(currentVideo.user)}
              onReservationComplete={handleReservationComplete}
              onImmersiveModeToggle={onImmersiveModeToggle}
            />
          )}
        </motion.div>

        {/* Restaurant Video Indicators */}
        {currentRestaurantVideos.length > 1 && (
          <motion.div 
            className="absolute top-20 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1"
            initial={{ opacity: 1, x: 0 }}
            animate={{ 
              opacity: immersiveMode ? 0 : 1,
              x: immersiveMode ? 100 : 0
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="flex items-center gap-1">
              {currentRestaurantVideos.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentRestaurantIndex ? "bg-white" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Swipe Hint */}
        <motion.div 
          className="absolute top-32 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1"
          initial={{ opacity: 1, x: 0 }}
          animate={{ 
            opacity: immersiveMode ? 0 : 1,
            x: immersiveMode ? 100 : 0
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {currentRestaurantIndex < currentRestaurantVideos.length - 1 ? (
            <p className="text-white text-xs">
              ← 같은 가게 영상 {currentRestaurantVideos.length - currentRestaurantIndex - 1}개 더
            </p>
          ) : (
            <p className="text-white text-xs">
              → 가게 정보 보기
            </p>
          )}
        </motion.div>

        {/* Loading Indicator */}
        {isLoading && (
          <motion.div 
            className="absolute bottom-24 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <p className="text-white text-sm">새로운 맛집 발견 중...</p>
            </div>
          </motion.div>
        )}

        {/* Restaurant Scroll Indicators */}
        <motion.div 
          className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col gap-2"
          initial={{ opacity: 1, x: 0 }}
          animate={{ 
            opacity: immersiveMode ? 0 : 1,
            x: immersiveMode ? 50 : 0
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {restaurantNames.slice(0, 8).map((_, index) => (
            <div
              key={index}
              className={`w-1 h-8 rounded-full transition-colors ${
                index === currentIndex ? "bg-red-500" : "bg-white/30"
              }`}
            />
          ))}
          {restaurantNames.length > 8 && (
            <div className="w-1 h-2 rounded-full bg-white/20"></div>
          )}
        </motion.div>
        </div>
      )}
    </div>
  );
}