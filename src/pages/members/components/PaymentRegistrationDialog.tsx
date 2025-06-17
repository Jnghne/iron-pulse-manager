import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, CreditCard, Plus, Ticket, Users, Lock, Shirt, HelpCircle, X } from "lucide-react";
import { Member } from "@/data/mockData";
import { formatDate, cn } from "@/lib/utils";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { LockerSelector } from '@/components/features/locker/LockerSelector';

// Define the structure for payment data
export interface PaymentData {
  memberId: string;
  memberName: string;
  category: string; // 'gym', 'lesson', 'locker', 'merchandise'
  product: string;
  paymentDate: string; 
  paymentTime: string;
  paymentMethod: string;
  actualPrice: string; 
  unpaidAmount: string; 
  memo?: string;

  // Gym/PT specific
  serviceStartDate?: string; 
  serviceStartTimeOption?: '오전' | '오후';
  purchasePurpose?: string;
  consultant?: string; 
  instructor?: string; 
  price?: string; // Product price
  consultantSalesPerformance?: string; 
  unpaidOrPerformanceShare?: string; 

  // Locker specific
  lockerNumber?: string;
  lockerEndDate?: string; // 락커 종료일
}

interface PaymentRegistrationDialogProps {
  member: Member;
  type: 'gym' | 'lesson' | 'locker' | 'other' | 'merchandise' | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (paymentData: PaymentData) => void;
}

export const PaymentRegistrationDialog = ({ 
  member, 
  type, // This 'type' prop will determine the initial selectedCategory
  open, 
  onOpenChange, 
  onSave 
}: PaymentRegistrationDialogProps) => {
  // 초기 탭 선택 설정 - type이 'merchandise' 또는 'other'인 경우 'merchandise' 탭으로 설정
  const initialCategory = (type === 'merchandise' || type === 'other') ? 'merchandise' : (type || 'gym');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory); // 'gym', 'lesson', 'locker', 'merchandise'
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [product, setProduct] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [actualPrice, setActualPrice] = useState<string>("");
  const [unpaidAmount, setUnpaidAmount] = useState<string>("0");
  // New state variables based on the image
  const [serviceStartTimeOption, setServiceStartTimeOption] = useState<'오전' | '오후'>('오전');
  const [paymentDate, setPaymentDate] = useState<Date>(new Date());
  const [paymentTime, setPaymentTime] = useState<string>(format(new Date(), 'HH:mm'));
  const [purchasePurpose, setPurchasePurpose] = useState<string>("");
  const [consultant, setConsultant] = useState<string>(""); // 상품 상담자 (기존 selectedStaff 대체 가능)
  const [instructor, setInstructor] = useState<string>(""); // 담당 강사 (기존 selectedTrainer 대체 가능)
  const [consultantSalesPerformance, setConsultantSalesPerformance] = useState<string>("0");
  const [unpaidOrPerformanceShare, setUnpaidOrPerformanceShare] = useState<string>("0");
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [selectedTrainer, setSelectedTrainer] = useState<string>("");
  const [selectedStaff, setSelectedStaff] = useState<string>("");
  const [marketingSource, setMarketingSource] = useState<string>("");
  const [lockerNumber, setLockerNumber] = useState<string>("");
  const [selectedLockerNumber, setSelectedLockerNumber] = useState<number | null>(null);
  const [memo, setMemo] = useState<string>("");
  const [lockerEndDate, setLockerEndDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 타입이 변경될 때 activeTab 업데이트
  useEffect(() => {
    if (type) {
      setSelectedCategory(type);
    } else {
      setSelectedCategory('gym'); // 기본값 설정
    }
  }, [type, open]); // open 시에도 초기화될 수 있도록

  // 상품 목록 (실제로는 API에서 가져올 수 있음)
  const products = {
    gym: ["헬스 이용권 1개월", "헬스 이용권 3개월", "헬스 이용권 6개월", "헬스 이용권 12개월"],
    lesson: ["개인레슨 10회권", "개인레슨 20회권", "개인레슨 30회권", "개인레슨 50회권"],
    locker: ["락커 1개월", "락커 3개월", "락커 6개월", "락커 12개월"],
    other: ["운동복", "식음료", "공간대여", "촬영협조", "기타"],
    merchandise: ["운동복 상의", "운동복 하의", "스포츠 양말", "물통", "쉐이커"]
  };

  // 트레이너 목록 (실제로는 API에서 가져올 수 있음)
  const trainers = ["박지훈", "김지원", "이서연", "최민준"];

  // 직원 목록 (실제로는 API에서 가져올 수 있음)
  const staffs = ["오정석", "박지훈", "김지원", "이서연", "최민준", "관리자"]; // 이미지 기반으로 '오정석' 추가

  // 마케팅 경로 목록
  const marketingSources = ["인스타그램", "네이버 검색", "지인 소개", "전단지", "기타"];
  const purchasePurposes = ["다이어트", "근력 증가", "체형 교정", "재활", "바디프로필", "기타"];
  const timeOptions = ['오전', '오후'];
  const paymentMethods = ['카드 결제', '현금 결제', '계좌 이체', '간편 결제'];

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

    // Ensure staff/consultant is selected for all categories
    if (!consultant && !selectedStaff) {
      alert("결제 직원을 선택해주세요.");
      return;
    }

    if (selectedCategory === 'lesson' && !instructor) {
      alert("담당 트레이너를 선택해주세요.");
      return;
    }

    if (selectedCategory === 'locker' && !selectedLockerNumber) {
      alert("락커 번호를 선택해주세요.");
      return;
    }

    setIsSubmitting(true);
    
    // 결제 데이터 구성
    const paymentDataToSave: PaymentData = {
      memberId: member.id,
      memberName: member.name,
      category: selectedCategory,
      product,
      serviceStartDate: format(selectedDate, 'yyyy-MM-dd'),
      serviceStartTimeOption,
      price: price, 
      actualPrice: actualPrice, 
      unpaidAmount: unpaidAmount, 
      consultantSalesPerformance: consultantSalesPerformance, 
      unpaidOrPerformanceShare: unpaidOrPerformanceShare, 
      paymentDate: format(paymentDate, 'yyyy-MM-dd'),
      paymentTime,
      paymentMethod,
      purchasePurpose,
      consultant: consultant || selectedStaff,
      instructor: selectedCategory === 'lesson' ? (instructor || selectedTrainer) : undefined,
      lockerNumber: selectedCategory === 'locker' ? selectedLockerNumber?.toString() : undefined,
      lockerEndDate: selectedCategory === 'locker' && lockerEndDate ? format(lockerEndDate, 'yyyy-MM-dd') : undefined,
      // marketingSource, // PaymentData에 없으므로 제거 또는 인터페이스에 추가 필요
      memo
    };
    
    // 실제 구현에서는 API 호출 등의 로직이 들어갈 수 있음
    setTimeout(() => {
      onSave(paymentDataToSave);
      setIsSubmitting(false);
      resetForm();
    }, 500);
  };

  const resetForm = () => {
    setProduct("");
    setPrice("");
    setActualPrice("");
    setUnpaidAmount("0");
    setPaymentMethod(paymentMethods[0]);
    setInstructor("");
    setConsultant("");
    // setSelectedTrainer(""); // 기존 상태 제거 또는 마이그레이션
    // setSelectedStaff(""); // 기존 상태 제거 또는 마이그레이션
    setServiceStartTimeOption('오전');
    setPaymentDate(new Date());
    setPaymentTime(format(new Date(), 'HH:mm'));
    setPurchasePurpose("");
    setConsultantSalesPerformance("0");
    setUnpaidOrPerformanceShare("0");
    setMarketingSource("");
    setLockerNumber("");
    setSelectedLockerNumber(null);
    setLockerEndDate(undefined);
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
      <DialogContent className={selectedCategory === 'locker' ? "lg:max-w-[1200px] p-0 border-none shadow-lg" : "lg:max-w-[960px] p-0 border-none shadow-lg"}>
        <TooltipProvider>
          <div className="flex h-[600px] border rounded-lg overflow-hidden"> {/* Fixed height for scrollable content */}
            {/* Sidebar */}
            <div className="w-1/4 bg-slate-50 p-4 border-r flex flex-col space-y-2">
              <DialogHeader className="mb-4">
                <DialogTitle className="text-lg">상품 등록</DialogTitle>
              </DialogHeader>
              {
                [
                  { id: 'gym', label: '회원권', icon: Ticket },
                  { id: 'lesson', label: '개인 레슨', icon: Users },
                  { id: 'locker', label: '락커', icon: Lock },
                  { id: 'merchandise', label: '기타 이용권', icon: Shirt },
                ].map(item => (
                  <Button
                    key={item.id}
                    variant={selectedCategory === item.id ? 'default' : 'ghost'}
                    className={`w-full justify-start text-sm h-10 ${selectedCategory === item.id ? 'bg-slate-800 text-white hover:bg-slate-700' : 'hover:bg-slate-200'}`}
                    onClick={() => setSelectedCategory(item.id)}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                ))
              }
            </div>

            {/* Content Area */}
            <div className="w-3/4 flex flex-col">
              <DialogHeader className="p-6 border-b">
                <DialogTitle className="text-xl font-semibold">
                  {selectedCategory === 'gym' && '회원권 추가'}
                  {selectedCategory === 'lesson' && '개인레슨 추가'}
                  {selectedCategory === 'locker' && '락커 추가'}
                  {selectedCategory === 'merchandise' && '기타 이용권 추가'}
                </DialogTitle>
              </DialogHeader>
              
              <div className="p-6 space-y-6 overflow-y-auto flex-grow">
                {/* 회원권 폼 */}
                {(selectedCategory === 'gym' || selectedCategory === 'lesson') && (
                  <>
                    {/* 상품 정보 */}
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <h3 className="text-md font-medium">상품 정보</h3>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="ml-1 w-5 h-5">
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>구매할 상품과 서비스 시작일을 선택합니다.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="product">구매 상품</Label>
                          <Select value={product} onValueChange={setProduct}>
                            <SelectTrigger id="product">
                              <SelectValue placeholder="상품을 선택하세요" />
                            </SelectTrigger>
                            <SelectContent>
                              {products[selectedCategory as keyof typeof products]?.map((prod) => (
                                <SelectItem key={prod} value={prod}>{prod}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="serviceStartDate">서비스 시작일</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button id="serviceStartDate" variant={"outline"} className={cn("w-full justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {selectedDate ? format(selectedDate, "yyyy. MM. dd") : <span>날짜 선택</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar mode="single" selected={selectedDate} onSelect={(date) => setSelectedDate(date || new Date())} initialFocus />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="serviceStartTimeOption" className="opacity-0">시간</Label> {/* Label for spacing */}
                          <Select value={serviceStartTimeOption} onValueChange={(value) => setServiceStartTimeOption(value as '오전' | '오후')}>
                            <SelectTrigger id="serviceStartTimeOption">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {timeOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* 상담 및 강사 정보 */}
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <h3 className="text-md font-medium">담당 직원</h3>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="consultant">상품 상담자</Label>
                          <Select value={consultant} onValueChange={setConsultant}>
                            <SelectTrigger id="consultant">
                              <SelectValue placeholder="상담 직원을 선택하세요" />
                            </SelectTrigger>
                            <SelectContent>
                              {staffs.map(staff => <SelectItem key={staff} value={staff}>{staff}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        {selectedCategory === 'lesson' && (
                          <div className="space-y-1.5">
                            <Label htmlFor="instructor">담당 강사</Label>
                            <Select value={instructor} onValueChange={setInstructor}>
                              <SelectTrigger id="instructor">
                                <SelectValue placeholder="강사를 선택하세요" />
                              </SelectTrigger>
                              <SelectContent>
                                {trainers.map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}
                                <SelectItem value="배정 예정">배정 예정</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 결제 정보 */}
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <h3 className="text-md font-medium">결제 정보</h3>
                        <Tooltip>
                          <TooltipTrigger asChild><Button variant="ghost" size="icon" className="ml-1 w-5 h-5"><HelpCircle className="h-4 w-4 text-muted-foreground" /></Button></TooltipTrigger>
                          <TooltipContent><p>결제 관련 정보를 입력합니다.</p></TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="paymentDate">결제 일시</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button id="paymentDate" variant={"outline"} className={cn("w-full justify-start text-left font-normal", !paymentDate && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {paymentDate ? format(paymentDate, "yyyy. MM. dd") : <span>날짜 선택</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar mode="single" selected={paymentDate} onSelect={(date) => setPaymentDate(date || new Date())} initialFocus />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="paymentTime" className="opacity-0">시간</Label>
                          <Input id="paymentTime" type="time" value={paymentTime} onChange={(e) => setPaymentTime(e.target.value)} />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="paymentMethod">결제 수단</Label>
                          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                            <SelectTrigger id="paymentMethod"><SelectValue placeholder="결제 수단을 선택하세요" /></SelectTrigger>
                            <SelectContent>{paymentMethods.map(method => <SelectItem key={method} value={method}>{method}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="purchasePurpose">구매 목적</Label>
                          <Select value={purchasePurpose} onValueChange={setPurchasePurpose}>
                            <SelectTrigger id="purchasePurpose"><SelectValue placeholder="구매 목적을 선택하세요" /></SelectTrigger>
                            <SelectContent>{purchasePurposes.map(purpose => <SelectItem key={purpose} value={purpose}>{purpose}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    
                    {/* 금액 정보 */}
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <h3 className="text-md font-medium">금액 정보</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="price">상품 금액</Label>
                          <div className="relative"><Input id="price" value={price} onChange={(e) => setPrice(formatCurrency(e.target.value))} /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">원</span></div>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="actualPrice">실제 결제 금액</Label>
                          <div className="relative"><Input id="actualPrice" value={actualPrice} onChange={(e) => setActualPrice(formatCurrency(e.target.value))} /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">원</span></div>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="consultantSalesPerformance">상품 상담자 매출 실적</Label>
                          <div className="relative"><Input id="consultantSalesPerformance" value={consultantSalesPerformance} onChange={(e) => setConsultantSalesPerformance(formatCurrency(e.target.value))} /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">원</span></div>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="unpaidOrPerformanceShare">미수금 / 실적 배분</Label>
                          <div className="relative"><Input id="unpaidOrPerformanceShare" value={unpaidOrPerformanceShare} onChange={(e) => setUnpaidOrPerformanceShare(formatCurrency(e.target.value))} /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">원</span></div>
                        </div>
                      </div>
                    </div>

                    {/* 메모 */}
                     <div className="space-y-1.5">
                       <Label htmlFor="memo">메모</Label>
                       <Textarea id="memo" value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="특이사항을 입력하세요 (선택 사항)" />
                     </div>
                  </> 
                )}

                {/* 락커 관련 필드 */}
                {selectedCategory === 'locker' && (
                  <>
                    {/* 상품 정보 */}
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <h3 className="text-md font-medium">상품 정보</h3>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="ml-1 w-5 h-5">
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>락커 상품과 이용 기간을 선택합니다.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="product-locker">락커 상품</Label>
                          <Select value={product} onValueChange={(value) => { setProduct(value); /* 상품 선택 시 가격 자동 설정 로직 추가 가능 */ }}>
                            <SelectTrigger id="product-locker"><SelectValue placeholder="락커 종류를 선택하세요" /></SelectTrigger>
                            <SelectContent>{products.locker.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="locker-serviceStartDate">서비스 시작일</Label>
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
                                {selectedDate ? format(selectedDate, "yyyy. MM. dd") : <span>날짜 선택</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={(date) => setSelectedDate(date || new Date())}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="locker-endDate">락커 종료일</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !lockerEndDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {lockerEndDate ? format(lockerEndDate, "yyyy. MM. dd") : <span>날짜 선택</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={lockerEndDate}
                                onSelect={(date) => setLockerEndDate(date || undefined)}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </div>

                    {/* 상품 담당자 */}
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <h3 className="text-md font-medium">상품 담당자</h3>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="consultant-locker">결제 직원</Label>
                          <Select value={consultant} onValueChange={setConsultant}>
                            <SelectTrigger id="consultant-locker">
                              <SelectValue placeholder="결제 직원을 선택하세요" />
                            </SelectTrigger>
                            <SelectContent>
                              {staffs.map(staff => <SelectItem key={staff} value={staff}>{staff}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* 결제 정보 */}
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <h3 className="text-md font-medium">결제 정보</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="price-locker">상품 금액</Label>
                          <div className="relative">
                            <Input 
                              id="price-locker" 
                              value={price} 
                              onChange={(e) => setPrice(formatCurrency(e.target.value))} 
                              placeholder="상품 금액 입력" 
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">원</span>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="actualPrice-locker">실제 결제 금액</Label>
                          <div className="relative">
                            <Input 
                              id="actualPrice-locker" 
                              value={actualPrice} 
                              onChange={(e) => setActualPrice(formatCurrency(e.target.value))} 
                              placeholder="실제 결제 금액 입력" 
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">원</span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="consultantSalesPerformance-locker">상담자 매출 실적</Label>
                          <div className="relative">
                            <Input 
                              id="consultantSalesPerformance-locker" 
                              value={consultantSalesPerformance} 
                              onChange={(e) => setConsultantSalesPerformance(formatCurrency(e.target.value))} 
                              placeholder="상담자 매출 실적 입력" 
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">원</span>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="unpaidOrPerformanceShare-locker">미수금/실적배분</Label>
                          <div className="relative">
                            <Input 
                              id="unpaidOrPerformanceShare-locker" 
                              value={unpaidOrPerformanceShare} 
                              onChange={(e) => setUnpaidOrPerformanceShare(formatCurrency(e.target.value))} 
                              placeholder="미수금/실적배분 입력" 
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">원</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 락커 정보 */}
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <h3 className="text-md font-medium">락커 정보</h3>
                      </div>
                      <div className="space-y-1.5">
                        <Label>락커 선택</Label>
                        <LockerSelector
                          selectedLocker={selectedLockerNumber}
                          onLockerSelect={setSelectedLockerNumber}
                        />
                      </div>
                    </div>

                    {/* 추가 정보 */}
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <h3 className="text-md font-medium">추가 정보</h3>
                      </div>
                      <div className="space-y-1.5">
                         <Label htmlFor="memo-locker">메모</Label>
                         <Textarea id="memo-locker" value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="특이사항을 입력하세요 (선택 사항)" />
                       </div>
                    </div>
                  </>
                )}

                {/* 기타 이용권 폼 */}
                {selectedCategory === 'merchandise' && (
                  <>
                    {/* 상품 정보 */}
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <h3 className="text-md font-medium">상품 정보</h3>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="ml-1 w-5 h-5">
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>구매할 기타 이용권과 서비스 시작일을 선택합니다.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="product-other">구매 상품</Label>
                          <Select value={product} onValueChange={setProduct}>
                            <SelectTrigger id="product-other">
                              <SelectValue placeholder="기타 이용권을 선택하세요" />
                            </SelectTrigger>
                            <SelectContent>
                              {products.merchandise.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="serviceStartDate-other">서비스 시작일</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button id="serviceStartDate-other" variant={"outline"} className={cn("w-full justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {selectedDate ? format(selectedDate, "yyyy. MM. dd") : <span>날짜 선택</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar mode="single" selected={selectedDate} onSelect={(date) => setSelectedDate(date || new Date())} initialFocus />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="serviceStartTimeOption-other" className="opacity-0">시간</Label>
                          <Select value={serviceStartTimeOption} onValueChange={(value) => setServiceStartTimeOption(value as '오전' | '오후')}>
                            <SelectTrigger id="serviceStartTimeOption-other">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {timeOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* 상담 및 담당자 정보 */}
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <h3 className="text-md font-medium">상품 상담자</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="consultant-other">상품 상담자</Label>
                          <Select value={consultant} onValueChange={setConsultant}>
                            <SelectTrigger id="consultant-other">
                              <SelectValue placeholder="상담 직원을 선택하세요" />
                            </SelectTrigger>
                            <SelectContent>
                              {staffs.map(staff => <SelectItem key={staff} value={staff}>{staff}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* 결제 정보 */}
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <h3 className="text-md font-medium">결제 정보</h3>
                        <Tooltip>
                          <TooltipTrigger asChild><Button variant="ghost" size="icon" className="ml-1 w-5 h-5"><HelpCircle className="h-4 w-4 text-muted-foreground" /></Button></TooltipTrigger>
                          <TooltipContent><p>결제 관련 정보를 입력합니다.</p></TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="paymentDate-other">결제 일시</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button id="paymentDate-other" variant={"outline"} className={cn("w-full justify-start text-left font-normal", !paymentDate && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {paymentDate ? format(paymentDate, "yyyy. MM. dd") : <span>날짜 선택</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar mode="single" selected={paymentDate} onSelect={(date) => setPaymentDate(date || new Date())} initialFocus />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="paymentTime-other" className="opacity-0">시간</Label>
                          <Input id="paymentTime-other" type="time" value={paymentTime} onChange={(e) => setPaymentTime(e.target.value)} />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="paymentMethod-other">결제 수단</Label>
                          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                            <SelectTrigger id="paymentMethod-other"><SelectValue placeholder="결제 수단을 선택하세요" /></SelectTrigger>
                            <SelectContent>{paymentMethods.map(method => <SelectItem key={method} value={method}>{method}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="purchasePurpose-other">구매 목적</Label>
                          <Select value={purchasePurpose} onValueChange={setPurchasePurpose}>
                            <SelectTrigger id="purchasePurpose-other"><SelectValue placeholder="구매 목적을 선택하세요" /></SelectTrigger>
                            <SelectContent>{purchasePurposes.map(purpose => <SelectItem key={purpose} value={purpose}>{purpose}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    
                    {/* 금액 정보 */}
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <h3 className="text-md font-medium">금액 정보</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="price-other">상품 금액</Label>
                          <div className="relative"><Input id="price-other" value={price} onChange={(e) => setPrice(formatCurrency(e.target.value))} /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">원</span></div>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="actualPrice-other">실제 결제 금액</Label>
                          <div className="relative"><Input id="actualPrice-other" value={actualPrice} onChange={(e) => setActualPrice(formatCurrency(e.target.value))} /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">원</span></div>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="consultantSalesPerformance-other">상품 상담자 매출 실적</Label>
                          <div className="relative"><Input id="consultantSalesPerformance-other" value={consultantSalesPerformance} onChange={(e) => setConsultantSalesPerformance(formatCurrency(e.target.value))} /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">원</span></div>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="unpaidOrPerformanceShare-other">미수금 / 실적 배분</Label>
                          <div className="relative"><Input id="unpaidOrPerformanceShare-other" value={unpaidOrPerformanceShare} onChange={(e) => setUnpaidOrPerformanceShare(formatCurrency(e.target.value))} /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">원</span></div>
                        </div>
                      </div>
                    </div>

                    {/* 메모 */}
                     <div className="space-y-1.5">
                       <Label htmlFor="memo-other">메모</Label>
                       <Textarea id="memo-other" value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="특이사항을 입력하세요 (선택 사항)" />
                     </div>
                  </>
                )}
              </div> {/* Closing: p-6 space-y-6 overflow-y-auto flex-grow */}
            </div> {/* Closing: w-3/4 flex flex-col */}
          </div> {/* Closing: flex h-[600px] */}
        </TooltipProvider>
        <DialogFooter className="p-6 pt-4">
          <div className="flex justify-end gap-3 w-full">
            <Button 
              variant="outline" 
              onClick={() => { onOpenChange(false); resetForm(); }}
            >
              취소
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isSubmitting}
              className="bg-gym-primary hover:bg-gym-primary/90 text-white"
            >
              {isSubmitting ? "저장 중..." : "저장"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

