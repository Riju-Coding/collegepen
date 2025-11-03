"use client"

import ResourceCrud, { type FieldDef } from "@/components/admin/resource-crud"

const fields: FieldDef[] = [{ name: "name", label: "Name", type: "text" }]

export default function StatesPage() {
  return <ResourceCrud title="State Management" collectionName="states" fields={fields} />
}
