import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function FeatureCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Feature title="Add properties fast" desc="Guided intake with essential fields and media uploads." />
      <Feature title="Team collaboration" desc="Assign listings, track changes, and control permissions." />
      <Feature title="Publish beautiful pages" desc="Clean, responsive listing pages with search and filters." />
    </div>
  )
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">{desc}</CardContent>
    </Card>
  )
}
