
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
  revenue?: number;
  isRegistration?: boolean;
}

export interface StaffRegistration {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: 'pending' | 'rejected';
  registrationDate: string;
  position?: string;
  address?: string;
  memo?: string;
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
