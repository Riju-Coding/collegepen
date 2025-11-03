"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getDocs, query, where, collection, doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { SiteHeader } from "@/components/frontend/site-header"
import { SiteFooter } from "@/components/frontend/site-footer"
import { EnquiryForm } from "@/components/frontend/enquiry-form"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  MapPin, 
  Star, 
  Users, 
  BookOpen, 
  Award, 
  Phone, 
  Mail, 
  Globe, 
  Building2,
  GraduationCap,
  TrendingUp,
  CheckCircle2,
  Info
} from "lucide-react"

export default function SlugPage() {
  const { slug } = useParams<{ slug: string }>()
  const [college, setCollege] = useState<any | null>(null)
  const [course, setCourse] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [streamNames, setStreamNames] = useState<string[]>([])
  const [courseNames, setCourseNames] = useState<string[]>([])

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)

      const tryFetch = async (colName: string) => {
        const q1 = query(collection(db, colName), where("slug", "==", slug))
        const s1 = await getDocs(q1)
        if (!s1.empty) return { id: s1.docs[0].id, ...s1.docs[0].data() }
        const q2 = query(collection(db, colName), where("nameSlug", "==", slug))
        const s2 = await getDocs(q2)
        if (!s2.empty) return { id: s2.docs[0].id, ...s2.docs[0].data() }
        return null
      }

      const asCollege = await tryFetch("colleges")
      if (!cancelled && asCollege) {
        setCollege(asCollege)
        setCourse(null)
        
        // Fetch stream and course names
        if (Array.isArray(asCollege.streams)) {
          const streamPromises = asCollege.streams.map(async (streamId: any) => {
            if (typeof streamId === 'string') {
              try {
                const streamDoc = await getDoc(doc(db, 'streams', streamId))
                return streamDoc.exists() ? streamDoc.data()?.name : null
              } catch {
                return null
              }
            }
            return streamId?.name || null
          })
          const streams = await Promise.all(streamPromises)
          setStreamNames(streams.filter(Boolean) as string[])
        }

        if (Array.isArray(asCollege.courses)) {
          const coursePromises = asCollege.courses.map(async (courseId: any) => {
            if (typeof courseId === 'string') {
              try {
                const courseDoc = await getDoc(doc(db, 'courses', courseId))
                return courseDoc.exists() ? courseDoc.data()?.name : null
              } catch {
                return null
              }
            }
            return courseId?.name || null
          })
          const courses = await Promise.all(coursePromises)
          setCourseNames(courses.filter(Boolean) as string[])
        }
        
        setLoading(false)
        return
      }

      const asCourse = await tryFetch("courses")
      if (!cancelled && asCourse) {
        setCourse(asCourse)
        setCollege(null)
        setLoading(false)
        return
      }

      if (!cancelled) setLoading(false)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [slug])

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <SiteHeader />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-96 bg-slate-200 rounded-3xl" />
              <div className="h-8 bg-slate-200 rounded w-1/2" />
              <div className="h-4 bg-slate-200 rounded w-3/4" />
            </div>
          </div>
        </div>
        <SiteFooter />
      </main>
    )
  }

  if (!college && !course) {
    return (
      <main className="min-h-screen bg-slate-50">
        <SiteHeader />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Info className="w-10 h-10 text-slate-400" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Page Not Found</h1>
            <p className="text-slate-600 mb-8">The college or course you're looking for doesn't exist.</p>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <a href="/colleges">Browse All Colleges</a>
            </Button>
          </div>
        </div>
        <SiteFooter />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader />

      {college && (
        <>
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
            <div className="container mx-auto px-4 py-12">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                  {/* Logo */}
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 rounded-3xl overflow-hidden bg-white shadow-2xl">
                      {college.logoUrl || college.iconUrl ? (
                        <img
                          src={college.logoUrl || college.iconUrl}
                          alt={college.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
                          <GraduationCap className="w-16 h-16 text-blue-600" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <Badge className="bg-white/20 text-white border-0">Verified</Badge>
                      {college.rating && (
                        <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-bold">{college.rating}</span>
                        </div>
                      )}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{college.name}</h1>
                    {(college.cityName || college.stateName) && (
                      <div className="flex items-center gap-2 text-lg text-white/90 mb-6">
                        <MapPin size={20} />
                        <span>{[college.cityName, college.stateName].filter(Boolean).join(", ")}</span>
                      </div>
                    )}
                    
                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                        <BookOpen className="w-6 h-6 mb-2" />
                        <div className="text-2xl font-bold">{courseNames.length || college.courses?.length || 0}</div>
                        <div className="text-sm text-white/80">Courses</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                        <TrendingUp className="w-6 h-6 mb-2" />
                        <div className="text-2xl font-bold">{streamNames.length || college.streams?.length || 0}</div>
                        <div className="text-sm text-white/80">Streams</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                        <Users className="w-6 h-6 mb-2" />
                        <div className="text-2xl font-bold">{college.studentsCount || '1K+' }</div>
                        <div className="text-sm text-white/80">Students</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                        <Award className="w-6 h-6 mb-2" />
                        <div className="text-2xl font-bold">{college.ranking || 'Top'}</div>
                        <div className="text-sm text-white/80">Ranking</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Main Content */}
          <section className="container mx-auto px-4 py-12">
            <div className="max-w-7xl mx-auto grid gap-8 lg:grid-cols-3">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* About Section */}
                <Card className="border-slate-200 shadow-lg">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                      <Building2 className="w-6 h-6 text-blue-600" />
                      About {college.name}
                    </h2>
                    {college.description ? (
                      <p className="text-slate-600 leading-relaxed">{college.description}</p>
                    ) : (
                      <p className="text-slate-500 italic">No description available.</p>
                    )}
                  </CardContent>
                </Card>

                {/* Streams Section */}
                {streamNames.length > 0 && (
                  <Card className="border-slate-200 shadow-lg">
                    <CardContent className="p-8">
                      <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                        <TrendingUp className="w-6 h-6 text-blue-600" />
                        Streams Offered
                      </h2>
                      <div className="flex flex-wrap gap-3">
                        {streamNames.map((name, idx) => (
                          <Badge 
                            key={idx} 
                            className="bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm font-medium px-4 py-2 border-0"
                          >
                            {name}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Courses Section */}
                {courseNames.length > 0 && (
                  <Card className="border-slate-200 shadow-lg">
                    <CardContent className="p-8">
                      <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                        <BookOpen className="w-6 h-6 text-blue-600" />
                        Courses Offered
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {courseNames.map((name, idx) => (
                          <div 
                            key={idx} 
                            className="flex items-center gap-2 bg-slate-50 rounded-lg p-3 border border-slate-200"
                          >
                            <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                            <span className="text-slate-700 font-medium">{name}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Highlights */}
                <Card className="border-slate-200 shadow-lg">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                      <Award className="w-6 h-6 text-blue-600" />
                      Highlights
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {college.established && (
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <Building2 className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-slate-500">Established</p>
                            <p className="font-semibold text-slate-900">{college.established}</p>
                          </div>
                        </div>
                      )}
                      {college.type && (
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <Info className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-slate-500">Type</p>
                            <p className="font-semibold text-slate-900">{college.type}</p>
                          </div>
                        </div>
                      )}
                      {college.affiliation && (
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <Award className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-slate-500">Affiliation</p>
                            <p className="font-semibold text-slate-900">{college.affiliation}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Enquiry Form */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <Card className="border-slate-200 shadow-xl">
                    <CardContent className="p-6">
                      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 mb-6 text-white">
                        <h2 className="text-xl font-bold mb-2">Interested in {college.name}?</h2>
                        <p className="text-blue-100 text-sm">Fill out the form and we'll get back to you with more information.</p>
                      </div>
                      <EnquiryForm collegeId={college.id} collegeName={college.name} />
                    </CardContent>
                  </Card>

                  {/* Contact Info */}
                  {(college.phone || college.email || college.website) && (
                    <Card className="border-slate-200 shadow-lg mt-6">
                      <CardContent className="p-6">
                        <h3 className="font-bold text-slate-900 mb-4">Contact Information</h3>
                        <div className="space-y-3">
                          {college.phone && (
                            <a href={`tel:${college.phone}`} className="flex items-center gap-3 text-slate-600 hover:text-blue-600 transition">
                              <Phone className="w-5 h-5" />
                              <span>{college.phone}</span>
                            </a>
                          )}
                          {college.email && (
                            <a href={`mailto:${college.email}`} className="flex items-center gap-3 text-slate-600 hover:text-blue-600 transition">
                              <Mail className="w-5 h-5" />
                              <span className="break-all">{college.email}</span>
                            </a>
                          )}
                          {college.website && (
                            <a href={college.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-600 hover:text-blue-600 transition">
                              <Globe className="w-5 h-5" />
                              <span className="break-all">Visit Website</span>
                            </a>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {course && (
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <Badge className="bg-blue-100 text-blue-700 mb-4">Course</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">{course.name}</h1>
            {course.description && (
              <p className="text-lg text-slate-600 leading-relaxed">{course.description}</p>
            )}
          </div>
        </section>
      )}

      <SiteFooter />
    </main>
  )
}