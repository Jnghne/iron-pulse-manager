
import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Staff } from "../../types";

interface ApprovalActionsDialogProps {
  staff: Staff;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actionType: 'approve' | 'reject';
}

export const ApprovalActionsDialog = memo<ApprovalActionsDialogProps>(({
  staff,
  open,
  onOpenChange,
  actionType
}) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAction = async () => {
    setLoading(true);
    
    // 실제 구현에서는 API 호출이 필요합니다.
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (actionType === 'approve') {
      toast({
        title: "승인 완료",
        description: `${staff.name}님의 가입이 승인되었습니다.`,
      });
    } else {
      toast({
        title: "거절 완료",
        description: `${staff.name}님의 가입 요청이 거절되었습니다.`,
        variant: "destructive",
      });
    }
    
    setLoading(false);
    onOpenChange(false);
    navigate('/staff');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-full ${
              actionType === 'approve' 
                ? 'bg-emerald-100' 
                : 'bg-red-100'
            }`}>
              {actionType === 'approve' ? (
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
            </div>
            <DialogTitle className="text-xl">
              직원 가입 {actionType === 'approve' ? '승인' : '거절'}
            </DialogTitle>
          </div>
          <DialogDescription className="text-left">
            <div className="space-y-3">
              <p>
                <span className="font-medium">{staff.name}</span>님의 직원 가입 요청을{' '}
                <span className={`font-medium ${
                  actionType === 'approve' ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {actionType === 'approve' ? '승인' : '거절'}
                </span>하시겠습니까?
              </p>
              
              <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">이름:</span>
                  <span className="font-medium">{staff.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">연락처:</span>
                  <span className="font-medium">{staff.phone}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">직책:</span>
                  <span className="font-medium">{staff.position}</span>
                </div>
              </div>

              {actionType === 'approve' && (
                <p className="text-sm text-emerald-600 bg-emerald-50 p-2 rounded">
                  승인 시 직원 목록에 추가되고 시스템에 접근할 수 있습니다.
                </p>
              )}
              
              {actionType === 'reject' && (
                <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
                  거절 시 해당 요청은 시스템에서 삭제됩니다.
                </p>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            취소
          </Button>
          <Button
            onClick={handleAction}
            disabled={loading}
            className={
              actionType === 'approve' 
                ? 'bg-emerald-600 hover:bg-emerald-700' 
                : 'bg-red-600 hover:bg-red-700'
            }
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                처리중...
              </>
            ) : (
              <>
                {actionType === 'approve' ? (
                  <CheckCircle className="mr-2 h-4 w-4" />
                ) : (
                  <XCircle className="mr-2 h-4 w-4" />
                )}
                {actionType === 'approve' ? '승인하기' : '거절하기'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

ApprovalActionsDialog.displayName = 'ApprovalActionsDialog';
