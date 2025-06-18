import { useState, memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle, XCircle, Search, UserPlus, Phone, Calendar, ChevronRight, Clock, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'rejected'>('all');
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
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
    
    setDetailDialogOpen(false);
    setSelectedRegistration(null);
    
    // 성공 메시지를 표시할 수 있습니다.
    alert(`${selectedRegistration.name} 직원의 가입이 승인되었습니다.`);
  }, [selectedRegistration]);

  // 거절 처리
  const handleReject = useCallback(() => {
    if (!selectedRegistration) return;
    
    // 현재 날짜를 거절일자로 설정
    const rejectedDate = new Date().toISOString().split('T')[0];
    
    // 실제 구현에서는 API 호출이 필요합니다.
    setRegistrations(prev => 
      prev.map(reg => 
        reg.id === selectedRegistration.id 
          ? { ...reg, status: 'rejected' as const, rejectedDate } 
          : reg
      )
    );
    
    setDetailDialogOpen(false);
    setSelectedRegistration(null);
    
    // 성공 메시지를 표시할 수 있습니다.
    alert(`${selectedRegistration.name} 직원의 가입이 거절되었습니다.`);
  }, [selectedRegistration]);

  // 검색 및 상태 필터링
  const filteredRegistrations = registrations.filter(reg => {
    // 상태 필터링 먼저 적용
    if (statusFilter !== 'all' && reg.status !== statusFilter) {
      return false;
    }
    
    // 검색어가 비어있으면 상태 필터링만 적용
    if (!searchQuery || searchQuery.trim() === '') {
      return true;
    }
    
    // 검색어 필터링 (이름, 핸드폰번호)
    const query = searchQuery.trim().toLowerCase();
    const nameMatch = reg.name.toLowerCase().includes(query);
    
    // 핸드폰번호 검색 (숙자만 추출해서 비교)
    const phoneDigits = reg.phone.replace(/[^0-9]/g, '');
    const searchDigits = searchQuery.replace(/[^0-9]/g, '');
    const phoneMatch = searchDigits.length > 0 && phoneDigits.includes(searchDigits);
    
    return nameMatch || phoneMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center space-y-2 sm:space-y-0 gap-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
          {/* 검색 입력 */}
          <div className="relative max-w-sm flex-shrink-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="이름 또는 핸드폰번호로 검색..."
              className="pl-8 w-full min-w-[280px]"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        
        {/* 상태 필터 - 오른쪽으로 이동 */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={(value: 'all' | 'pending' | 'rejected') => setStatusFilter(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="pending">승인대기</SelectItem>
              <SelectItem value="rejected">거절</SelectItem>
            </SelectContent>
          </Select>
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
                  onClick={() => {
                    setSelectedRegistration(registration);
                    setDetailDialogOpen(true);
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
                    
                    <div className="flex items-center">
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

      {/* 가입요청 상세 다이얼로그 */}
      {selectedRegistration && (
        <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
          <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedRegistration.name}`} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 font-medium text-lg">
                    {selectedRegistration.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedRegistration.name}</h3>
                  <RegistrationStatusBadge status={selectedRegistration.status} />
                </div>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* 기본 정보 */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">기본 정보</h4>
                <div className="grid grid-cols-1 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">핸드폰 번호:</span>
                    <span className="font-medium">{selectedRegistration.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">이메일:</span>
                    <span className="font-medium">{selectedRegistration.email}</span>
                  </div>
                  {selectedRegistration.position && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">직책:</span>
                      <span className="font-medium">{selectedRegistration.position}</span>
                    </div>
                  )}
                  {selectedRegistration.address && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">주소:</span>
                      <span className="font-medium">{selectedRegistration.address}</span>
                    </div>
                  )}
                  {selectedRegistration.account && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">계좌정보:</span>
                      <span className="font-medium">{selectedRegistration.account}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">신청일자:</span>
                    <span className="font-medium">{selectedRegistration.approvalDate}</span>
                  </div>
                  {selectedRegistration.status === 'rejected' && selectedRegistration.rejectedDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">거절일자:</span>
                      <span className="font-medium text-red-600">{selectedRegistration.rejectedDate}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* 승인/거절 버튼 - 승인대기 상태일 때만 표시 */}
              {selectedRegistration.status === 'pending' && (
                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button variant="outline" onClick={handleReject} className="hover:bg-red-50 hover:border-red-300 hover:text-red-600">
                    <XCircle className="mr-2 h-4 w-4" />
                    거절
                  </Button>
                  <Button onClick={handleApprove} className="bg-blue-600 hover:bg-blue-700">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    승인
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
});

RegistrationManagement.displayName = 'RegistrationManagement';
