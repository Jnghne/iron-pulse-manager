import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Calendar, Dumbbell, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import MemberDetail from "./members/MemberDetail";
import { mockMembers, Member } from "@/data/mockData";

// 현재 트레이너가 담당하는 회원들만 필터링
const currentTrainer = "박지훈"; // 실제 구현시 로그인한 트레이너 정보로 대체
const trainerMembers = mockMembers.filter(member => member.trainerAssigned === currentTrainer);

// 트레이너 대시보드 데이터 계산
const trainerData = {
  totalMembers: trainerMembers.length,
  totalRemainingPT: trainerMembers.reduce((sum, member) => sum + (member.ptRemaining || 0), 0),
  todayScheduledPT: 8, // 실제 구현시 API로 대체
  todayScheduledConsultations: 3, // 실제 구현시 API로 대체
  members: trainerMembers.map(member => {
    let remainingGymDays = 0;
    if (member.membershipEndDate) {
      const diff = Math.ceil((new Date(member.membershipEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      remainingGymDays = diff > 0 ? diff : 0;
    }
    return {
      id: member.id,
      memberNumber: member.id,
      name: member.name,
      attendanceRate: member.attendanceRate,
      remainingPT: member.ptRemaining || 0,
      remainingGymDays,
    };
  })
};

const TrainerDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

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
      member.memberNumber.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const direction = sortDirection === "asc" ? 1 : -1;
      if (sortField === "name") {
        return direction * a.name.localeCompare(b.name);
      }
      if (sortField === "memberNumber") {
        return direction * a.memberNumber.localeCompare(b.memberNumber);
      }
      const aValue = a[sortField as keyof typeof a] as number;
      const bValue = b[sortField as keyof typeof b] as number;
      return direction * (aValue - bValue);
    });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gym-primary to-gym-accent bg-clip-text text-transparent">트레이너 대시보드</h1>
        <p className="text-muted-foreground text-sm">최종 업데이트: {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

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

      {/* 회원 목록 */}
      <Card className="border-none shadow-md hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-lg font-semibold">회원 목록</CardTitle>
              <CardDescription>관리 중인 회원들의 상세 정보</CardDescription>
            </div>
            <div className="flex gap-4 w-full sm:w-auto">
              <Input
                placeholder="회원명 또는 회원번호로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs"
              />
              <Select value={sortField} onValueChange={setSortField}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="정렬 기준" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="memberNumber">회원번호</SelectItem>
                  <SelectItem value="name">이름</SelectItem>
                  <SelectItem value="attendanceRate">출석률</SelectItem>
                  <SelectItem value="remainingPT">남은 PT</SelectItem>
                  <SelectItem value="remainingGymDays">잔여 헬스권</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => handleSort("memberNumber")}>
                  회원번호 {sortField === "memberNumber" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                  회원명 {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("attendanceRate")}>
                  출석률 {sortField === "attendanceRate" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("remainingPT")}>
                  남은 PT {sortField === "remainingPT" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("remainingGymDays")}>
                  잔여 헬스권 {sortField === "remainingGymDays" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedMembers.map((member) => (
                <TableRow 
                  key={member.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedMemberId(member.memberNumber)}
                >
                  <TableCell>{member.memberNumber}</TableCell>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.attendanceRate}%</TableCell>
                  <TableCell>{member.remainingPT}회</TableCell>
                  <TableCell>{member.remainingGymDays}일</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 회원 상세 정보 다이얼로그 */}
      <Dialog open={selectedMemberId !== null} onOpenChange={() => setSelectedMemberId(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedMemberId && <MemberDetail id={selectedMemberId} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrainerDashboard; 