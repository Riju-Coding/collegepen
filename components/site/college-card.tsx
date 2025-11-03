import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type College = {
  id: string
  name: string
  slug?: string
  cityName?: string
  stateName?: string
  iconUrl?: string
}

export function CollegeCard({ college }: { college: College }) {
  const href = `/${college.slug || college.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
  return (
    <Link href={href} className="block">
      <Card className="h-full transition hover:shadow-md">
        <CardHeader className="p-0">
          <img
            src={college.iconUrl || "/placeholder.svg?height=200&width=400&query=college%20image"}
            alt={college.name}
            className="h-40 w-full rounded-t-lg object-cover"
          />
        </CardHeader>
        <CardContent className="p-4 space-y-2">
          <CardTitle className="text-base">{college.name}</CardTitle>
          {(college.cityName || college.stateName) && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="secondary">{[college.cityName, college.stateName].filter(Boolean).join(", ")}</Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
