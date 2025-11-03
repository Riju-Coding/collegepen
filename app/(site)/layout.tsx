import type { ReactNode } from "react"
// import { SiteHeader } from "@/components/frontend/site-header"

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* <SiteHeader /> */}
      <main>{children}</main>
    </>
  )
}
