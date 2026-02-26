// app/blog/[slug]/page.tsx
// SERVER COMPONENT – no "use client"

import { notFound } from 'next/navigation'
import { Footer } from '@/components/Footer'
import { createSupabaseServer } from '@/lib/supabase/server'
import {BlogPostClient} from "@/app/blog/[slug]/BlogPostClient";



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

    // Do NOT use .single() — it throws when 0 rows
    const { data: rawArticles, error } = await supabase
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
        .limit(1) // expect at most 1 row

    if (error) {
        console.error('Supabase fetch error:', error.message)
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

// // Pre-render all published slugs (static generation)
// export async function generateStaticParams() {
//     // Use anon client for static generation (no cookies!)
//     const { createClient } = await import('@supabase/supabase-js')
//
//     const supabaseStatic = createClient(
//         process.env.NEXT_PUBLIC_SUPABASE_URL!,
//         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//     )
//
//     const { data: articles } = await supabaseStatic
//         .from('articles')
//         .select('slug')
//         .eq('status', 'published')
//
//     return (articles ?? []).map(article => ({
//         slug: article.slug!,
//     }))
// }