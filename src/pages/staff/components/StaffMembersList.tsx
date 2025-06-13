
import { memo, useState, useEffect } from "react";
import { Users } from "lucide-react";
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
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    const staffMembers = membersMockData[staffId] || [];
    setMembers(staffMembers);
  }, [staffId]);

  return (
    <>
      {members.length > 0 ? (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No.</TableHead>
                <TableHead>이름</TableHead>
                <TableHead>연락처</TableHead>
                <TableHead>멤버십 종류</TableHead>
                <TableHead>시작일</TableHead>
                <TableHead>종료일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member, index) => (
                <TableRow key={member.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.phone}</TableCell>
                  <TableCell>{member.membershipType}</TableCell>
                  <TableCell>{member.startDate}</TableCell>
                  <TableCell>{member.endDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
          <Users className="h-10 w-10 mb-2" />
          <p>담당 회원이 없습니다.</p>
        </div>
      )}
    </>
  );
});

StaffMembersList.displayName = 'StaffMembersList';
