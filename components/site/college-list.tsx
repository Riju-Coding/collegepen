"use client"

import useSWR from "swr"
import { collection, getDocs, query, where, type DocumentData } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { CollegeCard } from "./college-card"

type Filters = {
  q?: string
  stream?: string
  course?: string
}

async function fetchColleges(filters: Filters) {
  const base = collection(db, "colleges")
  const clauses = []
  if (filters.stream) clauses.push(where("streams", "array-contains", filters.stream))
  if (filters.course) clauses.push(where("courses", "array-contains", filters.course))

  // fall back to full collection when no compound index available
  const ref = clauses.length ? query(base, ...clauses) : base
  const snap = await getDocs(ref)
  let rows = snap.docs.map((d) => ({ id: d.id, ...(d.data() as DocumentData) }))

  if (filters.q) {
    const qlc = filters.q.toLowerCase()
    rows = rows.filter((r) => (r.name || "").toLowerCase().includes(qlc))
  }
  return rows
}

export function CollegeList(props: Filters) {
  const { data, isLoading, error } = useSWR(["colleges", props], () => fetchColleges(props))

  if (isLoading) return <div className="container py-10">Loading colleges...</div>
  if (error) return <div className="container py-10 text-destructive">Failed to load colleges.</div>
  if (!data?.length) return <div className="container py-10">No colleges found.</div>

  return (
    <div className="container py-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data.map((c: any) => (
        <CollegeCard key={c.id} college={c} />
      ))}
    </div>
  )
}
