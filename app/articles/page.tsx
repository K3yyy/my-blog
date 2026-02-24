// app/articles/page.tsx
import { createSupabaseServer } from "@/lib/supabase/server"
import { ArticleCard } from "@/components/ArticleCard"
import HeaderClient from "@/components/HeaderClient"   // ← new client wrapper
import { Footer } from "@/components/Footer"
import { Suspense } from "react"

type Article = {
    title: string
    description: string
    category: string
    date: string       // or Date – adjust based on your DB
    slug: string
    image_url?: string
}

async function getArticles() {
    const supabase = await createSupabaseServer()

    const { data, error } = await supabase
        .from("articles")
        .select("title, description, category, date, slug, image_url")
        .eq("published", true)
        .order("date", { ascending: false })

    if (error) {
        console.error("Articles fetch error:", error)
        return []
    }

    return data || []
}

export default async function ArticlesPage() {
    const articles = await getArticles()

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Use client wrapper here */}
            <HeaderClient />

            <main className="container mx-auto px-4 py-12">
                <section className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-10 text-center md:text-left">
                        All Articles
                    </h1>

                    <Suspense
                        fallback={
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="h-80 bg-gray-900/50 rounded-xl animate-pulse" />
                                ))}
                            </div>
                        }
                    >
                        {articles.length === 0 ? (
                            <p className="text-center text-xl text-gray-400 py-16">
                                No articles found yet.
                            </p>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {articles.map((article) => (
                                    <ArticleCard
                                        key={article.slug}
                                        title={article.title}
                                        description={article.description}
                                        category={article.category}
                                        date={article.date}
                                        slug={article.slug}
                                        image={article.image_url}
                                    />
                                ))}
                            </div>
                        )}
                    </Suspense>
                </section>
            </main>

            <Footer />
        </div>
    )
}