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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>직원 정보 수정</DialogTitle>
          <DialogDescription>
            아래 양식에 수정할 정보를 입력해주세요.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              이름
            </Label>
            <Input
              id="name"
              value={editForm.name || ''}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              이메일
            </Label>
            <Input
              id="email"
              type="email"
              value={editForm.email || ''}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              연락처
            </Label>
            <Input
              id="phone"
              value={editForm.phone || ''}
              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="position" className="text-right">
              직급
            </Label>
            <Input
              id="position"
              value={editForm.position || ''}
              onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="gender" className="text-right">
              성별
            </Label>
            <Select
              value={editForm.gender || '남성'}
              onValueChange={(value) => setEditForm({ ...editForm, gender: value })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="성별 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="남성">남성</SelectItem>
                <SelectItem value="여성">여성</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              주소
            </Label>
            <Input
              id="address"
              value={editForm.address || ''}
              onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
              className="col-span-3"
            />
          </div>
          {!staff?.isRegistration && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="account" className="text-right">
                계좌 정보
              </Label>
              <Input
                id="account"
                value={editForm.account || ''}
                onChange={(e) => setEditForm({ ...editForm, account: e.target.value })}
                className="col-span-3"
              />
            </div>
          )}
          {!staff?.isRegistration && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="workHours" className="text-right">
                근무 시간
              </Label>
              <Input
                id="workHours"
                value={editForm.workHours || ''}
                onChange={(e) => setEditForm({ ...editForm, workHours: e.target.value })}
                className="col-span-3"
              />
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="memo" className="text-right">
              특이사항
            </Label>
            <Textarea
              id="memo"
              value={editForm.memo || ''}
              onChange={(e) => setEditForm({ ...editForm, memo: e.target.value })}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={onSave} className="bg-blue-600 hover:bg-blue-700">
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

EditStaffDialog.displayName = 'EditStaffDialog';
