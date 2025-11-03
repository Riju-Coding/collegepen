"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { collection, getCountFromServer } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Metric = { label: string; collection: string; count?: number }

const metrics: Metric[] = [
  { label: "Colleges", collection: "colleges" },
  { label: "Streams", collection: "streams" },
  { label: "Courses", collection: "courses" },
  { label: "Recruiters", collection: "recruiters" },
  { label: "Entrance Exams", collection: "entrance_exams" },
]

export default function DashboardPage() {
  const [data, setData] = useState<Metric[]>(metrics)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const results = await Promise.all(
        metrics.map(async (m) => {
          const snap = await getCountFromServer(collection(db, m.collection))
          return { ...m, count: snap.data().count }
        }),
      )
      if (!cancelled) setData(results)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data.map((m) => (
        <Card key={m.collection}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{m.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{m.count ?? "—"}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
