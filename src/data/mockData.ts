// 락커 타입 정의
export interface Locker {
  id: string;
  zone: string;
  number: number;
  isOccupied: boolean;
  memberId?: string;
  memberName?: string;
  startDate?: string;
  endDate?: string;
  fee?: number;
  isPaid?: boolean;
  notes?: string; // Added missing notes property
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
  membershipStatus: 'active' | 'expired' | 'pending';
  ptRemaining?: number;
  ptExpiryDate?: string;
  ptStartDate?: string; // Added missing property
  ptTotal?: number; // Added missing property
  gymMembershipDaysLeft?: number;
  gymMembershipExpiryDate?: string;
  attendanceRate: number;
  trainerAssigned?: string;
  trainerNotes?: string;
  smsConsent: boolean;
  photoUrl?: string;
  membershipActive?: boolean;
  hasPT?: boolean;
  lockerId?: string;
  membershipStartDate?: string;
  phoneNumber?: string; // 추가: MemberList에서 사용하는 속성
  membershipEndDate?: string; // 추가: MemberList에서 사용하는 속성
  
  // 회원 상세 페이지 리뉴얼에 필요한 추가 필드
  availableBranches?: string[]; // 이용 가능 지점 목록
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

// 회원 목록 데이터
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
    registrationDate: '2023-01-15',
    expiryDate: '2025-01-14',
    membershipStatus: 'active',
    ptRemaining: 15,
    ptExpiryDate: '2025-06-30',
    gymMembershipDaysLeft: 230,
    gymMembershipExpiryDate: '2025-01-14',
    attendanceRate: 85,
    trainerAssigned: '박지훈',
    trainerNotes: '운동 성장이 빠르고 열정적임. 사이클링 선호.',
    smsConsent: true,
    membershipActive: true,
    hasPT: true,
    membershipStartDate: '2023-01-15'
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
    registrationDate: '2023-02-10',
    expiryDate: '2024-08-09',
    membershipStatus: 'active',
    ptRemaining: 8,
    ptExpiryDate: '2024-09-30',
    gymMembershipDaysLeft: 75,
    gymMembershipExpiryDate: '2024-08-09',
    attendanceRate: 92,
    trainerAssigned: '박지훈',
    trainerNotes: '근력 향상에 관심이 많음. 웨이트 트레이닝 위주로 진행.',
    smsConsent: true,
    membershipActive: true,
    hasPT: true,
    lockerId: 'A03',
    membershipStartDate: '2023-02-10'
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
    registrationDate: '2023-03-20',
    membershipStatus: 'active',
    ptRemaining: 22,
    ptExpiryDate: '2024-12-31',
    attendanceRate: 78,
    trainerAssigned: '박지훈',
    smsConsent: false,
    membershipActive: false,
    hasPT: true
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
    registrationDate: '2023-05-05',
    expiryDate: '2024-05-04',
    membershipStatus: 'expired',
    gymMembershipDaysLeft: 0,
    gymMembershipExpiryDate: '2024-05-04',
    attendanceRate: 65,
    trainerAssigned: '김지원',
    smsConsent: true,
    membershipActive: false,
    hasPT: false
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
    registrationDate: '2023-01-02',
    expiryDate: '2025-01-01',
    membershipStatus: 'active',
    ptRemaining: 30,
    ptExpiryDate: '2025-01-01',
    gymMembershipDaysLeft: 220,
    gymMembershipExpiryDate: '2025-01-01',
    attendanceRate: 95,
    trainerAssigned: '박지훈',
    trainerNotes: '체중 감량과 근육량 증가가 목표. 다이어트 시작.',
    smsConsent: true,
    membershipActive: true,
    hasPT: true,
    lockerId: 'A01',
    membershipStartDate: '2023-01-02'
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
    registrationDate: '2023-06-15',
    expiryDate: '2024-06-14',
    membershipStatus: 'active',
    ptRemaining: 0,
    gymMembershipDaysLeft: 20,
    gymMembershipExpiryDate: '2024-06-14',
    attendanceRate: 70,
    trainerAssigned: '김지원',
    smsConsent: true,
    membershipActive: true,
    hasPT: false,
    membershipStartDate: '2023-06-15'
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
    registrationDate: '2024-01-10',
    expiryDate: '2024-07-09',
    membershipStatus: 'active',
    gymMembershipDaysLeft: 45,
    gymMembershipExpiryDate: '2024-07-09',
    attendanceRate: 60,
    smsConsent: true,
    membershipActive: true,
    hasPT: false,
    membershipStartDate: '2024-01-10'
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
    registrationDate: '2023-09-01',
    membershipStatus: 'active',
    ptRemaining: 5,
    ptExpiryDate: '2024-06-30',
    attendanceRate: 88,
    trainerAssigned: '김지원',
    smsConsent: true,
    membershipActive: false,
    hasPT: true
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
    registrationDate: '2024-04-01',
    expiryDate: '2024-06-01',
    membershipStatus: 'active',
    gymMembershipDaysLeft: 5,
    gymMembershipExpiryDate: '2024-06-01',
    attendanceRate: 45,
    smsConsent: false,
    membershipActive: true,
    hasPT: false,
    membershipStartDate: '2024-04-01'
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
    registrationDate: '2023-11-15',
    expiryDate: '2024-11-14',
    membershipStatus: 'active',
    ptRemaining: 25,
    ptExpiryDate: '2024-12-31',
    gymMembershipDaysLeft: 170,
    gymMembershipExpiryDate: '2024-11-14',
    attendanceRate: 90,
    trainerAssigned: '박지훈',
    trainerNotes: '개인 경기 준비 중. 근지구력 향상에 집중.',
    smsConsent: true,
    membershipActive: true,
    hasPT: true,
    lockerId: 'B05',
    membershipStartDate: '2023-11-15'
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
    registrationDate: '2023-08-01',
    expiryDate: '2024-08-01',
    membershipStatus: 'active',
    ptRemaining: 12,
    ptExpiryDate: '2024-10-31',
    gymMembershipDaysLeft: 65,
    gymMembershipExpiryDate: '2024-08-01',
    attendanceRate: 75,
    trainerAssigned: '김지원',
    smsConsent: true,
    membershipActive: true,
    hasPT: true,
    membershipStartDate: '2023-08-01'
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
    registrationDate: '2023-12-01',
    expiryDate: '2024-05-31',
    membershipStatus: 'expired',
    gymMembershipDaysLeft: 0,
    gymMembershipExpiryDate: '2024-05-31',
    attendanceRate: 50,
    smsConsent: false,
    membershipActive: false,
    hasPT: false
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

// 매출 항목별 데이터 (파이 차트용)
export const mockRevenueBreakdownData = [
  { name: '회원권', value: 2500000 },
  { name: 'PT 이용권', value: 1800000 },
  { name: '일일권', value: 500000 },
  { name: '기타', value: 200000 },
];

// 방문자 데이터
export const mockVisitorsData = [
  { name: '오늘', total: 45, male: 25, female: 20 },
  { name: '어제', total: 38, male: 20, female: 18 },
  { name: '2일전', total: 42, male: 22, female: 20 },
  { name: '3일전', total: 40, male: 21, female: 19 },
  { name: '4일전', total: 35, male: 18, female: 17 },
  { name: '5일전', total: 28, male: 15, female: 13 },
  { name: '6일전', total: 30, male: 16, female: 14 },
];

// 락커 데이터
export const mockLockers: Locker[] = [
  {
    id: 'L001',
    zone: 'A',
    number: 1,
    isOccupied: true,
    memberId: 'M00001',
    memberName: '김지원',
    startDate: '2024-01-15',
    endDate: '2025-01-14',
    fee: 120000,
    isPaid: true
  },
  {
    id: 'L002',
    zone: 'A',
    number: 2,
    isOccupied: false
  },
  {
    id: 'L003',
    zone: 'A',
    number: 3,
    isOccupied: true,
    memberId: 'M00005',
    memberName: '김영희',
    startDate: '2024-01-02',
    endDate: '2025-01-01',
    fee: 120000,
    isPaid: true
  },
  {
    id: 'L004',
    zone: 'A',
    number: 4,
    isOccupied: false
  },
  {
    id: 'L005',
    zone: 'A',
    number: 5,
    isOccupied: false
  },
  {
    id: 'L006',
    zone: 'B',
    number: 1,
    isOccupied: true,
    memberId: 'M00002',
    memberName: '이지훈',
    startDate: '2024-02-10',
    endDate: '2024-08-09',
    fee: 80000,
    isPaid: true
  },
  {
    id: 'L007',
    zone: 'B',
    number: 2,
    isOccupied: true,
    memberId: 'M00003',
    memberName: '박수진',
    startDate: '2024-03-20',
    endDate: '2024-09-19',
    fee: 80000,
    isPaid: true
  },
  {
    id: 'L008',
    zone: 'B',
    number: 3,
    isOccupied: false
  },
  {
    id: 'L009',
    zone: 'B',
    number: 4,
    isOccupied: false
  },
  {
    id: 'L010',
    zone: 'B',
    number: 5,
    isOccupied: false
  },
  {
    id: 'L011',
    zone: 'C',
    number: 1,
    isOccupied: false
  },
  {
    id: 'L012',
    zone: 'C',
    number: 2,
    isOccupied: false
  },
  {
    id: 'L013',
    zone: 'C',
    number: 3,
    isOccupied: false
  },
  {
    id: 'L014',
    zone: 'C',
    number: 4,
    isOccupied: false
  },
  {
    id: 'L015',
    zone: 'C',
    number: 5,
    isOccupied: false
  }
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
