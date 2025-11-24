"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Loader2, CheckCircle, XCircle, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import Link from "next/link"

interface Asset {
    id: string
    title: string
    category: string
    status: string
    owner: {
        name: string | null
        email: string | null
    }
    createdAt: string
}

export default function AdminDashboardPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [assets, setAssets] = useState<Asset[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin")
        } else if (status === "authenticated") {
            if (session.user.role !== "ADMIN") {
                toast.error("Unauthorized access")
                router.push("/")
            } else {
                fetchAssets()
            }
        }
    }, [status, session, router])

    async function fetchAssets() {
        try {
            // In a real app, we'd have a dedicated admin endpoint with pagination
            // For now, we'll fetch all assets and filter client-side or use a simple list endpoint
            // We need an endpoint to list ALL assets for admin.
            // Let's assume GET /api/assets returns all for now (or we create a new one)
            // Actually, GET /api/assets usually returns published ones for public.
            // We need a specific admin fetch.
            // Let's create GET /api/admin/assets

            const res = await fetch("/api/admin/assets")
            if (!res.ok) throw new Error("Failed to fetch assets")
            const data = await res.json()
            setAssets(data)
        } catch (error) {
            console.error(error)
            toast.error("Failed to load assets")
        } finally {
            setIsLoading(false)
        }
    }

    async function updateStatus(id: string, newStatus: string) {
        try {
            const res = await fetch(`/api/admin/assets/${id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            })

            if (!res.ok) throw new Error("Failed to update status")

            toast.success(`Asset ${newStatus.toLowerCase()} successfully`)
            fetchAssets() // Refresh list
        } catch (error) {
            console.error(error)
            toast.error("Failed to update status")
        }
    }

    if (status === "loading" || isLoading) {
        return <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    if (session?.user.role !== "ADMIN") {
        return null // Will redirect in useEffect
    }

    return (
        <div className="container py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage asset approvals and system status.</p>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Owner</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {assets.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24">
                                    No assets found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            assets.map((asset) => (
                                <TableRow key={asset.id}>
                                    <TableCell className="font-medium">{asset.title}</TableCell>
                                    <TableCell>{asset.category}</TableCell>
                                    <TableCell>{asset.owner.name || asset.owner.email}</TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            asset.status === "PUBLISHED" ? "default" :
                                                asset.status === "REJECTED" ? "destructive" : "secondary"
                                        }>
                                            {asset.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{new Date(asset.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button size="sm" variant="outline" asChild>
                                            <Link href={`/assets/${asset.id}/edit`}>
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        {asset.status !== "PUBLISHED" && (
                                            <Button
                                                size="sm"
                                                onClick={() => updateStatus(asset.id, "PUBLISHED")}
                                                className="bg-green-600 hover:bg-green-700"
                                            >
                                                <CheckCircle className="h-4 w-4 mr-1" /> Approve
                                            </Button>
                                        )}
                                        {asset.status !== "REJECTED" && (
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => updateStatus(asset.id, "REJECTED")}
                                            >
                                                <XCircle className="h-4 w-4 mr-1" /> Reject
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
