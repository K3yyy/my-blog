
import { createSupabaseServer } from "@/lib/supabase/server";

import HeaderClient from "@/components/HeaderClient";
import { Footer } from "@/components/Footer";
import { Suspense } from "react";
import {ClientFilter} from "@/components/ClientSiderFilter";


// Type for article data
export type ArticleListItem = {
    slug: string;
    title: string;
    excerpt: string | null;
    date: string | null;
    read_time: string | null;
    hero_image_url: string | null;
    image_urls: string[] | null;
    topics: { title: string } | null;
};

async function getArticles(): Promise<ArticleListItem[]> {
    const supabase = await createSupabaseServer();

    const { data, error } = await supabase
        .from("articles")
        .select(`
      slug, title, excerpt, date, read_time, hero_image_url, image_urls,
      topics!topic_id (title)
    `)
        .eq("status", "published")
        .order("date", { ascending: false });

    if (error) {
        console.error("Articles fetch error:", error.message);
        return [];
    }

    return (data as unknown as ArticleListItem[]) || [];
}

// Server component: fetch all articles once
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

                    {/* Client component handles URL-based filtering */}
                    <Suspense
                        fallback={
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="h-80 bg-gray-900/50 rounded-xl animate-pulse" />
                                ))}
                            </div>
                        }
                    >
                        <ClientFilter initialArticles={articles} />
                    </Suspense>
                </section>
            </main>

            <Footer />
        </div>
    );
}