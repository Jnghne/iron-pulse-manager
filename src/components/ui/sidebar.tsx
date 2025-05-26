import * as React from "react"
import { Menu } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

interface SidebarContextType {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

const SidebarContext = React.createContext<SidebarContextType | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

interface SidebarProps {
  defaultCollapsed?: boolean
  children: React.ReactNode
  className?: string
  onCollapsedChange?: (collapsed: boolean) => void
}

function SidebarProvider({ defaultCollapsed = false, children, className, onCollapsedChange }: SidebarProps) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed)
  const isMobile = useIsMobile()

  // 사이드바 상태가 변경될 때 외부 콜백 함수 호출
  React.useEffect(() => {
    onCollapsedChange?.(collapsed);
  }, [collapsed, onCollapsedChange])

  React.useEffect(() => {
    if (isMobile) {
      setCollapsed(true)
    }
  }, [isMobile])

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex flex-col border-r bg-background transition-all",
          collapsed ? "w-[80px]" : "w-[280px]",
          className
        )}
      >
        {children}
      </aside>
    </SidebarContext.Provider>
  )
}

SidebarProvider.displayName = "SidebarProvider"

interface SidebarHeaderProps {
  className?: string
  children: React.ReactNode
}

function SidebarHeader({ className, children }: SidebarHeaderProps) {
  const { collapsed } = useSidebar()

  return (
    <div
      className={cn(
        "flex h-[60px] items-center border-b px-6",
        collapsed && "justify-center px-2",
        className
      )}
    >
      {children}
    </div>
  )
}

interface SidebarMainProps {
  className?: string
  children: React.ReactNode
}

function SidebarMain({ className, children }: SidebarMainProps) {
  return (
    <ScrollAreaPrimitive.Root type="scroll" className={cn("flex-1", className)}>
      <ScrollAreaPrimitive.Viewport className="h-full w-full">
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollAreaPrimitive.Scrollbar
        orientation="vertical"
        className="flex w-2.5 touch-none select-none bg-transparent p-[1px] transition-colors"
      >
        <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-full bg-border" />
      </ScrollAreaPrimitive.Scrollbar>
    </ScrollAreaPrimitive.Root>
  )
}

interface SidebarFooterProps {
  className?: string
  children: React.ReactNode
}

function SidebarFooter({ className, children }: SidebarFooterProps) {
  return (
    <div
      className={cn("mt-auto flex items-center p-4", className)}
    >
      {children}
    </div>
  )
}

interface SidebarToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
}

function SidebarToggle({ className, ...props }: SidebarToggleProps) {
  const { collapsed, setCollapsed } = useSidebar()

  return (
    <Button
      variant="ghost"
      className={cn(
        "h-9 w-9 p-0",
        collapsed && "rotate-180",
        className
      )}
      onClick={() => setCollapsed(!collapsed)}
      {...props}
    >
      <Menu className="h-4 w-4" />
    </Button>
  )
}

interface SidebarItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean
}

const SidebarItem = React.forwardRef<HTMLAnchorElement, SidebarItemProps>(
  ({ className, active, ...props }, ref) => {
    const { collapsed } = useSidebar()

    return (
      <a
        ref={ref}
        className={cn(
          "flex items-center rounded-md px-3 py-3 text-sm font-medium transition-colors",
          "hover:bg-gym-primary/90 hover:text-white",
          active ? 
            "bg-gym-primary text-white font-semibold" : 
            "text-muted-foreground",
          collapsed && "justify-center",
          className
        )}
        {...props}
      />
    )
  }
)

SidebarItem.displayName = "SidebarItem"

export {
  useSidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarMain,
  SidebarFooter,
  SidebarToggle,
  SidebarItem,
}
