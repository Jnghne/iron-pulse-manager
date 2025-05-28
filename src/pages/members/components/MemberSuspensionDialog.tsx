import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle } from "lucide-react";
import { Member } from "@/data/mockData";
import { formatDate } from "@/lib/utils";

interface MemberSuspensionDialogProps {
  member: Member;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (duration: number, reason: string) => void;
}

export const MemberSuspensionDialog = ({ 
  member, 
  open, 
  onOpenChange, 
  onSave 
}: MemberSuspensionDialogProps) => {
  const [duration, setDuration] = useState<number>(5);
  const [reason, setReason] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = () => {
    if (duration <= 0) {
      alert("정지 기간은 1일 이상이어야 합니다.");
      return;
    }

    if (!reason.trim()) {
      alert("정지 사유를 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    
    // 실제 구현에서는 API 호출 등의 로직이 들어갈 수 있음
    setTimeout(() => {
      onSave(duration, reason);
      setIsSubmitting(false);
      resetForm();
    }, 500);
  };

  const resetForm = () => {
    setDuration(5);
    setReason("");
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetForm();
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            회원권 정지 등록
          </DialogTitle>
          <DialogDescription>
            {member.name} 회원의 회원권 정지를 등록합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="expiryDate">회원권 만료일</Label>
            <div className="p-2 bg-muted rounded-md">
              {member.membershipActive 
                ? formatDate(member.membershipEndDate || '') 
                : '활성화된 회원권이 없습니다.'}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">정지 기간 (일)</Label>
            <Input
              id="duration"
              type="number"
              min={1}
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">정지 사유</Label>
            <Textarea
              id="reason"
              placeholder="정지 사유를 입력해주세요"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSubmitting || duration <= 0 || !reason.trim()}
            className="bg-gym-primary hover:bg-gym-primary/90"
          >
            {isSubmitting ? "처리 중..." : "등록"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
