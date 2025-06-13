
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Phone, Mail, Building2, CheckCircle, XCircle, Users, DollarSign } from "lucide-react";
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

  const getStatusIcon = (status: string) => {
    return status === 'active' 
      ? <CheckCircle className="h-4 w-4" />
      : <XCircle className="h-4 w-4" />;
  };

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50">
      <CardContent className="p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 프로필 섹션 */}
          <div className="flex flex-col items-center lg:items-start gap-6 lg:min-w-[280px]">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                <AvatarImage src="" alt={staff.name} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-2xl font-bold">
                  {staff.name?.charAt(0) || 'S'}
                </AvatarFallback>
              </Avatar>
              
              <div className="text-center lg:text-left">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{staff.name}</h1>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-medium px-3 py-1">
                    <Building2 className="h-4 w-4 mr-1" />
                    {staff.position}
                  </Badge>
                  <Badge className={`${getStatusColor(staff.status)} font-medium px-3 py-1`}>
                    {getStatusIcon(staff.status)}
                    <span className="ml-1">{staff.status === 'active' ? '활성' : '비활성'}</span>
                  </Badge>
                </div>
              </div>
            </div>

            {/* 연락처 정보 */}
            <div className="w-full space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Phone className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">연락처</p>
                  <p className="font-medium text-gray-900">{staff.phone}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Mail className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">이메일</p>
                  <p className="font-medium text-gray-900">{staff.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 통계 섹션 */}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-6">근무 현황</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 담당 회원 수 */}
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <Badge variant="outline" className="text-blue-600 border-blue-200">
                    회원 관리
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-gray-900">{staff.memberCount || 0}</p>
                  <p className="text-sm text-muted-foreground">담당 회원 수</p>
                </div>
              </div>

              {/* 이번 달 매출 */}
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-emerald-100 rounded-lg">
                    <DollarSign className="h-6 w-6 text-emerald-600" />
                  </div>
                  <Badge variant="outline" className="text-emerald-600 border-emerald-200">
                    매출 현황
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-gray-900">
                    {(staff.revenue || 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">이번 달 매출 (원)</p>
                </div>
              </div>

              {/* 평균 회원당 매출 */}
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow md:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <User className="h-6 w-6 text-purple-600" />
                  </div>
                  <Badge variant="outline" className="text-purple-600 border-purple-200">
                    효율성 지표
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-gray-900">
                    {staff.memberCount && staff.memberCount > 0
                      ? Math.round((staff.revenue || 0) / staff.memberCount).toLocaleString()
                      : 0}
                  </p>
                  <p className="text-sm text-muted-foreground">회원당 평균 매출 (원)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
