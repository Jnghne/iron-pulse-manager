import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, MessageSquare, TrendingUp, ShoppingCart, Activity, Edit3, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const Community = () => {
  // 내가 작성한 게시글 모의 데이터
  const myPosts = {
    board: [
      { id: 1, title: "헬스장 운영 5년차 노하우 공유합니다", date: "2024-01-15", views: 245, comments: 34, status: "published" },
      { id: 2, title: "회원 이탈 방지 전략에 대해 질문드립니다", date: "2024-01-10", views: 156, comments: 18, status: "published" },
      { id: 3, title: "트레이너 채용 시 주의사항", date: "2024-01-08", views: 89, comments: 12, status: "published" },
    ],
    market: [
      { id: 1, title: "스미스머신 판매합니다 (상태 양호)", date: "2024-01-12", price: "2,800,000원", status: "selling", views: 67 },
      { id: 2, title: "덤벨 풀세트 (5kg~50kg) 급매", date: "2024-01-05", price: "1,200,000원", status: "sold", views: 124 },
    ]
  };

  // 내가 댓글 작성한 게시글 모의 데이터
  const myCommentedPosts = {
    board: [
      { id: 4, title: "회원 관리 시스템 추천 부탁드립니다", author: "김관장", date: "2024-01-14", views: 198, comments: 27, myComment: "저희는 IronPulse 사용 중인데 만족도가 높습니다.", commentDate: "2024-01-14" },
      { id: 5, title: "PT 가격 정책 어떻게 하시나요?", author: "이관장", date: "2024-01-12", views: 156, comments: 23, myComment: "지역별로 차이가 있겠지만 강남권은...", commentDate: "2024-01-13" },
      { id: 6, title: "여름철 헬스장 에어컨 관리 팁", author: "박관장", date: "2024-01-10", views: 134, comments: 15, myComment: "습도 조절도 중요합니다. 제습기 추천드려요.", commentDate: "2024-01-11" },
    ],
    market: [
      { id: 7, title: "런닝머신 판매합니다 (거의 새것)", author: "서울 강남", date: "2024-01-11", price: "1,200,000원", views: 89, status: "selling", myComment: "직접 확인 가능한가요?", commentDate: "2024-01-12" },
      { id: 8, title: "벤치프레스 + 바벨 세트", author: "대구 수성구", date: "2024-01-09", price: "450,000원", views: 67, status: "sold", myComment: "좋은 가격이네요! 다음에도 연락주세요.", commentDate: "2024-01-10" },
    ]
  };

  return (
    <div className="space-y-6">
      {/* 메뉴 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/community/board" className="block h-full">
          <Card className="overflow-hidden h-full border shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-slate-900">
            <div className="absolute top-0 right-0 p-3">
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 font-medium">
                <Activity className="w-3 h-3 mr-1" /> 활발한 활동
              </Badge>
            </div>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-900/20">
                  <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">자유 소통 게시판</CardTitle>
                  <CardDescription>관장님들의 지식과 경험을 공유하는 공간</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-8">
                전국 헬스장 관장님들과 자유로운 주제로 소통하고 정보를 공유하세요. 
                운영 노하우, 고민 상담, 업계 동향 등 다양한 이야기를 나눌 수 있습니다.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white dark:bg-slate-800 rounded-lg p-3 shadow-sm">
                  <div className="text-sm text-muted-foreground">오늘 새 글</div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">24개</div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-lg p-3 shadow-sm">
                  <div className="text-sm text-muted-foreground">총 게시글</div>
                  <div className="text-2xl font-bold">3,421개</div>
                </div>
              </div>
              <Button className="w-full" size="lg">
                <MessageSquare className="mr-2 h-4 w-4" /> 게시판 바로가기
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link to="/community/market" className="block h-full">
          <Card className="overflow-hidden h-full border shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-slate-900">
            <div className="absolute top-0 right-0 p-3">
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 font-medium">
                <TrendingUp className="w-3 h-3 mr-1" /> 인기 거래
              </Badge>
            </div>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-900/20">
                  <ShoppingCart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">중고거래 장터</CardTitle>
                  <CardDescription>안전하고 합리적인 헬스 장비 거래</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-8">
                헬스장 운영에 필요한 기구와 용품을 안전하고 합리적인 가격에 
                거래하세요. 검증된 관장님들과의 거래로 더욱 안심할 수 있습니다.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white dark:bg-slate-800 rounded-lg p-3 shadow-sm">
                  <div className="text-sm text-muted-foreground">판매중인 상품</div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">148개</div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-lg p-3 shadow-sm">
                  <div className="text-sm text-muted-foreground">이번 달 거래</div>
                  <div className="text-2xl font-bold">67건</div>
                </div>
              </div>
              <Button className="w-full" size="lg">
                <ShoppingCart className="mr-2 h-4 w-4" /> 장터 바로가기
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* 내 활동 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 내가 작성한 게시글 */}
        <Card className="border-0 shadow-lg overflow-hidden bg-white dark:bg-slate-900">
          <CardHeader className="border-b bg-slate-50/70 dark:bg-slate-800/20">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-1.5 rounded-md bg-blue-50 dark:bg-blue-900/20">
                <Edit3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              내가 작성한 게시글
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="board" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="board" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  자유게시판
                  <Badge variant="secondary" className="ml-2 text-xs">{myPosts.board.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="market" className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  중고장터
                  <Badge variant="secondary" className="ml-2 text-xs">{myPosts.market.length}</Badge>
                </TabsTrigger>
              </TabsList>
            
            <TabsContent value="board" className="space-y-0">
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {myPosts.board.map((post) => (
                  <div key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer py-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-gray-900 dark:text-white truncate mb-2">{post.title}</h4>
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {post.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {post.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {post.comments}
                          </span>
                        </div>
                      </div>
                      <Badge 
                        variant={post.status === 'published' ? 'default' : 'secondary'}
                        className="ml-4 text-xs"
                      >
                        {post.status === 'published' ? '게시중' : '임시저장'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-4 text-center">
                <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                  더 보기
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="market" className="space-y-0">
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {myPosts.market.map((post) => (
                  <div key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer py-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-gray-900 dark:text-white truncate mb-2">{post.title}</h4>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {post.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {post.views}
                            </span>
                          </div>
                          <span className="font-semibold text-sm text-gray-900 dark:text-white">{post.price}</span>
                        </div>
                      </div>
                      <Badge 
                        variant={post.status === 'selling' ? 'default' : 'secondary'}
                        className={`ml-4 text-xs ${
                          post.status === 'selling' 
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {post.status === 'selling' ? '판매중' : '판매완료'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-4 text-center">
                <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                  더 보기
                </Button>
              </div>
            </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* 내가 댓글 작성한 게시글 */}
        <Card className="border-0 shadow-lg overflow-hidden bg-white dark:bg-slate-900">
          <CardHeader className="border-b bg-slate-50/70 dark:bg-slate-800/20">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-1.5 rounded-md bg-blue-50 dark:bg-blue-900/20">
                <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              내가 댓글 작성한 게시글
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="board" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="board" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  자유게시판
                  <Badge variant="secondary" className="ml-2 text-xs">{myCommentedPosts.board.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="market" className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  중고장터
                  <Badge variant="secondary" className="ml-2 text-xs">{myCommentedPosts.market.length}</Badge>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="board" className="space-y-0">
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {myCommentedPosts.board.map((post) => (
                    <div key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer py-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-gray-900 dark:text-white truncate mb-1">{post.title}</h4>
                          <p className="text-xs text-blue-600 dark:text-blue-400 mb-2 line-clamp-2">💬 {post.myComment}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                            <span>작성자: {post.author}</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              댓글: {post.commentDate}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {post.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              {post.comments}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-4 text-center">
                  <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                    더 보기
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="market" className="space-y-0">
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {myCommentedPosts.market.map((post) => (
                    <div key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer py-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-gray-900 dark:text-white truncate mb-1">{post.title}</h4>
                          <p className="text-xs text-blue-600 dark:text-blue-400 mb-2 line-clamp-2">💬 {post.myComment}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                              <span>판매자: {post.author}</span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                댓글: {post.commentDate}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {post.views}
                              </span>
                            </div>
                            <span className="font-semibold text-sm text-gray-900 dark:text-white">{post.price}</span>
                          </div>
                        </div>
                        <Badge 
                          variant={post.status === 'selling' ? 'default' : 'secondary'}
                          className={`ml-4 text-xs ${
                            post.status === 'selling' 
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                              : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {post.status === 'selling' ? '판매중' : '판매완료'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-4 text-center">
                  <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                    더 보기
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* 최근 활동 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg overflow-hidden bg-white dark:bg-slate-900">
          <CardHeader className="border-b bg-slate-50/70 dark:bg-slate-800/20">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-1.5 rounded-md bg-blue-50 dark:bg-blue-900/20">
                <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              최근 인기 게시글
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {[
                { title: "회원 관리 시스템 추천 부탁드립니다", author: "김관장", views: 156, comments: 23, hot: true },
                { title: "PT 가격 정책 어떻게 하시나요?", author: "이관장", views: 142, comments: 18, hot: true },
                { title: "여름철 헬스장 에어컨 관리 팁", author: "박관장", views: 98, comments: 12, hot: false },
              ].map((post, index) => (
                <div key={index} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="flex justify-between items-center p-4">
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm truncate">{post.title}</h4>
                        {post.hot && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                            HOT
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-xs text-muted-foreground">{post.author}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <span className="flex items-center">
                            <Users className="h-3 w-3 mr-1" /> {post.views}
                          </span>
                          <span className="mx-1.5">·</span>
                          <span className="flex items-center">
                            <MessageSquare className="h-3 w-3 mr-1" /> {post.comments}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0">
                      <TrendingUp className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 text-center border-t">
              <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 font-medium">
                더 보기
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg overflow-hidden bg-white dark:bg-slate-900">
          <CardHeader className="border-b bg-slate-50/70 dark:bg-slate-800/20">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-1.5 rounded-md bg-blue-50 dark:bg-blue-900/20">
                <ShoppingCart className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              인기 중고거래 상품
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {[
                { title: "런닝머신 판매합니다 (거의 새것)", price: "1,200,000원", seller: "서울 강남", status: "판매중", image: "https://placehold.co/60x60" },
                { title: "덤벨 세트 (1kg~50kg)", price: "800,000원", seller: "부산 해운대", status: "예약중", image: "https://placehold.co/60x60" },
                { title: "벤치프레스 + 바벨 세트", price: "450,000원", seller: "대구 수성구", status: "판매중", image: "https://placehold.co/60x60" },
              ].map((item, index) => (
                <div key={index} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-center p-4">
                    <div className="flex-shrink-0 mr-4 rounded-md overflow-hidden bg-gray-50 dark:bg-gray-800/50 h-[60px] w-[60px] flex items-center justify-center">
                      <ShoppingCart className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{item.title}</h4>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-muted-foreground">{item.seller}</p>
                        <p className="font-semibold text-sm">{item.price}</p>
                      </div>
                    </div>
                    <div className="ml-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === '판매중' ? 'bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' : 'bg-gray-50 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 text-center border-t">
              <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 font-medium">
                더 보기
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Community;
