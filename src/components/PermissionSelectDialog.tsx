import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ShieldCheck } from "lucide-react";

interface PermissionSelectDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (permission: "general" | "master") => void;
  currentPermission: string;
}

export const PermissionSelectDialog = ({ 
  open, 
  onClose, 
  onSelect, 
  currentPermission 
}: PermissionSelectDialogProps) => {
  const [selectedPermission, setSelectedPermission] = useState<"general" | "master" | null>(null);

  // 다이얼로그가 열릴 때 현재 권한으로 초기화
  React.useEffect(() => {
    if (open) {
      setSelectedPermission(currentPermission as "general" | "master");
    }
  }, [open, currentPermission]);

  const handleConfirm = () => {
    if (selectedPermission && selectedPermission !== currentPermission) {
      onSelect(selectedPermission);
    }
  };

  const handleClose = () => {
    setSelectedPermission(null);
    onClose();
  };

  // 현재 권한과 다른 권한이 선택되었을 때만 버튼 활성화
  const isButtonEnabled = selectedPermission && selectedPermission !== currentPermission;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>권한 변경</DialogTitle>
          <DialogDescription>
            변경할 권한을 선택해주세요.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 gap-3">
            <Card 
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedPermission === 'general' ? 'ring-2 ring-gym-primary bg-gym-primary/5' : ''
              }`}
              onClick={() => setSelectedPermission('general')}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-gym-primary" />
                  <CardTitle className="text-sm">일반 권한</CardTitle>
                  {currentPermission === "general" && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">현재</span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground">
                  기본적인 관리 기능만 사용 가능합니다.
                </p>
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedPermission === 'master' ? 'ring-2 ring-gym-primary bg-gym-primary/5' : ''
              }`}
              onClick={() => setSelectedPermission('master')}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-gym-primary" />
                  <CardTitle className="text-sm">마스터 권한</CardTitle>
                  {currentPermission === "master" && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">현재</span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground">
                  모든 관리 기능과 통계, 직원관리 등에 접근 가능합니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleClose} className="flex-1">
            취소
          </Button>
          <Button onClick={handleConfirm} disabled={!isButtonEnabled} className="flex-1">
            다음
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};