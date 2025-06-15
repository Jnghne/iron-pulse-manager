
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin, 
  MessageSquare, 
  Building, 
  CreditCard, 
  UserPlus, 
  FileText,
  MapPinned,
  Smartphone
} from "lucide-react";
import { Member } from "@/data/mockData";
import { formatPhoneNumber, formatDate, calculateAge } from "@/lib/utils";

interface MemberSummaryProps {
  member: Member;
}

export const MemberSummary = ({ member }: MemberSummaryProps) => {
  const getMemberTypes = () => {
    const types = [];
    if (member.membershipActive) {
      types.push("헬스권");
    }
    if (member.hasPT) {
      types.push("PT");
    }
    return types.length > 0 ? types : ["일반 회원"];
  };

  // 출석률 관련 함수 제거


  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* 왼쪽 섹션: 회원 사진 및 기본 정보 */}
          <div className="flex flex-col items-center space-y-4 md:w-1/4 justify-center">
            {/* 회원 사진 */}
            <Avatar className="h-40 w-40 border-4 border-white shadow-xl">
              <AvatarImage src={member.photoUrl} alt={member.name} />
              <AvatarFallback className="bg-gym-primary text-white text-3xl">
                <User className="h-20 w-20" />
              </AvatarFallback>
            </Avatar>

            {/* 회원 이름 및 번호 */}
            <div className="text-center w-full">
              <h1 className="text-3xl font-bold">{member.name}</h1>
              <p className="text-muted-foreground mt-1">
                회원번호: <span className="font-medium">{member.id}</span>
              </p>
            </div>

            {/* 회원 유형 */}
            <div className="flex flex-wrap gap-2 justify-center">
              {getMemberTypes().map((type, index) => (
                <Badge key={index} variant="outline" className={
                  type === "헬스권" 
                    ? "bg-blue-50 text-blue-700 px-4 py-1.5" 
                    : type === "PT" 
                      ? "bg-purple-50 text-purple-700 px-4 py-1.5" 
                      : "bg-gray-50 text-gray-700 px-4 py-1.5"
                }>
                  {type}
                </Badge>
              ))}
            </div>

          </div>

          {/* 구분선 (모바일에서만 표시) */}
          <div className="md:hidden w-full my-4">
            <Separator />
          </div>

          {/* 오른쪽 섹션: 회원 상세 정보 */}
          <div className="flex-1 flex flex-col gap-4 py-4">
            {/* 회원 정보 타이틀 */}
            <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <User className="h-6 w-6 text-gym-primary" />
              회원 정보
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {/* 기본 정보 섹션 */}
              <div className="space-y-4 flex flex-col">
                <div className="space-y-8">
                {/* 생년월일 및 만나이 */}
                <div className="flex items-start gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">생년월일</p>
                    <p className="font-medium">
                      {formatDate(member.birthDate || '')} 
                      {member.birthDate && (
                        <span className="text-sm text-muted-foreground ml-2">
                          (만 {calculateAge(member.birthDate)}세)
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                
                {/* 성별 */}
                <div className="flex items-start gap-2">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">성별</p>
                    <Badge variant="outline" className={member.gender === 'male' ? 'text-blue-600 bg-blue-50' : 'text-pink-600 bg-pink-50'}>
                      {member.gender === 'male' ? '남성' : '여성'}
                    </Badge>
                  </div>
                </div>
                
                {/* 앱 이용 여부 */}
                <div className="flex items-start gap-2">
                  <Smartphone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">앱 이용 여부</p>
                    <Badge className={member.appUsage ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"}>
                      {member.appUsage ? "사용" : "미사용"}
                    </Badge>
                  </div>
                </div>
                
                {/* 특이사항 메모 */}
                <div className="flex items-start gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">특이사항 메모</p>
                    {member.memberNotes ? (
                      <p className="font-medium whitespace-pre-line">{member.memberNotes}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">등록된 특이사항 메모가 없습니다.</p>
                    )}
                  </div>
                </div>
                
                {/* 잔여 미수금 */}
                {member.unpaidAmount !== undefined && (
                  <div className="flex items-start gap-2">
                    <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">잔여 미수금</p>
                      <p className="font-medium">
                        {member.unpaidAmount.toLocaleString()}원
                      </p>
                    </div>
                  </div>
                )}
                
                {/* 방문/가입 경로 */}
                {member.registrationPath && (
                  <div className="flex items-start gap-2">
                    <UserPlus className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">방문/가입 경로</p>
                      <p className="font-medium">{member.registrationPath}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* 연락처 정보 섹션 */}
            <div className="space-y-4 flex flex-col">
              {/* 연락처 정보 타이틀 제거 */}
              
              <div className="space-y-8">
                {/* 핸드폰 번호 */}
                <div className="flex items-start gap-2">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">핸드폰 번호</p>
                    <p className="font-medium">{formatPhoneNumber(member.phoneNumber)}</p>
                  </div>
                </div>
                
                {/* 이메일 */}
                <div className="flex items-start gap-2">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">이메일</p>
                    {member.email ? (
                      <p className="font-medium">{member.email}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">등록된 이메일이 없습니다.</p>
                    )}
                  </div>
                </div>
                
                {/* 주소 */}
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">주소</p>
                    {member.address ? (
                      <p className="font-medium">{member.address}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">등록된 주소가 없습니다.</p>
                    )}
                  </div>
                </div>
                
                {/* 문자 수신 동의 여부 */}
                <div className="flex items-start gap-2">
                  <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">문자 수신 동의</p>
                    <Badge
  variant={member.smsConsent ? "default" : "outline"}
  className={
    member.smsConsent
      ? "bg-gym-primary hover:bg-gym-primary/90"
      : "text-slate-700 bg-slate-100 border-slate-300 hover:bg-slate-200"
  }
>
  {member.smsConsent ? '동의' : '미동의'}
</Badge>
                  </div>
                </div>
              </div>
            </div>
            </div> {/* ADDED: Closes "grid grid-cols-1 md:grid-cols-2" */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
