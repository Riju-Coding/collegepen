"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { Search, Sparkles, TrendingUp, Award, Users, BookOpen, Loader2 } from "lucide-react"
import { collection, query, getDocs, limit } from "firebase/firestore"
import { db } from "@/lib/firebase" // Adjust this import path to your Firebase config

export function HomeHero() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [colleges, setColleges] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  // Firebase search
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setColleges([])
      setShowDropdown(false)
      return
    }

    setIsLoading(true)
    setShowDropdown(true)

    // Debounce the search
    const timer = setTimeout(async () => {
      try {
        const searchLower = searchQuery.toLowerCase()
        const collegesRef = collection(db, "colleges")
        
        // Get all colleges and filter client-side since Firebase doesn't support case-insensitive search
        const querySnapshot = await getDocs(query(collegesRef, limit(500)))
        
        const results = querySnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(college => 
            college.name?.toLowerCase().includes(searchLower)
          )
          .slice(0, 10) // Limit to 10 results

        setColleges(results)
      } catch (error) {
        console.error("Error searching colleges:", error)
        setColleges([])
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleCollegeClick = (college) => {
    const slug = college.slug || college.nameSlug || college.id
    router.push(`/${slug}`)
    setShowDropdown(false)
    setSearchQuery("")
  }

  const stats = [
    { icon: BookOpen, label: "Colleges", value: "500+" },
    { icon: Users, label: "Students Helped", value: "50K+" },
    { icon: TrendingUp, label: "Success Rate", value: "95%" },
    { icon: Award, label: "Top Ranked", value: "100+" },
  ]

  return (
    <section className="relative w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 left-10 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 right-1/3 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="flex flex-col items-center gap-10">
          {/* Hero Content */}
          <div className="max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-blue-200 shadow-lg shadow-blue-500/10 mb-6">
              <Sparkles size={18} className="text-blue-600" />
              <span className="text-sm font-semibold text-blue-600">India's Leading College Discovery Platform</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-tight mb-6">
              Find Your{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Perfect College
              </span>
            </h1>
            
            {/* Live Search Bar */}
            <div className="max-w-3xl mx-auto mb-8" ref={dropdownRef}>
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchQuery.length >= 2 && setShowDropdown(true)}
                    placeholder="Search colleges by name or location..."
                    className="w-full h-14 pl-12 pr-12 text-lg bg-white border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:outline-none shadow-xl transition-all"
                  />
                  {isLoading && (
                    <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600 animate-spin" size={20} />
                  )}
                </div>

                {/* Dropdown Results */}
                {showDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl max-h-96 overflow-y-auto z-50">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="animate-spin text-blue-600" size={24} />
                        <span className="ml-2 text-slate-600">Searching...</span>
                      </div>
                    ) : colleges.length > 0 ? (
                      <div className="py-2">
                        {colleges.map((college) => (
                          <button
                            key={college.id}
                            onClick={() => handleCollegeClick(college)}
                            className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center gap-3 group"
                          >
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center group-hover:from-blue-200 group-hover:to-indigo-200 transition-all">
                              <BookOpen className="text-blue-600" size={20} />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-slate-900">{college.name}</div>
                              {college.cityId && <div className="text-sm text-slate-600">City ID: {college.cityId}</div>}
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : searchQuery.trim().length >= 2 ? (
                      <div className="py-8 text-center text-slate-600">
                        No colleges found for "{searchQuery}"
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>

            {/* Stats
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-slate-200 shadow-lg">
                  <stat.icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </div>
              ))}
            </div> */}
          </div>
        </div>
      </div>
    </section>
  )
}