"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { SiteHeader } from "@/components/frontend/site-header"
import { SiteFooter } from "@/components/frontend/site-footer"
import { CollegeCard } from "@/components/frontend/college-card"
import { Layers, Loader2, Filter, MapPin, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

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

function getStreamIcon(name: string): string {
  const lowerName = name.toLowerCase()
  for (const [key, icon] of Object.entries(streamIcons)) {
    if (lowerName.includes(key)) return icon
  }
  return streamIcons.default
}

export default function StreamPage() {
  const params = useParams()
  const slug = params.slug as string

  const [stream, setStream] = useState<any>(null)
  const [colleges, setColleges] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [collegesLoading, setCollegesLoading] = useState(true)
  const [coursesLoading, setCoursesLoading] = useState(true)

  // Fetch stream details
  useEffect(() => {
    const fetchStream = async () => {
      try {
        const streamsSnap = await getDocs(collection(db, "streams"))
        const foundStream = streamsSnap.docs.find((doc) => {
          const data = doc.data()
          const streamSlug = data.slug || data.nameSlug || data.name.toLowerCase().replace(/\s+/g, "-")
          return streamSlug === slug
        })

        if (foundStream) {
          setStream({ id: foundStream.id, ...foundStream.data() })
        }
        setLoading(false)
      } catch (error) {
        console.error("Error fetching stream:", error)
        setLoading(false)
      }
    }

    fetchStream()
  }, [slug])

  // Fetch colleges offering this stream
  useEffect(() => {
    if (!stream) return

    const fetchColleges = async () => {
      setCollegesLoading(true)
      try {
        const collegesSnap = await getDocs(collection(db, "colleges"))
        
        const filteredColleges = collegesSnap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter((college: any) => {
            if (college.streams && Array.isArray(college.streams)) {
              return college.streams.includes(stream.id)
            }
            return false
          })

        console.log("Stream ID:", stream.id)
        console.log("Filtered Colleges:", filteredColleges)
        
        setColleges(filteredColleges)
      } catch (error) {
        console.error("Error fetching colleges:", error)
        setColleges([])
      } finally {
        setCollegesLoading(false)
      }
    }

    fetchColleges()
  }, [stream])

  // Fetch courses in this stream
  useEffect(() => {
    if (!stream) return

    const fetchCourses = async () => {
      setCoursesLoading(true)
      try {
        const coursesSnap = await getDocs(
          query(collection(db, "courses"), where("streamId", "==", stream.id))
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
  }, [stream])

  if (loading) {
    return (
      <main className="flex flex-col min-h-screen bg-slate-50">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        </div>
        <SiteFooter />
      </main>
    )
  }

  if (!stream) {
    return (
      <main className="flex flex-col min-h-screen bg-slate-50">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="text-center">
            <Layers className="w-20 h-20 text-slate-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-slate-900 mb-3">Stream Not Found</h1>
            <p className="text-slate-600 mb-6">The stream you're looking for doesn't exist.</p>
            <Button asChild>
              <Link href="/streams">Browse All Streams</Link>
            </Button>
          </div>
        </div>
        <SiteFooter />
      </main>
    )
  }

  return (
    <main className="flex flex-col min-h-screen bg-slate-50">
      <SiteHeader />

      {/* Stream Header */}
      <section className="w-full bg-gradient-to-br from-blue-600 to-indigo-700 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-6">
            {stream.icon ? (
              <img
                src={stream.icon}
                alt={stream.name}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-white/20 shadow-xl"
              />
            ) : (
              <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border-4 border-white/20">
                <div className="text-5xl">{getStreamIcon(stream.name)}</div>
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                {stream.name}
              </h1>
              {stream.details && (
                <p className="text-blue-100 text-lg mb-4">{stream.details}</p>
              )}
              <div className="flex flex-wrap gap-3">
                {stream.collegeCount !== undefined && (
                  <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                    <span className="text-white font-medium">{stream.collegeCount} Colleges</span>
                  </div>
                )}
                {courses.length > 0 && (
                  <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                    <span className="text-white font-medium">{courses.length} Courses</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses in this Stream */}
      {!coursesLoading && courses.length > 0 && (
        <section className="w-full bg-white py-16 border-b border-slate-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Courses in {stream.name}
              </h2>
              <p className="text-slate-600">{courses.length} courses available</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {courses.map((course) => {
                const courseSlug = course.slug || course.nameSlug || course.name.toLowerCase().replace(/\s+/g, "-")
                return (
                  <Link
                    key={course.id}
                    href={`/courses/${courseSlug}`}
                    className="group bg-slate-50 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 border border-slate-200 hover:border-blue-300 rounded-xl p-4 transition-all hover:shadow-lg hover:-translate-y-1"
                  >
                    <div className="flex flex-col items-center text-center">
                      {course.icon ? (
                        <img
                          src={course.icon}
                          alt={course.name}
                          className="w-12 h-12 rounded-lg object-cover mb-2 group-hover:scale-110 transition-transform"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                          <BookOpen className="w-6 h-6 text-blue-600" />
                        </div>
                      )}
                      <h4 className="font-bold text-slate-900 text-sm line-clamp-2">
                        {course.name}
                      </h4>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Colleges List */}
      <section className="w-full py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Colleges Offering {stream.name}
              </h2>
              {!collegesLoading && (
                <p className="text-slate-600">
                  Found {colleges.length} {colleges.length === 1 ? 'college' : 'colleges'}
                </p>
              )}
            </div>
            <Button variant="outline" className="hidden md:flex gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>

          {collegesLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse">
                  <div className="w-full h-40 bg-slate-200 rounded-xl mb-4" />
                  <div className="h-6 bg-slate-200 rounded mb-2" />
                  <div className="h-4 bg-slate-200 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : colleges.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {colleges.map((college) => (
                <CollegeCard key={college.id} college={college} />
              ))}
            </div>
          ) : (
            <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-slate-200">
              <MapPin className="w-20 h-20 text-slate-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-slate-900 mb-3">No Colleges Found</h3>
              <p className="text-slate-600 mb-2">
                We couldn't find any colleges offering {stream.name} yet.
              </p>
              <p className="text-slate-500 text-sm">Check back soon or browse other streams!</p>
              <div className="mt-6">
                <Button asChild>
                  <Link href="/streams">Browse All Streams</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Stream Description (if available) */}
      {stream.description && (
        <section className="w-full bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">About {stream.name}</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 text-lg leading-relaxed">{stream.description}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      <SiteFooter />
    </main>
  )
}