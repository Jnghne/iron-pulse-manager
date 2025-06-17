import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { SlidersHorizontal, Check, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export type MemberStatus = 'all' | 'active' | 'expired' | 'pending';
export type MemberType = 'all' | 'regular' | 'lesson' | 'vip' | 'student';
export type SortOption = 'name' | 'registrationDate' | 'expiryDate' | 'attendanceRate' | 'membershipStatus';

interface FilterPopoverProps {
  onFilterChange: (filters: {
    status: MemberStatus;
    type: MemberType;
    sort: SortOption;
  }) => void;
  className?: string;
}

export const FilterPopover = ({ onFilterChange, className }: FilterPopoverProps) => {
  const [status, setStatus] = useState<MemberStatus>('all');
  const [type, setType] = useState<MemberType>('all');
  const [sort, setSort] = useState<SortOption>('name');
  const [open, setOpen] = useState(false);

  // 필터 변경 시 부모 컴포넌트에 알림
  const handleFilterChange = () => {
    onFilterChange({ status, type, sort });
    setOpen(false);
  };

  // 필터가 적용되었는지 확인
  const isFiltered = status !== 'all' || type !== 'all' || sort !== 'name';

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
          
          {/* 상태별 필터 */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">회원 상태</label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as MemberStatus)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="모든 상태" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 상태</SelectItem>
                <SelectItem value="active">이용중</SelectItem>
                <SelectItem value="expired">만료됨</SelectItem>
                <SelectItem value="pending">대기중</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* 회원유형별 필터 */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">회원 유형</label>
            <Select
              value={type}
              onValueChange={(value) => setType(value as MemberType)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="모든 유형" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 유형</SelectItem>
                <SelectItem value="regular">정회원</SelectItem>
                <SelectItem value="lesson">개인레슨 회원</SelectItem>
                <SelectItem value="vip">VIP 회원</SelectItem>
                <SelectItem value="student">학생 회원</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* 정렬 필터 */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">정렬 기준</label>
            <Select
              value={sort}
              onValueChange={(value) => setSort(value as SortOption)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="이름순" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">이름순</SelectItem>
                <SelectItem value="registrationDate">등록일순</SelectItem>
                <SelectItem value="expiryDate">만료일순</SelectItem>
                <SelectItem value="attendanceRate">출석률순</SelectItem>
                <SelectItem value="membershipStatus">회원 상태순</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Separator />
          
          {/* 버튼 영역 */}
          <div className="flex gap-2">
            {/* 초기화 버튼 */}
            <Button 
              variant="outline" 
              onClick={() => {
                setStatus('all');
                setType('all');
                setSort('name');
              }}
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
