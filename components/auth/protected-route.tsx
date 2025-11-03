"use client"

import { type PropsWithChildren, useEffect, useState } from "react"
import { onAuthStateChanged, type User } from "firebase/auth"
import { useRouter, usePathname } from "next/navigation"
import { auth } from "@/lib/firebase"

export default function ProtectedRoute({ children }: PropsWithChildren) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
      const allowedEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL
      if (!u) {
        if (pathname !== "/login") router.replace("/login")
      } else if (allowedEmail && u.email !== allowedEmail) {
        auth.signOut().finally(() => router.replace("/login"))
      }
    })
    return () => unsub()
  }, [router, pathname])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    )
  }

  return <>{children}</>
}
