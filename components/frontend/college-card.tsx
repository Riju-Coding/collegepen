"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, TrendingUp, ChevronRight, GraduationCap } from "lucide-react"
import { useEffect, useState } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

type Props = {
  college: {
    id: string
    name?: string
    slug?: string
    nameSlug?: string
    cityName?: string
    stateName?: string
    iconUrl?: string
    logoUrl?: string
    streams?: any[]
    courses?: any[]
    rating?: number
    studentsCount?: number
  }
}

export function CollegeCard({ college }: Props) {
  const slug = college.slug || college.nameSlug
  const href = slug ? `/${slug}` : "#"
  const img = college.logoUrl || college.iconUrl
  
  const [streamNames, setStreamNames] = useState<string[]>([])
  const [courseNames, setCourseNames] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNames = async () => {
      try {
        // Fetch stream names
        if (Array.isArray(college.streams) && college.streams.length > 0) {
          const streamPromises = college.streams.slice(0, 2).map(async (streamId) => {
            if (typeof streamId === 'string') {
              try {
                const streamDoc = await getDoc(doc(db, 'streams', streamId))
                return streamDoc.exists() ? streamDoc.data()?.name : null
              } catch {
                return null
              }
            } else if (streamId?.name) {
              return streamId.name
            }
            return null
          })
          const streams = await Promise.all(streamPromises)
          setStreamNames(streams.filter(Boolean) as string[])
        }

        // Fetch course names
        if (Array.isArray(college.courses) && college.courses.length > 0) {
          const coursePromises = college.courses.slice(0, 3).map(async (courseId) => {
            if (typeof courseId === 'string') {
              try {
                const courseDoc = await getDoc(doc(db, 'courses', courseId))
                return courseDoc.exists() ? courseDoc.data()?.name : null
              } catch {
                return null
              }
            } else if (courseId?.name) {
              return courseId.name
            }
            return null
          })
          const courses = await Promise.all(coursePromises)
          setCourseNames(courses.filter(Boolean) as string[])
        }
      } catch (error) {
        console.error('Error fetching stream/course names:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNames()
  }, [college.streams, college.courses])

  return (
    <Link href={href} className="block group">
      <Card className="h-full transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 overflow-hidden border border-slate-200 bg-white">
        <CardContent className="p-5">
          <div className="flex gap-4">
            {/* Logo Section - Left Side */}
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                {img ? (
                  <img
                    src={img}
                    alt={college.name || "College"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <GraduationCap className="w-8 h-8 text-blue-600 mb-1" />
                    <span className="text-xs font-bold text-blue-600">
                      {college.name?.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Content Section - Right Side */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-lg font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                  {college.name}
                </h3>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {college.rating && (
                    <div className="flex items-center gap-1 bg-yellow-50 rounded-full px-2 py-1">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-bold text-slate-900">{college.rating}</span>
                    </div>
                  )}
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
              
              {(college.cityName || college.stateName) && (
                <div className="flex items-center gap-1.5 text-sm text-slate-600 mb-3">
                  <MapPin size={14} className="flex-shrink-0 text-blue-600" />
                  <span className="line-clamp-1">{[college.cityName, college.stateName].filter(Boolean).join(", ")}</span>
                </div>
              )}

              {/* Streams & Courses */}
              <div className="space-y-2">
                {!loading && streamNames.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {streamNames.map((name, idx) => (
                      <Badge 
                        key={idx} 
                        className="bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs font-medium px-2.5 py-0.5 border-0"
                      >
                        {name}
                      </Badge>
                    ))}
                    {Array.isArray(college.streams) && college.streams.length > 2 && (
                      <Badge className="bg-blue-50 text-blue-600 text-xs font-medium px-2.5 py-0.5 border-0">
                        +{college.streams.length - 2} more
                      </Badge>
                    )}
                  </div>
                )}
                
                {!loading && courseNames.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {courseNames.map((name, idx) => (
                      <Badge 
                        key={idx} 
                        className="bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-medium px-2.5 py-0.5 border-0"
                      >
                        {name}
                      </Badge>
                    ))}
                    {Array.isArray(college.courses) && college.courses.length > 3 && (
                      <Badge className="bg-slate-50 text-slate-600 text-xs font-medium px-2.5 py-0.5 border-0">
                        +{college.courses.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}

                {/* Loading state */}
                {loading && (
                  <div className="flex gap-1.5">
                    <div className="h-5 w-16 bg-slate-200 rounded animate-pulse" />
                    <div className="h-5 w-20 bg-slate-200 rounded animate-pulse" />
                  </div>
                )}

                {/* Fallback if no streams/courses after loading */}
                {!loading && streamNames.length === 0 && Array.isArray(college.streams) && college.streams.length > 0 && (
                  <Badge className="bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-0.5 border-0">
                    {`${college.streams.length} streams`}
                  </Badge>
                )}
                {!loading && courseNames.length === 0 && Array.isArray(college.courses) && college.courses.length > 0 && (
                  <Badge className="bg-slate-100 text-slate-700 text-xs font-medium px-2.5 py-0.5 border-0">
                    {`${college.courses.length} courses`}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          {college.studentsCount && (
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                Featured
              </span>
              <span>{college.studentsCount}+ students</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}