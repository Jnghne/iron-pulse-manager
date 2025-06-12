
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, Search, Eye, Check, X, Phone, Mail, Calendar, Users } from "lucide-react";

// 직원 타입 정의
interface Staff {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  account: string;
  workHours: string;
  memberCount: number;
  revenue: number;
  status: string;
  approvalDate: string;
  joinDate: string;
}

// 가입 요청 타입 정의
interface JoinRequest {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  account: string;
  workHours: string;
  status: string;
  joinDate: string;
  experience: string;
  certification: string;
}

// Mock data for staff
const staffMock: Staff[] = [
  {
    id: "ST001",
    name: "김직원",
    phone: "010-1234-5678",
    email: "kim@gym.com",
    address: "서울시 강남구",
    account: "국민은행 123-456-78910",
    workHours: "09:00-18:00",
    memberCount: 20,
    revenue: 4500000,
    status: "정상",
    approvalDate: "2024-01-15",
    joinDate: "2024-01-10"
  },
  {
    id: "ST002",
    name: "이직원",
    phone: "010-2345-6789",
    email: "lee@gym.com",
    address: "서울시 서초구",
    account: "신한은행 123-456-78910",
    workHours: "12:00-21:00",
    memberCount: 15,
    revenue: 3800000,
    status: "정상",
    approvalDate: "2024-02-01",
    joinDate: "2024-01-28"
  },
  {
    id: "ST003",
    name: "박직원",
    phone: "010-3456-7890",
    email: "park@gym.com",
    address: "서울시 송파구",
    account: "우리은행 123-456-78910",
    workHours: "06:00-15:00",
    memberCount: 18,
    revenue: 3200000,
    status: "휴직",
    approvalDate: "2024-01-20",
    joinDate: "2024-01-18"
  }
];

// Mock data for join requests
const joinRequestsMock: JoinRequest[] = [
  {
    id: "JR001",
    name: "정신입",
    phone: "010-9876-5432",
    email: "jung@gym.com",
    address: "서울시 마포구",
    account: "하나은행 987-654-32100",
    workHours: "14:00-23:00",
    status: "승인대기",
    joinDate: "2024-06-01",
    experience: "3년",
    certification: "생활스포츠지도사 2급"
  },
  {
    id: "JR002", 
    name: "최지원",
    phone: "010-5555-6666",
    email: "choi@gym.com",
    address: "서울시 용산구",
    account: "카카오뱅크 3333-03-123456",
    workHours: "08:00-17:00",
    status: "승인대기",
    joinDate: "2024-06-03",
    experience: "2년",
    certification: "건강운동관리사"
  },
  {
    id: "JR003",
    name: "한거절",
    phone: "010-7777-8888",
    email: "han@gym.com",
    address: "서울시 영등포구",
    account: "토스뱅크 1111-11-111111",
    workHours: "10:00-19:00",
    status: "거절",
    joinDate: "2024-05-28",
    experience: "1년",
    certification: "없음"
  }
];

const StaffManagement = () => {
  const [staff, setStaff] = useState<Staff[]>(staffMock);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>(joinRequestsMock);
  const [searchQuery, setSearchQuery] = useState("");
  const [joinSearchQuery, setJoinSearchQuery] = useState("");
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [joinDetailDialogOpen, setJoinDetailDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [selectedJoinRequest, setSelectedJoinRequest] = useState<JoinRequest | null>(null);
  const [activeTab, setActiveTab] = useState("info");

  const handleViewStaffDetails = (staffMember: Staff) => {
    setSelectedStaff(staffMember);
    setDetailDialogOpen(true);
  };

  const handleViewJoinDetails = (joinRequest: JoinRequest) => {
    setSelectedJoinRequest(joinRequest);
    setJoinDetailDialogOpen(true);
  };

  const handleApproveStaff = (requestId: string) => {
    const request = joinRequests.find(req => req.id === requestId);
    if (request) {
      // 승인된 직원을 직원 목록에 추가
      const newStaff = {
        id: `ST${String(staff.length + 1).padStart(3, '0')}`,
        name: request.name,
        phone: request.phone,
        email: request.email,
        address: request.address,
        account: request.account,
        workHours: request.workHours,
        memberCount: 0,
        revenue: 0,
        status: "정상",
        approvalDate: new Date().toISOString().split('T')[0],
        joinDate: request.joinDate
      };
      setStaff(prev => [...prev, newStaff]);
    }
    
    // 가입 요청 상태를 승인으로 변경
    setJoinRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: "승인" }
          : req
      )
    );
    setJoinDetailDialogOpen(false);
  };

  const handleRejectStaff = (requestId: string) => {
    setJoinRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: "거절" }
          : req
      )
    );
    setJoinDetailDialogOpen(false);
  };

  // Filter staff based on search query
  const filteredStaff = staff.filter(member => 
    member.name.includes(searchQuery) || 
    member.id.includes(searchQuery) ||
    member.phone.includes(searchQuery)
  );

  // Filter join requests based on search query
  const filteredJoinRequests = joinRequests.filter(request => 
    request.name.includes(joinSearchQuery) || 
    request.phone.includes(joinSearchQuery) ||
    request.email.includes(joinSearchQuery)
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "정상":
        return <Badge variant="default" className="bg-green-500">정상</Badge>;
      case "휴직":
        return <Badge variant="secondary">휴직</Badge>;
      case "퇴사":
        return <Badge variant="destructive">퇴사</Badge>;
      case "승인대기":
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">승인대기</Badge>;
      case "승인":
        return <Badge variant="default" className="bg-green-500">승인</Badge>;
      case "거절":
        return <Badge variant="destructive">거절</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">직원 관리</h1>
          <p className="text-muted-foreground">직원을 관리하고 가입 요청을 처리합니다.</p>
        </div>
      </div>
      
      <Tabs defaultValue="staff-list" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="staff-list">직원 목록</TabsTrigger>
          <TabsTrigger value="join-management">가입 관리</TabsTrigger>
        </TabsList>

        {/* 직원 목록 탭 */}
        <TabsContent value="staff-list">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle>직원 목록</CardTitle>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="이름 또는 아이디 검색..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <div className="relative w-full overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>No.</TableHead>
                        <TableHead>이름</TableHead>
                        <TableHead>연락처</TableHead>
                        <TableHead>담당 회원 수</TableHead>
                        <TableHead>직원 상태</TableHead>
                        <TableHead>승인일자</TableHead>
                        <TableHead className="text-right">관리</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStaff.length > 0 ? (
                        filteredStaff.map((staffMember, index) => (
                          <TableRow key={staffMember.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell className="font-medium">{staffMember.name}</TableCell>
                            <TableCell>{staffMember.phone}</TableCell>
                            <TableCell>{staffMember.memberCount}명</TableCell>
                            <TableCell>{getStatusBadge(staffMember.status)}</TableCell>
                            <TableCell>{staffMember.approvalDate}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={() => handleViewStaffDetails(staffMember)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-10">
                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                              <Search className="h-10 w-10 mb-2" />
                              <p>검색 결과가 없습니다.</p>
                              <p className="text-sm">다른 검색어를 입력해 보세요.</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 가입 관리 탭 */}
        <TabsContent value="join-management">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle>직원 가입 요청</CardTitle>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="이름 또는 연락처 검색..."
                    className="pl-8"
                    value={joinSearchQuery}
                    onChange={(e) => setJoinSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <div className="relative w-full overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>No.</TableHead>
                        <TableHead>이름</TableHead>
                        <TableHead>연락처</TableHead>
                        <TableHead>가입 상태</TableHead>
                        <TableHead>가입일자</TableHead>
                        <TableHead className="text-right">관리</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredJoinRequests.length > 0 ? (
                        filteredJoinRequests.map((request, index) => (
                          <TableRow key={request.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell className="font-medium">{request.name}</TableCell>
                            <TableCell>{request.phone}</TableCell>
                            <TableCell>{getStatusBadge(request.status)}</TableCell>
                            <TableCell>{request.joinDate}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={() => handleViewJoinDetails(request)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-10">
                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                              <UserPlus className="h-10 w-10 mb-2" />
                              <p>가입 요청이 없습니다.</p>
                              <p className="text-sm">새로운 가입 요청을 기다리고 있습니다.</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 직원 상세 정보 다이얼로그 */}
      {selectedStaff && (
        <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>직원 상세 정보</DialogTitle>
            </DialogHeader>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">기본 정보</TabsTrigger>
                <TabsTrigger value="members">담당 회원</TabsTrigger>
                <TabsTrigger value="performance">실적</TabsTrigger>
              </TabsList>
              
              <TabsContent value="info" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="grid grid-cols-3 gap-4 items-center">
                    <div className="font-medium text-right">이름</div>
                    <div className="col-span-2">{selectedStaff.name}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 items-center">
                    <div className="font-medium text-right">ID</div>
                    <div className="col-span-2">{selectedStaff.id}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 items-center">
                    <div className="font-medium text-right">연락처</div>
                    <div className="col-span-2 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {selectedStaff.phone}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 items-center">
                    <div className="font-medium text-right">이메일</div>
                    <div className="col-span-2 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {selectedStaff.email}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 items-center">
                    <div className="font-medium text-right">주소</div>
                    <div className="col-span-2">{selectedStaff.address}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 items-center">
                    <div className="font-medium text-right">계좌번호</div>
                    <div className="col-span-2">{selectedStaff.account}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 items-center">
                    <div className="font-medium text-right">근무 시간</div>
                    <div className="col-span-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {selectedStaff.workHours}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 items-center">
                    <div className="font-medium text-right">직원 상태</div>
                    <div className="col-span-2">{getStatusBadge(selectedStaff.status)}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 items-center">
                    <div className="font-medium text-right">승인일자</div>
                    <div className="col-span-2">{selectedStaff.approvalDate}</div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="members" className="pt-4">
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>{selectedStaff.name} 직원은 현재 {selectedStaff.memberCount}명의 회원을 담당하고 있습니다.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="performance" className="pt-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-medium text-right">이번 달 매출</div>
                    <div className="col-span-2 font-bold">{selectedStaff.revenue.toLocaleString()}원</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-medium text-right">담당 회원 수</div>
                    <div className="col-span-2">{selectedStaff.memberCount}명</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-medium text-right">회원당 평균 수익</div>
                    <div className="col-span-2">
                      {selectedStaff.memberCount ? 
                        Math.round(selectedStaff.revenue / selectedStaff.memberCount).toLocaleString() : 0}원
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>
                닫기
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* 가입 요청 상세 정보 다이얼로그 */}
      {selectedJoinRequest && (
        <Dialog open={joinDetailDialogOpen} onOpenChange={setJoinDetailDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>직원 가입 요청 상세</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-3 gap-4 items-center">
                  <div className="font-medium text-right">이름</div>
                  <div className="col-span-2">{selectedJoinRequest.name}</div>
                </div>
                <div className="grid grid-cols-3 gap-4 items-center">
                  <div className="font-medium text-right">연락처</div>
                  <div className="col-span-2 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {selectedJoinRequest.phone}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 items-center">
                  <div className="font-medium text-right">이메일</div>
                  <div className="col-span-2 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {selectedJoinRequest.email}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 items-center">
                  <div className="font-medium text-right">주소</div>
                  <div className="col-span-2">{selectedJoinRequest.address}</div>
                </div>
                <div className="grid grid-cols-3 gap-4 items-center">
                  <div className="font-medium text-right">계좌번호</div>
                  <div className="col-span-2">{selectedJoinRequest.account}</div>
                </div>
                <div className="grid grid-cols-3 gap-4 items-center">
                  <div className="font-medium text-right">근무 희망 시간</div>
                  <div className="col-span-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {selectedJoinRequest.workHours}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 items-center">
                  <div className="font-medium text-right">경력</div>
                  <div className="col-span-2">{selectedJoinRequest.experience}</div>
                </div>
                <div className="grid grid-cols-3 gap-4 items-center">
                  <div className="font-medium text-right">자격증</div>
                  <div className="col-span-2">{selectedJoinRequest.certification}</div>
                </div>
                <div className="grid grid-cols-3 gap-4 items-center">
                  <div className="font-medium text-right">가입 상태</div>
                  <div className="col-span-2">{getStatusBadge(selectedJoinRequest.status)}</div>
                </div>
                <div className="grid grid-cols-3 gap-4 items-center">
                  <div className="font-medium text-right">가입일자</div>
                  <div className="col-span-2">{selectedJoinRequest.joinDate}</div>
                </div>
              </div>
            </div>
            
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setJoinDetailDialogOpen(false)}>
                닫기
              </Button>
              {selectedJoinRequest.status === "승인대기" && (
                <>
                  <Button 
                    variant="destructive" 
                    onClick={() => handleRejectStaff(selectedJoinRequest.id)}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    거절
                  </Button>
                  <Button 
                    onClick={() => handleApproveStaff(selectedJoinRequest.id)}
                    className="gap-2 bg-primary hover:bg-primary/90"
                  >
                    <Check className="h-4 w-4" />
                    승인
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default StaffManagement;
