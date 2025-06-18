
import { memo, useState, useEffect, useMemo } from "react";
import { Users, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Member } from "../types";
import { membersMockData } from "@/data/staff-mock-data";

interface StaffMembersListProps {
  staffId: string;
}

export const StaffMembersList = memo<StaffMembersListProps>(({ staffId }) => {
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const staffMembers = membersMockData[staffId] || [];
    setAllMembers(staffMembers);
    setCurrentPage(1); // 직원 변경 시 첫 페이지로 리셋
    setSearchQuery(""); // 검색어 리셋
  }, [staffId]);

  // 검색 필터링된 회원 목록
  const filteredMembers = useMemo(() => {
    // 검색어가 없으면 전체 회원 반환
    if (!searchQuery || searchQuery.trim() === '') {
      return allMembers;
    }
    
    // 검색어로 이름 또는 전화번호 필터링
    const searchTerm = searchQuery.trim().toLowerCase();
    return allMembers.filter(member => {
      const nameMatch = member.name.toLowerCase().includes(searchTerm);
      const phoneDigits = member.phone.replace(/[^0-9]/g, '');
      const searchDigits = searchQuery.replace(/[^0-9]/g, '');
      const phoneMatch = searchDigits.length > 0 && phoneDigits.includes(searchDigits);
      
      return nameMatch || phoneMatch;
    });
  }, [allMembers, searchQuery]);

  // 페이징 처리된 회원 목록
  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredMembers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMembers, currentPage, itemsPerPage]);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);

  // 검색어 변경 시 첫 페이지로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 검색 초기화
  const handleSearchReset = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      {/* 검색 기능 */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="이름 또는 핸드폰번호로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-full"
            />
          </div>
          <div className="text-sm text-muted-foreground whitespace-nowrap">
            {searchQuery ? (
              <span>검색 결과: <strong>{filteredMembers.length}명</strong></span>
            ) : (
              <span>총 <strong>{allMembers.length}명</strong></span>
            )}
          </div>
        </div>
        {searchQuery && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleSearchReset}
          >
            검색 초기화
          </Button>
        )}
      </div>

      {/* 회원 목록 테이블 */}
      {filteredMembers.length > 0 ? (
        <>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No.</TableHead>
                  <TableHead>이름</TableHead>
                  <TableHead>연락처</TableHead>
                  <TableHead>이용권</TableHead>
                  <TableHead>시작일</TableHead>
                  <TableHead>종료일</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedMembers.map((member, index) => {
                  const actualIndex = (currentPage - 1) * itemsPerPage + index + 1;
                  return (
                    <TableRow key={member.id}>
                      <TableCell>{actualIndex}</TableCell>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.phone}</TableCell>
                      <TableCell>{member.membershipType}</TableCell>
                      <TableCell>{member.startDate}</TableCell>
                      <TableCell>{member.endDate}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                      className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => {
                    const page = i + 1;
                    const isCurrentPage = page === currentPage;
                    
                    // 5페이지 이하면 모든 페이지 표시
                    if (totalPages <= 5) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => handlePageChange(page)}
                            isActive={isCurrentPage}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                    
                    // 5페이지 초과시 축약 표시
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => handlePageChange(page)}
                            isActive={isCurrentPage}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                    
                    if ((page === currentPage - 2 && currentPage > 3) || (page === currentPage + 2 && currentPage < totalPages - 2)) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    
                    return null;
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                      className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
          <Users className="h-10 w-10 mb-2" />
          {searchQuery ? (
            <>
              <p>검색 결과가 없습니다.</p>
              <p className="text-sm mt-1">다른 검색어를 입력해보세요.</p>
            </>
          ) : (
            <p>담당 회원이 없습니다.</p>
          )}
        </div>
      )}
    </div>
  );
});

StaffMembersList.displayName = 'StaffMembersList';
