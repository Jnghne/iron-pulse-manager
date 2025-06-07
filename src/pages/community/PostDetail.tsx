
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  Eye, 
  ThumbsUp, 
  MessageSquare, 
  Share2,
  MoreHorizontal
} from "lucide-react";

const PostDetail = () => {
  const { id } = useParams();
  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);

  // 실제로는 API에서 게시글 데이터를 가져와야 함
  const post = {
    id: 1,
    title: "회원 관리 시스템 추천 부탁드립니다",
    content: `새로 헬스장을 오픈하는데 회원 관리 시스템을 도입하려고 합니다. 

혹시 사용해보시고 좋았던 시스템이 있으시면 추천 부탁드립니다.

특히 다음과 같은 기능이 있는 시스템을 찾고 있습니다:
- 회원 출입 관리
- 이용권 관리
- PT 스케줄링
- 결제 관리
- 락커 관리

가격도 합리적이면 좋겠습니다. 경험담과 함께 추천해주시면 정말 감사하겠습니다!`,
    author: "김관장",
    gymName: "파워짐",
    location: "서울 강남구",
    category: "questions",
    createdAt: "2024-06-07 14:30",
    views: 156,
    likes: 23,
    comments: 18
  };

  const categories = {
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

  // 가상의 댓글 데이터
  const comments = [
    {
      id: 1,
      author: "이관장",
      gymName: "스트롱짐",
      location: "부산 해운대구",
      content: "저는 헬스케어 솔루션을 사용하고 있는데 꽤 만족스럽습니다. 특히 회원 출입 관리가 편리해요!",
      createdAt: "2024-06-07 15:20",
      likes: 5
    },
    {
      id: 2,
      author: "박관장",
      gymName: "휘트니스클럽",
      location: "대구 수성구",
      content: "짐매니저 추천드려요. 가격도 합리적이고 고객센터 응대도 좋습니다.",
      createdAt: "2024-06-07 16:45",
      likes: 3
    }
  ];

  const handleCommentSubmit = () => {
    if (!newComment.trim()) {
      alert("댓글을 입력해주세요.");
      return;
    }
    
    // 실제로는 API 호출
    console.log("새 댓글:", newComment);
    setNewComment("");
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // 실제로는 API 호출
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <Link to="/community/board">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            목록으로
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">게시글 상세</h1>
        </div>
      </div>

      {/* 게시글 */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <Badge className={getCategoryColor(post.category)}>
                {categories[post.category as keyof typeof categories]}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {post.author} · {post.gymName} · {post.location}
              </span>
            </div>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
          
          <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{post.createdAt}</span>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{post.views}</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="whitespace-pre-wrap text-sm leading-relaxed mb-6">
            {post.content}
          </div>
          
          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex items-center gap-4">
              <Button 
                variant={isLiked ? "default" : "outline"} 
                size="sm"
                onClick={handleLike}
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                좋아요 {post.likes + (isLiked ? 1 : 0)}
              </Button>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                <span>댓글 {comments.length}</span>
              </div>
            </div>
            
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-1" />
              공유하기
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 댓글 작성 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">댓글 작성</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="댓글을 입력하세요..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex justify-end">
              <Button onClick={handleCommentSubmit}>
                댓글 등록
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 댓글 목록 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">댓글 {comments.length}개</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-100 pb-4 last:border-0">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">{comment.author}</span>
                    <span className="text-muted-foreground">
                      {comment.gymName} · {comment.location}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {comment.createdAt}
                  </span>
                </div>
                
                <p className="text-sm mb-2 leading-relaxed">
                  {comment.content}
                </p>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    {comment.likes}
                  </Button>
                  <Button variant="ghost" size="sm">
                    답글
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostDetail;
