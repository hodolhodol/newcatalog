import { prisma } from "@/lib/prisma"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Search, ArrowRight, Star, Eye } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function Home({
  searchParams,
}: {
  searchParams: { q?: string; category?: string }
}) {
  const query = searchParams.q || ""
  const category = searchParams.category || ""

  const where: any = {
    status: "PUBLISHED",
  }

  if (query) {
    where.OR = [
      { title: { contains: query } },
      { description: { contains: query } },
    ]
  }

  if (category && category !== "all") {
    where.category = category
  }

  const assets = await prisma.asset.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      owner: {
        select: { name: true },
      },
    },
  })

  const categories = [
    { label: "All", value: "all" },
    { label: "Web App", value: "web-app" },
    { label: "Mobile App", value: "mobile-app" },
    { label: "Library", value: "library" },
    { label: "Data Model", value: "data-model" },
    { label: "AI Model", value: "ai-model" },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-20">
        <div className="container text-center space-y-6">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
            Discover Internal Software Assets
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Accelerate your development by reusing high-quality, approved internal tools, libraries, and models.
          </p>
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <form action="/">
              <Input
                name="q"
                placeholder="Search for assets..."
                className="pl-10 h-12 text-black bg-white/95 border-0 focus-visible:ring-2 focus-visible:ring-blue-500"
                defaultValue={query}
              />
              {category && <input type="hidden" name="category" value={category} />}
            </form>
          </div>
        </div>
      </section>

      <div className="container py-10 flex-1">
        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-6 mb-4">
          {categories.map((c) => (
            <Button
              key={c.value}
              variant={category === c.value || (!category && c.value === "all") ? "default" : "outline"}
              className="rounded-full"
              asChild
            >
              <Link href={`/?category=${c.value}&q=${query}`}>
                {c.label}
              </Link>
            </Button>
          ))}
        </div>

        {/* Asset Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <div className="text-muted-foreground text-lg">No assets found matching your criteria.</div>
              <Button variant="link" asChild className="mt-2">
                <Link href="/">Clear Filters</Link>
              </Button>
            </div>
          ) : (
            assets.map((asset) => (
              <Card key={asset.id} className="group flex flex-col hover:shadow-xl transition-all duration-300 border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="bg-slate-100 dark:bg-slate-800 font-medium">{asset.category}</Badge>
                    <div className="flex items-center text-xs text-muted-foreground gap-3">
                      <span className="flex items-center"><Eye className="w-3 h-3 mr-1" /> {asset.views}</span>
                      <span className="flex items-center"><Star className="w-3 h-3 mr-1" /> {asset.likes}</span>
                    </div>
                  </div>
                  <CardTitle className="line-clamp-1 text-xl group-hover:text-blue-600 transition-colors">
                    {asset.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 mt-2">
                    {asset.description.split('\n')[0]}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex items-center text-sm text-muted-foreground space-x-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                      {asset.owner.name?.charAt(0)}
                    </div>
                    <span>{asset.owner.name}</span>
                    <span>•</span>
                    <span>v{asset.version}</span>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 bg-slate-50/50 dark:bg-slate-900/50">
                  <Button asChild className="w-full group-hover:bg-blue-600 transition-colors">
                    <Link href={`/assets/${asset.id}`}>
                      View Details <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
