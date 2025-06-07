import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  MessageSquare, 
  Eye, 
  ThumbsUp, 
  Filter,
  ArrowLeft 
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CommunityBoard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [posts] = useState([
    {
      id: 1,
      title: "회원 관리 시스템 추천 부탁드립니다",
      content: "새로 헬스장을 오픈하는데 회원 관리 시스템을 도입하려고 합니다. 혹시 사용해보시고 좋았던 시스템이 있으시면 추천 부탁드립니다.",
      author: "김관장",
      gymName: "파워짐",
      location: "서울 강남구",
      category: "questions",
      createdAt: "2024-06-07 14:30",
      views: 156,
      likes: 23,
      comments: 18
    },
    {
      id: 2,
      title: "PT 가격 정책 어떻게 하시나요?",
      content: "요즘 PT 가격 경쟁이 심해서 고민이 많습니다. 다른 관장님들은 어떤 가격 정책을 사용하시는지 궁금합니다.",
      author: "이관장",
      gymName: "스트롱짐",
      location: "부산 해운대구",
      category: "tips",
      createdAt: "2024-06-07 12:15",
      views: 142,
      likes: 31,
      comments: 25
    },
    {
      id: 3,
      title: "여름철 헬스장 에어컨 관리 팁",
      content: "여름이 다가오면서 에어컨 전기료가 걱정됩니다. 효율적인 에어컨 관리 방법이 있으시면 공유해주세요.",
      author: "박관장",
      gymName: "휘트니스클럽",
      location: "대구 수성구",
      category: "tips",
      createdAt: "2024-06-07 10:45",
      views: 98,
      likes: 15,
      comments: 12
    },
    {
      id: 4,
      title: "헬스장 보험 관련 문의",
      content: "사업자 보험을 새로 가입하려고 하는데, 헬스장에 특화된 보험이 있는지 궁금합니다.",
      author: "최관장",
      gymName: "메가짐",
      location: "인천 남동구",
      category: "questions",
      createdAt: "2024-06-06 16:20",
      views: 87,
      likes: 9,
      comments: 7
    },
    {
      id: 5,
      title: "신규 회원 유치 이벤트 아이디어 공유",
      content: "다음 달에 신규 회원 유치 이벤트를 계획 중입니다. 효과적이었던 이벤트 아이디어가 있으시면 공유해주세요!",
      author: "정관장",
      gymName: "바디빌더짐",
      location: "광주 서구",
      category: "general",
      createdAt: "2024-06-06 14:10",
      views: 203,
      likes: 42,
      comments: 33
    }
  ]);

  const categories = {
    all: "전체",
    general: "일반",
    tips: "노하우",
    questions: "질문",
    announcements: "공지",
    events: "이벤트"
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      general: "bg-blue-100 text-blue-800",
      tips: "bg-green-100 text-green-800",
      questions: "bg-orange-100 text-orange-800",
      announcements: "bg-red-100 text-red-800",
      events: "bg-purple-100 text-purple-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePostClick = (postId: number) => {
    navigate(`/community/board/${postId}`);
  };

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
            <h1 className="text-3xl font-bold">자유 소통 게시판</h1>
            <p className="text-muted-foreground mt-1">
              전국 헬스장 관장님들과 자유롭게 소통하세요
            </p>
          </div>
        </div>
        <Link to="/community/board/write">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            글쓰기
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
                  placeholder="제목, 내용으로 검색..."
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

      {/* 게시글 목록 */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <Card 
            key={post.id} 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handlePostClick(post.id)}
          >
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <Badge className={getCategoryColor(post.category)}>
                    {categories[post.category as keyof typeof categories]}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {post.author} · {post.gymName} · {post.location}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {post.createdAt}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold mb-2 hover:text-blue-600">
                {post.title}
              </h3>
              
              <p className="text-muted-foreground mb-4 line-clamp-2">
                {post.content}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{post.views}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{post.comments}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 페이지네이션 */}
      <div className="flex justify-center">
        <div className="text-sm text-muted-foreground">
          총 {filteredPosts.length}개의 게시글
        </div>
      </div>
    </div>
  );
};

export default CommunityBoard;
