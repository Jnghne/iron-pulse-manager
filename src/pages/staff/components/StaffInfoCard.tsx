
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Phone, Mail, MapPin, Calendar, Clock } from "lucide-react";
import { Staff } from "../types";

interface StaffInfoCardProps {
  staff: Staff;
}

export const StaffInfoCard = ({ staff }: StaffInfoCardProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 기본 정보 카드 */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-blue-500 rounded-lg">
              <User className="h-5 w-5 text-white" />
            </div>
            기본 정보
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">이름</span>
              </div>
              <span className="font-semibold">{staff.name}</span>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">연락처</span>
              </div>
              <span className="font-semibold">{staff.phone}</span>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">이메일</span>
              </div>
              <span className="font-semibold">{staff.email}</span>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground">직책</span>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {staff.position}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 근무 정보 카드 */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-green-500 rounded-lg">
              <Clock className="h-5 w-5 text-white" />
            </div>
            근무 정보
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground">상태</span>
              </div>
              <Badge 
                className={
                  staff.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }
              >
                {staff.status === 'active' ? '활성' : '비활성'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground">담당 회원 수</span>
              </div>
              <span className="font-semibold text-blue-600">{staff.memberCount || 0}명</span>
            </div>
            
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground">이번 달 매출</span>
              </div>
              <span className="font-semibold text-green-600">
                {(staff.revenue || 0).toLocaleString()}원
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
