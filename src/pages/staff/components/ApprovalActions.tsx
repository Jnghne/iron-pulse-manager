
import { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { ApprovalActionsDialog } from "./dialogs/ApprovalActionsDialog";
import { Staff } from "../types";

interface ApprovalActionsProps {
  staff: Staff;
}

export const ApprovalActions = memo<ApprovalActionsProps>(({ staff }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');

  const handleApprove = () => {
    setActionType('approve');
    setDialogOpen(true);
  };

  const handleReject = () => {
    setActionType('reject');
    setDialogOpen(true);
  };

  return (
    <>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={handleReject}
          className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
        >
          <XCircle className="h-4 w-4" />
          거절
        </Button>
        <Button 
          onClick={handleApprove}
          className="gap-2 bg-emerald-600 hover:bg-emerald-700"
        >
          <CheckCircle className="h-4 w-4" />
          승인
        </Button>
      </div>

      <ApprovalActionsDialog
        staff={staff}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        actionType={actionType}
      />
    </>
  );
});

ApprovalActions.displayName = 'ApprovalActions';
