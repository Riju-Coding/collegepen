"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GraduationCap, Menu, X } from "lucide-react"
import { useState } from "react"

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 font-bold text-xl text-slate-900 hover:text-blue-600 transition-colors"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <GraduationCap size={22} className="text-white" />
          </div>
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            CollegePen
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            href="/colleges"
          >
            Colleges
          </Link>
          <Link
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            href="/streams"
          >
            Streams
          </Link>
          <Link
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            href="/courses"
          >
            Courses
          </Link>
          <Link
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            href="/compare"
          >
            Compare
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button asChild variant="ghost" size="sm" className="text-slate-700 hover:text-blue-600 hover:bg-blue-50">
            <Link href="/admin/dashboard">Admin</Link>
          </Button>
          <Button asChild size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30">
            <Link href="/colleges">Explore Colleges</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <nav className="flex flex-col p-4 space-y-1">
            <Link
              className="px-4 py-3 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              href="/colleges"
              onClick={() => setMobileMenuOpen(false)}
            >
              Colleges
            </Link>
            <Link
              className="px-4 py-3 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              href="/streams"
              onClick={() => setMobileMenuOpen(false)}
            >
              Streams
            </Link>
            <Link
              className="px-4 py-3 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              href="/courses"
              onClick={() => setMobileMenuOpen(false)}
            >
              Courses
            </Link>
            <Link
              className="px-4 py-3 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              href="/compare"
              onClick={() => setMobileMenuOpen(false)}
            >
              Compare
            </Link>
            <Link
              className="px-4 py-3 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              href="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
            >
              Admin
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}