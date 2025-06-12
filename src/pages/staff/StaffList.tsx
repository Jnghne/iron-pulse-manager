import { useState, memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { staffMockData, Staff } from "@/data/staff-mock-data";


const StaffStatusBadge = memo<{ status: Staff['status'] }>(({ status }) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">정상</Badge>;
    case 'leave':
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">휴직</Badge>;
    case 'resigned':
      return <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-200">퇴사</Badge>;
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

      <Card>
        <CardHeader>
          <CardTitle>직원 목록</CardTitle>
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
                    <TableHead>담당 회원</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>가입일</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff.length > 0 ? (
                    filteredStaff.map((staff, index) => (
                      <TableRow 
                        key={staff.id} 
                        className="cursor-pointer hover:bg-muted/50" 
                        onClick={() => handleRowClick(staff.id)}
                      >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">{staff.name}</TableCell>
                        <TableCell>{staff.phone}</TableCell>
                        <TableCell>{staff.memberCount}명</TableCell>
                        <TableCell>
                          <StaffStatusBadge status={staff.status} />
                        </TableCell>
                        <TableCell>{staff.approvalDate}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <Search className="h-10 w-10 mb-2" />
                          <p>검색 결과가 없습니다.</p>
                          <p className="text-sm">다른 검색어를 입력하거나 직원을 추가해 보세요.</p>
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
    </div>
  );
});

StaffList.displayName = 'StaffList';
