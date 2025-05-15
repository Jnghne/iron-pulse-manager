
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
          {locker.zone}{locker.number} 락커 정보
        </h3>
      </div>
      
      {locker.isOccupied ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm font-medium">회원 이름</div>
            <div className="text-sm">{locker.memberName}</div>
            
            <div className="text-sm font-medium">회원 번호</div>
            <div className="text-sm">{locker.memberId}</div>
            
            <div className="text-sm font-medium">사용 시작일</div>
            <div className="text-sm">{formatDate(locker.startDate || "")}</div>
            
            <div className="text-sm font-medium">사용 종료일</div>
            <div className="text-sm">{formatDate(locker.endDate || "")}</div>
            
            {locker.notes && (
              <>
                <div className="text-sm font-medium">메모</div>
                <div className="text-sm">{locker.notes}</div>
              </>
            )}
          </div>
          
          <div className="flex space-x-2 justify-end mt-4">
            <Button variant="outline" onClick={onClose}>
              닫기
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                toast.success(`${locker.zone}${locker.number} 락커 배정이 해제되었습니다.`);
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
  const [notes, setNotes] = useState("");
  
  const handleAssign = () => {
    if (!selectedMember) {
      toast.error("회원을 선택해주세요.");
      return;
    }
    
    // In a real app, this would be an API call
    const member = mockMembers.find(m => m.id === selectedMember);
    
    if (member) {
      toast.success(`${locker.zone}${locker.number} 락커가 ${member.name} 회원에게 배정되었습니다.`);
      onClose();
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="member">회원 선택</Label>
          <Select value={selectedMember} onValueChange={setSelectedMember}>
            <SelectTrigger>
              <SelectValue placeholder="배정할 회원 선택" />
            </SelectTrigger>
            <SelectContent>
              {mockMembers
                .filter(m => !m.lockerId || m.lockerId === `${locker.zone}${locker.number}`)
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
          <Label htmlFor="notes">메모</Label>
          <Input
            id="notes"
            placeholder="메모 내용 입력"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex space-x-2 justify-end mt-4">
        <Button variant="outline" onClick={onClose}>
          취소
        </Button>
        <Button onClick={handleAssign}>배정하기</Button>
      </div>
    </div>
  );
};

const LockerRoom = () => {
  const [selectedZone, setSelectedZone] = useState("all");
  const [selectedLocker, setSelectedLocker] = useState<Locker | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  
  // Filter lockers by zone
  const filteredLockers = selectedZone === "all" 
    ? mockLockers 
    : mockLockers.filter(locker => locker.zone === selectedZone);
  
  // Group lockers by zone
  const lockersByZone = filteredLockers.reduce<Record<string, Locker[]>>((acc, locker) => {
    if (!acc[locker.zone]) {
      acc[locker.zone] = [];
    }
    acc[locker.zone].push(locker);
    return acc;
  }, {});
  
  const handleLockerClick = (locker: Locker) => {
    setSelectedLocker(locker);
    
    if (locker.isOccupied) {
      setIsDetailOpen(true);
    } else {
      // Confirm before opening assign dialog
      if (window.confirm(`${locker.zone}${locker.number} 락커를 배정하시겠습니까?`)) {
        setIsAssignOpen(true);
      }
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">락커룸 관리</h1>
        <p className="text-muted-foreground">락커 사용 현황을 확인하고 관리하세요.</p>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center space-y-2 sm:space-y-0">
            <CardTitle>락커 현황</CardTitle>
            <Select value={selectedZone} onValueChange={setSelectedZone}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="구역 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 구역</SelectItem>
                <SelectItem value="A">A 구역</SelectItem>
                <SelectItem value="B">B 구역</SelectItem>
                <SelectItem value="C">C 구역</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <CardDescription>
            락커를 클릭하여 상세 정보를 확인하거나 배정할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {Object.entries(lockersByZone).map(([zone, lockers]) => (
              <div key={zone} className="space-y-3">
                <h3 className="font-semibold text-lg">{zone} 구역</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-3">
                  {lockers.map(locker => (
                    <button
                      key={locker.id}
                      className={`p-4 rounded-md border shadow-sm text-center transition hover:shadow-md ${
                        locker.isOccupied
                          ? "bg-gym-primary text-white"
                          : "bg-white hover:bg-gray-50"
                      }`}
                      onClick={() => handleLockerClick(locker)}
                    >
                      <div className="font-semibold">{locker.zone}{locker.number}</div>
                      <div className="text-xs mt-1">
                        {locker.isOccupied ? (
                          <span>{locker.memberName?.substring(0, 3)}</span>
                        ) : (
                          <span>비어있음</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-center space-x-4 mt-6 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gym-primary rounded mr-2"></div>
              <span>사용중</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-white border rounded mr-2"></div>
              <span>비어있음</span>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>락커 배정</DialogTitle>
            <DialogDescription>
              {selectedLocker && `${selectedLocker.zone}${selectedLocker.number} 락커를 회원에게 배정합니다.`}
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
