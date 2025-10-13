// components/layout/app-layout.tsx

"use client"
import { usePathname, useRouter } from "next/navigation"  
import { ReactNode } from "react"
import Link from "next/link"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger, SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Building2, Home, Plus, List, ChartLine, Bell, MessageSquare, Cloud, User, LogOut } from "lucide-react"
import useUserStore from "@/lib/store/userStore"
import { toastUtils, toastMessages } from "@/lib/utils/toast"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Add New Property", href: "/add-property", icon: Plus },
  { name: "View All Properties", href: "/all-properties", icon: List },
  { name: "Property Analytics", href: "/analytics", icon: ChartLine },
]


interface AppLayoutProps {
  children: ReactNode
  title?: string
  description?: string
}

export function AppLayout({ children, title = "Dashboard", description = "Manage your data here" }: AppLayoutProps) {
    const pathname = usePathname()
    const router = useRouter()
    const { user, logout } = useUserStore()

    const handleLogout = () => {
      logout()
      toastUtils.success(toastMessages.logoutSuccess)
      router.push("/")
    }
  return (
    <SidebarProvider>
      <Sidebar>
        {/* Sidebar Header */}
        <SidebarHeader className="border-b p-6">  {/* Increased padding for more space */}
  <Link href="/" className="flex items-center gap-4">  {/* Increased gap for more space between elements */}
    <div className="flex items-center justify-center rounded-lg bg-primary p-3"> {/* Bigger icon space */}
      <Building2 className="text-primary-foreground" size={30} />  {/* Adjusted size for better balance */}
    </div>
    <div className="flex flex-col">
      <span className="text-2xl font-semibold text-gray-800">BrokerPro</span> {/* Bigger title */}
      <span className="text-sm text-muted-foreground mt-1">Creative Suite</span> {/* Added margin for subtitle spacing */}
    </div>
  </Link>
</SidebarHeader>


        {/* Sidebar Menu */}
        <SidebarContent>
          <SidebarMenu>
            {navigation.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild isActive={pathname === item.href}>
                  <Link href={item.href} className="flex items-center gap-3 text-gray-700 hover:bg-gray-200 p-2 rounded-md">
                    <item.icon className="size-4" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        {/* Sidebar Footer */}
        <SidebarFooter className="border-t p-4">
          <div className="flex items-center gap-3">
            <Avatar className="size-8">
              <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                {user?.username?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-1 flex-col overflow-hidden">
              <span className="truncate text-sm font-medium text-gray-800">
                {user?.username || 'User'}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {user?.role || 'Broker'}
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="size-8"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>

      {/* Main Content with Optional Header */}
      <SidebarInset>
        <header className="sticky top-0 z-50 flex h-14 items-center justify-between gap-4 border-b bg-background/95 px-4 backdrop-blur-md">
          <SidebarTrigger />
          <div className="flex flex-1 items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
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
              <Button 
                variant="ghost" 
                size="icon" 
                className="size-8"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut className="size-4" />
                <span className="sr-only">Logout</span>
              </Button>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>  {/* Content section */}
      </SidebarInset>
    </SidebarProvider>
  )
}
