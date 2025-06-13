
import { Badge } from "@/components/ui/badge";
import { memo } from "react";
import { Calendar, Home, Mail, Phone, UserCircle, UserRound } from "lucide-react";
import { Staff } from "../types";
import { StaffStatusBadge } from "./StaffStatusBadge";

interface ApprovalPendingInfoProps {
  staff: Staff;
}

export const ApprovalPendingInfo = memo<ApprovalPendingInfoProps>(({ staff }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <div className="flex-shrink-0 bg-slate-100 rounded-full p-4 w-24 h-24 flex items-center justify-center">
          <UserCircle className="w-16 h-16 text-slate-400" />
        </div>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <h2 className="text-2xl font-bold">{staff.name}</h2>
            <div className="flex flex-wrap gap-2">
              <StaffStatusBadge status={staff.status} />
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">가입 신청자</Badge>
              <Badge variant="outline" className="border-slate-200">{staff.position}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* 승인 대기 직원 정보 (2열 레이아웃) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* 1열: 성별, 연락처, 가입 신청일 */}
        <div className="space-y-6">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-1.5">
              <UserRound className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-sm font-medium text-muted-foreground">성별</p>
            </div>
            <p className="font-medium">{staff.gender || '남성'}</p>
          </div>

          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-sm font-medium text-muted-foreground">연락처</p>
            </div>
            <p className="font-medium">{staff.phone}</p>
          </div>

          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-sm font-medium text-muted-foreground">가입 신청일</p>
            </div>
            <p className="font-medium">{staff.approvalDate}</p>
          </div>
        </div>

        {/* 2열: 이메일, 주소 */}
        <div className="space-y-6">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-sm font-medium text-muted-foreground">이메일</p>
            </div>
            <p className="font-medium">{staff.email}</p>
          </div>

          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-1.5">
              <Home className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-sm font-medium text-muted-foreground">주소</p>
            </div>
            <p>{staff.address || '-'}</p>
          </div>
        </div>
      </div>
    </div>
  );
});

ApprovalPendingInfo.displayName = 'ApprovalPendingInfo';
