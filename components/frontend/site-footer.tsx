"use client"

import Link from "next/link"
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, GraduationCap, ArrowRight, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export function SiteFooter() {
  const currentYear = new Date().getFullYear()
  const [email, setEmail] = useState("")

  const handleNewsletterSubmit = () => {
    if (email) {
      console.log("Newsletter subscription:", email)
      setEmail("")
    }
  }

  return (
    <footer className="w-full bg-slate-900 text-slate-300 mt-auto">
      {/* Newsletter Section */}
      <div className="border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-2">Stay Updated</h3>
              <p className="text-slate-400">Get the latest college news, admission updates, and career guidance delivered to your inbox.</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleNewsletterSubmit()}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 min-w-[280px]"
              />
              <Button onClick={handleNewsletterSubmit} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 gap-2">
                <Send size={16} />
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <GraduationCap size={22} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">CollegePen</h3>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-md">
              India's most trusted college discovery and comparison platform. We help thousands of students every year find their perfect educational institution and achieve their career dreams.
            </p>
            <div className="flex gap-3 pt-2">
              <Link 
                href="#" 
                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white transition-all"
              >
                <Facebook size={18} />
              </Link>
              <Link 
                href="#" 
                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 hover:bg-blue-400 text-slate-400 hover:text-white transition-all"
              >
                <Twitter size={18} />
              </Link>
              <Link 
                href="#" 
                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 hover:bg-blue-700 text-slate-400 hover:text-white transition-all"
              >
                <Linkedin size={18} />
              </Link>
              <Link 
                href="#" 
                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 hover:bg-pink-600 text-slate-400 hover:text-white transition-all"
              >
                <Instagram size={18} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-lg">Explore</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/colleges" className="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  Browse Colleges
                </Link>
              </li>
              <li>
                <Link href="/streams" className="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  Streams
                </Link>
              </li>
              <li>
                <Link href="/courses" className="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/compare" className="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  Compare Colleges
                </Link>
              </li>
              <li>
                <Link href="/rankings" className="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  Rankings
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-lg">Resources</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/blog" className="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  Blog & Articles
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  Admission Guides
                </Link>
              </li>
              <li>
                <Link href="/scholarships" className="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  Scholarships
                </Link>
              </li>
              <li>
                <Link href="/career-counselling" className="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  Career Counselling
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-lg">Contact</h4>
            <ul className="space-y-4">
              <li className="flex gap-3 items-start">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-800 flex-shrink-0">
                  <Mail size={18} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Email Us</p>
                  <a href="mailto:info@collegepen.com" className="text-slate-300 hover:text-blue-400 transition-colors">
                    info@collegepen.com
                  </a>
                </div>
              </li>
              <li className="flex gap-3 items-start">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-800 flex-shrink-0">
                  <Phone size={18} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Call Us</p>
                  <a href="tel:+919876543210" className="text-slate-300 hover:text-blue-400 transition-colors">
                    +91 98765 43210
                  </a>
                </div>
              </li>
              <li className="flex gap-3 items-start">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-800 flex-shrink-0">
                  <MapPin size={18} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Visit Us</p>
                  <span className="text-slate-300">Connaught Place, New Delhi, India</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">
              © {currentYear} CollegePen. All rights reserved. Made with ❤️ in India
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/privacy" className="text-sm text-slate-500 hover:text-blue-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-slate-500 hover:text-blue-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-sm text-slate-500 hover:text-blue-400 transition-colors">
                Cookie Policy
              </Link>
              <Link href="/sitemap" className="text-sm text-slate-500 hover:text-blue-400 transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}