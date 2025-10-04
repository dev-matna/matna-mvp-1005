import React from "react";
import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { TransparentSheet, TransparentSheetContent, TransparentSheetHeader, TransparentSheetTitle, TransparentSheetTrigger, TransparentSheetDescription } from "./TransparentSheet";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Users, Clock, CreditCard, Check, ArrowRight, ChevronRight } from "lucide-react";
import { reservationAPI } from "../utils/api";
import { toast } from "sonner@2.0.3";

interface ReservationSheetProps {
  children: React.ReactNode;
  restaurant: {
    name: string;
    location: string;
    category: string;
  };
  onReservationComplete: (reservationData: any) => void;
  onModalClose?: () => void;
}

export function ReservationSheet({ children, restaurant, onReservationComplete, onModalClose }: ReservationSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1); // 1: 예약정보+스와이프결제, 2: 완료
  const [selectedGuests, setSelectedGuests] = useState("2");
  const [selectedDate, setSelectedDate] = useState("today");
  const [selectedTime, setSelectedTime] = useState("");
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const swipeRef = useRef<HTMLDivElement>(null);

  const guestOptions = [
    { value: "1", label: "1명" },
    { value: "2", label: "2명" },
    { value: "3", label: "3명" },
    { value: "4", label: "4명" },
    { value: "5", label: "5명" },
    { value: "6", label: "6명" },
    { value: "7", label: "7명" },
    { value: "8", label: "8명" }
  ];
  
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const timeSlots = [
    { value: "11:30", label: "11:30" },
    { value: "12:00", label: "12:00" },
    { value: "12:30", label: "12:30" },
    { value: "13:00", label: "13:00" },
    { value: "13:30", label: "13:30" },
    { value: "18:00", label: "18:00" },
    { value: "18:30", label: "18:30" },
    { value: "19:00", label: "19:00" },
    { value: "19:30", label: "19:30" },
    { value: "20:00", label: "20:00" },
    { value: "20:30", label: "20:30" }
  ];

  const handleReservation = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    // 결제 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const reservationData = {
      restaurant: restaurant.name,
      guests: parseInt(selectedGuests),
      date: selectedDate === "today" ? "오늘" : "내일",
      time: selectedTime,
      amount: 1000,
      status: "confirmed"
    };
    
    setStep(2);
    setIsProcessing(false);
    
    setTimeout(() => {
      onReservationComplete(reservationData);
      handleOpenChange(false);
      // 초기화
      setStep(1);
      setSelectedGuests("2");
      setSelectedDate("today");
      setSelectedTime("");
      setSwipeProgress(0);
      setIsDragging(false);
    }, 2000);
  };

  // 스와이프 결제 핸들러들
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!canProceed || isProcessing) return;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !swipeRef.current || isProcessing) return;
    
    const touch = e.touches[0];
    const rect = swipeRef.current.getBoundingClientRect();
    const startX = rect.left + 40; // 핸들 초기 위치 (padding 고려)
    const maxWidth = rect.width - 80; // 전체 너비에서 핸들 크기 제외
    const currentX = Math.max(0, Math.min(maxWidth, touch.clientX - startX));
    const progress = currentX / maxWidth;
    
    setSwipeProgress(progress);
  };

  const handleTouchEnd = () => {
    if (!isDragging || isProcessing) return;
    
    setIsDragging(false);
    
    if (swipeProgress > 0.8) { // 80% 이상 스와이프하면 결제 진행
      handleReservation();
    } else {
      // 애니메이션으로 원래 위치로 복귀
      setSwipeProgress(0);
    }
  };

  // 마우스 이벤트 (데스크톱 지원)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!canProceed || isProcessing) return;
    e.preventDefault();
    setIsDragging(true);
  };

  const canProceed = selectedTime !== "";

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    // 모달이 닫힐 때 콜백 호출
    if (!open && onModalClose) {
      onModalClose();
    }
  };

  // 전역 마우스 이벤트 리스너 (드래그 중일 때)
  useEffect(() => {
    if (!isDragging) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!swipeRef.current || isProcessing) return;
      
      const rect = swipeRef.current.getBoundingClientRect();
      const startX = rect.left + 40;
      const maxWidth = rect.width - 80;
      const currentX = Math.max(0, Math.min(maxWidth, e.clientX - startX));
      const progress = currentX / maxWidth;
      
      setSwipeProgress(progress);
    };

    const handleGlobalMouseUp = () => {
      if (!isDragging || isProcessing) return;
      
      setIsDragging(false);
      
      if (swipeProgress > 0.8) {
        handleReservation();
      } else {
        setSwipeProgress(0);
      }
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, swipeProgress, isProcessing]);

  return (
    <TransparentSheet 
      open={isOpen} 
      onOpenChange={handleOpenChange}
      modal={true}
    >
      <TransparentSheetTrigger asChild>
        {children}
      </TransparentSheetTrigger>
      <TransparentSheetContent 
        side="bottom" 
        className="h-[55vh] max-w-md mx-auto rounded-t-3xl border-none shadow-2xl"
        showClose={false}
      >
        <TransparentSheetHeader className="pb-3 pt-4">
          {/* 모달 핸들 - 클릭해서 닫기 */}
          <div 
            className="w-12 h-1 bg-white/30 rounded-full mx-auto mb-4 cursor-pointer hover:bg-white/50 transition-colors"
            onClick={() => handleOpenChange(false)}
          ></div>

          <TransparentSheetTitle className="text-center text-xl text-white font-bold">
            {step === 1 && "🍽️ 지금 예약"}
            {step === 2 && "🎉 예약 완료"}
          </TransparentSheetTitle>
          <TransparentSheetDescription className="text-center text-sm text-white/90 mt-1">
            {step === 1 && "정보를 입력하고 스와이프하여 결제하세요"}
            {step === 2 && "예약이 성공적으로 완료되었습니다!"}
          </TransparentSheetDescription>
        </TransparentSheetHeader>

        {step === 1 && (
          <div className="space-y-3 px-2 flex-1 flex flex-col">
            {/* 가게 정보 - 컴팩트 */}
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-yellow-400 rounded-full flex items-center justify-center">
                  🍽️
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white">{restaurant.name}</h3>
                  <p className="text-xs text-white/80">{restaurant.category}</p>
                </div>
              </div>
            </div>

            {/* 예약 정보 - 인라인 선택 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/15 space-y-3">
              <div className="grid grid-cols-3 gap-3">
                {/* 인원수 */}
                <div>
                  <label className="text-xs text-white/80 block mb-1">👥 인원</label>
                  <Select value={selectedGuests} onValueChange={setSelectedGuests}>
                    <SelectTrigger className="h-10 bg-white/20 border-white/30 text-white text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {guestOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 날짜 */}
                <div>
                  <label className="text-xs text-white/80 block mb-1">📅 날짜</label>
                  <Select value={selectedDate} onValueChange={setSelectedDate}>
                    <SelectTrigger className="h-10 bg-white/20 border-white/30 text-white text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">오늘</SelectItem>
                      <SelectItem value="tomorrow">내일</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 시간 */}
                <div>
                  <label className="text-xs text-white/80 block mb-1">🕐 시간</label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger className="h-10 bg-white/20 border-white/30 text-white text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot.value} value={slot.value}>
                          {slot.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* 주의사항 - 미니 */}
            <div className="bg-yellow-500/15 border border-yellow-400/30 rounded-xl p-2">
              <p className="text-xs text-white/80 text-center">
                • 노쇼 시 환불 불가 • 변경은 2시간 전까지
              </p>
            </div>

            {/* 스와이프 결제 바 */}
            <div className="flex-1 flex items-end pb-2">
              <div className="w-full">
                <div className="text-center mb-2">
                  <p className="text-sm text-white/80">노쇼 방지금 1,000원</p>
                  <p className="text-xs text-white/60">(방문 후 100% 환급)</p>
                </div>
                
                <div 
                  ref={swipeRef}
                  className={`relative h-16 bg-gradient-to-r from-gray-600/50 to-gray-600/50 rounded-2xl overflow-hidden ${
                    swipeProgress > 0 ? 'from-red-500/80 to-yellow-500/80' : ''
                  } ${isDragging ? 'from-red-500 to-yellow-500' : ''} transition-all duration-200`}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onMouseDown={handleMouseDown}
                >
                  {/* 배경 진행률 표시 */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-red-500 to-yellow-500 transition-all duration-200"
                    style={{ width: `${swipeProgress * 100}%`, opacity: 0.3 }}
                  />
                  
                  {/* 드래그 핸들 */}
                  <motion.div
                    className={`absolute left-2 top-2 w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center cursor-pointer ${
                      !canProceed || isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    animate={{
                      x: swipeProgress * (swipeRef.current ? swipeRef.current.offsetWidth - 64 : 0)
                    }}
                    transition={{
                      type: isDragging ? "spring" : "tween",
                      stiffness: isDragging ? 300 : 200,
                      damping: isDragging ? 30 : 20,
                      duration: isDragging ? 0 : 0.3
                    }}
                    whileHover={{ scale: canProceed && !isProcessing ? 1.05 : 1 }}
                    whileTap={{ scale: canProceed && !isProcessing ? 0.95 : 1 }}
                  >
                    {isProcessing ? (
                      <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                    ) : swipeProgress > 0.8 ? (
                      <Check className="w-6 h-6 text-green-500" />
                    ) : (
                      <ArrowRight className="w-6 h-6 text-red-500" />
                    )}
                  </motion.div>
                  
                  {/* 텍스트 */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <p className={`font-medium transition-all duration-200 ${
                      swipeProgress > 0.3 ? 'text-white' : 'text-white/80'
                    }`}>
                      {isProcessing ? '결제 진행 중...' :
                       swipeProgress > 0.8 ? '결제 완료!' :
                       swipeProgress > 0.3 ? '계속 밀어주세요' :
                       '→ 스와이프하여 결제'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col items-center justify-center space-y-6 py-8">
            <motion.div
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <Check className="w-10 h-10 text-white" />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center space-y-2"
            >
              <h3 className="text-xl font-bold text-white">예약이 완료되었습니다!</h3>
              <p className="text-white/80">음식점에서 곧 연락드릴 예정입니다</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 w-full border border-white/20"
            >
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-white/80">예약번호</span>
                  <span className="font-mono text-white bg-white/20 px-2 py-1 rounded">#FD{Date.now().toString().slice(-6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80">음식점</span>
                  <span className="text-white font-medium">{restaurant.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80">일시</span>
                  <span className="text-white font-medium">{selectedDate === "today" ? "오늘" : "내일"} {selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80">인원</span>
                  <span className="text-white font-medium">{selectedGuests}명</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80">결제금액</span>
                  <span className="text-green-300 font-medium">1,000원 (환급예정)</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center"
            >
              <p className="text-xs text-white/60">잠시 후 자동으로 창이 닫힙니다</p>
            </motion.div>
          </div>
        )}
      </TransparentSheetContent>
    </TransparentSheet>
  );
}