import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { SlidersHorizontal, Check, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

// 자유소통 게시판용 타입들
export type BoardPostType = 'all' | 'general' | 'tips' | 'questions' | 'announcements' | 'events';
export type BoardSortOption = 'latest' | 'likes' | 'comments' | 'views';

// 중고거래 게시판용 타입들
export type MarketPostType = 'all' | 'cardio' | 'weights' | 'accessories' | 'furniture' | 'supplements' | 'other';
export type MarketSortOption = 'latest' | 'likes' | 'views' | 'price_low' | 'price_high';

interface CommunityFilterPopoverProps {
  mode: 'board' | 'market';
  onFilterChange: (filters: {
    postType: BoardPostType | MarketPostType;
    sort: BoardSortOption | MarketSortOption;
  }) => void;
  className?: string;
}

export const CommunityFilterPopover = ({ mode, onFilterChange, className }: CommunityFilterPopoverProps) => {
  // 자유소통 게시판용 상태
  const [boardPostType, setBoardPostType] = useState<BoardPostType>('all');
  const [boardSort, setBoardSort] = useState<BoardSortOption>('latest');
  
  // 중고거래 게시판용 상태  
  const [marketPostType, setMarketPostType] = useState<MarketPostType>('all');
  const [marketSort, setMarketSort] = useState<MarketSortOption>('latest');
  
  const [open, setOpen] = useState(false);

  // 필터 변경 시 부모 컴포넌트에 알림
  const handleFilterChange = () => {
    if (mode === 'board') {
      onFilterChange({ postType: boardPostType, sort: boardSort });
    } else {
      onFilterChange({ postType: marketPostType, sort: marketSort });
    }
    setOpen(false);
  };

  // 필터가 적용되었는지 확인
  const isFiltered = mode === 'board' 
    ? boardPostType !== 'all' || boardSort !== 'latest'
    : marketPostType !== 'all' || marketSort !== 'latest';

  // 초기화 함수
  const handleReset = () => {
    if (mode === 'board') {
      setBoardPostType('all');
      setBoardSort('latest');
    } else {
      setMarketPostType('all');
      setMarketSort('latest');
    }
  };

  // 자유소통 게시판 게시글 유형 옵션
  const boardPostTypes = {
    all: "전체",
    general: "일반",
    tips: "노하우", 
    questions: "질문",
    announcements: "공지",
    events: "이벤트"
  };

  // 자유소통 게시판 정렬 옵션
  const boardSortOptions = {
    latest: "최신순",
    likes: "좋아요순",
    comments: "댓글순",
    views: "조회순"
  };

  // 중고거래 게시판 게시글 유형 옵션
  const marketPostTypes = {
    all: "전체",
    cardio: "유산소 기구",
    weights: "웨이트 기구", 
    accessories: "부속품",
    furniture: "가구",
    supplements: "보충제",
    other: "기타"
  };

  // 중고거래 게시판 정렬 옵션
  const marketSortOptions = {
    latest: "최신순",
    likes: "좋아요순", 
    views: "조회순",
    price_low: "낮은 가격순",
    price_high: "높은 가격순"
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "flex items-center gap-2 border-dashed",
            isFiltered && "border-gym-primary text-gym-primary font-medium",
            className
          )}
        >
          <SlidersHorizontal className="h-4 w-4" />
          조건 변경
          {isFiltered && (
            <span className="flex h-2 w-2 rounded-full bg-gym-primary" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4" align="end">
        <div className="space-y-4">
          <h4 className="font-medium text-sm">필터 설정</h4>
          
          {/* 게시글 유형 필터 */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">
              {mode === 'board' ? '게시글 유형' : '상품 카테고리'}
            </label>
            <Select
              value={mode === 'board' ? boardPostType : marketPostType}
              onValueChange={(value) => {
                if (mode === 'board') {
                  setBoardPostType(value as BoardPostType);
                } else {
                  setMarketPostType(value as MarketPostType);
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="전체" />
              </SelectTrigger>
              <SelectContent>
                {mode === 'board' 
                  ? Object.entries(boardPostTypes).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value}
                      </SelectItem>
                    ))
                  : Object.entries(marketPostTypes).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value}
                      </SelectItem>
                    ))
                }
              </SelectContent>
            </Select>
          </div>
          
          {/* 정렬 옵션 */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">정렬 조건</label>
            <Select
              value={mode === 'board' ? boardSort : marketSort}
              onValueChange={(value) => {
                if (mode === 'board') {
                  setBoardSort(value as BoardSortOption);
                } else {
                  setMarketSort(value as MarketSortOption);
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="최신순" />
              </SelectTrigger>
              <SelectContent>
                {mode === 'board'
                  ? Object.entries(boardSortOptions).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value}
                      </SelectItem>
                    ))
                  : Object.entries(marketSortOptions).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value}
                      </SelectItem>
                    ))
                }
              </SelectContent>
            </Select>
          </div>
          
          <Separator />
          
          {/* 버튼 영역 */}
          <div className="flex gap-2">
            {/* 초기화 버튼 */}
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="flex-1"
              disabled={!isFiltered}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              초기화
            </Button>
            
            {/* 적용 버튼 */}
            <Button 
              onClick={handleFilterChange} 
              className="flex-1"
            >
              <Check className="mr-2 h-4 w-4" />
              적용
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};