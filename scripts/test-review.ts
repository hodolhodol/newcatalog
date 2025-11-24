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

    // 2. Simulate Review
    const review = await prisma.review.create({
        data: {
            assetId: asset.id,
            userId: user.id,
            rating: 5,
            comment: "Great asset! Very useful.",
        }
    })

    console.log("Created Review:", review)

    // 3. Verify Fetch
    const fetchedReviews = await prisma.review.findMany({
        where: { assetId: asset.id },
        include: { user: true }
    })

    console.log(`Fetched ${fetchedReviews.length} reviews for asset ${asset.title}`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
