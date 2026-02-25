// app/blog/[slug]/page.tsx
// SERVER COMPONENT

import { notFound } from 'next/navigation';
import { Footer } from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import {BlogPostClient} from "@/app/blog/[slug]/BlogPostClient";




// Define the expected shape from Supabase (this fixes all type errors)
type ArticleResponse = {
    slug: string | null;
    title: string | null;
    date: string | null;
    author: string | null;
    read_time: string | null;
    hero_image_url: string | null;
    sections: string[] | null;
    excerpt: string | null;
    topics: { category: string } | null;  // ← matches your "title as category"
};

function formatDate(dateStr: string | null): string {
    if (!dateStr) return 'No date';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    // For Khmer date (uncomment if you want):
    // return date.toLocaleDateString('km-KH', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const { data: rawArticle, error } = await supabase
        .from('articles')
        // In your select query (both /articles and /[slug]/page.tsx)
        .select(`
  slug,
  title,
  excerpt,
  date,
  read_time,
  hero_image_url,
  sections,
  topics!topic_id (title)
`)
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

    if (error || !rawArticle) {
        console.error('Supabase fetch error:', error?.message || 'Article not found');
        notFound();
    }

    // Type assertion once — now TypeScript knows the shape forever
    const article = rawArticle as unknown as ArticleResponse;

    // Now all accesses are type-safe (no more errors)
    const post = {
        title: article.title || 'Untitled Article',
        date: formatDate(article.date),
        author: article.author || 'Keyy',
        category: article.topics?.category || 'Uncategorized',
        readTime: article.read_time || '5 min read',
        image: article.hero_image_url || '/placeholder.svg?height=540&width=960&text=Cover',
        sections:
            article.sections && article.sections.length > 0
                ? article.sections
                : ['<p>No content available for this article yet.</p>'],
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <main className="flex-1">
                <BlogPostClient post={post} slug={slug} />
            </main>
            <Footer />
        </div>
    );
}

// Optional: pre-render all published slugs
export async function generateStaticParams() {
    const { data: articles } = await supabase
        .from('articles')
        .select('slug')
        .eq('status', 'published');

    return (articles ?? []).map(article => ({
        slug: article.slug!,
    }));
}