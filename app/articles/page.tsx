// app/articles/page.tsx
import { createSupabaseServer } from "@/lib/supabase/server";
import { ArticleCard } from "@/components/ArticleCard";
import HeaderClient from "@/components/HeaderClient";
import { Footer } from "@/components/Footer";
import { Suspense } from "react";

// Type for the Supabase response (matches your select + join)
type ArticleListItem = {
    slug: string;
    title: string;
    excerpt: string | null;          // short preview → map to description
    date: string | null;
    read_time: string | null;
    hero_image_url: string | null;
    image_urls: string[] | null;
    topics: { title: string } | null; // title from topics (no alias needed)
};

async function getArticles(): Promise<ArticleListItem[]> {
    const supabase = await createSupabaseServer();

    const { data, error } = await supabase
        .from("articles")
        .select(`
      slug,
      title,
      excerpt,
      date,
      read_time,
      hero_image_url,
      image_urls,
      topics!topic_id (title)
    `)
        .eq("status", "published")
        .order("date", { ascending: false });

    if (error) {
        console.error("Articles fetch error:", error.message);
        return [];
    }

    // Safe cast — Supabase join returns loose type
    return (data as unknown as ArticleListItem[]) || [];
}

export default async function ArticlesPage() {
    const articles = await getArticles();

    return (
        <div className="min-h-screen bg-black text-white">
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
                                    <div
                                        key={i}
                                        className="h-80 bg-gray-900/50 rounded-xl animate-pulse"
                                    />
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
                                        description={article.excerpt || "No preview available"}
                                        category={article.topics?.title || "Uncategorized"}
                                        date={article.date || "No date"}
                                        slug={article.slug}
                                        image={
                                            article.hero_image_url ||
                                            (article.image_urls?.[0] ?? "/images/placeholder.jpg")
                                        }
                                        // optional if your ArticleCard supports it:
                                        // readTime={article.read_time || undefined}
                                    />
                                ))}
                            </div>
                        )}
                    </Suspense>
                </section>
            </main>

            <Footer />
        </div>
    );
}