"use client"

import type React from "react"
import ProtectedRoute from "@/components/auth/protected-route"
import SidebarLayout from "@/components/admin/sidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <SidebarLayout>{children}</SidebarLayout>
    </ProtectedRoute>
  )
}
