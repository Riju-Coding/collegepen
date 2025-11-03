"use client"

import ResourceCrud, { type FieldDef } from "@/components/admin/resource-crud"

const fields: FieldDef[] = [{ name: "name", label: "Name", type: "text" }]

export default function AffiliationsPage() {
  return <ResourceCrud title="Affiliation Management" collectionName="affiliations" fields={fields} />
}
