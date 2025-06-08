
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building, FileCheck } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Mock data for business registration verification
const businessRegistry = {
  "123-45-67890": { name: "강남 피트니스 센터", id: "seoul-gangnam" },
  "098-76-54321": { name: "홍대 스포츠 클럽", id: "seoul-hongdae" },
  "555-66-77888": { name: "신규 헬스클럽", id: "new-gym-001" },
  "777-88-99000": { name: "부산 해변 헬스", id: "busan-beach" }
};

interface OwnerGymAddDialogProps {
  open: boolean;
  onClose: () => void;
  onGymAdd: (gymId: string, gymName: string) => void;
}

const OwnerGymAddDialog = ({ open, onClose, onGymAdd }: OwnerGymAddDialogProps) => {
  const [businessNumber, setBusinessNumber] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const formatBusinessNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as XXX-XX-XXXXX
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 5) {
      return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    } else {
      return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5, 10)}`;
    }
  };

  const handleBusinessNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatBusinessNumber(e.target.value);
    setBusinessNumber(formatted);
  };

  const handleVerifyAndAdd = () => {
    if (!businessNumber) {
      toast({
        title: "사업자번호 입력 필요",
        description: "사업자번호를 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);

    // Mock verification
    setTimeout(() => {
      const gymInfo = businessRegistry[businessNumber as keyof typeof businessRegistry];
      
      if (gymInfo) {
        onGymAdd(gymInfo.id, gymInfo.name);
        toast({
          title: "사업장 추가 완료",
          description: `${gymInfo.name}이 성공적으로 추가되었습니다.`
        });
        setBusinessNumber("");
        onClose();
      } else {
        toast({
          title: "사업자번호 확인 실패",
          description: "입력하신 사업자번호와 일치하는 사업장을 찾을 수 없습니다.",
          variant: "destructive"
        });
      }
      setIsVerifying(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            사업장 추가 (사장님)
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="businessNumber">사업자등록번호 *</Label>
            <Input
              id="businessNumber"
              placeholder="123-45-67890"
              value={businessNumber}
              onChange={handleBusinessNumberChange}
              maxLength={12}
              disabled={isVerifying}
            />
            <p className="text-xs text-muted-foreground">
              사업자등록번호가 일치하면 자동으로 사업장이 추가됩니다.
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} disabled={isVerifying}>
              취소
            </Button>
            <Button 
              onClick={handleVerifyAndAdd} 
              disabled={isVerifying || !businessNumber}
              className="flex items-center gap-2"
            >
              {isVerifying ? (
                "확인 중..."
              ) : (
                <>
                  <FileCheck className="h-4 w-4" />
                  확인 후 추가
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OwnerGymAddDialog;
