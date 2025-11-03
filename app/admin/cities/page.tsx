"use client"

import ResourceCrud, { type FieldDef } from "@/components/admin/resource-crud"

const fields: FieldDef[] = [
  { name: "name", label: "Name", type: "text" },
  {
    name: "stateId",
    label: "State",
    type: "select",
    optionsCollection: "states",
    optionLabelKey: "name",
  },
]

export default function CitiesPage() {
  return <ResourceCrud title="City Management" collectionName="cities" fields={fields} />
}
