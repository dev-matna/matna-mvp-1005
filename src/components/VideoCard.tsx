import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Heart, Send, Play, Pause, MapPin, Star, Volume2, VolumeX, Eye, EyeOff } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ReservationSheet } from "./ReservationSheet";
import { useAudio } from "../utils/AudioContext";

// YouTube Player API 타입 정의
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

// 텍스트 펼치기 컴포넌트
function TextExpandCard({ text, immersiveMode }: { text: string; immersiveMode: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldTruncate, setShouldTruncate] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (textRef.current) {
      const lineHeight = parseInt(getComputedStyle(textRef.current).lineHeight);
      const height = textRef.current.scrollHeight;
      setShouldTruncate(height > lineHeight * 1.2); // 한 줄보다 높으면 truncate
    }
  }, [text]);

  return (
    <div 
      className="mb-4 cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        if (shouldTruncate) setIsExpanded(!isExpanded);
      }}
    >
      <p 
        ref={textRef}
        className={`text-sm leading-relaxed text-white ${
          !immersiveMode ? 'drop-shadow-lg' : ''
        } ${
          !isExpanded && shouldTruncate ? 'line-clamp-1' : ''
        }`}
      >
        {text}
      </p>
    </div>
  );
}

interface VideoCardProps {
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
  restaurant: {
    name: string;
    location: string;
    rating: number;
    priceRange: string;
    category: string;
  };
  likes: number;
  isBookmarked: boolean;
  isActive?: boolean;
  immersiveMode?: boolean;
  restaurantVideoCount?: number;
  currentRestaurantVideoIndex?: number;
  onBookmark: () => void;
  onShare: () => void;
  onRestaurantClick: () => void;
  onInfluencerClick: () => void;
  onReservationComplete?: (reservationData: any) => void;
  onImmersiveModeToggle?: () => void;
}

const VideoCard = React.memo(function VideoCard({
  videoUrl,
  thumbnail,
  title,
  user,
  restaurant,
  likes,
  isBookmarked,
  isActive = false,
  immersiveMode = false,
  restaurantVideoCount = 1,
  currentRestaurantVideoIndex = 0,
  onBookmark,
  onShare,
  onRestaurantClick,
  onInfluencerClick,
  onReservationComplete = () => {},
  onImmersiveModeToggle,
}: VideoCardProps) {
  const { globalMuted, toggleGlobalMute } = useAudio();
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const youtubePlayerRef = useRef<any>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const [youtubeAPIReady, setYoutubeAPIReady] = useState(false);

  // YouTube API 로드
  useEffect(() => {
    if (!window.YT) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      document.body.appendChild(script);

      window.onYouTubeIframeAPIReady = () => {
        setYoutubeAPIReady(true);
      };
    } else {
      setYoutubeAPIReady(true);
    }
  }, []);

  // YouTube 비디오 ID 추출
  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/embed\/|youtu\.be\/)([^?&]+)/);
    return match ? match[1] : null;
  };

  // YouTube Player 초기화
  useEffect(() => {
    if (youtubeAPIReady && isActive && playerContainerRef.current && !youtubePlayerRef.current) {
      const videoId = getYouTubeVideoId(videoUrl);
      if (videoId) {
        youtubePlayerRef.current = new window.YT.Player(playerContainerRef.current, {
          videoId: videoId,
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            loop: 1,
            playlist: videoId,
            mute: globalMuted ? 1 : 0,
            enablejsapi: 1,
            origin: window.location.origin
          },
          events: {
            onReady: (event: any) => {
              setIsPlaying(true);
              if (globalMuted) {
                event.target.mute();
              } else {
                event.target.unMute();
              }
            },
            onStateChange: (event: any) => {
              setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
            }
          }
        });
      }
    }

    // 컴포넌트 언마운트 시 플레이어 정리
    return () => {
      if (youtubePlayerRef.current) {
        try {
          youtubePlayerRef.current.destroy();
          youtubePlayerRef.current = null;
        } catch (error) {
          console.warn('YouTube player cleanup error:', error);
        }
      }
    };
  }, [youtubeAPIReady, isActive, videoUrl]);

  // globalMuted 상태 변경 시 YouTube Player API로 음소거 제어
  useEffect(() => {
    if (youtubePlayerRef.current && youtubePlayerRef.current.mute && youtubePlayerRef.current.unMute) {
      try {
        if (globalMuted) {
          youtubePlayerRef.current.mute();
        } else {
          youtubePlayerRef.current.unMute();
        }
      } catch (error) {
        console.warn('YouTube player mute control error:', error);
      }
    }
    
    // 일반 video 요소의 음소거도 동기화
    if (videoRef.current) {
      videoRef.current.muted = globalMuted;
    }
  }, [globalMuted]);

  // 활성화된 비디오만 자동 재생 (non-YouTube 비디오용)
  useEffect(() => {
    if (isActive && !isYouTubeEmbed) {
      const timer = setTimeout(() => {
        setIsPlaying(true);
        if (videoRef.current) {
          videoRef.current.muted = globalMuted;
        }
      }, 500);
      return () => clearTimeout(timer);
    } else if (!isActive) {
      setIsPlaying(false);
      // YouTube 플레이어 정리
      if (youtubePlayerRef.current) {
        try {
          youtubePlayerRef.current.destroy();
          youtubePlayerRef.current = null;
        } catch (error) {
          console.warn('YouTube player cleanup error:', error);
        }
      }
    }
  }, [isActive]);



  const togglePlay = () => {
    if (youtubePlayerRef.current) {
      try {
        if (isPlaying) {
          youtubePlayerRef.current.pauseVideo();
        } else {
          youtubePlayerRef.current.playVideo();
        }
      } catch (error) {
        console.warn('YouTube player control error:', error);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };



  // YouTube embed URL인지 확인
  const isYouTubeEmbed = videoUrl.includes('youtube.com/embed') || videoUrl.includes('youtu.be');

  // 화면 클릭 시 재생/일시정지 토글
  const handleScreenTap = (e: React.MouseEvent) => {
    // 버튼이나 다른 인터랙티브 요소가 아닌 경우에만 재생 토글
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('[role="button"]') || target.closest('a')) {
      return;
    }
    togglePlay();
  };

  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="relative w-full h-screen bg-white overflow-hidden" onClick={handleScreenTap}>
      {/* Video Background */}
      <div className="absolute inset-0">
        <div className="relative w-full h-full">
          {videoUrl && isPlaying ? (
            isYouTubeEmbed ? (
              <div 
                ref={playerContainerRef}
                className="w-full h-full"
                style={{ 
                  pointerEvents: 'none' // 플레이어 클릭 이벤트 방지
                }}
              />
            ) : (
              <video
                ref={videoRef}
                src={videoUrl}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted={globalMuted}
                playsInline
                style={{ 
                  pointerEvents: 'none' // video 직접 클릭 방지
                }}
              />
            )
          ) : (
            <ImageWithFallback
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover"
            />
          )}
          
          {/* 재생 중일 때 미묘한 애니메이션 효과 - 몰입 모드가 아닐 때만 */}
          {isPlaying && !immersiveMode && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-40" />
          )}
        </div>
        
        {/* Play/Pause Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: isPlaying ? 0 : 1 }}
            transition={{ duration: 0.2 }}
            className="bg-black/50 rounded-full p-4 pointer-events-auto"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="text-white hover:bg-white/20 w-16 h-16"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8 ml-1" />
              )}
            </Button>
          </motion.div>
        </div>
      </div>

      {/* 몰입 모드 토글 버튼 - 항상 보이도록 */}
      <div className="absolute top-36 right-4 z-20">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onImmersiveModeToggle?.();
          }}
          className="text-white hover:bg-white/20 bg-black/50 backdrop-blur-sm rounded-full w-10 h-10"
        >
          {immersiveMode ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* 개별 스피커 버튼 (눈 모양 아래) */}
      <div className="absolute top-48 right-4 z-20">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            // 전체 음소거 토글
            toggleGlobalMute();
          }}
          className="text-white hover:bg-white/20 bg-black/50 backdrop-blur-sm rounded-full w-10 h-10"
        >
          {globalMuted ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </Button>
      </div>





      {/* Gradient Overlay - 몰입 모드에 따라 조건부 적용 */}
      <div className={`absolute inset-0 bg-gradient-to-t ${
        !immersiveMode ? 'from-black/70 via-transparent to-transparent' : 'from-black/30 via-transparent to-transparent'
      }`} />

      {/* User Info - 더 위로 이동 */}
      <motion.div 
        className="absolute bottom-64 left-4 right-20 text-white"
        initial={{ opacity: 1, x: 0 }}
        animate={{ 
          opacity: immersiveMode ? 0 : 1,
          x: immersiveMode ? -100 : 0
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <motion.div 
          className="flex items-center gap-3 mb-2 cursor-pointer"
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            onInfluencerClick();
          }}
        >
          <Avatar className="w-10 h-10 border-2 border-white">
            <AvatarImage src={user.avatar} alt={user.username} />
            <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2">
            <span className="font-semibold">@{user.username}</span>
            {user.verified && (
              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </div>
          {user.followers && (
            <div className="text-sm text-white/80 mt-1">
              {user.followers} 팔로워
            </div>
          )}
        </motion.div>
        
        {/* 완전 투명 텍스트 - 한줄로 표시, 클릭시 펼쳐짐 */}
        <TextExpandCard text={title} immersiveMode={immersiveMode} />
      </motion.div>

      {/* Restaurant Info Card - 완전 투명 배경 */}
      <motion.div 
        className="absolute bottom-32 left-4 right-20 p-4"
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 1, x: 0 }}
        animate={{ 
          opacity: immersiveMode ? 0 : 1,
          x: immersiveMode ? -100 : 0
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        onClick={(e) => {
          e.stopPropagation();
          onRestaurantClick();
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className={`font-bold text-lg text-white ${!immersiveMode ? 'drop-shadow-lg' : ''}`}>{restaurant.name}</h3>
          <Badge variant="secondary" className={`bg-red-500/90 text-white border-red-400 ${!immersiveMode ? 'drop-shadow-md' : ''}`}>
            {restaurant.category}
          </Badge>
        </div>
        
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-1">
            <Star className={`w-4 h-4 fill-yellow-400 text-yellow-400 ${!immersiveMode ? 'drop-shadow-md' : ''}`} />
            <span className={`text-sm font-medium text-white ${!immersiveMode ? 'drop-shadow-lg' : ''}`}>{restaurant.rating}</span>
          </div>
          <span className={`text-sm text-white ${!immersiveMode ? 'drop-shadow-lg' : ''}`}>{restaurant.priceRange}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-white">
            <MapPin className={`w-4 h-4 ${!immersiveMode ? 'drop-shadow-md' : ''}`} />
            <span className={`text-sm ${!immersiveMode ? 'drop-shadow-lg' : ''}`}>{restaurant.location}</span>
          </div>
          <ReservationSheet 
            restaurant={restaurant}
            onReservationComplete={onReservationComplete}
            onModalClose={() => {
              // 모달이 닫힐 때 활성화된 영상이면 다시 재생
              if (isActive) {
                setIsPlaying(true);
              }
            }}
          >
            <Button 
              size="sm"
              className="bg-gradient-to-r from-red-500 to-yellow-500 hover:from-red-600 hover:to-yellow-600 text-white px-4 py-1 h-8"
              onClick={(e) => {
                e.stopPropagation();
                // 예약 모달 열 때 영상 일시정지
                setIsPlaying(false);
              }}
            >
              지금 예약
            </Button>
          </ReservationSheet>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        className="absolute right-4 bottom-72 flex flex-col gap-4"
        initial={{ opacity: 1, x: 0 }}
        animate={{ 
          opacity: immersiveMode ? 0 : 1,
          x: immersiveMode ? 100 : 0
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <motion.div
          whileTap={{ scale: 0.8 }}
          className="flex flex-col items-center"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onBookmark();
            }}
            className="text-white hover:bg-white/20 w-12 h-12 bg-black/30 backdrop-blur-sm rounded-full"
          >
            <Heart
              className={`w-6 h-6 ${isBookmarked ? "fill-red-500 text-red-500" : ""}`}
            />
          </Button>

        </motion.div>

        <motion.div
          whileTap={{ 
            scale: 0.8,
            rotate: 360,
          }}
          whileHover={{ 
            scale: 1.1,
            transition: { duration: 0.2 }
          }}
          className="flex flex-col items-center"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onShare();
            }}
            className="text-white hover:bg-white/20 w-12 h-12 bg-black/30 backdrop-blur-sm rounded-full transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-500/30 hover:to-purple-500/30"
          >
            <Send className="w-6 h-6 transition-transform duration-200" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
});

export { VideoCard };