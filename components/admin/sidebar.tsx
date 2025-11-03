"use client"

import type * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { auth } from "@/lib/firebase"
import {
  LayoutDashboard,
  GraduationCap,
  Map,
  Building2,
  Layers,
  BookOpen,
  BriefcaseBusiness,
  ClipboardCheck,
  BadgeCheck,
  Link2,
  LogOut,
  MessageSquare,
} from "lucide-react"

const links = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "College Listing", href: "/admin/colleges", icon: GraduationCap },
  { label: "States", href: "/admin/states", icon: Map },
  { label: "Cities", href: "/admin/cities", icon: Building2 },
  { label: "Streams", href: "/admin/streams", icon: Layers },
  { label: "Courses", href: "/admin/courses", icon: BookOpen },
  { label: "Recruiters", href: "/admin/recruiters", icon: BriefcaseBusiness },
  { label: "Entrance Exams", href: "/admin/entrance-exams", icon: ClipboardCheck },
  { label: "Approvals", href: "/admin/approvals", icon: BadgeCheck },
  { label: "Affiliations", href: "/admin/affiliations", icon: Link2 },
   { label: "Enquiries", href: "/admin/enquiries", icon: MessageSquare },
]

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <SidebarProvider>
      <Sidebar className="border-r">
        <SidebarHeader className="px-3 py-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Admin</Badge>
            <span className="text-sm font-medium">CollegePen</span>
          </div>
        </SidebarHeader>

        <SidebarSeparator />

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {links.map(({ href, label, icon: Icon }) => {
                  const active = pathname?.startsWith(href)
                  return (
                    <SidebarMenuItem key={href}>
                      <SidebarMenuButton asChild isActive={!!active}>
                        <Link href={href} className="flex items-center gap-2">
                          <Icon className="size-4" />
                          <span>{label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="mt-auto">
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={() => auth.signOut()}>
            <LogOut className="size-4" />
            Sign out
          </Button>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="bg-background/80 border-b backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
          <div className="container mx-auto flex items-center justify-between p-3">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <span className="text-sm font-medium text-muted-foreground">Admin Panel</span>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-3 py-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
