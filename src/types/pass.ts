// src/types/pass.ts

export interface PassDetails {
  id: string;
  productId?: string; // 상품 ID (상품 관리 메뉴의 상품과 연결)
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
  
  // 계약서 관련 필드
  contractImages?: string[]; // 계약서 이미지 URL 배열
  
  // 이용 정지 관련 필드
  suspensionStartDate?: string | null; // YYYY.MM.DD. 형식
  suspensionEndDate?: string | null; // YYYY.MM.DD. 형식
  suspensionReason?: string | null;

  // 수정 기록 관련 필드
  editHistory?: EditHistoryEntry[];
}

export interface EditHistoryEntry {
  timestamp: string; // ISO 8601 형식의 날짜-시간 문자열
  modifiedBy?: string; // 수정한 사람 (예: "관리자", "오정석 트레이너")
  field: string; // 변경된 필드의 이름 (예: "서비스 만료일", "정지 사유")
  oldValue: string | number | boolean | null | undefined;
  newValue: string | number | boolean | null | undefined;
  reason?: string; // 변경 사유 (선택 사항)
}

export interface SidebarMenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
}
