import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    // 1. Get an asset and a user
    const asset = await prisma.asset.findFirst({ where: { status: "PUBLISHED" } })
    const user = await prisma.user.findFirst({ where: { role: "EMPLOYEE" } })

    if (!asset || !user) {
        console.log("No asset or user found.")
        return
    }

    console.log(`Initial Usage Count: ${asset.usageCount}`)

    // 2. Simulate Request (Direct DB insert as we are testing logic)
    await prisma.$transaction([
        prisma.usageHistory.create({
            data: {
                assetId: asset.id,
                userId: user.id,
                status: "APPROVED",
            }
        }),
        prisma.asset.update({
            where: { id: asset.id },
            data: {
                usageCount: { increment: 1 }
            }
        })
    ])

    // 3. Verify
    const updatedAsset = await prisma.asset.findUnique({ where: { id: asset.id } })
    console.log(`Updated Usage Count: ${updatedAsset?.usageCount}`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
