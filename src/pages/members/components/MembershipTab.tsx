import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dumbbell,
  User,
  Calendar,
  Clock,
  Key,
  ShoppingBag,
  Plus,
  Edit,
  AlertCircle
} from "lucide-react";
import { Member } from "@/data/mockData";
import { formatDate } from "@/lib/utils";
import { MembershipDialog, MembershipType } from "./MembershipDialog";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { PassDetailModal } from '@/components/features/pass/PassDetailModal';
import type { PassDetails } from '@/types/pass';
import type { MembershipFormDataType } from './MembershipDialog';
import { mockProducts } from '@/data/mockProducts';
import { ProductType } from '@/types/product';

// Member 타입 확장 (실제로는 mockData에서 정의해야 함)
declare module "@/data/mockData" {
  interface Member {
    membershipId?: string;
    ptId?: string;
  }
}

export interface MembershipDetailData {
  id?: string;
  productId?: string;
  name?: string;
  startDate?: Date;
  endDate?: Date;
  lessonStartDate?: Date;
  lessonEndDate?: Date;
  price?: number;
  remainingSessions?: number;
  totalSessions?: number;
  lockerNumber?: string;
  notes?: string;
}

interface MembershipTabProps {
  member: Member;
  onPaymentRegister: (type: 'gym' | 'lesson' | 'locker' | 'other' | 'merchandise') => void;
  isOwner: boolean;
  onMembershipUpdate?: (type: MembershipType, data: MembershipDetailData) => void;
  onMembershipDelete?: (type: MembershipType, id?: string) => void;
}

export const MembershipTab = ({
  member,
  onPaymentRegister,
  isOwner,
  onMembershipUpdate,
  onMembershipDelete
}: MembershipTabProps) => {
  // 다이얼로그 상태 관리
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<MembershipType>('gym');
  const [dialogMode, setDialogMode] = useState<'edit' | 'create'>('create');
  const [currentDialogData, setCurrentDialogData] = useState<MembershipFormDataType | undefined>();

  // 토스트 알림
  const { toast } = useToast();

  // PassDetailModal 상태 관리
  const [isPassDetailModalOpen, setIsPassDetailModalOpen] = useState(false);
  const [selectedPassDetails, setSelectedPassDetails] = useState<PassDetails | null>(null);

  // 상품 존재 여부 확인 (실제로는 API에서 가져와야 함)
  const [productsExist, setProductsExist] = useState({
    gym: true,
    lesson: true,
    locker: true,
    other: true
  });

  // 이용권 카드 클릭 핸들러
  const handleMembershipCardClick = (
    type: MembershipType,
    data?: MembershipFormDataType
  ) => {
    if (!isOwner) return; // 관리자만 수정 가능

    setDialogType(type);
    setDialogMode('edit');
    setCurrentDialogData(data);
    setDialogOpen(true);
  };

  // 결제 등록 버튼 클릭 핸들러
  const handleRegisterClick = (type: MembershipType) => {
    // 상품이 없는 경우 처리
    if (!productsExist[type]) {
      toast({
        title: "등록된 상품이 없습니다",
        description: "먼저 상품을 등록해주세요.",
        variant: "destructive"
      });
      return;
    }

    setDialogType(type);
    setDialogMode('create');
    setCurrentDialogData(undefined);
    setDialogOpen(true);
  };

  // 이용권 저장 핸들러
  const handleSaveMembership = (data: MembershipDetailData) => {
    if (onMembershipUpdate) {
      onMembershipUpdate(dialogType, {
        ...data,
        id: currentDialogData?.id
      });

      toast({
        title: "이용권이 저장되었습니다",
        description: `${data.name || '이용권'} 정보가 업데이트되었습니다.`,
      });
    }
  };

  // PassDetails 객체로 변환하는 헬퍼 함수
  const mapToPassDetails = (
    type: 'gym' | 'lesson' | 'locker' | 'other',
    memberData: Member,
    specificData?: MembershipDetailData
  ): PassDetails => {
    // 상품 관리 메뉴의 목 데이터에서 해당 타입에 맞는 상품 찾기
    let productType: ProductType;
    switch (type) {
      case 'gym':
        productType = ProductType.MEMBERSHIP;
        break;
      case 'lesson':
        productType = ProductType.LESSON;
        break;
      case 'locker':
        productType = ProductType.LOCKER;
        break;
      case 'other':
        productType = ProductType.OTHER;
        break;
      default:
        productType = ProductType.OTHER;
    }
    
    // 해당 타입의 상품 목록 필터링
    const typeProducts = mockProducts.filter(p => p.type === productType && p.isActive);
    
    // 상품 ID가 있으면 해당 상품 찾기, 없으면 해당 타입의 첫 번째 상품 사용
    const productId = specificData?.productId;
    const product = productId 
      ? mockProducts.find(p => p.id === productId) 
      : (typeProducts.length > 0 ? typeProducts[0] : undefined);

    const commonDetails = {
      consultant: '오정석', // 예시 데이터 (이미지 참조)
      instructor: memberData.trainerAssigned || '배정 예정',
      paymentDate: '2025. 05. 27. 19:35', // 예시 데이터 (이미지 참조)
      paymentMethod: '카드 결제', // 예시 데이터 (이미지 참조)
      purchasePurpose: '다이어트', // 예시 데이터 (이미지 참조)
      actualPaymentAmount: specificData?.price || 0,
      consultantSalesShare: 0, // 예시 데이터
      unpaidAmount: 0, // 예시 데이터
      consultantSalesPerformance: 150000, // 예시 데이터
      unpaidOrPerformanceShare: 50000, // 예시 데이터
      memo: '특별 할인 적용', // 예시 데이터
    };

    let serviceStartDateStr = 'N/A';
    let serviceEndDateStr = 'N/A';

    const formatDateForPass = (dateInput: Date | string | undefined): string => {
      if (!dateInput) return 'N/A';
      try {
        const dateObj = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
        if (isNaN(dateObj.getTime())) return 'N/A';
        const year = dateObj.getFullYear();
        const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        const day = dateObj.getDate().toString().padStart(2, '0');
        const hours = dateObj.getHours();
        const period = hours >= 12 ? '오후' : '오전';
        return `${year}. ${month}. ${day}. ${period}`;
      } catch (e) {
        return 'N/A';
      }
    };

    if (type === 'gym') {
      serviceStartDateStr = formatDateForPass(specificData?.startDate || memberData.membershipStartDate);
      serviceEndDateStr = formatDateForPass(specificData?.endDate || memberData.membershipEndDate);
      return {
        id: specificData?.id || memberData.id || 'gym-pass',
        name: product?.name || specificData?.name || `헬스 이용권 ${memberData.memberType || ''}`,
        type: '회원권',
        category: '기간제',
        subCategory: '헬스',
        serviceStartDate: serviceStartDateStr,
        serviceEndDate: serviceEndDateStr,
        productAmount: product?.price || specificData?.price || 0,
        instructor: memberData.trainerAssigned || commonDetails.instructor,
        ...commonDetails,
        actualPaymentAmount: specificData?.price || 0,
      };
    } else if (type === 'lesson') {
      serviceStartDateStr = formatDateForPass(specificData?.startDate || memberData.lessonStartDate);
      serviceEndDateStr = formatDateForPass(specificData?.endDate || memberData.lessonEndDate);
      return {
        id: specificData?.id || memberData.id || 'lesson-pass',
        name: product?.name || specificData?.name || `개인레슨 이용권 ${specificData?.totalSessions || memberData.lessonTotal || ''}회`,
        type: '개인레슨 이용권',
        category: '횟수제',
        subCategory: '개인레슨',
        serviceStartDate: serviceStartDateStr,
        serviceEndDate: serviceEndDateStr,
        productAmount: product?.price || specificData?.price || 0,
        lessonTotalSessions: product?.totalSessions || specificData?.totalSessions || memberData.lessonTotal || 0,
        lessonRemainingSessions: specificData?.remainingSessions || memberData.lessonRemaining || 0,
        instructor: memberData.trainerAssigned || commonDetails.instructor,
        ...commonDetails,
        actualPaymentAmount: specificData?.price || 0,
      };
    } else if (type === 'locker') {
      serviceStartDateStr = formatDateForPass(specificData?.startDate);
      serviceEndDateStr = formatDateForPass(specificData?.endDate);
      return {
        id: specificData?.id || 'locker-pass',
        name: product?.name || specificData?.name || `락커 이용권 ${specificData?.lockerNumber || ''}`,
        type: '락커',
        category: '기간제',
        subCategory: '락커',
        serviceStartDate: serviceStartDateStr,
        serviceEndDate: serviceEndDateStr,
        productAmount: product?.price || specificData?.price || 0,
        ...commonDetails,
        actualPaymentAmount: specificData?.price || 0,
        lockerNumber: specificData?.lockerNumber || memberData.lockerInfo?.lockerNumber,
        lockerEndDate: specificData?.endDate ? formatDateForPass(specificData.endDate) : (memberData.lockerInfo?.endDate ? formatDateForPass(memberData.lockerInfo.endDate) : undefined),
      };
    } else if (type === 'other') {
      serviceStartDateStr = formatDateForPass(specificData?.startDate);
      serviceEndDateStr = formatDateForPass(specificData?.endDate);
      return {
        id: specificData?.id || 'other-pass',
        name: product?.name || specificData?.name || '기타 이용권',
        type: '기타',
        category: specificData?.category || '기타',
        subCategory: '기타',
        serviceStartDate: serviceStartDateStr,
        serviceEndDate: serviceEndDateStr,
        productAmount: product?.price || specificData?.price || 0,
        ...commonDetails,
        actualPaymentAmount: specificData?.price || 0,
      };
    }
    // 기본 반환값
    return {
        id: 'unknown-pass',
        name: '알 수 없는 이용권',
        type: '기타',
        category: '기타',
        subCategory: '기타',
        serviceStartDate: 'N/A',
        serviceEndDate: 'N/A',
        productAmount: 0,
        ...commonDetails, // commonDetails에 이미 instructor가 포함됨
    };
  };

  // PassDetailModal 열기 핸들러
  const openPassDetailModalHandler = (pass: PassDetails) => {
    setSelectedPassDetails(pass);
    setIsPassDetailModalOpen(true);
  };

  const closePassDetailModalHandler = () => {
    setIsPassDetailModalOpen(false);
    setSelectedPassDetails(null);
    // 수정 모드에서 닫을 때 PassDetailModal 내부에서 isEditing을 false로 처리하므로 여기서는 별도 처리 불필요
  };

  // PassDetailModal에서 호출될 이용권 업데이트 핸들러
  const handleUpdatePass = (updatedPassDetails: PassDetails) => {
    console.log('Update Pass:', updatedPassDetails);
    // TODO: API 호출하여 서버 데이터 업데이트
    // 예시: updateMembershipPass(updatedPassDetails).then(() => {
    //   refetchMembershipList(); // 목록 새로고침
    //   closePassDetailModalHandler();
    // });
    // 현재는 모달 내부에서 저장 후 닫지 않으므로, 필요시 여기서 closePassDetailModalHandler() 호출
  };

  // PassDetailModal에서 호출될 이용권 삭제 핸들러
  const handleDeletePass = (passId: string) => {
    console.log('Delete Pass ID:', passId);
    // TODO: API 호출하여 서버 데이터 삭제
    // 예시: deleteMembershipPass(passId).then(() => {
    //   refetchMembershipList(); // 목록 새로고침
    //   closePassDetailModalHandler(); // 삭제 후 모달은 PassDetailModal 내부에서 닫힘
    // });
  };

  // 이용권 삭제 핸들러
  const handleDeleteMembership = () => {
    if (onMembershipDelete) {
      onMembershipDelete(dialogType, currentDialogData?.id);

      toast({
        title: "이용권이 삭제되었습니다",
        description: "이용권 정보가 삭제되었습니다.",
      });
    }
    setDialogOpen(false);
  };

  // 카드 클릭 가능 여부 스타일
  const getCardStyle = (hasData: boolean) => {
    // if (!isOwner) return ""; // isOwner 조건 제거
    return hasData
      ? "cursor-pointer hover:border-gym-primary hover:shadow-lg transition-all duration-200 ease-in-out"
      : "";
  };

  // 락커 정보에 id와 price 속성 추가 (실제로는 API에서 가져와야 함)
  const lockerInfoWithId = member.lockerInfo ? {
    ...member.lockerInfo,
    id: 'locker-1', // 임시 ID
    price: 30000 // 임시 가격
  } : null;
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 헬스장 이용권 정보 */}
        <Card
          className={getCardStyle(!!member.membershipActive)}
          onClick={() => {
            if (member.membershipActive) {
              const passDetailsData = mapToPassDetails('gym', member, {
                id: member.id,
                productId: member.membershipId,
                name: `헬스 이용권 ${member.memberType}`,
                startDate: new Date(member.membershipStartDate || ''),
                endDate: new Date(member.membershipEndDate || ''),
              });
              openPassDetailModalHandler(passDetailsData);
            }
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-gym-primary" />
                헬스장 이용권
              </CardTitle>
              <CardDescription>
                헬스장 이용권 상태 및 정보
              </CardDescription>
            </div>
            {/* 헬스장 이용권이 없을 때만 신규 등록 버튼 표시 */}
            {!member.membershipActive && (
              <Button 
                variant="outline" 
                size="sm" 
                data-button="true"
                onClick={(e) => {
                  e.stopPropagation();
                  onPaymentRegister('gym');
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                신규 등록
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {member.membershipActive ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">상품명</span>
                  <span className="font-medium">
                    {(() => {
                      // 회원권 상품 ID가 있으면 해당 상품 이름 찾기
                      if (member.membershipId) {
                        const product = mockProducts.find(p => p.id === member.membershipId && p.type === ProductType.MEMBERSHIP);
                        if (product) return product.name;
                      }
                      return `헬스 이용권 ${member.memberType || ''}`;
                    })()} 
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">남은 기간</span>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-800">
                      {member.gymMembershipDaysLeft}일
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      ({formatDate(member.membershipStartDate || '')} ~ {formatDate(member.membershipEndDate || '')})
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <Badge variant="destructive">이용권 없음</Badge>
                <p className="mt-2 text-sm text-muted-foreground">
                  현재 등록된 헬스장 이용권이 없습니다.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 개인레슨 레슨권 정보 */}
        <Card
          className={getCardStyle(!!member.hasLesson)}
          onClick={() => {
            if (member.hasLesson) {
              const passDetailsData = mapToPassDetails('lesson', member, {
                id: member.id,
                productId: member.ptId,
                name: `개인레슨 ${member.lessonTotal}회권`,
                startDate: new Date(member.lessonStartDate || ''),
                endDate: new Date(member.lessonEndDate || ''),
                remainingSessions: member.lessonRemaining,
                totalSessions: member.lessonTotal,
                notes: `담당 트레이너: ${member.trainerAssigned || '미지정'}`
              });
              openPassDetailModalHandler(passDetailsData);
            }
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-gym-primary" />
                개인레슨 이용권
              </CardTitle>
              <CardDescription>
                개인레슨 이용권 상태 및 정보
              </CardDescription>
            </div>
            {/* 개인레슨 이용권이 없을 때만 신규 등록 버튼 표시 */}
            {!member.hasLesson && (
              <Button 
                variant="outline" 
                size="sm" 
                data-button="true"
                onClick={(e) => {
                  e.stopPropagation();
                  onPaymentRegister('lesson');
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                신규 등록
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {member.hasLesson ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">상품명</span>
                  <span className="font-medium">
                    {(() => {
                      // 개인레슨 상품 ID가 있으면 해당 상품 이름 찾기
                      if (member.ptId) {
                        const product = mockProducts.find(p => p.id === member.ptId && p.type === ProductType.LESSON);
                        if (product) return product.name;
                      }
                      return `개인레슨 ${member.lessonTotal || 0}회권`;
                    })()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">담당 트레이너</span>
                  <span className="font-medium">{member.trainerAssigned || '미지정'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">남은 횟수</span>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-800">
                      {member.lessonRemaining}회
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      ({formatDate(member.lessonStartDate || '')} ~ {formatDate(member.lessonEndDate || '')})
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <Badge variant="destructive">이용권 없음</Badge>
                <p className="mt-2 text-sm text-muted-foreground">
                  현재 등록된 개인레슨 이용권이 없습니다.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 락커 이용권 정보 */}
        <Card
          className={getCardStyle(!!member.lockerInfo)}
          onClick={() => {
            if (member.lockerInfo) {
              const passDetailsData = mapToPassDetails('locker', member, {
                id: member.id,
                productId: member.lockerId,
                name: member.lockerInfo?.name,
                startDate: new Date(member.lockerInfo?.startDate || ''),
                endDate: new Date(member.lockerInfo?.endDate || ''),
                lockerNumber: member.lockerInfo?.lockerNumber,
                notes: member.lockerInfo?.notes
              });
              openPassDetailModalHandler(passDetailsData);
            }
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Key className="h-5 w-5 text-gym-primary" />
                락커 이용권
              </CardTitle>
              <CardDescription>
                락커 이용권 상태 및 정보
              </CardDescription>
            </div>
            {/* 락커 이용권이 없을 때만 신규 등록 버튼 표시 */}
            {!member.lockerInfo && (
              <Button 
                variant="outline" 
                size="sm" 
                data-button="true"
                onClick={(e) => {
                  e.stopPropagation();
                  onPaymentRegister('locker');
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                신규 등록
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {member.lockerInfo ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">상품명</span>
                  <span className="font-medium">
                    {(() => {
                      // 락커 상품 ID가 있으면 해당 상품 이름 찾기
                      if (member.lockerId) {
                        const product = mockProducts.find(p => p.id === member.lockerId && p.type === ProductType.LOCKER);
                        if (product) return product.name;
                      }
                      return member.lockerInfo?.name || '락커 이용권';
                    })()} 
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">남은 기간</span>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-800">
                      {member.lockerInfo.daysLeft}일
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      ({formatDate(member.lockerInfo.startDate)} ~ {formatDate(member.lockerInfo.endDate)})
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">락커 정보</span>
                  <Badge variant="outline" className="bg-gray-100">
                    {member.lockerInfo.lockerNumber}
                  </Badge>
                </div>
                {member.lockerInfo.notes && (
                  <div>
                    <span className="text-sm text-muted-foreground">특이사항</span>
                    <div className="mt-1 p-2 bg-muted/50 rounded-md">
                      <p className="text-sm">{member.lockerInfo.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <Badge variant="destructive">이용권 없음</Badge>
                <p className="mt-2 text-sm text-muted-foreground">
                  현재 등록된 락커 이용권이 없습니다.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 기타 결제 정보 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-gym-primary" />
                기타 이용권
              </CardTitle>
              <CardDescription>
                기타 이용권 결제 내역
              </CardDescription>
            </div>
            {/* 이용권이 등록되어 있지 않을 때만 신규 등록 버튼 표시 */}
            {(!member.otherProducts || member.otherProducts.length === 0) && (
              <Button 
                variant="outline" 
                size="sm" 
                data-button="true"
                onClick={(e) => { 
                  // 이벤트 전파 완전 차단
                  e.stopPropagation();
                  e.preventDefault(); 
                  
                  // 모든 모달 상태 초기화
                  setIsPassDetailModalOpen(false);
                  setSelectedPassDetails(null);
                  setDialogOpen(false);
                  
                  // 상품등록 팝업만 열기
                  onPaymentRegister('merchandise');
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                신규 등록
              </Button>
            )}
            {/* 이용권이 등록되어 있을 때 추가 등록 버튼 표시 */}
            {member.otherProducts && member.otherProducts.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                data-button="true"
                onClick={(e) => { 
                  // 이벤트 전파 완전 차단
                  e.stopPropagation();
                  e.preventDefault(); 
                  
                  // 모든 모달 상태 초기화
                  setIsPassDetailModalOpen(false);
                  setSelectedPassDetails(null);
                  setDialogOpen(false);
                  
                  // 상품등록 팝업만 열기
                  onPaymentRegister('merchandise');
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                추가 등록
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {(!member.otherProducts || member.otherProducts.length === 0) ? (
              <div className="text-center py-6">
                <Badge variant="destructive">이용권 없음</Badge>
                <p className="mt-2 text-sm text-muted-foreground">
                  등록된 기타 이용권 결제 내역이 없습니다.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {member.otherProducts.map((product, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => {
                      const passDetailsData = mapToPassDetails('other', member, {
                        id: `other_${index}`,
                        productId: `other_${index}`,
                        name: product.name,
                        startDate: new Date(product.startDate),
                        endDate: new Date(product.endDate),
                        category: product.type,
                        price: 0 // 기타 상품은 가격이 없을 수 있음
                      });
                      openPassDetailModalHandler(passDetailsData);
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {product.startDate} ~ {product.endDate}
                        </div>
                        {product.type && (
                          <Badge variant="outline" className="text-xs mt-1">
                            {product.type}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Badge variant="secondary">이용 중</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* 이용권 관리 다이얼로그 */}
      <MembershipDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        type={dialogType}
        mode={dialogMode}
        currentData={currentDialogData}
        onSave={handleSaveMembership}
        onDelete={handleDeleteMembership}
      />

      {/* PassDetailModal 렌더링 */}
      <PassDetailModal
        isOpen={isPassDetailModalOpen && selectedPassDetails !== null}
        onClose={closePassDetailModalHandler}
        passDetails={selectedPassDetails}
        member={member}
        isOwner={isOwner}
        onUpdatePass={handleUpdatePass}
        onDeletePass={handleDeletePass}
      />
    </>
  );
};
