"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { collection, getDocs, orderBy, query } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { SiteHeader } from "@/components/frontend/site-header"
import { SiteFooter } from "@/components/frontend/site-footer"
import { CollegeCard } from "@/components/frontend/college-card"
import { Search, Building2, Loader2, TrendingUp, Filter, MapPin, X, ChevronDown, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"

export default function CollegesPage() {
  const sp = useSearchParams()
  const urlQuery = sp.get("q")

  const [loading, setLoading] = useState(true)
  const [colleges, setColleges] = useState<any[]>([])
  const [streams, setStreams] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [states, setStates] = useState<any[]>([])
  const [cities, setCities] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState(urlQuery || "")
  
  // Filter states
  const [selectedStreams, setSelectedStreams] = useState<string[]>([])
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [selectedStates, setSelectedStates] = useState<string[]>([])
  const [selectedCities, setSelectedCities] = useState<string[]>([])
  
  // Mobile filter drawer
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  
  // Accordion states
  const [expandedSections, setExpandedSections] = useState({
    streams: true,
    courses: true,
    states: true,
    cities: true,
  })

  useEffect(() => {
    setSearchTerm(urlQuery || "")
  }, [urlQuery])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [colSnap, streamSnap, courseSnap, stateSnap, citySnap] = await Promise.all([
          getDocs(query(collection(db, "colleges"), orderBy("name"))),
          getDocs(query(collection(db, "streams"), orderBy("name"))),
          getDocs(query(collection(db, "courses"), orderBy("name"))),
          getDocs(query(collection(db, "states"), orderBy("name"))),
          getDocs(query(collection(db, "cities"), orderBy("name"))),
        ])
        const toDocs = (s: any) => s.docs.map((d: any) => ({ id: d.id, ...d.data() }))
        if (!cancelled) {
          setColleges(toDocs(colSnap))
          setStreams(toDocs(streamSnap))
          setCourses(toDocs(courseSnap))
          setStates(toDocs(stateSnap))
          setCities(toDocs(citySnap))
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
    
    // Text search
    const q = searchTerm || urlQuery
    if (q) {
      const s = q.toLowerCase()
      out = out.filter((c) =>
        [c.name, c.cityName, c.stateName].filter(Boolean).some((v) => String(v).toLowerCase().includes(s)),
      )
    }
    
    // Stream filter
    if (selectedStreams.length > 0) {
      out = out.filter((c) => 
        Array.isArray(c.streams) && 
        c.streams.some((streamId: string) => selectedStreams.includes(streamId))
      )
    }
    
    // Course filter
    if (selectedCourses.length > 0) {
      out = out.filter((c) =>
        Array.isArray(c.courses) &&
        c.courses.some((entry: any) => 
          selectedCourses.includes(entry?.courseId || entry)
        )
      )
    }
    
    // State filter
    if (selectedStates.length > 0) {
      out = out.filter((c) => selectedStates.includes(c.stateId))
    }
    
    // City filter
    if (selectedCities.length > 0) {
      out = out.filter((c) => selectedCities.includes(c.cityId))
    }
    
    return out
  }, [colleges, searchTerm, urlQuery, selectedStreams, selectedCourses, selectedStates, selectedCities])

  // Available cities based on selected states
  const availableCities = useMemo(() => {
    if (selectedStates.length === 0) return cities
    return cities.filter(city => selectedStates.includes(city.stateId))
  }, [cities, selectedStates])

  const hasFilters = selectedStreams.length > 0 || selectedCourses.length > 0 || 
                     selectedStates.length > 0 || selectedCities.length > 0 || urlQuery

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedStreams([])
    setSelectedCourses([])
    setSelectedStates([])
    setSelectedCities([])
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const FilterSection = ({ 
    title, 
    items, 
    selectedItems, 
    onToggle, 
    section 
  }: { 
    title: string
    items: any[]
    selectedItems: string[]
    onToggle: (id: string) => void
    section: keyof typeof expandedSections
  }) => (
    <div className="border-b border-slate-200 pb-4">
      <button
        onClick={() => toggleSection(section)}
        className="w-full flex items-center justify-between py-3 text-left"
      >
        <h3 className="font-semibold text-slate-900">{title}</h3>
        <ChevronDown 
          className={`w-5 h-5 text-slate-400 transition-transform ${
            expandedSections[section] ? 'rotate-180' : ''
          }`}
        />
      </button>
      
      {expandedSections[section] && (
        <div className="space-y-3 mt-2 max-h-64 overflow-y-auto">
          {items.map((item) => (
            <label
              key={item.id}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <Checkbox
                checked={selectedItems.includes(item.id)}
                onCheckedChange={() => onToggle(item.id)}
                className="border-slate-300"
              />
              <span className="text-sm text-slate-700 group-hover:text-slate-900">
                {item.name}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  )

  const FiltersContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5" />
          Filters
        </h2>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Active Filters Count */}
      {hasFilters && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">
              {selectedStreams.length + selectedCourses.length + selectedStates.length + selectedCities.length}
            </span>
            {' '}filters active
          </p>
        </div>
      )}

      <FilterSection
        title="Streams"
        items={streams}
        selectedItems={selectedStreams}
        onToggle={(id) => setSelectedStreams(prev => 
          prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        )}
        section="streams"
      />

      <FilterSection
        title="Courses"
        items={courses}
        selectedItems={selectedCourses}
        onToggle={(id) => setSelectedCourses(prev => 
          prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        )}
        section="courses"
      />

      <FilterSection
        title="States"
        items={states}
        selectedItems={selectedStates}
        onToggle={(id) => {
          setSelectedStates(prev => {
            const newStates = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
            // Clear city selections if state is deselected
            if (!newStates.includes(id)) {
              setSelectedCities(curr => 
                curr.filter(cityId => {
                  const city = cities.find(c => c.id === cityId)
                  return city && newStates.includes(city.stateId)
                })
              )
            }
            return newStates
          })
        }}
        section="states"
      />

      <FilterSection
        title="Cities"
        items={availableCities}
        selectedItems={selectedCities}
        onToggle={(id) => setSelectedCities(prev => 
          prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        )}
        section="cities"
      />
    </div>
  )

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
            <div className="relative max-w-2xl mx-auto mb-12">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search colleges by name, city, or state..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-6 text-lg bg-white rounded-xl border-0 shadow-xl focus:ring-2 focus:ring-white/50"
              />
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-4 text-center">
                <div className="text-3xl font-bold text-white mb-1">
                  {loading ? "..." : colleges.length}
                </div>
                <div className="text-blue-100 text-sm">Total Colleges</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-4 text-center">
                <div className="text-3xl font-bold text-white mb-1">
                  {loading ? "..." : streams.length}
                </div>
                <div className="text-blue-100 text-sm">Streams</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-4 text-center">
                <div className="text-3xl font-bold text-white mb-1">
                  {loading ? "..." : courses.length}
                </div>
                <div className="text-blue-100 text-sm">Courses</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-4 text-center">
                <div className="text-3xl font-bold text-white mb-1">50K+</div>
                <div className="text-blue-100 text-sm">Students Helped</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content with Filters */}
      <section className="w-full py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {/* Desktop Filters Sidebar */}
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-24 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-h-[calc(100vh-120px)] overflow-y-auto">
                <FiltersContent />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                  <span className="ml-3 text-slate-600 text-lg">Loading colleges...</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">
                        {hasFilters ? "Filtered Results" : "All Colleges"}
                      </h2>
                      <p className="text-slate-600 mt-1">
                        Showing {filtered.length} {filtered.length === 1 ? 'college' : 'colleges'}
                      </p>
                    </div>
                    
                    {/* Mobile Filter Button */}
                    <Button 
                      onClick={() => setShowMobileFilters(true)}
                      className="lg:hidden flex items-center gap-2"
                    >
                      <Filter className="w-4 h-4" />
                      Filters
                      {hasFilters && (
                        <span className="bg-white text-blue-600 px-2 py-0.5 rounded-full text-xs font-bold">
                          {selectedStreams.length + selectedCourses.length + selectedStates.length + selectedCities.length}
                        </span>
                      )}
                    </Button>
                  </div>

                  {filtered.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                      {filtered.map((c) => (
                        <CollegeCard key={c.id} college={c} />
                      ))}
                    </div>
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
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Filter Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowMobileFilters(false)}
          />
          
          {/* Drawer */}
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl animate-in slide-in-from-right">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-900">Filters</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <FiltersContent />
              </div>
              
              {/* Footer */}
              <div className="p-6 border-t border-slate-200 bg-slate-50">
                <Button 
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full"
                  size="lg"
                >
                  View {filtered.length} Colleges
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

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