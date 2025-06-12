
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Users, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { StaffData } from '../types/statistics';
import { useState, useEffect } from 'react';

interface StaffStatsProps {
  staffData: StaffData[];
}

export const StaffStats = ({ staffData }: StaffStatsProps) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filteredData, setFilteredData] = useState<StaffData[]>(staffData);
  const itemsPerPage = 5;

  useEffect(() => {
    const filtered = staffData.filter(staff => 
      staff.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  }, [searchTerm, staffData]);

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredData.length);
  const currentItems = filteredData.slice(startIndex, endIndex);

  // 페이지 변경 핸들러
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  return (
    <div className="space-y-8">
      <Card className="shadow-xl border bg-white dark:bg-slate-900 overflow-hidden">
        <CardHeader className="bg-slate-50/70 dark:bg-slate-800/20 border-b">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/50">
              <Users className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            직원 실적
          </CardTitle>
          <CardDescription className="text-base">직원별 PT 수업 및 매출 현황</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 bg-white dark:bg-slate-900">
          <div className="mb-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="직원 이름으로 검색"
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              총 {filteredData.length}명의 직원 중 {startIndex + 1}-{endIndex}명 표시
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead className="font-semibold text-center">직원명</TableHead>
                  <TableHead className="text-center font-semibold">PT 수업 수</TableHead>
                  <TableHead className="text-center font-semibold">매출</TableHead>
                  <TableHead className="text-center font-semibold">신규 회원</TableHead>
                  <TableHead className="text-center font-semibold">회원 유지율</TableHead>
                  <TableHead className="text-center font-semibold">상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.map((staff) => (
                  <TableRow key={staff.name} className="border-border/50 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                    <TableCell className="font-semibold text-center">{staff.name}</TableCell>
                    <TableCell className="text-center font-medium">{staff.pt}회</TableCell>
                    <TableCell className="text-center font-semibold text-green-600 dark:text-green-400">
                      {staff.revenue.toLocaleString()}원
                    </TableCell>
                    <TableCell className="text-center font-medium">{staff.newMembers}명</TableCell>
                    <TableCell className="text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        staff.retentionRate >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                        staff.retentionRate >= 75 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {staff.retentionRate}%
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant={staff.status === '정상' ? 'default' : staff.status === '휴직' ? 'secondary' : 'destructive'}
                        className="font-semibold"
                      >
                        {staff.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-6">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="이전 페이지"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // 표시할 페이지 번호 계산 (최대 5개)
                let pageNum;
                if (totalPages <= 5) {
                  // 전체 페이지가 5개 이하면 모두 표시
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  // 현재 페이지가 1~3이면 1~5 표시
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  // 현재 페이지가 마지막에 가까우면 마지막 5개 표시
                  pageNum = totalPages - 4 + i;
                } else {
                  // 그 외의 경우 현재 페이지 중심으로 표시
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="icon"
                    onClick={() => handlePageChange(pageNum)}
                    aria-label={`${pageNum} 페이지로 이동`}
                    className="w-8 h-8"
                  >
                    {pageNum}
                  </Button>
                );
              })}
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="다음 페이지"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
