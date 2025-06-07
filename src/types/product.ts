
export enum ProductType {
  MEMBERSHIP = 'membership', // 회원권
  PT = 'pt',                 // PT
  LOCKER = 'locker',           // 락커
  OTHER = 'other',             // 기타
}

export interface Product {
  id: string;
  name: string;          // 상품명 (예: "헬스 3개월", "PT 10회")
  type: ProductType;     // 상품 유형
  price: number;         // 가격
  description?: string;   // 상품 설명 (선택)
  
  // 유형별 추가 정보 (필요에 따라 확장)
  durationDays?: number;   // 회원권 기간 (일)
  totalSessions?: number;  // PT 총 횟수
  
  isActive: boolean;       // 활성/비활성 상태
  createdAt: Date;
  updatedAt: Date;
}

// 상품 폼에서 사용할 값들의 타입
export interface ProductFormValues {
  name: string;
  type: ProductType;
  price: string; // 입력 필드는 문자열로 받았다가 숫자로 변환
  description?: string;
  durationDays?: string;
  totalSessions?: string;
  isActive: boolean;
}
