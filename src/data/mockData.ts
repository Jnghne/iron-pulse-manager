
// 락커 타입 정의
export interface Locker {
  id: string;
  number: number;
  isOccupied: boolean;
  memberId?: string;
  memberName?: string;
  startDate?: string;
  endDate?: string;
  fee?: number;
  isPaid?: boolean;
  notes?: string;
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
  ptRemaining?: number;
  ptExpiryDate?: string;
  ptStartDate?: string;
  ptTotal?: number;
  gymMembershipDaysLeft?: number;
  attendanceRate: number;
  trainerAssigned?: string;
  trainerNotes?: string;
  smsConsent: boolean;
  photoUrl?: string;
  membershipActive?: boolean;
  hasPT?: boolean;
  membershipId?: string;
  ptId?: string;
  lockerId?: string;
  membershipStartDate?: string;
  membershipEndDate?: string;
  phoneNumber?: string;

  // 회원 상세 페이지 리뉴얼에 필요한 추가 필드
  appUsage?: boolean; // 앱 이용 여부
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
    ptRemaining: 15,
    ptTotal: 30,
    ptExpiryDate: '2025-06-30',
    ptStartDate: '2024-01-15',
    ptId: 'prod_002',
    gymMembershipDaysLeft: 230,
    attendanceRate: 85,
    trainerAssigned: '박지훈',
    trainerNotes: '운동 성장이 빠르고 열정적임. 사이클링 선호.',
    smsConsent: true,
    membershipActive: true,
    membershipId: 'prod_001',
    hasPT: true,
    membershipStartDate: '2023-01-15',
    appUsage: true,
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
    ptRemaining: 8,
    ptTotal: 10,
    ptStartDate: '2025-01-10',
    ptId: 'prod_002',
    ptExpiryDate: '2024-09-30',
    gymMembershipDaysLeft: 75,
    attendanceRate: 92,
    trainerAssigned: '박지훈',
    trainerNotes: '근력 향상에 관심이 많음. 웨이트 트레이닝 위주로 진행.',
    smsConsent: true,
    membershipActive: true,
    membershipId: 'prod_001',
    hasPT: true,
    lockerId: 'prod_003',
    membershipStartDate: '2023-02-10',
    appUsage: true,
  },
  {
    id: 'M00003',
    name: '박수진',
    gender: 'female',
    birthDate: '1992-12-03',
    phone: '010-5555-7777',
    phoneNumber: '010-5555-7777',
    email: 'soojin@example.com',
    memberType: 'PT 회원',
    registrationDate: '2024-03-20',
    expiryDate: '2024-08-09',
    ptRemaining: 22,
    ptExpiryDate: '2026-12-31',
    attendanceRate: 78,
    trainerAssigned: '박지훈',
    smsConsent: false,
    membershipActive: false,
    hasPT: true,
    ptId: 'prod_002', // PT 상품 ID 추가
    appUsage: true,
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
    membershipActive: false,
    hasPT: false,
    lockerId: 'prod_003', // 락커 상품 ID 추가
    appUsage: false,
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
    ptRemaining: 30,
    ptExpiryDate: '2026-01-01',
    gymMembershipDaysLeft: 220,
    attendanceRate: 95,
    trainerAssigned: '박지훈',
    trainerNotes: '체중 감량과 근육량 증가가 목표. 다이어트 시작.',
    smsConsent: true,
    membershipActive: true,
    hasPT: true,
    lockerId: undefined, // 김영희 회원은 락커 미사용 (명시적으로 undefined 설정)
    membershipId: 'prod_001', // 헬스 6개월 상품 ID
    ptId: 'prod_002', // PT 10회 상품 ID
    membershipStartDate: '2023-01-02',
    appUsage: true,
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
    ptRemaining: 0,
    gymMembershipDaysLeft: 20,
    attendanceRate: 70,
    trainerAssigned: '김지원',
    smsConsent: true,
    membershipActive: true,
    hasPT: false,
    membershipId: 'prod_001', // 헬스 6개월 상품 ID
    membershipStartDate: '2023-06-15',
    appUsage: false,
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
    membershipActive: true,
    hasPT: false,
    membershipStartDate: '2024-01-10',
    appUsage: false,
  },
  {
    id: 'M00008',
    name: '박진수',
    gender: 'male',
    birthDate: '1978-11-15',
    phone: '010-9999-8888',
    phoneNumber: '010-9999-8888',
    email: 'jinsoo@example.com',
    memberType: 'PT 회원',
    registrationDate: '2024-09-01',
    ptRemaining: 5,
    ptExpiryDate: '2026-06-30',
    expiryDate: '2025-04-30',
    attendanceRate: 88,
    trainerAssigned: '김지원',
    smsConsent: true,
    membershipActive: false,
    hasPT: false,
    appUsage: false,
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
    membershipActive: true,
    hasPT: false,
    membershipId: 'prod_001', // 헬스 6개월 상품 ID
    membershipStartDate: '2024-04-01',
    appUsage: false,
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
    ptRemaining: 25,
    ptExpiryDate: '2026-12-31',
    gymMembershipDaysLeft: 170,
    attendanceRate: 90,
    trainerAssigned: '박지훈',
    trainerNotes: '개인 경기 준비 중. 근지구력 향상에 집중.',
    smsConsent: true,
    membershipActive: true,
    hasPT: true,
    lockerId: 'B05',
    membershipId: 'prod_001', // 헬스 6개월 상품 ID
    ptId: 'prod_002', // PT 10회 상품 ID
    membershipStartDate: '2023-11-15',
    appUsage: true,
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
    ptRemaining: 12,
    ptExpiryDate: '2026-10-31',
    gymMembershipDaysLeft: 65,
    attendanceRate: 75,
    trainerAssigned: '김지원',
    smsConsent: true,
    membershipActive: true,
    hasPT: true,
    membershipId: 'prod_001', // 헬스 6개월 상품 ID
    ptId: 'prod_002', // PT 10회 상품 ID
    membershipStartDate: '2023-08-01',
    appUsage: true,
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
    membershipActive: false,
    hasPT: false,
    appUsage: false,
  }
];

// 일일 매출 데이터
export const mockRevenueData = [
  { 
    date: '2024-05-27', 
    total: 4200000,
    membership: 1800000,
    pt: 1600000,
    dailyTicket: 600000,
    other: 200000
  },
  { 
    date: '2024-05-26', 
    total: 3800000,
    membership: 1600000,
    pt: 1400000,
    dailyTicket: 550000,
    other: 250000
  },
  { 
    date: '2024-05-25', 
    total: 4000000,
    membership: 1700000,
    pt: 1500000,
    dailyTicket: 550000,
    other: 250000
  },
  { 
    date: '2024-05-24', 
    total: 3900000,
    membership: 1650000,
    pt: 1450000,
    dailyTicket: 500000,
    other: 300000
  },
  { 
    date: '2024-05-23', 
    total: 4100000,
    membership: 1750000,
    pt: 1550000,
    dailyTicket: 600000,
    other: 200000
  },
  { 
    date: '2024-05-22', 
    total: 3700000,
    membership: 1550000,
    pt: 1350000,
    dailyTicket: 500000,
    other: 300000
  },
  { 
    date: '2024-05-21', 
    total: 3500000,
    membership: 1500000,
    pt: 1200000,
    dailyTicket: 500000,
    other: 300000
  }
];

// 월별 매출 데이터
export const mockMonthlyRevenueData = [
  { 
    name: '1월', 
    date: '2024-01-01',
    total: 3500000, 
    revenue: 3500000, 
    membership: 1500000, 
    pt: 1200000, 
    dailyTicket: 500000, 
    other: 300000 
  },
  { 
    name: '2월', 
    date: '2024-02-01',
    total: 3800000, 
    revenue: 3800000, 
    membership: 1600000, 
    pt: 1400000, 
    dailyTicket: 550000, 
    other: 250000 
  },
  { 
    name: '3월', 
    date: '2024-03-01',
    total: 4200000, 
    revenue: 4200000, 
    membership: 1800000, 
    pt: 1600000, 
    dailyTicket: 600000, 
    other: 200000 
  },
  { 
    name: '4월', 
    date: '2024-04-01',
    total: 4000000, 
    revenue: 4000000, 
    membership: 1700000, 
    pt: 1500000, 
    dailyTicket: 550000, 
    other: 250000 
  },
  { 
    name: '5월', 
    date: '2024-05-01',
    total: 4500000, 
    revenue: 4500000, 
    membership: 1900000, 
    pt: 1700000, 
    dailyTicket: 650000, 
    other: 250000 
  },
  { 
    name: '6월', 
    date: '2024-06-01',
    total: 5000000, 
    revenue: 5000000, 
    membership: 2100000, 
    pt: 1900000, 
    dailyTicket: 700000, 
    other: 300000 
  },
  { 
    name: '7월', 
    date: '2024-07-01',
    total: 4800000, 
    revenue: 4800000, 
    membership: 2000000, 
    pt: 1800000, 
    dailyTicket: 650000, 
    other: 350000 
  },
  { 
    name: '8월', 
    date: '2024-08-01',
    total: 4600000, 
    revenue: 4600000, 
    membership: 1950000, 
    pt: 1750000, 
    dailyTicket: 600000, 
    other: 300000 
  },
  { 
    name: '9월', 
    date: '2024-09-01',
    total: 4700000, 
    revenue: 4700000, 
    membership: 2000000, 
    pt: 1800000, 
    dailyTicket: 650000, 
    other: 250000 
  },
  { 
    name: '10월', 
    date: '2024-10-01',
    total: 5200000, 
    revenue: 5200000, 
    membership: 2200000, 
    pt: 2000000, 
    dailyTicket: 700000, 
    other: 300000 
  },
  { 
    name: '11월', 
    date: '2024-11-01',
    total: 5500000, 
    revenue: 5500000, 
    membership: 2300000, 
    pt: 2100000, 
    dailyTicket: 750000, 
    other: 350000 
  },
  { 
    name: '12월', 
    date: '2024-12-01',
    total: 5800000, 
    revenue: 5800000, 
    membership: 2400000, 
    pt: 2200000, 
    dailyTicket: 800000, 
    other: 400000 
  }
];

// 방문자 데이터
export const mockVisitorsData = [
  { name: '오늘', total: 45, male: 25, female: 20 },
  { name: '어제', total: 38, male: 20, female: 18 },
  { name: '2일전', total: 42, male: 22, female: 20 },
  { name: '3일전', total: 40, male: 21, female: 19 },
];

// 락커 데이터 (1-200번) - 고정 데이터
export const mockLockers: Locker[] = [
  // 사용중인 락커들 (다양한 상태)
  { id: 'L001', number: 1, isOccupied: true, memberId: 'M00001', memberName: '김지원', startDate: '2024-01-15', endDate: '2025-01-14', fee: 80000, isPaid: true },
  { id: 'L002', number: 2, isOccupied: false },
  { id: 'L003', number: 3, isOccupied: true, memberId: 'M00002', memberName: '이지훈', startDate: '2024-02-10', endDate: '2024-08-09', fee: 70000, isPaid: true }, // 만료
  { id: 'L004', number: 4, isOccupied: false },
  { id: 'L005', number: 5, isOccupied: true, memberId: 'M00003', memberName: '박수진', startDate: '2024-11-01', endDate: '2025-01-30', fee: 90000, isPaid: true }, // 만료 임박
  { id: 'L006', number: 6, isOccupied: false },
  { id: 'L007', number: 7, isOccupied: true, memberId: 'M00004', memberName: '정동현', startDate: '2024-06-15', endDate: '2025-06-14', fee: 85000, isPaid: true },
  { id: 'L008', number: 8, isOccupied: false },
  { id: 'L009', number: 9, isOccupied: true, memberId: 'M00005', memberName: '김영희', startDate: '2024-03-20', endDate: '2024-09-19', fee: 75000, isPaid: false }, // 만료
  { id: 'L010', number: 10, isOccupied: false },
  { id: 'L011', number: 11, isOccupied: true, memberId: 'M00006', memberName: '최지원', startDate: '2024-12-01', endDate: '2025-01-15', fee: 95000, isPaid: true }, // 만료 임박
  { id: 'L012', number: 12, isOccupied: false },
  { id: 'L013', number: 13, isOccupied: true, memberId: 'M00007', memberName: '이지영', startDate: '2024-08-10', endDate: '2025-08-09', fee: 88000, isPaid: true },
  { id: 'L014', number: 14, isOccupied: false },
  { id: 'L015', number: 15, isOccupied: true, memberId: 'M00008', memberName: '박진수', startDate: '2024-01-05', endDate: '2024-07-04', fee: 65000, isPaid: true }, // 만료
  { id: 'L016', number: 16, isOccupied: false },
  { id: 'L017', number: 17, isOccupied: true, memberId: 'M00009', memberName: '이서연', startDate: '2024-11-15', endDate: '2025-02-14', fee: 82000, isPaid: true },
  { id: 'L018', number: 18, isOccupied: false },
  { id: 'L019', number: 19, isOccupied: true, memberId: 'M00010', memberName: '김태호', startDate: '2024-12-10', endDate: '2025-01-20', fee: 92000, isPaid: true }, // 만료 임박
  { id: 'L020', number: 20, isOccupied: false },
  // 나머지 락커들은 비어있음 (21-200번)
  ...Array.from({ length: 180 }, (_, i) => ({
    id: `L${(i + 21).toString().padStart(3, '0')}`,
    number: i + 21,
    isOccupied: false
  }))
];

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

// 이벤트 데이터 (내부 변수)
const _mockEvents: Event[] = [
  {
    id: "1",
    title: "김영희 PT 세션",
    date: new Date(),
    time: "09:00",
    duration: "1시간",
    type: "pt",
    trainer: "이트레이너",
    assignedTo: "이트레이너",
    color: "bg-blue-500"
  },
  {
    id: "2", 
    title: "그룹 필라테스",
    date: new Date(),
    time: "19:00",
    duration: "1시간",
    type: "group",
    trainer: "박트레이너",
    assignedTo: "박트레이너",
    color: "bg-purple-500"
  },
  {
    id: "3",
    title: "헬스장 정기 점검",
    date: new Date(Date.now() + 86400000), // tomorrow
    time: "14:00", 
    duration: "2시간",
    type: "maintenance",
    assignedTo: "사장님",
    color: "bg-orange-500"
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
