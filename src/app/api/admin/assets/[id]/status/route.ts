import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import * as z from "zod"

const statusSchema = z.object({
    status: z.enum(["DRAFT", "PENDING", "PUBLISHED", "REJECTED"]),
})

export async function PATCH(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { id } = await context.params
        const json = await req.json()
        const { status } = statusSchema.parse(json)

        const updatedAsset = await prisma.asset.update({
            where: {
                id,
            },
            data: {
                status,
            },
        })

        return NextResponse.json(updatedAsset)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(JSON.stringify(error.issues), { status: 422 })
        }

        console.error(error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
