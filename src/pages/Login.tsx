
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { Eye, EyeOff, Building2 } from "lucide-react";
import Logo from "@/components/ui/logo";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simple authentication logic
    setTimeout(() => {
      if (email === "owner@test.com" && password === "owner123") {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userRole", "owner");
        localStorage.setItem("userPermission", "general");
        localStorage.setItem("userEmail", email);
        localStorage.setItem("selectedGym", "seoul-gangnam");
        localStorage.setItem("selectedGymName", "강남 피트니스 센터");
        toast({
          title: "로그인 성공",
          description: "사장님 계정으로 로그인되었습니다."
        });
        navigate("/");
      } else {
        toast({
          title: "로그인 실패",
          description: "이메일 또는 비밀번호가 올바르지 않습니다.",
          variant: "destructive"
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleTestLogin = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userRole", "owner");
      localStorage.setItem("userPermission", "general");
      localStorage.setItem("userEmail", "owner@test.com");
      localStorage.setItem("selectedGym", "seoul-gangnam");
      localStorage.setItem("selectedGymName", "강남 피트니스 센터");
      
      toast({
        title: "테스트 로그인 성공",
        description: "사장님 계정으로 로그인되었습니다."
      });
      navigate("/");
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gym-primary/10 to-gym-secondary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <Logo />
          <div>
            <CardTitle className="text-2xl">로그인</CardTitle>
            <CardDescription>
              계정에 로그인하여 피트니스 센터를 관리하세요
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호를 입력하세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full bg-gym-primary hover:bg-gym-primary/90" disabled={isLoading}>
              {isLoading ? "로그인 중..." : "로그인"}
            </Button>
          </form>

          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  테스트 계정으로 빠른 로그인
                </span>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={handleTestLogin}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Building2 className="h-4 w-4" />
                사장님 계정으로 로그인
              </Button>
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              계정이 없으신가요?{" "}
              <Link to="/signup" className="text-gym-primary hover:underline">
                회원가입
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
