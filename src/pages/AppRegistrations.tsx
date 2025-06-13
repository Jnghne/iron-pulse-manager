
import { useState, memo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Search, Check, X, Smartphone, Eye, Users, Calendar, Mail, Phone } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AppRegistration {
  id: string;
  name: string;
  phone: string;
  email: string;
  registrationDate: string;
  status: 'pending' | 'approved' | 'rejected';
  trainerName?: string;
}

// Mock data for app registrations
const appRegistrationsMock: AppRegistration[] = [
  {
    id: "AR001",
    name: "김회원",
    phone: "010-1111-2222",
    email: "kim@member.com",
    registrationDate: "2024-06-10",
    status: 'pending',
    trainerName: "박트레이너"
  },
  {
    id: "AR002",
    name: "이회원",
    phone: "010-3333-4444",
    email: "lee@member.com",
    registrationDate: "2024-06-11",
    status: 'pending',
    trainerName: "김트레이너"
  },
  {
    id: "AR003",
    name: "박회원",
    phone: "010-5555-6666",
    email: "park@member.com",
    registrationDate: "2024-06-09",
    status: 'approved',
    trainerName: "이트레이너"
  },
  {
    id: "AR004",
    name: "최회원",
    phone: "010-7777-8888",
    email: "choi@member.com",
    registrationDate: "2024-06-08",
    status: 'rejected',
    trainerName: "박트레이너"
  },
];

const AppRegistrationStatusBadge = memo<{ status: AppRegistration['status'] }>(({ status }) => {
  switch (status) {
    case 'pending':
      return (
        <Badge className="bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200">
          <div className="w-2 h-2 bg-orange-500 rounded-full mr-1 animate-pulse"></div>
          승인대기
        </Badge>
      );
    case 'approved':
      return (
        <Badge className="bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200">
          <Check className="w-3 h-3 mr-1" />
          승인완료
        </Badge>
      );
    case 'rejected':
      return (
        <Badge className="bg-gradient-to-r from-rose-100 to-red-100 text-rose-800 border-rose-200 hover:bg-rose-200">
          <X className="w-3 h-3 mr-1" />
          승인거절
        </Badge>
      );
    default:
      return null;
  }
});

AppRegistrationStatusBadge.displayName = 'AppRegistrationStatusBadge';

const AppRegistrations = () => {
  const [registrations, setRegistrations] = useState<AppRegistration[]>(appRegistrationsMock);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegistration, setSelectedRegistration] = useState<AppRegistration | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // 검색 기능
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  // 상세 보기
  const handleViewDetails = useCallback((registration: AppRegistration) => {
    setSelectedRegistration(registration);
    setDetailDialogOpen(true);
  }, []);

  // 승인 처리
  const handleApprove = useCallback((registrationId: string) => {
    setRegistrations(prev => 
      prev.map(reg => 
        reg.id === registrationId 
          ? { ...reg, status: 'approved' as const } 
          : reg
      )
    );
    
    const registration = registrations.find(r => r.id === registrationId);
    toast({
      title: "승인 완료",
      description: `${registration?.name}님의 앱 가입이 승인되었습니다.`,
    });
  }, [registrations]);

  // 거절 처리
  const handleReject = useCallback((registrationId: string) => {
    setRegistrations(prev => 
      prev.map(reg => 
        reg.id === registrationId 
          ? { ...reg, status: 'rejected' as const } 
          : reg
      )
    );
    
    const registration = registrations.find(r => r.id === registrationId);
    toast({
      title: "거절 완료",
      description: `${registration?.name}님의 앱 가입 요청이 거절되었습니다.`,
      variant: "destructive",
    });
  }, [registrations]);

  // 검색 결과 필터링
  const filteredRegistrations = registrations.filter(reg => 
    reg.name.includes(searchQuery) || 
    reg.phone.includes(searchQuery) ||
    reg.email.includes(searchQuery) ||
    (reg.trainerName && reg.trainerName.includes(searchQuery))
  );

  // 통계
  const pendingCount = registrations.filter(r => r.status === 'pending').length;
  const approvedCount = registrations.filter(r => r.status === 'approved').length;
  const rejectedCount = registrations.filter(r => r.status === 'rejected').length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 헤더 - 통계 카드만 표시 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 border-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">승인 대기</p>
              <p className="text-3xl font-bold text-gray-900">{pendingCount}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 border-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">승인 완료</p>
              <p className="text-3xl font-bold text-gray-900">{approvedCount}</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-lg">
              <Check className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 border-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">승인 거절</p>
              <p className="text-3xl font-bold text-gray-900">{rejectedCount}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <X className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* 검색 */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center space-y-4 sm:space-y-0 gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="이름, 연락처, 이메일, 담당 트레이너로 검색..."
            className="pl-9 h-11"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* 가입 요청 목록 */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
          <CardTitle className="flex items-center gap-3">
            <Users className="h-5 w-5" />
            앱 가입 요청 목록
            <Badge variant="secondary" className="ml-auto">
              총 {filteredRegistrations.length}건
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[60px] font-semibold">#</TableHead>
                  <TableHead className="font-semibold">이름</TableHead>
                  <TableHead className="font-semibold">연락처</TableHead>
                  <TableHead className="font-semibold">이메일</TableHead>
                  <TableHead className="font-semibold">담당 트레이너</TableHead>
                  <TableHead className="font-semibold">신청일</TableHead>
                  <TableHead className="font-semibold">상태</TableHead>
                  <TableHead className="text-right font-semibold">관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRegistrations.length > 0 ? (
                  filteredRegistrations.map((registration, index) => (
                    <TableRow 
                      key={registration.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="font-medium text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-medium">{registration.name}</TableCell>
                      <TableCell className="text-muted-foreground">{registration.phone}</TableCell>
                      <TableCell className="text-muted-foreground">{registration.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-normal">
                          {registration.trainerName}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{registration.registrationDate}</TableCell>
                      <TableCell>
                        <AppRegistrationStatusBadge status={registration.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleViewDetails(registration)}
                            className="h-8 w-8 p-0 hover:bg-blue-50"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {registration.status === 'pending' && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleApprove(registration.id)}
                                className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleReject(registration.id)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <div className="flex flex-col items-center justify-center text-muted-foreground space-y-3">
                        <div className="p-4 bg-muted/30 rounded-full">
                          <Search className="h-8 w-8" />
                        </div>
                        <div>
                          <p className="font-medium">검색 결과가 없습니다</p>
                          <p className="text-sm">다른 검색어를 입력해 보세요</p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 상세 정보 다이얼로그 */}
      {selectedRegistration && (
        <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Smartphone className="h-5 w-5 text-blue-600" />
                </div>
                <DialogTitle className="text-xl">앱 가입 요청 상세</DialogTitle>
              </div>
              <DialogDescription>
                회원의 앱 가입 요청 정보를 확인하고 승인/거절 처리를 할 수 있습니다.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* 기본 정보 */}
              <div className="bg-muted/30 rounded-lg p-4 space-y-4">
                <h4 className="font-semibold text-gray-900 mb-3">기본 정보</h4>
                
                <div className="grid grid-cols-4 gap-3 items-center">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span className="text-sm font-medium">이름</span>
                  </div>
                  <div className="col-span-3 font-medium">{selectedRegistration.name}</div>
                </div>
                
                <div className="grid grid-cols-4 gap-3 items-center">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm font-medium">연락처</span>
                  </div>
                  <div className="col-span-3 font-medium">{selectedRegistration.phone}</div>
                </div>
                
                <div className="grid grid-cols-4 gap-3 items-center">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm font-medium">이메일</span>
                  </div>
                  <div className="col-span-3 font-medium">{selectedRegistration.email}</div>
                </div>
                
                <div className="grid grid-cols-4 gap-3 items-center">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span className="text-sm font-medium">담당 트레이너</span>
                  </div>
                  <div className="col-span-3">
                    <Badge variant="outline">{selectedRegistration.trainerName}</Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-3 items-center">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm font-medium">신청일</span>
                  </div>
                  <div className="col-span-3 font-medium">{selectedRegistration.registrationDate}</div>
                </div>
                
                <div className="grid grid-cols-4 gap-3 items-center">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-sm font-medium">상태</span>
                  </div>
                  <div className="col-span-3">
                    <AppRegistrationStatusBadge status={selectedRegistration.status} />
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>
                닫기
              </Button>
              {selectedRegistration.status === 'pending' && (
                <>
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      handleReject(selectedRegistration.id);
                      setDetailDialogOpen(false);
                    }}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    거절
                  </Button>
                  <Button 
                    onClick={() => {
                      handleApprove(selectedRegistration.id);
                      setDetailDialogOpen(false);
                    }}
                    className="gap-2 bg-emerald-600 hover:bg-emerald-700"
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

export default AppRegistrations;
