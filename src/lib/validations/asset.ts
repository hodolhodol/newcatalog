import * as z from "zod"

export const assetSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }),
    category: z.string().min(1, {
        message: "Please select a category.",
    }),
    overview: z.string().min(10, {
        message: "Overview must be at least 10 characters.",
    }),
    features: z.string().optional(),
    prerequisites: z.string().optional(),
    usageGuideline: z.string().optional(),
    contactPoint: z.string().email({
        message: "Please enter a valid email address.",
    }),
    githubUrl: z.string().url({
        message: "Please enter a valid URL.",
    }).optional().or(z.literal("")),

    // Qualifications
    qaReviewed: z.boolean().default(false),
    qaReviewUrl: z.string().optional(),
    legalReviewed: z.boolean().default(false),
    legalReviewUrl: z.string().optional(),

    version: z.string().optional(),

    attachments: z.array(z.object({
        url: z.string(),
        name: z.string(),
        size: z.number(),
        type: z.string(),
    })).optional(),
})

export type AssetFormValues = z.infer<typeof assetSchema>
