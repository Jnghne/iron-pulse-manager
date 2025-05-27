
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Phone, Mail, Calendar, MapPin, MessageSquare } from "lucide-react";
import { Member } from "@/data/mockData";
import { formatDate, formatPhoneNumber, calculateAge } from "@/lib/utils";

interface MemberInfoTabProps {
  member: Member;
}

export const MemberInfoTab = ({ member }: MemberInfoTabProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 기본 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5 text-gym-primary" />
            기본 정보
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">회원명</label>
              <p className="font-medium">{member.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">회원번호</label>
              <p className="font-medium">{member.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">성별</label>
              <Badge variant="outline" className={member.gender === 'male' ? 'text-blue-600 bg-blue-50' : 'text-pink-600 bg-pink-50'}>
                {member.gender === 'male' ? '남성' : '여성'}
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">생년월일</label>
              <div className="space-y-1">
                <p className="font-medium">{formatDate(member.birthDate || '')}</p>
                {member.birthDate && (
                  <p className="text-sm text-muted-foreground">만 {calculateAge(member.birthDate)}세</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 연락처 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Phone className="h-5 w-5 text-gym-primary" />
            연락처 정보
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Phone className="h-4 w-4" />
              핸드폰 번호
            </label>
            <p className="font-medium">{formatPhoneNumber(member.phoneNumber)}</p>
          </div>

          {member.email && (
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                이메일
              </label>
              <p className="font-medium">{member.email}</p>
            </div>
          )}

          {member.address && (
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                주소
              </label>
              <p className="font-medium">{member.address}</p>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              문자 수신 동의
            </label>
            <Badge variant={member.smsConsent ? "default" : "outline"} className={member.smsConsent ? "bg-gym-primary" : ""}>
              {member.smsConsent ? "동의" : "미동의"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* 담당 트레이너 정보 */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5 text-gym-primary" />
            담당 트레이너
          </CardTitle>
        </CardHeader>
        <CardContent>
          {member.trainerAssigned ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">담당 트레이너</label>
                <p className="font-medium">{member.trainerAssigned}</p>
              </div>
              
              {member.trainerNotes && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">트레이너 메모</label>
                  <div className="mt-2 p-3 bg-muted/50 rounded-md">
                    <p className="text-sm">{member.trainerNotes}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground">담당 트레이너가 지정되지 않았습니다.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
