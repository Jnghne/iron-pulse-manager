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
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { mockMembers, Member, getMockAttendance, AttendanceRecord } from "@/data/mockData";
import { formatDate, formatPhoneNumber, getAttendanceStatus } from "@/lib/utils";
import { 
  Edit, 
  User, 
  CalendarIcon, 
  Clock,
  CreditCard,
  Key,
  Mail
} from "lucide-react";
import { toast } from "sonner";

// Components for member details tabs
const MemberInfo = ({ member }: { member: Member }) => {
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
                <Badge className="bg-gym-success mr-2">활성</Badge>
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
                  <Badge className="bg-gym-accent mr-2">활성</Badge>
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
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <CreditCard className="h-4 w-4 mr-2" />
                <span>이용권 등록/수정</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>이용권 등록/수정</DialogTitle>
                <DialogDescription>
                  {member.name} 회원의 이용권 정보를 등록하거나 수정합니다.
                </DialogDescription>
              </DialogHeader>
              {/* Membership form would go here */}
              <p className="text-sm text-muted-foreground">이 기능은 데모 버전에서는 제공되지 않습니다.</p>
              <DialogFooter>
                <Button variant="outline" onClick={() => {}}>취소</Button>
                <Button onClick={() => toast.success("이용권이 등록되었습니다.")}>
                  저장하기
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Key className="h-4 w-4 mr-2" />
                <span>락커 등록</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>락커 등록</DialogTitle>
                <DialogDescription>
                  {member.name} 회원에게 락커를 등록합니다.
                </DialogDescription>
              </DialogHeader>
              {/* Locker form would go here */}
              <p className="text-sm text-muted-foreground">이 기능은 데모 버전에서는 제공되지 않습니다.</p>
              <DialogFooter>
                <Button variant="outline" onClick={() => {}}>취소</Button>
                <Button onClick={() => toast.success("락커가 등록되었습니다.")}>
                  저장하기
                </Button>
              </DialogFooter>
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
