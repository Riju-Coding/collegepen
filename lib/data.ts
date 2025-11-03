"use client"

import useSWR from "swr"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, where, limit as qLimit } from "firebase/firestore"

type DocT = { id: string; [k: string]: any }
const toDocs = (snap: any): DocT[] => snap.docs.map((d: any) => ({ id: d.id, ...d.data() }))

const fetcher = async (key: string, fn: () => Promise<any>) => fn()

export function useStreams() {
  return useSWR(["streams:list"], () => getDocs(collection(db, "streams")).then(toDocs))
}
export function useCourses() {
  return useSWR(["courses:list"], () => getDocs(collection(db, "courses")).then(toDocs))
}

export function useColleges(filters?: { streamSlug?: string; courseSlug?: string; take?: number }) {
  return useSWR(["colleges:list", filters], async () => {
    const col = collection(db, "colleges")
    const clauses = []
    if (filters?.streamSlug) clauses.push(where("streams", "array-contains", filters.streamSlug))
    if (filters?.courseSlug) clauses.push(where("courses", "array-contains", filters.courseSlug))
    let qRef: any = clauses.length ? query(col, ...clauses) : col
    if (filters?.take) qRef = query(qRef, qLimit(filters.take))
    const snap = await getDocs(qRef)
    return toDocs(snap)
  })
}

export function useCollegeBySlug(slug: string | undefined) {
  return useSWR(slug ? ["college:slug", slug] : null, async () => {
    if (!slug) return null
    const col = collection(db, "colleges")
    // Prefer explicit slug field; fallback to nameSlug if that's how admin stored it.
    const try1 = await getDocs(query(col, where("slug", "==", slug)))
    if (!try1.empty) return toDocs(try1)[0]
    const try2 = await getDocs(query(col, where("nameSlug", "==", slug)))
    if (!try2.empty) return toDocs(try2)[0]
    return null
  })
}

export function useCourseBySlug(slug: string | undefined) {
  return useSWR(slug ? ["course:slug", slug] : null, async () => {
    if (!slug) return null
    const col = collection(db, "courses")
    const try1 = await getDocs(query(col, where("slug", "==", slug)))
    if (!try1.empty) return toDocs(try1)[0]
    const try2 = await getDocs(query(col, where("nameSlug", "==", slug)))
    if (!try2.empty) return toDocs(try2)[0]
    return null
  })
}
