import { Lock, User } from "lucide-react";
import { mockLockers } from "@/data/mockData";

interface LockerSelectorProps {
  selectedLocker: number | null;
  onLockerSelect: (lockerNumber: number) => void;
  currentMemberId?: string; // 현재 회원 ID - 해당 회원의 락커는 선택 가능하게 함
  readOnly?: boolean; // 읽기 전용 모드
}

// 락커 상태 계산 함수 (LockerRoom.tsx와 동일)
const getLockerStatus = (locker: any): 'empty' | 'in-use' | 'expired' | 'expiring-soon' => {
  if (!locker.isOccupied) {
    return 'empty';
  }
  
  if (!locker.endDate) {
    return 'in-use';
  }
  
  const today = new Date();
  const endDate = new Date(locker.endDate);
  const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilExpiry < 0) {
    return 'expired';
  } else if (daysUntilExpiry <= 30) {
    return 'expiring-soon';
  } else {
    return 'in-use';
  }
};

// 상태별 스타일 반환 함수
const getLockerStyle = (status: string, isSelected: boolean) => {
  if (isSelected) {
    return 'bg-gym-primary border-gym-primary text-white shadow-md';
  }
  
  switch (status) {
    case 'empty':
      return 'bg-card border-border hover:border-primary/50 hover:bg-muted/50 cursor-pointer';
    case 'in-use':
      return 'bg-primary/90 border-primary text-primary-foreground shadow-md cursor-not-allowed opacity-60';
    case 'expired':
      return 'bg-red-500 border-red-600 text-white shadow-md cursor-not-allowed opacity-60';
    case 'expiring-soon':
      return 'bg-yellow-500 border-yellow-600 text-white shadow-md cursor-not-allowed opacity-60';
    default:
      return 'bg-card border-border cursor-not-allowed opacity-60';
  }
};

export const LockerSelector = ({ selectedLocker, onLockerSelect, currentMemberId, readOnly = false }: LockerSelectorProps) => {
  // 비어있는 락커 개수 계산 (현재 회원의 락커 포함)
  const availableCount = mockLockers.filter(locker => {
    const status = getLockerStatus(locker);
    const isMemberLocker = currentMemberId && locker.memberId === currentMemberId;
    return status === 'empty' || isMemberLocker;
  }).length;
  
  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        {readOnly ? '락커 현황' : `비어있는 락커를 선택하세요 (${availableCount}개 이용 가능)`}
      </div>
      <div className="max-h-60 overflow-y-auto">
        <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-2 p-3 bg-muted/10 rounded-lg border border-muted">
          {mockLockers.map(locker => {
            const status = getLockerStatus(locker);
            const isAvailable = status === 'empty';
            const isMemberLocker = currentMemberId && locker.memberId === currentMemberId;
            const isClickable = !readOnly && (isAvailable || isMemberLocker);
            const isSelected = selectedLocker === locker.number;
            
            return (
              <button
                key={locker.id}
                className={`
                  relative p-1.5 h-12 rounded-lg border-2 text-center transition-all duration-200 
                  ${isClickable ? 'hover:shadow-lg hover:scale-105' : ''}
                  ${getLockerStyle(status, isSelected)}
                  ${isMemberLocker && !isSelected ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}
                `}
                onClick={() => isClickable && onLockerSelect(locker.number)}
                disabled={!isClickable}
                title={
                  readOnly
                    ? `${locker.number}번 락커: ${isSelected ? '현재 사용중' : locker.isOccupied ? `${locker.memberName || '사용중'}` : '이용 가능'}`
                    : isMemberLocker
                      ? `${locker.number}번 락커: 현재 사용중인 락커 (변경 가능)`
                      : !isAvailable 
                        ? `${locker.number}번 락커: ${locker.memberName || '사용중'} (${status === 'expired' ? '만료됨' : status === 'expiring-soon' ? '만료 임박' : '사용중'})` 
                        : `${locker.number}번 락커: 이용 가능`
                }
              >
                <div className={`font-bold text-xs ${isSelected ? 'text-white' : ''}`}>
                  {locker.number}
                </div>
                <div className="flex items-center justify-center mt-1">
                  {locker.isOccupied ? (
                    <User className={`h-2 w-2 ${isSelected ? 'text-white' : ''}`} />
                  ) : (
                    <Lock className={`h-2 w-2 ${isSelected ? 'text-white' : 'text-muted-foreground'}`} />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* 범례 추가 */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-card border border-border rounded"></div>
          <span>이용 가능</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-primary/90 rounded"></div>
          <span>사용중</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
          <span>만료 임박</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>만료</span>
        </div>
      </div>
    </div>
  );
};