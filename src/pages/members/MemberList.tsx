
import { useState, useEffect, useCallback, useMemo } from "react";
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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  UserPlus, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Users,
  UserCheck,
  Clock,
  Download,
  MoreHorizontal,
  CalendarClock
} from "lucide-react";
import { mockMembers, Member } from "@/data/mockData";
import { formatDate } from "@/lib/utils";
import { differenceInDays, parseISO, isValid } from "date-fns";
import { FilterPopover, MemberStatus, MemberType, SortOption } from "@/components/features/filter/FilterPopover";

const ITEMS_PER_PAGE = 10;

const MemberList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMembers, setFilteredMembers] = useState<Member[]>(mockMembers);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<MemberStatus>("all");
  const [membershipFilter, setMembershipFilter] = useState<MemberType>("all");
  const [sortFilter, setSortFilter] = useState<SortOption>("name");
  const navigate = useNavigate();
  
  // 회원 상태 판별 함수 (active, expired 만 존재)
  const getMembershipStatus = useCallback((member: Member) => {
    // 회원권이 비활성화되었거나 만료일이 지난 경우
    if (!member.membershipActive) return "expired";
    
    // 만료일 확인
    if (member.membershipEndDate || member.expiryDate) {
      try {
        // membershipEndDate나 expiryDate 중 존재하는 것 사용
        const dateStr = member.membershipEndDate || member.expiryDate;
        if (!dateStr) return "active";
        
        const endDate = parseISO(dateStr);
        if (isValid(endDate)) {
          const today = new Date();
          const daysLeft = differenceInDays(endDate, today);
          
          // 만료일이 지난 경우
          if (daysLeft < 0) {
            return "expired";
          }
        }
      } catch (error) {
        console.error("날짜 파싱 오류:", error);
      }
    }
    
    return "active";
  }, []);
  
  // 만료 임박 여부 확인 함수 (만료일이 30일 이하로 남은 활성 회원)
  const isExpirationImminent = useCallback((member: Member) => {
    if (getMembershipStatus(member) !== "active") return false;
    
    if (member.membershipEndDate || member.expiryDate) {
      try {
        const dateStr = member.membershipEndDate || member.expiryDate;
        if (!dateStr) return false;
        
        const endDate = parseISO(dateStr);
        if (isValid(endDate)) {
          const today = new Date();
          const daysLeft = differenceInDays(endDate, today);
          
          // 만료일이 30일 이하로 남은 경우
          return daysLeft <= 30 && daysLeft >= 0;
        }
      } catch (error) {
        console.error("날짜 파싱 오류:", error);
      }
    }
    
    return false;
  }, [getMembershipStatus]);
  
  // Filter members based on search query and filters
  useEffect(() => {
    let filtered = [...mockMembers];
    
    // 검색 필터링
    if (searchQuery.trim()) {
      const lowercaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (member) =>
          member.name.toLowerCase().includes(lowercaseQuery) ||
          member.id.includes(lowercaseQuery) ||
          member.phoneNumber.replace(/-/g, "").includes(lowercaseQuery.replace(/-/g, ""))
      );
    }
    
    // 회원권 상태 필터링
    if (statusFilter !== "all") {
      filtered = filtered.filter(member => {
        const status = getMembershipStatus(member);
        const isImminent = isExpirationImminent(member);
        
        if (statusFilter === "active" && status === "active" && !isImminent) return true;
        if (statusFilter === "expired" && status === "expired") return true;
        if (statusFilter === "pending" && status === "active" && isImminent) return true;
        return false;
      });
    }
    
    // 회원권 유형 필터링
    if (membershipFilter !== "all") {
      filtered = filtered.filter(member => {
        if (membershipFilter === "regular" && member.memberType.includes("정회원")) return true;
        if (membershipFilter === "lesson" && member.hasLesson) return true;
        if (membershipFilter === "vip" && member.memberType.includes("VIP")) return true;
        if (membershipFilter === "student" && member.memberType.includes("학생")) return true;
        return false;
      });
    }
    
    // 정렬 적용
    filtered.sort((a, b) => {
      switch (sortFilter) {
        case "name":
          return a.name.localeCompare(b.name);
        case "registrationDate":
          return new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime();
        case "expiryDate": {
          const aExpiryDate: number = a.expiryDate ? new Date(a.expiryDate).getTime() : Infinity;
          const bExpiryDate: number = b.expiryDate ? new Date(b.expiryDate).getTime() : Infinity;
          return aExpiryDate - bExpiryDate;
        }
        case "attendanceRate":
          return b.attendanceRate - a.attendanceRate;
        case "membershipStatus": {
          const aStatus = getMembershipStatus(a);
          const bStatus = getMembershipStatus(b);
          const aImminentStatus = isExpirationImminent(a);
          const bImminentStatus = isExpirationImminent(b);
          
          // 우선순위: active (만료 임박 아님) > active (만료 임박) > expired
          const getStatusPriority = (status: string, isImminent: boolean) => {
            if (status === "active" && !isImminent) return 1;
            if (status === "active" && isImminent) return 2;
            if (status === "expired") return 3;
            return 4;
          };
          
          return getStatusPriority(aStatus, aImminentStatus) - getStatusPriority(bStatus, bImminentStatus);
        }
        default:
          return 0;
      }
    });

    setFilteredMembers(filtered);
    setCurrentPage(1); // 필터링 시 첫 페이지로 이동
  }, [searchQuery, statusFilter, membershipFilter, sortFilter, getMembershipStatus, isExpirationImminent]);  

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
  // 통계 계산
  const totalMembers = useMemo(() => mockMembers.length, []);
  const activeMembers = useMemo(() => mockMembers.filter(m => getMembershipStatus(m) === "active").length, [getMembershipStatus]);
  const expiringMembers = useMemo(() => mockMembers.filter(m => isExpirationImminent(m)).length, [isExpirationImminent]);
  const expiredMembers = useMemo(() => mockMembers.filter(m => getMembershipStatus(m) === "expired").length, [getMembershipStatus]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4">
        <Button 
          className="w-full sm:w-auto bg-gym-primary hover:bg-gym-primary/90"
          onClick={() => navigate("/members/new")}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          신규 회원 등록
        </Button>
      </div>
      
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">전체 회원</p>
                <h3 className="text-2xl font-bold mt-1">{totalMembers}명</h3>
              </div>
              <div className="p-2 bg-blue-50 rounded-full">
                <Users className="h-5 w-5 text-gym-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">활성 회원</p>
                <h3 className="text-2xl font-bold mt-1">{activeMembers}명</h3>
              </div>
              <div className="p-2 bg-green-50 rounded-full">
                <UserCheck className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">만료 임박</p>
                <h3 className="text-2xl font-bold mt-1">{expiringMembers}명</h3>
              </div>
              <div className="p-2 bg-yellow-50 rounded-full">
                <Clock className="h-5 w-5 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">만료된 회원</p>
                <h3 className="text-2xl font-bold mt-1">{expiredMembers}명</h3>
              </div>
              <div className="p-2 bg-gray-100 rounded-full">
                <CalendarClock className="h-5 w-5 text-gray-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent className="pt-6 space-y-4">
          {/* 검색 및 필터 영역 */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="회원 번호, 이름, 연락처로 검색..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-row gap-2 flex-wrap">
              <FilterPopover 
                onFilterChange={(filters) => {
                  setStatusFilter(filters.status);
                  setMembershipFilter(filters.type);
                  setSortFilter(filters.sort);
                }}
              />
              
              <Button variant="outline" size="icon" title="엑셀 다운로드">
                <Download className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="icon" title="추가 옵션">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="rounded-md border overflow-hidden">
            <div className="relative w-full overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px] text-center pl-10">회원정보</TableHead>
                    <TableHead className="text-center pl-4">회원구분</TableHead>
                    <TableHead className="text-center pl-4">등록일</TableHead>
                    <TableHead className="text-center">만료일</TableHead>
                    <TableHead className="text-center">회원상태</TableHead>
                    <TableHead className="text-center pr-4">출석률</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentMembers.length > 0 ? (
                    currentMembers.map((member) => (
                      <TableRow 
                        key={member.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleRowClick(member.id)}
                      >
                        {/* 회원 정보 (프로필 사진, 이름, 회원번호) */}
                        <TableCell className="w-[150px] pl-10">
                          <div className="flex items-center space-x-3">
                            {/* 프로필 사진 */}
                            <div>
                              {member.photoUrl ? (
                                <img 
                                  src={member.photoUrl} 
                                  alt={`${member.name} 프로필`} 
                                  className="h-10 w-10 rounded-full object-cover border border-gray-200"
                                />
                              ) : (
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white bg-gym-primary`}>
                                  {member.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            {/* 이름 */}
                            <div className="flex flex-col">
                              <span className="font-medium">{member.name}</span>
                            </div>
                          </div>
                        </TableCell>
                        
                        {/* 회원 구분 (개인레슨, 헬스장, 개인레슨&헬스장) */}
                        <TableCell className="text-center pl-4">
                          <div className="flex flex-row flex-wrap gap-1 items-center justify-center">
                            {(() => {
                              const badges: JSX.Element[] = [];

                              // 개인레슨 이용권 확인 (간단한 방식)
                              if (member.hasLesson) {
                                badges.push(
                                  <span key="lesson" className={`px-2 py-1 text-xs bg-purple-50 text-purple-700 rounded-full font-medium`}>
                                    개인레슨
                                  </span>
                                );
                              }

                              // 헬스 회원권 확인 (간단한 방식)
                              if (member.membershipActive) {
                                badges.push(
                                  <span key="membership" className={`px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full font-medium`}>
                                    헬스
                                  </span>
                                );
                              }

                              if (badges.length === 0) {
                                return (
                                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full font-medium">
                                    없음
                                  </span>
                                );
                              }
                              return badges;
                            })()}
                          </div>
                        </TableCell>
                        
                        {/* 등록일 */}
                        <TableCell className="text-center pl-4">
                          <div className="flex flex-col items-center">
                            <span className="text-sm">{formatDate(member.registrationDate)}</span>
                            {member.membershipStartDate && (
                              <span className="text-xs text-muted-foreground">시작: {formatDate(member.membershipStartDate)}</span>
                            )}
                          </div>
                        </TableCell>
                        
                        {/* 만료일 */}
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center">
                            {member.expiryDate ? (
                              <>
                                <span className="text-sm">{formatDate(member.expiryDate)}</span>
                                {(() => {
                                  const daysLeft = differenceInDays(parseISO(member.expiryDate), new Date());
                                  if (daysLeft >= 0) {
                                    return (
                                      <span className={`text-xs ${daysLeft <= 7 ? 'text-red-500' : daysLeft <= 30 ? 'text-yellow-600' : 'text-muted-foreground'}`}>
                                        {daysLeft}일 남음
                                      </span>
                                    );
                                  } else {
                                    return (
                                      <span className="text-xs text-red-500">
                                        {Math.abs(daysLeft)}일 초과
                                      </span>
                                    );
                                  }
                                })()}
                              </>
                            ) : (
                              <span className="text-sm text-muted-foreground">-</span>
                            )}
                          </div>
                        </TableCell>
                        
                        {/* 회원 상태 */}
                        <TableCell className="text-center">
                          {(() => {
                            const status = getMembershipStatus(member);
                            const isImminent = isExpirationImminent(member);
                            
                            if (status === "active" && isImminent) {
                              return (
                                <Badge className="bg-yellow-100 text-yellow-800">
                                  <AlertTriangle className="mr-1 h-3 w-3" />
                                  만료 임박
                                </Badge>
                              );
                            } else if (status === "active") {
                              return (
                                <Badge className="bg-green-100 text-green-800">
                                  <CheckCircle className="mr-1 h-3 w-3" />
                                  활성
                                </Badge>
                              );
                            } else {
                              return (
                                <Badge variant="outline" className="text-gray-500 bg-gray-100">
                                  <XCircle className="mr-1 h-3 w-3" />
                                  만료
                                </Badge>
                              );
                            }
                          })()} 
                        </TableCell>
                        
                        {/* 출석률 */}
                        <TableCell className="text-center pr-4">
                          <div className="flex flex-col items-center gap-1">
                            <div className="w-20">
                              <div className="w-full bg-muted rounded-full h-2.5">
                                <div
                                  className="h-2.5 rounded-full bg-gym-primary"
                                  style={{ width: `${member.attendanceRate}%` }}
                                />
                              </div>
                            </div>
                            <span className="text-xs font-medium">{member.attendanceRate}%</span>
                          </div>
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
                  className={currentPage === pageNum ? "bg-gym-primary hover:bg-gym-primary/90" : ""}
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
