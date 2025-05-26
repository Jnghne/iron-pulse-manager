import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import { cn } from "@/lib/utils"
import { SidebarProvider, SidebarHeader, SidebarMain, SidebarFooter, SidebarToggle } from "@/components/ui/sidebar"
import { SidebarNav } from "@/components/ui/sidebar-nav"
import Logo from "@/components/ui/logo"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "IronPulse Manager",
  description: "A modern gym management system",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "min-h-screen bg-background")}>
        <SidebarProvider defaultCollapsed={false}>
          <SidebarHeader>
            <Logo />
            <SidebarToggle className="ml-auto" />
          </SidebarHeader>
          <SidebarMain>
            <SidebarNav />
          </SidebarMain>
          <SidebarFooter>
            {/* Add footer content here */}
          </SidebarFooter>
        </SidebarProvider>
        <main className="pl-[280px] transition-[padding] duration-300">
          {children}
        </main>
      </body>
    </html>
  )
}
