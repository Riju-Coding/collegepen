"use client"

import Link from "next/link"
import { useCourses } from "@/lib/data"
import { SiteHeader } from "@/components/frontend/site-header"
import { SiteFooter } from "@/components/frontend/site-footer"
import { BookOpen, GraduationCap, Loader2, Search, TrendingUp } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function CoursesPage() {
  const { data, loading } = useCourses()
  const [searchTerm, setSearchTerm] = useState("")

  // Filter courses based on search
  const filteredCourses = (data || []).filter((c: any) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.details?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Group courses by stream if streamId exists
  const groupedByStream: { [key: string]: any[] } = {}
  filteredCourses.forEach((course: any) => {
    const streamId = course.streamId || "other"
    if (!groupedByStream[streamId]) {
      groupedByStream[streamId] = []
    }
    groupedByStream[streamId].push(course)
  })

  return (
    <main className="flex flex-col min-h-screen bg-slate-50">
      <SiteHeader />

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-blue-600 to-indigo-700 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Explore All Courses
            </h1>
            <p className="text-blue-100 text-lg mb-8">
              Browse through our comprehensive list of courses and find the perfect program for your career goals
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search courses by name or description..."
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
                {loading ? "..." : data?.length || 0}
              </div>
              <div className="text-slate-600 text-sm">Total Courses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {loading ? "..." : Object.keys(groupedByStream).length}
              </div>
              <div className="text-slate-600 text-sm">Streams Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">500+</div>
              <div className="text-slate-600 text-sm">Partner Colleges</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">50K+</div>
              <div className="text-slate-600 text-sm">Students Enrolled</div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="w-full py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
              <span className="ml-3 text-slate-600 text-lg">Loading courses...</span>
            </div>
          ) : filteredCourses.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">
                    {searchTerm ? "Search Results" : "All Courses"}
                  </h2>
                  <p className="text-slate-600 mt-1">
                    Showing {filteredCourses.length} {filteredCourses.length === 1 ? "course" : "courses"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredCourses.map((c: any) => {
                  const slug = c.slug || c.nameSlug || c.name.toLowerCase().replace(/\s+/g, "-")
                  return (
                    <Link
                      key={c.id}
                      href={`/courses/${slug}`}
                      className="group bg-white border border-slate-200 hover:border-blue-300 rounded-2xl p-6 transition-all hover:shadow-xl hover:-translate-y-1"
                    >
                      <div className="flex flex-col h-full">
                        {/* Icon/Image */}
                        {c.icon ? (
                          <img
                            src={c.icon}
                            alt={c.name}
                            className="w-20 h-20 rounded-xl object-cover mb-4 group-hover:scale-110 transition-transform"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <BookOpen className="w-10 h-10 text-blue-600" />
                          </div>
                        )}

                        {/* Course Name */}
                        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {c.name}
                        </h3>

                        {/* Details */}
                        {c.details && (
                          <p className="text-sm text-slate-600 mb-3 line-clamp-2 flex-1">
                            {c.details}
                          </p>
                        )}

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mt-auto">
                          {c.eligibility && (
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg font-medium">
                              {c.eligibility}
                            </span>
                          )}
                          {c.duration && (
                            <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-lg font-medium">
                              {c.duration}
                            </span>
                          )}
                        </div>

                        {/* View Details Arrow */}
                        <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                          View Details
                          <svg
                            className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
              <Search className="w-20 h-20 text-slate-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-slate-900 mb-3">No Courses Found</h3>
              <p className="text-slate-600 mb-2">
                We couldn't find any courses matching "{searchTerm}"
              </p>
              <p className="text-slate-500 text-sm mb-6">Try adjusting your search terms</p>
              <Button onClick={() => setSearchTerm("")} variant="outline">
                Clear Search
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
              Can't Find Your Course?
            </h2>
            <p className="text-blue-100 text-lg mb-8">
              We're constantly adding new courses. Let us know what you're looking for and we'll help you find the right program.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                <Link href="/contact">Contact Us</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link href="/colleges">Browse Colleges</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}