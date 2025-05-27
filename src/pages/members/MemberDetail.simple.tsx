import React from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

// 간단한 버전의 MemberDetail 컴포넌트
const MemberDetail = () => {
  const navigate = useNavigate();
  
  return (
    <div>
      <Button 
        variant="ghost" 
        onClick={() => navigate("/members")}
        className="flex items-center gap-1.5 text-sm"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="font-medium">목록으로</span>
      </Button>
      <div>회원 상세 정보 페이지</div>
    </div>
  );
};

export default MemberDetail;
