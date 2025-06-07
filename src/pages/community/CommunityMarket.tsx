import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  MapPin, 
  Eye, 
  Heart, 
  Filter,
  ArrowLeft,
  DollarSign
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CommunityMarket = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");

  const marketItems = [
    {
      id: 1,
      title: "런닝머신 판매합니다 (거의 새것)",
      description: "2023년 구입한 프리미엄 런닝머신입니다. 사용 횟수가 적어서 거의 새것 상태입니다. 이사로 인해 판매합니다.",
      price: 1200000,
      images: ["/placeholder.svg"],
      seller: "김관장",
      gymName: "파워짐",
      location: "서울 강남구",
      category: "cardio",
      condition: "like-new",
      status: "available",
      createdAt: "2024-06-07 14:30",
      views: 89,
      likes: 12
    },
    {
      id: 2,
      title: "덤벨 세트 (1kg~50kg) 일괄 판매",
      description: "헬스장 리뉴얼로 인해 덤벨 세트를 판매합니다. 1kg부터 50kg까지 전 세트 판매합니다.",
      price: 800000,
      images: ["/placeholder.svg"],
      seller: "이관장",
      gymName: "스트롱짐",
      location: "부산 해운대구",
      category: "weights",
      condition: "good",
      status: "reserved",
      createdAt: "2024-06-07 12:15",
      views: 156,
      likes: 23
    },
    {
      id: 3,
      title: "벤치프레스 + 바벨 세트",
      description: "벤치프레스 1대와 바벨 세트입니다. 상태 양호하며 직거래 우선입니다.",
      price: 450000,
      images: ["/placeholder.svg"],
      seller: "박관장",
      gymName: "휘트니스클럽",
      location: "대구 수성구",
      category: "weights",
      condition: "good",
      status: "available",
      createdAt: "2024-06-07 10:45",
      views: 72,
      likes: 8
    },
    {
      id: 4,
      title: "헬스장 음향 시스템 (앰프+스피커)",
      description: "5년 사용한 음향 시스템입니다. 소리 깔끔하고 고장 없이 잘 작동합니다.",
      price: 300000,
      images: ["/placeholder.svg"],
      seller: "최관장",
      gymName: "메가짐",
      location: "인천 남동구",
      category: "accessories",
      condition: "good",
      status: "available",
      createdAt: "2024-06-06 16:20",
      views: 45,
      likes: 5
    },
    {
      id: 5,
      title: "접수대 + 의자 세트",
      description: "헬스장 접수대와 의자 세트입니다. 깨끗하게 사용했습니다.",
      price: 200000,
      images: ["/placeholder.svg"],
      seller: "정관장",
      gymName: "바디빌더짐",
      location: "광주 서구",
      category: "furniture",
      condition: "fair",
      status: "available",
      createdAt: "2024-06-06 14:10",
      views: 63,
      likes: 7
    },
    {
      id: 6,
      title: "프로틴 대량 판매 (유통기한 충분)",
      description: "헬스장 샵 운영 중단으로 프로틴을 대량 판매합니다. 유통기한 2025년까지입니다.",
      price: 150000,
      images: ["/placeholder.svg"],
      seller: "한관장",
      gymName: "휘트니스센터",
      location: "울산 남구",
      category: "supplements",
      condition: "new",
      status: "available",
      createdAt: "2024-06-06 11:30",
      views: 234,
      likes: 45
    }
  ];

  const categories = {
    all: "전체",
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

  const filteredItems = marketItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/community">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              커뮤니티
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">중고거래 장터</h1>
            <p className="text-muted-foreground mt-1">
              헬스장 기구와 용품을 안전하게 거래하세요
            </p>
          </div>
        </div>
        <Link to="/community/market/write">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            판매하기
          </Button>
        </Link>
      </div>

      {/* 검색 및 필터 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="상품명, 설명으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(categories).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 상품 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Link key={item.id} to={`/community/market/${item.id}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="aspect-video bg-gray-100 rounded-t-lg relative overflow-hidden">
                <img 
                  src={item.images[0]} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <Badge className={getCategoryColor(item.category)}>
                    {categories[item.category as keyof typeof categories]}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge className={getStatusColor(item.status)}>
                    {item.status === "available" && "판매중"}
                    {item.status === "reserved" && "예약중"}
                    {item.status === "sold" && "판매완료"}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="pt-4">
                <h3 className="font-semibold mb-2 line-clamp-1">{item.title}</h3>
                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                  {item.description}
                </p>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center text-lg font-bold text-red-600">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {item.price.toLocaleString()}원
                  </div>
                  <Badge variant="outline">
                    {conditions[item.condition as keyof typeof conditions]}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{item.location}</span>
                  </div>
                  <span>{item.createdAt.split(' ')[0]}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{item.seller} · {item.gymName}</span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{item.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      <span>{item.likes}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* 페이지네이션 (추후 구현) */}
      <div className="flex justify-center">
        <div className="text-sm text-muted-foreground">
          총 {filteredItems.length}개의 상품
        </div>
      </div>
    </div>
  );
};

export default CommunityMarket;
