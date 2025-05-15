
import { useState } from "react";
import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import { 
  BarChart3, 
  Users, 
  CreditCard, 
  Key, 
  QrCode, 
  MessageSquare, 
  Calendar as CalendarIcon,
  TrendingUp,
  UserPlus,
  Menu,
  X,
  LogOut,
  Home
} from "lucide-react";
import { cn } from "@/lib/utils";

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

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  disabled?: boolean;
}

const NavItem = ({ to, icon, label, active, disabled = false }: NavItemProps) => {
  if (disabled) {
    return (
      <div className="nav-link opacity-50 cursor-not-allowed">
        {icon}
        <span>{label}</span>
      </div>
    );
  }
  
  return (
    <Link to={to} className={cn("nav-link", active && "active")}>
      {icon}
      <span>{label}</span>
    </Link>
  );
};

const DashboardLayout = () => {
  const { isAuthenticated, userRole, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  const isOwner = userRole === "owner";
  const currentPath = location.pathname;
  
  const mainNavItems = [
    { to: "/", icon: <Home size={20} />, label: "대시보드" },
    { to: "/members", icon: <Users size={20} />, label: "회원 관리" },
    { to: "/daily-tickets", icon: <CreditCard size={20} />, label: "일일권 이력" },
    { to: "/payments", icon: <CreditCard size={20} />, label: "결제 등록" },
    { to: "/locker-room", icon: <Key size={20} />, label: "락커룸 관리" },
    { to: "/attendance", icon: <QrCode size={20} />, label: "출석 체크" },
    { to: "/messages", icon: <MessageSquare size={20} />, label: "문자 메시지" },
    { to: "/calendar", icon: <CalendarIcon size={20} />, label: "캘린더 관리" },
  ];
  
  const ownerOnlyNavItems = [
    { to: "/statistics", icon: <BarChart3 size={20} />, label: "통계", ownerOnly: true },
    { to: "/trainers", icon: <UserPlus size={20} />, label: "트레이너 관리", ownerOnly: true },
  ];
  
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  
  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile menu button */}
      <button 
        onClick={toggleMobileMenu}
        className="fixed top-4 left-4 z-50 md:hidden flex items-center justify-center h-10 w-10 rounded-md bg-background shadow-md"
      >
        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-72 bg-sidebar border-r transition-transform duration-300 ease-in-out",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo area */}
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-gym-primary">
              Gym<span className="text-gym-accent">Manager</span>
            </h1>
            <p className="text-xs text-muted-foreground mt-1">헬스장 관리 시스템</p>
          </div>
          
          {/* Navigation items */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {mainNavItems.map((item) => (
              <NavItem 
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                active={currentPath === item.to}
              />
            ))}
            
            {ownerOnlyNavItems.length > 0 && (
              <>
                <div className="my-4 border-t border-border"></div>
                <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  관리자 전용
                </p>
                
                {ownerOnlyNavItems.map((item) => (
                  <NavItem 
                    key={item.to}
                    to={item.to}
                    icon={item.icon}
                    label={item.label}
                    active={currentPath === item.to}
                    disabled={!isOwner}
                  />
                ))}
              </>
            )}
          </nav>
          
          {/* User footer */}
          <div className="p-4 border-t border-border mt-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  {userRole === "owner" ? "관" : "트"}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{userRole === "owner" ? "관장님" : "트레이너"}</p>
                  <p className="text-xs text-muted-foreground">{userRole === "owner" ? "관리자" : "일반 직원"}</p>
                </div>
              </div>
              <button 
                onClick={logout}
                className="p-2 rounded-md hover:bg-accent"
                aria-label="로그아웃"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 md:ml-72">
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
