
import { memo } from "react";
import { StaffSummary } from "./StaffSummary";
import { StaffInfoCard } from "./StaffInfoCard";
import { Staff } from "../types";

interface StaffBasicInfoProps {
  staff: Staff;
  onStaffUpdate: (staff: Staff) => void;
}

export const StaffBasicInfo = memo<StaffBasicInfoProps>(({ staff, onStaffUpdate }) => {
  return (
    <div className="space-y-6">
      <StaffSummary staff={staff} />
      <StaffInfoCard staff={staff} />
    </div>
  );
});

StaffBasicInfo.displayName = 'StaffBasicInfo';
