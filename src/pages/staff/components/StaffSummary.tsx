
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Phone, Mail, Building2, Calendar, MapPin } from "lucide-react";
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
    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50">
      <CardContent className="p-8">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* 프로필 섹션 */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
              <AvatarImage src="" alt={staff.name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-4xl font-bold">
                {staff.name?.charAt(0) || 'S'}
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">{staff.name}</h1>
              <div className="text-lg text-muted-foreground">
                직원번호: {staff.id}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-medium px-3 py-1">
                  {staff.position}
                </Badge>
                <Badge className={`${getStatusColor(staff.status)} font-medium px-3 py-1`}>
                  {staff.status === 'active' ? '활성' : '비활성'}
                </Badge>
              </div>
            </div>
          </div>

          {/* 정보 그리드 */}
          <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 생년월일 */}
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-100">
              <div className="p-2 bg-gray-50 rounded-lg">
                <Calendar className="h-5 w-5 text-gray-600" />
              </div>
              <div className="text-left">
                <p className="text-sm text-muted-foreground">생년월일</p>
                <p className="font-medium text-gray-900">1990. 05. 15. (만 34세)</p>
              </div>
            </div>

            {/* 연락처 */}
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-100">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Phone className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="text-sm text-muted-foreground">휴대폰 번호</p>
                <p className="font-medium text-gray-900">{staff.phone}</p>
              </div>
            </div>

            {/* 성별 */}
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-100">
              <div className="p-2 bg-pink-50 rounded-lg">
                <User className="h-5 w-5 text-pink-600" />
              </div>
              <div className="text-left">
                <p className="text-sm text-muted-foreground">성별</p>
                <p className="font-medium text-gray-900 text-pink-600">여성</p>
              </div>
            </div>

            {/* 이메일 */}
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-100">
              <div className="p-2 bg-green-50 rounded-lg">
                <Mail className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-left">
                <p className="text-sm text-muted-foreground">이메일</p>
                <p className="font-medium text-gray-900">{staff.email}</p>
              </div>
            </div>

            {/* 이용 가능 지점 */}
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-100">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Building2 className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-left">
                <p className="text-sm text-muted-foreground">이용 가능 지점</p>
                <p className="font-medium text-gray-900">본점</p>
              </div>
            </div>

            {/* 주소 */}
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-100">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <MapPin className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="text-left">
                <p className="text-sm text-muted-foreground">주소</p>
                <p className="font-medium text-gray-900">서울시 강남구 역삼동 123-45</p>
              </div>
            </div>
          </div>

          {/* 특이사항 메모 */}
          <div className="w-full max-w-2xl">
            <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-100">
              <div className="p-2 bg-orange-50 rounded-lg">
                <User className="h-5 w-5 text-orange-600" />
              </div>
              <div className="text-left flex-1">
                <p className="text-sm text-muted-foreground">특이사항 메모</p>
                <p className="font-medium text-gray-900">등록된 특이사항 메모가 없습니다.</p>
              </div>
              <div className="flex items-center">
                <span className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-medium">
                  등록
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
