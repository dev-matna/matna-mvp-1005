import { motion } from "motion/react";
import { 
  ArrowLeft, 
  HelpCircle, 
  MessageSquare, 
  Phone, 
  Mail, 
  Book, 
  Bug, 
  Star,
  ChevronRight,
  Search,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { useState } from "react";

interface SupportCenterProps {
  onBack: () => void;
}

export function SupportCenter({ onBack }: SupportCenterProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const contactMethods = [
    {
      icon: MessageSquare,
      title: "라이브 채팅",
      description: "실시간 문의 (평일 9:00-18:00)",
      availability: "온라인",
      color: "text-green-500",
      bgColor: "bg-green-50",
      action: () => console.log("Start live chat")
    },
    {
      icon: Mail,
      title: "이메일 문의",
      description: "support@foodieclips.com",
      availability: "24시간 접수",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      action: () => console.log("Send email")
    },
    {
      icon: Phone,
      title: "전화 상담",
      description: "02-1234-5678",
      availability: "평일 9:00-18:00",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      action: () => console.log("Make call")
    }
  ];

  const faqCategories = [
    {
      title: "계정 및 로그인",
      icon: HelpCircle,
      count: 8,
      items: [
        "비밀번호를 잊어버렸어요",
        "계정을 삭제하고 싶어요",
        "이메일 인증이 안돼요",
        "로그인이 안돼요"
      ]
    },
    {
      title: "예약 관련",
      icon: Clock,
      count: 12,
      items: [
        "예약을 취소하고 싶어요",
        "예약 시간을 변경할 수 있나요?",
        "노쇼 방지금은 언제 환불되나요?",
        "예약 확인서는 어디서 볼 수 있나요?"
      ]
    },
    {
      title: "앱 사용법",
      icon: Book,
      count: 15,
      items: [
        "북마크 기능은 어떻게 사용하나요?",
        "맛집을 검색하는 방법",
        "리뷰 작성하는 방법",
        "알림 설정 변경하기"
      ]
    },
    {
      title: "결제 및 환불",
      icon: Star,
      count: 6,
      items: [
        "결제 수단을 변경하고 싶어요",
        "환불은 언제 처리되나요?",
        "결제 영수증을 받고 싶어요",
        "결제가 실패했어요"
      ]
    }
  ];

  const recentTickets = [
    {
      id: "T2024001",
      title: "예약 취소 관련 문의",
      status: "해결됨",
      date: "2024-10-01",
      statusColor: "bg-green-100 text-green-700"
    },
    {
      id: "T2024002", 
      title: "앱 로딩 속도 개선 요청",
      status: "진행중",
      date: "2024-10-03",
      statusColor: "bg-blue-100 text-blue-700"
    }
  ];

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    items: category.items.filter(item => 
      searchQuery === "" || item.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <div className="h-screen bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white px-4 py-4 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-bold">고객센터</h1>
            <p className="text-sm text-gray-500">도움말 및 문의사항</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Quick Contact */}
        <div className="grid gap-3">
          <h2 className="font-medium text-gray-900">빠른 문의</h2>
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <motion.div
                key={index}
                whileTap={{ scale: 0.98 }}
                onClick={method.action}
                className="cursor-pointer"
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${method.bgColor}`}>
                        <Icon className={`w-5 h-5 ${method.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{method.title}</h3>
                        <p className="text-sm text-gray-500">{method.description}</p>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {method.availability}
                        </Badge>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Recent Tickets */}
        {recentTickets.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-orange-500" />
                최근 문의 내역
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentTickets.map((ticket, index) => (
                <div key={ticket.id}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{ticket.title}</h4>
                      <p className="text-sm text-gray-500">#{ticket.id} • {ticket.date}</p>
                    </div>
                    <Badge className={ticket.statusColor}>
                      {ticket.status}
                    </Badge>
                  </div>
                  {index < recentTickets.length - 1 && <Separator className="mt-3" />}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* FAQ Search */}
        <div className="space-y-4">
          <h2 className="font-medium text-gray-900">자주 묻는 질문</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="궁금한 내용을 검색해보세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-4">
          {(searchQuery ? filteredFAQs : faqCategories).map((category, index) => {
            const Icon = category.icon;
            return (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5 text-indigo-500" />
                      {category.title}
                    </div>
                    <Badge variant="secondary">{category.count}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {category.items.slice(0, searchQuery ? category.items.length : 3).map((item, itemIndex) => (
                      <motion.div
                        key={itemIndex}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => console.log("Open FAQ:", item)}
                      >
                        <span className="text-sm">{item}</span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </motion.div>
                    ))}
                    {!searchQuery && category.items.length > 3 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full mt-2"
                        onClick={() => console.log("Show more", category.title)}
                      >
                        더 보기 ({category.items.length - 3}개)
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bug Report */}
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Bug className="w-5 h-5 text-orange-500 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-orange-800">버그 신고</h3>
                <p className="text-sm text-orange-600 mt-1">
                  앱에서 문제를 발견하셨나요? 빠른 해결을 위해 버그를 신고해주세요.
                </p>
                <Button variant="outline" size="sm" className="mt-2 text-orange-600 border-orange-300">
                  버그 신고하기
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              서비스 상태
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">앱 서비스</span>
              <Badge className="bg-green-100 text-green-700">정상</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">예약 시스템</span>
              <Badge className="bg-green-100 text-green-700">정상</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">결제 시스템</span>
              <Badge className="bg-green-100 text-green-700">정상</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">알림 서비스</span>
              <Badge className="bg-yellow-100 text-yellow-700">점검중</Badge>
            </div>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-4">
            <div className="text-center space-y-2">
              <h4 className="font-medium">FoodieClips</h4>
              <p className="text-sm text-gray-600">버전 1.0.0</p>
              <div className="text-xs text-gray-500 space-y-1">
                <p>이용약관 | 개인정보처리방침</p>
                <p>© 2024 FoodieClips. All rights reserved.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="pb-20" />
      </div>
    </div>
  );
}