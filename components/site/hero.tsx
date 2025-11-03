"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import useSWR from "swr"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

type Option = { id: string; name: string }

async function fetchOptions(col: string): Promise<Option[]> {
  const snap = await getDocs(collection(db, col))
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })).map((d) => ({ id: d.id, name: d.name }))
}

export function Hero() {
  const router = useRouter()
  const [q, setQ] = useState("")
  const [stream, setStream] = useState<string>("")
  const [course, setCourse] = useState<string>("")

  const { data: streams } = useSWR("streams-options", () => fetchOptions("streams"))
  const { data: courses } = useSWR("courses-options", () => fetchOptions("courses"))

  const onSearch = () => {
    const params = new URLSearchParams()
    if (q) params.set("q", q)
    if (stream) params.set("stream", stream)
    if (course) params.set("course", course)
    router.push(`/colleges?${params.toString()}`)
  }

  return (
    <section className="relative overflow-hidden border-b">
      <div className="container py-16 md:py-24 grid gap-6 md:grid-cols-2 items-center">
        <div className="space-y-5">
          <h1 className="text-balance text-3xl md:text-5xl font-bold">Find the right college and course</h1>
          <p className="text-muted-foreground text-pretty">
            Search by stream and course, compare colleges, and send enquiries directly.
          </p>
          <div className="rounded-xl border p-3 md:p-4 bg-card/50 backdrop-blur">
            <div className="flex flex-col gap-3 md:flex-row">
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search colleges by name" />
              <Select value={stream} onValueChange={setStream}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Stream" />
                </SelectTrigger>
                <SelectContent>
                  {(streams || []).map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={course} onValueChange={setCourse}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Course" />
                </SelectTrigger>
                <SelectContent>
                  {(courses || []).map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={onSearch} className="md:w-[120px]">
                Search
              </Button>
            </div>
          </div>
        </div>
        <div className="relative md:h-[420px] h-56 rounded-xl bg-muted animate-in fade-in zoom-in-50 duration-700" />
      </div>
    </section>
  )
}
