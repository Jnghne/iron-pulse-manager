
import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("test@test.com");
  const [password, setPassword] = useState("1234");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock login logic - replace with actual API call
    setTimeout(() => {
      try {
        // In a real app, this would be a server-side authentication
        if (email && password) {
          // Store authentication state in localStorage (use a proper auth system in production)
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("userRole", "owner"); // Default to owner for demo
          
          toast({
            title: "로그인 성공!",
            description: "환영합니다.",
          });
          navigate("/");
        } else {
          toast({
            title: "로그인 실패",
            description: "이메일과 비밀번호를 입력해주세요.",
            variant: "destructive"
          });
        }
      } catch (error) {
        toast({
          title: "오류 발생",
          description: "로그인 중 오류가 발생했습니다. 다시 시도해주세요.",
          variant: "destructive"
        });
        console.error("Login error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

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
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="이메일 주소"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div className="flex justify-end">
            <a href="#" className="text-sm text-gym-primary hover:text-gym-secondary">
              비밀번호 찾기
            </a>
          </div>
          
          <Button type="submit" className="w-full bg-gym-primary hover:bg-gym-secondary" disabled={isLoading}>
            {isLoading ? "로그인 중..." : "로그인"}
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
