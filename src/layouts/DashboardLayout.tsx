import { useState } from "react";
import { Outlet, useLocation, Navigate, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarHeader, SidebarMain, SidebarFooter, useSidebar } from "@/components/ui/sidebar";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Logo from "@/components/ui/logo";
import { User, Settings, LogOut, RefreshCw, Shield } from "lucide-react";
import GymSwitchDialog from "@/components/GymSwitchDialog";
import { PasswordConfirmDialog } from "@/components/PasswordConfirmDialog";
import { PermissionSelectDialog } from "@/components/PermissionSelectDialog";
import TrainerDashboard from "@/pages/TrainerDashboard";
import StaffManagement from "@/pages/StaffManagement";

// Mock authentication - replace with actual auth implementation
const useAuth = () => {
  // In a real app, check if user is logged in
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const userRole = "owner"; // Only owner role supported
  const userPermission = localStorage.getItem("userPermission") || "general"; // 'general' or 'master'
  const selectedGymName = localStorage.getItem("selectedGymName") || "";
  
  return {
    isAuthenticated,
    userRole,
    userPermission,
    selectedGymName,
    logout: () => {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userPermission");
      localStorage.removeItem("selectedGym");
      localStorage.removeItem("selectedGymName");
      localStorage.removeItem("userEmail");
      window.location.href = "/login";
    }
  };
};

// 사이드바 컨텐츠 래퍼 컴포넌트
const SidebarContent = () => {
  const { userRole, userPermission, selectedGymName, logout } = useAuth();
  const { collapsed } = useSidebar();
  const navigate = useNavigate();
  const [showGymSwitchDialog, setShowGymSwitchDialog] = useState(false);
  const [showPermissionSelectDialog, setShowPermissionSelectDialog] = useState(false);
  const [showPermissionConfirmDialog, setShowPermissionConfirmDialog] = useState(false);
  const [showMyPageDialog, setShowMyPageDialog] = useState(false);
  const [showGymSwitchConfirmDialog, setShowGymSwitchConfirmDialog] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<"general" | "master">("general");
  
  // Mock affiliated gyms data - in real app, this would come from API
  const affiliatedGyms = [
    { id: "seoul-gangnam", name: "강남 피트니스 센터", role: "owner" as const, status: "active" as const },
    { id: "seoul-songpa", name: "송파 헬스클럽", role: "owner" as const, status: "active" as const },
    { id: "busan-haeundae", name: "해운대 헬스 파크", role: "owner" as const, status: "pending" as const }
  ];

  const currentGymId = localStorage.getItem("selectedGym") || "seoul-gangnam";

  const handlePermissionSelect = (permission: "general" | "master") => {
    setSelectedPermission(permission);
    setShowPermissionSelectDialog(false);
    setShowPermissionConfirmDialog(true);
  };

  const handlePermissionChange = () => {
    localStorage.setItem("userPermission", selectedPermission);
    window.location.reload();
  };

  const handleMyPageAccess = () => {
    navigate("/my-page");
  };

  const handleGymSwitch = (gymId: string, gymName: string) => {
    setShowGymSwitchDialog(false);
    // The dialog handles the localStorage update and page refresh
  };
  
  return (
    <>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarMain>
        <SidebarNav userPermission={userPermission} />
      </SidebarMain>
      <SidebarFooter>
        <div className="w-full">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors rounded-md">
                <div className="w-10 h-10 rounded-full bg-gym-primary flex items-center justify-center text-white">
                  관
                </div>
                {!collapsed && (
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium">관장님</p>
                    <p className="text-xs text-muted-foreground truncate">{selectedGymName}</p>
                  </div>
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => setShowMyPageDialog(true)} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>마이페이지</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowPermissionSelectDialog(true)} className="cursor-pointer">
                <Shield className="mr-2 h-4 w-4" />
                <span>권한 변경</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setShowGymSwitchConfirmDialog(true)} 
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

      <GymSwitchDialog
        open={showGymSwitchDialog}
        onClose={() => setShowGymSwitchDialog(false)}
        currentGymId={currentGymId}
        affiliatedGyms={affiliatedGyms}
        onGymSwitch={handleGymSwitch}
      />

      <PermissionSelectDialog
        open={showPermissionSelectDialog}
        onClose={() => setShowPermissionSelectDialog(false)}
        onSelect={handlePermissionSelect}
        currentPermission={userPermission}
      />

      <PasswordConfirmDialog
        open={showPermissionConfirmDialog}
        onClose={() => setShowPermissionConfirmDialog(false)}
        onConfirm={handlePermissionChange}
        title="권한 변경"
        description={`계정 비밀번호를 입력하여 ${selectedPermission === "master" ? "마스터" : "일반"} 권한으로 변경하세요.`}
      />

      <PasswordConfirmDialog
        open={showMyPageDialog}
        onClose={() => setShowMyPageDialog(false)}
        onConfirm={handleMyPageAccess}
        title="마이페이지 접근"
        description="계정 비밀번호를 입력하여 마이페이지에 접근하세요."
      />

      <PasswordConfirmDialog
        open={showGymSwitchConfirmDialog}
        onClose={() => setShowGymSwitchConfirmDialog(false)}
        onConfirm={() => setShowGymSwitchDialog(true)}
        title="사업장 변경"
        description="계정 비밀번호를 입력하여 사업장을 변경하세요."
      />
    </>
  );
};

const DashboardLayout = () => {
  const { isAuthenticated, userRole, userPermission } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 일반 권한이고 대시보드 페이지인 경우 트레이너 대시보드 표시
  const isGeneralPermissionDashboard = userPermission === "general" && location.pathname === "/dashboard";
  
  if (isGeneralPermissionDashboard) {
    return (
      <div className="flex h-screen overflow-hidden bg-background">
        {/* 사이드바 */}
        <div className="fixed inset-y-0 left-0 z-50">
          <SidebarProvider 
            defaultCollapsed={false} 
            onCollapsedChange={(isCollapsed: boolean) => setCollapsed(isCollapsed)}
          >
            <SidebarContent />
          </SidebarProvider>
        </div>
        
        {/* 메인 콘텐츠 - 트레이너 대시보드 */}
        <div className={`flex-1 transition-all duration-300 ${collapsed ? 'ml-[70px]' : 'ml-[240px]'}`}>
          <main className="h-screen overflow-y-auto p-8">
            <TrainerDashboard />
          </main>
        </div>
      </div>
    );
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
