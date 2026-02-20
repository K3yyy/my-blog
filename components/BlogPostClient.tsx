"use client"

import Link from "next/link"

import { ArrowLeft, BrainCircuit, Clock, Share2, Twitter, Facebook, Linkedin } from "lucide-react"

import { useToast } from "@/components/ui/use-toast"
import { useEffect } from "react"

// Accept post & slug as props from server
export function BlogPostClient({ post, slug }: { post: any; slug: string }) {
    const { toast } = useToast()

    useEffect(() => {
        // Optional: you can add client-side checks here if needed
    }, [])

    const pageUrl = typeof window !== "undefined" ? window.location.href : ""
    const shareText = `Check out this article: ${post.title}`

    const handleShare = (platform: "twitter" | "facebook" | "linkedin" | "clipboard") => {
        if (platform === "clipboard") {
            navigator.clipboard.writeText(pageUrl)
            toast({ title: "Link copied", description: "Article link copied." })
            return
        }

        let shareUrl = ""
        switch (platform) {
            case "twitter":
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}`
                break
            case "facebook":
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`
                break
            case "linkedin":
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`
                break
        }
        if (shareUrl) window.open(shareUrl, "_blank", "noopener,noreferrer")
    }

    return (
        <article className="max-w-3xl mx-auto">
            <Link
                href="/articles"
                className="inline-flex items-center text-gray-400 hover:text-white mb-8 group"
            >
                <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                Back to articles
            </Link>

            {/* Rest of your JSX — category, title, meta, image, share buttons, content, related posts */}
            {/* Copy-paste your original JSX here, replacing post. with post. */}
            {/* Example snippet: */}
            <div className="flex items-center gap-3 text-sm text-purple-400 mb-5">
                <BrainCircuit className="h-5 w-5" />
                <span>{post.category}</span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
                {post.title}
            </h1>

            {/* ... continue with image, meta, prose content, related posts ... */}

            {/* Share buttons use handleShare */}
            {/* <Button onClick={() => handleShare("twitter")}> ... */}
        </article>
    )
}