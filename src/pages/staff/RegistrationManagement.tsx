import { useState, memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle, XCircle, Search, UserPlus, Phone, Calendar, ChevronRight, Clock } from "lucide-react";
import { registrationMockData, StaffRegistration } from "@/data/staff-mock-data";

// Mock data for registration
const RegistrationStatusBadge = memo<{ status: StaffRegistration['status'] }>(({ status }) => {
  switch (status) {
    case 'pending':
      return (
        <Badge className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 font-medium">
          <Clock className="w-3 h-3 mr-1" />
          승인대기
        </Badge>
      );
    case 'rejected':
      return (
        <Badge className="bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 font-medium">
          <XCircle className="w-3 h-3 mr-1" />
          거절
        </Badge>
      );
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

      <Card className="border-0 shadow-lg bg-white dark:bg-slate-900">
        <CardHeader className="border-b bg-slate-50/70 dark:bg-slate-800/20">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-1.5 rounded-md bg-blue-50 dark:bg-blue-900/20">
                <UserPlus className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              가입 요청 목록
              <Badge variant="secondary" className="ml-2">{filteredRegistrations.length}건</Badge>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredRegistrations.length > 0 ? (
              filteredRegistrations.map((registration, index) => (
                <div 
                  key={registration.id} 
                  className="group cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-all duration-200 p-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedRegistration(registration);
                    setApprovalDialogOpen(true);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium text-sm">
                          {index + 1}
                        </div>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${registration.name}`} />
                          <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                            {registration.name.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{registration.name}</h4>
                          <RegistrationStatusBadge status={registration.status} />
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {registration.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            신청일: {registration.approvalDate}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {registration.status === 'pending' && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRegistration(registration);
                              handleReject();
                            }}
                            className="hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            거절
                          </Button>
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRegistration(registration);
                              handleApprove();
                            }}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            승인
                          </Button>
                        </>
                      )}
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <Search className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">검색 결과가 없습니다</h3>
                  <p className="text-sm">다른 검색어를 입력해 보세요.</p>
                </div>
              </div>
            )}
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
