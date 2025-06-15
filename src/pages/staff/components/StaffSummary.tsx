
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Phone, Mail, Calendar, MapPin, Users, FileText, Clock, CreditCard, Briefcase } from "lucide-react";
import { Staff } from "../types";

interface StaffSummaryProps {
  staff: Staff;
}

export const StaffSummary = ({ staff }: StaffSummaryProps) => {
  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
      : 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* 왼쪽 섹션 - 아바타 및 기본 정보 */}
          <div className="md:w-1/4 flex flex-col items-center justify-center space-y-4">
            <Avatar className="h-40 w-40 shadow-lg">
              <AvatarImage src="" alt={staff.name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-4xl font-bold">
                {staff.name?.charAt(0) || 'S'}
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">{staff.name}</h1>
              <p className="text-muted-foreground">직원번호: <span className="font-medium">{staff.id}</span></p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Badge variant="secondary" className="px-4 py-1.5">
                  {staff.position}
                </Badge>
                <Badge className={`${getStatusColor(staff.status)} px-4 py-1.5`}>
                  {staff.status === 'active' ? '활성' : '비활성'}
                </Badge>
              </div>
            </div>
          </div>

          {/* 오른쪽 섹션 - 상세 정보 */}
          <div className="flex-1 flex flex-col gap-4 py-4">
             {/* 회원 정보 타이틀 */}
            <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <User className="h-6 w-6 text-gym-primary" />
              직원 정보
            </h3>
            

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
              {/* 생년월일 */}
              <div className="flex items-start gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground mb-2">생년월일</p>
                  <p className="font-medium">1990. 05. 15. (만 34세)</p>
                </div>
              </div>

              {/* 성별 */}
              <div className="flex items-start gap-2">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">성별</p>
                    <Badge variant="outline" className={staff.gender === 'male' ? 'text-blue-600 bg-blue-50' : 'text-pink-600 bg-pink-50'}>
                      {staff.gender === 'male' ? '남성' :  '여성'}
                    </Badge>
                  </div>
                </div>

              {/* 연락처 */}
              <div className="flex items-start gap-2">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground mb-2">휴대폰 번호</p>
                  <p className="font-medium">{staff.phone}</p>
                </div>
              </div>

              {/* 이메일 */}
              <div className="flex items-start gap-2">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground mb-2">이메일</p>
                  <p className="font-medium">{staff.email}</p>
                </div>
              </div>

              {/* 직책 */}
              <div className="flex items-start gap-2">
                <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground mb-2">직책</p>
                  <p className="font-medium">{staff.position || '미지정'}</p>
                </div>
              </div>


              {/* 근무 시간 */}
              <div className="flex items-start gap-2">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground mb-2">근무 시간</p>
                  <p className="font-medium">{staff.workHours || '09:00-18:00'}</p>
                </div>
              </div>

              {/* 담당 회원 수 */}
              <div className="flex items-start gap-2">
                <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground mb-2">담당 회원 수</p>
                  <p className="font-medium">{staff.memberCount || 0}명</p>
                </div>
              </div>

              {/* 계좌 정보 */}
              <div className="flex items-start gap-2">
                <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground mb-2">계좌 정보</p>
                  <p className="font-medium">{staff.account || '미등록'}</p>
                </div>
              </div>

              {/* 입사일 */}
              <div className="flex items-start gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground mb-2">입사일</p>
                  <p className="font-medium">2020. 03. 01</p>
                </div>
              </div>

              {/* 주소 */}
              <div className="flex items-start gap-2 md:col-span-1">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground mb-2">주소</p>
                  <p className="font-medium">{staff.address || '서울시 강남구 역삼동 123-45'}</p>
                </div>
              </div>

              {/* 특이사항 메모 */}
                <div className="flex items-start gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">특이사항 메모</p>
                    {staff.note ? (
                      <p className="font-medium whitespace-pre-line">{staff.note}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">등록된 특이사항 메모가 없습니다.</p>
                    )}
                  </div>
                </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
