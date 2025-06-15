import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader 
} from "@/components/ui/card";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Calendar, Lock } from "lucide-react";
import { mockLockers, mockMembers, Locker } from "@/data/mockData";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface LockerDetailsProps {
  locker: Locker;
  onClose: () => void;
}

const LockerDetails = ({ locker, onClose }: LockerDetailsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">
          {locker.number}번 락커 정보
        </h3>
      </div>
      
      {locker.isOccupied ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">회원 정보</div>
                <div className="text-sm text-muted-foreground">{locker.memberName} ({locker.memberId})</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">사용 기간</div>
                <div className="text-sm text-muted-foreground">
                  {formatDate(locker.startDate || "")} ~ {formatDate(locker.endDate || "")}
                </div>
              </div>
            </div>
            
            {locker.notes && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-sm font-medium">메모</div>
                <div className="text-sm text-muted-foreground mt-1">{locker.notes}</div>
              </div>
            )}
          </div>
          
          <div className="flex space-x-2 justify-end mt-4">
            <Button variant="outline" onClick={onClose}>
              닫기
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                toast.success(`${locker.number}번 락커 배정이 해제되었습니다.`);
                onClose();
              }}
            >
              배정 해제
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-muted-foreground">이 락커는 현재 비어있습니다.</p>
      )}
    </div>
  );
};

interface LockerAssignProps {
  locker: Locker;
  onClose: () => void;
}

const LockerAssign = ({ locker, onClose }: LockerAssignProps) => {
  const [selectedMember, setSelectedMember] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
  );
  const [fee, setFee] = useState("");
  const [notes, setNotes] = useState("");
  
  const handleAssign = () => {
    if (!selectedMember) {
      toast.error("회원을 선택해주세요.");
      return;
    }
    
    if (!fee || parseInt(fee.replace(/,/g, '')) <= 0) {
      toast.error("결제 금액을 입력해주세요.");
      return;
    }
    
    const member = mockMembers.find(m => m.id === selectedMember);
    
    if (member) {
      toast.success(`${locker.number}번 락커가 ${member.name} 회원에게 배정되었습니다. (결제 금액: ${fee}원)`);
      onClose();
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {/* 선택된 락커 번호 표시 */}
        <div className="space-y-3">
          <Label>선택된 락커</Label>
          <div className="p-3 bg-muted/20 rounded-lg border">
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <Lock className="h-5 w-5 text-primary" />
                <span className="text-lg font-semibold">{locker.number}번 락커</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* 회원 선택 */}
        <div className="space-y-2">
          <Label htmlFor="member">회원 선택</Label>
          <Select value={selectedMember} onValueChange={setSelectedMember}>
            <SelectTrigger>
              <SelectValue placeholder="배정할 회원 선택" />
            </SelectTrigger>
            <SelectContent>
              {mockMembers
                .filter(m => !m.lockerId)
                .map(member => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name} ({member.id})
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start-date">시작일</Label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end-date">종료일</Label>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="fee">결제 금액</Label>
          <div className="relative">
            <Input
              id="fee"
              placeholder="결제 금액을 입력하세요"
              value={fee}
              onChange={(e) => {
                const value = e.target.value.replace(/[^\d]/g, '');
                const formattedValue = value ? parseInt(value).toLocaleString() : '';
                setFee(formattedValue);
              }}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              원
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notes">메모</Label>
          <Input
            id="notes"
            placeholder="메모 내용 입력"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex space-x-2 justify-end mt-6">
        <Button variant="outline" onClick={onClose}>
          취소
        </Button>
        <Button onClick={handleAssign} className="bg-gym-primary hover:bg-gym-primary/90">배정하기</Button>
      </div>
    </div>
  );
};

// 락커 상태 계산 함수
const getLockerStatus = (locker: Locker): 'empty' | 'in-use' | 'expired' | 'expiring-soon' => {
  if (!locker.isOccupied) {
    return 'empty';
  }
  
  if (!locker.endDate) {
    return 'in-use';
  }
  
  const today = new Date();
  const endDate = new Date(locker.endDate);
  const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilExpiry < 0) {
    return 'expired';
  } else if (daysUntilExpiry <= 30) {
    return 'expiring-soon';
  } else {
    return 'in-use';
  }
};

// 상태별 스타일 반환 함수
const getLockerStyle = (status: string) => {
  switch (status) {
    case 'empty':
      return 'bg-card border-border hover:border-primary/50 hover:bg-muted/50';
    case 'in-use':
      return 'bg-primary/90 border-primary text-primary-foreground shadow-md';
    case 'expired':
      return 'bg-red-500 border-red-600 text-white shadow-md';
    case 'expiring-soon':
      return 'bg-yellow-500 border-yellow-600 text-white shadow-md';
    default:
      return 'bg-card border-border';
  }
};

// 상태별 라벨 반환 함수
const getStatusLabel = (status: string) => {
  switch (status) {
    case 'empty':
      return '비어있음';
    case 'in-use':
      return '사용중';
    case 'expired':
      return '만료';
    case 'expiring-soon':
      return '만료 임박';
    default:
      return '알 수 없음';
  }
};

const LockerRoom = () => {
  const [selectedLocker, setSelectedLocker] = useState<Locker | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  
  // 상태별 락커 필터링
  const filteredLockers = statusFilter === "all" 
    ? mockLockers 
    : mockLockers.filter(locker => getLockerStatus(locker) === statusFilter);
  
  // 통계 계산
  const getStats = () => {
    const stats = {
      total: mockLockers.length,
      empty: 0,
      inUse: 0,
      expired: 0,
      expiringSoon: 0
    };
    
    mockLockers.forEach(locker => {
      const status = getLockerStatus(locker);
      switch (status) {
        case 'empty':
          stats.empty++;
          break;
        case 'in-use':
          stats.inUse++;
          break;
        case 'expired':
          stats.expired++;
          break;
        case 'expiring-soon':
          stats.expiringSoon++;
          break;
      }
    });
    
    return stats;
  };
  
  const stats = getStats();
  
  const handleLockerClick = (locker: Locker) => {
    setSelectedLocker(locker);
    
    if (locker.isOccupied) {
      setIsDetailOpen(true);
    } else {
      setIsAssignOpen(true);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* 전체 현황 요약 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="overflow-hidden border-border hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="flex flex-col items-center justify-center p-4 text-center h-full">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mb-2">
                <Lock className="h-4 w-4 text-blue-500" />
              </div>
              <div className="text-xs font-medium text-muted-foreground mb-1">전체 락커</div>
              <div className="text-2xl font-bold">{stats.total}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border-border hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="flex flex-col items-center justify-center p-4 text-center h-full">
              <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center mb-2">
                <Lock className="h-4 w-4 text-green-500" />
              </div>
              <div className="text-xs font-medium text-muted-foreground mb-1">비어있음</div>
              <div className="text-2xl font-bold text-green-600">{stats.empty}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border-border hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="flex flex-col items-center justify-center p-4 text-center h-full">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="text-xs font-medium text-muted-foreground mb-1">사용중</div>
              <div className="text-2xl font-bold text-primary">{stats.inUse}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border-border hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="flex flex-col items-center justify-center p-4 text-center h-full">
              <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center mb-2">
                <Calendar className="h-4 w-4 text-yellow-500" />
              </div>
              <div className="text-xs font-medium text-muted-foreground mb-1">만료 임박</div>
              <div className="text-2xl font-bold text-yellow-600">{stats.expiringSoon}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border-border hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="flex flex-col items-center justify-center p-4 text-center h-full">
              <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center mb-2">
                <Calendar className="h-4 w-4 text-red-500" />
              </div>
              <div className="text-xs font-medium text-muted-foreground mb-1">만료</div>
              <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-end sm:items-center space-y-4 sm:space-y-0">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="상태 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 상태</SelectItem>
                <SelectItem value="empty">비어있음</SelectItem>
                <SelectItem value="in-use">사용중</SelectItem>
                <SelectItem value="expiring-soon">만료 임박</SelectItem>
                <SelectItem value="expired">만료</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-8 sm:grid-cols-12 md:grid-cols-16 lg:grid-cols-20 xl:grid-cols-25 gap-2 p-4 bg-muted/10 rounded-lg border border-muted">
              {filteredLockers.map(locker => {
                const status = getLockerStatus(locker);
                return (
                  <button
                    key={locker.id}
                    className={`
                      relative p-1.5 h-16 rounded-lg border-2 text-center transition-all duration-200 hover:shadow-lg hover:scale-105
                      ${getLockerStyle(status)}
                    `}
                    onClick={() => handleLockerClick(locker)}
                  >
                    <div className="absolute top-0.5 left-0.5 font-bold text-[10px]">{locker.number}</div>
                    
                    {locker.isOccupied ? (
                      <div className="flex flex-col items-center justify-center h-full mt-1">
                        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center mb-1">
                          <User className="h-3 w-3" />
                        </div>
                        <div className="text-[8px] font-medium truncate max-w-full px-0.5">
                          {locker.memberName}
                        </div>
                        <div className="absolute bottom-0.5 right-0.5 text-[7px] opacity-70">
                          {getStatusLabel(status)}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full mt-1">
                        <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center mb-1">
                          <Lock className="h-3 w-3 text-muted-foreground" />
                        </div>
                        <span className="text-[8px] text-muted-foreground">비어있음</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-card border-2 border-border rounded"></div>
                <span className="text-sm font-medium">비어있음</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-primary/90 rounded border-2 border-primary"></div>
                <span className="text-sm font-medium">사용중</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-yellow-500 rounded border-2 border-yellow-600"></div>
                <span className="text-sm font-medium">만료 임박</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-red-500 rounded border-2 border-red-600"></div>
                <span className="text-sm font-medium">만료</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Locker Details Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>락커 상세 정보</DialogTitle>
            <DialogDescription>
              락커 사용 현황 및 상세 정보입니다.
            </DialogDescription>
          </DialogHeader>
          {selectedLocker && (
            <LockerDetails 
              locker={selectedLocker} 
              onClose={() => setIsDetailOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Locker Assign Dialog */}
      <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>락커 배정</DialogTitle>
            <DialogDescription>
              {selectedLocker && `${selectedLocker.number}번 락커를 회원에게 배정합니다.`}
            </DialogDescription>
          </DialogHeader>
          {selectedLocker && (
            <LockerAssign 
              locker={selectedLocker} 
              onClose={() => setIsAssignOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LockerRoom;