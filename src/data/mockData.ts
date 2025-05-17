// This file contains mock data for the application
// In a real application, this would be replaced with API calls to the backend

import { addDays, getRandomInt } from "@/lib/utils";

// Mock members data
export interface Member {
  id: string;
  name: string;
  phoneNumber: string;
  registrationDate: string;
  membershipActive: boolean;
  membershipStartDate?: string;
  membershipEndDate?: string;
  hasPT: boolean;
  ptRemaining?: number;
  ptExpireDate?: string;
  trainerAssigned?: string;
  lockerId?: string;
  birthDate?: string;
  address?: string;
  memo?: string;
  attendanceRate: number;
  postalCode?: string;
  photoUrl?: string;
}

export const mockMembers: Member[] = [
  {
    id: "1001",
    name: "김민준",
    phoneNumber: "010-1234-5678",
    registrationDate: "2023-01-15",
    membershipActive: true,
    membershipStartDate: "2023-01-15",
    membershipEndDate: "2024-01-14",
    hasPT: true,
    ptRemaining: 15,
    ptExpireDate: "2024-03-15",
    attendanceRate: 85,
    lockerId: "A15",
    trainerAssigned: "박지훈",
    photoUrl: "/images/members/member-1001.jpg"
  },
  {
    id: "1002",
    name: "이서연",
    phoneNumber: "010-2345-6789",
    registrationDate: "2023-03-20",
    membershipActive: true,
    membershipStartDate: "2023-03-20",
    membershipEndDate: "2023-09-19",
    hasPT: false,
    attendanceRate: 65,
    photoUrl: "/images/members/member-1002.jpg"
  },
  {
    id: "1003",
    name: "박준호",
    phoneNumber: "010-3456-7890",
    registrationDate: "2023-02-10",
    membershipActive: true,
    membershipStartDate: "2023-06-01",
    membershipEndDate: "2023-12-01",
    hasPT: true,
    ptRemaining: 8,
    ptExpireDate: "2023-12-31",
    attendanceRate: 92,
    lockerId: "B22",
    trainerAssigned: "최수진",
    photoUrl: "/images/members/member-1003.jpg"
  },
  {
    id: "1004",
    name: "최지우",
    phoneNumber: "010-4567-8901",
    registrationDate: "2023-04-05",
    membershipActive: true,
    membershipStartDate: "2023-04-05",
    membershipEndDate: "2023-10-04",
    hasPT: false,
    attendanceRate: 45,
    lockerId: "C10",
    photoUrl: "/images/members/member-1004.jpg"
  },
  {
    id: "1005",
    name: "정도윤",
    phoneNumber: "010-5678-9012",
    registrationDate: "2023-05-15",
    membershipActive: false,
    membershipStartDate: "2023-05-15",
    membershipEndDate: "2023-08-14",
    hasPT: false,
    attendanceRate: 30,
    photoUrl: "/images/members/member-1005.jpg"
  },
  {
    id: "1006",
    name: "한소희",
    phoneNumber: "010-6789-0123",
    registrationDate: "2023-06-20",
    membershipActive: true,
    membershipStartDate: "2023-06-20",
    membershipEndDate: "2024-06-19",
    hasPT: true,
    ptRemaining: 25,
    ptExpireDate: "2024-06-30",
    attendanceRate: 75,
    trainerAssigned: "박지훈",
    photoUrl: "/images/members/member-1006.jpg"
  },
  {
    id: "1007",
    name: "송민석",
    phoneNumber: "010-7890-1234",
    registrationDate: "2023-07-10",
    membershipActive: true,
    membershipStartDate: "2023-07-10",
    membershipEndDate: "2024-01-09",
    hasPT: true,
    ptRemaining: 3,
    ptExpireDate: "2023-10-10",
    attendanceRate: 80,
    lockerId: "A05",
    trainerAssigned: "최수진",
    photoUrl: "/images/members/member-1007.jpg"
  },
  {
    id: "1008",
    name: "임하은",
    phoneNumber: "010-8901-2345",
    registrationDate: "2023-08-15",
    membershipActive: true,
    membershipStartDate: "2023-08-15",
    membershipEndDate: "2024-02-14",
    hasPT: false,
    attendanceRate: 50,
    photoUrl: "/images/members/member-1008.jpg"
  },
  {
    id: "1009",
    name: "윤재현",
    phoneNumber: "010-9012-3456",
    registrationDate: "2023-09-01",
    membershipActive: true,
    membershipStartDate: "2023-09-01",
    membershipEndDate: "2024-03-01",
    hasPT: true,
    ptRemaining: 20,
    ptExpireDate: "2024-03-31",
    attendanceRate: 88,
    lockerId: "B15",
    trainerAssigned: "김태양",
    photoUrl: "/images/members/member-1009.jpg"
  },
  {
    id: "1010",
    name: "장미나",
    phoneNumber: "010-0123-4567",
    registrationDate: "2023-01-20",
    membershipActive: false,
    membershipStartDate: "2023-01-20",
    membershipEndDate: "2023-07-19",
    hasPT: false,
    attendanceRate: 40,
    photoUrl: "/images/members/member-1010.jpg"
  },
];

// Mock trainer data
export interface Trainer {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
  bankAccount: string;
  workHours: string;
  hireDate: string;
  assignedMembers: number;
  monthlySales: number;
}

export const mockTrainers: Trainer[] = [
  {
    id: "T123456",
    name: "박지훈",
    phoneNumber: "010-1111-2222",
    email: "jihun.park@example.com",
    address: "서울시 강남구 테헤란로 123",
    bankAccount: "신한은행 110-222-333444",
    workHours: "10:00-19:00",
    hireDate: "2022-01-15",
    assignedMembers: 12,
    monthlySales: 4800000,
  },
  {
    id: "T234567",
    name: "최수진",
    phoneNumber: "010-2222-3333",
    email: "sujin.choi@example.com",
    address: "서울시 서초구 서초대로 456",
    bankAccount: "우리은행 123-456-789012",
    workHours: "14:00-22:00",
    hireDate: "2022-03-10",
    assignedMembers: 10,
    monthlySales: 3500000,
  },
  {
    id: "T345678",
    name: "김태양",
    phoneNumber: "010-3333-4444",
    email: "taeyang.kim@example.com",
    address: "서울시 송파구 올림픽로 789",
    bankAccount: "국민은행 333-444-555666",
    workHours: "06:00-15:00",
    hireDate: "2022-06-20",
    assignedMembers: 8,
    monthlySales: 2800000,
  },
];

// Mock locker data
export interface Locker {
  id: string;
  zone: string;
  number: number;
  isOccupied: boolean;
  memberId?: string;
  memberName?: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
}

export const mockLockers: Locker[] = Array.from({ length: 60 }, (_, i) => {
  const zoneMap = ["A", "B", "C"];
  const zone = zoneMap[Math.floor(i / 20)];
  const number = (i % 20) + 1;
  const isOccupied = Math.random() > 0.6;
  
  let occupiedData = {};
  if (isOccupied) {
    const memberIndex = Math.floor(Math.random() * mockMembers.length);
    const member = mockMembers[memberIndex];
    occupiedData = {
      memberId: member.id,
      memberName: member.name,
      startDate: "2023-01-01",
      endDate: "2023-12-31",
      notes: "특이사항 없음",
    };
  }
  
  return {
    id: `${zone}${number.toString().padStart(2, "0")}`,
    zone,
    number,
    isOccupied,
    ...occupiedData,
  };
});

// Mock daily tickets data
export interface DailyTicket {
  id: string;
  name: string;
  phoneNumber: string;
  date: string;
  paymentAmount: number;
  paymentMethod: string;
}

export const mockDailyTickets: DailyTicket[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - i);
  const dateStr = date.toISOString().split("T")[0];
  
  return {
    id: `D${Date.now().toString().slice(-6)}${i}`,
    name: `방문객${i + 1}`,
    phoneNumber: `010-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
    date: dateStr,
    paymentAmount: 10000,
    paymentMethod: Math.random() > 0.5 ? "카드" : "현금",
  };
});

// Mock attendance data for a member
export interface AttendanceRecord {
  date: string;
  attended: boolean;
  timeIn?: string;
  timeOut?: string;
}

export function getMockAttendance(memberId: string, days: number = 30): AttendanceRecord[] {
  const today = new Date();
  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    
    // Weekend (5, 6 = Saturday, Sunday)
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    
    // Better attendance for members with higher attendance rate
    const member = mockMembers.find(m => m.id === memberId);
    const baseChance = member ? member.attendanceRate / 100 : 0.5;
    const attended = !isWeekend && Math.random() < (baseChance * 1.2);
    
    const record: AttendanceRecord = {
      date: dateStr,
      attended,
    };
    
    if (attended) {
      // Random entry time between 8 AM and 8 PM
      const hour = Math.floor(Math.random() * 12) + 8;
      const minute = Math.floor(Math.random() * 60);
      record.timeIn = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      
      // Random exit time, 1-3 hours after entry
      const exitHour = Math.min(hour + 1 + Math.floor(Math.random() * 2), 22);
      const exitMinute = Math.floor(Math.random() * 60);
      record.timeOut = `${exitHour.toString().padStart(2, "0")}:${exitMinute.toString().padStart(2, "0")}`;
    }
    
    return record;
  });
}

// Mock revenue data
export interface RevenueData {
  date: string;
  total: number;
  membership: number;
  pt: number;
  dailyTicket: number;
  other: number;
}

export const mockRevenueData: RevenueData[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - i);
  const dateStr = date.toISOString().split("T")[0];
  
  const membership = getRandomInt(200000, 500000);
  const pt = getRandomInt(100000, 400000);
  const dailyTicket = getRandomInt(50000, 150000);
  const other = getRandomInt(20000, 100000);
  
  return {
    date: dateStr,
    membership,
    pt,
    dailyTicket,
    other,
    total: membership + pt + dailyTicket + other,
  };
});

// Mock monthly revenue data
export const mockMonthlyRevenueData: RevenueData[] = Array.from({ length: 12 }, (_, i) => {
  const date = new Date();
  date.setMonth(date.getMonth() - i);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const dateStr = `${year}-${month.toString().padStart(2, "0")}-01`;
  
  const membership = getRandomInt(5000000, 12000000);
  const pt = getRandomInt(3000000, 8000000);
  const dailyTicket = getRandomInt(1000000, 3000000);
  const other = getRandomInt(500000, 2000000);
  
  return {
    date: dateStr,
    membership,
    pt,
    dailyTicket,
    other,
    total: membership + pt + dailyTicket + other,
  };
});

// Mock visitors data
export interface VisitorData {
  date: string;
  total: number;
  members: number;
  dailyTickets: number;
}

export const mockVisitorsData: VisitorData[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - i);
  const dateStr = date.toISOString().split("T")[0];
  
  const members = getRandomInt(20, 60);
  const dailyTickets = getRandomInt(5, 15);
  
  return {
    date: dateStr,
    members,
    dailyTickets,
    total: members + dailyTickets,
  };
});

// Mock member statistics data
export interface MemberStatistics {
  total: number;
  active: number;
  inactive: number;
  ptMembers: number;
  newThisMonth: number;
  lapsedThisMonth: number;
  reactivatedThisMonth: number;
}

export const mockMemberStatistics: MemberStatistics = {
  total: 120,
  active: 85,
  inactive: 35,
  ptMembers: 45,
  newThisMonth: 12,
  lapsedThisMonth: 5,
  reactivatedThisMonth: 3,
};

// Mock calendar events
export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  type: "holiday" | "cleaning" | "trainerSchedule" | "event";
  trainerName?: string;
  notes?: string;
}

export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: "evt1",
    title: "정기 휴무일",
    start: addDays(new Date(), 3).toISOString().split("T")[0],
    end: addDays(new Date(), 3).toISOString().split("T")[0],
    type: "holiday",
    notes: "매월 첫째 월요일 정기 휴무"
  },
  {
    id: "evt2",
    title: "대청소",
    start: addDays(new Date(), 5).toISOString().split("T")[0],
    end: addDays(new Date(), 5).toISOString().split("T")[0],
    type: "cleaning",
    notes: "전체 시설 대청소"
  },
  {
    id: "evt3",
    title: "박지훈 근무",
    start: addDays(new Date(), 1).toISOString().split("T")[0],
    end: addDays(new Date(), 1).toISOString().split("T")[0],
    type: "trainerSchedule",
    trainerName: "박지훈",
    notes: "10:00-19:00"
  },
  {
    id: "evt4",
    title: "최수진 근무",
    start: addDays(new Date(), 1).toISOString().split("T")[0],
    end: addDays(new Date(), 1).toISOString().split("T")[0],
    type: "trainerSchedule",
    trainerName: "최수진",
    notes: "14:00-22:00"
  },
  {
    id: "evt5",
    title: "김태양 근무",
    start: addDays(new Date(), 1).toISOString().split("T")[0],
    end: addDays(new Date(), 1).toISOString().split("T")[0],
    type: "trainerSchedule",
    trainerName: "김태양",
    notes: "06:00-15:00"
  },
  {
    id: "evt6",
    title: "회원 이벤트",
    start: addDays(new Date(), 10).toISOString().split("T")[0],
    end: addDays(new Date(), 10).toISOString().split("T")[0],
    type: "event",
    notes: "신규 회원 모집 이벤트"
  }
];
