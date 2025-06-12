export interface Staff {
  id: string;
  name: string;
  phone: string;
  email: string;
  position: string;
  memberCount: number;
  status: string;
  approvalDate: string;
  address?: string;
  memo?: string;
  gender?: string;
  account?: string;
  workHours?: string;
  isRegistration?: boolean;
}

export interface Member {
  id: string;
  name: string;
  phone: string;
  membershipType: string;
  startDate: string;
  endDate: string;
}
