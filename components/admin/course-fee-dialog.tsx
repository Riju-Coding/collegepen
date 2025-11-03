"use client"

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export type CourseItem = { id: string; name: string }
export type FeesMap = Record<string, string> // courseId -> fee

export default function CourseFeeDialog({
  open,
  courses,
  value,
  onChange,
  onClose,
}: {
  open: boolean
  courses: CourseItem[]
  value: FeesMap
  onChange: (v: FeesMap) => void
  onClose: () => void
}) {
  const handleFeeChange = (id: string, fee: string) => {
    onChange({ ...value, [id]: fee.replace(/[^\d.]/g, "") })
  }

  return (
    <Dialog open={open} onOpenChange={(v) => (!v ? onClose() : null)}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Set Course Fees</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          {courses.map((c) => (
            <div className="grid gap-2" key={c.id}>
              <Label htmlFor={`fee-${c.id}`}>{c.name} Fee</Label>
              <Input
                id={`fee-${c.id}`}
                inputMode="decimal"
                value={value[c.id] || ""}
                onChange={(e) => handleFeeChange(c.id, e.target.value)}
              />
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
