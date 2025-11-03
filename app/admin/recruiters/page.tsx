"use client"

import ResourceCrud, { type FieldDef } from "@/components/admin/resource-crud"

const fields: FieldDef[] = [
  { name: "name", label: "Name", type: "text" },
  { name: "logo", label: "Logo URL", type: "text" },
]

export default function RecruitersPage() {
  return <ResourceCrud title="Recruiter Management" collectionName="recruiters" fields={fields} />
}
