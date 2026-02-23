"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, BrainCircuit, Clock, Share2, Facebook, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Header } from "@/components/Header"
import { useRouter } from "next/navigation"   // ← Correct import – this is the fix!

type Post = {
    title: string
    date: string
    author: string
    category: string
    readTime: string
    image: string
    content: string
}

export function BlogPostClient({ post, slug }: { post: Post; slug: string }) {
    const { toast } = useToast()
    const router = useRouter()   // ← Now this gives you a real router object

    const pageUrl = typeof window !== "undefined" ? window.location.href : ""

    const handleSubscribeClick = () => {
        router.push("/#newsletter")   // ← This will now work
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
                // Instagram doesn't support direct web sharing of links well – this opens profile
                shareUrl = `https://www.instagram.com/k3y_yy/`
                // If you want better Instagram sharing, consider a "Copy link & open app" flow
                break
        }

        if (shareUrl) {
            window.open(shareUrl, "_blank", "noopener,noreferrer")
        }
    }

    return (
        <>
            <Header onSubscribeClick={handleSubscribeClick} />

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
                        <div className="flex text-blue-500 flex-wrap gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-9 border-gray-700 hover:bg-gray-900 hover:text-purple-300"
                                onClick={() => handleShare("instagram")}
                            >
                                <Instagram className="h-4 w-4 mr-2" />
                                Instagram
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
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            className="h-9 border-gray-700 text-purple-500 hover:bg-gray-900 hover:text-purple-300"
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
                </article>
            </main>
        </>
    )
}