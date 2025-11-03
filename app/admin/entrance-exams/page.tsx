"use client"

import ResourceCrud, { type FieldDef } from "@/components/admin/resource-crud"

const fields: FieldDef[] = [
  { name: "name", label: "Name", type: "text" },
  { name: "logo", label: "Logo URL", type: "text" },
]

export default function EntranceExamsPage() {
  return <ResourceCrud title="Entrance Exam Management" collectionName="entrance_exams" fields={fields} />
}
