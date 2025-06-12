import { memo } from "react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Calendar, 
  CreditCard, 
  Clock, 
  Home, 
  Mail, 
  Phone, 
  UserCircle, 
  UserRound, 
  Users, 
  FileText 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Staff, Member } from "../types";
import { StaffStatusBadge } from "./StaffStatusBadge";
import { StaffMembersList } from "./StaffMembersList";

interface StaffBasicInfoProps {
  staff: Staff;
  members: Member[];
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const StaffBasicInfo = memo<StaffBasicInfoProps>(({ 
  staff, 
  members, 
  activeTab, 
  onTabChange 
}) => {
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
              <Badge variant="outline" className="border-slate-200">{staff.position}</Badge>
            </div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={onTabChange}>
        <TabsList>
          <TabsTrigger value="info">기본 정보</TabsTrigger>
          <TabsTrigger value="members">담당 회원</TabsTrigger>
        </TabsList>
        <TabsContent value="info">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
            {/* 1열: 성별, 연락처, 가입일 */}
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
                  <p className="text-sm font-medium text-muted-foreground">가입일</p>
                </div>
                <p className="font-medium">{staff.approvalDate}</p>
              </div>
            </div>

            {/* 2열: 이메일, 주소, 계좌 정보 */}
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

              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-1.5">
                  <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                  <p className="text-sm font-medium text-muted-foreground">계좌 정보</p>
                </div>
                <p>{staff.account || '-'}</p>
              </div>
            </div>

            {/* 3열: 근무 시간, 회원 수, 특이사항 */}
            <div className="space-y-6">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <p className="text-sm font-medium text-muted-foreground">근무 시간</p>
                </div>
                <p>{staff.workHours || '-'}</p>
              </div>

              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                  <p className="text-sm font-medium text-muted-foreground">담당 회원 수</p>
                </div>
                <p className="font-medium">{staff.memberCount}명</p>
              </div>

              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                  <p className="text-sm font-medium text-muted-foreground">특이사항</p>
                </div>
                <p>{staff.memo || '-'}</p>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="members">
          <div className="mt-4">
            <StaffMembersList members={members} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
});

StaffBasicInfo.displayName = 'StaffBasicInfo';
