import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

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

        await prisma.$transaction([
            prisma.usageHistory.create({
                data: {
                    assetId: id,
                    userId: session.user.id,
                    status: "APPROVED", // Auto-approve for now
                }
            }),
            prisma.asset.update({
                where: { id },
                data: {
                    usageCount: { increment: 1 }
                }
            })
        ])

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error(error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
