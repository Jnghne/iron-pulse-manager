import { useState } from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import { SidebarProvider, SidebarHeader, SidebarMain, SidebarFooter, useSidebar } from "@/components/ui/sidebar";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import Logo from "@/components/ui/logo";

// Mock authentication - replace with actual auth implementation
const useAuth = () => {
  // In a real app, check if user is logged in
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const userRole = localStorage.getItem("userRole") || "trainer"; // 'owner' or 'trainer'
  
  return {
    isAuthenticated,
    userRole,
    logout: () => {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userRole");
      window.location.href = "/login";
    }
  };
};

// 사이드바 컨텐츠 래퍼 컴포넌트
const SidebarContent = () => {
  const { userRole, logout } = useAuth();
  const { collapsed } = useSidebar();
  
  return (
    <>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarMain>
        <SidebarNav />
      </SidebarMain>
      <SidebarFooter>
        <div className="w-full">
          <div className="flex items-center p-4">
            <div className="w-10 h-10 rounded-full bg-gym-primary flex items-center justify-center text-white">
              {userRole === "owner" ? "관" : "트"}
            </div>
            {!collapsed && (
              <div className="ml-3">
                <p className="text-sm font-medium">{userRole === "owner" ? "관장님" : "트레이너"}</p>
                <p className="text-xs text-muted-foreground">{userRole === "owner" ? "관리자" : "일반 직원"}</p>
              </div>
            )}
            <div className="ml-auto">
              <button 
                onClick={logout}
                className="text-muted-foreground hover:text-foreground transition-colors"
                title="로그아웃"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </SidebarFooter>
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
      <div className={`flex-1 transition-all duration-300 ${collapsed ? 'ml-[80px]' : 'ml-[280px]'}`}>
        <main className="h-screen overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
