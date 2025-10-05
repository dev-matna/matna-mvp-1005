import { projectId, publicAnonKey } from './supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-8545d0a0`;

// API 유틸리티 함수
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// 비디오 관련 API
export const videoAPI = {
  // 무한 스크롤을 위한 비디오 목록 가져오기
  getVideos: async (page: number = 0, limit: number = 10, feedMode: string = 'trending') => {
    return apiCall(`/videos?page=${page}&limit=${limit}&feedMode=${feedMode}`);
  },

  // 북마크 토글
  toggleBookmark: async (videoId: string) => {
    return apiCall(`/videos/${videoId}/bookmark`, {
      method: 'POST',
    });
  },

  // 좋아요 업데이트
  updateLikes: async (videoId: string, increment: boolean) => {
    return apiCall(`/videos/${videoId}/like`, {
      method: 'POST',
      body: JSON.stringify({ increment }),
    });
  },
};

// 레스토랑 관련 API
export const restaurantAPI = {
  // 레스토랑 상세 정보
  getRestaurant: async (restaurantId: string) => {
    return apiCall(`/restaurants/${restaurantId}`);
  },
};

// 예약 관련 API
export const reservationAPI = {
  // 예약 생성
  createReservation: async (reservationData: any) => {
    return apiCall('/reservations', {
      method: 'POST',
      body: JSON.stringify(reservationData),
    });
  },
};

// 헬스체크
export const healthCheck = async () => {
  return apiCall('/health');
};

// 데이터베이스 테스트
export const databaseTest = async () => {
  return apiCall('/db-test');
};