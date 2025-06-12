import { useState, memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Search } from "lucide-react";
import { registrationMockData, StaffRegistration } from "@/data/staff-mock-data";

// Mock data for registration
const RegistrationStatusBadge = memo<{ status: StaffRegistration['status'] }>(({ status }) => {
  switch (status) {
    case 'pending':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">승인대기</Badge>;
    case 'rejected':
      return <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-200">거절</Badge>;
    default:
      return null;
  }
});

RegistrationStatusBadge.displayName = 'RegistrationStatusBadge';

export const RegistrationManagement = memo(() => {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState<StaffRegistration[]>(registrationMockData);
  const [searchQuery, setSearchQuery] = useState("");
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<StaffRegistration | null>(null);

  // 상세 페이지로 이동
  const handleRowClick = useCallback((registrationId: string) => {
    navigate(`/staff/${registrationId}`);
  }, [navigate]);

  // 검색 기능
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);


  // 승인 처리
  const handleApprove = useCallback(() => {
    if (!selectedRegistration) return;
    
    // 실제 구현에서는 API 호출이 필요합니다.
    setRegistrations(prev => 
      prev.filter(reg => reg.id !== selectedRegistration.id)
    );
    
    setApprovalDialogOpen(false);
    
    // 성공 메시지를 표시할 수 있습니다.
    alert(`${selectedRegistration.name} 직원의 가입이 승인되었습니다.`);
  }, [selectedRegistration]);

  // 거절 처리
  const handleReject = useCallback(() => {
    if (!selectedRegistration) return;
    
    // 실제 구현에서는 API 호출이 필요합니다.
    setRegistrations(prev => 
      prev.map(reg => 
        reg.id === selectedRegistration.id 
          ? { ...reg, status: 'rejected' as const } 
          : reg
      )
    );
    
    setApprovalDialogOpen(false);
    
    // 성공 메시지를 표시할 수 있습니다.
    alert(`${selectedRegistration.name} 직원의 가입이 거절되었습니다.`);
  }, [selectedRegistration]);

  // 검색 결과 필터링
  const filteredRegistrations = registrations.filter(reg => 
    reg.name.includes(searchQuery) || 
    reg.id.includes(searchQuery) ||
    reg.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center space-y-2 sm:space-y-0 gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="검색..."
              className="pl-8 w-full sm:w-[300px]"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>가입 요청 목록</CardTitle>
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
                    <TableHead>상태</TableHead>
                    <TableHead>가입 신청일</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRegistrations.length > 0 ? (
                    filteredRegistrations.map((registration, index) => (
                      <TableRow 
                        key={registration.id} 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleRowClick(registration.id)}
                      >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">{registration.name}</TableCell>
                        <TableCell>{registration.phone}</TableCell>
                        <TableCell>
                          <RegistrationStatusBadge status={registration.status} />
                        </TableCell>
                        <TableCell>{registration.registrationDate}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <Search className="h-10 w-10 mb-2" />
                          <p>검색 결과가 없습니다.</p>
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

      {/* 승인/거절 확인 다이얼로그 */}
      {selectedRegistration && (
        <Dialog open={approvalDialogOpen} onOpenChange={setApprovalDialogOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>직원 가입 승인 결정</DialogTitle>
              <DialogDescription>
                {selectedRegistration.name}님의 가입 신청을 승인하시겠습니까?
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex justify-end space-x-2 pt-6">
              <Button variant="destructive" onClick={handleReject}>
                <XCircle className="mr-2 h-4 w-4" />
                거절
              </Button>
              <Button variant="default" onClick={handleApprove}>
                <CheckCircle className="mr-2 h-4 w-4" />
                승인
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
});

RegistrationManagement.displayName = 'RegistrationManagement';
