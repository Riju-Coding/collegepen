"use client"

import Link from "next/link"
import { useStreams } from "@/lib/data"
import { SiteHeader } from "@/components/frontend/site-header"
import { SiteFooter } from "@/components/frontend/site-footer"
import { Search, TrendingUp, Layers, Loader2 } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const streamIcons: Record<string, string> = {
  engineering: "⚙️",
  medical: "🏥",
  management: "💼",
  "arts & science": "🎨",
  arts: "🎨",
  science: "🔬",
  law: "⚖️",
  design: "✨",
  commerce: "💰",
  pharmacy: "💊",
  agriculture: "🌾",
  architecture: "🏛️",
  education: "📚",
  nursing: "👩‍⚕️",
  hospitality: "🏨",
  "hotel management": "🏨",
  journalism: "📰",
  fashion: "👗",
  aviation: "✈️",
  default: "🎓"
}

const streamColors = [
  "from-blue-500 to-cyan-500",
  "from-purple-500 to-pink-500",
  "from-orange-500 to-red-500",
  "from-green-500 to-emerald-500",
  "from-indigo-500 to-blue-500",
  "from-rose-500 to-pink-500",
  "from-amber-500 to-orange-500",
  "from-teal-500 to-cyan-500"
]

function getStreamIcon(name: string): string {
  const lowerName = name.toLowerCase()
  for (const [key, icon] of Object.entries(streamIcons)) {
    if (lowerName.includes(key)) return icon
  }
  return streamIcons.default
}

export default function StreamsPage() {
  const { data, loading } = useStreams()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredStreams = (data || []).filter((s: any) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.details?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <main className="flex flex-col min-h-screen bg-slate-50">
      <SiteHeader />

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-blue-600 to-indigo-700 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <Layers className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Explore All Streams
            </h1>
            <p className="text-blue-100 text-lg mb-8">
              Discover colleges across various fields of study and find the perfect stream for your career goals
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search streams..."
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
              <div className="text-slate-600 text-sm">Total Streams</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">500+</div>
              <div className="text-slate-600 text-sm">Partner Colleges</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">1000+</div>
              <div className="text-slate-600 text-sm">Courses Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">50K+</div>
              <div className="text-slate-600 text-sm">Students Enrolled</div>
            </div>
          </div>
        </div>
      </section>

      {/* Streams Grid */}
      <section className="w-full py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
              <span className="ml-3 text-slate-600 text-lg">Loading streams...</span>
            </div>
          ) : filteredStreams.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">
                    {searchTerm ? "Search Results" : "All Streams"}
                  </h2>
                  <p className="text-slate-600 mt-1">
                    Showing {filteredStreams.length} {filteredStreams.length === 1 ? "stream" : "streams"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredStreams.map((s: any, index: number) => {
                  const slug = s.slug || s.nameSlug || s.name.toLowerCase().replace(/\s+/g, "-")
                  const colorClass = streamColors[index % streamColors.length]
                  
                  return (
                    <Link
                      key={s.id}
                      href={`/streams/${slug}`}
                      className="group bg-white border border-slate-200 hover:border-blue-300 rounded-2xl p-6 transition-all hover:shadow-xl hover:-translate-y-1"
                    >
                      <div className="flex flex-col h-full">
                        {/* Icon */}
                        {s.icon ? (
                          <img
                            src={s.icon}
                            alt={s.name}
                            className="w-20 h-20 rounded-xl object-cover mb-4 group-hover:scale-110 transition-transform"
                          />
                        ) : (
                          <div className={`w-20 h-20 bg-gradient-to-br ${colorClass} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            <div className="text-4xl">{getStreamIcon(s.name)}</div>
                          </div>
                        )}

                        {/* Stream Name */}
                        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {s.name}
                        </h3>

                        {/* Details */}
                        {s.details && (
                          <p className="text-sm text-slate-600 mb-3 line-clamp-2 flex-1">
                            {s.details}
                          </p>
                        )}

                        {/* College Count */}
                        {s.collegeCount !== undefined && (
                          <div className="mb-3">
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg font-medium">
                              {s.collegeCount} {s.collegeCount === 1 ? 'college' : 'colleges'}
                            </span>
                          </div>
                        )}

                        {/* View Details Arrow */}
                        <div className="mt-auto flex items-center text-blue-600 text-sm font-medium">
                          Explore Colleges
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
              <h3 className="text-2xl font-bold text-slate-900 mb-3">No Streams Found</h3>
              <p className="text-slate-600 mb-2">
                We couldn't find any streams matching "{searchTerm}"
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
              Can't Find Your Stream?
            </h2>
            <p className="text-blue-100 text-lg mb-8">
              We're constantly adding new streams and colleges. Let us know what you're looking for and we'll help you find the right path.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                <Link href="/contact">Contact Us</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link href="/courses">Browse Courses</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}