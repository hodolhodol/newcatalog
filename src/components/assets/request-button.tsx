"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export function RequestButton({ assetId }: { assetId: string }) {
    const [isLoading, setIsLoading] = useState(false)

    async function handleRequest() {
        setIsLoading(true)
        try {
            const res = await fetch(`/api/assets/${assetId}/request`, {
                method: "POST",
            })

            if (!res.ok) {
                if (res.status === 401) {
                    toast.error("Please sign in to request access")
                    return
                }
                throw new Error("Failed to request access")
            }

            toast.success("Access requested successfully!")
        } catch (error) {
            console.error(error)
            toast.error("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button className="w-full mb-3" size="lg" onClick={handleRequest} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Request Access
        </Button>
    )
}
