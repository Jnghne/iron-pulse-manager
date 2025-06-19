import { Expense, ExpenseType } from '@/types/expense';

// Mock 지출 데이터
export const mockExpenses: Expense[] = [
  {
    id: '1',
    type: 'personnel',
    title: '트레이너 급여',
    amount: 2500000,
    description: '김코치, 박트레이너 11월 급여',
    date: new Date('2024-11-01'),
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-11-01')
  },
  {
    id: '2',
    type: 'rent',
    title: '헬스장 임대료',
    amount: 1800000,
    description: '11월 월세',
    date: new Date('2024-11-01'),
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-11-01')
  },
  {
    id: '3',
    type: 'utilities',
    title: '전기요금',
    amount: 350000,
    description: '10월 전기요금',
    date: new Date('2024-11-05'),
    createdAt: new Date('2024-11-05'),
    updatedAt: new Date('2024-11-05')
  },
  {
    id: '4',
    type: 'utilities',
    title: '수도요금',
    amount: 120000,
    description: '10월 수도요금',
    date: new Date('2024-11-05'),
    createdAt: new Date('2024-11-05'),
    updatedAt: new Date('2024-11-05')
  },
  {
    id: '5',
    type: 'other',
    title: '청소용품 구매',
    amount: 80000,
    description: '락스, 세제, 청소도구 등',
    date: new Date('2024-11-10'),
    createdAt: new Date('2024-11-10'),
    updatedAt: new Date('2024-11-10')
  },
  {
    id: '6',
    type: 'other',
    title: '운동기구 수리비',
    amount: 450000,
    description: '러닝머신 벨트 교체',
    date: new Date('2024-11-15'),
    createdAt: new Date('2024-11-15'),
    updatedAt: new Date('2024-11-15')
  },
  {
    id: '7',
    type: 'personnel',
    title: '청소업체 비용',
    amount: 600000,
    description: '11월 청소 용역비',
    date: new Date('2024-11-20'),
    createdAt: new Date('2024-11-20'),
    updatedAt: new Date('2024-11-20')
  },
  {
    id: '8',
    type: 'utilities',
    title: '인터넷 요금',
    amount: 89000,
    description: '11월 인터넷 및 통신비',
    date: new Date('2024-11-25'),
    createdAt: new Date('2024-11-25'),
    updatedAt: new Date('2024-11-25')
  }
];

// 지출 데이터 가져오기
export const getMockExpenses = (): Expense[] => {
  return mockExpenses;
};

// 특정 날짜의 지출 가져오기
export const getExpensesForDate = (date: Date): Expense[] => {
  return mockExpenses.filter(expense => {
    const expenseDate = expense.date.toISOString().split('T')[0];
    const targetDate = date.toISOString().split('T')[0];
    return expenseDate === targetDate;
  });
};

// 특정 월의 지출 가져오기
export const getExpensesForMonth = (year: number, month: number): Expense[] => {
  return mockExpenses.filter(expense => {
    return expense.date.getFullYear() === year && expense.date.getMonth() === month;
  });
};

// 지출 추가
export const addMockExpense = (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Expense => {
  const newExpense: Expense = {
    ...expense,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  mockExpenses.push(newExpense);
  return newExpense;
};

// 지출 수정  
export const updateMockExpense = (id: string, updates: Partial<Expense>): Expense | null => {
  const index = mockExpenses.findIndex(expense => expense.id === id);
  if (index === -1) return null;
  
  mockExpenses[index] = {
    ...mockExpenses[index],
    ...updates,
    updatedAt: new Date()
  };
  return mockExpenses[index];
};

// 지출 삭제
export const deleteMockExpense = (id: string): boolean => {
  const index = mockExpenses.findIndex(expense => expense.id === id);
  if (index === -1) return false;
  
  mockExpenses.splice(index, 1);
  return true;
};