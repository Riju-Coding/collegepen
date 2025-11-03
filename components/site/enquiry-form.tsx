"use client"

import { useState } from "react"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export function EnquiryForm({ collegeId, collegeName }: { collegeId: string; collegeName: string }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  async function onSubmit() {
    setSubmitting(true)
    try {
      await addDoc(collection(db, "enquiries"), {
        collegeId,
        collegeName,
        name,
        email,
        phone,
        message,
        createdAt: serverTimestamp(),
      })
      setSent(true)
      setName("")
      setEmail("")
      setPhone("")
      setMessage("")
    } finally {
      setSubmitting(false)
    }
  }

  if (sent) return <div className="rounded-md border bg-card p-4 text-sm">Thanks! We’ll reach out shortly.</div>

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div className="space-y-1 sm:col-span-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" />
        </div>
        <div className="space-y-1 sm:col-span-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Any questions or notes"
          />
        </div>
      </div>
      <Button onClick={onSubmit} disabled={submitting}>
        {submitting ? "Sending..." : "Send enquiry"}
      </Button>
    </div>
  )
}
