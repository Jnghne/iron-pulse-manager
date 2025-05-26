import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Calendar, Dumbbell, MessageSquare, User, Bell, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import MemberDetail from "./members/MemberDetail";
import { mockMembers, Member } from "@/data/mockData";
import { formatDate } from "@/lib/utils";
import { differenceInDays, parseISO, isValid, format } from "date-fns";

// 현재 트레이너가 담당하는 회원들만 필터링
const currentTrainer = "박지훈"; // 실제 구현시 로그인한 트레이너 정보로 대체
const trainerMembers = mockMembers.filter(member => member.trainerAssigned === currentTrainer);

// 트레이너 대시보드 데이터 계산
const trainerData = {
  totalMembers: trainerMembers.length,
  totalRemainingPT: trainerMembers.reduce((sum, member) => sum + (member.ptRemaining || 0), 0),
  todayScheduledPT: 8, // 실제 구현시 API로 대체
  todayScheduledConsultations: 3, // 실제 구현시 API로 대체
  members: trainerMembers
};

// 공지사항 목록 (실제 구현시 API로 대체)
const mockNotices = [
  {
    id: 1,
    title: "5월 트레이너 미팅 일정 안내",
    content: "5월 트레이너 미팅이 5월 30일 오후 6시에 진행됩니다. 참석 부탁드립니다.",
    date: "2025-05-25T10:00:00",
    author: "관리자",
    isImportant: true
  },
  {
    id: 2,
    title: "신규 PT 프로그램 안내",
    content: "신규 PT 프로그램이 6월부터 시작됩니다. 자세한 내용은 공지사항을 참고해주세요.",
    date: "2025-05-20T14:30:00",
    author: "관리자",
    isImportant: false
  },
  {
    id: 3,
    title: "헬스장 장비 점검 일정",
    content: "6월 1일부터 3일까지 헬스장 장비 점검이 있을 예정입니다. 해당 기간 동안 일부 장비 사용이 제한될 수 있습니다.",
    date: "2025-05-28T09:15:00",
    author: "시설관리자",
    isImportant: true
  },
  {
    id: 4,
    title: "회원 만족도 조사 안내",
    content: "6월 중 회원 만족도 조사가 진행될 예정입니다. 회원님들의 적극적인 참여를 부탁드립니다.",
    date: "2025-05-15T11:45:00",
    author: "관리자",
    isImportant: false
  },
  {
    id: 5,
    title: "새로운 그룹 피트니스 프로그램 오픈",
    content: "6월부터 새로운 그룹 피트니스 프로그램이 시작됩니다. 트레이너들은 관심 있는 회원들에게 안내해 주세요.",
    date: "2025-05-10T16:20:00",
    author: "프로그램 관리자",
    isImportant: true
  }
];

const TrainerDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [selectedNoticeId, setSelectedNoticeId] = useState<number | null>(null);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedMembers = trainerData.members
    .filter(member => 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.phoneNumber && member.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      const direction = sortDirection === "asc" ? 1 : -1;
      if (sortField === "name") {
        return direction * a.name.localeCompare(b.name);
      }
      if (sortField === "id") {
        return direction * a.id.localeCompare(b.id);
      }
      if (sortField === "registrationDate" || sortField === "membershipEndDate" || sortField === "ptExpireDate") {
        const aDate = a[sortField as keyof typeof a] ? new Date(a[sortField as keyof typeof a] as string).getTime() : 0;
        const bDate = b[sortField as keyof typeof b] ? new Date(b[sortField as keyof typeof b] as string).getTime() : 0;
        return direction * (aDate - bDate);
      }
      if (typeof a[sortField as keyof typeof a] === "boolean" && typeof b[sortField as keyof typeof b] === "boolean") {
        return direction * (a[sortField as keyof typeof a] === b[sortField as keyof typeof b] ? 0 : a[sortField as keyof typeof a] ? 1 : -1);
      }
      const aValue = a[sortField as keyof typeof a] as number;
      const bValue = b[sortField as keyof typeof b] as number;
      return direction * (aValue - bValue);
    });

  return (
    <div className="space-y-8">
      {/* 통계 카드 */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card className="overflow-hidden relative bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 border-none shadow-md hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-bl-3xl flex items-center justify-center">
            <Users className="h-6 w-6 text-gym-primary" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">총 PT 회원 수</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trainerData.totalMembers}명</div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden relative bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-gray-800 border-none shadow-md hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-bl-3xl flex items-center justify-center">
            <Dumbbell className="h-6 w-6 text-indigo-500" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">총 잔여 PT 횟수</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trainerData.totalRemainingPT}회</div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden relative bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-gray-800 border-none shadow-md hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 right-0 w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-bl-3xl flex items-center justify-center">
            <Calendar className="h-6 w-6 text-purple-500" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">오늘 예약된 PT</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trainerData.todayScheduledPT}회</div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden relative bg-gradient-to-br from-white to-pink-50 dark:from-gray-900 dark:to-gray-800 border-none shadow-md hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 right-0 w-16 h-16 bg-pink-100 dark:bg-pink-900/30 rounded-bl-3xl flex items-center justify-center">
            <MessageSquare className="h-6 w-6 text-pink-500" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">오늘 예약된 상담</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trainerData.todayScheduledConsultations}회</div>
          </CardContent>
        </Card>
      </div>

      {/* 대시보드 주요 컨텐츠 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 회원 목록 - 왼쪽 영역 */}
        <Card className="border-none shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex flex-row justify-between items-center">
              <div>
                <CardTitle className="text-lg font-semibold">회원 목록</CardTitle>
                <CardDescription>관리 중인 회원들의 상세 정보</CardDescription>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="회원명 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-32 h-8"
                />
                <Select value={sortField} onValueChange={setSortField}>
                  <SelectTrigger className="w-24 h-8">
                    <SelectValue placeholder="정렬" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">이름</SelectItem>
                    <SelectItem value="attendanceRate">출석률</SelectItem>
                    <SelectItem value="ptRemaining">남은 PT</SelectItem>
                    <SelectItem value="membershipDaysLeft">잔여 헬스권</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="max-h-[400px] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer text-center w-[150px] pl-10" onClick={() => handleSort("id")}>
                      회원정보 {sortField === "id" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead className="cursor-pointer text-center pl-4" onClick={() => handleSort("ptRemaining")}>
                      남은 PT {sortField === "ptRemaining" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead className="cursor-pointer text-center pl-4" onClick={() => handleSort("membershipDaysLeft")}>
                      잔여 헬스권 {sortField === "membershipDaysLeft" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead className="cursor-pointer text-center pr-4" onClick={() => handleSort("attendanceRate")}>
                      출석률 {sortField === "attendanceRate" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedMembers.map((member) => {
                    return (
                      <TableRow 
                        key={member.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedMemberId(member.id)}
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
                            {/* 이름 및 회원번호 */}
                            <div className="flex flex-col">
                              <span className="font-medium">{member.name}</span>
                              <span className="text-xs text-muted-foreground font-mono">{member.id}</span>
                            </div>
                          </div>
                        </TableCell>
                        
                        {/* 남은 PT */}
                        <TableCell className="text-center pl-4">
                          <div className="flex flex-col items-center">
                            <span className="text-sm font-medium">{member.ptRemaining || 0}회</span>
                            {member.ptExpireDate && (
                              <span className="text-xs text-muted-foreground">만료: {formatDate(member.ptExpireDate)}</span>
                            )}
                          </div>
                        </TableCell>
                        
                        {/* 잔여 헬스권 */}
                        <TableCell className="text-center pl-4">
                          <div className="flex flex-col items-center">
                            {member.membershipEndDate ? (
                              <>
                                <span className="text-sm font-medium">
                                  {isValid(parseISO(member.membershipEndDate)) ? 
                                    `${Math.max(0, differenceInDays(parseISO(member.membershipEndDate), new Date()))}일` : 
                                    "-"}
                                </span>
                                <span className="text-xs text-muted-foreground">만료: {formatDate(member.membershipEndDate)}</span>
                              </>
                            ) : (
                              <span className="text-sm">-</span>
                            )}
                          </div>
                        </TableCell>
                        
                        {/* 출석률 */}
                        <TableCell className="text-center pr-4">
                          <div className="flex flex-col items-center gap-1">
                            <div className="w-20">
                              <div className="w-full bg-muted rounded-full h-2.5">
                                <div 
                                  className="bg-gym-primary h-2.5 rounded-full" 
                                  style={{ width: `${member.attendanceRate || 0}%` }}
                                ></div>
                              </div>
                            </div>
                            <span className="text-xs font-medium">{member.attendanceRate || 0}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* 공지사항 - 오른쪽 영역 */}
        <Card className="border-none shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-gym-primary" />
                <CardTitle className="text-lg font-semibold">공지사항</CardTitle>
              </div>
              <Badge variant="outline" className="bg-gym-primary/10 text-gym-primary hover:bg-gym-primary/20">
                최근 업데이트
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[400px] overflow-auto">
              {selectedNoticeId ? (
                // 선택된 공지사항 상세 보기
                <div className="space-y-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center text-muted-foreground" 
                    onClick={() => setSelectedNoticeId(null)}
                  >
                    <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
                    목록으로 돌아가기
                  </Button>
                  
                  {mockNotices.filter(notice => notice.id === selectedNoticeId).map(notice => (
                    <div key={notice.id} className="space-y-3">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold">{notice.title}</h3>
                        {notice.isImportant && (
                          <Badge className="bg-red-100 text-red-700 hover:bg-red-200">중요</Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span className="font-medium">{notice.author}</span>
                        <span className="mx-2">|</span>
                        <span>{format(new Date(notice.date), 'yyyy년 MM월 dd일 HH:mm')}</span>
                      </div>
                      
                      <div className="bg-muted/50 p-4 rounded-md whitespace-pre-line">
                        {notice.content}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // 공지사항 목록
                mockNotices.map(notice => (
                  <div 
                    key={notice.id}
                    className="p-3 border rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedNoticeId(notice.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium flex items-center gap-2">
                        {notice.isImportant && (
                          <Badge className="bg-red-100 text-red-700 hover:bg-red-200">중요</Badge>
                        )}
                        {notice.title}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(notice.date), 'MM/dd')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{notice.content}</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 회원 상세 정보 모달 */}
      <Dialog open={selectedMemberId !== null} onOpenChange={(open) => !open && setSelectedMemberId(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
          {selectedMemberId && <MemberDetail id={selectedMemberId} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrainerDashboard;
