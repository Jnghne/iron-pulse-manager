import { useState, memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Search, Users, Phone, Calendar, ChevronRight } from "lucide-react";
import { staffMockData, Staff } from "@/data/staff-mock-data";


const StaffStatusBadge = memo<{ status: Staff['status'] }>(({ status }) => {
  switch (status) {
    case 'active':
      return (
        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 font-medium">
          <div className="w-2 h-2 bg-emerald-500 rounded-full mr-1.5"></div>
          정상
        </Badge>
      );
    case 'leave':
      return (
        <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 font-medium">
          <div className="w-2 h-2 bg-amber-500 rounded-full mr-1.5"></div>
          휴직
        </Badge>
      );
    case 'resigned':
      return (
        <Badge className="bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 font-medium">
          <div className="w-2 h-2 bg-rose-500 rounded-full mr-1.5"></div>
          퇴사
        </Badge>
      );
    default:
      return null;
  }
});

StaffStatusBadge.displayName = 'StaffStatusBadge';

export const StaffList = memo(() => {
  const navigate = useNavigate();
  const [staffs, setStaffs] = useState<Staff[]>(staffMockData);
  const [searchQuery, setSearchQuery] = useState("");

  // 직원 상세 페이지로 이동
  const handleRowClick = useCallback((staffId: string) => {
    navigate(`/staff/${staffId}`);
  }, [navigate]);

  // 검색 기능
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  // 검색 결과 필터링
  const filteredStaff = staffs.filter(staff => 
    staff.name.includes(searchQuery) || 
    staff.id.includes(searchQuery) ||
    staff.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center space-y-2 sm:space-y-0 gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="직원 검색..."
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
                <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              직원 목록
              <Badge variant="secondary" className="ml-2">{filteredStaff.length}명</Badge>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredStaff.length > 0 ? (
              filteredStaff.map((staff, index) => (
                <div 
                  key={staff.id} 
                  className="group cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-all duration-200 p-4"
                  onClick={() => handleRowClick(staff.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium text-sm">
                          {index + 1}
                        </div>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${staff.name}`} />
                          <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                            {staff.name.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{staff.name}</h4>
                          <StaffStatusBadge status={staff.status} />
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {staff.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            담당 {staff.memberCount}명
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {staff.approvalDate}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
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
                  <p className="text-sm">다른 검색어를 입력하거나 직원을 추가해 보세요.</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

StaffList.displayName = 'StaffList';
