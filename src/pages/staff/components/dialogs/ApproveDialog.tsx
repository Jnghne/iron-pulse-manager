import { memo } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Staff } from "../../types";

interface ApproveDialogProps {
  staff: Staff;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: () => Promise<void>;
  loading: boolean;
}

export const ApproveDialog = memo<ApproveDialogProps>(({
  staff,
  open,
  onOpenChange,
  onApprove,
  loading
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>직원 가입 승인</AlertDialogTitle>
          <AlertDialogDescription>
            {staff.name}님의 직원 가입 요청을 승인하시겠습니까?
            승인 시 직원 목록에 추가되고 시스템에 접근할 수 있습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>취소</AlertDialogCancel>
          <AlertDialogAction
            onClick={onApprove}
            className="bg-emerald-600 hover:bg-emerald-700"
            disabled={loading}
          >
            {loading ? "처리중..." : "승인하기"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
});

ApproveDialog.displayName = 'ApproveDialog';
