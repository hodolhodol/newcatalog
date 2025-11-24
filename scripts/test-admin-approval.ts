import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    // 1. Find a DRAFT asset
    const asset = await prisma.asset.findFirst({
        where: { status: "DRAFT" },
    })

    if (!asset) {
        console.log("No DRAFT assets found to approve.")
        return
    }

    console.log(`Found asset: ${asset.title} (${asset.status})`)

    // 2. Simulate Admin Approval (Direct DB update as we are testing logic)
    // In real app, API does this check.

    const updatedAsset = await prisma.asset.update({
        where: { id: asset.id },
        data: { status: "PUBLISHED" },
    })

    console.log(`Updated asset: ${updatedAsset.title} (${updatedAsset.status})`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
