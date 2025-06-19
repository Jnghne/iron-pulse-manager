// 지출 타입 정의
export interface Expense {
  id: string;
  type: ExpenseType;
  title: string;
  amount: number;
  description: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

// 지출 유형 타입
export type ExpenseType = 'personnel' | 'rent' | 'utilities' | 'other';

// 지출 유형 라벨
export const ExpenseTypeLabels: Record<ExpenseType, string> = {
  personnel: '인건비',
  rent: '임대료',
  utilities: '수도/경비',
  other: '기타 경비'
};

// 지출 등록 폼 데이터
export interface ExpenseFormData {
  type: ExpenseType;
  title: string;
  amount: number;
  description: string;
  date: Date;
}

// 지출 통계 데이터
export interface ExpenseStats {
  totalAmount: number;
  byType: Record<ExpenseType, number>;
  byMonth: Array<{
    month: string;
    amount: number;
  }>;
}