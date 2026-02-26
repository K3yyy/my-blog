"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ArrowRight, BrainCircuit, Clock } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Header } from "@/components/Header"
import { useRouter } from "next/navigation"

// Keep your existing Post type (with sections + image_urls)
type Post = {
    title: string
    date: string
    author: string
    category: string
    readTime: string
    sections: string[]         // html strings
    image_urls?: string[]      // optional — may be shorter or longer than sections
    // ... other fields
}

type BlogPostClientProps = {
    post: Post
    slug: string
    prevPost?: { title: string; slug: string } | null
    nextPost?: { title: string; slug: string } | null
}

export function BlogPostClient({
                                   post,
                                   slug,
                                   prevPost = null,
                                   nextPost = null,
                               }: BlogPostClientProps) {
    const { toast } = useToast()
    const router = useRouter()

    const sections = post.sections || []
    const images = post.image_urls || []

    // Number of steps = length of the longer array
    const totalPages = Math.max(sections.length, images.length) || 1
    const [currentPage, setCurrentPage] = useState(0)

    const hasPrev = currentPage > 0
    const hasNext = currentPage < totalPages - 1

    // Get content for current page (may have text only, image only, or both)
    const currentText = sections[currentPage] || null
    const currentImage = images[currentPage] || null

    const pageUrl = typeof window !== "undefined" ? window.location.href : ""

    const handleSubscribeClick = () => router.push("/#newsletter")

    const handleShare = (platform: "clipboard" | "facebook" | "instagram") => {
        // your existing share logic...
    }

    return (
        <>
            <Header onSubscribeClick={handleSubscribeClick} />

            <main className="container mx-auto px-4 py-10 md:py-16 lg:py-20">
                <article className="max-w-4xl mx-auto">

                    {/* Title + Meta + Back button – keep as is */}

                    {/* ─── Main content: show matching image + text ─── */}
                    <div className="mb-16 space-y-10 md:space-y-12">
                        {/* Image – shown when available for this index */}
                        {currentImage && (
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-800/40 bg-gray-950">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                                <Image
                                    src={currentImage}
                                    alt={`${post.title} – visual ${currentPage + 1}`}
                                    width={1200}
                                    height={800}
                                    className="w-full aspect-[16/10] md:aspect-[16/9] object-cover"
                                    quality={85}
                                    priority={currentPage < 3}
                                />
                            </div>
                        )}

                        {/* Text – shown when available for this index */}
                        {currentText ? (
                            <div
                                className="prose prose-invert prose-lg prose-purple max-w-none prose-headings:text-white prose-headings:font-extrabold prose-a:text-purple-400 hover:prose-a:text-purple-300 prose-blockquote:border-purple-500/60 prose-blockquote:bg-purple-950/30 prose-blockquote:p-6 prose-blockquote:rounded-xl prose-code:bg-gray-900/70 prose-code:rounded [&>p]:leading-relaxed [&>p]:text-gray-200"
                                dangerouslySetInnerHTML={{ __html: currentText }}
                            />
                        ) : (
                            !currentImage && (
                                <p className="text-gray-400 text-center py-20 italic">
                                    No content available for this page
                                </p>
                            )
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-center gap-6 sm:gap-10 mt-8 mb-20">
                        <button
                            disabled={!hasPrev}
                            onClick={() => hasPrev && setCurrentPage(p => p - 1)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                                hasPrev
                                    ? "bg-purple-950/50 border border-purple-600/50 text-purple-100 hover:bg-purple-900/60"
                                    : "opacity-40 cursor-not-allowed bg-gray-900/30 border border-gray-800 text-gray-500"
                            }`}
                        >
                            <ArrowLeft className="h-5 w-5" /> Prev
                        </button>

                        <div className="text-lg font-semibold text-gray-300">
                            <span className="text-purple-400 font-bold">{currentPage + 1}</span>
                            <span className="text-gray-600 mx-2">/</span>
                            {totalPages}
                        </div>

                        <button
                            disabled={!hasNext}
                            onClick={() => hasNext && setCurrentPage(p => p + 1)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                                hasNext
                                    ? "bg-purple-950/50 border border-purple-600/50 text-purple-100 hover:bg-purple-900/60"
                                    : "opacity-40 cursor-not-allowed bg-gray-900/30 border border-gray-800 text-gray-500"
                            }`}
                        >
                            Next <ArrowRight className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Prev/Next article teasers – keep as is */}

                </article>
            </main>
        </>
    )
}