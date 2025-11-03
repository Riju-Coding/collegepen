"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { collection, getDocs, orderBy, query } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { SiteHeader } from "@/components/frontend/site-header"
import { SiteFooter } from "@/components/frontend/site-footer"
import { CollegeCard } from "@/components/frontend/college-card"
import { Search, Building2, Loader2, TrendingUp, Filter, MapPin, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

// Resolve a slug/name to a doc id from a collection's docs
function resolveIdBySlugOrName(list: any[], slugOrName?: string | null) {
  if (!slugOrName) return undefined
  const s = String(slugOrName).toLowerCase()
  const hit =
    list.find((x: any) => (x.slug || x.nameSlug)?.toLowerCase?.() === s) ||
    list.find((x: any) => x.name?.toLowerCase?.() === s)
  return hit?.id
}

export default function CollegesPage() {
  const sp = useSearchParams()
  const urlQuery = sp.get("q")
  const streamSlug = sp.get("stream")
  const courseSlug = sp.get("course")

  const [loading, setLoading] = useState(true)
  const [colleges, setColleges] = useState<any[]>([])
  const [streams, setStreams] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState(urlQuery || "")

  useEffect(() => {
    setSearchTerm(urlQuery || "")
  }, [urlQuery])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [colSnap, streamSnap, courseSnap] = await Promise.all([
          getDocs(query(collection(db, "colleges"), orderBy("name"))),
          getDocs(query(collection(db, "streams"), orderBy("name"))),
          getDocs(query(collection(db, "courses"), orderBy("name"))),
        ])
        const toDocs = (s: any) => s.docs.map((d: any) => ({ id: d.id, ...d.data() }))
        if (!cancelled) {
          setColleges(toDocs(colSnap))
          setStreams(toDocs(streamSnap))
          setCourses(toDocs(courseSnap))
          setLoading(false)
        }
      } catch (e) {
        console.log("Failed to load colleges page data", e)
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(() => {
    let out = [...colleges]
    // text search
    const q = searchTerm || urlQuery
    if (q) {
      const s = q.toLowerCase()
      out = out.filter((c) =>
        [c.name, c.cityName, c.stateName].filter(Boolean).some((v) => String(v).toLowerCase().includes(s)),
      )
    }
    // stream filter by resolving slug/name to id and checking array of stream ids
    if (streamSlug) {
      const streamId = resolveIdBySlugOrName(streams, streamSlug)
      if (streamId) {
        out = out.filter((c) => Array.isArray(c.streams) && c.streams.includes(streamId))
      }
    }
    // course filter by resolving slug/name to id and checking courses[].courseId
    if (courseSlug) {
      const courseId = resolveIdBySlugOrName(courses, courseSlug)
      if (courseId) {
        out = out.filter(
          (c) =>
            Array.isArray(c.courses) &&
            c.courses.some((entry: any) => entry?.courseId === courseId || entry === courseId),
        )
      }
    }
    return out
  }, [colleges, streams, courses, searchTerm, urlQuery, streamSlug, courseSlug])

  // Get active filter names
  const activeStream = useMemo(() => {
    if (!streamSlug) return null
    const streamId = resolveIdBySlugOrName(streams, streamSlug)
    return streams.find(s => s.id === streamId)
  }, [streamSlug, streams])

  const activeCourse = useMemo(() => {
    if (!courseSlug) return null
    const courseId = resolveIdBySlugOrName(courses, courseSlug)
    return courses.find(c => c.id === courseId)
  }, [courseSlug, courses])

  const hasFilters = urlQuery || streamSlug || courseSlug

  const clearFilters = () => {
    setSearchTerm("")
    window.location.href = "/colleges"
  }

  return (
    <main className="flex flex-col min-h-screen bg-slate-50">
      <SiteHeader />

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-blue-600 to-indigo-700 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Explore All Colleges
            </h1>
            <p className="text-blue-100 text-lg mb-8">
              Find and compare colleges across India to make the best choice for your future
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search colleges by name, city, or state..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-6 text-lg bg-white rounded-xl border-0 shadow-xl focus:ring-2 focus:ring-white/50"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full bg-white border-b border-slate-200 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {loading ? "..." : colleges.length}
              </div>
              <div className="text-slate-600 text-sm">Total Colleges</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {loading ? "..." : streams.length}
              </div>
              <div className="text-slate-600 text-sm">Streams</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {loading ? "..." : courses.length}
              </div>
              <div className="text-slate-600 text-sm">Courses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">50K+</div>
              <div className="text-slate-600 text-sm">Students Helped</div>
            </div>
          </div>
        </div>
      </section>

      {/* Active Filters */}
      {hasFilters && !loading && (
        <section className="w-full bg-blue-50 border-b border-blue-100 py-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-slate-700">Active Filters:</span>
              {activeStream && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-blue-200 text-sm">
                  <span className="font-medium text-slate-900">Stream:</span>
                  <span className="text-blue-600">{activeStream.name}</span>
                </div>
              )}
              {activeCourse && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-blue-200 text-sm">
                  <span className="font-medium text-slate-900">Course:</span>
                  <span className="text-blue-600">{activeCourse.name}</span>
                </div>
              )}
              {urlQuery && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-blue-200 text-sm">
                  <span className="font-medium text-slate-900">Search:</span>
                  <span className="text-blue-600">"{urlQuery}"</span>
                </div>
              )}
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700 transition-colors"
              >
                <X className="w-3 h-3" />
                Clear All
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Colleges Grid */}
      <section className="w-full py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
              <span className="ml-3 text-slate-600 text-lg">Loading colleges...</span>
            </div>
          ) : filtered.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">
                    {hasFilters ? "Search Results" : "All Colleges"}
                  </h2>
                  <p className="text-slate-600 mt-1">
                    Showing {filtered.length} {filtered.length === 1 ? "college" : "colleges"}
                  </p>
                </div>
                <Button variant="outline" className="hidden md:flex gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((c) => (
                  <CollegeCard key={c.id} college={c} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
              <MapPin className="w-20 h-20 text-slate-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-slate-900 mb-3">No Colleges Found</h3>
              <p className="text-slate-600 mb-2">
                We couldn't find any colleges matching your criteria
              </p>
              <p className="text-slate-500 text-sm mb-6">Try adjusting your search or filters</p>
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-gradient-to-br from-blue-600 to-indigo-700 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <TrendingUp className="w-12 h-12 text-white mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Need Help Choosing?
            </h2>
            <p className="text-blue-100 text-lg mb-8">
              Our expert counselors are here to help you find the perfect college that matches your goals and aspirations.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                <Link href="/contact">Get Free Counseling</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link href="/compare">Compare Colleges</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}