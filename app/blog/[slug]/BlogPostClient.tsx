// app/blog/[slug]/BlogPostClient.tsx
"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, BrainCircuit, Clock, Share2, Twitter, Facebook, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

type Post = {
    title: string
    date: string
    author: string
    category: string
    readTime: string
    image: string
    content: string
    relatedPosts: Array<{
        title: string
        category: string
        image: string
        slug: string
    }>
}

export function BlogPostClient({ post, slug }: { post: Post; slug: string }) {
    const { toast } = useToast()

    const pageUrl = typeof window !== "undefined" ? window.location.href : ""
    const shareText = `Check out this article: ${post.title}`

    const handleShare = (platform: "twitter" | "facebook" | "linkedin" | "clipboard") => {
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

        if (shareUrl) {
            window.open(shareUrl, "_blank", "noopener,noreferrer")
        }
    }

    return (
        <>
            {/* Header with Subscribe button – now safe in Client Component */}
            <header className="container mx-auto py-6 px-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="text-xl md:text-2xl font-bold tracking-tight">
                        Neural<span className="text-purple-500">Pulse</span>
                    </Link>

                    <Button
                        variant="outline"
                        className="border-purple-500 text-purple-500 hover:bg-purple-950 hover:text-white"
                        onClick={() => {
                            document.getElementById("newsletter")?.scrollIntoView({ behavior: "smooth" })
                        }}
                    >
                        Subscribe
                    </Button>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12">
                <article className="max-w-3xl mx-auto">
                    <Link
                        href="/articles"
                        className="inline-flex items-center text-gray-400 hover:text-white mb-8 group"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                        Back to articles
                    </Link>

                    <div className="flex items-center gap-3 text-sm text-purple-400 mb-5">
                        <BrainCircuit className="h-5 w-5" />
                        <span>{post.category}</span>
                    </div>

                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
                        {post.title}
                    </h1>

                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-400 mb-10">
                        <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            <span>{post.readTime}</span>
                        </div>
                        <span className="text-gray-600">•</span>
                        <time dateTime={post.date}>{post.date}</time>
                        <span className="text-gray-600">•</span>
                        <span>By {post.author}</span>
                    </div>

                    <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-gray-800 mb-10 shadow-2xl shadow-black/30">
                        <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover"
                            priority
                            sizes="(max-width: 768px) 100vw, 800px"
                        />
                    </div>

                    <div className="flex flex-wrap justify-between items-center gap-4 mb-12">
                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-9 border-gray-700 hover:bg-gray-900 hover:text-purple-300"
                                onClick={() => handleShare("twitter")}
                            >
                                <Twitter className="h-4 w-4 mr-2" />
                                Twitter
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-9 border-gray-700 hover:bg-gray-900 hover:text-purple-300"
                                onClick={() => handleShare("facebook")}
                            >
                                <Facebook className="h-4 w-4 mr-2" />
                                Facebook
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-9 border-gray-700 hover:bg-gray-900 hover:text-purple-300"
                                onClick={() => handleShare("linkedin")}
                            >
                                <Linkedin className="h-4 w-4 mr-2" />
                                LinkedIn
                            </Button>
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            className="h-9 border-gray-700 hover:bg-gray-900 hover:text-purple-300"
                            onClick={() => handleShare("clipboard")}
                        >
                            <Share2 className="h-4 w-4 mr-2" />
                            Copy link
                        </Button>
                    </div>

                    <div
                        className="prose prose-invert prose-purple max-w-none prose-headings:text-white prose-a:text-purple-400 hover:prose-a:text-purple-300 prose-blockquote:border-purple-500/50"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {post.relatedPosts.length > 0 && (
                        <section className="border-t border-gray-800 mt-16 pt-10">
                            <h2 className="text-2xl font-bold mb-8">Related Reading</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                {post.relatedPosts.map((rel) => (
                                    <Link key={rel.slug} href={`/blog/${rel.slug}`} className="group block h-full">
                                        <div className="flex flex-col h-full space-y-4">
                                            <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-800 group-hover:border-purple-500/60 transition-colors flex-shrink-0">
                                                <Image src={rel.image} alt={rel.title} fill className="object-cover" />
                                            </div>
                                            <div className="flex-grow">
                                                <div className="flex items-center gap-2 text-xs text-purple-400 mb-2">
                                                    <BrainCircuit className="h-4 w-4" />
                                                    <span>{rel.category}</span>
                                                </div>
                                                <h3 className="font-semibold group-hover:text-purple-400 transition-colors line-clamp-2">
                                                    {rel.title}
                                                </h3>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </article>
            </main>
        </>
    )
}