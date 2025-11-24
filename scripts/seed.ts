import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
    const password = await hash("password", 10)

    // 1. Create Users
    const users = [
        { email: "admin@example.com", name: "Admin User", role: "ADMIN" },
        { email: "owner@example.com", name: "Asset Owner", role: "OWNER" },
        { email: "employee@example.com", name: "Employee User", role: "EMPLOYEE" },
    ]

    for (const u of users) {
        await prisma.user.upsert({
            where: { email: u.email },
            update: { role: u.role },
            create: {
                email: u.email,
                name: u.name,
                password,
                role: u.role,
            },
        })
        console.log(`Upserted user: ${u.email}`)
    }

    // 2. Create Asset for Owner
    const owner = await prisma.user.findUnique({ where: { email: "owner@example.com" } })
    if (owner) {
        await prisma.asset.create({
            data: {
                title: "Seed Asset",
                description: "This is a seeded asset for testing.",
                category: "web-app",
                status: "DRAFT",
                version: "1.0.0",
                ownerId: owner.id,
                qaReviewed: false,
                legalReviewed: false,
            },
        })
        console.log("Created seed asset for owner")
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
