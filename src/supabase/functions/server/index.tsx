import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Supabase client with service role (admin privileges)
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Test and try to create PostgreSQL tables
const createRealTables = async () => {
  try {
    console.log("🗄️ Testing PostgreSQL table access...");
    
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Table access timeout')), 10000); // 10 second timeout
    });
    
    // First, try to query existing tables to see if we can access them
    const queryPromise = supabaseAdmin
      .from('restaurants_foodieclips')
      .select('id')
      .limit(1);
    
    const { data: existingRestaurants, error: queryError } = await Promise.race([
      queryPromise,
      timeoutPromise
    ]) as any;
    
    if (!queryError) {
      console.log("✅ PostgreSQL tables already exist and accessible!");
      return true;
    }
    
    // If table doesn't exist, try to check table schema
    if (queryError.code === 'PGRST116') {
      console.log("📊 Tables don't exist, checking if we can create them...");
      
      // Try to use Supabase SQL directly (this might not work in Figma Make)
      try {
        // Attempt to create tables using raw SQL if possible
        const { error: createError } = await supabaseAdmin.rpc('create_foodieclips_tables');
        
        if (!createError) {
          console.log("🎉 Successfully created PostgreSQL tables!");
          return true;
        }
      } catch (rpcError) {
        console.log("⚠️ RPC table creation not available:", rpcError);
      }
      
      // Alternative: Try to insert test data to see if tables exist
      try {
        const testData = {
          id: 'test_restaurant',
          name: 'Test Restaurant',
          location: 'Test Location', 
          rating: 4.5,
          price_range: '10,000-20,000원',
          category: '한식',
          description: 'Test Description',
          phone: '02-000-0000',
          hours: '09:00-22:00',
          coordinates: { lat: 37.5665, lng: 126.9780 }
        };
        
        const { error: insertError } = await supabaseAdmin
          .from('restaurants_foodieclips')
          .insert(testData);
        
        if (!insertError) {
          console.log("🎉 PostgreSQL tables are available!");
          // Clean up test data
          await supabaseAdmin
            .from('restaurants_foodieclips')
            .delete()
            .eq('id', 'test_restaurant');
          return true;
        }
      } catch (insertError) {
        console.log("⚠️ Cannot insert into PostgreSQL tables:", insertError);
      }
    }
    
    console.log("📦 PostgreSQL not available, using KV store fallback");
    return false;
    
  } catch (error) {
    console.error("❌ Error testing PostgreSQL access:", error);
    console.log("📦 Falling back to KV store");
    return false;
  }
};

// Initialize sample data if not exists
const initializeSampleData = async () => {
  try {
    console.log("🔍 Checking if sample data exists...");
    const existingVideos = await kv.get("videos_initialized");
    if (!existingVideos) {
      console.log("📦 Initializing FoodieClips sample data...");
      
      // Sample restaurants
      const restaurants = [
        {
          id: "rest_1",
          name: "다가생구이",
          location: "서울 마포구 새창로4길 16-10 1층",
          rating: 4.8,
          priceRange: "25,000원~40,000원",
          category: "한식",
          description: "신선한 생고기와 특제 양념으로 유명한 마포 맛집",
          phone: "02-123-4567",
          hours: "17:00~02:00",
          coordinates: { lat: 37.5665, lng: 126.9780 }
        },
        {
          id: "rest_2", 
          name: "이치라쿠 라멘",
          location: "강남역 11번 출구",
          rating: 4.6,
          priceRange: "12,000원~18,000원",
          category: "일식",
          description: "정통 일본식 라멘을 맛볼 수 있는 강남 라멘 맛집",
          phone: "02-987-6543",
          hours: "11:00~22:00",
          coordinates: { lat: 37.4979, lng: 127.0276 }
        },
        {
          id: "rest_3",
          name: "프리미엄 한우",
          location: "청담동 로데오거리",
          rating: 4.9,
          priceRange: "80,000원~120,000원", 
          category: "한식",
          description: "최고급 한우를 제공하는 청담동 프리미엄 레스토랑",
          phone: "02-555-7777",
          hours: "18:00~24:00",
          coordinates: { lat: 37.5205, lng: 127.0539 }
        },
        {
          id: "rest_4",
          name: "달콤한 하루",
          location: "가로수길 중앙",
          rating: 4.7,
          priceRange: "8,000원~15,000원",
          category: "디저트",
          description: "인스타그램에서 핫한 감성 디저트 카페",
          phone: "02-333-2222",
          hours: "10:00~22:00",
          coordinates: { lat: 37.5201, lng: 127.0231 }
        },
        {
          id: "rest_5",
          name: "나폴리 피자하우스",
          location: "이태원역 1번 출구",
          rating: 4.5,
          priceRange: "18,000원~28,000원",
          category: "양식",
          description: "정통 나폴리 스타일 화덕 피자 전문점",
          phone: "02-111-9999",
          hours: "12:00~23:00",
          coordinates: { lat: 37.5347, lng: 126.9947 }
        }
      ];

      // Sample influencers
      const influencers = [
        {
          id: "user_1",
          username: "foodie_jane",
          displayName: "푸디제인",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b890?w=100&h=100&fit=crop&crop=face",
          verified: true,
          followers: 125000,
          bio: "맛집 탐험가 🍽️ 진짜 맛집만 소개합니다"
        },
        {
          id: "user_2",
          username: "meat_master",
          displayName: "고기마스터",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
          verified: true,
          followers: 89000,
          bio: "고기 전문 리뷰어 🥩 맛있는 고기집 추천"
        },
        {
          id: "user_3",
          username: "ramen_lover",
          displayName: "라면러버",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
          verified: false,
          followers: 45000,
          bio: "라멘 덕후 🍜 일본 라멘 전문"
        },
        {
          id: "user_4",
          username: "dessert_queen",
          displayName: "디저트퀸",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
          verified: false,
          followers: 67000,
          bio: "달콤한 디저트 탐험 ✨ 감성 카페 추천"
        },
        {
          id: "user_5",
          username: "pizza_hunter",
          displayName: "피자헌터",
          avatar: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&crop=face",
          verified: true,
          followers: 78000,
          bio: "피자 전문가 🍕 진짜 맛있는 피자만"
        }
      ];

      // Sample videos
      const videos = [
        {
          id: "video_1",
          restaurantId: "rest_1",
          userId: "user_1",
          title: "다가생구이 맛집 발견! 🔥 이 생고기 진짜 대박이에요 #마포맛집 #생구이 #맛스타그램",
          videoUrl: "https://www.youtube.com/embed/xZUaA5mmRl0?autoplay=1&mute=1&loop=1&controls=0&rel=0&modestbranding=1&playsinline=1&playlist=xZUaA5mmRl0",
          thumbnail: "https://img.youtube.com/vi/xZUaA5mmRl0/maxresdefault.jpg",
          likes: 125400,
          views: 1250000,
          createdAt: new Date("2024-12-20").toISOString(),
          isBookmarked: false
        },
        {
          id: "video_2",
          restaurantId: "rest_1", 
          userId: "user_1",
          title: "다가생구이 사장님이 직접 알려주는 비법! 🔥 이래서 맛있구나 #마포맛집 #생구이 #요리비법",
          videoUrl: "https://www.youtube.com/embed/odcA1IP2yL8?autoplay=1&mute=1&loop=1&controls=0&rel=0&modestbranding=1&playsinline=1&playlist=odcA1IP2yL8",
          thumbnail: "https://img.youtube.com/vi/odcA1IP2yL8/maxresdefault.jpg",
          likes: 89300,
          views: 890000,
          createdAt: new Date("2024-12-19").toISOString(),
          isBookmarked: true
        },
        {
          id: "video_3",
          restaurantId: "rest_1",
          userId: "user_2", 
          title: "다가생구이 숨은 메뉴 공개! 🥩 현지인만 아는 특별한 맛 #마포맛집 #생구이 #숨은메뉴",
          videoUrl: "https://www.youtube.com/embed/nMBE0myRTFU?autoplay=1&mute=1&loop=1&controls=0&rel=0&modestbranding=1&playsinline=1&playlist=nMBE0myRTFU",
          thumbnail: "https://img.youtube.com/vi/nMBE0myRTFU/maxresdefault.jpg",
          likes: 156700,
          views: 1567000,
          createdAt: new Date("2024-12-18").toISOString(),
          isBookmarked: false
        },
        {
          id: "video_4",
          restaurantId: "rest_2",
          userId: "user_3",
          title: "이치라쿠 라멘 숨은 메뉴 공개! 🍜 현지인만 아는 특별한 맛 #강남맛집 #라멘 #숨은메뉴",
          videoUrl: "https://www.youtube.com/embed/RW3IjL-uKKQ?autoplay=1&mute=1&loop=1&controls=0&rel=0&modestbranding=1&playsinline=1&playlist=RW3IjL-uKKQ",
          thumbnail: "https://img.youtube.com/vi/RW3IjL-uKKQ/maxresdefault.jpg",
          likes: 67800,
          views: 678000,
          createdAt: new Date("2024-12-17").toISOString(),
          isBookmarked: false
        },
        {
          id: "video_5",
          restaurantId: "rest_3",
          userId: "user_2",
          title: "서울 최고의 고기집 🥩 이 마블링 실화냐? #고기맛집 #한우 #서울맛집",
          videoUrl: "https://www.youtube.com/embed/xZUaA5mmRl0?autoplay=1&mute=1&loop=1&controls=0&rel=0&modestbranding=1&playsinline=1&playlist=xZUaA5mmRl0",
          thumbnail: "https://img.youtube.com/vi/xZUaA5mmRl0/maxresdefault.jpg",
          likes: 256800,
          views: 2568000,
          createdAt: new Date("2024-12-16").toISOString(),
          isBookmarked: false
        }
      ];

      // Store data in KV store
      await kv.set("restaurants", restaurants);
      await kv.set("influencers", influencers);  
      await kv.set("videos", videos);
      await kv.set("videos_initialized", "true");
      
      console.log("Sample data initialized successfully!");
    }
  } catch (error) {
    console.error("Error initializing sample data:", error);
  }
};

// Track initialization status
let isInitialized = false;
let initializationPromise: Promise<void> | null = null;

// Initialize data on startup  
const initializeDatabase = async () => {
  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    try {
      console.log("🚀 Starting database initialization...");
      const tablesCreated = await createRealTables();
      if (tablesCreated) {
        console.log("🎉 Using real PostgreSQL database!");
        await initializePostgreSQLData();
      } else {
        console.log("📦 Using KV store fallback");
        await initializeSampleData();
      }
      isInitialized = true;
      console.log("✅ Database initialization completed!");
    } catch (error) {
      console.error("❌ Database initialization failed:", error);
      // Continue with empty state rather than failing
      isInitialized = true;
    }
  })();

  return initializationPromise;
};

// Initialize PostgreSQL data
const initializePostgreSQLData = async () => {
  try {
    console.log("🔍 Checking PostgreSQL data existence...");
    
    // Add timeout for data check
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('PostgreSQL data check timeout')), 10000);
    });
    
    const dataCheckPromise = supabaseAdmin
      .from('restaurants_foodieclips')
      .select('id')
      .limit(1);
    
    const { data: existingRestaurants } = await Promise.race([
      dataCheckPromise,
      timeoutPromise
    ]) as any;
      
    if (existingRestaurants && existingRestaurants.length > 0) {
      console.log("✅ PostgreSQL data already exists");
      return;
    }

    console.log("🌱 Seeding PostgreSQL database...");
    
    // Insert restaurants
    const restaurants = [
      {
        id: "rest_1",
        name: "다가생구이",
        location: "서울 마포구 새창로4길 16-10 1층",
        rating: 4.8,
        price_range: "25,000원~40,000원",
        category: "한식",
        description: "신선한 생고기와 특제 양념으로 유명한 마포 맛집",
        phone: "02-123-4567",
        hours: "17:00~02:00",
        coordinates: { lat: 37.5665, lng: 126.9780 }
      },
      {
        id: "rest_2", 
        name: "이치라쿠 라멘",
        location: "강남역 11번 출구",
        rating: 4.6,
        price_range: "12,000원~18,000원",
        category: "일식",
        description: "정통 일본식 라멘을 맛볼 수 있는 강남 라멘 맛집",
        phone: "02-987-6543",
        hours: "11:00~22:00",
        coordinates: { lat: 37.4979, lng: 127.0276 }
      },
      {
        id: "rest_3",
        name: "프리미엄 한우",
        location: "청담동 로데오거리",
        rating: 4.9,
        price_range: "80,000원~120,000원", 
        category: "한식",
        description: "최고급 한우를 제공하는 청담동 프리미엄 레스토랑",
        phone: "02-555-7777",
        hours: "18:00~24:00",
        coordinates: { lat: 37.5205, lng: 127.0539 }
      },
      {
        id: "rest_4",
        name: "달콤한 하루",
        location: "가로수길 중앙",
        rating: 4.7,
        price_range: "8,000원~15,000원",
        category: "디저트",
        description: "인스타그램에서 핫한 감성 디저트 카페",
        phone: "02-333-2222",
        hours: "10:00~22:00",
        coordinates: { lat: 37.5201, lng: 127.0231 }
      },
      {
        id: "rest_5",
        name: "나폴리 피자하우스",
        location: "이태원역 1번 출구",
        rating: 4.5,
        price_range: "18,000원~28,000원",
        category: "양식",
        description: "정통 나폴리 스타일 화덕 피자 전문점",
        phone: "02-111-9999",
        hours: "12:00~23:00",
        coordinates: { lat: 37.5347, lng: 126.9947 }
      }
    ];

    await supabaseAdmin.from('restaurants_foodieclips').insert(restaurants);

    // Insert influencers
    const influencers = [
      {
        id: "user_1",
        username: "foodie_jane",
        display_name: "푸디제인",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b890?w=100&h=100&fit=crop&crop=face",
        verified: true,
        followers: 125000,
        bio: "맛집 탐험가 🍽️ 진짜 맛집만 소개합니다"
      },
      {
        id: "user_2",
        username: "meat_master",
        display_name: "고기마스터",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        verified: true,
        followers: 89000,
        bio: "고기 전문 리뷰어 🥩 맛있는 고기집 추천"
      },
      {
        id: "user_3",
        username: "ramen_lover",
        display_name: "라면러버",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        verified: false,
        followers: 45000,
        bio: "라멘 덕후 🍜 일본 라멘 전문"
      },
      {
        id: "user_4",
        username: "dessert_queen",
        display_name: "디저트퀸",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        verified: false,
        followers: 67000,
        bio: "달콤한 디저트 탐험 ✨ 감성 카페 추천"
      },
      {
        id: "user_5",
        username: "pizza_hunter",
        display_name: "피자헌터",
        avatar: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&crop=face",
        verified: true,
        followers: 78000,
        bio: "피자 전문가 🍕 진짜 맛있는 피자만"
      }
    ];

    await supabaseAdmin.from('influencers_foodieclips').insert(influencers);

    // Insert videos
    const videos = [
      {
        id: "video_1",
        restaurant_id: "rest_1",
        user_id: "user_1",
        title: "다가생구이 맛집 발견! 🔥 이 생고기 진짜 대박이에요 #마포맛집 #생구이 #맛스타그램",
        video_url: "https://www.youtube.com/embed/xZUaA5mmRl0?autoplay=1&mute=1&loop=1&controls=0&rel=0&modestbranding=1&playsinline=1&playlist=xZUaA5mmRl0",
        thumbnail: "https://img.youtube.com/vi/xZUaA5mmRl0/maxresdefault.jpg",
        likes: 125400,
        views: 1250000,
        is_bookmarked: false
      },
      {
        id: "video_2",
        restaurant_id: "rest_1", 
        user_id: "user_1",
        title: "다가생구이 사장님이 직접 알려주는 비법! 🔥 이래서 맛있구나 #마포맛집 #생구이 #요리비법",
        video_url: "https://www.youtube.com/embed/odcA1IP2yL8?autoplay=1&mute=1&loop=1&controls=0&rel=0&modestbranding=1&playsinline=1&playlist=odcA1IP2yL8",
        thumbnail: "https://img.youtube.com/vi/odcA1IP2yL8/maxresdefault.jpg",
        likes: 89300,
        views: 890000,
        is_bookmarked: true
      },
      {
        id: "video_3",
        restaurant_id: "rest_1",
        user_id: "user_2", 
        title: "다가생구이 숨은 메뉴 공개! 🥩 현지인만 아는 특별한 맛 #마포맛집 #생구이 #숨은메뉴",
        video_url: "https://www.youtube.com/embed/nMBE0myRTFU?autoplay=1&mute=1&loop=1&controls=0&rel=0&modestbranding=1&playsinline=1&playlist=nMBE0myRTFU",
        thumbnail: "https://img.youtube.com/vi/nMBE0myRTFU/maxresdefault.jpg",
        likes: 156700,
        views: 1567000,
        is_bookmarked: false
      },
      {
        id: "video_4",
        restaurant_id: "rest_2",
        user_id: "user_3",
        title: "이치라쿠 라멘 숨은 메뉴 공개! 🍜 현지인만 아는 특별한 맛 #강남맛집 #라멘 #숨은메뉴",
        video_url: "https://www.youtube.com/embed/RW3IjL-uKKQ?autoplay=1&mute=1&loop=1&controls=0&rel=0&modestbranding=1&playsinline=1&playlist=RW3IjL-uKKQ",
        thumbnail: "https://img.youtube.com/vi/RW3IjL-uKKQ/maxresdefault.jpg",
        likes: 67800,
        views: 678000,
        is_bookmarked: false
      },
      {
        id: "video_5",
        restaurant_id: "rest_3",
        user_id: "user_2",
        title: "서울 최고의 고기집 🥩 이 마블링 실화냐? #고기맛집 #한우 #서울맛집",
        video_url: "https://www.youtube.com/embed/xZUaA5mmRl0?autoplay=1&mute=1&loop=1&controls=0&rel=0&modestbranding=1&playsinline=1&playlist=xZUaA5mmRl0",
        thumbnail: "https://img.youtube.com/vi/xZUaA5mmRl0/maxresdefault.jpg",
        likes: 256800,
        views: 2568000,
        is_bookmarked: false
      }
    ];

    await supabaseAdmin.from('videos_foodieclips').insert(videos);
    
    console.log("✅ PostgreSQL database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding PostgreSQL:", error);
  }
};

// Initialize database in background (non-blocking)
initializeDatabase().catch(error => {
  console.error("Failed to initialize database:", error);
});

// Health check endpoint
app.get("/make-server-8545d0a0/health", (c) => {
  return c.json({ status: "ok" });
});

// Get videos with pagination for infinite scroll
app.get("/make-server-8545d0a0/videos", async (c) => {
  try {
    // Wait for initialization if still in progress
    if (!isInitialized && initializationPromise) {
      console.log("⏳ Waiting for database initialization...");
      await initializationPromise;
    }

    const page = parseInt(c.req.query("page") || "0");
    const limit = parseInt(c.req.query("limit") || "10");
    const feedMode = c.req.query("feedMode") || "trending";
    
    // Try PostgreSQL first, fallback to KV
    try {
      const { data: videos } = await supabaseAdmin
        .from('videos_foodieclips')
        .select(`
          *,
          restaurants_foodieclips (*),
          influencers_foodieclips (*)
        `);

      if (videos && videos.length > 0) {
        console.log("📊 Using PostgreSQL data");
        
        // Process data from PostgreSQL
        let processedVideos = videos.map((video: any) => ({
          id: video.id,
          videoUrl: video.video_url,
          thumbnail: video.thumbnail,
          title: video.title,
          user: {
            username: video.influencers_foodieclips?.username,
            avatar: video.influencers_foodieclips?.avatar,
            verified: video.influencers_foodieclips?.verified
          },
          restaurant: {
            id: video.restaurants_foodieclips?.id,
            name: video.restaurants_foodieclips?.name,
            location: video.restaurants_foodieclips?.location,
            rating: video.restaurants_foodieclips?.rating,
            priceRange: video.restaurants_foodieclips?.price_range,
            category: video.restaurants_foodieclips?.category,
            description: video.restaurants_foodieclips?.description,
            phone: video.restaurants_foodieclips?.phone,
            hours: video.restaurants_foodieclips?.hours,
            coordinates: video.restaurants_foodieclips?.coordinates
          },
          likes: video.likes,
          views: video.views,
          isBookmarked: video.is_bookmarked,
          createdAt: video.created_at
        }));

        // Apply sorting
        if (feedMode === 'trending') {
          processedVideos.sort((a: any, b: any) => {
            const scoreA = a.likes * 0.6 + (a.restaurant.rating * 10000) * 0.4;
            const scoreB = b.likes * 0.6 + (b.restaurant.rating * 10000) * 0.4;
            return scoreB - scoreA;
          });
        } else if (feedMode === 'nearby') {
          const nearbyAreas = ['강남', '서초', '송파', '마포', '용산'];
          processedVideos.sort((a: any, b: any) => {
            const aIsNearby = nearbyAreas.some(area => a.restaurant.location.includes(area));
            const bIsNearby = nearbyAreas.some(area => b.restaurant.location.includes(area));
            
            if (aIsNearby && !bIsNearby) return -1;
            if (!aIsNearby && bIsNearby) return 1;
            
            return b.restaurant.rating - a.restaurant.rating;
          });
        } else {
          processedVideos.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }

        // Pagination
        const startIndex = page * limit;
        const paginatedVideos = processedVideos.slice(startIndex, startIndex + limit);
        
        return c.json({
          videos: paginatedVideos,
          hasMore: startIndex + limit < processedVideos.length,
          totalCount: processedVideos.length,
          source: "postgresql"
        });
      }
    } catch (pgError) {
      console.log("⚠️ PostgreSQL fallback, using KV store:", pgError);
    }
    
    // Fallback to KV store
    console.log("📦 Using KV store data");
    
    const [videos, restaurants, influencers] = await Promise.all([
      kv.get("videos"),
      kv.get("restaurants"),
      kv.get("influencers")
    ]);

    if (!videos || !restaurants || !influencers) {
      console.log("⚠️ Data not yet initialized, returning empty result");
      return c.json({ 
        videos: [], 
        hasMore: false, 
        totalCount: 0,
        source: "empty",
        message: "데이터 초기화 중입니다..."
      });
    }

    // Create lookup maps
    const restaurantMap = Object.fromEntries(restaurants.map((r: any) => [r.id, r]));
    const influencerMap = Object.fromEntries(influencers.map((i: any) => [i.id, i]));

    // Combine videos with restaurant and user data
    let processedVideos = videos.map((video: any) => ({
      id: video.id,
      videoUrl: video.videoUrl,
      thumbnail: video.thumbnail,
      title: video.title,
      user: {
        username: influencerMap[video.userId]?.username,
        avatar: influencerMap[video.userId]?.avatar,
        verified: influencerMap[video.userId]?.verified
      },
      restaurant: restaurantMap[video.restaurantId],
      likes: video.likes,
      views: video.views,
      isBookmarked: video.isBookmarked,
      createdAt: video.createdAt
    }));

    // Apply sorting based on feed mode
    if (feedMode === 'trending') {
      processedVideos.sort((a: any, b: any) => {
        const scoreA = a.likes * 0.6 + (a.restaurant.rating * 10000) * 0.4;
        const scoreB = b.likes * 0.6 + (b.restaurant.rating * 10000) * 0.4;
        return scoreB - scoreA;
      });
    } else if (feedMode === 'nearby') {
      const nearbyAreas = ['강남', '서초', '송파', '마포', '용산'];
      processedVideos.sort((a: any, b: any) => {
        const aIsNearby = nearbyAreas.some(area => a.restaurant.location.includes(area));
        const bIsNearby = nearbyAreas.some(area => b.restaurant.location.includes(area));
        
        if (aIsNearby && !bIsNearby) return -1;
        if (!aIsNearby && bIsNearby) return 1;
        
        return b.restaurant.rating - a.restaurant.rating;
      });
    } else { // recent
      processedVideos.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    // Pagination
    const startIndex = page * limit;
    const paginatedVideos = processedVideos.slice(startIndex, startIndex + limit);
    
    return c.json({
      videos: paginatedVideos,
      hasMore: startIndex + limit < processedVideos.length,
      totalCount: processedVideos.length,
      source: "kv_store"
    });
    
  } catch (error) {
    console.error("Error fetching videos:", error);
    return c.json({ error: "Failed to fetch videos" }, 500);
  }
});

// Toggle bookmark
app.post("/make-server-8545d0a0/videos/:videoId/bookmark", async (c) => {
  try {
    const videoId = c.req.param("videoId");
    const videos = await kv.get("videos");
    
    if (!videos) {
      return c.json({ error: "Videos not found" }, 404);
    }

    const updatedVideos = videos.map((video: any) => {
      if (video.id === videoId) {
        return { ...video, isBookmarked: !video.isBookmarked };
      }
      return video;
    });

    await kv.set("videos", updatedVideos);
    
    const updatedVideo = updatedVideos.find((v: any) => v.id === videoId);
    return c.json({ 
      success: true,
      isBookmarked: updatedVideo?.isBookmarked 
    });
    
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    return c.json({ error: "Failed to toggle bookmark" }, 500);
  }
});

// Update likes
app.post("/make-server-8545d0a0/videos/:videoId/like", async (c) => {
  try {
    const videoId = c.req.param("videoId");
    const { increment } = await c.req.json();
    const videos = await kv.get("videos");
    
    if (!videos) {
      return c.json({ error: "Videos not found" }, 404);
    }

    const updatedVideos = videos.map((video: any) => {
      if (video.id === videoId) {
        return { 
          ...video, 
          likes: Math.max(0, video.likes + (increment ? 1 : -1))
        };
      }
      return video;
    });

    await kv.set("videos", updatedVideos);
    
    const updatedVideo = updatedVideos.find((v: any) => v.id === videoId);
    return c.json({ 
      success: true,
      likes: updatedVideo?.likes 
    });
    
  } catch (error) {
    console.error("Error updating likes:", error);
    return c.json({ error: "Failed to update likes" }, 500);
  }
});

// Get restaurant details
app.get("/make-server-8545d0a0/restaurants/:restaurantId", async (c) => {
  try {
    const restaurantId = c.req.param("restaurantId");
    const restaurants = await kv.get("restaurants");
    
    if (!restaurants) {
      return c.json({ error: "Restaurants not found" }, 404);
    }

    const restaurant = restaurants.find((r: any) => r.id === restaurantId);
    if (!restaurant) {
      return c.json({ error: "Restaurant not found" }, 404);
    }

    return c.json(restaurant);
    
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    return c.json({ error: "Failed to fetch restaurant" }, 500);
  }
});

// Create reservation
app.post("/make-server-8545d0a0/reservations", async (c) => {
  try {
    const reservationData = await c.req.json();
    const reservations = await kv.get("reservations") || [];
    
    const newReservation = {
      id: `reservation_${Date.now()}`,
      ...reservationData,
      status: "confirmed",
      createdAt: new Date().toISOString()
    };

    reservations.push(newReservation);
    await kv.set("reservations", reservations);
    
    return c.json({ 
      success: true,
      reservation: newReservation
    });
    
  } catch (error) {
    console.error("Error creating reservation:", error);
    return c.json({ error: "Failed to create reservation" }, 500);
  }
});

// Health check endpoint
app.get("/make-server-8545d0a0/health", (c) => {
  return c.json({ 
    status: "FoodieClips server is running! 🍽️",
    timestamp: new Date().toISOString(),
    environment: "production"
  });
});

// Database test endpoint
app.get("/make-server-8545d0a0/db-test", async (c) => {
  try {
    console.log("🔍 Testing database connections...");
    
    const results = {
      kv_store: { available: false, error: null },
      postgresql: { available: false, error: null },
      data_source: "unknown"
    };
    
    // Test KV Store
    try {
      const kvTest = await kv.get("videos_initialized");
      results.kv_store.available = true;
      console.log("✅ KV Store accessible");
    } catch (kvError) {
      results.kv_store.error = String(kvError);
      console.log("❌ KV Store error:", kvError);
    }
    
    // Test PostgreSQL
    try {
      const { data: pgTest, error: pgError } = await supabaseAdmin
        .from('restaurants_foodieclips')
        .select('id')
        .limit(1);
        
      if (!pgError) {
        results.postgresql.available = true;
        results.data_source = "postgresql";
        console.log("✅ PostgreSQL accessible");
      } else {
        results.postgresql.error = pgError.message;
        console.log("❌ PostgreSQL error:", pgError);
      }
    } catch (pgError) {
      results.postgresql.error = String(pgError);
      console.log("❌ PostgreSQL connection error:", pgError);
    }
    
    // Determine primary data source
    if (!results.postgresql.available && results.kv_store.available) {
      results.data_source = "kv_store";
    }
    
    return c.json({
      ...results,
      message: results.postgresql.available 
        ? "🐘 Using PostgreSQL (Real Database!)" 
        : results.kv_store.available 
          ? "📦 Using KV Store (Fallback)" 
          : "❌ No database available",
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error("Database test error:", error);
    return c.json({ 
      error: "Database test failed", 
      details: String(error),
      timestamp: new Date().toISOString()
    }, 500);
  }
});

Deno.serve(app.fetch);