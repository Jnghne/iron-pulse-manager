import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

export type MembershipType = 'gym' | 'pt' | 'locker' | 'other';

interface Product {
  id: string;
  name: string;
  type: MembershipType;
  price: number;
  duration?: number; // 일 단위
  sessions?: number; // PT 횟수
}

interface MembershipDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: MembershipType;
  mode: 'edit' | 'create';
  currentData?: {
    id?: string;
    productId?: string;
    name?: string;
    startDate?: Date;
    endDate?: Date;
    price?: number;
    remainingSessions?: number;
    totalSessions?: number;
    lockerNumber?: string;
    notes?: string;
  };
  onSave: (data: any) => void;
  onDelete?: () => void;
}

export const MembershipDialog: React.FC<MembershipDialogProps> = ({
  open,
  onOpenChange,
  type,
  mode,
  currentData,
  onSave,
  onDelete
}) => {
  const [selectedProduct, setSelectedProduct] = React.useState<string>(currentData?.productId || '');
  const [startDate, setStartDate] = React.useState<Date | undefined>(currentData?.startDate);
  const [endDate, setEndDate] = React.useState<Date | undefined>(currentData?.endDate);
  const [price, setPrice] = React.useState<string>(currentData?.price?.toString() || '');
  const [lockerNumber, setLockerNumber] = React.useState<string>(currentData?.lockerNumber || '');
  const [notes, setNotes] = React.useState<string>(currentData?.notes || '');
  const [hasProducts, setHasProducts] = React.useState<boolean>(true); // 상품 존재 여부

  // 임시 상품 목록 (실제로는 API에서 가져와야 함)
  const products: Product[] = [
    { id: '1', name: '헬스 1개월권', type: 'gym', price: 100000, duration: 30 },
    { id: '2', name: '헬스 3개월권', type: 'gym', price: 270000, duration: 90 },
    { id: '3', name: 'PT 10회권', type: 'pt', price: 500000, sessions: 10 },
    { id: '4', name: '락커 1개월', type: 'locker', price: 30000, duration: 30 },
  ];

  // 해당 타입의 상품만 필터링
  const filteredProducts = products.filter(product => product.type === type);

  React.useEffect(() => {
    // 실제 구현에서는 API 호출로 상품 목록을 가져와야 함
    setHasProducts(filteredProducts.length > 0);
  }, [type]);

  const handleSave = () => {
    const selectedProductData = products.find(p => p.id === selectedProduct);
    
    const data = {
      productId: selectedProduct,
      productName: selectedProductData?.name,
      startDate,
      endDate,
      price: parseInt(price),
      lockerNumber: type === 'locker' ? lockerNumber : undefined,
      notes,
    };
    
    onSave(data);
    onOpenChange(false);
  };

  const getTitle = () => {
    const action = mode === 'create' ? '등록' : '수정';
    switch(type) {
      case 'gym': return `헬스장 이용권 ${action}`;
      case 'pt': return `PT 이용권 ${action}`;
      case 'locker': return `락커 이용권 ${action}`;
      case 'other': return `기타 상품 ${action}`;
    }
  };

  const handleProductChange = (value: string) => {
    setSelectedProduct(value);
    const product = products.find(p => p.id === value);
    if (product) {
      setPrice(product.price.toString());
      
      // 시작일이 설정되어 있으면 종료일 자동 계산
      if (startDate && product.duration) {
        const end = new Date(startDate);
        end.setDate(end.getDate() + product.duration);
        setEndDate(end);
      }
    }
  };

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    
    // 상품이 선택되어 있고 기간이 있으면 종료일 자동 계산
    if (date && selectedProduct) {
      const product = products.find(p => p.id === selectedProduct);
      if (product && product.duration) {
        const end = new Date(date);
        end.setDate(end.getDate() + product.duration);
        setEndDate(end);
      }
    }
  };

  // 상품이 없는 경우 안내 메시지 컴포넌트
  const NoProductsContent = () => (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="rounded-full bg-slate-100 p-3 mb-4">
        <ShoppingBag className="h-10 w-10 text-slate-400" />
      </div>
      <h3 className="text-lg font-medium mb-2">상품 등록이 필요합니다</h3>
      <p className="text-sm text-muted-foreground mb-6">
        등록된 상품이 없습니다. 먼저 상품을 등록해주세요.
      </p>
      <Button onClick={() => window.location.href = '/products'}>
        상품으로 이동
      </Button>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? '새로운 이용권을 등록합니다.' 
              : '이용권 정보를 수정합니다.'}
          </DialogDescription>
        </DialogHeader>
        
        {!hasProducts ? (
          <NoProductsContent />
        ) : (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="product" className="text-right">
                상품 선택
              </Label>
              <div className="col-span-3">
                <Select
                  value={selectedProduct}
                  onValueChange={handleProductChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="상품을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredProducts.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} ({product.price.toLocaleString()}원)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                시작일
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? formatDate(startDate) : "날짜 선택"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={handleStartDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">
                종료일
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? formatDate(endDate) : "날짜 선택"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      disabled={(date) => 
                        startDate ? date < startDate : false
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                결제 금액
              </Label>
              <div className="col-span-3">
                <div className="relative">
                  <Input
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value.replace(/[^0-9]/g, ''))}
                    className="pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    원
                  </span>
                </div>
              </div>
            </div>
            
            {type === 'locker' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lockerNumber" className="text-right">
                  락커 번호
                </Label>
                <div className="col-span-3">
                  <Input
                    id="lockerNumber"
                    value={lockerNumber}
                    onChange={(e) => setLockerNumber(e.target.value)}
                  />
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                특이사항
              </Label>
              <div className="col-span-3">
                <Input
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
        
        <DialogFooter className="flex justify-between">
          {mode === 'edit' && onDelete && (
            <Button 
              variant="destructive" 
              onClick={onDelete}
              className="mr-auto"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              삭제
            </Button>
          )}
          <div>
            <DialogClose asChild>
              <Button variant="outline" className="mr-2">
                취소
              </Button>
            </DialogClose>
            <Button 
              onClick={handleSave} 
              disabled={!hasProducts || !selectedProduct || !startDate || !endDate}
            >
              저장
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// 누락된 컴포넌트 추가
const ShoppingBag = ({ className }: { className?: string }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
      <path d="M3 6h18"></path>
      <path d="M16 10a4 4 0 0 1-8 0"></path>
    </svg>
  );
};
