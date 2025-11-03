"use client"

import ResourceCrud, { type FieldDef } from "@/components/admin/resource-crud"

const fields: FieldDef[] = [
  { name: "name", label: "Name", type: "text" },
  { name: "icon", label: "Icon URL", type: "text", displayAs: "image" },
  { name: "details", label: "Details", type: "textarea" },
  { name: "eligibility", label: "Eligibility", type: "textarea" },
  {
    name: "streamId",
    label: "Stream",
    type: "select",
    optionsCollection: "streams",
    optionLabelKey: "name",
  },
]

export default function CoursesPage() {
  return <ResourceCrud title="Course Management" collectionName="courses" fields={fields} />
}
