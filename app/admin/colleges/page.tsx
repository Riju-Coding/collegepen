"use client"

import { useEffect, useMemo, useState } from "react"
import { db } from "@/lib/firebase"
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import CourseFeeDialog, { type FeesMap } from "@/components/admin/course-fee-dialog"
import MultiSelect, { type Option } from "@/components/admin/multi-select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

type Doc = { id: string; name: string; [k: string]: any }

export default function CollegesPage() {
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [about, setAbout] = useState("")
  const [estYear, setEstYear] = useState("")
  const [stateId, setStateId] = useState("")
  const [cityId, setCityId] = useState("")
  const [approvalId, setApprovalId] = useState("")
  const [affiliationId, setAffiliationId] = useState("")
  const [streamIds, setStreamIds] = useState<string[]>([])
  const [courseIds, setCourseIds] = useState<string[]>([])
  const [feesOpen, setFeesOpen] = useState(false)
  const [courseFees, setCourseFees] = useState<FeesMap>({})
  const [recruiterIds, setRecruiterIds] = useState<string[]>([])
  const [examIds, setExamIds] = useState<string[]>([])
  const [featured, setFeatured] = useState(false)
  const [saving, setSaving] = useState(false)

  const [rows, setRows] = useState<Doc[]>([])
  const [q, setQ] = useState("")
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [citiesAll, setCitiesAll] = useState<Doc[]>([])

  const [states, setStates] = useState<Doc[]>([])
  const [cities, setCities] = useState<Doc[]>([])
  const [approvals, setApprovals] = useState<Doc[]>([])
  const [affiliations, setAffiliations] = useState<Doc[]>([])
  const [streams, setStreams] = useState<Doc[]>([])
  const [courses, setCourses] = useState<Doc[]>([])
  const [recruiters, setRecruiters] = useState<Doc[]>([])
  const [exams, setExams] = useState<Doc[]>([])

  const streamOptions: Option[] = streams.map((s) => ({ value: s.id, label: s.name }))
  const selectedCourses = useMemo(() => courses.filter((c) => courseIds.includes(c.id)), [courses, courseIds])
  const courseOptions: Option[] = useMemo(() => {
    const filtered = streamIds.length ? courses.filter((c) => streamIds.includes(c.streamId)) : []
    return filtered.map((c) => ({ value: c.id, label: c.name }))
  }, [courses, streamIds])
  const recruiterOptions: Option[] = recruiters.map((r) => ({ value: r.id, label: r.name }))
  const examOptions: Option[] = exams.map((e) => ({ value: e.id, label: e.name }))

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
  }

  const handleNameChange = (value: string) => {
    setName(value)
    if (!editingId) {
      setSlug(generateSlug(value))
    }
  }

  useEffect(() => {
    const load = async () => {
      const loadCol = async (name: string) => {
        const snap = await getDocs(query(collection(db, name), orderBy("name")))
        return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Doc[]
      }
      const [st, ap, af, strm, crs, rec, ex, allC] = await Promise.all([
        loadCol("states"),
        loadCol("approvals"),
        loadCol("affiliations"),
        loadCol("streams"),
        loadCol("courses"),
        loadCol("recruiters"),
        loadCol("entrance_exams"),
        (async () => {
          const snap = await getDocs(query(collection(db, "cities"), orderBy("name")))
          return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Doc[]
        })(),
      ])
      setStates(st)
      setApprovals(ap)
      setAffiliations(af)
      setStreams(strm)
      setCourses(crs)
      setRecruiters(rec)
      setExams(ex)
      setCitiesAll(allC)
    }
    load()
  }, [])

  useEffect(() => {
    const loadCities = async () => {
      const snap = await getDocs(query(collection(db, "cities"), orderBy("name")))
      const all = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Doc[]
      setCitiesAll(all)
      if (stateId) setCities(all.filter((c) => c.stateId === stateId))
      else setCities([])
    }
    loadCities()
  }, [stateId])

  const saveCollege = async () => {
    setSaving(true)
    try {
      const payload: any = {
        name,
        slug,
        stateId,
        cityId,
        approvalId,
        affiliationId,
        establishmentYear: estYear ? Number.parseInt(estYear, 10) : null,
        streams: streamIds,
        courses: courseIds.map((id) => ({ courseId: id, fee: courseFees[id] || "" })),
        recruiters: recruiterIds,
        entranceExams: examIds,
        about,
        featured,
        updatedAt: Date.now(),
      }
      if (!editingId) {
        payload.createdAt = Date.now()
      }
      if (editingId) {
        await updateDoc(doc(db, "colleges", editingId), payload)
      } else {
        await addDoc(collection(db, "colleges"), payload)
      }
      await loadColleges()
      setOpen(false)
      setEditingId(null)
    } finally {
      setSaving(false)
    }
  }

  const loadColleges = async () => {
    const snap = await getDocs(query(collection(db, "colleges"), orderBy("name")))
    setRows(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Doc[])
  }

  useEffect(() => {
    loadColleges()
  }, [])

  const stateName = (id?: string) => states.find((s) => s.id === id)?.name || "—"
  const cityName = (id?: string) => citiesAll.find((c) => c.id === id)?.name || "—"
  const streamNames = (ids: string[] = []) =>
    ids.map((id) => streams.find((s) => s.id === id)?.name || id).join(", ") || "—"
  const courseNames = (list: Array<{ courseId: string; fee?: string }> = []) =>
    list.map((e) => courses.find((c) => c.id === e.courseId)?.name || e.courseId).join(", ") || "—"

  const startCreate = () => {
    setEditingId(null)
    setName("")
    setSlug("")
    setAbout("")
    setEstYear("")
    setStateId("")
    setCityId("")
    setApprovalId("")
    setAffiliationId("")
    setStreamIds([])
    setCourseIds([])
    setCourseFees({})
    setRecruiterIds([])
    setExamIds([])
    setFeatured(false)
    setOpen(true)
  }

  const startEdit = (row: any) => {
    setEditingId(row.id)
    setName(row.name || "")
    setSlug(row.slug || "")
    setAbout(row.about || "")
    setEstYear(row.establishmentYear ? String(row.establishmentYear) : "")
    setStateId(row.stateId || "")
    setCityId(row.cityId || "")
    setApprovalId(row.approvalId || "")
    setAffiliationId(row.affiliationId || "")
    setStreamIds(row.streams || [])
    const rowCourses: Array<{ courseId: string; fee?: string }> = row.courses || []
    setCourseIds(rowCourses.map((c) => c.courseId))
    setCourseFees(rowCourses.reduce<FeesMap>((acc, c) => ({ ...acc, [c.courseId]: c.fee || "" }), {}))
    setRecruiterIds(row.recruiters || [])
    setExamIds(row.entranceExams || [])
    setFeatured(row.featured || false)
    setOpen(true)
  }

  const removeRow = async (id: string) => {
    await deleteDoc(doc(db, "colleges", id))
    await loadColleges()
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Top toolbar */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <Input
          placeholder="Search colleges..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="md:max-w-sm"
        />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={startCreate}>Create College</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit College" : "Create College"}</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto pr-4">
              <div className="space-y-4">
                {/* Basic Info */}
                <div>
                  <label className="text-sm font-medium">College Name *</label>
                  <Input
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Enter college name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Slug (URL-friendly name)</label>
                  <Input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g., my-college-name"
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Auto-generated from name, but you can customize it
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium">About</label>
                  <textarea
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    placeholder="College description"
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Establishment Year</label>
                  <Input
                    type="number"
                    value={estYear}
                    onChange={(e) => setEstYear(e.target.value)}
                    placeholder="e.g., 2000"
                    className="mt-1"
                  />
                </div>

                {/* Featured Toggle */}
                <div className="flex items-center justify-between p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-yellow-600" />
                    <div>
                      <Label htmlFor="featured" className="text-sm font-semibold text-slate-900">
                        Featured College
                      </Label>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Show this college on the homepage featured section
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="featured"
                    checked={featured}
                    onCheckedChange={setFeatured}
                  />
                </div>

                {/* Location */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">State *</label>
                    <Select value={stateId} onValueChange={setStateId}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">City *</label>
                    <Select value={cityId} onValueChange={setCityId}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Approval & Affiliation */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Approval</label>
                    <Select value={approvalId} onValueChange={setApprovalId}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select approval" />
                      </SelectTrigger>
                      <SelectContent>
                        {approvals.map((a) => (
                          <SelectItem key={a.id} value={a.id}>
                            {a.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Affiliation</label>
                    <Select value={affiliationId} onValueChange={setAffiliationId}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select affiliation" />
                      </SelectTrigger>
                      <SelectContent>
                        {affiliations.map((a) => (
                          <SelectItem key={a.id} value={a.id}>
                            {a.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Streams & Courses */}
                <div>
                  <label className="text-sm font-medium">Streams</label>
                  <MultiSelect
                    options={streamOptions}
                    values={streamIds}
                    onChange={setStreamIds}
                    placeholder="Select streams"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Courses</label>
                  <MultiSelect
                    options={courseOptions}
                    values={courseIds}
                    onChange={setCourseIds}
                    placeholder="Select courses"
                  />
                  {courseIds.length > 0 && (
                    <Button variant="outline" size="sm" onClick={() => setFeesOpen(true)} className="mt-2">
                      Edit Course Fees
                    </Button>
                  )}
                </div>

                {/* Recruiters & Exams */}
                <div>
                  <label className="text-sm font-medium">Recruiters</label>
                  <MultiSelect
                    options={recruiterOptions}
                    values={recruiterIds}
                    onChange={setRecruiterIds}
                    placeholder="Select recruiters"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Entrance Exams</label>
                  <MultiSelect
                    options={examOptions}
                    values={examIds}
                    onChange={setExamIds}
                    placeholder="Select exams"
                  />
                </div>

                {/* Save Button */}
                <div className="flex gap-2 pt-4">
                  <Button onClick={saveCollege} disabled={saving}>
                    {saving ? "Saving..." : editingId ? "Update College" : "Save College"}
                  </Button>
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Listing table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-balance">Colleges</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>State</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Streams</TableHead>
                <TableHead>Courses</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows
                .filter((r) => r.name?.toLowerCase().includes(q.toLowerCase()))
                .map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.name || "—"}</TableCell>
                    <TableCell>{stateName(r.stateId)}</TableCell>
                    <TableCell>{cityName(r.cityId)}</TableCell>
                    <TableCell>{streamNames(r.streams)}</TableCell>
                    <TableCell>{courseNames(r.courses)}</TableCell>
                    <TableCell>
                      {r.featured && (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => startEdit(r)}>
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => removeRow(r.id)}>
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Keep fees dialog behavior for course selection */}
      <CourseFeeDialog
        open={feesOpen}
        onClose={() => setFeesOpen(false)}
        courses={selectedCourses.map((c) => ({ id: c.id, name: c.name }))}
        value={courseFees}
        onChange={setCourseFees}
      />
    </div>
  )
}