// src/components/features/pass/PassDetailModal.tsx
import { memo, useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { X, Info, CalendarDays as CalendarIcon, Edit3, Trash2, ListChecks, History, CreditCard, Save, XCircle } from 'lucide-react'; 
import type { PassDetails, SidebarMenuItem } from '@/types/pass';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

// Helper function to format Date to YYYY.MM.DD.
const formatDateToInput = (date: Date | undefined | null): string => {
  if (!date) return '';
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}.${month}.${day}.`;
};

// Helper function to parse YYYY.MM.DD. or other date strings to Date
const parseDateString = (dateString: string | undefined | null): Date | undefined => {
  if (!dateString) return undefined;
  const parts = dateString.match(/(\d{4})[./-](\d{1,2})[./-](\d{1,2})/);
  if (parts) {
    const year = parseInt(parts[1], 10);
    const month = parseInt(parts[2], 10) - 1; // Month is 0-indexed
    const day = parseInt(parts[3], 10);
    const date = new Date(year, month, day);
    if (!isNaN(date.getTime())) return date;
  }
  // Fallback for more general date strings, this might be less reliable
  const parsedDate = new Date(dateString.replace(/오전|오후|\s[AP]M/gi, '').trim());
  return isNaN(parsedDate.getTime()) ? undefined : parsedDate;
};

interface PassDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  passDetails: PassDetails | null;
  isOwner: boolean;
  onUpdatePass: (updatedDetails: PassDetails) => void;
  onDeletePass: (passId: string) => void;
}

const sidebarMenuItems: SidebarMenuItem[] = [
  { id: 'paymentInfo', label: '상품 / 결제 정보', icon: ListChecks },
  { id: 'unpaidShare', label: '미수금 / 실적 배분', icon: CreditCard },
  { id: 'contract', label: '계약서', icon: History },
  { id: 'suspension', label: '이용 정지', icon: CalendarIcon },
  { id: 'history', label: '수정 기록', icon: Info },
];

const InfoTooltip = ({ children }: { children: React.ReactNode }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="h-4 w-4 text-blue-500 cursor-pointer ml-1" />
      </TooltipTrigger>
      <TooltipContent>
        <p>{children}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export const PassDetailModal = memo<PassDetailModalProps>(
  ({ isOpen, onClose, passDetails, isOwner, onUpdatePass, onDeletePass }) => {
    const [activeTab, setActiveTab] = useState<string>('paymentInfo');
    const [isEditing, setIsEditing] = useState(false);
    const [editedPassDetails, setEditedPassDetails] = useState<PassDetails | null>(passDetails);

    useEffect(() => {
      setEditedPassDetails(passDetails);
      setIsEditing(false);
    }, [passDetails, isOpen]);

    const handleEditToggle = () => {
      if (!isEditing && passDetails) {
        setEditedPassDetails(JSON.parse(JSON.stringify(passDetails)));
      }
      setIsEditing(!isEditing);
    };

    const handleCancelEdit = () => {
      if (passDetails) {
        setEditedPassDetails(JSON.parse(JSON.stringify(passDetails)));
      }
      setIsEditing(false);
    };

    const handleSave = () => {
      if (editedPassDetails) {
        onUpdatePass(editedPassDetails);
        setIsEditing(false);
      }
    };

    const handleDelete = () => {
      if (passDetails?.id) {
        onDeletePass(passDetails.id);
        onClose();
      }
    };

    const handleInputChange = useCallback((field: keyof PassDetails, value: PassDetails[keyof PassDetails]) => {
      setEditedPassDetails(prevDetails => {
        if (!prevDetails) return null;
        return { ...prevDetails, [field]: value };
      });
    }, []);

    if (!passDetails && !isOpen) return null;
    if (!passDetails && isOpen) {
      return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
          <DialogContent className="sm:max-w-[800px] max-h-[750px] flex flex-col p-0">
            <DialogHeader className="p-6 border-b">
              <DialogTitle>이용권 정보 없음</DialogTitle>
            </DialogHeader>
            <div className="flex-grow p-6">이용권 정보를 불러올 수 없습니다.</div>
            <DialogFooter className="p-6 border-t">
              <Button variant="outline" onClick={onClose}>닫기</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    }
    if (!passDetails) return null;

    const currentDisplayDetails = isEditing ? editedPassDetails : passDetails;

    const renderTabContent = () => {
      switch (activeTab) {
        case 'paymentInfo':
          return (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center">
                  상품 정보
                  <InfoTooltip>서비스 시작일, 만료일, 담당자 정보를 확인합니다.</InfoTooltip>
                </h4>
                <div className="bg-gray-50 p-4 rounded-md space-y-3 text-sm">
                  {isEditing ? (
                    <>
                      <div className="space-y-1">
                        <Label htmlFor="serviceStartDate">서비스 시작일</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={`w-full justify-start text-left font-normal ${!editedPassDetails?.serviceStartDate && "text-muted-foreground"}`}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {editedPassDetails?.serviceStartDate ? formatDateToInput(parseDateString(editedPassDetails.serviceStartDate)) : <span>날짜 선택</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={parseDateString(editedPassDetails?.serviceStartDate)}
                              onSelect={(date) => handleInputChange('serviceStartDate', date ? formatDateToInput(date) : '')}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="serviceEndDate">서비스 만료일</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={`w-full justify-start text-left font-normal ${!editedPassDetails?.serviceEndDate && "text-muted-foreground"}`}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {editedPassDetails?.serviceEndDate ? formatDateToInput(parseDateString(editedPassDetails.serviceEndDate)) : <span>날짜 선택</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={parseDateString(editedPassDetails?.serviceEndDate)}
                              onSelect={(date) => handleInputChange('serviceEndDate', date ? formatDateToInput(date) : '')}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span>서비스 시작일</span>
                        <span>{passDetails?.serviceStartDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>서비스 만료일</span>
                        <span>{passDetails?.serviceEndDate}</span>
                      </div>
                    </>
                  )}
                </div>
                <div className="bg-gray-50 p-4 rounded-md space-y-3 text-sm mt-3">
                  {isEditing ? (
                    <>
                      <div>
                        <Label htmlFor="consultant">상품 상담자</Label>
                        <Input id="consultant" value={editedPassDetails?.consultant || ''} onChange={(e) => handleInputChange('consultant', e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="instructor">담당 강사</Label>
                        <Input id="instructor" value={editedPassDetails?.instructor || ''} onChange={(e) => handleInputChange('instructor', e.target.value)} />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span>상품 상담자</span>
                        <span>{passDetails?.consultant || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>담당 강사</span>
                        <span>{passDetails?.instructor || '배정 예정'}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center">
                  결제 정보
                  <InfoTooltip>결제 일시, 수단, 금액, 구매 목적 등을 확인하거나 수정합니다.</InfoTooltip>
                </h4>
                {isEditing ? (
                  <>
                    <div className="bg-gray-50 p-4 rounded-md space-y-3 text-sm mb-3">
                      <p className="text-xs font-semibold text-gray-500 mb-2">결제 기본 정보</p>
                      <div className="space-y-1">
                        <Label htmlFor="paymentDate">결제 일시</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={`w-full justify-start text-left font-normal ${!editedPassDetails?.paymentDate && "text-muted-foreground"}`}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {editedPassDetails?.paymentDate ? formatDateToInput(parseDateString(editedPassDetails.paymentDate)) : <span>날짜 선택</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={parseDateString(editedPassDetails?.paymentDate)}
                              onSelect={(date) => handleInputChange('paymentDate', date ? formatDateToInput(date) : '')}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <Label htmlFor="paymentMethod">결제 수단</Label>
                        <Input id="paymentMethod" value={editedPassDetails?.paymentMethod || ''} onChange={(e) => handleInputChange('paymentMethod', e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="purchasePurpose">구매 목적</Label>
                        <Input id="purchasePurpose" value={editedPassDetails?.purchasePurpose || ''} onChange={(e) => handleInputChange('purchasePurpose', e.target.value)} />
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md space-y-3 text-sm">
                      <p className="text-xs font-semibold text-gray-500 mb-2">금액 정보</p>
                      <div>
                        <Label htmlFor="productAmountInPaymentSection">상품 금액</Label>
                        <Input id="productAmountInPaymentSection" type="number" value={editedPassDetails?.productAmount || ''} onChange={(e) => handleInputChange('productAmount', e.target.valueAsNumber)} />
                      </div>
                      <div>
                        <Label htmlFor="actualPaymentAmount">실제 결제 금액</Label>
                        <Input id="actualPaymentAmount" type="number" value={editedPassDetails?.actualPaymentAmount || ''} onChange={(e) => handleInputChange('actualPaymentAmount', e.target.valueAsNumber)} />
                      </div>
                      <div>
                        <Label htmlFor="consultantSalesShare">상품 담당자 매출 실적</Label>
                        <Input id="consultantSalesShare" type="number" value={editedPassDetails?.consultantSalesShare || ''} onChange={(e) => handleInputChange('consultantSalesShare', e.target.valueAsNumber)} />
                      </div>
                      <div>
                        <Label htmlFor="unpaidAmount">미수금</Label>
                        <Input id="unpaidAmount" type="number" value={editedPassDetails?.unpaidAmount || ''} onChange={(e) => handleInputChange('unpaidAmount', e.target.valueAsNumber)} />
                      </div>
                      <div>
                        <Label htmlFor="revenueDistributionNotes">실적 배분 메모</Label>
                        <Input id="revenueDistributionNotes" value={editedPassDetails?.revenueDistributionNotes || ''} onChange={(e) => handleInputChange('revenueDistributionNotes', e.target.value)} />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-gray-50 p-4 rounded-md space-y-2 text-sm mb-3">
                      <p className="text-xs font-semibold text-gray-500 mb-2">결제 기본 정보</p>
                      <div className="flex justify-between">
                        <span>결제 일시</span>
                        <span>{currentDisplayDetails?.paymentDate || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>결제 수단</span>
                        <span>{currentDisplayDetails?.paymentMethod || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>구매 목적</span>
                        <span>{currentDisplayDetails?.purchasePurpose || '-'}</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md space-y-2 text-sm">
                      <p className="text-xs font-semibold text-gray-500 mb-2">금액 정보</p>
                      <div className="flex justify-between">
                        <span>상품 금액</span>
                        <span>{currentDisplayDetails?.productAmount ? `${Number(currentDisplayDetails.productAmount).toLocaleString()}원` : '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>실제 결제 금액</span>
                        <span>{currentDisplayDetails?.actualPaymentAmount ? `${Number(currentDisplayDetails.actualPaymentAmount).toLocaleString()}원` : '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>상품 담당자 매출 실적</span>
                        <span>{currentDisplayDetails?.consultantSalesShare ? `${Number(currentDisplayDetails.consultantSalesShare).toLocaleString()}원` : '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>미수금</span>
                        <span>{currentDisplayDetails?.unpaidAmount ? `${Number(currentDisplayDetails.unpaidAmount).toLocaleString()}원` : '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>실적 배분 메모</span>
                        <span>{currentDisplayDetails?.revenueDistributionNotes || '-'}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        default:
          return <div>선택된 탭: {sidebarMenuItems.find(item => item.id === activeTab)?.label}</div>;
      }
    }; // End of renderTabContent

    // Main return for PassDetailModal
    return (
      <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { onClose(); setIsEditing(false); } }}>
        <DialogContent className="max-w-5xl p-0" aria-describedby={undefined}>
          <div className="flex h-[800px]">
            {/* Sidebar */}
            <div className="w-1/4 bg-gray-50 p-6 border-r border-gray-200 flex flex-col">
              <div className="mb-6">
                <h3 className="text-lg font-semibold">{passDetails?.name}</h3>
                <p className="text-xs text-gray-500">
                  {passDetails?.type} · {passDetails?.category} · {passDetails?.subCategory}
                </p>
              </div>
              <nav className="space-y-1">
                {sidebarMenuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium 
                      ${
                        activeTab === item.id
                          ? 'bg-blue-600 text-white' // Primary color (#2563eb or similar)
                          : 'text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    <item.icon className={`h-5 w-5 ${
                      activeTab === item.id ? 'text-white' : 'text-gray-500'
                    }`} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Main Content */}
            <div className="w-3/4 p-8 flex flex-col">
              <DialogHeader className="flex flex-row justify-between items-center mb-6 pb-4 border-b">
                <DialogTitle className="text-xl font-bold">
                  {sidebarMenuItems.find(item => item.id === activeTab)?.label}
                </DialogTitle>
              </DialogHeader>

              <div className="flex-grow overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 mb-6">
                {renderTabContent()}
              </div>

              {isOwner && (
                <DialogFooter className="gap-2 mt-auto pt-6 border-t">
                  {isEditing ? (
                    <>
                      <Button variant="outline" onClick={handleCancelEdit}><XCircle className="mr-2 h-4 w-4" /> 취소</Button>
                      <Button onClick={handleSave} className="bg-gym-primary hover:bg-gym-primary/90 text-white"><Save className="mr-2 h-4 w-4" /> 저장</Button>
                    </>
                  ) : (
                    <>
                      <Button variant="destructive" onClick={handleDelete} className="flex items-center">
                        <Trash2 className="mr-2 h-4 w-4" /> 삭제
                      </Button>
                      <Button onClick={handleEditToggle} className="bg-gym-primary hover:bg-gym-primary/90 text-white"><Edit3 className="mr-2 h-4 w-4" /> 수정</Button>
                    </>
                  )}
                </DialogFooter>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
});

PassDetailModal.displayName = 'PassDetailModal';
