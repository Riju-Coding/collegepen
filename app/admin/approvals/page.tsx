"use client"

import ResourceCrud, { type FieldDef } from "@/components/admin/resource-crud"

const fields: FieldDef[] = [{ name: "name", label: "Name", type: "text" }]

export default function ApprovalsPage() {
  return <ResourceCrud title="Approval Management" collectionName="approvals" fields={fields} />
}
