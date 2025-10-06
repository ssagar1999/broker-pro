// components/layout/app-layout.tsx

"use client"
import { usePathname } from "next/navigation"  
import { ReactNode } from "react"
import Link from "next/link"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger, SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Building2, Home, Plus, List, Settings, Bell, MessageSquare, Cloud, User } from "lucide-react"

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Add Data", href: "/add", icon: Plus },
  { name: "View Data", href: "/list", icon: List },
]

interface AppLayoutProps {
  children: ReactNode
  title?: string
  description?: string
}

export function AppLayout({ children, title = "Dashboard", description = "Manage your data here" }: AppLayoutProps) {
    const pathname = usePathname()
  return (
    <SidebarProvider>
      <Sidebar>
        {/* Sidebar Header */}
        <SidebarHeader className="border-b p-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center rounded-lg bg-primary p-2">
              <Building2 className="text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">BrokerPro</span>
              <span className="text-xs text-muted-foreground">Creative Suite</span>
            </div>
          </Link>
        </SidebarHeader>

        {/* Sidebar Menu */}
        <SidebarContent>
          <SidebarMenu>
            {navigation.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild isActive={pathname === item.href}>
                  <Link href={item.href}>
                    <item.icon className="size-4" />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        {/* Sidebar Footer */}
        <SidebarFooter className="border-t p-4">
          <div className="flex items-center gap-2">
            <Avatar className="size-8">
              <AvatarFallback className="bg-primary text-xs text-primary-foreground">DU</AvatarFallback>
            </Avatar>
            <div className="flex flex-1 flex-col overflow-hidden">
              <span className="truncate text-sm font-medium">Demo User</span>
              <span className="truncate text-xs text-muted-foreground">Pro</span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      {/* Main Content with Optional Header */}
      <SidebarInset>
        <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur">
          <SidebarTrigger />
          <div className="flex flex-1 items-center justify-between">
            <h1 className="text-lg font-semibold">{title}</h1>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="size-8">
                <Cloud className="size-4" />
                <span className="sr-only">Cloud sync</span>
              </Button>
              <Button variant="ghost" size="icon" className="size-8">
                <MessageSquare className="size-4" />
                <span className="sr-only">Messages</span>
              </Button>
              <Button variant="ghost" size="icon" className="relative size-8">
                <Bell className="size-4" />
                <span className="absolute top-1 right-1 flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-destructive opacity-75"></span>
                  <span className="relative inline-flex size-2 rounded-full bg-destructive"></span>
                </span>
                <span className="sr-only">Notifications</span>
              </Button>
              <Button variant="ghost" size="icon" className="size-8">
                <User className="size-4" />
                <span className="sr-only">Profile</span>
              </Button>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>  {/* Content section */}
      </SidebarInset>
    </SidebarProvider>
  )
}
