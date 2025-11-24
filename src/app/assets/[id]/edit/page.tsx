"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { assetSchema, AssetFormValues } from "@/lib/validations/asset"
import { useRouter, useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"

const categories = [
    { label: "Web Application", value: "web-app" },
    { label: "Mobile App", value: "mobile-app" },
    { label: "Library/SDK", value: "library" },
    { label: "Data Model", value: "data-model" },
    { label: "AI Model", value: "ai-model" },
    { label: "Other", value: "other" },
]

export default function AssetEditPage() {
    const router = useRouter()
    const params = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(true)

    const form = useForm<AssetFormValues>({
        resolver: zodResolver(assetSchema) as any,
        defaultValues: {
            title: "",
            overview: "",
            features: "",
            prerequisites: "",
            usageGuideline: "",
            contactPoint: "",
            githubUrl: "",
            qaReviewed: false,
            legalReviewed: false,
            version: "",
        },
    })

    useEffect(() => {
        async function fetchAsset() {
            try {
                const response = await fetch(`/api/assets/${params.id}`)
                if (!response.ok) {
                    throw new Error("Failed to fetch asset")
                }
                const asset = await response.json()

                // Parse description back to fields (naive approach for prototype)
                // In a real app, we might store these separately or use a proper parser
                // For now, we'll just put the whole description in overview if we can't parse it
                // Or better, let's just assume the description is the overview for now to simplify
                // since we combined them in the API.
                // Wait, the API combines them. To edit, we need to split them back?
                // That's tricky. 
                // Strategy: For the prototype, we will just load the description into the "overview" field
                // and leave others empty, OR we should have stored them separately in the DB.
                // Given the schema has only 'description', we are kind of stuck.
                // Let's just put the whole description into 'overview' for editing.

                form.reset({
                    title: asset.title,
                    category: asset.category,
                    overview: asset.description, // Loading full description here
                    features: "", // Cannot easily extract back
                    prerequisites: "", // Cannot easily extract back
                    usageGuideline: "", // Cannot easily extract back
                    contactPoint: "owner@example.com", // Placeholder or need to fetch from owner
                    githubUrl: asset.githubUrl || "",
                    qaReviewed: asset.qaReviewed,
                    qaReviewUrl: asset.qaReviewUrl || "",
                    legalReviewed: asset.legalReviewed,
                    legalReviewUrl: asset.legalReviewUrl || "",
                    version: asset.version,
                })
            } catch (error) {
                toast.error("Failed to load asset details.")
                console.error(error)
            } finally {
                setIsFetching(false)
            }
        }

        if (params.id) {
            fetchAsset()
        }
    }, [params.id, form])

    async function onSubmit(data: AssetFormValues) {
        setIsLoading(true)
        try {
            const response = await fetch(`/api/assets/${params.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                throw new Error("Failed to update asset")
            }

            toast.success("Asset updated successfully!")
            router.push("/")
            router.refresh()
        } catch (error) {
            toast.error("Something went wrong. Please try again.")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    if (isFetching) {
        return <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    return (
        <div className="max-w-2xl mx-auto py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Edit Asset</h1>
                <p className="text-muted-foreground">
                    Update your software asset information.
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Asset Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Employee Portal" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="version"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Version</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. 1.0.0" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Changing this will create a new version history.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.value} value={category.value}>
                                                    {category.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Description</h3>

                        <FormField
                            control={form.control}
                            name="overview"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Overview (Full Description)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Briefly describe what this asset does..."
                                            className="min-h-[200px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        For editing, the full description is loaded here.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Hidden fields for other parts since we merged them on load */}
                        <input type="hidden" {...form.register("features")} />
                        <input type="hidden" {...form.register("prerequisites")} />
                        <input type="hidden" {...form.register("usageGuideline")} />
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Contact & Source</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="contactPoint"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contact Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="contact@company.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="githubUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>GitHub URL</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://github.com/..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Qualifications</h3>
                        <div className="flex flex-col space-y-4 border p-4 rounded-md">
                            <FormField
                                control={form.control}
                                name="qaReviewed"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>
                                                QA Reviewed
                                            </FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            {form.watch("qaReviewed") && (
                                <FormField
                                    control={form.control}
                                    name="qaReviewUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>QA Review Report URL</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Link to QA report" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            <FormField
                                control={form.control}
                                name="legalReviewed"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>
                                                Legal Reviewed
                                            </FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            {form.watch("legalReviewed") && (
                                <FormField
                                    control={form.control}
                                    name="legalReviewUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Legal Review Report URL</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Link to Legal report" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>
                    </div>

                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update Asset
                    </Button>
                </form>
            </Form>
        </div>
    )
}
