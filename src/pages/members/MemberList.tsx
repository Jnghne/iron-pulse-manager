
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  Filter,
  Download,
  MoreHorizontal,
  CalendarClock,
  User
} from "lucide-react";
import { mockMembers, Member } from "@/data/mockData";
import { mockProducts } from "@/data/mockProducts";
import { Product, ProductType } from "@/types/product";
import { formatDate, formatPhoneNumber } from "@/lib/utils";
import { differenceInDays, parseISO, isValid } from "date-fns";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const ITEMS_PER_PAGE = 10;

const MemberList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMembers, setFilteredMembers] = useState<Member[]>(mockMembers);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [membershipFilter, setMembershipFilter] = useState<string>("all");
  const navigate = useNavigate();
  
  // Filter members based on search query and filters
  useEffect(() => {
    let filtered = [...mockMembers];
    
    // 검색어 필터링
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
        return status === statusFilter;
      });
    }
    
    // 회원권 유형 필터링
    if (membershipFilter !== "all") {
      filtered = filtered.filter(member => {
        if (membershipFilter === "membership" && member.membershipActive) return true;
        if (membershipFilter === "pt" && member.hasPT) return true;
        if (membershipFilter === "locker" && member.lockerId) return true;
        return false;
      });
    }
    
    setFilteredMembers(filtered);
    setCurrentPage(1); // 필터링 시 첫 페이지로 이동
  }, [searchQuery, statusFilter, membershipFilter]);  

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

  // 통계 계산
  const totalMembers = mockMembers.length;
  const activeMembers = mockMembers.filter(m => getMembershipStatus(m) === "active").length;
  const expiringMembers = mockMembers.filter(m => getMembershipStatus(m) === "expiring").length;
  const expiredMembers = mockMembers.filter(m => getMembershipStatus(m) === "expired").length;

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
            
            <div className="flex flex-row gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="회원권 상태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 상태</SelectItem>
                  <SelectItem value="active">활성</SelectItem>
                  <SelectItem value="expiring">만료 임박</SelectItem>
                  <SelectItem value="expired">만료됨</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={membershipFilter} onValueChange={setMembershipFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="회원권 유형" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 유형</SelectItem>
                  <SelectItem value="membership">회원권</SelectItem>
                  <SelectItem value="pt">PT 이용권</SelectItem>
                  <SelectItem value="locker">락커 이용</SelectItem>
                </SelectContent>
              </Select>
              
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
                        
                        {/* 회원 구분 (PT, 헬스장, PT&헬스장) */}
                        <TableCell className="text-center pl-4">
                          <div className="flex flex-row flex-wrap gap-1 items-center justify-center">
                            {(() => {
                              const badges: JSX.Element[] = [];

                              const hasActivePT = member.ptId && mockProducts.find(p => p.id === member.ptId && p.type === ProductType.PT && p.isActive);
                              if (hasActivePT) {
                                badges.push(
                                  <span key="pt" className={`px-2 py-1 text-xs bg-purple-50 text-purple-700 rounded-full font-medium`}>
                                    PT
                                  </span>
                                );
                              }

                              const hasActiveMembership = member.membershipId && mockProducts.find(p => p.id === member.membershipId && p.type === ProductType.MEMBERSHIP && p.isActive);
                              if (hasActiveMembership) {
                                badges.push(
                                  <span key="membership" className={`px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full font-medium`}>
                                    헬스
                                  </span>
                                );
                              }

                              // 락커 뱃지 관련 로직은 여기에 포함하지 않음

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
                            <span className="text-sm">{formatDate(member.expiryDate || '')}</span>
                            {member.ptRemaining !== undefined && member.ptExpiryDate && (
                              <span className="text-xs text-muted-foreground">PT: {formatDate(member.ptExpiryDate)}</span>
                            )}
                          </div>
                        </TableCell>
                        
                        {/* 회원 상태 */}
                        <TableCell className="text-center">
                          {(() => {
                            const status = getMembershipStatus(member);
                            if (status === "active") {
                              return (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                  <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                                  활성
                                </span>
                              );
                            }
                            if (status === "expiring") {
                              return (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-600"></span>
                                  만료임박
                                </span>
                              );
                            }
                            return (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                <span className="h-1.5 w-1.5 rounded-full bg-gray-600"></span>
                                만료
                              </span>
                            );
                          })()}
                          {member.hasPT && member.ptRemaining !== undefined && (
                            <div className="mt-1 text-xs text-muted-foreground">
                              PT {member.ptRemaining}회 남음
                            </div>
                          )}
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
