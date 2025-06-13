
import { useState, memo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Search, Check, X, Smartphone, Eye } from "lucide-react";

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
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">승인대기</Badge>;
    case 'approved':
      return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">승인완료</Badge>;
    case 'rejected':
      return <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-200">승인거절</Badge>;
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
  }, []);

  // 거절 처리
  const handleReject = useCallback((registrationId: string) => {
    setRegistrations(prev => 
      prev.map(reg => 
        reg.id === registrationId 
          ? { ...reg, status: 'rejected' as const } 
          : reg
      )
    );
  }, []);

  // 검색 결과 필터링
  const filteredRegistrations = registrations.filter(reg => 
    reg.name.includes(searchQuery) || 
    reg.phone.includes(searchQuery) ||
    reg.email.includes(searchQuery) ||
    (reg.trainerName && reg.trainerName.includes(searchQuery))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">앱 가입 관리</h1>
          <p className="text-muted-foreground">PT 회원들의 앱 가입 요청을 관리합니다.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between sm:items-center space-y-2 sm:space-y-0 gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="이름, 연락처, 이메일, 담당 트레이너로 검색..."
              className="pl-8 w-full sm:w-[400px]"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            앱 가입 요청 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <div className="relative w-full overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">#</TableHead>
                    <TableHead>이름</TableHead>
                    <TableHead>연락처</TableHead>
                    <TableHead>이메일</TableHead>
                    <TableHead>담당 트레이너</TableHead>
                    <TableHead>신청일</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead className="text-right">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRegistrations.length > 0 ? (
                    filteredRegistrations.map((registration, index) => (
                      <TableRow key={registration.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">{registration.name}</TableCell>
                        <TableCell>{registration.phone}</TableCell>
                        <TableCell>{registration.email}</TableCell>
                        <TableCell>{registration.trainerName}</TableCell>
                        <TableCell>{registration.registrationDate}</TableCell>
                        <TableCell>
                          <AppRegistrationStatusBadge status={registration.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleViewDetails(registration)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {registration.status === 'pending' && (
                              <>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleApprove(registration.id)}
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleReject(registration.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
                      <TableCell colSpan={8} className="text-center py-10">
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

      {/* 상세 정보 다이얼로그 */}
      {selectedRegistration && (
        <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>앱 가입 요청 상세</DialogTitle>
              <DialogDescription>
                회원의 앱 가입 요청 정보를 확인하고 승인/거절 처리를 할 수 있습니다.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="font-medium text-right">이름</div>
                <div className="col-span-2">{selectedRegistration.name}</div>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="font-medium text-right">연락처</div>
                <div className="col-span-2">{selectedRegistration.phone}</div>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="font-medium text-right">이메일</div>
                <div className="col-span-2">{selectedRegistration.email}</div>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="font-medium text-right">담당 트레이너</div>
                <div className="col-span-2">{selectedRegistration.trainerName}</div>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="font-medium text-right">신청일</div>
                <div className="col-span-2">{selectedRegistration.registrationDate}</div>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="font-medium text-right">상태</div>
                <div className="col-span-2">
                  <AppRegistrationStatusBadge status={selectedRegistration.status} />
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

export default AppRegistrations;
