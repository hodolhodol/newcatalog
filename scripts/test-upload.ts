import { PrismaClient } from "@prisma/client"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

const prisma = new PrismaClient()

async function main() {
    // 1. Simulate File Save (Mocking the API logic)
    const uploadDir = join(process.cwd(), "public", "uploads")
    await mkdir(uploadDir, { recursive: true })
    const filename = `test-upload-${Date.now()}.txt`
    const filepath = join(uploadDir, filename)
    await writeFile(filepath, "This is a test file content.")
    console.log("File saved to:", filepath)

    // 2. Create Asset with Attachment
    const owner = await prisma.user.findFirst({ where: { role: "OWNER" } })
    if (!owner) throw new Error("Owner not found")

    const asset = await prisma.asset.create({
        data: {
            title: "Asset with Attachment",
            description: "Testing attachments",
            category: "web-app",
            version: "1.0.0",
            ownerId: owner.id,
            attachments: {
                create: [
                    {
                        url: `/uploads/${filename}`,
                        name: filename,
                        size: 1024,
                        type: "text/plain",
                    }
                ]
            }
        },
        include: {
            attachments: true
        }
    })

    console.log("Created Asset with Attachments:", asset)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
