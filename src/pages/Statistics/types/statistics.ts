
export interface MemberData {
  name: string;
  total: number;
  active: number;
  pt: number;
  inactive: number;
}

export interface RevenueData {
  month: string;
  membership: number;
  pt: number;
  daily: number;
  other: number;
}

export interface StaffData {
  name: string;
  pt: number;
  revenue: number;
  rating: number;
  newMembers: number;
  retentionRate: number;
  status: string;
}

export interface MembershipTypeData {
  name: string;
  value: number;
  fill: string;
}

export interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}
