"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  const pathname = usePathname()
  const link = (href: string, label: string) => (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium transition-colors",
        pathname === href ? "text-primary" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
    </Link>
  )
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="font-semibold text-lg">
          CollegePen
        </Link>
        <nav className="hidden gap-6 md:flex">
          {link("/", "Home")}
          {link("/colleges", "Colleges")}
          {link("/streams", "Streams")}
          {link("/courses", "Courses")}
          {link("/admin/dashboard", "Admin")}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild size="sm">
            <Link href="/colleges">Explore</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
