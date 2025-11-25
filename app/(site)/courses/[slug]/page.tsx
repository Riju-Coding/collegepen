"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { SiteHeader } from "@/components/frontend/site-header"
import { SiteFooter } from "@/components/frontend/site-footer"
import { CollegeCard } from "@/components/frontend/college-card"
import { BookOpen, Loader2, GraduationCap, Filter, MapPin, ArrowRight, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CoursePage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [course, setCourse] = useState<any>(null)
  const [colleges, setColleges] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [collegesLoading, setCollegesLoading] = useState(true)

  // Fetch course details
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        // Try to find course by slug, nameSlug, or name
        const coursesSnap = await getDocs(collection(db, "courses"))
        const foundCourse = coursesSnap.docs.find((doc) => {
          const data = doc.data()
          const courseSlug = data.slug || data.nameSlug || data.name.toLowerCase().replace(/\s+/g, "-")
          return courseSlug === slug
        })

        if (foundCourse) {
          setCourse({ id: foundCourse.id, ...foundCourse.data() })
        }
        setLoading(false)
      } catch (error) {
        console.error("Error fetching course:", error)
        setLoading(false)
      }
    }

    fetchCourse()
  }, [slug])

  // Fetch colleges offering this course
  useEffect(() => {
    if (!course) return

    const fetchColleges = async () => {
      setCollegesLoading(true)
      try {
        // Fetch all colleges
        const collegesSnap = await getDocs(collection(db, "colleges"))
        
        // Filter colleges that offer this course
        const filteredColleges = collegesSnap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter((college: any) => {
            // Check if college has courses array with courseId matching our course.id
            if (college.courses && Array.isArray(college.courses)) {
              return college.courses.some((c: any) => 
                c.courseId === course.id
              )
            }
            return false
          })

        console.log("Course ID:", course.id)
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
  }, [course])

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

  if (!course) {
    return (
      <main className="flex flex-col min-h-screen bg-slate-50">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="text-center">
            <BookOpen className="w-20 h-20 text-slate-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-slate-900 mb-3">Course Not Found</h1>
            <p className="text-slate-600 mb-6">The course you're looking for doesn't exist.</p>
            <Button asChild>
              <a href="/courses">Browse All Courses</a>
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

      {/* Course Header */}
      <section className="w-full bg-gradient-to-br from-blue-600 to-indigo-700 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-6">
            {course.icon ? (
              <img
                src={course.icon}
                alt={course.name}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-white/20 shadow-xl"
              />
            ) : (
              <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border-4 border-white/20">
                <GraduationCap className="w-12 h-12 text-white" />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center justify-between gap-6 mb-3">
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  {course.name}
                </h1>
                
                {/* Action Buttons */}
                <div className="hidden md:flex items-center gap-3">
                  <Link href={`/courses/${slug}/details`}>
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg">
                      <BookOpen className="w-5 h-5 mr-2" />
                      Explore Program
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm"
                    onClick={() => {
                      // You can add consultation logic here or link to a contact form
                      window.location.href = '/contact?type=consultation'
                    }}
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Get Consultation
                  </Button>
                </div>
              </div>

              {course.details && (
                <p className="text-blue-100 text-lg mb-4">{course.details}</p>
              )}
              
              {/* Mobile Action Buttons */}
              <div className="flex md:hidden flex-wrap gap-3 mb-4">
                <Link href={`/courses/${slug}/details`}>
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Explore Program
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm"
                  onClick={() => {
                    window.location.href = '/contact?type=consultation'
                  }}
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Get Consultation
                </Button>
              </div>

              <div className="flex flex-wrap gap-3">
                {course.eligibility && (
                  <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                    <span className="text-white font-medium">Eligibility: {course.eligibility}</span>
                  </div>
                )}
                {course.duration && (
                  <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                    <span className="text-white font-medium">Duration: {course.duration}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Colleges List */}
      <section className="w-full py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Colleges Offering {course.name}
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
                We couldn't find any colleges offering {course.name} yet.
              </p>
              <p className="text-slate-500 text-sm">Check back soon or browse other courses!</p>
              <div className="mt-6">
                <Button asChild>
                  <a href="/courses">Browse All Courses</a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Course Description (if available) */}
      {course.description && (
        <section className="w-full bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">About {course.name}</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 text-lg leading-relaxed">{course.description}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      <SiteFooter />
    </main>
  )
}