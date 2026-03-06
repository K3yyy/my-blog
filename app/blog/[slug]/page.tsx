import { notFound } from 'next/navigation'
import { Footer } from '@/components/Footer'
import { createSupabaseServer } from '@/lib/supabase/server'
import {BlogPostClient} from "@/app/blog/[slug]/BlogPostClient";

// Force dynamic — always fetch fresh, never serve stale 404
export const dynamic = 'force-dynamic'

// Supabase row shape (loose types from query)
type ArticleResponse = {
    slug: string | null
    title: string | null
    date: string | null
    author: string | null
    read_time: string | null
    image_urls: string[] | null
    hero_image_url: string | null
    sections: string[] | null
    excerpt: string | null
    topics: { title: string } | null
}

// Shape expected by BlogPostClient
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

function formatDate(dateStr: string | null): string {
    if (!dateStr) return 'No date'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
    // Khmer option:
    // return date.toLocaleDateString('km-KH', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default async function BlogPostPage({
                                               params,
                                           }: {
    params: Promise<{ slug: string }>  // ← Next.js 15+ style (Promise)
}) {
    // Unwrap params with await – fixes "params is a Promise" error
    const { slug } = await params

    // Safety guard (optional but good practice)
    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
        console.error('No valid slug in params:', params)
        notFound()
    }

    const supabase = await createSupabaseServer()

    // Retry once on failure to handle Supabase cold starts / transient errors
    let rawArticles = null
    let error = null

    for (let attempt = 0; attempt < 2; attempt++) {
        const result = await supabase
            .from('articles')
            .select(`
              slug,
              title,
              excerpt,
              date,
              read_time,
              image_urls,
              hero_image_url,
              sections,
              topics!topic_id (title)
            `)
            .eq('slug', slug)
            .eq('status', 'published')
            .limit(1)

        if (!result.error && result.data && result.data.length > 0) {
            rawArticles = result.data
            error = null
            break
        }

        error = result.error
        // Small wait before retry
        if (attempt === 0) await new Promise(r => setTimeout(r, 300))
    }

    if (error) {
        console.error('Supabase fetch error after retries:', error.message)
        notFound()
    }

    if (!rawArticles || rawArticles.length === 0) {
        console.error(`Article not found for slug: ${slug}`)
        notFound()
    }

    // Take the first row
    const article = rawArticles[0] as unknown as ArticleResponse

    const post: Post = {
        title: article.title || 'Untitled Article',
        date: formatDate(article.date),
        author: article.author || 'Keyy',
        category: article.topics?.title || 'Uncategorized',
        readTime: article.read_time || '5 min read',
        image_urls: article.image_urls || [],
        image: article.hero_image_url || '/images/placeholder-article.jpg',
        sections:
            article.sections && article.sections.length > 0
                ? article.sections
                : ['<p>No content available for this article yet.</p>'],
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <main className="flex-1">
                <BlogPostClient post={post} slug={slug} />
            </main>
            <Footer />
        </div>
    )
}