import { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ChevronLeft, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  CreditCard, 
  Edit, 
  MessageSquare,
  Activity,
  Dumbbell,
  UserCheck
} from "lucide-react";
import { mockMembers, Member } from "@/data/mockData";
import { formatDate, formatPhoneNumber } from "@/lib/utils";

interface MemberDetailProps {
  id?: string; // props로 전달되는 id (옵션)
}

const MemberDetail = ({ id: propId }: MemberDetailProps) => {
  const params = useParams<{ id: string }>();
  const urlId = params.id; // URL에서 가져온 id
  const navigate = useNavigate();
  
  // props로 전달된 id가 있으면 그것을 사용, 없으면 URL에서 가져온 id 사용
  const id = propId || urlId;
  
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // 실제 환경에서는 API 호출로 대체
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

  // 회원 상태에 따른 배지 색상 결정
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">활성</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">만료</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">대기</Badge>;
      default:
        return <Badge variant="outline">알 수 없음</Badge>;
    }
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
          <CardFooter className="flex justify-center">
            <Button onClick={() => navigate("/members")}>
              회원 목록으로 돌아가기
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 상단 네비게이션 */}
      <div className="flex justify-between items-center">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/members")}
          className="flex items-center gap-1.5 text-sm"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="font-medium">목록으로</span>
        </Button>
        
        <Button 
          onClick={() => navigate(`/members/edit/${member.id}`)}
          className="flex items-center gap-1.5 bg-gym-primary hover:bg-gym-primary/90"
        >
          <Edit className="h-4 w-4" />
          <span>회원 정보 수정</span>
        </Button>
      </div>
      
      {/* 회원 프로필 카드 */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/30 pb-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
              <AvatarFallback className="bg-gym-primary text-white text-xl">
                {member.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-2xl">{member.name}</CardTitle>
                {getStatusBadge(member.membershipStatus)}
                {member.gender === 'male' ? 
                  <Badge variant="outline" className="text-blue-600 bg-blue-50">남성</Badge> : 
                  <Badge variant="outline" className="text-pink-600 bg-pink-50">여성</Badge>
                }
              </div>
              <CardDescription className="text-base mt-1">
                {member.id} · {member.memberType}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">기본 정보</TabsTrigger>
              <TabsTrigger value="membership">회원권 정보</TabsTrigger>
              <TabsTrigger value="history">이용 내역</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">연락처 정보</h3>
                  <Separator />
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{formatPhoneNumber(member.phone)}</span>
                    </div>
                    
                    {member.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{member.email}</span>
                      </div>
                    )}
                    
                    {member.address && (
                      <div className="flex items-start gap-2">
                        <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span className="text-sm">{member.address}</span>
                      </div>
                    )}
                    
                    {member.birthDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{formatDate(member.birthDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">담당 트레이너</h3>
                  <Separator />
                  
                  <div className="space-y-3">
                    {member.trainerAssigned ? (
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-purple-100 text-purple-700">
                            {member.trainerAssigned.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.trainerAssigned}</p>
                          <p className="text-xs text-muted-foreground">담당 트레이너</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">담당 트레이너가 지정되지 않았습니다.</p>
                    )}
                    
                    {member.trainerNotes && (
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-1">트레이너 메모</p>
                        <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                          {member.trainerNotes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="membership" className="mt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Dumbbell className="h-4 w-4 text-gym-primary" />
                      헬스장 이용권
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {member.gymMembershipDaysLeft !== undefined ? (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">남은 일수</span>
                          <span className="font-semibold">{member.gymMembershipDaysLeft}일</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">만료일</span>
                          <span>{formatDate(member.gymMembershipExpiryDate || '')}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">등록일</span>
                          <span>{formatDate(member.registrationDate)}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">헬스장 이용권이 없습니다.</p>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-gym-primary" />
                      PT 이용권
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {member.ptRemaining !== undefined ? (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">남은 횟수</span>
                          <span className="font-semibold">{member.ptRemaining}회</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">만료일</span>
                          <span>{formatDate(member.ptExpiryDate || '')}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">담당 트레이너</span>
                          <span>{member.trainerAssigned || '-'}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">PT 이용권이 없습니다.</p>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Activity className="h-4 w-4 text-gym-primary" />
                      출석 정보
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">출석률</span>
                        <Badge className={`${member.attendanceRate > 80 ? 'bg-green-100 text-green-800' : member.attendanceRate > 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                          {member.attendanceRate}%
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">최근 방문일</span>
                        <span>2024-05-25</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">이번 달 방문</span>
                        <span>15회</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-gym-primary" />
                      알림 설정
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">SMS 수신 동의</span>
                        <Badge variant={member.smsConsent ? "default" : "outline"} className={member.smsConsent ? "bg-gym-primary" : ""}>
                          {member.smsConsent ? "동의" : "미동의"}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">만료 알림</span>
                        <Badge variant="outline">7일 전</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="history" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">이용 내역</CardTitle>
                  <CardDescription>
                    회원의 결제 및 이용 내역을 확인할 수 있습니다.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center py-8">
                    이용 내역이 없습니다.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberDetail;
