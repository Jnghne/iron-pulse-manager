import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, CreditCard, Edit, Trash2 } from "lucide-react";
import { formatDate, cn } from "@/lib/utils";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface PaymentDetailDialogProps {
  payment: any; // 실제 구현에서는 Payment 타입을 정의하여 사용
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (paymentData: any) => void;
  onDelete: (paymentId: string) => void;
  isOwner: boolean;
}

export const PaymentDetailDialog = ({ 
  payment, 
  open, 
  onOpenChange, 
  onEdit,
  onDelete,
  isOwner 
}: PaymentDetailDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 편집 가능한 필드 상태
  const [editedPayment, setEditedPayment] = useState<any>(payment || {});
  
  // payment prop이 변경될 때 editedPayment 업데이트
  useEffect(() => {
    setEditedPayment(payment || {});
  }, [payment]);
  
  // 수정 모드 전환
  const handleEditMode = () => {
    setIsEditing(true);
    setEditedPayment({...payment});
  };
  
  // 수정 취소
  const handleCancelEdit = () => {
    setIsEditing(false);
  };
  
  // 수정 저장
  const handleSaveEdit = () => {
    setIsSubmitting(true);
    
    // 실제 구현에서는 API 호출 등의 로직이 들어갈 수 있음
    setTimeout(() => {
      onEdit(editedPayment);
      setIsSubmitting(false);
      setIsEditing(false);
    }, 500);
  };
  
  // 삭제 확인
  const handleConfirmDelete = () => {
    setIsSubmitting(true);
    
    // 실제 구현에서는 API 호출 등의 로직이 들어갈 수 있음
    setTimeout(() => {
      onDelete(payment.id);
      setIsSubmitting(false);
      setIsDeleteDialogOpen(false);
      onOpenChange(false);
    }, 500);
  };
  
  // 금액 입력 시 천 단위 콤마 추가
  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/[^\d]/g, '');
    return numericValue ? parseInt(numericValue).toLocaleString() : '';
  };
  
  // 결제 상태에 따른 배지 색상
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
      case '완료':
        return <Badge className="bg-green-100 text-green-800">완료</Badge>;
      case 'pending':
      case '대기':
        return <Badge className="bg-yellow-100 text-yellow-800">대기</Badge>;
      case 'cancelled':
      case '취소':
        return <Badge className="bg-red-100 text-red-800">취소</Badge>;
      case '실패':
        return <Badge className="bg-red-100 text-red-800">실패</Badge>;
      default:
        return <Badge variant="outline">{status || '알 수 없음'}</Badge>;
    }
  };
  
  if (!payment) return null;
  
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <CreditCard className="h-5 w-5 text-gym-primary" />
              결제 상세 정보
            </DialogTitle>
            <DialogDescription>
              결제 정보를 확인하고 관리할 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* 상품 정보 섹션 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">상품 정보</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">상품 구분</Label>
                  {isEditing ? (
                    <Select 
                      value={editedPayment.type} 
                      onValueChange={(value) => setEditedPayment({...editedPayment, type: value})}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gym">헬스장 이용권</SelectItem>
                        <SelectItem value="lesson">개인레슨 이용권</SelectItem>
                        <SelectItem value="locker">락커 이용권</SelectItem>
                        <SelectItem value="other">기타 상품</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="font-medium">
                      {payment.product || payment.type || 'N/A'}
                    </p>
                  )}
                </div>
                
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">상품명</Label>
                  {isEditing ? (
                    <Input 
                      value={editedPayment.productName || editedPayment.product} 
                      onChange={(e) => setEditedPayment({...editedPayment, productName: e.target.value, product: e.target.value})}
                      disabled={isSubmitting}
                    />
                  ) : (
                    <p className="font-medium">{payment.productName || payment.product || 'N/A'}</p>
                  )}
                </div>
                
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">상품 시작일</Label>
                  {isEditing ? (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !editedPayment.startDate && "text-muted-foreground"
                          )}
                          disabled={isSubmitting}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {(editedPayment.startDate || editedPayment.serviceStartDate) ? format(new Date(editedPayment.startDate || editedPayment.serviceStartDate), 'PPP', { locale: ko }) : "날짜 선택"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={new Date(editedPayment.startDate || editedPayment.serviceStartDate)}
                          onSelect={(date) => date && setEditedPayment({...editedPayment, startDate: format(date, 'yyyy-MM-dd'), serviceStartDate: format(date, 'yyyy-MM-dd')})}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <p className="font-medium">{formatDate(payment.startDate || payment.serviceStartDate)}</p>
                  )}
                </div>
                
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">상품 종료일</Label>
                  {isEditing ? (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !editedPayment.endDate && "text-muted-foreground"
                          )}
                          disabled={isSubmitting}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {(editedPayment.endDate || editedPayment.serviceEndDate) ? format(new Date(editedPayment.endDate || editedPayment.serviceEndDate), 'PPP', { locale: ko }) : "날짜 선택"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={new Date(editedPayment.endDate || editedPayment.serviceEndDate)}
                          onSelect={(date) => date && setEditedPayment({...editedPayment, endDate: format(date, 'yyyy-MM-dd'), serviceEndDate: format(date, 'yyyy-MM-dd')})}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <p className="font-medium">{formatDate(payment.endDate || payment.serviceEndDate)}</p>
                  )}
                </div>
                
                {(payment.type === 'lesson' || payment.product === '개인레슨 이용권' || payment.trainer) && (
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">담당 트레이너</Label>
                    {isEditing ? (
                      <Input 
                        value={editedPayment.trainer} 
                        onChange={(e) => setEditedPayment({...editedPayment, trainer: e.target.value})}
                        disabled={isSubmitting}
                      />
                    ) : (
                      <p className="font-medium">{payment.trainer || '미지정'}</p>
                    )}
                  </div>
                )}
                
                {(payment.type === 'locker' || payment.product === '락커 이용권' || payment.lockerNumber) && (
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">락커 번호</Label>
                    {isEditing ? (
                      <Input 
                        value={editedPayment.lockerNumber} 
                        onChange={(e) => setEditedPayment({...editedPayment, lockerNumber: e.target.value})}
                        disabled={isSubmitting}
                      />
                    ) : (
                      <p className="font-medium">{payment.lockerNumber}</p>
                    )}
                  </div>
                )}
                
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">담당 직원</Label>
                  {isEditing ? (
                    <Input 
                      value={editedPayment.staff} 
                      onChange={(e) => setEditedPayment({...editedPayment, staff: e.target.value})}
                      disabled={isSubmitting}
                    />
                  ) : (
                    <p className="font-medium">{payment.staff}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* 결제 정보 섹션 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">결제 정보</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">결제일시</Label>
                  {isEditing ? (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !editedPayment.paymentDate && "text-muted-foreground"
                          )}
                          disabled={isSubmitting}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {editedPayment.paymentDate ? format(new Date(editedPayment.paymentDate), 'PPP', { locale: ko }) : "날짜 선택"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={new Date(editedPayment.paymentDate)}
                          onSelect={(date) => date && setEditedPayment({...editedPayment, paymentDate: format(date, 'yyyy-MM-dd')})}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <p className="font-medium">{formatDate(payment.paymentDate || payment.date)}</p>
                  )}
                </div>
                
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">결제 수단</Label>
                  {isEditing ? (
                    <Select 
                      value={editedPayment.paymentMethod} 
                      onValueChange={(value) => setEditedPayment({...editedPayment, paymentMethod: value})}
                      disabled={isSubmitting}
                    >
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
                  ) : (
                    <p className="font-medium">
                      {payment.paymentMethod === '카드' || payment.paymentMethod === 'card' ? '카드' : 
                       payment.paymentMethod === '현금' || payment.paymentMethod === 'cash' ? '현금' : 
                       payment.paymentMethod === '계좌이체' || payment.paymentMethod === 'transfer' ? '계좌이체' : 
                       payment.paymentMethod || '기타'}
                    </p>
                  )}
                </div>
                
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">상품 금액</Label>
                  {isEditing ? (
                    <div className="relative">
                      <Input
                        value={typeof (editedPayment.price || editedPayment.amount) === 'number' ? (editedPayment.price || editedPayment.amount).toLocaleString() : (editedPayment.price || editedPayment.amount || '')}
                        onChange={(e) => setEditedPayment({...editedPayment, price: parseInt(e.target.value.replace(/,/g, '')) || 0, amount: parseInt(e.target.value.replace(/,/g, '')) || 0})}
                        className="pl-8"
                        disabled={isSubmitting}
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₩</span>
                    </div>
                  ) : (
                    <p className="font-medium">₩ {(payment.price || payment.amount || 0).toLocaleString()}</p>
                  )}
                </div>
                
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">실제 결제 금액</Label>
                  {isEditing ? (
                    <div className="relative">
                      <Input
                        value={typeof (editedPayment.actualPrice || editedPayment.actualAmount) === 'number' ? (editedPayment.actualPrice || editedPayment.actualAmount).toLocaleString() : (editedPayment.actualPrice || editedPayment.actualAmount || '')}
                        onChange={(e) => setEditedPayment({...editedPayment, actualPrice: parseInt(e.target.value.replace(/,/g, '')) || 0, actualAmount: parseInt(e.target.value.replace(/,/g, '')) || 0})}
                        className="pl-8"
                        disabled={isSubmitting}
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₩</span>
                    </div>
                  ) : (
                    <p className="font-medium">₩ {(payment.actualPrice || payment.actualAmount || 0).toLocaleString()}</p>
                  )}
                </div>
                
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">직원 매출 실적</Label>
                  {isEditing ? (
                    <div className="relative">
                      <Input
                        value={typeof editedPayment.staffCommission === 'number' ? editedPayment.staffCommission.toLocaleString() : editedPayment.staffCommission || ''}
                        onChange={(e) => setEditedPayment({...editedPayment, staffCommission: parseInt(e.target.value.replace(/,/g, '')) || 0})}
                        className="pl-8"
                        disabled={isSubmitting}
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₩</span>
                    </div>
                  ) : (
                    <p className="font-medium">₩ {(payment.staffCommission || payment.actualPrice || payment.actualAmount || 0).toLocaleString()}</p>
                  )}
                </div>
                
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">미수금</Label>
                  {isEditing ? (
                    <div className="relative">
                      <Input
                        value={typeof editedPayment.unpaidAmount === 'number' ? editedPayment.unpaidAmount.toLocaleString() : editedPayment.unpaidAmount || ''}
                        onChange={(e) => setEditedPayment({...editedPayment, unpaidAmount: parseInt(e.target.value.replace(/,/g, '')) || 0})}
                        className="pl-8"
                        disabled={isSubmitting}
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₩</span>
                    </div>
                  ) : (
                    <p className="font-medium">₩ {payment.unpaidAmount?.toLocaleString() || '0'}</p>
                  )}
                </div>
                
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">결제 상태</Label>
                  {isEditing ? (
                    <Select 
                      value={editedPayment.status} 
                      onValueChange={(value) => setEditedPayment({...editedPayment, status: value})}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="completed">결제 완료</SelectItem>
                        <SelectItem value="pending">대기</SelectItem>
                        <SelectItem value="cancelled">취소</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    getStatusBadge(payment.status)
                  )}
                </div>
              </div>
              
              {/* 메모 */}
              {(payment.memo || isEditing) && (
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">메모</Label>
                  {isEditing ? (
                    <Textarea
                      value={editedPayment.memo || ''}
                      onChange={(e) => setEditedPayment({...editedPayment, memo: e.target.value})}
                      rows={2}
                      disabled={isSubmitting}
                    />
                  ) : (
                    <p className="text-sm whitespace-pre-line p-2 bg-muted/50 rounded-md">
                      {payment.memo || '메모 없음'}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter className="gap-2">
            {isOwner && !isEditing && (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  삭제
                </Button>
                <Button 
                  onClick={handleEditMode}
                  className="bg-gym-primary hover:bg-gym-primary/90"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  수정
                </Button>
              </>
            )}
            
            {isEditing && (
              <>
                <Button 
                  variant="outline" 
                  onClick={handleCancelEdit}
                  disabled={isSubmitting}
                >
                  취소
                </Button>
                <Button 
                  onClick={handleSaveEdit}
                  disabled={isSubmitting}
                  className="bg-gym-primary hover:bg-gym-primary/90"
                >
                  {isSubmitting ? "저장 중..." : "저장"}
                </Button>
              </>
            )}
            
            {!isEditing && !isOwner && (
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                닫기
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>결제 내역 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              이 결제 내역을 정말로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleConfirmDelete();
              }}
              disabled={isSubmitting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isSubmitting ? "삭제 중..." : "삭제"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
