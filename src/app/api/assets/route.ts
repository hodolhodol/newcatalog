import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { assetSchema } from "@/lib/validations/asset"
import * as z from "zod"

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const json = await req.json()
        const body = assetSchema.parse(json)

        const asset = await prisma.asset.create({
            data: {
                title: body.title,
                category: body.category,
                description: `${body.overview}\n\n## Features\n${body.features || ""}\n\n## Prerequisites\n${body.prerequisites || ""}\n\n## Usage\n${body.usageGuideline || ""}\n\n## Contact\n${body.contactPoint}`,
                version: "1.0.0",
                githubUrl: body.githubUrl,
                ownerId: session.user.id,
                qaReviewed: body.qaReviewed,
                qaReviewUrl: body.qaReviewUrl,
                legalReviewed: body.legalReviewed,
                legalReviewUrl: body.legalReviewUrl,
                attachments: {
                    create: body.attachments?.map(att => ({
                        url: att.url,
                        name: att.name,
                        size: att.size,
                        type: att.type,
                    }))
                }
            },
        })

        return NextResponse.json(asset)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(JSON.stringify(error.issues), { status: 422 })
        }

        console.error(error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
