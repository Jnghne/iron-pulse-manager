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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Settings, User, Calendar, Lock } from "lucide-react";
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
        <Button onClick={handleAssign} className="bg-gym-primary hover:bg-gym-primary/90">배정하기</Button>
      </div>
    </div>
  );
};

// 락커 설정 컴포넌트
const LockerSettings = () => {
  const [zones, setZones] = useState(["A", "B", "C"]);
  const [newZoneName, setNewZoneName] = useState("");
  const [selectedZone, setSelectedZone] = useState("");
  const [lockerCount, setLockerCount] = useState("");

  const handleAddZone = () => {
    if (!newZoneName.trim()) {
      toast.error("구역명을 입력해주세요.");
      return;
    }
    if (zones.includes(newZoneName)) {
      toast.error("이미 존재하는 구역명입니다.");
      return;
    }
    setZones([...zones, newZoneName]);
    setNewZoneName("");
    toast.success(`${newZoneName} 구역이 추가되었습니다.`);
  };

  const handleRemoveZone = (zoneName: string) => {
    if (window.confirm(`${zoneName} 구역을 삭제하시겠습니까?`)) {
      setZones(zones.filter(z => z !== zoneName));
      toast.success(`${zoneName} 구역이 삭제되었습니다.`);
    }
  };

  const handleAddLockers = () => {
    if (!selectedZone || !lockerCount) {
      toast.error("구역과 락커 개수를 모두 선택해주세요.");
      return;
    }
    toast.success(`${selectedZone} 구역에 ${lockerCount}개의 락커가 추가되었습니다.`);
    setSelectedZone("");
    setLockerCount("");
  };

  return (
    <div className="space-y-6">
      {/* 구역 관리 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            락커 구역 관리
          </CardTitle>
          <CardDescription>
            락커 구역을 추가하거나 삭제할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="새 구역명 입력 (예: D)"
              value={newZoneName}
              onChange={(e) => setNewZoneName(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleAddZone} className="bg-gym-primary hover:bg-gym-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              구역 추가
            </Button>
          </div>
          
          <div className="space-y-2">
            <Label>현재 구역 목록</Label>
            <div className="flex flex-wrap gap-2">
              {zones.map((zone) => (
                <div key={zone} className="flex items-center gap-2 bg-gray-100 rounded-md px-3 py-2">
                  <Badge variant="outline">{zone} 구역</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveZone(zone)}
                    className="h-4 w-4 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 락커 추가 */}
      <Card>
        <CardHeader>
          <CardTitle>락커 추가</CardTitle>
          <CardDescription>
            특정 구역에 락커를 추가할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>구역 선택</Label>
              <Select value={selectedZone} onValueChange={setSelectedZone}>
                <SelectTrigger>
                  <SelectValue placeholder="구역 선택" />
                </SelectTrigger>
                <SelectContent>
                  {zones.map(zone => (
                    <SelectItem key={zone} value={zone}>
                      {zone} 구역
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>추가할 락커 개수</Label>
              <Input
                type="number"
                placeholder="개수 입력"
                value={lockerCount}
                onChange={(e) => setLockerCount(e.target.value)}
                min="1"
                max="50"
              />
            </div>
          </div>
          <Button onClick={handleAddLockers} className="bg-gym-primary hover:bg-gym-primary/90">
            락커 추가
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

const LockerRoom = () => {
  const userRole = localStorage.getItem("userRole") || "trainer";
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
  
  // 구역별 통계 계산
  const getZoneStats = (lockers: Locker[]) => {
    const occupied = lockers.filter(l => l.isOccupied).length;
    const total = lockers.length;
    const occupancyRate = total > 0 ? Math.round((occupied / total) * 100) : 0;
    return { occupied, total, occupancyRate };
  };
  
  const handleLockerClick = (locker: Locker) => {
    setSelectedLocker(locker);
    
    if (locker.isOccupied) {
      setIsDetailOpen(true);
    } else {
      if (window.confirm(`${locker.zone}${locker.number} 락커를 배정하시겠습니까?`)) {
        setIsAssignOpen(true);
      }
    }
  };
  
  return (
    <div className="space-y-6">
      
      <Tabs defaultValue="status" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="status">락커 현황</TabsTrigger>
          {userRole === "owner" && (
            <TabsTrigger value="settings">락커 설정</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="status" className="space-y-6">
          {/* 전체 현황 요약 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="overflow-hidden border-border hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="flex flex-col items-center justify-center p-6 text-center h-full">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-3">
                    <Lock className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">전체 락커</div>
                  <div className="text-3xl font-bold">{mockLockers.length}</div>
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden border-border hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="flex flex-col items-center justify-center p-6 text-center h-full">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">사용중</div>
                  <div className="text-3xl font-bold text-primary">
                    {mockLockers.filter(l => l.isOccupied).length}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden border-border hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="flex flex-col items-center justify-center p-6 text-center h-full">
                  <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-3">
                    <Lock className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">이용 가능</div>
                  <div className="text-3xl font-bold text-green-600">
                    {mockLockers.filter(l => !l.isOccupied).length}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden border-border hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="flex flex-col items-center justify-center p-6 text-center h-full">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                    <div className="relative w-6 h-6">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-5 h-5 rounded-full border-2 border-gray-400"></div>
                      </div>
                      <div 
                        className="absolute inset-0 flex items-center justify-center" 
                        style={{
                          clipPath: `polygon(0 0, 100% 0, 100% 100%, 0% 100%)`,
                          transform: `rotate(${Math.round((mockLockers.filter(l => l.isOccupied).length / mockLockers.length) * 360)}deg)`
                        }}
                      >
                        <div className="w-5 h-5 rounded-full border-2 border-primary"></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">사용률</div>
                  <div className="text-3xl font-bold">
                    {Math.round((mockLockers.filter(l => l.isOccupied).length / mockLockers.length) * 100)}%
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-end sm:items-center space-y-4 sm:space-y-0">
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
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {Object.entries(lockersByZone).map(([zone, lockers]) => {
                  const stats = getZoneStats(lockers);
                  return (
                    <div key={zone} className="space-y-4">
                      <div className="flex items-center justify-between bg-white p-3 rounded-lg mb-4 shadow-sm">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold text-lg">{zone} 구역</h3>
                          <Badge variant="outline" className="text-xs">
                            {stats.occupied}/{stats.total} 사용중
                          </Badge>
                          <Badge 
                            variant={stats.occupancyRate > 80 ? "destructive" : stats.occupancyRate > 50 ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {stats.occupancyRate}% 사용률
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4 p-4 bg-muted/10 rounded-lg border border-muted">
                        {lockers.map(locker => (
                          <button
                            key={locker.id}
                            className={`
                              relative p-3 h-24 rounded-lg border-2 text-center transition-all duration-200 hover:shadow-lg hover:scale-105
                              ${locker.isOccupied
                                ? "bg-primary/90 border-primary text-primary-foreground shadow-md"
                                : "bg-card border-border hover:border-primary/50 hover:bg-muted/50"
                              }
                            `}
                            onClick={() => handleLockerClick(locker)}
                          >
                            <div className="absolute top-1 left-2 font-bold text-sm">{locker.zone}{locker.number}</div>
                            
                            {locker.isOccupied ? (
                              <div className="flex flex-col items-center justify-center h-full">
                                <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center mb-1">
                                  <User className="h-4 w-4" />
                                </div>
                                <div className="text-xs font-medium truncate max-w-full px-1">
                                  {locker.memberName}
                                </div>
                                <div className="absolute bottom-1 right-2 text-[10px] opacity-70">사용중</div>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center h-full">
                                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mb-1">
                                  <Lock className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <span className="text-xs text-muted-foreground">비어있음</span>
                              </div>
                            )}
                            
                            {locker.isOccupied && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-6 mt-8 p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-primary/90 rounded border-2 border-primary"></div>
                  <span className="text-sm font-medium">사용중</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-card border-2 border-border rounded"></div>
                  <span className="text-sm font-medium">이용 가능</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 flex items-center justify-center rounded-full bg-primary-foreground/20">
                    <User className="h-3 w-3" />
                  </div>
                  <span className="text-sm font-medium">회원 배정됨</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 flex items-center justify-center rounded-full bg-muted">
                    <Lock className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <span className="text-sm font-medium">비어있음</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {userRole === "owner" && (
          <TabsContent value="settings">
            <LockerSettings />
          </TabsContent>
        )}
      </Tabs>
      
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
