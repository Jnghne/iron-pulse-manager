
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  MapPin, 
  Eye, 
  Heart, 
  Share2, 
  MessageSquare,
  DollarSign,
  Calendar,
  User,
  Store
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CommentSection from "@/components/features/community/CommentSection";

const MarketItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(12);

  // 실제로는 API에서 데이터를 가져와야 함
  const marketItem = {
    id: 1,
    title: "런닝머신 판매합니다 (거의 새것)",
    description: `2023년 구입한 프리미엄 런닝머신입니다. 사용 횟수가 적어서 거의 새것 상태입니다. 이사로 인해 판매합니다.

상세 정보:
- 브랜드: 프리미엄 러닝머신
- 구입일: 2023년 3월
- 사용 횟수: 월 평균 5-10회 정도
- 상태: 거의 새것 (95%)
- 크기: 200cm x 90cm x 150cm
- 무게: 약 120kg

기능:
- 최대 속도 18km/h
- 경사도 조절 가능 (0-15도)
- 심박수 측정 기능
- 다양한 운동 프로그램 내장
- 접이식 (공간 절약 가능)

판매 이유:
이사로 인해 공간이 부족해져서 아쉽지만 판매하게 되었습니다. 
정말 좋은 제품이라 아직 새것과 다름없는 상태입니다.

직거래 우선이며, 배송도 가능합니다 (배송비 별도).
궁금한 점 있으시면 언제든 연락 주세요!`,
    price: 1200000,
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    seller: "김관장",
    gymName: "파워짐",
    location: "서울 강남구",
    category: "cardio",
    condition: "like-new",
    status: "available",
    createdAt: "2024-06-07 14:30",
    views: 89,
    likes: 12,
    phone: "010-1234-5678"
  };

  const categories = {
    cardio: "유산소 기구",
    weights: "웨이트 기구",
    accessories: "부속품",
    furniture: "가구",
    supplements: "보충제",
    other: "기타"
  };

  const conditions = {
    new: "새상품",
    "like-new": "거의새것",
    good: "상태좋음",
    fair: "보통",
    poor: "상태나쁨"
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      cardio: "bg-blue-100 text-blue-800",
      weights: "bg-red-100 text-red-800",
      accessories: "bg-green-100 text-green-800",
      furniture: "bg-purple-100 text-purple-800",
      supplements: "bg-orange-100 text-orange-800",
      other: "bg-gray-100 text-gray-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      available: "bg-green-100 text-green-800",
      reserved: "bg-orange-100 text-orange-800",
      sold: "bg-gray-100 text-gray-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
    toast({
      title: isLiked ? "찜하기 취소" : "찜하기 완료",
      description: isLiked ? "관심 상품에서 제거되었습니다." : "관심 상품에 추가되었습니다."
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "링크 복사 완료",
      description: "상품 링크가 클립보드에 복사되었습니다."
    });
  };

  const handleContact = () => {
    toast({
      title: "연락처 정보",
      description: `판매자: ${marketItem.seller} (${marketItem.phone})`
    });
  };

  // 더미 댓글 데이터
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "이관장",
      gymName: "스트롱짐",
      location: "부산 해운대구",
      content: "상태가 정말 좋아 보이네요! 직거래 가능한가요?",
      createdAt: "2024-06-07 15:30",
      likes: 2,
      isLiked: false,
      replies: [
        {
          id: 2,
          author: "김관장",
          gymName: "파워짐",
          location: "서울 강남구",
          content: "네, 직거래 가능합니다! 연락 주시면 시간 조율해보겠습니다.",
          createdAt: "2024-06-07 16:15",
          likes: 1,
          isLiked: false
        }
      ]
    }
  ]);

  const handleAddComment = (content: string) => {
    const newComment = {
      id: Date.now(),
      author: "현재사용자",
      gymName: "내 헬스장",
      location: "서울 강남구",
      content,
      createdAt: new Date().toLocaleString("ko-KR"),
      likes: 0,
      isLiked: false,
      replies: []
    };
    setComments(prev => [...prev, newComment]);
  };

  const handleAddReply = (commentId: number, content: string) => {
    const newReply = {
      id: Date.now(),
      author: "현재사용자",
      gymName: "내 헬스장",
      location: "서울 강남구",
      content,
      createdAt: new Date().toLocaleString("ko-KR"),
      likes: 0,
      isLiked: false
    };

    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, replies: [...(comment.replies || []), newReply] }
        : comment
    ));
  };

  const handleLikeComment = (commentId: number) => {
    // 댓글 좋아요 로직 구현
    console.log("댓글 좋아요:", commentId);
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <Link to="/community/market">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            목록으로
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge className={getCategoryColor(marketItem.category)}>
              {categories[marketItem.category as keyof typeof categories]}
            </Badge>
            <Badge className={getStatusColor(marketItem.status)}>
              {marketItem.status === "available" && "판매중"}
              {marketItem.status === "reserved" && "예약중"}
              {marketItem.status === "sold" && "판매완료"}
            </Badge>
          </div>
          <h1 className="text-2xl font-bold">{marketItem.title}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLike}
            className={isLiked ? "text-red-600" : ""}
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 메인 콘텐츠 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 이미지 갤러리 */}
          <Card>
            <CardContent className="p-0">
              <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                <img 
                  src={marketItem.images[0]} 
                  alt={marketItem.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {marketItem.images.length > 1 && (
                <div className="flex gap-2 p-4">
                  {marketItem.images.slice(1).map((image, index) => (
                    <div key={index} className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={image} 
                        alt={`추가 이미지 ${index + 1}`}
                        className="w-full h-full object-cover cursor-pointer hover:opacity-80"
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 상품 설명 */}
          <Card>
            <CardHeader>
              <CardTitle>상품 설명</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {marketItem.description}
              </div>
            </CardContent>
          </Card>

          {/* 댓글 섹션 */}
          <CommentSection
            comments={comments}
            onAddComment={handleAddComment}
            onAddReply={handleAddReply}
            onLikeComment={handleLikeComment}
          />
        </div>

        {/* 사이드바 */}
        <div className="space-y-6">
          {/* 가격 및 구매 정보 */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center text-3xl font-bold text-red-600 mb-2">
                  <DollarSign className="h-6 w-6 mr-1" />
                  {marketItem.price.toLocaleString()}원
                </div>
                <Badge variant="outline" className="text-sm">
                  {conditions[marketItem.condition as keyof typeof conditions]}
                </Badge>
              </div>
              
              <div className="space-y-3">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleContact}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  판매자 연락하기
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleLike}
                >
                  <Heart className={`h-4 w-4 mr-2 ${isLiked ? "fill-current text-red-600" : ""}`} />
                  찜하기 ({likes})
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 판매자 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">판매자 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{marketItem.seller}</span>
              </div>
              <div className="flex items-center gap-3">
                <Store className="h-4 w-4 text-muted-foreground" />
                <span>{marketItem.gymName}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{marketItem.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{marketItem.createdAt}</span>
              </div>
            </CardContent>
          </Card>

          {/* 상품 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">상품 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">조회수</span>
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{marketItem.views}</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">관심</span>
                <div className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  <span>{likes}</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">등록일</span>
                <span>{marketItem.createdAt.split(' ')[0]}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MarketItemDetail;
