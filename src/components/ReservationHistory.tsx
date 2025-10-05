import { motion } from "motion/react";
import { ArrowLeft, Calendar, Clock, Users, MapPin, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { useState, useMemo } from "react";

interface ReservationHistoryProps {
  onBack: () => void;
  reservations: any[];
  onReservationCancel?: (reservationId: string) => void;
  onReservationEdit?: (reservation: any) => void;
}

export function ReservationHistory({ 
  onBack, 
  reservations, 
  onReservationCancel,
  onReservationEdit 
}: ReservationHistoryProps) {
  const [selectedTab, setSelectedTab] = useState("all");

  // Mock data - 간단하게 유지
  const mockReservations = useMemo(() => [
    {
      id: '1',
      restaurant: '강남 갈비천왕',
      date: '2024-10-05',
      time: '19:00',
      guests: 2,
      status: 'confirmed',
      location: '강남구 역삼동',
      category: '한식',
      price: '60,000원'
    },
    {
      id: '2',
      restaurant: '스시 오마카세 혼',
      date: '2024-10-02',
      time: '18:30',
      guests: 1,
      status: 'completed',
      location: '강남구 신사동',
      category: '일식',
      price: '95,000원'
    },
    {
      id: '3',
      restaurant: '트러플 파스타 하우스',
      date: '2024-09-28',
      time: '12:30',
      guests: 4,
      status: 'cancelled',
      location: '서초구 반포동',
      category: '이탈리안',
      price: '88,000원'
    }
  ], []);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'confirmed':
        return { 
          label: '예약 확정', 
          color: 'bg-green-100 text-green-800',
          icon: CheckCircle
        };
      case 'completed':
        return { 
          label: '이용 완료', 
          color: 'bg-blue-100 text-blue-800',
          icon: CheckCircle
        };
      case 'cancelled':
        return { 
          label: '취소됨', 
          color: 'bg-red-100 text-red-800',
          icon: XCircle
        };
      default:
        return { 
          label: '알 수 없음', 
          color: 'bg-gray-100 text-gray-800',
          icon: AlertCircle
        };
    }
  };

  const filteredReservations = useMemo(() => {
    switch (selectedTab) {
      case 'upcoming':
        return mockReservations.filter(r => r.status === 'confirmed');
      case 'completed':
        return mockReservations.filter(r => r.status === 'completed');
      case 'cancelled':
        return mockReservations.filter(r => r.status === 'cancelled');
      default:
        return mockReservations;
    }
  }, [mockReservations, selectedTab]);

  return (
    <div className="h-screen bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white px-4 py-4 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-500" />
            <h1 className="text-lg font-bold">예약 내역</h1>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2 ml-12">
          총 {mockReservations.length}건의 예약
        </p>
      </div>

      {/* Tab Buttons */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex gap-2">
          {[
            { key: 'all', label: '전체' },
            { key: 'upcoming', label: '예정' },
            { key: 'completed', label: '완료' },
            { key: 'cancelled', label: '취소' }
          ].map((tab) => (
            <Button
              key={tab.key}
              variant={selectedTab === tab.key ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTab(tab.key)}
              className="flex-1"
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Reservations List */}
      <div className="px-4 space-y-4 pb-20">
        {filteredReservations.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500 mb-2">
              예약 내역이 없어요
            </h3>
            <p className="text-sm text-gray-400">
              맛집을 예약하고 특별한 경험을 만들어보세요!
            </p>
          </div>
        ) : (
          filteredReservations.map((reservation, index) => {
            const statusInfo = getStatusInfo(reservation.status);
            const StatusIcon = statusInfo.icon;

            return (
              <motion.div
                key={reservation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="shadow-sm hover:shadow-md transition-all">
                  <CardContent className="p-4">
                    {/* Restaurant Info */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">{reservation.restaurant}</h3>
                        <div className="flex items-center gap-2">
                          <Badge className={statusInfo.color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusInfo.label}
                          </Badge>
                          <Badge variant="outline">{reservation.category}</Badge>
                        </div>
                      </div>
                    </div>

                    {/* Reservation Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{reservation.date} • {reservation.time}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span>{reservation.guests}명</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{reservation.location}</span>
                      </div>
                    </div>

                    {/* Price & Actions */}
                    <div className="flex items-center justify-between pt-3 border-t">
                      <span className="font-bold text-lg text-red-600">{reservation.price}</span>
                      
                      <div className="flex gap-2">
                        {reservation.status === 'confirmed' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => onReservationCancel && onReservationCancel(reservation.id)}
                          >
                            취소
                          </Button>
                        )}
                        {reservation.status === 'completed' && (
                          <Button variant="outline" size="sm">
                            리뷰 작성
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}