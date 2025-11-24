import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import * as z from "zod"

const routeContextSchema = z.object({
    params: z.object({
        id: z.string(),
    }),
})

const assetUpdateSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    category: z.string().min(1),
    version: z.string().min(1),
    githubUrl: z.string().optional(),
    qaReviewed: z.boolean().optional(),
    qaReviewUrl: z.string().optional(),
    legalReviewed: z.boolean().optional(),
    legalReviewUrl: z.string().optional(),
})

export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params
        const session = await getServerSession(authOptions)

        // If user is not authenticated, they can only see PUBLISHED assets
        // If authenticated, they can see everything (or maybe just their own + published? For now everything)

        const asset = await prisma.asset.findUnique({
            where: {
                id,
            },
            include: {
                owner: true,
                versions: true,
                attachments: true,
            },
        })

        if (!asset) {
            return new NextResponse("Not Found", { status: 404 })
        }

        if (!session && asset.status !== "PUBLISHED") {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        return NextResponse.json(asset)
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const asset = await prisma.asset.findUnique({
            where: {
                id,
            },
        })

        if (!asset) {
            return new NextResponse("Not Found", { status: 404 })
        }

        if (asset.ownerId !== session.user.id && session.user.role !== "ADMIN") {
            return new NextResponse("Forbidden", { status: 403 })
        }

        await prisma.asset.delete({
            where: {
                id,
            },
        })

        return new NextResponse(null, { status: 204 })
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export async function PATCH(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const json = await req.json()
        const body = assetUpdateSchema.parse(json)

        const asset = await prisma.asset.findUnique({
            where: {
                id,
            },
        })

        if (!asset) {
            return new NextResponse("Not Found", { status: 404 })
        }

        if (asset.ownerId !== session.user.id && session.user.role !== "ADMIN") {
            return new NextResponse("Forbidden", { status: 403 })
        }

        // Check if version changed
        if (body.version !== asset.version) {
            // Create new version record
            await prisma.assetVersion.create({
                data: {
                    version: asset.version,
                    changes: "Version update", // Could be passed in body
                    assetId: asset.id,
                }
            })
        }

        const updatedAsset = await prisma.asset.update({
            where: {
                id,
            },
            data: {
                title: body.title,
                description: body.description,
                category: body.category,
                version: body.version,
                githubUrl: body.githubUrl,
                qaReviewed: body.qaReviewed,
                qaReviewUrl: body.qaReviewUrl,
                legalReviewed: body.legalReviewed,
                legalReviewUrl: body.legalReviewUrl,
                status: "DRAFT", // Reset to DRAFT on edit? Or keep as is? Let's keep as is or set to PENDING if it was PUBLISHED.
                // For now, let's not change status automatically unless requested.
            },
        })

        return NextResponse.json(updatedAsset)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(JSON.stringify(error.issues), { status: 422 })
        }

        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
