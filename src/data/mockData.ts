
// 락커 타입 정의
export interface Locker {
  id: string;
  number: number;
  isOccupied: boolean;
  memberId?: string;
  memberName?: string;
  startDate?: string;
  endDate?: string;
  // 결제 정보 추가
  product?: string; // 락커 상품명 (ex: 락커 3개월)
  productPrice?: number; // 상품 금액
  actualPrice?: number; // 실제 결제 금액
  staffCommission?: number; // 직원 매출 실적
  unpaidAmount?: number; // 미수금
  paymentDate?: string; // 결제일시
  paymentTime?: string; // 결제 시간
  paymentMethod?: '카드' | '현금' | '계좌이체'; // 결제 수단
  fee?: number; // 기존 결제 금액 (actualPrice와 동일)
  isPaid?: boolean;
  notes?: string; // 특이사항 메모
}

// 출석 기록 타입 정의
export interface AttendanceRecord {
  date: string;
  attended: boolean;
  timeIn?: string;
}

// 회원 타입 정의
export interface Member {
  id: string;
  name: string;
  gender: 'male' | 'female';
  birthDate?: string;
  phone: string;
  email?: string;
  address?: string;
  memberType: string;
  registrationDate: string;
  expiryDate?: string;
  lessonRemaining?: number; // 개인레슨 잔여 횟수
  lessonTotal?: number; // 개인레슨 총 횟수
  lessonStartDate?: string; // 개인레슨 시작일
  lessonEndDate?: string; // 개인레슨 만료일
  gymMembershipDaysLeft?: number;
  attendanceRate: number;
  trainerAssigned?: string;
  trainerNotes?: string;
  smsConsent: boolean;
  appUsage?: boolean; // 앱 이용 여부
  photoUrl?: string;
  membershipActive?: boolean;
  hasLesson?: boolean; // 개인레슨 여부
  membershipId?: string;
  ptId?: string; // 개인레슨 상품 ID
  lockerId?: string;
  membershipStartDate?: string;
  membershipEndDate?: string;
  phoneNumber?: string;

  // 회원 상세 페이지 리뉴얼에 필요한 추가 필드
  unpaidAmount?: number; // 잔여 미수금
  registrationPath?: string; // 방문/가입 경로
  memberNotes?: string; // 특이사항 메모
  
  // 락커 이용권 정보
  lockerInfo?: {
    name: string; // 락커 상품명
    daysLeft: number; // 남은 기간
    startDate: string; // 시작일
    endDate: string; // 종료일
    lockerNumber: string; // 락커 번호
    notes?: string; // 락커 특이사항
  };
  
  // 기타 상품 정보
  otherProducts?: {
    name: string; // 상품명
    startDate: string; // 시작일
    endDate: string; // 종료일
    type: string; // 상품 유형 (식음료, 공간대여, 촬영협조 등)
  }[];
  
  // 정지 기록
  suspensionRecords?: {
    date: string; // 정지 일시
    duration: number; // 정지 기간 (일)
    reason: string; // 정지 사유
    approver: string; // 승인 담당자
  }[];
}


// 회원 데이터 샘플
export const mockMembers: Member[] = [
  {
    id: 'M00001',
    name: '김지원',
    gender: 'female',
    birthDate: '1990-05-15',
    phone: '010-1234-5678',
    phoneNumber: '010-1234-5678',
    email: 'jiwon@example.com',
    address: '서울시 강남구 역삼동 123-45',
    memberType: '정회원',
    registrationDate: '2025-01-15',
    expiryDate: '2026-01-14',
    lessonRemaining: 15,
    lessonTotal: 30,
    lessonEndDate: '2025-06-30',
    lessonStartDate: '2024-01-15',
    ptId: 'prod_010',
    gymMembershipDaysLeft: 230,
    attendanceRate: 85,
    trainerAssigned: '박지훈',
    trainerNotes: '운동 성장이 빠르고 열정적임. 사이클링 선호.',
    smsConsent: true,
    appUsage: true,
    membershipActive: true,
    membershipId: 'prod_001',
    hasLesson: true,
    membershipStartDate: '2023-01-15',
  },
  {
    id: 'M00002',
    name: '이지훈',
    gender: 'male',
    birthDate: '1985-08-22',
    phone: '010-9876-5432',
    phoneNumber: '010-9876-5432',
    email: 'jihoon@example.com',
    address: '서울시 송파구 잠실동 456-78',
    memberType: '정회원',
    registrationDate: '2025-02-10',
    expiryDate: '2026-08-09',
    lessonRemaining: 8,
    lessonTotal: 10,
    lessonStartDate: '2025-01-10',
    ptId: 'prod_002',
    lessonEndDate: '2024-09-30',
    gymMembershipDaysLeft: 75,
    attendanceRate: 92,
    trainerAssigned: '박지훈',
    trainerNotes: '근력 향상에 관심이 많음. 웨이트 트레이닝 위주로 진행.',
    smsConsent: true,
    appUsage: true,
    membershipActive: true,
    membershipId: 'prod_001',
    hasLesson: true,
    lockerId: 'prod_003',
    membershipStartDate: '2023-02-10',
  },
  {
    id: 'M00003',
    name: '박수진',
    gender: 'female',
    birthDate: '1992-12-03',
    phone: '010-5555-7777',
    phoneNumber: '010-5555-7777',
    email: 'soojin@example.com',
    memberType: '개인레슨 회원',
    registrationDate: '2024-03-20',
    expiryDate: '2024-08-09',
    lessonRemaining: 22,
    lessonEndDate: '2026-12-31',
    attendanceRate: 78,
    trainerAssigned: '박지훈',
    smsConsent: false,
    appUsage: false,
    membershipActive: false,
    hasLesson: true,
    ptId: 'prod_002', // 개인레슨 상품 ID 추가
  },
  {
    id: 'M00004',
    name: '정동현',
    gender: 'male',
    birthDate: '1988-04-17',
    phone: '010-2222-3333',
    phoneNumber: '010-2222-3333',
    email: 'donghyun@example.com',
    memberType: '일반회원',
    registrationDate: '2024-05-05',
    expiryDate: '2025-05-04',
    gymMembershipDaysLeft: 0,
    attendanceRate: 65,
    trainerAssigned: '김지원',
    smsConsent: true,
    appUsage: true,
    membershipActive: false,
    hasLesson: false,
    lockerId: 'prod_003', // 락커 상품 ID 추가
  },
  {
    id: 'M00005',
    name: '김영희',
    gender: 'female',
    birthDate: '1995-11-27',
    phone: '010-8888-9999',
    phoneNumber: '010-8888-9999',
    email: 'younghee@example.com',
    memberType: 'VIP 회원',
    registrationDate: '2025-01-02',
    expiryDate: '2026-01-01',
    lessonRemaining: 30,
    lessonEndDate: '2026-01-01',
    gymMembershipDaysLeft: 220,
    attendanceRate: 95,
    trainerAssigned: '박지훈',
    trainerNotes: '체중 감량과 근육량 증가가 목표. 다이어트 시작.',
    smsConsent: true,
    appUsage: true,
    membershipActive: true,
    hasLesson: true,
    lockerId: undefined, // 김영희 회원은 락커 미사용 (명시적으로 undefined 설정)
    membershipId: 'prod_001', // 헬스 6개월 상품 ID
    ptId: 'prod_002', // 개인레슨 10회 상품 ID
    membershipStartDate: '2023-01-02',
  },
  {
    id: 'M00006',
    name: '최지원',
    gender: 'male',
    birthDate: '1982-09-08',
    phone: '010-7777-6666',
    phoneNumber: '010-7777-6666',
    email: 'jiwon.choi@example.com',
    memberType: '정회원',
    registrationDate: '2025-06-15',
    expiryDate: '2026-06-14',
    lessonRemaining: 0,
    gymMembershipDaysLeft: 20,
    attendanceRate: 70,
    trainerAssigned: '김지원',
    smsConsent: true,
    appUsage: true,
    membershipActive: true,
    hasLesson: false,
    membershipId: 'prod_001', // 헬스 6개월 상품 ID
    membershipStartDate: '2023-06-15',
  },
  {
    id: 'M00007',
    name: '이지영',
    gender: 'female',
    birthDate: '1993-03-25',
    phone: '010-3333-4444',
    phoneNumber: '010-3333-4444',
    email: 'jiyoung@example.com',
    memberType: '학생 회원',
    registrationDate: '2025-01-10',
    expiryDate: '2025-07-09',
    gymMembershipDaysLeft: 45,
    attendanceRate: 60,
    smsConsent: true,
    appUsage: true,
    membershipActive: true,
    hasLesson: false,
    membershipStartDate: '2024-01-10',
  },
  {
    id: 'M00008',
    name: '박진수',
    gender: 'male',
    birthDate: '1978-11-15',
    phone: '010-9999-8888',
    phoneNumber: '010-9999-8888',
    email: 'jinsoo@example.com',
    memberType: '개인레슨 회원',
    registrationDate: '2024-09-01',
    lessonRemaining: 5,
    lessonEndDate: '2026-06-30',
    expiryDate: '2025-04-30',
    attendanceRate: 88,
    trainerAssigned: '김지원',
    smsConsent: true,
    appUsage: true,
    membershipActive: false,
    hasLesson: false,
  },
  {
    id: 'M00009',
    name: '이서연',
    gender: 'female',
    birthDate: '1997-07-07',
    phone: '010-7777-8888',
    phoneNumber: '010-7777-8888',
    email: 'seoyeon@example.com',
    memberType: '월 회원',
    registrationDate: '2025-04-01',
    expiryDate: '2025-06-01',
    gymMembershipDaysLeft: 5,
    attendanceRate: 45,
    smsConsent: false,
    appUsage: false,
    membershipActive: true,
    hasLesson: false,
    membershipId: 'prod_001', // 헬스 6개월 상품 ID
    membershipStartDate: '2024-04-01',
  },
  {
    id: 'M00010',
    name: '김태호',
    gender: 'male',
    birthDate: '1991-02-14',
    phone: '010-1111-2222',
    phoneNumber: '010-1111-2222',
    email: 'taeho@example.com',
    memberType: 'VIP 회원',
    registrationDate: '2025-11-15',
    expiryDate: '2026-11-14',
    lessonRemaining: 25,
    lessonTotal: 30,
    lessonEndDate: '2026-12-31',
    gymMembershipDaysLeft: 170,
    attendanceRate: 90,
    trainerAssigned: '박지훈',
    trainerNotes: '개인 경기 준비 중. 근지구력 향상에 집중.',
    smsConsent: true,
    appUsage: true,
    membershipActive: true,
    hasLesson: true,
    lockerId: 'B05',
    membershipId: 'prod_001', // 헬스 6개월 상품 ID
    ptId: 'prod_010', // 개인레슨 30회 상품 ID
    membershipStartDate: '2023-11-15',
  },
  {
    id: 'M00011',
    name: '장미라',
    gender: 'female',
    birthDate: '1989-09-23',
    phone: '010-5555-6666',
    phoneNumber: '010-5555-6666',
    email: 'mira@example.com',
    memberType: '정회원',
    registrationDate: '2025-08-01',
    expiryDate: '2026-08-01',
    lessonRemaining: 12,
    lessonTotal: 20,
    lessonEndDate: '2026-10-31',
    gymMembershipDaysLeft: 65,
    attendanceRate: 75,
    trainerAssigned: '김지원',
    smsConsent: true,
    appUsage: true,
    membershipActive: true,
    hasLesson: true,
    membershipId: 'prod_001', // 헬스 6개월 상품 ID
    ptId: 'prod_009', // 개인레슨 20회 상품 ID
    membershipStartDate: '2023-08-01',
  },
  {
    id: 'M00012',
    name: '박성준',
    gender: 'male',
    birthDate: '1995-04-12',
    phone: '010-4444-3333',
    phoneNumber: '010-4444-3333',
    email: 'sungjoon@example.com',
    memberType: '일반회원',
    registrationDate: '2024-12-01',
    expiryDate: '2025-05-31',
    gymMembershipDaysLeft: 0,
    attendanceRate: 50,
    smsConsent: false,
    appUsage: false,
    membershipActive: false,
    hasLesson: false,
  }
];

// 일일 매출 데이터
export const mockRevenueData = [
  { 
    date: '2024-05-27', 
    total: 4200000,
    membership: 1800000,
    lesson: 1600000,
    dailyTicket: 600000,
    other: 200000
  },
  { 
    date: '2024-05-26', 
    total: 3800000,
    membership: 1600000,
    lesson: 1400000,
    dailyTicket: 550000,
    other: 250000
  },
  { 
    date: '2024-05-25', 
    total: 4000000,
    membership: 1700000,
    lesson: 1500000,
    dailyTicket: 550000,
    other: 250000
  },
  { 
    date: '2024-05-24', 
    total: 3900000,
    membership: 1650000,
    lesson: 1450000,
    dailyTicket: 500000,
    other: 300000
  },
  { 
    date: '2024-05-23', 
    total: 4100000,
    membership: 1750000,
    lesson: 1550000,
    dailyTicket: 600000,
    other: 200000
  },
  { 
    date: '2024-05-22', 
    total: 3700000,
    membership: 1550000,
    lesson: 1350000,
    dailyTicket: 500000,
    other: 300000
  },
  { 
    date: '2024-05-21', 
    total: 3500000,
    membership: 1500000,
    lesson: 1200000,
    dailyTicket: 500000,
    other: 300000
  }
];

// 월별 매출 데이터 생성 함수
const generateMonthlyRevenueData = () => {
  const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  const baseRevenues = [3500000, 3800000, 4200000, 4000000, 4500000, 5000000, 4800000, 4600000, 4700000, 5200000, 5500000, 5800000];
  
  return months.map((name, index) => {
    const total = baseRevenues[index];
    const membership = Math.floor(total * 0.42);
    const lesson = Math.floor(total * 0.38);
    const dailyTicket = Math.floor(total * 0.13);
    const other = total - membership - lesson - dailyTicket;
    
    return {
      name,
      date: `2024-${(index + 1).toString().padStart(2, '0')}-01`,
      total,
      revenue: total,
      membership,
      lesson,
      dailyTicket,
      other
    };
  });
};

export const mockMonthlyRevenueData = generateMonthlyRevenueData();

// 방문자 데이터
export const mockVisitorsData = [
  { name: '오늘', total: 45, male: 25, female: 20 },
  { name: '어제', total: 38, male: 20, female: 18 },
  { name: '2일전', total: 42, male: 22, female: 20 },
  { name: '3일전', total: 40, male: 21, female: 19 },
];

// 락커 데이터 생성 함수
const generateMockLockers = (totalLockers: number = 200): Locker[] => {
  const occupiedLockers = [
    { 
      number: 1, memberId: 'M00001', memberName: '김지원', 
      startDate: '2024-01-15', endDate: '2025-01-14', 
      product: '락커 12개월', productPrice: 300000, actualPrice: 280000, 
      staffCommission: 280000, unpaidAmount: 0, fee: 280000, isPaid: true,
      paymentDate: '2024-01-15', paymentTime: '14:30', paymentMethod: '카드' as const,
      notes: '12개월 할인 적용'
    },
    { 
      number: 3, memberId: 'M00002', memberName: '이지훈', 
      startDate: '2024-02-10', endDate: '2024-08-09', 
      product: '락커 6개월', productPrice: 150000, actualPrice: 150000, 
      staffCommission: 150000, unpaidAmount: 0, fee: 150000, isPaid: true,
      paymentDate: '2024-02-10', paymentTime: '16:20', paymentMethod: '현금' as const
    },
    { 
      number: 5, memberId: 'M00003', memberName: '박수진', 
      startDate: '2024-11-01', endDate: '2025-01-30', 
      product: '락커 3개월', productPrice: 80000, actualPrice: 90000, 
      staffCommission: 90000, unpaidAmount: 0, fee: 90000, isPaid: true,
      paymentDate: '2024-11-01', paymentTime: '10:45', paymentMethod: '카드' as const,
      notes: '청소용품 추가 요청'
    },
    { 
      number: 7, memberId: 'M00004', memberName: '정동현', 
      startDate: '2024-06-15', endDate: '2025-06-14', 
      product: '락커 12개월', productPrice: 300000, actualPrice: 285000, 
      staffCommission: 285000, unpaidAmount: 0, fee: 285000, isPaid: true,
      paymentDate: '2024-06-15', paymentTime: '13:15', paymentMethod: '계좌이체' as const
    },
    { 
      number: 9, memberId: 'M00005', memberName: '김영희', 
      startDate: '2024-03-20', endDate: '2024-09-19', 
      product: '락커 6개월', productPrice: 150000, actualPrice: 125000, 
      staffCommission: 125000, unpaidAmount: 50000, fee: 125000, isPaid: false,
      paymentDate: '2024-03-20', paymentTime: '11:30', paymentMethod: '카드' as const,
      notes: '미수금 50,000원 발생'
    },
    { 
      number: 11, memberId: 'M00006', memberName: '최지원', 
      startDate: '2024-12-01', endDate: '2025-01-15', 
      product: '락커 1개월', productPrice: 30000, actualPrice: 30000, 
      staffCommission: 30000, unpaidAmount: 0, fee: 30000, isPaid: true,
      paymentDate: '2024-12-01', paymentTime: '09:00', paymentMethod: '현금' as const
    },
    { 
      number: 13, memberId: 'M00007', memberName: '이지영', 
      startDate: '2024-08-10', endDate: '2025-08-09', 
      product: '락커 12개월', productPrice: 300000, actualPrice: 288000, 
      staffCommission: 288000, unpaidAmount: 0, fee: 288000, isPaid: true,
      paymentDate: '2024-08-10', paymentTime: '15:45', paymentMethod: '카드' as const
    },
    { 
      number: 15, memberId: 'M00008', memberName: '박진수', 
      startDate: '2024-01-05', endDate: '2024-07-04', 
      product: '락커 6개월', productPrice: 150000, actualPrice: 135000, 
      staffCommission: 135000, unpaidAmount: 0, fee: 135000, isPaid: true,
      paymentDate: '2024-01-05', paymentTime: '17:20', paymentMethod: '계좌이체' as const,
      notes: '학생 할인 적용'
    },
    { 
      number: 17, memberId: 'M00009', memberName: '이서연', 
      startDate: '2024-11-15', endDate: '2025-02-14', 
      product: '락커 3개월', productPrice: 80000, actualPrice: 82000, 
      staffCommission: 82000, unpaidAmount: 0, fee: 82000, isPaid: true,
      paymentDate: '2024-11-15', paymentTime: '12:10', paymentMethod: '현금' as const
    },
    { 
      number: 19, memberId: 'M00010', memberName: '김태호', 
      startDate: '2024-12-10', endDate: '2025-01-20', 
      product: '락커 1개월', productPrice: 30000, actualPrice: 30000, 
      staffCommission: 30000, unpaidAmount: 0, fee: 30000, isPaid: true,
      paymentDate: '2024-12-10', paymentTime: '18:00', paymentMethod: '카드' as const
    },
  ];

  return Array.from({ length: totalLockers }, (_, i) => {
    const number = i + 1;
    const occupied = occupiedLockers.find(locker => locker.number === number);
    
    return {
      id: `L${number.toString().padStart(3, '0')}`,
      number,
      isOccupied: !!occupied,
      ...occupied
    };
  });
};

export const mockLockers: Locker[] = generateMockLockers();

// 출석 기록 생성 함수
export const getMockAttendance = (memberId: string, days: number = 90): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // 출석 확률을 회원에 따라 다르게 설정
    const member = mockMembers.find(m => m.id === memberId);
    const attendanceRate = member?.attendanceRate || 70;
    const shouldAttend = Math.random() * 100 < attendanceRate;
    
    // 주말에는 출석률이 낮아지도록 설정
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const finalShouldAttend = isWeekend ? shouldAttend && Math.random() > 0.3 : shouldAttend;
    
    const record: AttendanceRecord = {
      date: date.toISOString().split('T')[0],
      attended: finalShouldAttend,
      timeIn: finalShouldAttend ? 
        `${Math.floor(Math.random() * 4) + 6}:${Math.floor(Math.random() * 6)}${Math.floor(Math.random() * 10)}` : 
        undefined
    };
    
    records.push(record);
  }
  
  return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// 이벤트 타입 정의
export interface Event {
  id: string;
  title: string;
  date: Date;
  time: string;
  duration?: string;
  type: string;
  trainer?: string;
  assignedTo: string;
  color: string;
  notes?: string;
}

// 직원 데이터
export const mockStaff = [
  { id: "owner", name: "사장님", role: "owner" },
  { id: "trainer1", name: "이트레이너", role: "trainer" },
  { id: "trainer2", name: "박트레이너", role: "trainer" },
  { id: "trainer3", name: "김트레이너", role: "trainer" }
];

// 이벤트 데이터 (내부 변수) - 사업장 전용 일정만 포함
const _mockEvents: Event[] = [
  {
    id: "1",
    title: "헬스장 정기 점검",
    date: new Date(),
    time: "14:00", 
    duration: "2시간",
    type: "maintenance",
    assignedTo: "사장님",
    color: "bg-orange-500",
    notes: "운동기구 안전점검 및 청소"
  },
  {
    id: "2",
    title: "휴무일 - 추석연휴",
    date: new Date(Date.now() + 86400000), // tomorrow
    time: "하루종일",
    type: "holiday",
    assignedTo: "전체",
    color: "bg-red-500",
    notes: "추석 연휴로 인한 휴무"
  },
  {
    id: "3",
    title: "직원 회의",
    date: new Date(Date.now() + 172800000), // day after tomorrow
    time: "18:00",
    duration: "1시간",
    type: "meeting",
    assignedTo: "전체",
    color: "bg-gray-500",
    notes: "월간 운영 회의"
  },
  {
    id: "4",
    title: "고객 이벤트 - 체성분 측정",
    date: new Date(Date.now() + 259200000), // 3 days later
    time: "10:00",
    duration: "4시간",
    type: "event",
    assignedTo: "전체",
    color: "bg-green-500",
    notes: "무료 체성분 측정 이벤트"
  }
];

// 이벤트 추가 함수
export const addMockEvent = (event: Event) => {
  _mockEvents.push(event);
};

// 모든 이벤트 가져오기 함수
export const getMockEvents = () => {
  return [..._mockEvents];
};
