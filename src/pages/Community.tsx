
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

const Community = () => {
  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">관장님 커뮤니티</h1>
          <p className="text-muted-foreground mt-2">
            전국 헬스장 관장님들과 소통하고 정보를 공유하세요
          </p>
        </div>
      </div>

      {/* 메뉴 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/community/board">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <MessageSquare className="h-6 w-6 text-blue-600" />
                자유 소통 게시판
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                전국 헬스장 관장님들과 자유로운 주제로 소통하고 정보를 공유하세요. 
                운영 노하우, 고민 상담, 업계 동향 등 다양한 이야기를 나눌 수 있습니다.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>오늘 새 글</span>
                  <span className="font-semibold text-blue-600">24개</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>총 게시글</span>
                  <span className="font-semibold">3,421개</span>
                </div>
              </div>
              <Button className="w-full mt-4">
                게시판 바로가기
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link to="/community/market">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <ShoppingCart className="h-6 w-6 text-green-600" />
                중고거래 장터
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                헬스장 운영에 필요한 기구와 용품을 안전하고 합리적인 가격에 
                거래하세요. 검증된 관장님들과의 거래로 더욱 안심할 수 있습니다.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>판매중인 상품</span>
                  <span className="font-semibold text-green-600">148개</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>이번 달 거래</span>
                  <span className="font-semibold">67건</span>
                </div>
              </div>
              <Button className="w-full mt-4">
                장터 바로가기
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* 최근 활동 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>최근 인기 게시글</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { title: "회원 관리 시스템 추천 부탁드립니다", author: "김관장", views: 156, comments: 23 },
                { title: "PT 가격 정책 어떻게 하시나요?", author: "이관장", views: 142, comments: 18 },
                { title: "여름철 헬스장 에어컨 관리 팁", author: "박관장", views: 98, comments: 12 },
              ].map((post, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <h4 className="font-medium text-sm">{post.title}</h4>
                    <p className="text-xs text-muted-foreground">{post.author}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    조회 {post.views} · 댓글 {post.comments}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>인기 중고거래 상품</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { title: "런닝머신 판매합니다 (거의 새것)", price: "1,200,000원", seller: "서울 강남", status: "판매중" },
                { title: "덤벨 세트 (1kg~50kg)", price: "800,000원", seller: "부산 해운대", status: "예약중" },
                { title: "벤치프레스 + 바벨 세트", price: "450,000원", seller: "대구 수성구", status: "판매중" },
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <h4 className="font-medium text-sm">{item.title}</h4>
                    <p className="text-xs text-muted-foreground">{item.seller}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">{item.price}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.status === '판매중' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Community;
