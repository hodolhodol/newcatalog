import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import * as z from "zod"

const reviewSchema = z.object({
    rating: z.number().min(1).max(5),
    comment: z.string().optional(),
})

export async function POST(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        const { id } = await context.params

        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const json = await req.json()
        const body = reviewSchema.parse(json)

        const review = await prisma.review.create({
            data: {
                assetId: id,
                userId: session.user.id,
                rating: body.rating,
                comment: body.comment,
            },
        })

        return NextResponse.json(review)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(JSON.stringify(error.issues), { status: 422 })
        }
        console.error(error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params
        const reviews = await prisma.review.findMany({
            where: { assetId: id },
            include: {
                user: {
                    select: { name: true, image: true }
                }
            },
            orderBy: { createdAt: "desc" }
        })
        return NextResponse.json(reviews)
    } catch (error) {
        console.error(error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
