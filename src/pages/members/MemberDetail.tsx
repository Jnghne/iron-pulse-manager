
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockMembers, Member, getMockAttendance, AttendanceRecord } from "@/data/mockData";
import { formatDate, formatPhoneNumber, getAttendanceStatus, formatDateYYYYMMDD, addDays } from "@/lib/utils";
import { 
  Edit, 
  User, 
  CalendarIcon, 
  Clock,
  CreditCard,
  Key,
  Mail,
  Plus,
  Trash2
} from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Components for member details tabs
const MembershipForm = ({ member, onClose }: { member: Member, onClose: () => void }) => {
  const [membershipType, setMembershipType] = useState(member.membershipActive ? "extend" : "new");
  const [membershipMonths, setMembershipMonths] = useState("1");
  const [ptSessions, setPtSessions] = useState(member.hasPT ? member.ptRemaining.toString() : "0");
  const [startDate, setStartDate] = useState<Date>(
    member.membershipStartDate ? new Date(member.membershipStartDate) : new Date()
  );
  const [endDate, setEndDate] = useState<Date>(
    member.membershipEndDate ? new Date(member.membershipEndDate) : addDays(new Date(), 30)
  );

  // Calculate end date based on start date and months
  useEffect(() => {
    if (membershipType === "extend" && member.membershipEndDate) {
      const months = parseInt(membershipMonths);
      const baseDate = new Date(member.membershipEndDate);
      setEndDate(new Date(baseDate.setMonth(baseDate.getMonth() + months)));
    } else if (membershipType === "new") {
      const months = parseInt(membershipMonths);
      const baseDate = new Date(startDate);
      setEndDate(new Date(baseDate.setMonth(baseDate.getMonth() + months)));
    }
  }, [startDate, membershipMonths, membershipType, member.membershipEndDate]);

  const handleSubmit = () => {
    const updatedMember = { ...member };
    
    // Update membership info
    updatedMember.membershipActive = true;
    updatedMember.membershipStartDate = startDate;
    updatedMember.membershipEndDate = endDate;
    
    // Update PT info
    const ptSessionsInt = parseInt(ptSessions);
    if (ptSessionsInt > 0) {
      updatedMember.hasPT = true;
      updatedMember.ptRemaining = ptSessionsInt;
      // Add PT expiration date (6 months from now)
      const ptExpireDate = new Date();
      ptExpireDate.setMonth(ptExpireDate.getMonth() + 6);
      updatedMember.ptExpireDate = ptExpireDate;
    }
    
    // In a real app, this would be an API call
    toast.success("회원권 정보가 업데이트되었습니다.");
    onClose();
  };

  return (
    <div className="space-y-4">
      <RadioGroup 
        value={membershipType} 
        onValueChange={setMembershipType}
        className="flex flex-col space-y-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="new" id="new" />
          <label htmlFor="new" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            신규 등록
          </label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="extend" id="extend" />
          <label htmlFor="extend" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            기존 이용권 연장
          </label>
        </div>
      </RadioGroup>

      <div className="space-y-4 pt-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="start-date">시작일</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  disabled={membershipType === "extend"}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? formatDate(startDate) : "날짜 선택"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => date && setStartDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="membership-months">개월 수</label>
            <Select value={membershipMonths} onValueChange={setMembershipMonths}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="개월 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1개월</SelectItem>
                <SelectItem value="3">3개월</SelectItem>
                <SelectItem value="6">6개월</SelectItem>
                <SelectItem value="12">12개월</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="end-date">종료일</label>
          <Input 
            id="end-date" 
            value={formatDate(endDate)} 
            disabled 
            className="bg-muted"
          />
        </div>
      </div>
      
      <Separator className="my-4" />
      
      <div className="space-y-4">
        <h3 className="text-sm font-medium">PT 이용권</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="pt-sessions">PT 횟수</label>
            <Input 
              id="pt-sessions" 
              type="number" 
              min="0" 
              value={ptSessions} 
              onChange={(e) => setPtSessions(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="trainer">담당 트레이너</label>
            <Select defaultValue={member.trainerAssigned || ""}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="트레이너 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="박지훈">박지훈</SelectItem>
                <SelectItem value="김태양">김태양</SelectItem>
                <SelectItem value="최수진">최수진</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <DialogFooter className="mt-6">
        <Button variant="outline" onClick={onClose}>취소</Button>
        <Button onClick={handleSubmit}>저장하기</Button>
      </DialogFooter>
    </div>
  );
};

const LockerForm = ({ member, onClose }: { member: Member, onClose: () => void }) => {
  // In a real app, these would come from an API
  const [availableLockers, setAvailableLockers] = useState([
    { id: "A01", status: "available" },
    { id: "A02", status: "occupied" },
    { id: "A03", status: "available" },
    { id: "B01", status: "available" },
    { id: "B02", status: "available" },
    { id: "B03", status: "occupied" },
    { id: "B04", status: "occupied" },
    { id: "C01", status: "available" },
    { id: "C02", status: "available" },
  ]);
  
  const [selectedLocker, setSelectedLocker] = useState<string | null>(
    member.lockerId || null
  );

  const handleLockerSelect = (lockerId: string) => {
    setSelectedLocker(lockerId === selectedLocker ? null : lockerId);
  };

  const handleSubmit = () => {
    if (!selectedLocker) {
      toast.error("락커를 선택해주세요.");
      return;
    }
    
    // In a real app, this would be an API call
    toast.success(`${selectedLocker} 락커가 ${member.name} 회원에게 등록되었습니다.`);
    onClose();
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {member.lockerId 
          ? `${member.name} 회원은 현재 ${member.lockerId} 락커를 사용 중입니다.`
          : `${member.name} 회원은 현재 등록된 락커가 없습니다.`}
      </p>
      
      <div className="grid grid-cols-3 gap-2 mt-4">
        {availableLockers.map((locker) => (
          <Button
            key={locker.id}
            variant={selectedLocker === locker.id ? "default" : "outline"}
            className={`h-16 ${
              locker.status === "occupied" && locker.id !== member.lockerId
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : locker.status === "available"
                ? "hover:bg-primary/20"
                : ""
            }`}
            onClick={() => locker.status === "available" && handleLockerSelect(locker.id)}
            disabled={locker.status === "occupied" && locker.id !== member.lockerId}
          >
            <div className="text-center">
              <div className="text-lg font-bold">{locker.id}</div>
              <div className="text-xs">
                {locker.id === member.lockerId
                  ? "현재 사용 중"
                  : locker.status === "available"
                  ? "사용 가능"
                  : "사용 중"}
              </div>
            </div>
          </Button>
        ))}
      </div>
      
      <DialogFooter className="mt-6">
        {member.lockerId && member.lockerId !== selectedLocker && (
          <Button variant="destructive" className="mr-auto" onClick={() => onClose()}>
            <Trash2 className="h-4 w-4 mr-2" />
            락커 해지
          </Button>
        )}
        <Button variant="outline" onClick={onClose}>취소</Button>
        <Button onClick={handleSubmit}>저장하기</Button>
      </DialogFooter>
    </div>
  );
};

const MemberInfo = ({ member }: { member: Member }) => {
  const [membershipDialogOpen, setMembershipDialogOpen] = useState(false);
  const [lockerDialogOpen, setLockerDialogOpen] = useState(false);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>회원 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm font-medium">회원 번호</div>
            <div className="text-sm">{member.id}</div>
            
            <div className="text-sm font-medium">이름</div>
            <div className="text-sm">{member.name}</div>
            
            <div className="text-sm font-medium">연락처</div>
            <div className="text-sm">{formatPhoneNumber(member.phoneNumber)}</div>
            
            <div className="text-sm font-medium">등록일</div>
            <div className="text-sm">{formatDate(member.registrationDate)}</div>
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/50 px-6">
          <Button variant="outline" size="sm" className="ml-auto">
            <Edit className="h-4 w-4 mr-2" />
            <span>정보 수정</span>
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>헬스장 / PT 이용 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-1">헬스장 이용권</p>
            {member.membershipActive ? (
              <div className="flex items-center">
                <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 mr-2">활성</Badge>
                <span className="text-sm">
                  {member.membershipStartDate && member.membershipEndDate
                    ? `${formatDate(member.membershipStartDate)} ~ ${formatDate(member.membershipEndDate)}`
                    : "기간 정보 없음"}
                </span>
              </div>
            ) : (
              <Badge variant="secondary" className="text-muted-foreground">만료</Badge>
            )}
          </div>
          
          <Separator />
          
          <div>
            <p className="text-sm font-medium mb-1">PT 이용권</p>
            {member.hasPT ? (
              <div className="space-y-2">
                <div className="flex items-center">
                  <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 mr-2">활성</Badge>
                  <span className="text-sm">{member.ptRemaining}회 남음</span>
                </div>
                {member.ptExpireDate && (
                  <div className="text-sm">
                    만료일: {formatDate(member.ptExpireDate)}
                  </div>
                )}
                {member.trainerAssigned && (
                  <div className="text-sm">
                    담당 트레이너: {member.trainerAssigned}
                  </div>
                )}
              </div>
            ) : (
              <Badge variant="outline">미등록</Badge>
            )}
          </div>
          
          <Separator />
          
          <div>
            <p className="text-sm font-medium mb-1">락커 정보</p>
            {member.lockerId ? (
              <Badge variant="outline" className="bg-blue-50">{member.lockerId}</Badge>
            ) : (
              <Badge variant="outline">미등록</Badge>
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/50 px-6 flex justify-between">
          <Dialog open={membershipDialogOpen} onOpenChange={setMembershipDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <CreditCard className="h-4 w-4 mr-2" />
                <span>이용권 등록/수정</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>이용권 등록/수정</DialogTitle>
                <DialogDescription>
                  {member.name} 회원의 이용권 정보를 등록하거나 수정합니다.
                </DialogDescription>
              </DialogHeader>
              <MembershipForm 
                member={member} 
                onClose={() => setMembershipDialogOpen(false)} 
              />
            </DialogContent>
          </Dialog>
          
          <Dialog open={lockerDialogOpen} onOpenChange={setLockerDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Key className="h-4 w-4 mr-2" />
                <span>락커 등록</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>락커 등록</DialogTitle>
                <DialogDescription>
                  {member.name} 회원에게 락커를 등록합니다.
                </DialogDescription>
              </DialogHeader>
              <LockerForm 
                member={member} 
                onClose={() => setLockerDialogOpen(false)} 
              />
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  );
};

const AttendanceTab = ({ memberId }: { memberId: string }) => {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  
  useEffect(() => {
    // Get mock attendance data
    const attendanceData = getMockAttendance(memberId, 90);
    setAttendance(attendanceData);
  }, [memberId]);
  
  // Calculate attendance rate
  const calculateAttendanceRate = () => {
    const totalDays = attendance.length;
    if (totalDays === 0) return 0;
    
    const attendedDays = attendance.filter(record => record.attended).length;
    return Math.round((attendedDays / totalDays) * 100);
  };
  
  const attendanceRate = calculateAttendanceRate();
  const status = getAttendanceStatus(attendanceRate);

  // Customize calendar appearance by modifying CSS
  const modifiers = {
    attended: attendance
      .filter(record => record.attended)
      .map(record => new Date(record.date)),
    absent: attendance
      .filter(record => !record.attended && record.date)
      .map(record => new Date(record.date)),
  };

  const modifiersStyles = {
    attended: { 
      backgroundColor: "#f0fdf4", // Light green background
      color: "#15803d",
      fontWeight: "bold"
    },
    absent: { 
      backgroundColor: "#fef2f2", // Light red background
      color: "#dc2626"
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>출석 캘린더</CardTitle>
            <CardDescription>
              회원의 헬스장 방문 기록을 캘린더로 확인하세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
              onDayClick={(day) => {
                // Find attendance record for this date if needed
                const dateStr = day.toISOString().split("T")[0];
                const record = attendance.find(r => r.date === dateStr);
                if (record) {
                  // Could show a tooltip or detail about this day
                  console.log(record);
                }
              }}
            />
            <div className="flex items-center justify-center space-x-4 mt-4 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-100 rounded mr-2"></div>
                <span>출석</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-50 rounded mr-2"></div>
                <span>미출석</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>출석 통계</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">출석률</p>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-2 w-full bg-muted rounded-full">
                    <div
                      className={`h-2 rounded-full ${
                        attendanceRate >= 80
                          ? "bg-gym-success"
                          : attendanceRate >= 50
                          ? "bg-gym-warning"
                          : "bg-gym-danger"
                      }`}
                      style={{ width: `${attendanceRate}%` }}
                    />
                  </div>
                </div>
                <span className="ml-4 text-2xl font-bold">{attendanceRate}%</span>
              </div>
              <div className={`text-sm ${status.color}`}>
                {status.label}
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground">최근 30일</p>
                <p className="text-xl font-bold">
                  {attendance.slice(0, 30).filter(r => r.attended).length}회 방문
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">최근 90일</p>
                <p className="text-xl font-bold">
                  {attendance.filter(r => r.attended).length}회 방문
                </p>
              </div>
            </div>
            
            <Separator />
            
            <Button className="w-full" variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              <span>참여 독려 메시지 보내기</span>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>최근 출석 기록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium">날짜</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">출석 여부</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">입장 시간</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">퇴장 시간</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.slice(0, 10).map((record, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-4 align-middle">{formatDate(record.date)}</td>
                      <td className="p-4 align-middle">
                        {record.attended ? (
                          <Badge className="bg-gym-success">출석</Badge>
                        ) : (
                          <Badge variant="outline" className="text-gym-danger">
                            미출석
                          </Badge>
                        )}
                      </td>
                      <td className="p-4 align-middle">
                        {record.timeIn || "-"}
                      </td>
                      <td className="p-4 align-middle">
                        {record.timeOut || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const MemberDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchMember = () => {
      setLoading(true);
      
      try {
        // Find member by ID
        const foundMember = mockMembers.find(m => m.id === id);
        
        if (foundMember) {
          setMember(foundMember);
        } else {
          toast.error("회원 정보를 찾을 수 없습니다.");
          navigate("/members");
        }
      } catch (error) {
        console.error("Error fetching member:", error);
        toast.error("회원 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchMember();
  }, [id, navigate]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">회원 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }
  
  if (!member) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">회원 정보를 찾을 수 없습니다.</p>
          <Button
            variant="link"
            onClick={() => navigate("/members")}
            className="mt-4"
          >
            회원 목록으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center space-y-2 sm:space-y-0">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-gym-primary flex items-center justify-center text-primary-foreground">
            <User className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <h1 className="text-2xl font-bold tracking-tight">{member.name}</h1>
            <p className="text-muted-foreground">{member.id}</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => navigate("/members")}>
            목록으로
          </Button>
          <Button className="bg-gym-primary hover:bg-gym-secondary">
            <Edit className="mr-2 h-4 w-4" />
            회원 정보 수정
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">회원 정보</TabsTrigger>
          <TabsTrigger value="attendance">출석 관리</TabsTrigger>
        </TabsList>
        
        <TabsContent value="info" className="space-y-6 mt-6">
          <MemberInfo member={member} />
        </TabsContent>
        
        <TabsContent value="attendance" className="space-y-6 mt-6">
          <AttendanceTab memberId={member.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MemberDetail;
