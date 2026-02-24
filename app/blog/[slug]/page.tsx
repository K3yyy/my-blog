// app/blog/[slug]/page.tsx
// SERVER COMPONENT

import { notFound } from 'next/navigation'
import { BlogPostClient } from './BlogPostClient'
import { Footer } from '@/components/Footer'
import { supabase } from '@/lib/supabase' // adjust path

// ────────────────────────────────────────────────
// Types (keep same shape your client expects)
// ────────────────────────────────────────────────

type RawBlogPost = {
    slug: string
    title: string
    date: string
    author: string
    category: string
    read_time: string
    hero_image: string
    content: string
}

type ProcessedPost = {
    title: string
    date: string
    author: string
    category: string
    readTime: string          // camelCase to match your client
    image: string             // renamed back for client
    sections: string[]
    // relatedPosts: ...       // add later if needed
}

function splitIntoSections(html: string): string[] {
    const parts = html.split(/(?=<h[23][^>]*>)/).filter(Boolean)
    return parts.length > 0 ? parts.map(s => s.trim()) : [html.trim()]
}

export async function generateStaticParams() {
    // Optional: pre-render known slugs (good for static export)
    // For dynamic → you can skip or fetch all slugs
    const { data: posts } = await supabase
        .from('blog_posts')
        .select('slug')

    return (posts ?? []).map(p => ({ slug: p.slug }))
}

export default async function BlogPostPage({
                                               params,
                                           }: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params

    const { data: rawPost, error } = await supabase
        .from('blog_posts')
        .select('slug, title, date, author, category, read_time, hero_image, content')
        .eq('slug', slug)
        .single()

    if (error || !rawPost) {
        console.error('Supabase fetch error:', error)
        notFound()
    }

    // Transform to match your BlogPostClient props
    const post: ProcessedPost = {
        title: rawPost.title,
        date: rawPost.date,
        author: rawPost.author,
        category: rawPost.category,
        readTime: rawPost.read_time,
        image: rawPost.hero_image,
        sections: splitIntoSections(rawPost.content),
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <main className="flex-1">
                <BlogPostClient
                    post={post}
                    slug={slug}
                />
            </main>
            <Footer />
        </div>
    )
}