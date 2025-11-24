"use client"

import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

export function Navbar() {
    const { data: session } = useSession()

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                <div className="mr-4 hidden md:flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <span className="hidden font-bold sm:inline-block text-lg tracking-tight">
                            In-House Catalog
                        </span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <Link
                            href="/"
                            className="transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                            Catalog
                        </Link>
                        {session && (
                            <Link
                                href="/assets/new"
                                className="transition-colors hover:text-foreground/80 text-foreground/60"
                            >
                                Register Asset
                            </Link>
                        )}
                        {session?.user.role === "ADMIN" && (
                            <Link
                                href="/admin/dashboard"
                                className="transition-colors hover:text-foreground/80 text-foreground/60"
                            >
                                Admin
                            </Link>
                        )}
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        {/* Search could go here */}
                    </div>
                    <div className="flex items-center gap-2">
                        {session ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-muted-foreground">
                                    {session.user.name} ({session.user.role})
                                </span>
                                <Button variant="ghost" size="sm" onClick={() => signOut()}>
                                    Sign Out
                                </Button>
                            </div>
                        ) : (
                            <Button size="sm" onClick={() => signIn()}>
                                Sign In
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
