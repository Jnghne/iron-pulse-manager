
import { memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Staff } from "../../types";

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

interface EditStaffDialogProps {
  staff: Staff;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editForm: EditFormType;
  setEditForm: (form: EditFormType) => void;
  onSave: () => void;
}

export const EditStaffDialog = memo<EditStaffDialogProps>(({
  staff,
  open,
  onOpenChange,
  editForm,
  setEditForm,
  onSave
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">직원 정보 수정</DialogTitle>
          <DialogDescription>
            {staff.name}님의 정보를 수정할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* 기본 정보 섹션 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">기본 정보</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  이름 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={editForm.name || ''}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="이름을 입력하세요"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  연락처 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  value={editForm.phone || ''}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  placeholder="010-0000-0000"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  이메일
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={editForm.email || ''}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  placeholder="example@email.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-sm font-medium">
                  성별
                </Label>
                <Select
                  value={editForm.gender || '남성'}
                  onValueChange={(value) => setEditForm({ ...editForm, gender: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="성별 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="남성">남성</SelectItem>
                    <SelectItem value="여성">여성</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium">
                주소
              </Label>
              <Input
                id="address"
                value={editForm.address || ''}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                placeholder="주소를 입력하세요"
              />
            </div>
          </div>

          {/* 직무 정보 섹션 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">직무 정보</h3>
            
            <div className="space-y-2">
              <Label htmlFor="position" className="text-sm font-medium">
                직급/직책
              </Label>
              <Input
                id="position"
                value={editForm.position || ''}
                onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                placeholder="예: 수석 트레이너, 매니저"
              />
            </div>

            {!staff?.isRegistration && (
              <div className="space-y-2">
                <Label htmlFor="workHours" className="text-sm font-medium">
                  근무 시간
                </Label>
                <Input
                  id="workHours"
                  value={editForm.workHours || ''}
                  onChange={(e) => setEditForm({ ...editForm, workHours: e.target.value })}
                  placeholder="예: 09:00-18:00"
                />
              </div>
            )}
          </div>

          {/* 재무 정보 섹션 */}
          {!staff?.isRegistration && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">재무 정보</h3>
              
              <div className="space-y-2">
                <Label htmlFor="account" className="text-sm font-medium">
                  계좌 정보
                </Label>
                <Input
                  id="account"
                  value={editForm.account || ''}
                  onChange={(e) => setEditForm({ ...editForm, account: e.target.value })}
                  placeholder="은행명 계좌번호"
                />
              </div>
            </div>
          )}

          {/* 추가 정보 섹션 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">추가 정보</h3>
            
            <div className="space-y-2">
              <Label htmlFor="memo" className="text-sm font-medium">
                특이사항/메모
              </Label>
              <Textarea
                id="memo"
                value={editForm.memo || ''}
                onChange={(e) => setEditForm({ ...editForm, memo: e.target.value })}
                placeholder="특이사항이나 참고할 내용을 입력하세요"
                rows={3}
              />
            </div>
          </div>
        </div>
        
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={onSave} className="bg-blue-600 hover:bg-blue-700">
            저장하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

EditStaffDialog.displayName = 'EditStaffDialog';
