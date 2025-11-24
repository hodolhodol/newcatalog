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
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Loader2 } from "lucide-react"

const categories = [
    { label: "Web Application", value: "web-app" },
    { label: "Mobile App", value: "mobile-app" },
    { label: "Library/SDK", value: "library" },
    { label: "Data Model", value: "data-model" },
    { label: "AI Model", value: "ai-model" },
    { label: "Other", value: "other" },
]

export default function AssetRegistrationPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

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
            attachments: [],
        },
    })

    async function onSubmit(data: AssetFormValues) {
        setIsLoading(true)
        try {
            const response = await fetch("/api/assets", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                throw new Error("Failed to register asset")
            }

            toast.success("Asset registered successfully!")
            router.push("/")
            router.refresh()
        } catch (error) {
            toast.error("Something went wrong. Please try again.")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Register New Asset</h1>
                <p className="text-muted-foreground">
                    Share your software asset with the organization.
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

                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Description</h3>

                        <FormField
                            control={form.control}
                            name="overview"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Overview</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Briefly describe what this asset does..."
                                            className="min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="features"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Key Features</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="- Feature 1&#10;- Feature 2"
                                            className="min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="prerequisites"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Prerequisites</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="e.g. Node.js v18+, Docker"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="usageGuideline"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Usage Guideline</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="How to get started..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                                            <FormDescription>
                                                Has this asset passed Quality Assurance?
                                            </FormDescription>
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
                                            <FormDescription>
                                                Has this asset passed Legal/Compliance review?
                                            </FormDescription>
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

                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Attachments</h3>
                        <div className="border p-4 rounded-md space-y-4">
                            <FormItem>
                                <FormLabel>Upload Files (Images, Docs)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="file"
                                        multiple
                                        onChange={async (e) => {
                                            const files = e.target.files
                                            if (!files) return

                                            const newAttachments = []
                                            for (let i = 0; i < files.length; i++) {
                                                const file = files[i]
                                                const formData = new FormData()
                                                formData.append("file", file)

                                                try {
                                                    const res = await fetch("/api/upload", {
                                                        method: "POST",
                                                        body: formData,
                                                    })

                                                    if (res.ok) {
                                                        const data = await res.json()
                                                        newAttachments.push(data)
                                                        toast.success(`Uploaded ${file.name}`)
                                                    } else {
                                                        toast.error(`Failed to upload ${file.name}`)
                                                    }
                                                } catch (err) {
                                                    console.error(err)
                                                    toast.error("Upload error")
                                                }
                                            }

                                            const current = form.getValues("attachments") || []
                                            form.setValue("attachments", [...current, ...newAttachments])
                                        }}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Supported formats: PNG, JPG, PDF, DOCX.
                                </FormDescription>
                            </FormItem>

                            {/* List uploaded files */}
                            <div className="space-y-2">
                                {form.watch("attachments")?.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 border rounded bg-muted/50">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm font-medium">{file.name}</span>
                                            <span className="text-xs text-muted-foreground">({Math.round(file.size / 1024)} KB)</span>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                const current = form.getValues("attachments") || []
                                                form.setValue("attachments", current.filter((_, i) => i !== index))
                                            }}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Register Asset
                    </Button>
                </form>
            </Form>
        </div>
    )
}
