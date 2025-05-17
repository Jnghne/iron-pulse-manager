
import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { generateMemberId, formatPhoneNumber, isValidPhoneNumber } from "@/lib/utils";
import { DatePicker } from "@/components/DatePicker";
import { Textarea } from "@/components/ui/textarea";

const MemberCreate = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [address, setAddress] = useState("");
  const [birthDate, setBirthDate] = useState<Date>(new Date());
  const [memo, setMemo] = useState("");
  const [hasMembership, setHasMembership] = useState(false);
  const [membershipMonths, setMembershipMonths] = useState("1");
  const [hasPT, setHasPT] = useState(false);
  const [ptSessions, setPTSessions] = useState("10");
  const [ptExpiryMonths, setPtExpiryMonths] = useState("3");
  const [trainerAssigned, setTrainerAssigned] = useState("");
  
  // Handle phone number input with formatting
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove non-numeric characters and format
    const cleaned = e.target.value.replace(/\D/g, "");
    setPhoneNumber(formatPhoneNumber(cleaned));
  };
  
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Basic validation
    if (!name.trim()) {
      toast.error("회원 이름을 입력해주세요.");
      setIsSubmitting(false);
      return;
    }
    
    if (!isValidPhoneNumber(phoneNumber)) {
      toast.error("유효한 핸드폰 번호를 입력해주세요.");
      setIsSubmitting(false);
      return;
    }
    
    // Mock form submission
    setTimeout(() => {
      try {
        // Generate unique member ID
        const memberId = generateMemberId();
        
        // Get current date
        const now = new Date();
        const registrationDate = now.toISOString().split("T")[0];
        
        // Calculate membership dates if applicable
        let membershipStartDate = null;
        let membershipEndDate = null;
        
        if (hasMembership) {
          membershipStartDate = registrationDate;
          const endDate = new Date(now);
          endDate.setMonth(now.getMonth() + parseInt(membershipMonths));
          membershipEndDate = endDate.toISOString().split("T")[0];
        }
        
        // Calculate PT expiry date if applicable
        let ptExpireDate = null;
        if (hasPT) {
          const expireDate = new Date(now);
          expireDate.setMonth(now.getMonth() + parseInt(ptExpiryMonths));
          ptExpireDate = expireDate.toISOString().split("T")[0];
        }
        
        // In a real app, this would be an API call to create a member
        toast.success(`${name} 회원이 성공적으로 등록되었습니다.`, {
          description: `회원번호: ${memberId}`,
        });
        
        // Redirect to member list
        navigate("/members");
      } catch (error) {
        console.error("Error creating member:", error);
        toast.error("회원 등록 중 오류가 발생했습니다. 다시 시도해주세요.");
      } finally {
        setIsSubmitting(false);
      }
    }, 1000);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">회원 등록</h1>
        <p className="text-muted-foreground">새로운 회원 정보를 등록하세요.</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>회원 기본 정보</CardTitle>
            <CardDescription>회원의 기본 정보를 입력하세요.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name - top row, full width */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name">회원 이름</Label>
                <Input
                  id="name"
                  placeholder="이름을 입력하세요"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              
              {/* Phone and Birth Date - second row, side by side */}
              <div className="space-y-2">
                <Label htmlFor="phone">핸드폰 번호</Label>
                <Input
                  id="phone"
                  placeholder="010-0000-0000"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birth-date">생년월일</Label>
                <DatePicker
                  selected={birthDate}
                  onSelect={setBirthDate}
                  className="w-full"
                />
              </div>
              
              {/* Postal Code and Address - third row, side by side */}
              <div className="space-y-2">
                <Label htmlFor="postal-code">우편번호</Label>
                <Input
                  id="postal-code"
                  placeholder="00000"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">상세 주소</Label>
                <Input
                  id="address"
                  placeholder="주소를 입력하세요"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              {/* Memo - bottom row, full width */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="memo">메모</Label>
                <Textarea
                  id="memo"
                  placeholder="특이사항이나 메모를 입력하세요"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            
            {/* Membership Information */}
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="membership">헬스장 이용권</Label>
                  <div className="text-sm text-muted-foreground">
                    회원이 헬스장 이용권을 구매했는지 설정하세요.
                  </div>
                </div>
                <Switch
                  id="membership"
                  checked={hasMembership}
                  onCheckedChange={setHasMembership}
                  disabled={isSubmitting}
                />
              </div>
              
              {hasMembership && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-0 md:pl-6 border-l-0 md:border-l border-border">
                  <div className="space-y-2">
                    <Label htmlFor="membership-months">이용 개월 수</Label>
                    <Select
                      defaultValue={membershipMonths}
                      onValueChange={setMembershipMonths}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="이용 기간 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1개월</SelectItem>
                        <SelectItem value="3">3개월</SelectItem>
                        <SelectItem value="6">6개월</SelectItem>
                        <SelectItem value="12">12개월</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
            
            {/* PT Information */}
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="pt">PT 이용권</Label>
                  <div className="text-sm text-muted-foreground">
                    회원이 PT 이용권을 구매했는지 설정하세요.
                  </div>
                </div>
                <Switch
                  id="pt"
                  checked={hasPT}
                  onCheckedChange={setHasPT}
                  disabled={isSubmitting}
                />
              </div>
              
              {hasPT && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pl-0 md:pl-6 border-l-0 md:border-l border-border">
                  <div className="space-y-2">
                    <Label htmlFor="pt-sessions">PT 횟수</Label>
                    <Select
                      defaultValue={ptSessions}
                      onValueChange={setPTSessions}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="PT 횟수 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10회</SelectItem>
                        <SelectItem value="20">20회</SelectItem>
                        <SelectItem value="30">30회</SelectItem>
                        <SelectItem value="40">40회</SelectItem>
                        <SelectItem value="50">50회</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pt-expiry">만료 기간</Label>
                    <Select
                      defaultValue={ptExpiryMonths}
                      onValueChange={setPtExpiryMonths}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="만료 기간 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3개월</SelectItem>
                        <SelectItem value="6">6개월</SelectItem>
                        <SelectItem value="12">12개월</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="trainer">담당 트레이너</Label>
                    <Select
                      value={trainerAssigned}
                      onValueChange={setTrainerAssigned}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="트레이너 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="박지훈">박지훈</SelectItem>
                        <SelectItem value="최수진">최수진</SelectItem>
                        <SelectItem value="김태양">김태양</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end mt-6 space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/members")}
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button 
            type="submit" 
            className="bg-gym-primary hover:bg-gym-secondary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "처리 중..." : "회원 등록"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MemberCreate;
