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

interface RejectDialogProps {
  staff: Staff;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReject: () => Promise<void>;
  loading: boolean;
}

export const RejectDialog = memo<RejectDialogProps>(({
  staff,
  open,
  onOpenChange,
  onReject,
  loading
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>직원 가입 거절</AlertDialogTitle>
          <AlertDialogDescription>
            {staff.name}님의 직원 가입 요청을 거절하시겠습니까?
            거절 시 해당 요청은 시스템에서 삭제됩니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>취소</AlertDialogCancel>
          <AlertDialogAction
            onClick={onReject}
            className="bg-destructive hover:bg-destructive/90"
            disabled={loading}
          >
            {loading ? "처리중..." : "거절하기"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
});

RejectDialog.displayName = 'RejectDialog';
