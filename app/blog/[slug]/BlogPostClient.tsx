"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ArrowRight, BrainCircuit, Clock, Share2, Facebook, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Header } from "@/components/Header"
import { useRouter } from "next/navigation"

type Post = {
    title: string
    date: string
    author: string
    category: string
    readTime: string
    image_urls: string[]
    image: string
    sections: string[]
}

type BlogPostClientProps = {
    post: Post
    slug: string
    // Optional: for article navigation at bottom
    prevPost?: { title: string; slug: string } | null
    nextPost?: { title: string; slug: string } | null
}

export function BlogPostClient({
                                   post,
                                   prevPost = null,
                                   nextPost = null,
                               }: BlogPostClientProps) {
    const { toast } = useToast()
    const router = useRouter()
    const [currentPage, setCurrentPage] = useState(0)

    const totalPages = post.sections.length
    const hasPrev = currentPage > 0
    const hasNext = currentPage < totalPages - 1

    const pageUrl = typeof window !== "undefined" ? window.location.href : ""

    const handleSubscribeClick = () => {
        router.push("/#newsletter")
    }

    const handleShare = (platform: "instagram" | "facebook" | "clipboard") => {
        if (platform === "clipboard") {
            navigator.clipboard.writeText(pageUrl)
            toast({
                title: "Link copied",
                description: "Article link copied to clipboard.",
            })
            return
        }

        let shareUrl = ""
        switch (platform) {
            case "facebook":
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`
                break
            case "instagram":
                shareUrl = `https://www.instagram.com/k3y_yy/`
                break
        }

        if (shareUrl) {
            window.open(shareUrl, "_blank", "noopener,noreferrer")
        }
    }

    return (
        <>
            <Header onSubscribeClick={handleSubscribeClick} />

            <main className="container mx-auto px-4 py-10 md:py-16 lg:py-20">
                <article className="max-w-3xl mx-auto relative">
                    {/* Back + Category */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                        <Link
                            href="/articles"
                            className="inline-flex items-center text-gray-400 hover:text-purple-300 transition-colors group"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                            Back to articles
                        </Link>

                        <div className="flex items-center gap-2.5 bg-gray-900/60 backdrop-blur-md border border-gray-800/70 px-4 py-1.5 rounded-full text-sm text-blue-300 shadow-lg">
                            <BrainCircuit className="h-4 w-4" />
                            <span>{post.category || "Uncategorized"}</span>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 bg-gradient-to-r from-blue-500 via-blue-200 to-purple-400 bg-clip-text text-transparent">
                        {post.title}
                    </h1>

                    {/* Meta */}
                    <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-300 mb-10 bg-gray-950/40 backdrop-blur-lg border border-gray-800/50 p-5 rounded-xl shadow-xl">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-400" />
                            <span>{post.readTime}</span>
                        </div>
                        <span className="text-gray-700">•</span>
                        <time dateTime={post.date} className="text-gray-300">
                            {post.date}
                            {/* Uncomment for Khmer date:
              {new Date(post.date).toLocaleDateString('km-KH', { year: 'numeric', month: 'long', day: 'numeric' })}
              */}
                        </time>
                        <span className="text-gray-700">•</span>
                        <span className="italic">By {post.author}</span>
                    </div>

                    {/* Share Sidebar (desktop) */}
                    <div className="hidden lg:block lg:top-24 lg:float-right lg:ml-12 lg:w-14 lg:-mr-48 mb-10 lg:mb-0">
                        <div className="flex lg:flex-col justify-center gap-16 backdrop-blur-xl border border-gray-800/60 p-2 rounded-2xl shadow-xl">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-purple-400 hover:text-purple-300 hover:bg-purple-950/40"
                                onClick={() => handleShare("facebook")}
                                aria-label="Share on Facebook"
                            >
                                <Facebook className="h-5 w-5" />
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-purple-400 hover:text-purple-300 hover:bg-purple-950/40"
                                onClick={() => handleShare("instagram")}
                                aria-label="Visit Instagram profile"
                            >
                                <Instagram className="h-5 w-5" />
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-purple-400 hover:text-purple-300 hover:bg-purple-950/40"
                                onClick={() => handleShare("clipboard")}
                                aria-label="Copy link to clipboard"
                            >
                                <Share2 className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Hero Image */}
                    {/* Hero Image – use first image from array or fallback */}
                    <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden mb-14 shadow-2xl shadow-purple-900/20 border border-gray-800/60 group">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                        <Image
                            src={post.image_urls?.[1]|| '/images/placeholder-article.jpg'}
                            alt={`Cover image for ${post.title}`}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            priority
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 85vw, 1100px"
                            quality={82}
                        />
                    </div>

                    {/* Current Page Content */}
                    <div
                        className="prose prose-invert prose-lg prose-purple max-w-none mb-16 prose-headings:text-white prose-headings:font-extrabold prose-a:text-purple-400 hover:prose-a:text-purple-300 prose-a:transition-colors prose-blockquote:border-purple-500/60 prose-blockquote:bg-purple-950/30 prose-blockquote:p-6 prose-blockquote:rounded-xl prose-code:bg-gray-900/70 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded [&>p]:leading-relaxed [&>p]:text-gray-200"
                        dangerouslySetInnerHTML={{
                            __html: post.sections[currentPage] || "<p>No content available for this page.</p>",
                        }}
                    />

                    {/* Pagination Controls */}
                    <div className="flex items-center justify-center gap-4 sm:gap-8 mt-10 mb-16 px-4">
                        {/* Prev */}
                        <button
                            type="button"
                            disabled={!hasPrev}
                            onClick={() => hasPrev && setCurrentPage(p => p - 1)}
                            className={`group flex items-center gap-1.5 px-4 py-2.5 min-w-[110px] sm:min-w-[120px] text-sm sm:text-base font-medium text-purple-200 bg-purple-950/30 border border-purple-600/40 hover:bg-purple-900/50 hover:border-purple-500/70 hover:text-white disabled:opacity-40 disabled:pointer-events-none rounded-lg shadow-sm transition-all duration-250 ease-out active:scale-95 touch-manipulation`}
                        >
                            <ArrowLeft className="h-3 w-3 sm:h-4.5 sm:w-4.5 transition-transform group-hover:-translate-x-0.5" />
                            Prev
                        </button>

                        {/* Center indicator */}
                        <div className="flex flex-col items-center min-w-[80px] sm:min-w-[100px]">
                            <div className="text-xs sm:text-sm font-semibold text-gray-300 tracking-wide">
                                <span className="text-purple-300 font-bold">{currentPage + 1}</span>
                                <span className="text-gray-600 mx-1">/</span>
                                {totalPages}
                            </div>
                            {/* Progress bar */}
                            <div className="w-20 sm:w-28 h-1.5 mt-1.5 bg-gray-800/70 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-400 ease-out"
                                    style={{ width: `${Math.min(100, ((currentPage + 1) / totalPages) * 100)}%` }}
                                />
                            </div>
                        </div>

                        {/* Next */}
                        <button
                            type="button"
                            disabled={!hasNext}
                            onClick={() => hasNext && setCurrentPage(p => p + 1)}
                            className={`group flex items-center gap-1.5 px-4 py-2.5 min-w-[110px] sm:min-w-[120px] text-sm sm:text-base font-medium text-purple-200 bg-purple-950/30 border border-blue-600/40 hover:bg-purple-900/50 hover:border-purple-500/70 hover:text-white disabled:opacity-40 disabled:pointer-events-none rounded-lg shadow-sm transition-all duration-250 ease-out active:scale-95 touch-manipulation`}
                        >
                            Next
                            <ArrowRight className="h-4 w-4 sm:h-4.5 sm:w-4.5 transition-transform group-hover:translate-x-0.5" />
                        </button>
                    </div>

                    {/* Next / Previous Article Teasers */}
                    <div className="grid md:grid-cols-2 gap-6 mt-16 border-t border-gray-800 pt-12">
                        {prevPost ? (
                            <Link
                                href={`/blog/${prevPost.slug}`}
                                className="group p-6 bg-gray-900/60 backdrop-blur-lg border border-gray-800/70 rounded-2xl hover:border-purple-500/50 transition-all hover:shadow-purple-900/20 hover:-translate-y-1"
                            >
                                <div className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                                    <ArrowLeft className="h-4 w-4" />
                                    Previous article
                                </div>
                                <h3 className="font-semibold text-lg group-hover:text-purple-300 transition-colors line-clamp-2">
                                    {prevPost.title}
                                </h3>
                            </Link>
                        ) : <div />}

                        {nextPost ? (
                            <Link
                                href={`/blog/${nextPost.slug}`}
                                className="group p-6 bg-gray-900/60 backdrop-blur-lg border border-gray-800/70 rounded-2xl hover:border-purple-500/50 transition-all hover:shadow-purple-900/20 hover:-translate-y-1 md:text-right"
                            >
                                <div className="text-sm text-gray-400 mb-2 flex items-center justify-end gap-2">
                                    Next article
                                    <ArrowRight className="h-4 w-4" />
                                </div>
                                <h3 className="font-semibold text-lg group-hover:text-purple-300 transition-colors line-clamp-2">
                                    {nextPost.title}
                                </h3>
                            </Link>
                        ) : <div />}
                    </div>
                </article>
            </main>
        </>
    )
}