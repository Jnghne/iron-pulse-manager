
import { MemberData, RevenueData, StaffData, MembershipTypeData, ChartConfig } from '../types/statistics';

export const currentBusiness = "강남 피트니스 센터";

export const memberData: MemberData[] = [
  { name: '1월', total: 120, active: 90, lesson: 45, inactive: 30 },
  { name: '2월', total: 135, active: 105, lesson: 52, inactive: 30 },
  { name: '3월', total: 150, active: 118, lesson: 58, inactive: 32 },
  { name: '4월', total: 142, active: 110, lesson: 55, inactive: 32 },
  { name: '5월', total: 165, active: 130, lesson: 65, inactive: 35 },
];

export const revenueData: RevenueData[] = [
  { month: '1월', membership: 3200000, lesson: 1800000, daily: 450000, other: 200000 },
  { month: '2월', membership: 3500000, lesson: 2100000, daily: 480000, other: 250000 },
  { month: '3월', membership: 3700000, lesson: 2300000, daily: 510000, other: 300000 },
  { month: '4월', membership: 3200000, lesson: 2000000, daily: 470000, other: 270000 },
  { month: '5월', membership: 3900000, lesson: 2400000, daily: 550000, other: 320000 },
];

export const staffData: StaffData[] = [
  { name: '김직원', lesson: 45, revenue: 4500000, rating: 4.8, newMembers: 12, retentionRate: 85, status: '정상' },
  { name: '이직원', lesson: 38, revenue: 3800000, rating: 4.6, newMembers: 9, retentionRate: 78, status: '정상' },
  { name: '박직원', lesson: 30, revenue: 3000000, rating: 4.7, newMembers: 8, retentionRate: 82, status: '정상' },
  { name: '최직원', lesson: 25, revenue: 2500000, rating: 4.5, newMembers: 6, retentionRate: 75, status: '휴직' },
];

export const memberChartConfig: ChartConfig = {
  total: {
    label: "총 회원수",
    color: "#4EA8DE",
  },
  active: {
    label: "활성 회원",
    color: "#3b82f6",
  },
  lesson: {
    label: "개인레슨 회원",
    color: "#8b5cf6",
  },
  inactive: {
    label: "휴면 회원",
    color: "#6b7280",
  },
};

export const revenueChartConfig: ChartConfig = {
  membership: {
    label: "회원권",
    color: "#4EA8DE",
  },
  lesson: {
    label: "개인레슨 이용권",
    color: "#8FB4FF",
  },
  daily: {
    label: "일일권",
    color: "#A78BFA",
  },
  other: {
    label: "기타",
    color: "#FB7185",
  },
};

export const membershipTypeData: MembershipTypeData[] = [
  { name: '1개월', value: 45, fill: '#4EA8DE' },
  { name: '3개월', value: 30, fill: '#8FB4FF' },
  { name: '6개월', value: 15, fill: '#A78BFA' },
  { name: '12개월', value: 10, fill: '#FB7185' },
];
