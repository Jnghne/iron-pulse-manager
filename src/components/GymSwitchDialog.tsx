
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, Check } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface Gym {
  id: string;
  name: string;
  role: "owner" | "trainer";
  status: "active" | "pending" | "suspended";
}

interface GymSwitchDialogProps {
  open: boolean;
  onClose: () => void;
  currentGymId: string;
  affiliatedGyms: Gym[];
  onGymSwitch: (gymId: string, gymName: string) => void;
}

const GymSwitchDialog = ({ 
  open, 
  onClose, 
  currentGymId, 
  affiliatedGyms, 
  onGymSwitch 
}: GymSwitchDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "owner":
        return <Badge className="bg-blue-100 text-blue-800">관장</Badge>;
      case "trainer":
        return <Badge className="bg-purple-100 text-purple-800">트레이너</Badge>;
      default:
        return <Badge variant="outline">일반</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">활성</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">승인대기</Badge>;
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">정지</Badge>;
      default:
        return <Badge variant="outline">알 수 없음</Badge>;
    }
  };

  const handleGymSwitch = (gym: Gym) => {
    if (gym.status !== "active") {
      toast({
        title: "사업장 변경 불가",
        description: "활성 상태의 사업장만 선택할 수 있습니다.",
        variant: "destructive"
      });
      return;
    }

    if (gym.id === currentGymId) {
      onClose();
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      // Update localStorage
      localStorage.setItem("selectedGym", gym.id);
      localStorage.setItem("selectedGymName", gym.name);
      localStorage.setItem("userRole", gym.role);
      
      onGymSwitch(gym.id, gym.name);
      toast({
        title: "사업장 변경 완료",
        description: `${gym.name}으로 변경되었습니다.`
      });
      setIsLoading(false);
      onClose();
      
      // Refresh the page to apply changes
      window.location.reload();
    }, 1000);
  };

  const activeGyms = affiliatedGyms.filter(gym => gym.status === "active");
  const inactiveGyms = affiliatedGyms.filter(gym => gym.status !== "active");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            사업장 변경
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* 활성 사업장 */}
          {activeGyms.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium text-sm text-muted-foreground">이용 가능한 사업장</h3>
              {activeGyms.map((gym) => (
                <div 
                  key={gym.id}
                  className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                    gym.id === currentGymId 
                      ? "border-gym-primary bg-gym-primary/5" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleGymSwitch(gym)}
                >
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-gym-primary" />
                    <div>
                      <h4 className="font-medium">{gym.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        {getRoleBadge(gym.role)}
                        {getStatusBadge(gym.status)}
                      </div>
                    </div>
                  </div>
                  {gym.id === currentGymId && (
                    <Check className="h-5 w-5 text-gym-primary" />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 비활성 사업장 */}
          {inactiveGyms.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium text-sm text-muted-foreground">이용 불가능한 사업장</h3>
              {inactiveGyms.map((gym) => (
                <div 
                  key={gym.id}
                  className="flex items-center justify-between p-3 border rounded-lg opacity-60"
                >
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">{gym.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        {getRoleBadge(gym.role)}
                        {getStatusBadge(gym.status)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              닫기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GymSwitchDialog;
