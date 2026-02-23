// app/topics/[slug]/page.tsx
"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"
import { ArticleCard } from "@/components/ArticleCard"
import {articles} from "@/lib/data";


export default function TopicDetailPage() {
    const params = useParams()
    const slug = params.slug as string

    // Find matching articles (normalize category to slug format)
    const topicArticles = articles.filter(
        (article) => article.category.toLowerCase().replace(/\s+/g, "-") === slug
    )

    const topicTitle = slug
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")

    return (
        <div className="min-h-screen bg-black text-white">
            <Header onSubscribeClick={function(): void {
                throw new Error("Function not implemented.")
            } } />

            <main className="container mx-auto px-4 py-12">
                <Link
                    href="/topics"
                    className="inline-flex items-center text-gray-400 hover:text-purple-300 mb-8 group"
                >
                    <ArrowLeft className="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1" />
                    Back to Topics
                </Link>

                <h1 className="text-4xl md:text-5xl font-bold mb-4 capitalize">
                    {topicTitle}
                </h1>
                <p className="text-xl text-gray-300 mb-12">
                    {topicArticles.length} {topicArticles.length === 1 ? "article" : "articles"} in this topic
                </p>

                {topicArticles.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {topicArticles.map((article) => (
                            <ArticleCard key={article.slug} {...article} />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-400 py-20 text-lg">
                        No articles yet in this topic... more weirdness coming soon!
                    </p>
                )}
            </main>

            <Footer />
        </div>
    )
}