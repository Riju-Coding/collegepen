"use client"

import ResourceCrud, { type FieldDef } from "@/components/admin/resource-crud"

const fields: FieldDef[] = [
  { name: "name", label: "Name", type: "text" },
  { name: "icon", label: "Icon URL", type: "text", displayAs: "image" },
  { name: "details", label: "Details", type: "textarea" },
]

export default function StreamsPage() {
  return <ResourceCrud title="Stream Management" collectionName="streams" fields={fields} />
}
