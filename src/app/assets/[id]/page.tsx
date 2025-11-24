import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Github, Mail, FileText, CheckCircle, Calendar, User, Shield } from "lucide-react"
import { RequestButton } from "@/components/assets/request-button"
import { ReviewSection } from "@/components/assets/review-section"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default async function AssetDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const asset = await prisma.asset.findUnique({
        where: { id },
        include: {
            owner: true,
            attachments: true,
            reviews: {
                include: {
                    user: {
                        select: { name: true, image: true }
                    }
                },
                orderBy: { createdAt: "desc" }
            }
        },
    })

    if (!asset) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 pb-20">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 border-b">
                <div className="container py-8">
                    <Button variant="ghost" asChild className="mb-4 pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground">
                        <Link href="/" className="flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" /> Back to Catalog
                        </Link>
                    </Button>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{asset.title}</h1>
                                <Badge variant="outline" className="text-sm font-medium px-2.5 py-0.5">{asset.version}</Badge>
                                <Badge className="bg-blue-600 hover:bg-blue-700">{asset.category}</Badge>
                            </div>
                            <p className="text-lg text-muted-foreground max-w-3xl">
                                {asset.description.split('\n')[0]}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <RequestButton assetId={asset.id} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Description */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl border p-8 shadow-sm">
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-blue-600" />
                                Documentation
                            </h2>
                            <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                                {asset.description.split('\n').map((line, i) => {
                                    if (line.startsWith('## ')) {
                                        return <h3 key={i} className="text-xl font-semibold mt-8 mb-4 text-slate-900 dark:text-slate-100">{line.replace('## ', '')}</h3>
                                    }
                                    if (line.trim() === '') {
                                        return <br key={i} />
                                    }
                                    return <p key={i} className="mb-2 leading-relaxed">{line}</p>
                                })}
                            </div>
                        </div>

                        {/* Attachments */}
                        {asset.attachments.length > 0 && (
                            <div className="bg-white dark:bg-slate-900 rounded-xl border p-8 shadow-sm">
                                <h2 className="text-xl font-semibold mb-6">Attachments</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {asset.attachments.map(att => (
                                        <a
                                            key={att.id}
                                            href={att.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                                        >
                                            <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mr-4 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
                                                <FileText className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{att.name}</p>
                                                <p className="text-xs text-muted-foreground">{Math.round(att.size / 1024)} KB</p>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Reviews */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl border p-8 shadow-sm">
                            <ReviewSection assetId={asset.id} initialReviews={asset.reviews} />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Owner Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl border p-6 shadow-sm">
                            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Owner</h3>
                            <div className="flex items-center gap-3 mb-4">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={asset.owner.image || undefined} />
                                    <AvatarFallback>{asset.owner.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-medium">{asset.owner.name}</div>
                                    <div className="text-xs text-muted-foreground">{asset.owner.email}</div>
                                </div>
                            </div>
                            <Button variant="outline" className="w-full" asChild>
                                <a href={`mailto:${asset.owner.email}`}>
                                    <Mail className="mr-2 h-4 w-4" /> Contact Owner
                                </a>
                            </Button>
                        </div>

                        {/* Metadata Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl border p-6 shadow-sm">
                            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Details</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground flex items-center gap-2"><Calendar className="w-4 h-4" /> Created</span>
                                    <span>{new Date(asset.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground flex items-center gap-2"><Calendar className="w-4 h-4" /> Updated</span>
                                    <span>{new Date(asset.updatedAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground flex items-center gap-2"><User className="w-4 h-4" /> Views</span>
                                    <span>{asset.views}</span>
                                </div>
                                {asset.githubUrl && (
                                    <div className="pt-4 border-t">
                                        <Button variant="outline" className="w-full" asChild>
                                            <a href={asset.githubUrl} target="_blank" rel="noopener noreferrer">
                                                <Github className="mr-2 h-4 w-4" /> View on GitHub
                                            </a>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Qualifications Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl border p-6 shadow-sm">
                            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <Shield className="w-4 h-4" /> Compliance
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-800">
                                    <span className="text-sm font-medium">QA Review</span>
                                    {asset.qaReviewed ? (
                                        <Badge variant="default" className="bg-green-600 hover:bg-green-700"><CheckCircle className="w-3 h-3 mr-1" /> Passed</Badge>
                                    ) : (
                                        <Badge variant="secondary">Pending</Badge>
                                    )}
                                </div>
                                {asset.qaReviewed && asset.qaReviewUrl && (
                                    <a href={asset.qaReviewUrl} className="text-xs text-blue-600 hover:underline block text-right px-2">View Report</a>
                                )}

                                <div className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-800">
                                    <span className="text-sm font-medium">Legal Review</span>
                                    {asset.legalReviewed ? (
                                        <Badge variant="default" className="bg-green-600 hover:bg-green-700"><CheckCircle className="w-3 h-3 mr-1" /> Passed</Badge>
                                    ) : (
                                        <Badge variant="secondary">Pending</Badge>
                                    )}
                                </div>
                                {asset.legalReviewed && asset.legalReviewUrl && (
                                    <a href={asset.legalReviewUrl} className="text-xs text-blue-600 hover:underline block text-right px-2">View Report</a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
