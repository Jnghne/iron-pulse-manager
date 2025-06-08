
import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, ArrowLeft } from "lucide-react";
import GymSelectionDialog from "@/components/GymSelectionDialog";

const Login = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'credentials' | 'gym-selection'>('credentials');
  const [credentials, setCredentials] = useState({
    email: "test@test.com",
    password: "1234"
  });
  const [selectedGym, setSelectedGym] = useState("");
  const [selectedGymName, setSelectedGymName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCredentialsSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock authentication
    setTimeout(() => {
      if (credentials.email && credentials.password) {
        // Mock: user has access to multiple gyms
        setStep('gym-selection');
        toast({
          title: "인증 완료",
          description: "사업장을 선택해주세요.",
        });
      } else {
        toast({
          title: "로그인 실패",
          description: "이메일과 비밀번호를 입력해주세요.",
          variant: "destructive"
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleGymSelection = () => {
    if (!selectedGym) {
      toast({
        title: "사업장 선택 필요",
        description: "로그인할 사업장을 선택해주세요.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      // Store authentication state
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userRole", "owner"); // Default to owner for demo
      localStorage.setItem("selectedGym", selectedGym);
      localStorage.setItem("selectedGymName", selectedGymName);
      localStorage.setItem("userEmail", credentials.email);
      
      toast({
        title: "로그인 성공!",
        description: `${selectedGymName}에 로그인되었습니다.`,
      });
      navigate("/");
      setIsLoading(false);
    }, 1000);
  };

  const handleGymSelect = (gymId: string, gymName: string) => {
    setSelectedGym(gymId);
    setSelectedGymName(gymName);
  };

  const goBackToCredentials = () => {
    setStep('credentials');
    setSelectedGym("");
    setSelectedGymName("");
  };

  if (step === 'gym-selection') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gym-light">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gym-primary">사업장 선택</h1>
            <p className="mt-2 text-sm text-muted-foreground">로그인할 사업장을 선택해주세요</p>
          </div>

          <div className="space-y-6">
            <GymSelectionDialog
              selectedGym={selectedGym}
              onGymSelect={handleGymSelect}
            />

            <div className="flex gap-4">
              <Button 
                type="button"
                variant="outline" 
                className="flex-1"
                onClick={goBackToCredentials}
                disabled={isLoading}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                이전
              </Button>
              <Button 
                type="button"
                className="flex-1 bg-gym-primary hover:bg-gym-secondary"
                onClick={handleGymSelection}
                disabled={isLoading || !selectedGym}
              >
                {isLoading ? "로그인 중..." : "로그인"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gym-light">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gym-primary">
            Gym<span className="text-gym-accent">Manager</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">헬스장 관리 시스템에 로그인하세요</p>
        </div>
        
        <Alert className="bg-blue-50 border-blue-200">
          <InfoIcon className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-sm">
            프로토타입 버전입니다. 테스트 계정 정보가 이미 입력되어 있으니 로그인 버튼을 클릭하세요.
          </AlertDescription>
        </Alert>
        
        <form onSubmit={handleCredentialsSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="이메일 주소"
              value={credentials.email}
              onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              placeholder="비밀번호"
              value={credentials.password}
              onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
              disabled={isLoading}
            />
          </div>
          
          <div className="flex justify-end">
            <a href="#" className="text-sm text-gym-primary hover:text-gym-secondary">
              비밀번호 찾기
            </a>
          </div>
          
          <Button type="submit" className="w-full bg-gym-primary hover:bg-gym-secondary" disabled={isLoading}>
            {isLoading ? "인증 중..." : "다음"}
          </Button>
        </form>
        
        <div className="text-center text-sm text-muted-foreground">
          <p>아직 계정이 없으신가요? <button onClick={() => navigate("/signup")} className="text-gym-primary hover:text-gym-secondary">회원가입</button></p>
        </div>
      </div>
      
      <div className="mt-8 text-center text-xs text-muted-foreground">
        <p>© 2023 GymManager. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Login;
