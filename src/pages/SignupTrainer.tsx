
import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { User, Lock, Mail, Building2, Shield, ArrowLeft, Dumbbell, CheckCircle2 } from "lucide-react";
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
  
  const getProgressPercentage = () => {
    const fields = ['passVerified', 'userId', 'password', 'passwordConfirm', 'email', 'businessLocation'];
    const filledFields = fields.filter(field => formData[field as keyof typeof formData]).length;
    return Math.round((filledFields / fields.length) * 100);
  };

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/signup")}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              이전
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900">
                <Dumbbell className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">트레이너 회원가입</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">전문 트레이너로 시작하세요</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress Section */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-gray-100 dark:bg-gray-700">
                  <CheckCircle2 className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">가입 진행률</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">완료: {getProgressPercentage()}%</p>
                </div>
              </div>
              <div className="text-xl font-semibold text-gray-900 dark:text-white">
                {getProgressPercentage()}%
              </div>
            </div>
            <Progress value={getProgressPercentage()} className="h-2" />
          </div>
        </div>

        {/* Form Card */}
        <Card className="shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
            <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center gap-3 font-medium">
              <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              회원정보 입력
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* 본인인증 섹션 */}
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-6 bg-gray-50 dark:bg-gray-700/30">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  <h3 className="font-medium text-gray-900 dark:text-white">본인인증</h3>
                </div>
                <PassVerification
                  onVerificationComplete={handlePassVerification}
                  isVerified={formData.passVerified}
                />
              </div>

              {/* 계정 정보 섹션 */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  <h3 className="font-medium text-gray-900 dark:text-white">계정 정보</h3>
                </div>
                
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="userId" className="text-sm font-medium text-gray-700 dark:text-gray-300">아이디 *</Label>
                    <Input
                      id="userId"
                      placeholder="아이디를 입력하세요"
                      value={formData.userId}
                      onChange={(e) => handleInputChange("userId", e.target.value)}
                      className="h-11 border-gray-300 dark:border-gray-600 focus:border-gray-900 dark:focus:border-gray-400 focus:ring-gray-900 dark:focus:ring-gray-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">비밀번호 *</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="비밀번호를 입력하세요"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className="h-11 border-gray-300 dark:border-gray-600 focus:border-gray-900 dark:focus:border-gray-400 focus:ring-gray-900 dark:focus:ring-gray-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="passwordConfirm" className="text-sm font-medium text-gray-700 dark:text-gray-300">비밀번호 확인 *</Label>
                      <Input
                        id="passwordConfirm"
                        type="password"
                        placeholder="비밀번호를 다시 입력하세요"
                        value={formData.passwordConfirm}
                        onChange={(e) => handleInputChange("passwordConfirm", e.target.value)}
                        className="h-11 border-gray-300 dark:border-gray-600 focus:border-gray-900 dark:focus:border-gray-400 focus:ring-gray-900 dark:focus:ring-gray-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">이메일 주소 *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="h-11 border-gray-300 dark:border-gray-600 focus:border-gray-900 dark:focus:border-gray-400 focus:ring-gray-900 dark:focus:ring-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* 근무지 정보 섹션 */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  <h3 className="font-medium text-gray-900 dark:text-white">근무지 정보</h3>
                </div>
                <GymSelectionDialog
                  selectedGym={formData.businessLocation}
                  onGymSelect={handleGymSelect}
                />
              </div>

              <div className="pt-8">
                <Button 
                  type="submit"
                  size="lg"
                  className="w-full h-12 font-medium bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white dark:border-gray-900"></div>
                      가입 중...
                    </div>
                  ) : (
                    "트레이너 회원가입 완료"
                  )}
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
