"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { collection, deleteDoc, doc, getDocs, orderBy, query } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2 } from "lucide-react"

type Enquiry = {
  id: string
  collegeId: string
  collegeName: string
  name: string
  email: string
  phone: string
  message: string
  createdAt: any
}

type College = {
  id: string
  name: string
}

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [colleges, setColleges] = useState<College[]>([])
  const [searchPhone, setSearchPhone] = useState("")
  const [filterCollege, setFilterCollege] = useState("all")
  const [loading, setLoading] = useState(true)

  // Load colleges for filter dropdown
  useEffect(() => {
    const loadColleges = async () => {
      try {
        const snap = await getDocs(query(collection(db, "colleges"), orderBy("name")))
        const data = snap.docs.map((d) => ({ id: d.id, name: d.data().name })) as College[]
        setColleges(data)
      } catch (error) {
        console.error("Error loading colleges:", error)
      }
    }
    loadColleges()
  }, [])

  // Load enquiries
  useEffect(() => {
    const loadEnquiries = async () => {
      try {
        setLoading(true)
        const snap = await getDocs(query(collection(db, "enquiries"), orderBy("createdAt", "desc")))
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Enquiry[]
        setEnquiries(data)
      } catch (error) {
        console.error("Error loading enquiries:", error)
      } finally {
        setLoading(false)
      }
    }
    loadEnquiries()
  }, [])

  // Delete enquiry
  const deleteEnquiry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return
    try {
      await deleteDoc(doc(db, "enquiries", id))
      setEnquiries(enquiries.filter((e) => e.id !== id))
    } catch (error) {
      console.error("Error deleting enquiry:", error)
    }
  }

  // Filter and search
  const filtered = enquiries.filter((e) => {
    const matchPhone = e.phone.includes(searchPhone)
    const matchCollege = filterCollege === "all" || e.collegeId === filterCollege
    return matchPhone && matchCollege
  })

  // Format date
  const formatDate = (timestamp: any) => {
    if (!timestamp) return "—"
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:gap-4">
        <div className="flex-1">
          <label className="text-sm font-medium">Search by Phone</label>
          <Input
            placeholder="Enter phone number..."
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
            className="mt-1"
          />
        </div>

        <div className="flex-1">
          <label className="text-sm font-medium">Filter by College</label>
          <Select value={filterCollege} onValueChange={setFilterCollege}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="All Colleges" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Colleges</SelectItem>
              {colleges.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-balance">Enquiries ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading enquiries...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No enquiries found</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>College</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell className="font-medium">{e.collegeName || "—"}</TableCell>
                      <TableCell>{e.name || "—"}</TableCell>
                      <TableCell className="text-sm">{e.email || "—"}</TableCell>
                      <TableCell>{e.phone || "—"}</TableCell>
                      <TableCell className="max-w-xs truncate text-sm">{e.message || "—"}</TableCell>
                      <TableCell className="text-sm">{formatDate(e.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="destructive" size="sm" onClick={() => deleteEnquiry(e.id)} className="gap-1">
                          <Trash2 className="size-4" />
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
