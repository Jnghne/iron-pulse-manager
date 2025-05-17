
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
import { Search, Plus, UserPlus } from "lucide-react";
import { mockMembers, Member } from "@/data/mockData";
import { formatDate, formatPhoneNumber } from "@/lib/utils";

const MemberList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMembers, setFilteredMembers] = useState<Member[]>(mockMembers);
  
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
  }, [searchQuery]);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">회원 관리</h1>
          <p className="text-muted-foreground">헬스장 회원 목록을 조회하고 관리하세요.</p>
        </div>
        <Link to="/members/new">
          <Button className="w-full sm:w-auto bg-gym-primary hover:bg-gym-secondary">
            <UserPlus className="mr-2 h-4 w-4" />
            신규 회원 등록
          </Button>
        </Link>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>회원 목록</CardTitle>
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
                    <TableHead>회원 번호</TableHead>
                    <TableHead>이름</TableHead>
                    <TableHead>연락처</TableHead>
                    <TableHead>등록일</TableHead>
                    <TableHead>회원권 상태</TableHead>
                    <TableHead>PT 이용권</TableHead>
                    <TableHead>출석률</TableHead>
                    <TableHead>락커</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.length > 0 ? (
                    filteredMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-mono font-medium">
                          <Link
                            to={`/members/${member.id}`}
                            className="hover:text-gym-primary hover:underline"
                          >
                            {member.id}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Link
                            to={`/members/${member.id}`}
                            className="hover:text-gym-primary hover:underline"
                          >
                            {member.name}
                          </Link>
                        </TableCell>
                        <TableCell>{formatPhoneNumber(member.phoneNumber)}</TableCell>
                        <TableCell>{formatDate(member.registrationDate)}</TableCell>
                        <TableCell>
                          {member.membershipActive ? (
                            <Badge className="bg-gym-success">활성</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-muted-foreground">
                              만료
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {member.hasPT ? (
                            <Badge className="bg-gym-accent">
                              {member.ptRemaining}회 남음
                            </Badge>
                          ) : (
                            <Badge variant="outline">미등록</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="w-full bg-muted rounded-full h-2 mr-2">
                              <div
                                className={`h-2 rounded-full ${
                                  member.attendanceRate >= 80
                                    ? "bg-gym-success"
                                    : member.attendanceRate >= 50
                                    ? "bg-gym-warning"
                                    : "bg-gym-danger"
                                }`}
                                style={{ width: `${member.attendanceRate}%` }}
                              />
                            </div>
                            <span className="text-xs">{member.attendanceRate}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {member.lockerId ? (
                            <Badge variant="outline" className="bg-blue-50">
                              {member.lockerId}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-10">
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
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberList;
