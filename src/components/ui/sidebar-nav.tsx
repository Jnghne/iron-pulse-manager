
import { Link, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  Calendar,
  ClipboardCheck,
  CreditCard,
  MessageSquare,
  Bell,
  Settings,
  BarChart3,
  UserPlus,
  Package,
  Users2, // 커뮤니티 아이콘 추가
} from "lucide-react"
import { SidebarItem } from "./sidebar"
import { cn } from "@/lib/utils"
import { useSidebar } from "./sidebar"

// 타입 오류를 해결하기 위해 새로운 속성 추가
interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'mobile';
}

export function SidebarNav({ className, ...props }: SidebarNavProps) {
  const location = useLocation()
  const pathname = location.pathname
  const { collapsed } = useSidebar()

  const defaultItems = [
    {
      title: "대시보드",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "회원 관리",
      href: "/members",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "일일권 이력",
      href: "/daily-tickets",
      icon: <CreditCard className="h-5 w-5" />,
    },
  ]

  const ownerOnlyItems = [
    {
      title: "문자 메시지",
      href: "/messages",
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      title: "락커룸 관리",
      href: "/locker-room",
      icon: <Settings className="h-5 w-5" />,
    },
    {
      title: "상품 관리",
      href: "/products",
      icon: <Package className="h-5 w-5" />,
    },
    {
      title: "캘린더 관리",
      href: "/calendar",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      title: "직원 관리",
      href: "/staff",
      icon: <UserPlus className="h-5 w-5" />,
    },
    {
      title: "커뮤니티",
      href: "/community",
      icon: <Users2 className="h-5 w-5" />,
    },
    {
      title: "통계",
      href: "/statistics",
      icon: <BarChart3 className="h-5 w-5" />,
    },
  ]

  const items = [...defaultItems, ...ownerOnlyItems]

  // 현재 경로가 특정 메뉴의 하위 경로인지 확인하는 함수
  const isPathActive = (itemPath: string) => {
    // 루트 경로는 정확히 일치할 때만 활성화
    if (itemPath === "/" || itemPath === "/dashboard") {
      return pathname === itemPath;
    }
    
    // 나머지 경로는 시작 부분이 일치하면 활성화
    return pathname.startsWith(itemPath);
  };

  return (
    <nav 
      className={cn(
        "flex flex-col gap-1 px-2 py-2", 
        collapsed ? "items-center" : "items-start",
        className
      )} 
      {...props}
    >
      {items.map((item) => (
        <Link 
          key={item.href} 
          to={item.href} 
          className="w-full"
        >
          <SidebarItem active={isPathActive(item.href)}>
            {item.icon}
            {!collapsed && <span className="ml-3">{item.title}</span>}
          </SidebarItem>
        </Link>
      ))}
    </nav>
  )
}
