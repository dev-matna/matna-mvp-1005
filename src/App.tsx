import React, { useState } from "react";
import { VideoFeed } from "./components/VideoFeed";
import { NavigationBar } from "./components/NavigationBar";
import { TopBar, FeedMode } from "./components/TopBar";
import { RestaurantDetail } from "./components/RestaurantDetail";
import { InfluencerProfile } from "./components/InfluencerProfile";
import { OwnerDashboard } from "./components/OwnerDashboard";
import { MyProfile } from "./components/MyProfile";
import { HomeScreen } from "./components/HomeScreen";
import { DataTestComponent } from "./components/DataTestComponent";
import { BookmarkedRestaurants } from "./components/BookmarkedRestaurants";
import { ReservationHistory } from "./components/ReservationHistory";
import { NotificationSettings } from "./components/NotificationSettings";
import { LocationSettings } from "./components/LocationSettings";
import { AccountSettings } from "./components/AccountSettings";
import { PrivacySettings } from "./components/PrivacySettings";
import { SupportCenter } from "./components/SupportCenter";
import { Toaster } from "./components/ui/sonner";
import { AudioProvider } from "./utils/AudioContext";
import { ErrorBoundary } from "./components/ErrorBoundary";

export type ScreenType = 'home' | 'explore' | 'my' | 'detail' | 'influencer' | 'dashboard' | 'test' | 'bookmarks' | 'reservations' | 'notifications' | 'location' | 'account' | 'privacy' | 'support';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('explore');
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
  const [selectedInfluencer, setSelectedInfluencer] = useState<any>(null);
  const [feedMode, setFeedMode] = useState<FeedMode>('trending');
  const [immersiveMode, setImmersiveMode] = useState(false);


  // 목업 예약 데이터
  const [reservations, setReservations] = useState<any[]>([
    {
      id: "1",
      restaurant: "강남 갈비천왕",
      category: "한식",
      date: "2024-10-05",
      time: "18:30",
      guests: 4,
      location: "강남구 역삼동 123-45",
      status: "confirmed",
      reservationNumber: "R240001",
      phone: "02-1234-5678",
      specialRequests: "창가 자리 요청"
    },
    {
      id: "2", 
      restaurant: "홍대 BBQ 스팟",
      category: "고기구이",
      date: "2024-10-07",
      time: "19:00",
      guests: 2,
      location: "홍대입구역 2번 출구",
      status: "confirmed",
      reservationNumber: "R240002",
      phone: "02-2345-6789",
      specialRequests: ""
    },
    {
      id: "3",
      restaurant: "이태원 파스타 하우스",
      category: "양식",
      date: "2024-10-10",
      time: "20:00", 
      guests: 3,
      location: "용산구 이태원동 567-89",
      status: "confirmed",
      reservationNumber: "R240003",
      phone: "02-3456-7890",
      specialRequests: "알레르기: 견과류"
    },
    {
      id: "4",
      restaurant: "명동 냉면집",
      category: "한식",
      date: "2024-10-12",
      time: "12:30",
      guests: 2,
      location: "중구 명동2가 101-23",
      status: "pending",
      reservationNumber: "R240004", 
      phone: "02-4567-8901",
      specialRequests: ""
    },
    {
      id: "5",
      restaurant: "압구정 초밥 마스터",
      category: "일식",
      date: "2024-10-15",
      time: "19:30",
      guests: 4,
      location: "강남구 압구정동 234-56",
      status: "confirmed",
      reservationNumber: "R240005",
      phone: "02-5678-9012",
      specialRequests: "오마카세 코스 예약"
    }
  ]);

  const handleReservationComplete = (newReservation: any) => {
    setReservations(prev => [...prev, { ...newReservation, id: Date.now().toString() }]);
  };

  const handleReservationCancel = (reservationId: string) => {
    setReservations(prev => prev.filter(r => r.id !== reservationId));
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen 
          onExploreClick={() => setCurrentScreen('explore')}
          onCategoryClick={() => setCurrentScreen('explore')}
          reservations={reservations}
          onReservationComplete={handleReservationComplete}
          onReservationsClick={() => setCurrentScreen('reservations')}
        />;
      case 'explore':
        return <VideoFeed 
          feedMode={feedMode}
          immersiveMode={immersiveMode}
          onRestaurantSelect={(restaurant) => {
            setSelectedRestaurant(restaurant);
            setCurrentScreen('detail');
          }}
          onInfluencerSelect={(influencer) => {
            setSelectedInfluencer(influencer);
            setCurrentScreen('influencer');
          }}
          onReservationComplete={handleReservationComplete}
          onImmersiveModeToggle={() => setImmersiveMode(!immersiveMode)}
        />;
      case 'my':
        return <MyProfile 
          onBack={() => setCurrentScreen('home')}
          onDashboardAccess={() => setCurrentScreen('dashboard')}
          onTestAccess={() => setCurrentScreen('test')}
          onBookmarksAccess={() => setCurrentScreen('bookmarks')}
          onReservationsAccess={() => setCurrentScreen('reservations')}
          onNotificationsAccess={() => setCurrentScreen('notifications')}
          onLocationAccess={() => setCurrentScreen('location')}
          onAccountAccess={() => setCurrentScreen('account')}
          onPrivacyAccess={() => setCurrentScreen('privacy')}
          onSupportAccess={() => setCurrentScreen('support')}
        />;
      case 'detail':
        return <RestaurantDetail 
          restaurant={selectedRestaurant} 
          onBack={() => setCurrentScreen('explore')} 
        />;
      case 'influencer':
        return <InfluencerProfile 
          influencer={selectedInfluencer}
          onBack={() => setCurrentScreen('explore')} 
        />;
      case 'dashboard':
        return <OwnerDashboard onBack={() => setCurrentScreen('my')} />;
      case 'test':
        return <DataTestComponent onBack={() => setCurrentScreen('my')} />;
      case 'bookmarks':
        return <BookmarkedRestaurants 
          onBack={() => setCurrentScreen('my')}
          onRestaurantSelect={(restaurant) => {
            setSelectedRestaurant(restaurant);
            setCurrentScreen('detail');
          }}
        />;
      case 'reservations':
        return <ReservationHistory 
          onBack={() => setCurrentScreen('my')}
          reservations={reservations}
          onReservationCancel={handleReservationCancel}
          onReservationEdit={(reservation) => {
            console.log('Edit reservation:', reservation);
          }}
        />;
      case 'notifications':
        return <NotificationSettings onBack={() => setCurrentScreen('my')} />;
      case 'location':
        return <LocationSettings onBack={() => setCurrentScreen('my')} />;
      case 'account':
        return <AccountSettings onBack={() => setCurrentScreen('my')} />;
      case 'privacy':
        return <PrivacySettings onBack={() => setCurrentScreen('my')} />;
      case 'support':
        return <SupportCenter onBack={() => setCurrentScreen('my')} />;
      default:
        return <HomeScreen 
          onExploreClick={() => setCurrentScreen('explore')}
          onCategoryClick={() => setCurrentScreen('explore')}
          reservations={reservations}
          onReservationComplete={handleReservationComplete}
          onReservationsClick={() => setCurrentScreen('reservations')}
        />;
    }
  };

  return (
    <ErrorBoundary>
      <AudioProvider>
        <div className="min-h-screen bg-gray-100">
          {/* Mobile Container - Full width on mobile, constrained on PC */}
          <div className="w-full h-screen bg-white relative mobile-container">
            {renderScreen()}
            
            {/* Overlay TopBar only for explore screen */}
            {currentScreen === 'explore' && (
              <TopBar 
                feedMode={feedMode}
                immersiveMode={immersiveMode}
                onFeedModeChange={setFeedMode}
              />
            )}
            
            {/* Toast Notifications */}
            <Toaster />
          </div>
          
          {/* Navigation Bar - Outside container for proper PC positioning */}
          <NavigationBar 
            currentScreen={currentScreen}
            immersiveMode={immersiveMode}
            onScreenChange={setCurrentScreen}
          />
        </div>
      </AudioProvider>
    </ErrorBoundary>
  );
}