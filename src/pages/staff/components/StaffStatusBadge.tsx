import { Badge } from "@/components/ui/badge";
import { memo } from "react";

interface StaffStatusBadgeProps {
  status: string;
}

export const StaffStatusBadge = memo<StaffStatusBadgeProps>(({ status }) => {
  if (status === 'active') {
    return <Badge variant="default">재직중</Badge>;
  } else if (status === 'resigned') {
    return <Badge variant="destructive">퇴사</Badge>;
  } else {
    return <Badge variant="outline">기타</Badge>;
  }
});

StaffStatusBadge.displayName = 'StaffStatusBadge';
