import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    const asset = await prisma.asset.findFirst({
        where: { title: "Seed Asset" },
    })
    console.log("Asset ID:", asset?.id)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
