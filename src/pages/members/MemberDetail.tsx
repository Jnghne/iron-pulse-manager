
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ChevronLeft, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  CreditCard, 
  Edit, 
  Plus,
  Users,
  Key
} from "lucide-react";
import { mockMembers, Member } from "@/data/mockData";
import { formatDate, formatPhoneNumber, calculateAge } from "@/lib/utils";
import { MemberSummary } from "./components/MemberSummary";
import { MemberInfoTab } from "./components/MemberInfoTab";
import { AttendanceTab } from "./components/AttendanceTab";
import { PaymentHistoryTab } from "./components/PaymentHistoryTab";
import { MemberEditDialog } from "./components/MemberEditDialog";
import { LockerRegistrationDialog } from "./components/LockerRegistrationDialog";

interface MemberDetailProps {
  id?: string;
}

const MemberDetail = ({ id: propId }: MemberDetailProps) => {
  const params = useParams<{ id: string }>();
  const urlId = params.id;
  const navigate = useNavigate();
  
  const id = propId || urlId;
  
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("info");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [lockerDialogOpen, setLockerDialogOpen] = useState(false);

  // Mock auth check - replace with actual auth implementation
  const userRole = localStorage.getItem("userRole") || "trainer";
  const isOwner = userRole === "owner";

  useEffect(() => {
    const fetchMember = () => {
      setLoading(true);
      try {
        const foundMember = mockMembers.find(m => m.id === id);
        if (foundMember) {
          setMember(foundMember);
        } else {
          console.error("회원을 찾을 수 없습니다.");
        }
      } catch (error) {
        console.error("회원 정보를 불러오는 중 오류가 발생했습니다:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMember();
    }
  }, [id]);

  const handlePaymentRegistration = () => {
    navigate("/payment-registration", { state: { memberId: member?.id } });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gym-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">회원 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="space-y-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/members")}
          className="flex items-center gap-1.5 text-sm"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="font-medium">목록으로</span>
        </Button>
        
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">회원을 찾을 수 없습니다</CardTitle>
            <CardDescription>
              요청하신 ID({id})에 해당하는 회원 정보가 존재하지 않습니다.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 상단 네비게이션 및 액션 버튼 */}
      <div className="flex justify-between items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/members")}
          className="flex items-center gap-2 text-sm"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="font-medium">목록으로</span>
        </Button>
        
        <div className="flex gap-3">
          <Button 
            variant="outline"
            onClick={() => setLockerDialogOpen(true)}
            className="flex items-center gap-2 text-sm"
          >
            <Key className="h-4 w-4" />
            <span>락커 등록</span>
          </Button>
          
          <Button 
            onClick={() => setEditDialogOpen(true)}
            className="flex items-center gap-2 text-sm bg-gym-primary hover:bg-gym-primary/90"
          >
            <Edit className="h-4 w-4" />
            <span>회원 정보 수정</span>
          </Button>
        </div>
      </div>

      {/* 회원 정보 요약 */}
      <MemberSummary member={member} />

      {/* 메인 콘텐츠 탭 */}
      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 gap-2">
              <TabsTrigger value="info" className="px-4 py-2 text-sm">회원 정보</TabsTrigger>
              <TabsTrigger value="membership" className="px-4 py-2 text-sm">이용권 정보</TabsTrigger>
              <TabsTrigger value="attendance" className="px-4 py-2 text-sm">출석 관리</TabsTrigger>
              <TabsTrigger value="payment" className="px-4 py-2 text-sm">결제 내역</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="mt-6">
              <MemberInfoTab member={member} />
            </TabsContent>
            
            <TabsContent value="membership" className="mt-6">
              <div className="space-y-6">
                {/* 헬스장 이용권 정보 */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">헬스장 이용권</CardTitle>
                      <CardDescription>
                        헬스장 이용권 상태 및 정보
                      </CardDescription>
                    </div>
                    {isOwner && (
                      <Button 
                        onClick={handlePaymentRegistration}
                        className="flex items-center gap-2 text-sm"
                      >
                        <Plus className="h-4 w-4" />
                        결제 등록
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    {member.membershipActive ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">상태</span>
                          <Badge className="bg-green-100 text-green-800">활성</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">시작일</span>
                          <span>{formatDate(member.membershipStartDate || '')}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">종료일</span>
                          <span>{formatDate(member.membershipEndDate || '')}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">남은 기간</span>
                          <span>{member.gymMembershipDaysLeft || 0}일</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <Badge variant="destructive">이용권 없음</Badge>
                        <p className="mt-2 text-sm text-muted-foreground">
                          현재 등록된 헬스장 이용권이 없습니다.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* PT 이용권 정보 */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">PT 이용권</CardTitle>
                      <CardDescription>
                        퍼스널 트레이닝 이용권 상태 및 정보
                      </CardDescription>
                    </div>
                    {isOwner && (
                      <Button 
                        onClick={handlePaymentRegistration}
                        className="flex items-center gap-2 text-sm"
                      >
                        <Plus className="h-4 w-4" />
                        결제 등록
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    {member.hasPT ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">상태</span>
                          <Badge className="bg-blue-100 text-blue-800">활성</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">시작일</span>
                          <span>{formatDate(member.ptStartDate || '')}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">종료일</span>
                          <span>{formatDate(member.ptExpiryDate || '')}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">이용 횟수</span>
                          <span>{member.ptRemaining}회 / {member.ptTotal || 20}회</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">담당 트레이너</span>
                          <span>{member.trainerAssigned || '미지정'}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-4">
                        등록된 PT 이용권이 없습니다.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="attendance" className="mt-6">
              <AttendanceTab memberId={member.id} />
            </TabsContent>
            
            <TabsContent value="payment" className="mt-6">
              <PaymentHistoryTab memberId={member.id} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* 다이얼로그들 */}
      <MemberEditDialog 
        member={member}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={(updatedMember) => {
          setMember(updatedMember);
          setEditDialogOpen(false);
        }}
      />

      <LockerRegistrationDialog
        member={member}
        open={lockerDialogOpen}
        onOpenChange={setLockerDialogOpen}
        onSave={() => {
          setLockerDialogOpen(false);
        }}
      />
    </div>
  );
};

export default MemberDetail;
