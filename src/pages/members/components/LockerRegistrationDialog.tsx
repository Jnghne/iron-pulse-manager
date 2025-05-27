
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Member } from "@/data/mockData";
import { toast } from "sonner";

interface LockerInfo {
  id: string;
  status: 'available' | 'occupied';
  assignedTo?: string;
}

interface LockerRegistrationDialogProps {
  member: Member;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}

export const LockerRegistrationDialog = ({ member, open, onOpenChange, onSave }: LockerRegistrationDialogProps) => {
  // Mock 락커 데이터
  const [lockers] = useState<LockerInfo[]>([
    { id: "A01", status: "available" },
    { id: "A02", status: "occupied", assignedTo: "김철수" },
    { id: "A03", status: "available" },
    { id: "A04", status: "occupied", assignedTo: "이영희" },
    { id: "B01", status: "available" },
    { id: "B02", status: "available" },
    { id: "B03", status: "occupied", assignedTo: member.name },
    { id: "B04", status: "available" },
    { id: "C01", status: "available" },
    { id: "C02", status: "occupied", assignedTo: "박민수" },
    { id: "C03", status: "available" },
    { id: "C04", status: "available" },
  ]);

  const [selectedLocker, setSelectedLocker] = useState<string | null>(
    member.lockerId || null
  );

  const handleLockerSelect = (lockerId: string) => {
    const locker = lockers.find(l => l.id === lockerId);
    if (locker?.status === 'available' || locker?.assignedTo === member.name) {
      setSelectedLocker(lockerId === selectedLocker ? null : lockerId);
    }
  };

  const handleSave = () => {
    if (!selectedLocker) {
      toast.error("락커를 선택해주세요.");
      return;
    }
    
    toast.success(`${selectedLocker} 락커가 ${member.name} 회원에게 등록되었습니다.`);
    onSave();
  };

  const handleRemoveLocker = () => {
    setSelectedLocker(null);
    toast.success(`${member.name} 회원의 락커가 해지되었습니다.`);
    onSave();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>락커 등록</DialogTitle>
          <DialogDescription>
            {member.lockerId 
              ? `${member.name} 회원은 현재 ${member.lockerId} 락커를 사용 중입니다.`
              : `${member.name} 회원의 락커를 등록해주세요.`}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="grid grid-cols-4 gap-3">
            {lockers.map((locker) => {
              const isCurrentUserLocker = locker.assignedTo === member.name;
              const isSelected = selectedLocker === locker.id;
              const isAvailable = locker.status === 'available' || isCurrentUserLocker;

              return (
                <Button
                  key={locker.id}
                  variant={isSelected ? "default" : "outline"}
                  className={`h-20 flex flex-col justify-center ${
                    !isAvailable 
                      ? "bg-muted text-muted-foreground cursor-not-allowed hover:bg-muted hover:text-muted-foreground"
                      : isSelected
                      ? "bg-gym-primary hover:bg-gym-primary/90"
                      : "hover:bg-primary/10"
                  }`}
                  onClick={() => handleLockerSelect(locker.id)}
                  disabled={!isAvailable}
                >
                  <div className="text-lg font-bold">{locker.id}</div>
                  <div className="text-xs mt-1">
                    {isCurrentUserLocker
                      ? "현재 사용 중"
                      : locker.status === "available"
                      ? "사용 가능"
                      : "사용 중"}
                  </div>
                  {locker.status === "occupied" && !isCurrentUserLocker && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {locker.assignedTo}
                    </div>
                  )}
                </Button>
              );
            })}
          </div>

          {selectedLocker && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">선택된 락커: {selectedLocker}</p>
                  <p className="text-sm text-muted-foreground">
                    {member.name} 회원에게 할당됩니다.
                  </p>
                </div>
                <Badge className="bg-gym-primary">선택됨</Badge>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <div>
            {member.lockerId && (
              <Button variant="destructive" onClick={handleRemoveLocker}>
                락커 해지
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button onClick={handleSave} disabled={!selectedLocker}>
              등록
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
