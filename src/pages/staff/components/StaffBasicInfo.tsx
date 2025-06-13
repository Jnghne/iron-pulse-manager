
import { memo } from "react";
import { StaffInfoCard } from "./StaffInfoCard";
import { Staff } from "../types";

interface StaffBasicInfoProps {
  staff: Staff;
  onStaffUpdate: (staff: Staff) => void;
}

export const StaffBasicInfo = memo<StaffBasicInfoProps>(({ staff, onStaffUpdate }) => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{staff.name}</h2>
        <p className="text-muted-foreground">직원의 상세 정보를 확인하고 관리할 수 있습니다.</p>
      </div>
      
      <StaffInfoCard staff={staff} />
    </div>
  );
});

StaffBasicInfo.displayName = 'StaffBasicInfo';
