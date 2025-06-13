
import { memo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
  FileText,
  Edit
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Staff, Member } from "../types";
import { StaffStatusBadge } from "./StaffStatusBadge";
import { membersMockData } from "@/data/staff-mock-data";
import { EditStaffDialog } from "./dialogs/EditStaffDialog";

interface StaffBasicInfoProps {
  staff: Staff;
  onStaffUpdate: (staff: Staff) => void;
}

interface EditFormType {
  name?: string;
  email?: string;
  phone?: string;
  position?: string;
  gender?: string;
  address?: string;
  account?: string;
  workHours?: string;
  memo?: string;
}

export const StaffBasicInfo = memo<StaffBasicInfoProps>(({ 
  staff, 
  onStaffUpdate 
}) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<EditFormType>({});

  useEffect(() => {
    const staffMembers = membersMockData[staff.id] || [];
    setMembers(staffMembers);
  }, [staff.id]);

  const handleEditClick = () => {
    setEditForm({
      name: staff.name,
      email: staff.email,
      phone: staff.phone,
      position: staff.position,
      gender: staff.gender,
      address: staff.address,
      account: staff.account,
      workHours: staff.workHours,
      memo: staff.memo,
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    const updatedStaff = {
      ...staff,
      ...editForm,
    };
    onStaffUpdate(updatedStaff);
    setIsEditDialogOpen(false);
  };

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

        <div className="flex-shrink-0">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleEditClick}
            className="gap-2"
          >
            <Edit className="h-4 w-4" />
            수정
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

      <EditStaffDialog
        staff={staff}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        editForm={editForm}
        setEditForm={setEditForm}
        onSave={handleSaveEdit}
      />
    </div>
  );
});

StaffBasicInfo.displayName = 'StaffBasicInfo';
