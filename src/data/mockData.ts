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
  gender: string;
}

export const mockMembers: Member[] = [
  {
    id: "1001",
    name: "김철수",
    phoneNumber: "010-1234-5678",
    registrationDate: "2024-01-15",
    membershipActive: true,
    membershipStartDate: "2024-01-15",
    membershipEndDate: "2024-07-15",
    hasPT: true,
    ptRemaining: 15,
    ptExpireDate: "2024-07-15",
    attendanceRate: 85,
    lockerId: "A01",
    trainerAssigned: "박지훈",
    photoUrl: null,
    birthDate: "1990-05-15",
    gender: "male",
    address: "서울시 강남구",
    postalCode: "06234",
    memo: "PT 3회차 진행 중"
  },
  {
    id: "1002",
    name: "이영희",
    phoneNumber: "010-2345-6789",
    registrationDate: "2024-02-01",
    membershipActive: true,
    membershipStartDate: "2024-02-01",
    membershipEndDate: "2024-08-01",
    hasPT: false,
    ptRemaining: 0,
    ptExpireDate: null,
    attendanceRate: 70,
    lockerId: "A02",
    trainerAssigned: null,
    photoUrl: null,
    birthDate: "1992-08-20",
    gender: "female",
    address: "서울시 서초구",
    postalCode: "06620",
    memo: "헬스 초보자"
  },
  {
    id: "1003",
    name: "박민수",
    phoneNumber: "010-3456-7890",
    registrationDate: "2024-02-15",
    membershipActive: false,
    membershipStartDate: "2024-02-15",
    membershipEndDate: "2024-03-15",
    hasPT: true,
    ptRemaining: 5,
    ptExpireDate: "2024-05-15",
    attendanceRate: 60,
    lockerId: null,
    trainerAssigned: "김태양",
    photoUrl: null,
    birthDate: "1988-11-30",
    gender: "male",
    address: "서울시 송파구",
    postalCode: "05510",
    memo: "회원권 만료 예정"
  },
  {
    id: "1004",
    name: "최지원",
    phoneNumber: "010-4567-8901",
    registrationDate: "2024-03-01",
    membershipActive: true,
    membershipStartDate: "2024-03-01",
    membershipEndDate: "2024-09-01",
    hasPT: true,
    ptRemaining: 20,
    ptExpireDate: "2024-09-01",
    attendanceRate: 90,
    lockerId: "B01",
    trainerAssigned: "최수진",
    photoUrl: null,
    birthDate: "1995-03-10",
    gender: "male",
    address: "서울시 강서구",
    postalCode: "07500",
    memo: "PT 정기 회원"
  },
  {
    id: "1005",
    name: "정다은",
    phoneNumber: "010-5678-9012",
    registrationDate: "2024-03-15",
    membershipActive: true,
    membershipStartDate: "2024-03-15",
    membershipEndDate: "2024-09-15",
    hasPT: false,
    ptRemaining: 0,
    ptExpireDate: null,
    attendanceRate: 75,
    lockerId: "B02",
    trainerAssigned: null,
    photoUrl: null,
    birthDate: "1993-07-25",
    gender: "female",
    address: "서울시 마포구",
    postalCode: "04001",
    memo: "요가 수업 희망"
  },
  {
    id: "1006",
    name: "강현우",
    phoneNumber: "010-6789-0123",
    registrationDate: "2024-01-20",
    membershipActive: true,
    membershipStartDate: "2024-01-20",
    membershipEndDate: "2024-07-20",
    hasPT: true,
    ptRemaining: 10,
    ptExpireDate: "2024-07-20",
    attendanceRate: 80,
    lockerId: "C01",
    trainerAssigned: "박지훈",
    photoUrl: null,
    birthDate: "1991-09-15",
    gender: "male",
    address: "서울시 용산구",
    postalCode: "04340",
    memo: "근력 운동 중점"
  },
  {
    id: "1007",
    name: "윤서연",
    phoneNumber: "010-7890-1234",
    registrationDate: "2024-02-10",
    membershipActive: true,
    membershipStartDate: "2024-02-10",
    membershipEndDate: "2024-08-10",
    hasPT: false,
    ptRemaining: 0,
    ptExpireDate: null,
    attendanceRate: 65,
    lockerId: "C02",
    trainerAssigned: null,
    photoUrl: null,
    birthDate: "1994-12-05",
    gender: "female",
    address: "서울시 중구",
    postalCode: "04521",
    memo: "유산소 운동 선호"
  },
  {
    id: "1008",
    name: "임재현",
    phoneNumber: "010-8901-2345",
    registrationDate: "2024-03-05",
    membershipActive: true,
    membershipStartDate: "2024-03-05",
    membershipEndDate: "2024-09-05",
    hasPT: true,
    ptRemaining: 25,
    ptExpireDate: "2024-09-05",
    attendanceRate: 95,
    lockerId: "D01",
    trainerAssigned: "김태양",
    photoUrl: null,
    birthDate: "1989-06-20",
    gender: "male",
    address: "서울시 강동구",
    postalCode: "05300",
    memo: "PT 정기 회원"
  },
  {
    id: "1009",
    name: "한미영",
    phoneNumber: "010-9012-3456",
    registrationDate: "2024-01-25",
    membershipActive: false,
    membershipStartDate: "2024-01-25",
    membershipEndDate: "2024-02-25",
    hasPT: false,
    ptRemaining: 0,
    ptExpireDate: null,
    attendanceRate: 40,
    lockerId: null,
    trainerAssigned: null,
    photoUrl: null,
    birthDate: "1992-04-15",
    gender: "female",
    address: "서울시 광진구",
    postalCode: "05000",
    memo: "회원권 만료"
  },
  {
    id: "1010",
    name: "송준호",
    phoneNumber: "010-0123-4567",
    registrationDate: "2024-02-20",
    membershipActive: true,
    membershipStartDate: "2024-02-20",
    membershipEndDate: "2024-08-20",
    hasPT: true,
    ptRemaining: 18,
    ptExpireDate: "2024-08-20",
    attendanceRate: 85,
    lockerId: "D02",
    trainerAssigned: "최수진",
    photoUrl: null,
    birthDate: "1990-10-10",
    gender: "male",
    address: "서울시 성동구",
    postalCode: "04700",
    memo: "체형 관리 중"
  },
  {
    id: "1011",
    name: "오지은",
    phoneNumber: "010-1234-5679",
    registrationDate: "2024-03-10",
    membershipActive: true,
    membershipStartDate: "2024-03-10",
    membershipEndDate: "2024-09-10",
    hasPT: false,
    ptRemaining: 0,
    ptExpireDate: null,
    attendanceRate: 70,
    lockerId: "E01",
    trainerAssigned: null,
    photoUrl: null,
    birthDate: "1993-01-20",
    gender: "female",
    address: "서울시 동작구",
    postalCode: "06900",
    memo: "요가 수업 희망"
  },
  {
    id: "1012",
    name: "김도현",
    phoneNumber: "010-2345-6780",
    registrationDate: "2024-01-30",
    membershipActive: true,
    membershipStartDate: "2024-01-30",
    membershipEndDate: "2024-07-30",
    hasPT: true,
    ptRemaining: 12,
    ptExpireDate: "2024-07-30",
    attendanceRate: 88,
    lockerId: "E02",
    trainerAssigned: "박지훈",
    photoUrl: null,
    birthDate: "1991-07-15",
    gender: "male",
    address: "서울시 서대문구",
    postalCode: "03700",
    memo: "근력 운동 중점"
  },
  {
    id: "1013",
    name: "이수진",
    phoneNumber: "010-3456-7891",
    registrationDate: "2024-02-25",
    membershipActive: true,
    membershipStartDate: "2024-02-25",
    membershipEndDate: "2024-08-25",
    hasPT: false,
    ptRemaining: 0,
    ptExpireDate: null,
    attendanceRate: 75,
    lockerId: "F01",
    trainerAssigned: null,
    photoUrl: null,
    birthDate: "1994-03-25",
    gender: "female",
    address: "서울시 종로구",
    postalCode: "03000",
    memo: "유산소 운동 선호"
  },
  {
    id: "1014",
    name: "박성훈",
    phoneNumber: "010-4567-8902",
    registrationDate: "2024-03-15",
    membershipActive: true,
    membershipStartDate: "2024-03-15",
    membershipEndDate: "2024-09-15",
    hasPT: true,
    ptRemaining: 22,
    ptExpireDate: "2024-09-15",
    attendanceRate: 92,
    lockerId: "F02",
    trainerAssigned: "김태양",
    photoUrl: null,
    birthDate: "1989-12-10",
    gender: "male",
    address: "서울시 중랑구",
    postalCode: "02000",
    memo: "PT 정기 회원"
  },
  {
    id: "1015",
    name: "최유진",
    phoneNumber: "010-5678-9013",
    registrationDate: "2024-01-05",
    membershipActive: false,
    membershipStartDate: "2024-01-05",
    membershipEndDate: "2024-02-05",
    hasPT: false,
    ptRemaining: 0,
    ptExpireDate: null,
    attendanceRate: 45,
    lockerId: null,
    trainerAssigned: null,
    photoUrl: null,
    birthDate: "1992-09-30",
    gender: "female",
    address: "서울시 노원구",
    postalCode: "01600",
    memo: "회원권 만료"
  },
  {
    id: "1016",
    name: "정민재",
    phoneNumber: "010-6789-0124",
    registrationDate: "2024-02-15",
    membershipActive: true,
    membershipStartDate: "2024-02-15",
    membershipEndDate: "2024-08-15",
    hasPT: true,
    ptRemaining: 15,
    ptExpireDate: "2024-08-15",
    attendanceRate: 82,
    lockerId: "G01",
    trainerAssigned: "최수진",
    photoUrl: null,
    birthDate: "1990-02-20",
    gender: "male",
    address: "서울시 도봉구",
    postalCode: "01300",
    memo: "체형 관리 중"
  },
  {
    id: "1017",
    name: "강서연",
    phoneNumber: "010-7890-1235",
    registrationDate: "2024-03-20",
    membershipActive: true,
    membershipStartDate: "2024-03-20",
    membershipEndDate: "2024-09-20",
    hasPT: false,
    ptRemaining: 0,
    ptExpireDate: null,
    attendanceRate: 68,
    lockerId: "G02",
    trainerAssigned: null,
    photoUrl: null,
    birthDate: "1993-05-15",
    gender: "female",
    address: "서울시 강북구",
    postalCode: "01000",
    memo: "요가 수업 희망"
  },
  {
    id: "1018",
    name: "윤지훈",
    phoneNumber: "010-8901-2346",
    registrationDate: "2024-01-10",
    membershipActive: true,
    membershipStartDate: "2024-01-10",
    membershipEndDate: "2024-07-10",
    hasPT: true,
    ptRemaining: 8,
    ptExpireDate: "2024-07-10",
    attendanceRate: 78,
    lockerId: "H01",
    trainerAssigned: "박지훈",
    photoUrl: null,
    birthDate: "1991-11-25",
    gender: "male",
    address: "서울시 성북구",
    postalCode: "02800",
    memo: "근력 운동 중점"
  },
  {
    id: "1019",
    name: "임수아",
    phoneNumber: "010-9012-3457",
    registrationDate: "2024-02-28",
    membershipActive: true,
    membershipStartDate: "2024-02-28",
    membershipEndDate: "2024-08-28",
    hasPT: false,
    ptRemaining: 0,
    ptExpireDate: null,
    attendanceRate: 72,
    lockerId: "H02",
    trainerAssigned: null,
    photoUrl: null,
    birthDate: "1994-08-05",
    gender: "female",
    address: "서울시 동대문구",
    postalCode: "02400",
    memo: "유산소 운동 선호"
  },
  {
    id: "1020",
    name: "한승우",
    phoneNumber: "010-0123-4568",
    registrationDate: "2024-03-25",
    membershipActive: true,
    membershipStartDate: "2024-03-25",
    membershipEndDate: "2024-09-25",
    hasPT: true,
    ptRemaining: 20,
    ptExpireDate: "2024-09-25",
    attendanceRate: 90,
    lockerId: "I01",
    trainerAssigned: "김태양",
    photoUrl: null,
    birthDate: "1989-04-15",
    gender: "male",
    address: "서울시 은평구",
    postalCode: "03300",
    memo: "PT 정기 회원"
  },
  {
    id: "1021",
    name: "송지민",
    phoneNumber: "010-1234-5680",
    registrationDate: "2024-01-15",
    membershipActive: false,
    membershipStartDate: "2024-01-15",
    membershipEndDate: "2024-02-15",
    hasPT: false,
    ptRemaining: 0,
    ptExpireDate: null,
    attendanceRate: 42,
    lockerId: null,
    trainerAssigned: null,
    photoUrl: null,
    birthDate: "1992-06-20",
    gender: "female",
    address: "서울시 서대문구",
    postalCode: "03700",
    memo: "회원권 만료"
  },
  {
    id: "1022",
    name: "오현우",
    phoneNumber: "010-2345-6781",
    registrationDate: "2024-02-05",
    membershipActive: true,
    membershipStartDate: "2024-02-05",
    membershipEndDate: "2024-08-05",
    hasPT: true,
    ptRemaining: 16,
    ptExpireDate: "2024-08-05",
    attendanceRate: 84,
    lockerId: "I02",
    trainerAssigned: "최수진",
    photoUrl: null,
    birthDate: "1990-09-10",
    gender: "male",
    address: "서울시 마포구",
    postalCode: "04000",
    memo: "체형 관리 중"
  },
  {
    id: "1023",
    name: "김다은",
    phoneNumber: "010-3456-7892",
    registrationDate: "2024-03-30",
    membershipActive: true,
    membershipStartDate: "2024-03-30",
    membershipEndDate: "2024-09-30",
    hasPT: false,
    ptRemaining: 0,
    ptExpireDate: null,
    attendanceRate: 66,
    lockerId: "J01",
    trainerAssigned: null,
    photoUrl: null,
    birthDate: "1993-02-25",
    gender: "female",
    address: "서울시 강남구",
    postalCode: "06200",
    memo: "요가 수업 희망"
  },
  {
    id: "1024",
    name: "이준호",
    phoneNumber: "010-4567-8903",
    registrationDate: "2024-01-20",
    membershipActive: true,
    membershipStartDate: "2024-01-20",
    membershipEndDate: "2024-07-20",
    hasPT: true,
    ptRemaining: 10,
    ptExpireDate: "2024-07-20",
    attendanceRate: 80,
    lockerId: "J02",
    trainerAssigned: "박지훈",
    photoUrl: null,
    birthDate: "1991-08-15",
    gender: "male",
    address: "서울시 서초구",
    postalCode: "06600",
    memo: "근력 운동 중점"
  },
  {
    id: "1025",
    name: "박미영",
    phoneNumber: "010-5678-9014",
    registrationDate: "2024-02-10",
    membershipActive: true,
    membershipStartDate: "2024-02-10",
    membershipEndDate: "2024-08-10",
    hasPT: false,
    ptRemaining: 0,
    ptExpireDate: null,
    attendanceRate: 74,
    lockerId: "K01",
    trainerAssigned: null,
    photoUrl: null,
    birthDate: "1994-11-30",
    gender: "female",
    address: "서울시 송파구",
    postalCode: "05500",
    memo: "유산소 운동 선호"
  },
  {
    id: "1026",
    name: "최성훈",
    phoneNumber: "010-6789-0125",
    registrationDate: "2024-03-05",
    membershipActive: true,
    membershipStartDate: "2024-03-05",
    membershipEndDate: "2024-09-05",
    hasPT: true,
    ptRemaining: 24,
    ptExpireDate: "2024-09-05",
    attendanceRate: 94,
    lockerId: "K02",
    trainerAssigned: "김태양",
    photoUrl: null,
    birthDate: "1989-01-20",
    gender: "male",
    address: "서울시 강동구",
    postalCode: "05300",
    memo: "PT 정기 회원"
  },
  {
    id: "1027",
    name: "정유진",
    phoneNumber: "010-7890-1236",
    registrationDate: "2024-01-25",
    membershipActive: false,
    membershipStartDate: "2024-01-25",
    membershipEndDate: "2024-02-25",
    hasPT: false,
    ptRemaining: 0,
    ptExpireDate: null,
    attendanceRate: 48,
    lockerId: null,
    trainerAssigned: null,
    photoUrl: null,
    birthDate: "1992-07-15",
    gender: "female",
    address: "서울시 광진구",
    postalCode: "05000",
    memo: "회원권 만료"
  },
  {
    id: "1028",
    name: "강민재",
    phoneNumber: "010-8901-2347",
    registrationDate: "2024-02-15",
    membershipActive: true,
    membershipStartDate: "2024-02-15",
    membershipEndDate: "2024-08-15",
    hasPT: true,
    ptRemaining: 14,
    ptExpireDate: "2024-08-15",
    attendanceRate: 86,
    lockerId: "L01",
    trainerAssigned: "최수진",
    photoUrl: null,
    birthDate: "1990-03-10",
    gender: "male",
    address: "서울시 용산구",
    postalCode: "04300",
    memo: "체형 관리 중"
  },
  {
    id: "1029",
    name: "윤서연",
    phoneNumber: "010-9012-3458",
    registrationDate: "2024-03-10",
    membershipActive: true,
    membershipStartDate: "2024-03-10",
    membershipEndDate: "2024-09-10",
    hasPT: false,
    ptRemaining: 0,
    ptExpireDate: null,
    attendanceRate: 70,
    lockerId: "L02",
    trainerAssigned: null,
    photoUrl: null,
    birthDate: "1993-04-25",
    gender: "female",
    address: "서울시 중구",
    postalCode: "04500",
    memo: "요가 수업 희망"
  },
  {
    id: "1030",
    name: "임지훈",
    phoneNumber: "010-0123-4569",
    registrationDate: "2024-01-30",
    membershipActive: true,
    membershipStartDate: "2024-01-30",
    membershipEndDate: "2024-07-30",
    hasPT: true,
    ptRemaining: 9,
    ptExpireDate: "2024-07-30",
    attendanceRate: 76,
    lockerId: "M01",
    trainerAssigned: "박지훈",
    photoUrl: null,
    birthDate: "1991-10-20",
    gender: "male",
    address: "서울시 성북구",
    postalCode: "02800",
    memo: "근력 운동 중점"
  },
  {
    id: "1031",
    name: "한수아",
    phoneNumber: "010-1234-5681",
    registrationDate: "2024-02-20",
    membershipActive: true,
    membershipStartDate: "2024-02-20",
    membershipEndDate: "2024-08-20",
    hasPT: false,
    ptRemaining: 0,
    ptExpireDate: null,
    attendanceRate: 72,
    lockerId: "M02",
    trainerAssigned: null,
    photoUrl: null,
    birthDate: "1994-09-15",
    gender: "female",
    address: "서울시 동대문구",
    postalCode: "02400",
    memo: "유산소 운동 선호"
  },
  {
    id: "1032",
    name: "송승우",
    phoneNumber: "010-2345-6782",
    registrationDate: "2024-03-15",
    membershipActive: true,
    membershipStartDate: "2024-03-15",
    membershipEndDate: "2024-09-15",
    hasPT: true,
    ptRemaining: 21,
    ptExpireDate: "2024-09-15",
    attendanceRate: 91,
    lockerId: "N01",
    trainerAssigned: "김태양",
    photoUrl: null,
    birthDate: "1989-05-25",
    gender: "male",
    address: "서울시 은평구",
    postalCode: "03300",
    memo: "PT 정기 회원"
  },
  {
    id: "1033",
    name: "오지민",
    phoneNumber: "010-3456-7893",
    registrationDate: "2024-01-05",
    membershipActive: false,
    membershipStartDate: "2024-01-05",
    membershipEndDate: "2024-02-05",
    hasPT: false,
    ptRemaining: 0,
    ptExpireDate: null,
    attendanceRate: 44,
    lockerId: null,
    trainerAssigned: null,
    photoUrl: null,
    birthDate: "1992-08-10",
    gender: "female",
    address: "서울시 서대문구",
    postalCode: "03700",
    memo: "회원권 만료"
  },
  {
    id: "1034",
    name: "김현우",
    phoneNumber: "010-4567-8904",
    registrationDate: "2024-02-25",
    membershipActive: true,
    membershipStartDate: "2024-02-25",
    membershipEndDate: "2024-08-25",
    hasPT: true,
    ptRemaining: 17,
    ptExpireDate: "2024-08-25",
    attendanceRate: 83,
    lockerId: "N02",
    trainerAssigned: "최수진",
    photoUrl: null,
    birthDate: "1990-10-15",
    gender: "male",
    address: "서울시 마포구",
    postalCode: "04000",
    memo: "체형 관리 중"
  },
  {
    id: "1035",
    name: "이다은",
    phoneNumber: "010-5678-9015",
    registrationDate: "2024-03-20",
    membershipActive: true,
    membershipStartDate: "2024-03-20",
    membershipEndDate: "2024-09-20",
    hasPT: false,
    ptRemaining: 0,
    ptExpireDate: null,
    attendanceRate: 68,
    lockerId: "O01",
    trainerAssigned: null,
    photoUrl: null,
    birthDate: "1993-03-05",
    gender: "female",
    address: "서울시 강남구",
    postalCode: "06200",
    memo: "요가 수업 희망"
  },
  {
    id: "1036",
    name: "박준호",
    phoneNumber: "010-6789-0126",
    registrationDate: "2024-01-10",
    membershipActive: true,
    membershipStartDate: "2024-01-10",
    membershipEndDate: "2024-07-10",
    hasPT: true,
    ptRemaining: 11,
    ptExpireDate: "2024-07-10",
    attendanceRate: 79,
    lockerId: "O02",
    trainerAssigned: "박지훈",
    photoUrl: null,
    birthDate: "1991-09-20",
    gender: "male",
    address: "서울시 서초구",
    postalCode: "06600",
    memo: "근력 운동 중점"
  },
  {
    id: "1037",
    name: "최미영",
    phoneNumber: "010-7890-1237",
    registrationDate: "2024-02-28",
    membershipActive: true,
    membershipStartDate: "2024-02-28",
    membershipEndDate: "2024-08-28",
    hasPT: false,
    ptRemaining: 0,
    ptExpireDate: null,
    attendanceRate: 73,
    lockerId: "P01",
    trainerAssigned: null,
    photoUrl: null,
    birthDate: "1994-12-25",
    gender: "female",
    address: "서울시 송파구",
    postalCode: "05500",
    memo: "유산소 운동 선호"
  },
  {
    id: "1038",
    name: "정성훈",
    phoneNumber: "010-8901-2348",
    registrationDate: "2024-03-25",
    membershipActive: true,
    membershipStartDate: "2024-03-25",
    membershipEndDate: "2024-09-25",
    hasPT: true,
    ptRemaining: 23,
    ptExpireDate: "2024-09-25",
    attendanceRate: 93,
    lockerId: "P02",
    trainerAssigned: "김태양",
    photoUrl: null,
    birthDate: "1989-02-15",
    gender: "male",
    address: "서울시 강동구",
    postalCode: "05300",
    memo: "PT 정기 회원"
  },
  {
    id: "1039",
    name: "강유진",
    phoneNumber: "010-9012-3459",
    registrationDate: "2024-01-15",
    membershipActive: false,
    membershipStartDate: "2024-01-15",
    membershipEndDate: "2024-02-15",
    hasPT: false,
    ptRemaining: 0,
    ptExpireDate: null,
    attendanceRate: 46,
    lockerId: null,
    trainerAssigned: null,
    photoUrl: null,
    birthDate: "1992-09-05",
    gender: "female",
    address: "서울시 광진구",
    postalCode: "05000",
    memo: "회원권 만료"
  },
  {
    id: "1040",
    name: "윤민재",
    phoneNumber: "010-0123-4570",
    registrationDate: "2024-02-05",
    membershipActive: true,
    membershipStartDate: "2024-02-05",
    membershipEndDate: "2024-08-05",
    hasPT: true,
    ptRemaining: 19,
    ptExpireDate: "2024-08-05",
    attendanceRate: 87,
    lockerId: "Q01",
    trainerAssigned: "최수진",
    photoUrl: null,
    birthDate: "1990-04-20",
    gender: "male",
    address: "서울시 용산구",
    postalCode: "04300",
    memo: "체형 관리 중"
  },
  {
    id: "1041",
    name: "임서연",
    phoneNumber: "010-1234-5682",
    registrationDate: "2024-03-10",
    membershipActive: true,
    membershipStartDate: "2024-03-10",
    membershipEndDate: "2024-09-10",
    hasPT: false,
    ptRemaining: 0,
    ptExpireDate: null,
    attendanceRate: 69,
    lockerId: "Q02",
    trainerAssigned: null,
    photoUrl: null,
    birthDate: "1993-05-15",
    gender: "female",
    address: "서울시 중구",
    postalCode: "04500",
    memo: "요가 수업 희망"
  },
  {
    id: "1042",
    name: "한지훈",
    phoneNumber: "010-2345-6783",
    registrationDate: "2024-01-20",
    membershipActive: true,
    membershipStartDate: "2024-01-20",
    membershipEndDate: "2024-07-20",
    hasPT: true,
    ptRemaining: 13,
    ptExpireDate: "2024-07-20",
    attendanceRate: 81,
    lockerId: "R01",
    trainerAssigned: "박지훈",
    photoUrl: null,
    birthDate: "1991-11-30",
    gender: "male",
    address: "서울시 성북구",
    postalCode: "02800",
    memo: "근력 운동 중점"
  },
  {
    id: "1043",
    name: "송수아",
    phoneNumber: "010-3456-7894",
    registrationDate: "2024-02-15",
    membershipActive: true,
    membershipStartDate: "2024-02-15",
    membershipEndDate: "2024-08-15",
    hasPT: false,
    ptRemaining: 0,
    ptExpireDate: null,
    attendanceRate: 71,
    lockerId: "R02",
    trainerAssigned: null,
    photoUrl: null,
    birthDate: "1994-10-20",
    gender: "female",
    address: "서울시 동대문구",
    postalCode: "02400",
    memo: "유산소 운동 선호"
  },
  {
    id: "1044",
    name: "오승우",
    phoneNumber: "010-4567-8905",
    registrationDate: "2024-03-15",
    membershipActive: true,
    membershipStartDate: "2024-03-15",
    membershipEndDate: "2024-09-15",
    hasPT: true,
    ptRemaining: 26,
    ptExpireDate: "2024-09-15",
    attendanceRate: 96,
    lockerId: "S01",
    trainerAssigned: "김태양",
    photoUrl: null,
    birthDate: "1989-06-25",
    gender: "male",
    address: "서울시 은평구",
    postalCode: "03300",
    memo: "PT 정기 회원"
  },
  {
    id: "1045",
    name: "김지민",
    phoneNumber: "010-5678-9016",
    registrationDate: "2024-01-25",
    membershipActive: false,
    membershipStartDate: "2024-01-25",
    membershipEndDate: "2024-02-25",
    hasPT: false,
    ptRemaining: 0,
    ptExpireDate: null,
    attendanceRate: 43,
    lockerId: null,
    trainerAssigned: null,
    photoUrl: null,
    birthDate: "1992-10-15",
    gender: "female",
    address: "서울시 서대문구",
    postalCode: "03700",
    memo: "회원권 만료"
  },
  {
    id: "1046",
    name: "이현우",
    phoneNumber: "010-6789-0127",
    registrationDate: "2024-02-20",
    membershipActive: true,
    membershipStartDate: "2024-02-20",
    membershipEndDate: "2024-08-20",
    hasPT: true,
    ptRemaining: 18,
    ptExpireDate: "2024-08-20",
    attendanceRate: 85,
    lockerId: "S02",
    trainerAssigned: "최수진",
    photoUrl: null,
    birthDate: "1990-11-20",
    gender: "male",
    address: "서울시 마포구",
    postalCode: "04000",
    memo: "체형 관리 중"
  },
  {
    id: "1047",
    name: "박다은",
    phoneNumber: "010-7890-1238",
    registrationDate: "2024-03-20",
    membershipActive: true,
    membershipStartDate: "2024-03-20",
    membershipEndDate: "2024-09-20",
    hasPT: false,
    ptRemaining: 0,
    ptExpireDate: null,
    attendanceRate: 67,
    lockerId: "T01",
    trainerAssigned: null,
    photoUrl: null,
    birthDate: "1993-06-25",
    gender: "female",
    address: "서울시 강남구",
    postalCode: "06200",
    memo: "요가 수업 희망"
  },
  {
    id: "1048",
    name: "최준호",
    phoneNumber: "010-8901-2349",
    registrationDate: "2024-01-30",
    membershipActive: true,
    membershipStartDate: "2024-01-30",
    membershipEndDate: "2024-07-30",
    hasPT: true,
    ptRemaining: 12,
    ptExpireDate: "2024-07-30",
    attendanceRate: 77,
    lockerId: "T02",
    trainerAssigned: "박지훈",
    photoUrl: null,
    birthDate: "1991-12-30",
    gender: "male",
    address: "서울시 서초구",
    postalCode: "06600",
    memo: "근력 운동 중점"
  },
  {
    id: "1049",
    name: "정미영",
    phoneNumber: "010-9012-3460",
    registrationDate: "2024-02-25",
    membershipActive: true,
    membershipStartDate: "2024-02-25",
    membershipEndDate: "2024-08-25",
    hasPT: false,
    ptRemaining: 0,
    ptExpireDate: null,
    attendanceRate: 75,
    lockerId: "U01",
    trainerAssigned: null,
    photoUrl: null,
    birthDate: "1994-01-15",
    gender: "female",
    address: "서울시 송파구",
    postalCode: "05500",
    memo: "유산소 운동 선호"
  },
  {
    id: "1050",
    name: "강성훈",
    phoneNumber: "010-0123-4571",
    registrationDate: "2024-03-25",
    membershipActive: true,
    membershipStartDate: "2024-03-25",
    membershipEndDate: "2024-09-25",
    hasPT: true,
    ptRemaining: 25,
    ptExpireDate: "2024-09-25",
    attendanceRate: 95,
    lockerId: "U02",
    trainerAssigned: "김태양",
    photoUrl: null,
    birthDate: "1989-07-25",
    gender: "male",
    address: "서울시 강동구",
    postalCode: "05300",
    memo: "PT 정기 회원"
  }
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
