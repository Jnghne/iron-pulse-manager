// 중앙집중화된 모크 데이터 관리
export * from './mockData';
export * from './mockProducts';
export * from './staff-mock-data';

// 타입 정의들도 재익스포트
export type { Member, Locker, AttendanceRecord, Event } from './mockData';
export type { Staff, StaffRegistration, Member as StaffMember } from './staff-mock-data';