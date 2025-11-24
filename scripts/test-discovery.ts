import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    // 1. Search for PUBLISHED assets
    const assets = await prisma.asset.findMany({
        where: { status: "PUBLISHED" },
        include: { owner: true }
    })

    console.log(`Found ${assets.length} PUBLISHED assets`)
    assets.forEach(a => console.log(`- ${a.title} by ${a.owner.name}`))

    if (assets.length === 0) return

    // 2. Fetch Detail for first asset
    const firstId = assets[0].id
    const detail = await prisma.asset.findUnique({
        where: { id: firstId },
        include: { attachments: true }
    })

    console.log("\nAsset Detail:")
    console.log(`Title: ${detail?.title}`)
    console.log(`Attachments: ${detail?.attachments.length}`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
