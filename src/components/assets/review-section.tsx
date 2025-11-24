"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star, User as UserIcon } from "lucide-react"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Review {
    id: string
    rating: number
    comment: string | null
    createdAt: Date | string
    user: {
        name: string | null
        image: string | null
    }
}

export function ReviewSection({ assetId, initialReviews }: { assetId: string, initialReviews: Review[] }) {
    const { data: session } = useSession()
    const [reviews, setReviews] = useState<Review[]>(initialReviews)
    const [rating, setRating] = useState(5)
    const [comment, setComment] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!session) {
            toast.error("Please sign in to review")
            return
        }

        setIsSubmitting(true)
        try {
            const res = await fetch(`/api/assets/${assetId}/reviews`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rating, comment }),
            })

            if (!res.ok) throw new Error("Failed to submit review")

            const newReview = await res.json()
            // Mock the user object for immediate display since API might not return it fully populated depending on implementation
            // But actually my API returns just the review. I should probably re-fetch or construct it.
            // Let's construct it.
            const displayReview: Review = {
                ...newReview,
                user: {
                    name: session.user.name,
                    image: session.user.image
                }
            }

            setReviews([displayReview, ...reviews])
            setComment("")
            setRating(5)
            toast.success("Review submitted!")
        } catch (error) {
            console.error(error)
            toast.error("Failed to submit review")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-8">
            <h3 className="text-2xl font-bold">Reviews ({reviews.length})</h3>

            {session && (
                <form onSubmit={handleSubmit} className="border p-4 rounded-lg space-y-4 bg-muted/30">
                    <h4 className="font-semibold">Write a Review</h4>
                    <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className={`focus:outline-none ${star <= rating ? "text-yellow-500" : "text-gray-300"}`}
                            >
                                <Star className="h-6 w-6 fill-current" />
                            </button>
                        ))}
                    </div>
                    <Textarea
                        placeholder="Share your experience..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                    />
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Post Review"}
                    </Button>
                </form>
            )}

            <div className="space-y-6">
                {reviews.map((review) => (
                    <div key={review.id} className="flex space-x-4 border-b pb-6 last:border-0">
                        <Avatar>
                            <AvatarImage src={review.user.image || undefined} />
                            <AvatarFallback><UserIcon className="h-4 w-4" /></AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                                <span className="font-semibold">{review.user.name || "Anonymous"}</span>
                                <span className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex text-yellow-500">
                                {Array.from({ length: review.rating }).map((_, i) => (
                                    <Star key={i} className="h-4 w-4 fill-current" />
                                ))}
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">{review.comment}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
