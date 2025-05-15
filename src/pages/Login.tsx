
import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Google, Kakao } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isOwner, setIsOwner] = useState(false);
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
          localStorage.setItem("userRole", isOwner ? "owner" : "trainer");
          
          toast.success(`로그인 성공! ${isOwner ? '관장님' : '트레이너'}으로 로그인했습니다.`);
          navigate("/");
        } else {
          toast.error("이메일과 비밀번호를 입력해주세요.");
        }
      } catch (error) {
        toast.error("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
        console.error("Login error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    
    // Mock social login - replace with actual implementation
    setTimeout(() => {
      toast.success(`${provider} 로그인이 시작되었습니다.`);
      toast.info("현재 소셜 로그인은 데모 버전에서 제공되지 않습니다.");
      setIsLoading(false);
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
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch 
                id="owner-mode" 
                checked={isOwner} 
                onCheckedChange={setIsOwner}
                disabled={isLoading}
              />
              <Label htmlFor="owner-mode" className="text-sm">관장님으로 로그인</Label>
            </div>
            
            <a href="#" className="text-sm text-gym-primary hover:text-gym-secondary">
              비밀번호 찾기
            </a>
          </div>
          
          <Button type="submit" className="w-full bg-gym-primary hover:bg-gym-secondary" disabled={isLoading}>
            {isLoading ? "로그인 중..." : "로그인"}
          </Button>
        </form>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-white text-muted-foreground">또는</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSocialLogin("카카오")}
            disabled={isLoading}
            className="flex items-center justify-center space-x-2"
          >
            <Kakao className="w-5 h-5" />
            <span>카카오 로그인</span>
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSocialLogin("구글")}
            disabled={isLoading}
            className="flex items-center justify-center space-x-2"
          >
            <Google className="w-5 h-5" />
            <span>구글 로그인</span>
          </Button>
        </div>
        
        <div className="text-center text-sm text-muted-foreground">
          <p>아직 계정이 없으신가요? <a href="#" className="text-gym-primary hover:text-gym-secondary">회원가입</a></p>
        </div>
      </div>
      
      <div className="mt-8 text-center text-xs text-muted-foreground">
        <p>© 2023 GymManager. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Login;
