
import { useState } from "react";
import { Outlet, useLocation, Navigate, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarHeader, SidebarMain, SidebarFooter, useSidebar } from "@/components/ui/sidebar";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Logo from "@/components/ui/logo";
import { User, Settings, LogOut, Building, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import GymSwitchDialog from "@/components/GymSwitchDialog";

// Mock authentication - replace with actual auth implementation
const useAuth = () => {
  // In a real app, check if user is logged in
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const userRole = localStorage.getItem("userRole") || "trainer"; // 'owner' or 'trainer'
  const selectedGymName = localStorage.getItem("selectedGymName") || "";
  
  return {
    isAuthenticated,
    userRole,
    selectedGymName,
    logout: () => {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userRole");
      localStorage.removeItem("selectedGym");
      localStorage.removeItem("selectedGymName");
      localStorage.removeItem("userEmail");
      window.location.href = "/login";
    }
  };
};

// 사이드바 컨텐츠 래퍼 컴포넌트
const SidebarContent = () => {
  const { userRole, selectedGymName, logout } = useAuth();
  const { collapsed } = useSidebar();
  const navigate = useNavigate();
  const [showGymSwitchDialog, setShowGymSwitchDialog] = useState(false);
  
  // Mock affiliated gyms data - in real app, this would come from API
  const affiliatedGyms = [
    { id: "seoul-gangnam", name: "강남 피트니스 센터", role: "owner" as const, status: "active" as const },
    { id: "seoul-hongdae", name: "홍대 스포츠 클럽", role: "trainer" as const, status: "active" as const },
    { id: "busan-haeundae", name: "해운대 헬스 파크", role: "trainer" as const, status: "pending" as const }
  ];

  const currentGymId = localStorage.getItem("selectedGym") || "seoul-gangnam";

  const handleGymSwitch = (gymId: string, gymName: string) => {
    // The dialog handles the localStorage update and page refresh
  };
  
  return (
    <>
      <SidebarHeader>
        <div className="flex flex-col gap-2">
          <Logo />
          {/* 현재 사업장 표시 */}
          {!collapsed && (
            <div className="px-2">
              <div className="flex items-center gap-2 p-2 bg-gym-primary/5 rounded-md">
                <Building className="h-4 w-4 text-gym-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">현재 사업장</p>
                  <p className="text-sm font-medium truncate">{selectedGymName}</p>
                </div>
                <Badge className="bg-gym-primary/10 text-gym-primary text-xs">
                  {userRole === "owner" ? "관장" : "트레이너"}
                </Badge>
              </div>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarMain>
        <SidebarNav />
      </SidebarMain>
      <SidebarFooter>
        <div className="w-full">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors rounded-md">
                <div className="w-10 h-10 rounded-full bg-gym-primary flex items-center justify-center text-white">
                  {userRole === "owner" ? "관" : "트"}
                </div>
                {!collapsed && (
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium">{userRole === "owner" ? "관장님" : "트레이너"}</p>
                    <p className="text-xs text-muted-foreground truncate">{selectedGymName}</p>
                  </div>
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => navigate("/my-page")} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>마이페이지</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setShowGymSwitchDialog(true)} 
                className="cursor-pointer"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                <span>사업장 변경</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>로그아웃</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarFooter>

      {/* 사업장 변경 다이얼로그 */}
      <GymSwitchDialog
        open={showGymSwitchDialog}
        onClose={() => setShowGymSwitchDialog(false)}
        currentGymId={currentGymId}
        affiliatedGyms={affiliatedGyms}
        onGymSwitch={handleGymSwitch}
      />
    </>
  );
};

const DashboardLayout = () => {
  const { isAuthenticated, userRole } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 사이드바 상태 변경 감지 함수
  const handleSidebarStateChange = (isCollapsed: boolean) => {
    setCollapsed(isCollapsed);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* 사이드바 */}
      <div className="fixed inset-y-0 left-0 z-50">
        <SidebarProvider 
          defaultCollapsed={false} 
          onCollapsedChange={handleSidebarStateChange}
        >
          <SidebarContent />
        </SidebarProvider>
      </div>
      
      {/* 메인 콘텐츠 - 사이드바 상태에 따라 마진 동적 조정 */}
      <div className={`flex-1 transition-all duration-300 ${collapsed ? 'ml-[70px]' : 'ml-[240px]'}`}>
        <main className="h-screen overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
