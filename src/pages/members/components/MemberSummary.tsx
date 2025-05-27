
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Phone } from "lucide-react";
import { Member } from "@/data/mockData";
import { formatPhoneNumber } from "@/lib/utils";

interface MemberSummaryProps {
  member: Member;
}

export const MemberSummary = ({ member }: MemberSummaryProps) => {
  const getMemberTypes = () => {
    const types = [];
    if (member.membershipActive) {
      types.push("헬스장 회원");
    }
    if (member.hasPT) {
      types.push("PT 회원");
    }
    return types.length > 0 ? types : ["일반 회원"];
  };

  const getAttendanceColor = (rate: number) => {
    if (rate >= 80) return "bg-green-100 text-green-800";
    if (rate >= 50) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-8">
        <div className="flex items-center gap-8">
          {/* 회원 사진 */}
          <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
            <AvatarImage src={member.photoUrl} alt={member.name} />
            <AvatarFallback className="bg-gym-primary text-white text-3xl">
              <User className="h-16 w-16" />
            </AvatarFallback>
          </Avatar>

          {/* 회원 기본 정보 */}
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-3xl font-bold">{member.name}</h1>
              <p className="text-muted-foreground flex items-center gap-3 mt-2">
                <Phone className="h-5 w-5" />
                <span className="text-lg">{formatPhoneNumber(member.phoneNumber)}</span>
              </p>
            </div>

            {/* 회원 유형 */}
            <div className="flex gap-3">
              {getMemberTypes().map((type, index) => (
                <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 px-4 py-1.5">
                  {type}
                </Badge>
              ))}
            </div>

            {/* 출석률 */}
            <div className="flex items-center gap-4">
              <span className="text-lg font-medium">출석률</span>
              <Badge className={getAttendanceColor(member.attendanceRate)}>
                {member.attendanceRate}%
              </Badge>
              <div className="flex-1 max-w-sm">
                <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full transition-all ${
                      member.attendanceRate >= 80
                        ? "bg-green-500"
                        : member.attendanceRate >= 50
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${member.attendanceRate}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
