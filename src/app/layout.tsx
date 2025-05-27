
import "./globals.css"
import { cn } from "@/lib/utils"
import { SidebarProvider, SidebarHeader, SidebarMain, SidebarFooter, SidebarToggle } from "@/components/ui/sidebar"
import { SidebarNav } from "@/components/ui/sidebar-nav"
import Logo from "@/components/ui/logo"

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={cn("min-h-screen bg-background font-sans")}>
        <SidebarProvider defaultCollapsed={false}>
          <SidebarHeader>
            <Logo />
            <SidebarToggle className="ml-auto" />
          </SidebarHeader>
          <SidebarMain>
            <SidebarNav />
          </SidebarMain>
          <SidebarFooter>
            <div></div>
          </SidebarFooter>
        </SidebarProvider>
        <main className="pl-[280px] transition-[padding] duration-300">
          {children}
        </main>
      </body>
    </html>
  )
}
