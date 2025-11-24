import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    const assetId = "cmicsqdah00045fn8w2zk2dvi" // Seed Asset ID

    // 1. Get current asset
    const asset = await prisma.asset.findUnique({ where: { id: assetId } })
    console.log("Current Version:", asset?.version)

    if (!asset) return

    // 2. Simulate Update with new version
    const newVersion = "1.1.0"

    // Logic from route.ts
    if (newVersion !== asset.version) {
        await prisma.assetVersion.create({
            data: {
                assetId: asset.id,
                version: asset.version,
                changes: "Updated via script",
            }
        })
    }

    const updatedAsset = await prisma.asset.update({
        where: { id: assetId },
        data: {
            version: newVersion,
            title: "Seed Asset Updated (Script)",
        }
    })

    console.log("Updated Version:", updatedAsset.version)

    // 3. Verify History
    const history = await prisma.assetVersion.findMany({ where: { assetId } })
    console.log("Version History:", history)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
