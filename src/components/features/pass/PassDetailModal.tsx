// src/components/features/pass/PassDetailModal.tsx
import { memo, useState, useEffect, useCallback, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { X, Info, CalendarDays as CalendarIcon, Edit3, Trash2, ListChecks, History, CreditCard, Save, XCircle, Upload, Image as ImageIcon, Plus } from 'lucide-react'; 
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { PassDetails, EditHistoryEntry, SidebarMenuItem } from '@/types/pass';
import { formatDateToInput, parseDateString } from '@/utils/dateUtils';

// 데이터 및 타입 import
import type { Member } from '@/data/mockData'; // Member 타입은 mockData에서 가져오는 것으로 유지
import { mockProducts } from '@/data/mockProducts'; // mockProducts는 mockProducts.ts 에서 가져옴
import { ProductType } from '@/types/product';
import { cn } from '@/lib/utils';


interface PassDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member; // 추가: 모달에 표시할 회원 정보
  passDetails?: PassDetails | null; // 특정 이용권 수정 시 사용 (선택적)
  isOwner: boolean;
  onUpdatePass: (updatedDetails: PassDetails) => void;
  onDeletePass: (passId: string) => void;
  // TODO: onRegisterNewPass 와 같은 콜백 함수 추가 필요
}

const sidebarMenuItems: SidebarMenuItem[] = [
  { id: 'paymentInfo', label: '상품 / 결제 정보', icon: ListChecks },
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
  ({ isOpen, onClose, member, passDetails, isOwner, onUpdatePass, onDeletePass }) => {
    const [activeTab, setActiveTab] = useState<string>('paymentInfo');
    const [isEditing, setIsEditing] = useState(false);
    const [editedPassDetails, setEditedPassDetails] = useState<PassDetails | null>(passDetails);
    // 파일 업로드를 위한 ref
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      // passDetails가 제공되면 해당 정보로 편집 상태를 초기화하고, 그렇지 않으면 member 정보를 기반으로 함
      // 지금은 기존 로직을 유지하되, member 정보 활용은 renderTabContent에서 직접 처리
      setEditedPassDetails(passDetails || null); 
      setIsEditing(false);
    }, [passDetails, isOpen, member]);
    
    const handleInputChange = useCallback((field: keyof PassDetails, value: PassDetails[keyof PassDetails]) => {
      setEditedPassDetails(prevDetails => {
        if (!prevDetails) return null;
        return { ...prevDetails, [field]: value };
      });
    }, []);
    
    // 파일 업로드 처리 함수
    const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files || event.target.files.length === 0) return;
      
      const files = Array.from(event.target.files);
      const newImageUrls: string[] = [];
      
      files.forEach(file => {
        // 실제 구현에서는 서버에 업로드하고 URL을 받아와야 함
        // 여기서는 임시로 로컬 URL 생성
        const imageUrl = URL.createObjectURL(file);
        newImageUrls.push(imageUrl);
      });
      
      if (editedPassDetails) {
        // 기존 이미지와 새 이미지 합치기
        const currentImages = editedPassDetails.contractImages || [];
        handleInputChange('contractImages', [...currentImages, ...newImageUrls]);
      }
      
      // 파일 입력 초기화 (동일한 파일을 다시 선택할 수 있도록)
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, [editedPassDetails, handleInputChange]);
  
    const handleRemoveImage = useCallback((index: number) => {
      if (!editedPassDetails?.contractImages) return;
      
      const updatedImages = [...editedPassDetails.contractImages];
      updatedImages.splice(index, 1);
      handleInputChange('contractImages', updatedImages);
    }, [editedPassDetails, handleInputChange]);

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

    // 탭 콘텐츠 렌더링
  
    const renderTabContent = () => {
      if (!currentDisplayDetails) {
        return <div className="p-6">이용권 상세 정보를 불러올 수 없습니다.</div>;
      }
      switch (activeTab) {
        case 'paymentInfo':
          return (
            <div className="space-y-6">
              {/* 상품 정보 섹션 */}
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center">
                  상품 정보
                  <InfoTooltip>상품명, 서비스 기간, 담당자 정보를 확인하거나 수정합니다.</InfoTooltip>
                </h4>
                <div className="bg-gray-50 p-4 rounded-md space-y-4 text-sm">
                  {isEditing ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label htmlFor="passName">상품명</Label>
                          <Input
                            id="passName"
                            value={editedPassDetails?.name || ''}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="예: 헬스 6개월"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="consultant">담당자</Label>
                          <Input
                            id="consultant"
                            value={editedPassDetails?.consultant || ''}
                            onChange={(e) => handleInputChange('consultant', e.target.value)}
                            placeholder="담당자 이름"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label htmlFor="serviceStartDate">서비스 시작일</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !editedPassDetails?.serviceStartDate && "text-muted-foreground"
                                )}
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
                          <Label htmlFor="serviceEndDate">서비스 종료일</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !editedPassDetails?.serviceEndDate && "text-muted-foreground"
                                )}
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
                                disabled={(date) => editedPassDetails?.serviceStartDate ? date < parseDateString(editedPassDetails.serviceStartDate)! : false}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                      { (editedPassDetails?.type?.toUpperCase() === 'PT' || typeof editedPassDetails?.ptTotalSessions === 'number') && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <Label htmlFor="ptTotalSessions">PT 총 횟수</Label>
                            <Input
                              id="ptTotalSessions"
                              type="number"
                              value={editedPassDetails?.ptTotalSessions ?? ''} // Use ?? for empty string if null/undefined
                              onChange={(e) => handleInputChange('ptTotalSessions', e.target.value ? parseInt(e.target.value, 10) : null)}
                              placeholder="PT 총 횟수"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="ptRemainingSessions">PT 잔여 횟수</Label>
                            <Input
                              id="ptRemainingSessions"
                              type="number"
                              value={editedPassDetails?.ptRemainingSessions ?? ''}
                              onChange={(e) => handleInputChange('ptRemainingSessions', e.target.value ? parseInt(e.target.value, 10) : null)}
                              placeholder="PT 잔여 횟수"
                            />
                          </div>
                        </div>
                      )}
                       <div className="space-y-1">
                          <Label htmlFor="instructor">강사</Label>
                          <Input
                            id="instructor"
                            value={editedPassDetails?.instructor || ''}
                            onChange={(e) => handleInputChange('instructor', e.target.value)}
                            placeholder="강사 이름 (예: 배정 예정)"
                          />
                        </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label htmlFor="viewPassName">상품명</Label>
                          <div id="viewPassName" className="p-2 border rounded-md bg-gray-100 min-h-[40px] flex items-center">{currentDisplayDetails.name}</div>
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="viewConsultant">담당자</Label>
                          <div id="viewConsultant" className="p-2 border rounded-md bg-gray-100 min-h-[40px] flex items-center">{currentDisplayDetails.consultant || 'N/A'}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label htmlFor="viewServiceStartDate">서비스 시작일</Label>
                          <div id="viewServiceStartDate" className="p-2 border rounded-md bg-gray-100 min-h-[40px] flex items-center">
                            <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                            {currentDisplayDetails.serviceStartDate ? formatDateToInput(parseDateString(currentDisplayDetails.serviceStartDate)) : 'N/A'}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="viewServiceEndDate">서비스 종료일</Label>
                          <div id="viewServiceEndDate" className="p-2 border rounded-md bg-gray-100 min-h-[40px] flex items-center">
                            <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                            {currentDisplayDetails.serviceEndDate ? formatDateToInput(parseDateString(currentDisplayDetails.serviceEndDate)) : 'N/A'}
                          </div>
                        </div>
                      </div>
                      {(currentDisplayDetails.type?.toUpperCase() === 'PT' || typeof currentDisplayDetails.ptTotalSessions === 'number') && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <Label htmlFor="viewPtTotalSessions">PT 총 횟수</Label>
                            <div id="viewPtTotalSessions" className="p-2 border rounded-md bg-gray-100 min-h-[40px] flex items-center">{currentDisplayDetails.ptTotalSessions ?? 'N/A'}회</div>
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="viewPtRemainingSessions">PT 잔여 횟수</Label>
                            <div id="viewPtRemainingSessions" className="p-2 border rounded-md bg-gray-100 min-h-[40px] flex items-center">{currentDisplayDetails.ptRemainingSessions ?? 'N/A'}회</div>
                          </div>
                        </div>
                      )}
                      <div className="space-y-1">
                        <Label htmlFor="viewInstructor">강사</Label>
                        <div id="viewInstructor" className="p-2 border rounded-md bg-gray-100 min-h-[40px] flex items-center">{currentDisplayDetails.instructor || 'N/A'}</div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* 결제 정보 섹션 */}
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center">
                  결제 정보
                  <InfoTooltip>결제 일시, 수단, 금액, 구매 목적 등을 확인하거나 수정합니다.</InfoTooltip>
                </h4>
                <div className="bg-gray-50 p-4 rounded-md space-y-4 text-sm">
                  {isEditing ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label htmlFor="paymentDate">결제 일시</Label>
                          <Input id="paymentDate" value={currentDisplayDetails.paymentDate || ''} readOnly className="bg-gray-100"/>
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="paymentMethod">결제 수단</Label>
                          <Input
                            id="paymentMethod"
                            value={editedPassDetails?.paymentMethod || ''}
                            onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                            placeholder="예: 카드 결제"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <Label htmlFor="productAmount">상품 금액</Label>
                          <Input
                            id="productAmount"
                            type="number"
                            value={editedPassDetails?.productAmount ?? ''}
                            onChange={(e) => handleInputChange('productAmount', e.target.value ? parseFloat(e.target.value) : null)}
                            placeholder="상품 금액"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="actualPaymentAmount">실 결제 금액</Label>
                          <Input
                            id="actualPaymentAmount"
                            type="number"
                            value={editedPassDetails?.actualPaymentAmount ?? ''}
                            onChange={(e) => handleInputChange('actualPaymentAmount', e.target.value ? parseFloat(e.target.value) : null)}
                            placeholder="실 결제 금액"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="unpaidAmount">미수금</Label>
                          <Input
                            id="unpaidAmount"
                            type="number"
                            value={editedPassDetails?.unpaidAmount ?? ''}
                            onChange={(e) => handleInputChange('unpaidAmount', e.target.value ? parseFloat(e.target.value) : null)}
                            placeholder="미수금"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="purchasePurpose">구매 목적</Label>
                        <Input
                          id="purchasePurpose"
                          value={editedPassDetails?.purchasePurpose || ''}
                          onChange={(e) => handleInputChange('purchasePurpose', e.target.value)}
                          placeholder="예: 다이어트, 체력 증진"
                        />
                      </div>
                       <div className="space-y-1">
                        <Label htmlFor="revenueDistributionNotes">실적 배분 관련 메모</Label>
                        <Textarea // Input 대신 Textarea 사용
                          id="revenueDistributionNotes"
                          value={editedPassDetails?.revenueDistributionNotes || ''}
                          onChange={(e) => handleInputChange('revenueDistributionNotes', e.target.value)}
                          placeholder="실적 배분 관련 특이사항"
                          className="min-h-[80px]"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label htmlFor="viewPaymentDate">결제 일시</Label>
                          <div id="viewPaymentDate" className="p-2 border rounded-md bg-gray-100 min-h-[40px] flex items-center">{currentDisplayDetails.paymentDate || 'N/A'}</div>
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="viewPaymentMethod">결제 수단</Label>
                          <div id="viewPaymentMethod" className="p-2 border rounded-md bg-gray-100 min-h-[40px] flex items-center">{currentDisplayDetails.paymentMethod || 'N/A'}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <Label htmlFor="viewProductAmount">상품 금액</Label>
                          <div id="viewProductAmount" className="p-2 border rounded-md bg-gray-100 min-h-[40px] flex items-center">{typeof currentDisplayDetails.productAmount === 'number' ? `${currentDisplayDetails.productAmount.toLocaleString('ko-KR')}원` : 'N/A'}</div>
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="viewActualPaymentAmount">실 결제 금액</Label>
                          <div id="viewActualPaymentAmount" className="p-2 border rounded-md bg-gray-100 min-h-[40px] flex items-center">{typeof currentDisplayDetails.actualPaymentAmount === 'number' ? `${currentDisplayDetails.actualPaymentAmount.toLocaleString('ko-KR')}원` : 'N/A'}</div>
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="viewUnpaidAmount">미수금</Label>
                          <div id="viewUnpaidAmount" className="p-2 border rounded-md bg-gray-100 min-h-[40px] flex items-center">{typeof currentDisplayDetails.unpaidAmount === 'number' ? `${currentDisplayDetails.unpaidAmount.toLocaleString('ko-KR')}원` : 'N/A'}</div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="viewPurchasePurpose">구매 목적</Label>
                        <div id="viewPurchasePurpose" className="p-2 border rounded-md bg-gray-100 min-h-[40px] flex items-center">{currentDisplayDetails.purchasePurpose || 'N/A'}</div>
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="viewPerformanceSharingMemo">실적 배분 관련 메모</Label>
                        <div id="viewPerformanceSharingMemo" className="p-2 border rounded-md bg-gray-100 min-h-[60px] whitespace-pre-wrap">{currentDisplayDetails.revenueDistributionNotes || 'N/A'}</div>
                      </div>
                    </>
                  )}
                </div> {/* Closing tag for bg-gray-50 p-4 ... div */}
              </div>
            </div>
          );

        case 'contract':
          return (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center">
                  계약서 정보
                  <InfoTooltip>상품 담당자가 첨부한 계약서 사진을 확인합니다.</InfoTooltip>
                </h4>
                
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="flex flex-col gap-4">
                        {/* 계약서 이미지 목록 */}
                        {editedPassDetails?.contractImages && editedPassDetails.contractImages.length > 0 ? (
                          <div className="grid grid-cols-2 gap-4">
                            {editedPassDetails.contractImages.map((image, index) => (
                              <div key={index} className="relative group">
                                <img 
                                  src={image} 
                                  alt={`계약서 ${index + 1}`} 
                                  className="w-full h-48 object-cover rounded-md border border-gray-200" 
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImage(index)}
                                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-md">
                            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-500">첨부된 계약서 이미지가 없습니다</p>
                          </div>
                        )}
                        
                        {/* 이미지 업로드 버튼 */}
                        <div className="mt-4">
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            accept="image/*"
                            multiple
                            className="hidden"
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="w-full" 
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            계약서 이미지 업로드
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-md">
                    {currentDisplayDetails?.contractImages && currentDisplayDetails.contractImages.length > 0 ? (
                      <div className="grid grid-cols-2 gap-4">
                        {currentDisplayDetails.contractImages.map((image, index) => (
                          <div key={index} className="relative">
                            <img 
                              src={image} 
                              alt={`계약서 ${index + 1}`} 
                              className="w-full h-48 object-cover rounded-md border border-gray-200" 
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">등록된 계약서 이미지가 없습니다</p>
                        {isOwner && (
                          <Button 
                            variant="outline" 
                            className="mt-4" 
                            onClick={handleEditToggle}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            계약서 이미지 등록하기
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );

        case 'suspension':
          return (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center">
                  이용 정지 정보
                  <InfoTooltip>이용권의 정지 기간 및 사유를 설정하거나 확인합니다.</InfoTooltip>
                </h4>
                {isEditing ? (
                  <div className="bg-gray-50 p-4 rounded-md space-y-4 text-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label htmlFor="suspensionStartDate">정지 시작일</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !editedPassDetails?.suspensionStartDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {editedPassDetails?.suspensionStartDate ? formatDateToInput(parseDateString(editedPassDetails.suspensionStartDate)) : <span>날짜 선택</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={parseDateString(editedPassDetails?.suspensionStartDate)}
                              onSelect={(date) => handleInputChange('suspensionStartDate', date ? formatDateToInput(date) : '')}
                              disabled={(date) =>
                                (editedPassDetails?.suspensionEndDate && date > parseDateString(editedPassDetails.suspensionEndDate)!) ||
                                new Date(date) < new Date(new Date().setHours(0,0,0,0)) // 오늘 이전 날짜 비활성화
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="suspensionEndDate">정지 종료일</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !editedPassDetails?.suspensionEndDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {editedPassDetails?.suspensionEndDate ? formatDateToInput(parseDateString(editedPassDetails.suspensionEndDate)) : <span>날짜 선택</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={parseDateString(editedPassDetails?.suspensionEndDate)}
                              onSelect={(date) => handleInputChange('suspensionEndDate', date ? formatDateToInput(date) : '')}
                              disabled={(date) =>
                                (editedPassDetails?.suspensionStartDate && date < parseDateString(editedPassDetails.suspensionStartDate)!) ||
                                new Date(date) < new Date(new Date().setHours(0,0,0,0)) // 오늘 이전 날짜 비활성화
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="suspensionReason">정지 사유</Label>
                      <Input // Textarea로 변경 가능
                        id="suspensionReason"
                        value={editedPassDetails?.suspensionReason || ''}
                        onChange={(e) => handleInputChange('suspensionReason', e.target.value)}
                        placeholder="정지 사유를 입력하세요 (예: 개인 사정, 여행 등)"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-md space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>정지 시작일</span>
                      <span>{currentDisplayDetails?.suspensionStartDate ? formatDateToInput(parseDateString(currentDisplayDetails.suspensionStartDate)) : '설정 안됨'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>정지 종료일</span>
                      <span>{currentDisplayDetails?.suspensionEndDate ? formatDateToInput(parseDateString(currentDisplayDetails.suspensionEndDate)) : '설정 안됨'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>정지 사유</span>
                      <span className="text-right max-w-[70%] truncate">{currentDisplayDetails?.suspensionReason || '없음'}</span>
                    </div>
                    {/* 정지 상태 정보 (예시) */}
                    {(currentDisplayDetails?.suspensionStartDate && currentDisplayDetails?.suspensionEndDate) ? (
                      (() => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const startDate = parseDateString(currentDisplayDetails.suspensionStartDate);
                        const endDate = parseDateString(currentDisplayDetails.suspensionEndDate);
                        let statusText = '';
                        let statusColor = 'text-gray-600';

                        if (startDate && endDate) {
                          if (today >= startDate && today <= endDate) {
                            statusText = '현재 정지 중';
                            statusColor = 'text-red-500 font-semibold';
                          } else if (today < startDate) {
                            statusText = '정지 예정';
                            statusColor = 'text-yellow-600 font-semibold';
                          } else {
                            statusText = '정지 기간 만료';
                            statusColor = 'text-green-600 font-semibold';
                          }
                        }
                        return (
                          <div className={`flex justify-between mt-2 pt-2 border-t border-gray-200 ${statusColor}`}>
                            <span>정지 상태</span>
                            <span>{statusText}</span>
                          </div>
                        );
                      })()
                    ) : (
                      <div className="flex justify-between mt-2 pt-2 border-t border-gray-200">
                        <span>정지 상태</span>
                        <span>정지 이력 없음</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );

        case 'history':
          return (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center">
                  수정 기록
                  <InfoTooltip>이용권 정보 변경 이력을 확인합니다.</InfoTooltip>
                </h4>
                <div className="text-center py-12 bg-gray-50 p-4 rounded-md">
                  <History className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">수정 기록이 없습니다.</p>
                </div>
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
        <DialogContent className="max-w-5xl p-0 border-0" aria-describedby={undefined}>
          <div className="flex h-[800px] sm:rounded-lg overflow-hidden">
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
                  {/* 탭 메뉴에 따라 제목 표시 */}
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
                      <Button variant="outline" onClick={handleDelete} className="flex items-center">
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
  }
);

PassDetailModal.displayName = 'PassDetailModal';
