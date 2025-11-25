"use client"

import { useEffect, useState } from "react"
import { collection, getDocs, orderBy, query, limit, where } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { SiteHeader } from "@/components/frontend/site-header"
import { HomeHero } from "@/components/frontend/home-hero"
import { CollegeCard } from "@/components/frontend/college-card"
import { SiteFooter } from "@/components/frontend/site-footer"
import { Sparkles, TrendingUp, Award, Users, BookOpen, CheckCircle, Star, MapPin, Building2, GraduationCap, Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const [featured, setFeatured] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Featured Courses Section State
  const [streams, setStreams] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [selectedStream, setSelectedStream] = useState<string | null>(null)
  const [streamsLoading, setStreamsLoading] = useState(true)
  const [coursesLoading, setCoursesLoading] = useState(false)
  
  // Popular Streams State
  const [popularStreams, setPopularStreams] = useState<any[]>([])
  const [popularStreamsLoading, setPopularStreamsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        // Query only colleges where featured === true
        const snap = await getDocs(
          query(
            collection(db, "colleges"), 
            where("featured", "==", true),
            orderBy("name"), 
            limit(8)
          )
        )
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        if (!cancelled) {
          setFeatured(docs)
          setLoading(false)
        }
      } catch (e) {
        console.log("Failed to load featured colleges", e)
        setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  // Fetch all streams
  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const streamsSnap = await getDocs(collection(db, "streams"))
        const streamsData = streamsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setStreams(streamsData)
        
        // Also set popular streams (same data)
        setPopularStreams(streamsData)
        setPopularStreamsLoading(false)
        
        // Select first stream by default
        if (streamsData.length > 0) {
          setSelectedStream(streamsData[0].id)
        }
        setStreamsLoading(false)
      } catch (error) {
        console.error("Error fetching streams:", error)
        setStreamsLoading(false)
        setPopularStreamsLoading(false)
      }
    }

    fetchStreams()
  }, [])

  // Fetch courses when stream changes
  useEffect(() => {
    if (!selectedStream) return

    const fetchCourses = async () => {
      setCoursesLoading(true)
      try {
        const coursesSnap = await getDocs(
          query(collection(db, "courses"), where("streamId", "==", selectedStream))
        )
        const coursesData = coursesSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setCourses(coursesData)
      } catch (error) {
        console.error("Error fetching courses:", error)
        setCourses([])
      } finally {
        setCoursesLoading(false)
      }
    }

    fetchCourses()
  }, [selectedStream])

  const features = [
    {
      icon: Building2,
      title: "500+ Colleges",
      description: "Browse through thousands of verified colleges across India with detailed information",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Star,
      title: "Authentic Reviews",
      description: "Read genuine reviews from current students and alumni to make informed decisions",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: TrendingUp,
      title: "Compare Colleges",
      description: "Side-by-side comparison of colleges based on rankings, fees, placements, and more",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: GraduationCap,
      title: "Quick Apply",
      description: "Apply to multiple colleges with a single application form and track your status",
      color: "from-green-500 to-emerald-500"
    }
  ]

  const whyChooseUs = [
    "Comprehensive database of colleges across India",
    "Verified information and authentic student reviews",
    "Free admission guidance and career counselling",
    "Easy college comparison and shortlisting",
    "Regular updates on admissions and scholarships",
    "24/7 customer support for all your queries"
  ]

  return (
    <main className="flex flex-col min-h-screen bg-slate-50">
      <SiteHeader />
      <HomeHero />

      {/* Popular Streams */}
      <section className="w-full bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Popular Streams</h2>
            <p className="text-lg text-slate-600">Explore colleges by your field of interest</p>
          </div>
          {popularStreamsLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : popularStreams.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {popularStreams.map((stream) => (
                <Link
                  key={stream.id}
                  href={`/colleges?stream=${stream.name.toLowerCase()}`}
                  className="group bg-slate-50 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 border border-slate-200 hover:border-blue-300 rounded-2xl p-6 text-center transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  {stream.icon ? (
                    <img
                      src={stream.icon}
                      alt={stream.name}
                      className="w-16 h-16 mx-auto mb-3 rounded-lg object-cover group-hover:scale-110 transition-transform"
                    />
                  ) : (
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📚</div>
                  )}
                  <h3 className="font-bold text-slate-900 mb-1">{stream.name}</h3>
                  {stream.details && (
                    <p className="text-sm text-slate-600">{stream.details}</p>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">No streams available yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="w-full bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <GraduationCap size={20} className="text-white" />
              </div>
              <h2 className="text-4xl font-bold text-slate-900">Browse Courses by Stream</h2>
            </div>
            <p className="text-lg text-slate-600">Select a stream to explore available courses</p>
          </div>

          {streamsLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Side - Streams */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg lg:sticky lg:top-4">
                  <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600">
                    <h3 className="text-lg font-bold text-white">Streams</h3>
                  </div>
                  <div className="divide-y divide-slate-200 max-h-[600px] overflow-y-auto">
                    {streams.map((stream) => (
                      <button
                        key={stream.id}
                        onClick={() => setSelectedStream(stream.id)}
                        className={`w-full px-4 py-4 text-left transition-all hover:bg-blue-50 ${
                          selectedStream === stream.id
                            ? "bg-blue-50 border-l-4 border-blue-600"
                            : "border-l-4 border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {stream.icon && (
                            <img
                              src={stream.icon}
                              alt={stream.name}
                              className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div
                              className={`font-semibold truncate ${
                                selectedStream === stream.id ? "text-blue-600" : "text-slate-900"
                              }`}
                            >
                              {stream.name}
                            </div>
                            {stream.details && (
                              <div className="text-xs text-slate-600 mt-0.5 truncate">{stream.details}</div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side - Courses */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-lg min-h-[400px]">
                  {coursesLoading ? (
                    <div className="flex items-center justify-center py-16">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                      <span className="ml-3 text-slate-600">Loading courses...</span>
                    </div>
                  ) : courses.length > 0 ? (
                    <>
                      <div className="mb-6">
                        <h3 className="text-2xl font-bold text-slate-900">
                          {streams.find(s => s.id === selectedStream)?.name} Courses
                        </h3>
                        <p className="text-slate-600 mt-1">{courses.length} courses available</p>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                        {courses.map((course) => {
                          const slug = course.slug || course.nameSlug || course.name.toLowerCase().replace(/\s+/g, "-")
                          return (
                            <Link
                              key={course.id}
                              href={`/courses/${slug}`}
                              className="group bg-slate-50 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 border border-slate-200 hover:border-blue-300 rounded-xl p-4 transition-all hover:shadow-lg hover:-translate-y-1"
                            >
                              <div className="flex flex-col items-center text-center">
                                {course.icon ? (
                                  <img
                                    src={course.icon}
                                    alt={course.name}
                                    className="w-16 h-16 rounded-lg object-cover mb-3 group-hover:scale-110 transition-transform"
                                  />
                                ) : (
                                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <BookOpen className="w-8 h-8 text-blue-600" />
                                  </div>
                                )}
                                <h4 className="font-bold text-slate-900 mb-1 line-clamp-2 text-sm">
                                  {course.name}
                                </h4>
                                {course.details && (
                                  <p className="text-xs text-slate-600 line-clamp-1">{course.details}</p>
                                )}
                                {course.eligibility && (
                                  <div className="mt-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                    {course.eligibility}
                                  </div>
                                )}
                              </div>
                            </Link>
                          )
                        })}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16">
                      <BookOpen className="w-16 h-16 text-slate-300 mb-4" />
                      <p className="text-slate-500 text-lg">No courses available for this stream</p>
                      <p className="text-slate-400 text-sm mt-2">Check back soon for updates!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Featured Colleges Section */}
      <section className="w-full bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                  <Sparkles size={20} className="text-white" />
                </div>
                <h2 className="text-4xl font-bold text-slate-900">Featured Colleges</h2>
              </div>
              <p className="text-slate-600 text-lg">Explore top-rated institutions across India</p>
            </div>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hidden md:flex">
              <Link href="/colleges">View All Colleges</Link>
            </Button>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse">
                  <div className="w-full h-40 bg-slate-200 rounded-xl mb-4" />
                  <div className="h-6 bg-slate-200 rounded mb-2" />
                  <div className="h-4 bg-slate-200 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {featured.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {featured.map((c) => (
                    <CollegeCard key={c.id} college={c} />
                  ))}
                </div>
              ) : (
                <div className="col-span-full text-center py-16 bg-slate-50 rounded-2xl border border-slate-200">
                  <Sparkles className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 text-lg">No featured colleges available yet.</p>
                  <p className="text-slate-400 text-sm mt-2">Check back soon for updates!</p>
                </div>
              )}
            </>
          )}

          {featured.length > 0 && (
            <div className="mt-8 text-center md:hidden">
              <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Link href="/colleges">View All Colleges</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Why Choose CollegePen?</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Everything you need to find and apply to your dream college, all in one place
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group relative bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="w-full bg-gradient-to-br from-blue-600 to-indigo-700 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Your Trusted Partner in College Selection
              </h2>
              <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                We understand that choosing the right college is one of the most important decisions in your life. That's why we've created a comprehensive platform to help you make informed choices.
              </p>
              <div className="space-y-4">
                {whyChooseUs.map((point, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                    <p className="text-white">{point}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  <Link href="/about">Learn More About Us</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <Users className="w-10 h-10 text-white mb-3" />
                    <div className="text-3xl font-bold text-white mb-1">50K+</div>
                    <div className="text-blue-100 text-sm">Students Helped</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <Building2 className="w-10 h-10 text-white mb-3" />
                    <div className="text-3xl font-bold text-white mb-1">500+</div>
                    <div className="text-blue-100 text-sm">Partner Colleges</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <Award className="w-10 h-10 text-white mb-3" />
                    <div className="text-3xl font-bold text-white mb-1">95%</div>
                    <div className="text-blue-100 text-sm">Success Rate</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <Star className="w-10 h-10 text-white mb-3" />
                    <div className="text-3xl font-bold text-white mb-1">4.8/5</div>
                    <div className="text-blue-100 text-sm">User Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}