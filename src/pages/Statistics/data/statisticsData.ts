
import { MemberData, RevenueData, StaffData, MembershipTypeData, ChartConfig } from '../types/statistics';

export const currentBusiness = "강남 피트니스 센터";

export const memberData: MemberData[] = [
  { name: '1월', total: 120, active: 90, pt: 45, inactive: 30 },
  { name: '2월', total: 135, active: 105, pt: 52, inactive: 30 },
  { name: '3월', total: 150, active: 118, pt: 58, inactive: 32 },
  { name: '4월', total: 142, active: 110, pt: 55, inactive: 32 },
  { name: '5월', total: 165, active: 130, pt: 65, inactive: 35 },
];

export const revenueData: RevenueData[] = [
  { month: '1월', membership: 3200000, pt: 1800000, daily: 450000, other: 200000 },
  { month: '2월', membership: 3500000, pt: 2100000, daily: 480000, other: 250000 },
  { month: '3월', membership: 3700000, pt: 2300000, daily: 510000, other: 300000 },
  { month: '4월', membership: 3200000, pt: 2000000, daily: 470000, other: 270000 },
  { month: '5월', membership: 3900000, pt: 2400000, daily: 550000, other: 320000 },
];

export const staffData: StaffData[] = [
  { name: '김직원', pt: 45, revenue: 4500000, rating: 4.8, newMembers: 12, retentionRate: 85, status: '정상' },
  { name: '이직원', pt: 38, revenue: 3800000, rating: 4.6, newMembers: 9, retentionRate: 78, status: '정상' },
  { name: '박직원', pt: 30, revenue: 3000000, rating: 4.7, newMembers: 8, retentionRate: 82, status: '정상' },
  { name: '최직원', pt: 25, revenue: 2500000, rating: 4.5, newMembers: 6, retentionRate: 75, status: '휴직' },
];

export const memberChartConfig: ChartConfig = {
  total: {
    label: "총 회원수",
    color: "#3B82F6",
  },
  active: {
    label: "활성 회원",
    color: "#10B981",
  },
  pt: {
    label: "PT 회원",
    color: "#F59E0B",
  },
  inactive: {
    label: "휴면 회원",
    color: "#6B7280",
  },
};

export const revenueChartConfig: ChartConfig = {
  membership: {
    label: "회원권",
    color: "#8B5CF6",
  },
  pt: {
    label: "PT 이용권",
    color: "#06B6D4",
  },
  daily: {
    label: "일일권",
    color: "#F97316",
  },
  other: {
    label: "기타",
    color: "#EC4899",
  },
};

export const membershipTypeData: MembershipTypeData[] = [
  { name: '1개월', value: 45, fill: '#3B82F6' },
  { name: '3개월', value: 30, fill: '#10B981' },
  { name: '6개월', value: 15, fill: '#F59E0B' },
  { name: '12개월', value: 10, fill: '#8B5CF6' },
];
