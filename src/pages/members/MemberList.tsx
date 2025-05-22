import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, ChevronLeft, ChevronRight, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { mockMembers, Member } from "@/data/mockData";
import { formatDate, formatPhoneNumber } from "@/lib/utils";
import { differenceInDays, parseISO, isValid } from "date-fns";

const ITEMS_PER_PAGE = 10;

const MemberList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMembers, setFilteredMembers] = useState<Member[]>(mockMembers);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  
  // Filter members based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredMembers(mockMembers);
      return;
    }
    
    const lowercaseQuery = searchQuery.toLowerCase();
    const filtered = mockMembers.filter(
      (member) =>
        member.name.toLowerCase().includes(lowercaseQuery) ||
        member.id.includes(lowercaseQuery) ||
        member.phoneNumber.replace(/-/g, "").includes(lowercaseQuery.replace(/-/g, ""))
    );
    
    setFilteredMembers(filtered);
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  }, [searchQuery]);

  const handleRowClick = (memberId: string) => {
    navigate(`/members/${memberId}`);
  };

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentMembers = filteredMembers.slice(startIndex, endIndex);

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 페이지 번호 배열 생성
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pageNumbers.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pageNumbers.push(i);
        }
      }
    }
    
    return pageNumbers;
  };
  
  // 회원권 상태 판별 함수
  const getMembershipStatus = (member: Member) => {
    if (!member.membershipActive) return "expired";
    if (member.membershipEndDate) {
      const endDate = parseISO(member.membershipEndDate);
      if (isValid(endDate)) {
        const daysLeft = differenceInDays(endDate, new Date());
        if (daysLeft <= 7 && daysLeft >= 0) return "expiring";
      }
    }
    return "active";
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button 
          className="w-full sm:w-auto bg-gym-primary hover:bg-gym-secondary"
          onClick={() => navigate("/members/new")}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          신규 회원 등록
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          {/* <CardTitle>회원 목록</CardTitle> */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="회원 번호, 이름, 연락처로 검색..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <div className="relative w-full overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">회원 번호</TableHead>
                    <TableHead className="text-center">이름</TableHead>
                    <TableHead className="text-center">연락처</TableHead>
                    <TableHead className="text-center">등록일</TableHead>
                    <TableHead className="text-center">출석률</TableHead>
                    <TableHead className="text-center">회원권 상태</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentMembers.length > 0 ? (
                    currentMembers.map((member) => (
                      <TableRow 
                        key={member.id}
                        onClick={() => handleRowClick(member.id)}
                        className="cursor-pointer"
                      >
                        <TableCell className="text-center font-mono font-medium">
                          {member.id}
                        </TableCell>
                        <TableCell className="text-center">{member.name}</TableCell>
                        <TableCell className="text-center">{formatPhoneNumber(member.phoneNumber)}</TableCell>
                        <TableCell className="text-center">{formatDate(member.registrationDate)}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center gap-1">
                            <div className="w-20">
                              <div className="w-full bg-muted rounded-full h-2.5">
                                <div
                                  className={`
                                    h-2.5 rounded-full transition-all
                                    ${member.attendanceRate >= 70
                                      ? 'bg-primary/30'
                                      : member.attendanceRate >= 50
                                        ? 'bg-yellow-200'
                                        : 'bg-red-200'
                                    }
                                  `}
                                  style={{ width: `${member.attendanceRate}%` }}
                                />
                              </div>
                            </div>
                            <span className="text-xs font-semibold text-muted-foreground">{member.attendanceRate}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {(() => {
                            const status = getMembershipStatus(member);
                            if (status === "active") {
                              return (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary shadow-sm">
                                  <CheckCircle className="w-4 h-4 text-primary" />
                                  활성
                                </span>
                              );
                            }
                            if (status === "expiring") {
                              return (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 shadow-sm">
                                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                                  만료임박
                                </span>
                              );
                            }
                            return (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground shadow-sm">
                                <XCircle className="w-4 h-4 text-muted-foreground" />
                                만료
                              </span>
                            );
                          })()}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <Search className="h-10 w-10 mb-2" />
                          <p>검색 결과가 없습니다.</p>
                          <p className="text-sm">다른 검색어를 입력해보세요.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {getPageNumbers().map((pageNum) => (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNum)}
                  className={currentPage === pageNum ? "bg-gym-primary hover:bg-gym-secondary" : ""}
                >
                  {pageNum}
                </Button>
              ))}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
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

export default MemberList;
