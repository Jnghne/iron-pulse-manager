
import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import GymSelectionDialog from "@/components/GymSelectionDialog";
import PassVerification from "@/components/PassVerification";

const SignupTrainer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    passVerified: false,
    userId: "",
    password: "",
    passwordConfirm: "",
    email: "",
    businessLocation: "",
    businessLocationName: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGymSelect = (gymId: string, gymName: string) => {
    setFormData(prev => ({ 
      ...prev, 
      businessLocation: gymId,
      businessLocationName: gymName 
    }));
  };

  const handlePassVerification = (isVerified: boolean) => {
    setFormData(prev => ({ ...prev, passVerified: isVerified }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.passVerified) {
      toast({
        title: "본인인증 필요",
        description: "PASS 본인인증을 완료해주세요.",
        variant: "destructive"
      });
      return;
    }

    if (formData.password !== formData.passwordConfirm) {
      toast({
        title: "비밀번호 불일치",
        description: "비밀번호가 일치하지 않습니다.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.userId || !formData.password || !formData.email || !formData.businessLocation) {
      toast({
        title: "필수 정보 입력",
        description: "모든 필수 정보를 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Mock signup
    setTimeout(() => {
      toast({
        title: "회원가입 완료",
        description: "트레이너 계정이 성공적으로 생성되었습니다."
      });
      navigate("/login");
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gym-light p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gym-primary">트레이너 회원가입</h1>
          <p className="text-muted-foreground">근무 정보를 입력해주세요</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>회원정보 입력</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* PASS 본인인증 */}
              <PassVerification
                onVerificationComplete={handlePassVerification}
                isVerified={formData.passVerified}
              />

              {/* 아이디 */}
              <div className="space-y-2">
                <Label htmlFor="userId">아이디 *</Label>
                <Input
                  id="userId"
                  placeholder="아이디를 입력하세요"
                  value={formData.userId}
                  onChange={(e) => handleInputChange("userId", e.target.value)}
                />
              </div>

              {/* 비밀번호 */}
              <div className="space-y-2">
                <Label htmlFor="password">비밀번호 *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                />
              </div>

              {/* 비밀번호 확인 */}
              <div className="space-y-2">
                <Label htmlFor="passwordConfirm">비밀번호 확인 *</Label>
                <Input
                  id="passwordConfirm"
                  type="password"
                  placeholder="비밀번호를 다시 입력하세요"
                  value={formData.passwordConfirm}
                  onChange={(e) => handleInputChange("passwordConfirm", e.target.value)}
                />
              </div>

              {/* 이메일 */}
              <div className="space-y-2">
                <Label htmlFor="email">이메일 주소 *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>

              {/* 소속 사업장 선택 */}
              <GymSelectionDialog
                selectedGym={formData.businessLocation}
                onGymSelect={handleGymSelect}
              />

              <div className="flex gap-4 pt-4">
                <Button 
                  type="button"
                  variant="outline" 
                  className="flex-1"
                  onClick={() => navigate("/signup")}
                >
                  이전
                </Button>
                <Button 
                  type="submit"
                  className="flex-1 bg-gym-primary hover:bg-gym-secondary"
                  disabled={isLoading}
                >
                  {isLoading ? "가입 중..." : "회원가입"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignupTrainer;
