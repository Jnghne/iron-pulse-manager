import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, CreditCard, Plus } from "lucide-react";
import { Member } from "@/data/mockData";
import { formatDate, cn } from "@/lib/utils";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface PaymentRegistrationDialogProps {
  member: Member;
  type: 'gym' | 'pt' | 'locker' | 'other' | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (paymentData: any) => void;
}

export const PaymentRegistrationDialog = ({ 
  member, 
  type,
  open, 
  onOpenChange, 
  onSave 
}: PaymentRegistrationDialogProps) => {
  const [activeTab, setActiveTab] = useState<string>(type || 'gym');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [product, setProduct] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [actualPrice, setActualPrice] = useState<string>("");
  const [unpaidAmount, setUnpaidAmount] = useState<string>("0");
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [selectedTrainer, setSelectedTrainer] = useState<string>("");
  const [selectedStaff, setSelectedStaff] = useState<string>("");
  const [marketingSource, setMarketingSource] = useState<string>("");
  const [lockerNumber, setLockerNumber] = useState<string>("");
  const [memo, setMemo] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 타입이 변경될 때 activeTab 업데이트
  useEffect(() => {
    if (type) {
      setActiveTab(type);
    }
  }, [type]);

  // 상품 목록 (실제로는 API에서 가져올 수 있음)
  const products = {
    gym: ["헬스 이용권 1개월", "헬스 이용권 3개월", "헬스 이용권 6개월", "헬스 이용권 12개월"],
    pt: ["PT 10회권", "PT 20회권", "PT 30회권", "PT 50회권"],
    locker: ["락커 1개월", "락커 3개월", "락커 6개월", "락커 12개월"],
    other: ["운동복", "식음료", "공간대여", "촬영협조", "기타"]
  };

  // 트레이너 목록 (실제로는 API에서 가져올 수 있음)
  const trainers = ["박지훈", "김지원", "이서연", "최민준"];

  // 직원 목록 (실제로는 API에서 가져올 수 있음)
  const staffs = ["관리자", "박지훈", "김지원", "이서연", "최민준"];

  // 마케팅 경로 목록
  const marketingSources = ["인스타그램", "네이버 검색", "지인 소개", "전단지", "기타"];

  // 락커 번호 목록 (실제로는 API에서 가져올 수 있음)
  const lockers = ["A-01", "A-02", "A-03", "B-01", "B-02", "B-03"];

  const handleSave = () => {
    if (!product) {
      alert("상품을 선택해주세요.");
      return;
    }

    if (!price) {
      alert("상품 금액을 입력해주세요.");
      return;
    }

    if (!actualPrice) {
      alert("실제 결제 금액을 입력해주세요.");
      return;
    }

    if (!selectedStaff) {
      alert("결제 직원을 선택해주세요.");
      return;
    }

    if (activeTab === 'pt' && !selectedTrainer) {
      alert("담당 트레이너를 선택해주세요.");
      return;
    }

    if (activeTab === 'locker' && !lockerNumber) {
      alert("락커 번호를 선택해주세요.");
      return;
    }

    setIsSubmitting(true);
    
    // 결제 데이터 구성
    const paymentData = {
      type: activeTab,
      product,
      startDate: format(selectedDate, 'yyyy-MM-dd'),
      price: parseInt(price.replace(/,/g, '')),
      actualPrice: parseInt(actualPrice.replace(/,/g, '')),
      unpaidAmount: parseInt(unpaidAmount.replace(/,/g, '')),
      paymentMethod,
      staff: selectedStaff,
      trainer: activeTab === 'pt' ? selectedTrainer : undefined,
      lockerNumber: activeTab === 'locker' ? lockerNumber : undefined,
      marketingSource,
      memo
    };
    
    // 실제 구현에서는 API 호출 등의 로직이 들어갈 수 있음
    setTimeout(() => {
      onSave(paymentData);
      setIsSubmitting(false);
      resetForm();
    }, 500);
  };

  const resetForm = () => {
    setProduct("");
    setPrice("");
    setActualPrice("");
    setUnpaidAmount("0");
    setPaymentMethod("card");
    setSelectedTrainer("");
    setSelectedStaff("");
    setMarketingSource("");
    setLockerNumber("");
    setMemo("");
    setSelectedDate(new Date());
  };

  // 금액 입력 시 천 단위 콤마 추가
  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/[^\d]/g, '');
    return numericValue ? parseInt(numericValue).toLocaleString() : '';
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetForm();
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <CreditCard className="h-5 w-5 text-gym-primary" />
            결제 등록
          </DialogTitle>
          <DialogDescription>
            {member.name} 회원의 결제 정보를 등록합니다.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="gym">헬스 이용권</TabsTrigger>
            <TabsTrigger value="pt">PT 레슨권</TabsTrigger>
            <TabsTrigger value="locker">락커 이용권</TabsTrigger>
            <TabsTrigger value="other">기타 상품</TabsTrigger>
          </TabsList>

          <div className="space-y-4 py-4">
            {/* 공통 필드: 상품 선택 */}
            <div className="space-y-2">
              <Label htmlFor="product">구매 상품</Label>
              <Select value={product} onValueChange={setProduct}>
                <SelectTrigger>
                  <SelectValue placeholder="상품을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {products[activeTab as keyof typeof products].map((prod) => (
                    <SelectItem key={prod} value={prod}>{prod}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 공통 필드: 시작일 */}
            <div className="space-y-2">
              <Label>시작일</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, 'PPP', { locale: ko }) : "날짜를 선택하세요"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* PT 전용 필드: 담당 트레이너 */}
            {activeTab === 'pt' && (
              <div className="space-y-2">
                <Label htmlFor="trainer">담당 트레이너</Label>
                <Select value={selectedTrainer} onValueChange={setSelectedTrainer}>
                  <SelectTrigger>
                    <SelectValue placeholder="트레이너를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {trainers.map((trainer) => (
                      <SelectItem key={trainer} value={trainer}>{trainer}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* 락커 전용 필드: 락커 번호 */}
            {activeTab === 'locker' && (
              <div className="space-y-2">
                <Label htmlFor="lockerNumber">락커 번호</Label>
                <Select value={lockerNumber} onValueChange={setLockerNumber}>
                  <SelectTrigger>
                    <SelectValue placeholder="락커 번호를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {lockers.map((locker) => (
                      <SelectItem key={locker} value={locker}>{locker}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* 공통 필드: 결제 직원 */}
            <div className="space-y-2">
              <Label htmlFor="staff">결제 직원</Label>
              <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                <SelectTrigger>
                  <SelectValue placeholder="직원을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {staffs.map((staff) => (
                    <SelectItem key={staff} value={staff}>{staff}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 공통 필드: 결제 정보 */}
            <div className="space-y-4">
              <Label>결제 정보</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">결제 수단</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="card">카드</SelectItem>
                      <SelectItem value="cash">현금</SelectItem>
                      <SelectItem value="transfer">계좌이체</SelectItem>
                      <SelectItem value="other">기타</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="marketingSource">방문 경로</Label>
                  <Select value={marketingSource} onValueChange={setMarketingSource}>
                    <SelectTrigger>
                      <SelectValue placeholder="선택 (선택사항)" />
                    </SelectTrigger>
                    <SelectContent>
                      {marketingSources.map((source) => (
                        <SelectItem key={source} value={source}>{source}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* 공통 필드: 금액 정보 */}
            <div className="space-y-4">
              <Label>금액 정보</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">상품 금액</Label>
                  <div className="relative">
                    <Input
                      id="price"
                      value={price}
                      onChange={(e) => setPrice(formatCurrency(e.target.value))}
                      className="pl-8"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₩</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="actualPrice">실제 결제 금액</Label>
                  <div className="relative">
                    <Input
                      id="actualPrice"
                      value={actualPrice}
                      onChange={(e) => setActualPrice(formatCurrency(e.target.value))}
                      className="pl-8"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₩</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="staffCommission">직원 매출 실적</Label>
                  <div className="relative">
                    <Input
                      id="staffCommission"
                      value={actualPrice}
                      disabled
                      className="pl-8 bg-muted"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₩</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unpaidAmount">미수금</Label>
                  <div className="relative">
                    <Input
                      id="unpaidAmount"
                      value={unpaidAmount}
                      onChange={(e) => setUnpaidAmount(formatCurrency(e.target.value))}
                      className="pl-8"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₩</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 공통 필드: 메모 */}
            <div className="space-y-2">
              <Label htmlFor="memo">메모</Label>
              <Textarea
                id="memo"
                placeholder="추가 메모 사항이 있으면 입력하세요"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                rows={2}
              />
            </div>
          </div>
        </Tabs>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSubmitting}
            className="bg-gym-primary hover:bg-gym-primary/90"
          >
            {isSubmitting ? "처리 중..." : "등록"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
