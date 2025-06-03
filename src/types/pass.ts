// src/types/pass.ts

export interface PassDetails {
  id: string;
  status?: '사용중' | '만료' | '정지'; // 이용권 상태
  name: string; // 예: "헬스이용권 12개월권"
  type: string; // 예: "회원권"
  category: string; // 예: "기간제"
  subCategory: string; // 예: "헬스"
  serviceStartDate: string; // 예: "2025. 05. 27. 오후"
  serviceEndDate: string; // 예: "2026. 05. 26. 오후"
  consultant?: string; // 예: "오정석"
  instructor?: string; // 예: "배정 예정"
  paymentDate: string; // 예: "2025. 05. 27. 19:35"
  paymentMethod: string; // 예: "카드 결제"
  purchasePurpose?: string; // 예: "다이어트"
  productAmount: number; // 예: 358800
  actualPaymentAmount: number; // 예: 0
  consultantSalesShare?: number; // 예: 0
  unpaidAmount?: number; // 미수금 (예: 0)
  ptTotalSessions?: number; // PT 총 횟수 (PT 이용권인 경우)
  ptRemainingSessions?: number; // PT 잔여 횟수 (PT 이용권인 경우)
  revenueDistributionNotes?: string; // 실적 배분 관련 메모
  // 향후 다른 탭의 데이터 필드를 추가할 수 있습니다。
  // 예: contractDetails, suspensionInfo, editHistory 등
}

export interface SidebarMenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
}
