
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Crown } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const Signup = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<"owner" | null>("owner");
  const [agreements, setAgreements] = useState({
    age: false,
    terms: false,
    privacy: false
  });

  const allAgreed = agreements.age && agreements.terms && agreements.privacy;

  const handleContinue = () => {
    if (!selectedRole) {
      toast({
        title: "역할 선택 필요",
        description: "회원가입할 역할을 선택해주세요.",
        variant: "destructive"
      });
      return;
    }

    if (!allAgreed) {
      toast({
        title: "약관 동의 필요",
        description: "모든 필수 약관에 동의해주세요.",
        variant: "destructive"
      });
      return;
    }

    navigate(`/signup/${selectedRole}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gym-light p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gym-primary">
            Gym<span className="text-gym-accent">Manager</span>
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">회원가입</p>
        </div>

        {/* 역할 선택 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-center">사장님 전용 회원가입</h2>
          <div className="flex justify-center">
            <Card className="w-full max-w-md ring-2 ring-gym-primary bg-gym-primary/5">
              <CardHeader className="text-center">
                <Crown className="h-12 w-12 mx-auto text-gym-primary" />
                <CardTitle>사장님 회원가입</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">
                  헬스장을 운영하시는 사장님을 위한 회원가입입니다. 
                  모든 관리 기능을 이용하실 수 있습니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 약관 동의 */}
        <Card>
          <CardHeader>
            <CardTitle>약관 동의</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="age"
                checked={agreements.age}
                onCheckedChange={(checked) => 
                  setAgreements(prev => ({ ...prev, age: checked as boolean }))
                }
              />
              <label htmlFor="age" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                만 14세 이상입니다 (필수)
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="terms"
                checked={agreements.terms}
                onCheckedChange={(checked) => 
                  setAgreements(prev => ({ ...prev, terms: checked as boolean }))
                }
              />
              <label htmlFor="terms" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                이용약관에 동의합니다 (필수)
              </label>
              <Button variant="ghost" size="sm" className="text-gym-primary">
                보기
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="privacy"
                checked={agreements.privacy}
                onCheckedChange={(checked) => 
                  setAgreements(prev => ({ ...prev, privacy: checked as boolean }))
                }
              />
              <label htmlFor="privacy" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                개인정보 수집 및 이용에 동의합니다 (필수)
              </label>
              <Button variant="ghost" size="sm" className="text-gym-primary">
                보기
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => navigate("/login")}
          >
            이전
          </Button>
          <Button 
            className="flex-1 bg-gym-primary hover:bg-gym-secondary"
            onClick={handleContinue}
            disabled={!selectedRole || !allAgreed}
          >
            다음
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
