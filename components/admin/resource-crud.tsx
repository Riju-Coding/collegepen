"use client"

import { useEffect, useMemo, useState } from "react"
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc } from "firebase/firestore"
import { db, storage } from "@/lib/firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Upload, Save, X } from "lucide-react"

type FieldType = "text" | "textarea" | "select" | "file" | "year"

export type FieldDef = {
  name: string
  label: string
  type: FieldType
  optionsCollection?: string
  optionLabelKey?: string
  filterBy?: { field: string; sourceField: string }
  storagePath?: string
  displayAs?: "image"
}

export default function ResourceCrud({
  title,
  collectionName,
  fields,
  orderByField = "name",
}: {
  title: string
  collectionName: string
  fields: FieldDef[]
  orderByField?: string
}) {
  const [rows, setRows] = useState<any[]>([])
  const [form, setForm] = useState<Record<string, any>>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [options, setOptions] = useState<Record<string, any[]>>({})

  const selects = useMemo(() => fields.filter((f) => f.type === "select"), [fields])

  const load = async () => {
    const q = query(collection(db, collectionName), orderBy(orderByField))
    const snap = await getDocs(q)
    setRows(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  }

  const loadOptions = async () => {
    const res: Record<string, any[]> = {}
    for (const s of selects) {
      const qCol = collection(db, s.optionsCollection!)
      const snap = await getDocs(qCol)
      res[s.name] = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    }
    setOptions(res)
  }

  useEffect(() => {
    load()
    if (selects.length) loadOptions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName])

  const handleChange = (name: string, value: any) => setForm((f) => ({ ...f, [name]: value }))

  const filteredOptions = (field: FieldDef) => {
    const list = options[field.name] || []
    if (!field.filterBy) return list
    const filterValue = form[field.filterBy.sourceField]
    if (!filterValue) return []
    return list.filter((o: any) => o[field.filterBy.field] === filterValue)
  }

  const handleFileUpload = async (field: FieldDef, file: File) => {
    if (!field.storagePath) return
    const path = `${field.storagePath}/${Date.now()}-${file.name}`
    const storageRef = ref(storage, path)
    await uploadBytes(storageRef, file)
    const url = await getDownloadURL(storageRef)
    handleChange(field.name, url)
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const payload = { ...form }
      if (editingId) {
        await updateDoc(doc(db, collectionName, editingId), payload)
      } else {
        await addDoc(collection(db, collectionName), payload)
      }
      setForm({})
      setEditingId(null)
      await load()
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (row: any) => {
    setEditingId(row.id)
    setForm(fields.reduce((acc, f) => ({ ...acc, [f.name]: row[f.name] ?? "" }), {}))
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm({})
  }

  const remove = async (id: string) => {
    await deleteDoc(doc(db, collectionName, id))
    await load()
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-balance">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {fields.map((f) => {
              const value = form[f.name] ?? ""
              if (f.type === "textarea") {
                return (
                  <div key={f.name} className="md:col-span-2 grid gap-2">
                    <Label htmlFor={f.name}>{f.label}</Label>
                    <Textarea id={f.name} value={value} onChange={(e) => handleChange(f.name, e.target.value)} />
                  </div>
                )
              }
              if (f.type === "select") {
                const opts = filteredOptions(f)
                const labelKey = f.optionLabelKey || "name"
                return (
                  <div key={f.name} className="grid gap-2">
                    <Label htmlFor={f.name}>{f.label}</Label>
                    <Select value={value || ""} onValueChange={(v) => handleChange(f.name, v)}>
                      <SelectTrigger id={f.name}>
                        <SelectValue placeholder={`Select ${f.label}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {opts.map((o: any) => (
                          <SelectItem key={o.id} value={o.id}>
                            {o[labelKey]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )
              }
              if (f.type === "file") {
                return (
                  <div key={f.name} className="grid gap-2">
                    <Label>{f.label}</Label>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" className="gap-2 bg-transparent" asChild>
                        <label className="cursor-pointer">
                          <Upload className="size-4" />
                          Upload
                          <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleFileUpload(f, file)
                            }}
                          />
                        </label>
                      </Button>
                      {value ? (
                        <Badge variant="secondary">Uploaded</Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">No file</span>
                      )}
                    </div>
                  </div>
                )
              }
              if (f.type === "year") {
                return (
                  <div key={f.name} className="grid gap-2">
                    <Label htmlFor={f.name}>{f.label}</Label>
                    <Input
                      id={f.name}
                      value={value}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, "")
                        handleChange(f.name, v)
                      }}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={4}
                    />
                  </div>
                )
              }
              return (
                <div key={f.name} className="grid gap-2">
                  <Label htmlFor={f.name}>{f.label}</Label>
                  <Input id={f.name} value={value} onChange={(e) => handleChange(f.name, e.target.value)} />
                </div>
              )
            })}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Button onClick={handleSave} disabled={loading} className="gap-2">
              <Save className="size-4" />
              {editingId ? "Update" : "Add"}
            </Button>
            {editingId ? (
              <Button variant="ghost" onClick={cancelEdit} className="gap-2">
                <X className="size-4" />
                Cancel
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-balance">Existing</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {fields.map((f) => (
                  <TableHead key={f.name}>{f.label}</TableHead>
                ))}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  {fields.map((f) => {
                    const v = r[f.name]
                    if (f.type === "select") {
                      const list = (options as any)[f.name] || []
                      const labelKey = f.optionLabelKey || "name"
                      const found = list.find((o: any) => o.id === v)
                      return <TableCell key={f.name}>{found ? found[labelKey] : v || "—"}</TableCell>
                    }
                    if (f.displayAs === "image") {
                      return (
                        <TableCell key={f.name}>
                          {v ? (
                            <img
                              src={v || "/placeholder.svg"}
                              alt={`${f.label} preview`}
                              className="h-9 w-9 rounded object-cover border"
                              loading="lazy"
                            />
                          ) : (
                            "—"
                          )}
                        </TableCell>
                      )
                    }
                    if (f.type === "file") return <TableCell key={f.name}>{v ? "Uploaded" : "—"}</TableCell>
                    return <TableCell key={f.name}>{v || "—"}</TableCell>
                  })}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => startEdit(r)} aria-label="Edit">
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(r.id)}
                        aria-label="Delete"
                        className="text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
