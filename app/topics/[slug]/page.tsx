// app/topics/[slug]/page.tsx
// Server Component – no "use client"

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { createSupabaseServer } from '@/lib/supabase/server'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ArticleCard } from '@/components/ArticleCard'


export default async function TopicDetailPage({
                                                  params,
                                              }: {
    params: { slug: string }
}) {
    const { slug } = params

    // Guard against invalid slug
    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
        notFound()
    }

    const supabase = await createSupabaseServer()

    // Human-readable title
    const topicTitle = slug
        .trim()
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ') || 'Topic'

    // Fetch only articles for this topic
    const { data: articles, error } = await supabase
        .from('articles')
        .select(`
      slug,
      title,
      excerpt,
      date,
      read_time,
      hero_image_url,
      topics!topic_id (
        title,
        slug
      )
    `)
        .eq('status', 'published')
        .eq('topics.slug', slug)           // ← filters by topic slug
        // If no slug in topics table → use this instead:
        // .eq('topics.title', topicTitle)
        .order('date', { ascending: false })

    if (error) {
        console.error('Supabase error:', error.message)
        notFound()
    }

    const topicArticles = articles ?? []

    return (
        <div className="min-h-screen bg-black text-white">
            <Header onSubscribeClick={() => console.log('Subscribe clicked')} />

            <main className="container mx-auto px-4 py-12">
                <Link
                    href="/articles?topic"
                    className="inline-flex items-center text-gray-400 hover:text-purple-300 mb-8 group"
                >
                    <ArrowLeft className="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1" />
                    Back to Topics
                </Link>

                <h1 className="text-4xl md:text-5xl font-bold mb-4 capitalize">
                    {topicTitle}
                </h1>

                <p className="text-xl text-gray-300 mb-12">
                    {topicArticles.length}{' '}
                    {topicArticles.length === 1 ? 'article' : 'articles'} in this topic
                </p>

                {topicArticles.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {topicArticles.map((article) => (
                            <ArticleCard
                                key={article.slug}
                                slug={article.slug}
                                title={article.title}
                                excerpt={article.excerpt}
                                date={article.date}
                                read_time={article.read_time}
                                hero_image_url={article.hero_image_url}
                                priority={false}
                            />
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

// Revalidate every hour
export const revalidate = 3600