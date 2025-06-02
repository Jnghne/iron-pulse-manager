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

// Member 타입 확장 (실제로는 mockData에서 정의해야 함)
declare module "@/data/mockData" {
  interface Member {
    membershipId?: string;
    membershipPrice?: number;
    ptId?: string;
    ptPrice?: number;
  }
}

export interface MembershipDetailData {
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
}

interface MembershipTabProps {
  member: Member;
  onPaymentRegister: (type: 'gym' | 'pt' | 'locker' | 'other') => void;
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
  const [currentMembershipData, setCurrentMembershipData] = useState<MembershipDetailData | null>(null);

  // 토스트 알림
  const { toast } = useToast();

  // 상품 존재 여부 확인 (실제로는 API에서 가져와야 함)
  const [productsExist, setProductsExist] = useState({
    gym: true,
    pt: true,
    locker: true,
    other: true
  });

  // 이용권 카드 클릭 핸들러
  const handleMembershipCardClick = (type: MembershipType, data: MembershipDetailData) => {
    if (!isOwner) return; // 관리자만 수정 가능

    setDialogType(type);
    setDialogMode('edit');
    setCurrentMembershipData(data);
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
    setCurrentMembershipData(null);
    setDialogOpen(true);
  };

  // 이용권 저장 핸들러
  const handleSaveMembership = (data: MembershipDetailData) => {
    if (onMembershipUpdate) {
      onMembershipUpdate(dialogType, {
        ...data,
        id: currentMembershipData?.id
      });

      toast({
        title: "이용권이 저장되었습니다",
        description: `${data.name || '이용권'} 정보가 업데이트되었습니다.`,
      });
    }
  };

  // 이용권 삭제 핸들러
  const handleDeleteMembership = () => {
    if (onMembershipDelete) {
      onMembershipDelete(dialogType, currentMembershipData?.id);

      toast({
        title: "이용권이 삭제되었습니다",
        description: "이용권 정보가 삭제되었습니다.",
      });
    }
    setDialogOpen(false);
  };

  // 카드 클릭 가능 여부 스타일
  const getCardStyle = (hasData: boolean) => {
    if (!isOwner) return "";
    return hasData
      ? "cursor-pointer hover:shadow-md transition-shadow duration-200"
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
        onClick={() => member.membershipActive && handleMembershipCardClick('gym', {
          id: member.id,
          productId: member.membershipId,
          name: `헬스 이용권 ${member.memberType}`,
          startDate: new Date(member.membershipStartDate || ''),
          endDate: new Date(member.membershipEndDate || ''),
          price: member.membershipPrice,
        })}
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
          {isOwner && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleRegisterClick('gym');
              }}
              className="flex items-center gap-2 text-sm bg-gym-primary hover:bg-gym-primary/90"
            >
              {member.membershipActive ? (
                <>
                  <Edit className="h-4 w-4" />
                  수정
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  결제 등록
                </>
              )}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {member.membershipActive ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">상품명</span>
                <span className="font-medium">헬스 이용권 {member.memberType}</span>
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
              {member.availableBranches && member.availableBranches.length > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">이용 가능 지점</span>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {member.availableBranches.map((branch, index) => (
                      <Badge key={index} variant="outline" className="bg-gray-100">
                        {branch}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
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

      {/* PT 레슨권 정보 */}
      <Card
        className={getCardStyle(!!member.hasPT)}
        onClick={() => member.hasPT && handleMembershipCardClick('pt', {
          id: member.id,
          productId: member.ptId,
          name: `PT ${member.ptTotal}회권`,
          startDate: new Date(member.ptStartDate || ''),
          endDate: new Date(member.ptExpiryDate || ''),
          price: member.ptPrice,
          remainingSessions: member.ptRemaining,
          totalSessions: member.ptTotal,
          notes: `담당 트레이너: ${member.trainerAssigned || '미지정'}`
        })}
      >
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-gym-primary" />
              PT 레슨권
            </CardTitle>
            <CardDescription>
              퍼스널 트레이닝 이용권 상태 및 정보
            </CardDescription>
          </div>
          {isOwner && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleRegisterClick('pt');
              }}
              className="flex items-center gap-2 text-sm bg-gym-primary hover:bg-gym-primary/90"
            >
              {member.hasPT ? (
                <>
                  <Edit className="h-4 w-4" />
                  수정
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  결제 등록
                </>
              )}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {member.hasPT ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">상품명</span>
                <span className="font-medium">PT {member.ptTotal}회권</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">담당 트레이너</span>
                <span className="font-medium">{member.trainerAssigned || '미지정'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">남은 횟수</span>
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-100 text-blue-800">
                    {member.ptRemaining}회
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    ({formatDate(member.ptStartDate || '')} ~ {formatDate(member.ptExpiryDate || '')})
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <Badge variant="destructive">이용권 없음</Badge>
              <p className="mt-2 text-sm text-muted-foreground">
                현재 등록된 PT 이용권이 없습니다.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 락커 이용권 정보 */}
      <Card
        className={getCardStyle(!!member.lockerInfo)}
        onClick={() => member.lockerInfo && handleMembershipCardClick('locker', {
          id: member.id,
          productId: lockerInfoWithId?.id,
          name: member.lockerInfo?.name,
          startDate: new Date(member.lockerInfo?.startDate || ''),
          endDate: new Date(member.lockerInfo?.endDate || ''),
          price: lockerInfoWithId?.price,
          lockerNumber: member.lockerInfo?.lockerNumber,
          notes: member.lockerInfo?.notes
        })}
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
          {isOwner && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleRegisterClick('locker');
              }}
              className="flex items-center gap-2 text-sm bg-gym-primary hover:bg-gym-primary/90"
            >
              {member.lockerInfo ? (
                <>
                  <Edit className="h-4 w-4" />
                  수정
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  결제 등록
                </>
              )}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {member.lockerInfo ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">상품명</span>
                <span className="font-medium">{member.lockerInfo.name}</span>
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
      <Card
        className={getCardStyle(false)} // 현재는 기타 상품 데이터가 없음
        onClick={() => member.otherProducts && handleMembershipCardClick('other', {
          // 기타 상품 데이터가 있다면 여기에 추가
        })}
      >
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-gym-primary" />
              기타 상품
            </CardTitle>
            <CardDescription>
              기타 상품 결제 내역
            </CardDescription>
          </div>
          {isOwner && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleRegisterClick('other');
              }}
              className="flex items-center gap-2 text-sm bg-gym-primary hover:bg-gym-primary/90"
            >
              <Plus className="h-4 w-4" />
              결제 등록
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Badge variant="outline" className="bg-gray-100">기록 없음</Badge>
            <p className="mt-2 text-sm text-muted-foreground">
              등록된 기타 상품 결제 내역이 없습니다.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
    
    {/* 이용권 관리 다이얼로그 */ }
  <MembershipDialog
    open={dialogOpen}
    onOpenChange={setDialogOpen}
    type={dialogType}
    mode={dialogMode}
    currentData={currentMembershipData}
    onSave={handleSaveMembership}
    onDelete={handleDeleteMembership}
    />
    </>
  );
};
