"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { CheckCircle2, Loader2, Send } from "lucide-react"

type Props = {
  collegeId: string
  collegeName: string
}

export function EnquiryForm({ collegeId, collegeName }: Props) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    if (error) setError("")
  }

  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim()) {
      setError("Please enter your name")
      return
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address")
      return
    }
    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      setError("Please enter a valid 10-digit phone number")
      return
    }

    setLoading(true)
    setError("")

    try {
      // Create enquiry in Firestore
      await addDoc(collection(db, "enquiries"), {
        collegeId,
        collegeName,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim(),
        createdAt: serverTimestamp(),
        status: "pending"
      })

      // Show success state
      setSuccess(true)
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: ""
        })
        setSuccess(false)
      }, 3000)

    } catch (err) {
      console.error("Error submitting enquiry:", err)
      setError("Failed to submit enquiry. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Enquiry Submitted!</h3>
        <p className="text-slate-600">
          Thank you for your interest in {collegeName}. We'll get back to you soon.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-slate-700 font-semibold">
          Full Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          className="border-slate-300 focus:border-blue-500"
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-slate-700 font-semibold">
          Email Address <span className="text-red-500">*</span>
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="your.email@example.com"
          value={formData.email}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          className="border-slate-300 focus:border-blue-500"
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-slate-700 font-semibold">
          Phone Number <span className="text-red-500">*</span>
        </Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="1234567890"
          value={formData.phone}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          className="border-slate-300 focus:border-blue-500"
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-slate-700 font-semibold">
          Message (Optional)
        </Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Any specific questions or requirements..."
          value={formData.message}
          onChange={handleChange}
          className="border-slate-300 focus:border-blue-500 min-h-[100px] resize-none"
          disabled={loading}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 animate-shake">
          <p className="text-sm text-red-600 font-medium">{error}</p>
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-6 shadow-lg hover:shadow-xl transition-all"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Send className="w-5 h-5 mr-2" />
            Submit Enquiry
          </>
        )}
      </Button>

      <p className="text-xs text-slate-500 text-center mt-4">
        By submitting this form, you agree to be contacted by {collegeName} or their representatives.
      </p>
    </div>
  )
}