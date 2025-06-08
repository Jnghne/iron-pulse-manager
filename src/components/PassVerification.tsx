
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Shield, CheckCircle } from "lucide-react";

interface PassVerificationProps {
  onVerificationComplete: (isVerified: boolean) => void;
  isVerified: boolean;
}

const PassVerification = ({ onVerificationComplete, isVerified }: PassVerificationProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePassVerification = async () => {
    setIsLoading(true);
    
    try {
      // PASS 인증 서비스 연동 로직
      // 실제 구현시에는 PASS SDK 또는 API를 호출
      toast({
        title: "PASS 인증 시작",
        description: "PASS 앱으로 이동합니다..."
      });

      // Mock implementation - 실제로는 PASS 인증 결과를 받아야 함
      setTimeout(() => {
        // 성공적인 인증 시뮬레이션
        onVerificationComplete(true);
        toast({
          title: "본인인증 완료",
          description: "PASS 인증이 성공적으로 완료되었습니다."
        });
        setIsLoading(false);
      }, 3000);

    } catch (error) {
      toast({
        title: "인증 실패",
        description: "PASS 인증 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label>PASS 본인인증 *</Label>
      <div className="flex gap-2">
        <Button
          type="button"
          variant={isVerified ? "secondary" : "outline"}
          onClick={handlePassVerification}
          disabled={isVerified || isLoading}
          className="flex-1 flex items-center gap-2"
        >
          {isVerified ? (
            <>
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>인증완료</span>
            </>
          ) : (
            <>
              <Shield className="h-4 w-4" />
              <span>{isLoading ? "인증 중..." : "PASS 인증하기"}</span>
            </>
          )}
        </Button>
      </div>
      {isVerified && (
        <p className="text-xs text-green-600">✓ PASS 본인인증이 완료되었습니다.</p>
      )}
      {!isVerified && (
        <p className="text-xs text-muted-foreground">
          PASS 앱을 통한 본인인증이 필요합니다.
        </p>
      )}
    </div>
  );
};

export default PassVerification;
