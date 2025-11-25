"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { SiteHeader } from "@/components/frontend/site-header"
import { SiteFooter } from "@/components/frontend/site-footer"
import { 
  BookOpen, 
  Loader2, 
  GraduationCap, 
  Clock, 
  CheckCircle2, 
  Target,
  Briefcase,
  TrendingUp,
  Users,
  Award,
  ArrowLeft,
  Phone,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CourseDetailsPage() {
  const params = useParams()
  const slug = params.slug as string

  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
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
            <p className="text-slate-600 mb-6">The course details you're looking for don't exist.</p>
            <Button asChild>
              <Link href="/courses">Browse All Courses</Link>
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

      {/* Breadcrumb */}
      <section className="w-full bg-white border-b border-slate-200 py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/courses" className="hover:text-blue-600">Courses</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/courses/${slug}`} className="hover:text-blue-600">{course.name}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 font-medium">Details</span>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-blue-600 to-indigo-700 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link href={`/courses/${slug}`} className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to {course.name}</span>
          </Link>
          
          <div className="flex items-start gap-6">
            {course.icon ? (
              <img
                src={course.icon}
                alt={course.name}
                className="w-20 h-20 rounded-2xl object-cover border-4 border-white/20 shadow-xl"
              />
            ) : (
              <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border-4 border-white/20">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                {course.name} - Program Details
              </h1>
              {course.details && (
                <p className="text-blue-100 text-lg">{course.details}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="w-full py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Overview */}
              {course.description && (
                <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                    Program Overview
                  </h2>
                  <p className="text-slate-700 leading-relaxed text-lg">{course.description}</p>
                </div>
              )}

              {/* Key Highlights */}
              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <Award className="w-6 h-6 text-blue-600" />
                  Key Highlights
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.duration && (
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                      <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <div className="font-semibold text-slate-900">Duration</div>
                        <div className="text-slate-600">{course.duration}</div>
                      </div>
                    </div>
                  )}
                  {course.eligibility && (
                    <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <div className="font-semibold text-slate-900">Eligibility</div>
                        <div className="text-slate-600">{course.eligibility}</div>
                      </div>
                    </div>
                  )}
                  {course.type && (
                    <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl">
                      <Target className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <div className="font-semibold text-slate-900">Course Type</div>
                        <div className="text-slate-600">{course.type}</div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-xl">
                    <Users className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-900">Mode</div>
                      <div className="text-slate-600">Full-time / Part-time</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Career Opportunities */}
              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                  Career Opportunities
                </h2>
                <p className="text-slate-700 mb-6">
                  Graduates with a {course.name} degree have diverse career paths available across multiple industries.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    "Industry Leadership Roles",
                    "Research & Development",
                    "Consulting Services",
                    "Entrepreneurship",
                    "Academic Positions",
                    "Corporate Management"
                  ].map((career, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-slate-700">{career}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills You'll Gain */}
              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                  Skills You'll Develop
                </h2>
                <div className="flex flex-wrap gap-3">
                  {[
                    "Critical Thinking",
                    "Problem Solving",
                    "Research Methods",
                    "Communication",
                    "Leadership",
                    "Analytical Skills",
                    "Technical Expertise",
                    "Project Management"
                  ].map((skill, idx) => (
                    <span 
                      key={idx}
                      className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-medium text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* CTA Card */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl">
                  <h3 className="text-xl font-bold mb-3">Ready to Start Your Journey?</h3>
                  <p className="text-blue-100 mb-6">
                    Get expert guidance on admissions, colleges, and career paths.
                  </p>
                  <Button 
                    size="lg" 
                    className="w-full bg-white text-blue-600 hover:bg-blue-50"
                    onClick={() => window.location.href = '/contact?type=consultation'}
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Get Free Consultation
                  </Button>
                </div>

                {/* Quick Info Card */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Information</h3>
                  <div className="space-y-4">
                    {course.eligibility && (
                      <div className="pb-4 border-b border-slate-200">
                        <div className="text-sm text-slate-500 mb-1">Eligibility</div>
                        <div className="text-slate-900 font-medium">{course.eligibility}</div>
                      </div>
                    )}
                    {course.duration && (
                      <div className="pb-4 border-b border-slate-200">
                        <div className="text-sm text-slate-500 mb-1">Duration</div>
                        <div className="text-slate-900 font-medium">{course.duration}</div>
                      </div>
                    )}
                    <div>
                      <div className="text-sm text-slate-500 mb-1">Admission Process</div>
                      <div className="text-slate-900 font-medium">Merit / Entrance Based</div>
                    </div>
                  </div>
                </div>

                {/* Action Card */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Explore More</h3>
                  <div className="space-y-3">
                    <Link href={`/courses/${slug}`}>
                      <Button variant="outline" className="w-full justify-start">
                        <GraduationCap className="w-4 h-4 mr-2" />
                        View Colleges
                      </Button>
                    </Link>
                    <Link href="/courses">
                      <Button variant="outline" className="w-full justify-start">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Browse All Courses
                      </Button>
                    </Link>
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