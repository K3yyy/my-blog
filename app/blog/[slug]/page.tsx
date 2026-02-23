// app/blog/[slug]/page.tsx
// This is a SERVER COMPONENT — no "use client" here

import { BlogPostClient } from "./BlogPostClient"
import { Footer } from "@/components/Footer"

// Static blog posts data (ideal for static export / GitHub Pages)
const blogPosts: Record<
    string,
    {
        title: string
        date: string
        author: string
        category: string
        readTime: string
        image: string
        content: string
        relatedPosts: Array<{
            title: string
            category: string
            image: string
            slug: string
        }>
    }
> = {
    "talking-to-strangers": {
        title: "Getting Lost on Purpose: What Wandering Taught Me",
        date: "May 15, 2023",
        author: "Keyy",
        category: "Life Experiments",
        readTime: "6 min read",
        image:
            "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2000&h=1000&auto=format&fit=crop",
        content: `
      <p>I once decided to walk without a destination. No map. No plan. Just movement.</p>
      <h2>Why We Fear Getting Lost</h2>
      <p>We are trained to follow directions — in school, in careers, in life. Getting lost feels like failure.</p>
      <h2>But Something Strange Happened</h2>
      <p>When I stopped trying to control the path, I noticed things I normally ignore: small streets, quiet conversations, sunlight hitting walls differently.</p>
      <h2>The Unexpected Lesson</h2>
      <p>Sometimes clarity doesn’t come from planning. It comes from wandering.</p>
      <p>Maybe getting lost isn’t about losing direction — maybe it’s about discovering one.</p>
    `,
        relatedPosts: [
            {
                title: "Midnight Thoughts That Changed My Perspective",
                category: "Unexpected Lessons",
                image:
                    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=600&h=400&auto=format&fit=crop",
                slug: "midnight-thoughts",
            },
        ],
    },
    // Add your other posts here (midnight-thoughts, beauty-of-doing-nothing, chasing-curiosity)
    // Example:
    // "midnight-thoughts": { ... same structure ... },
}

export default async function BlogPostPage({
                                               params,
                                           }: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const post = blogPosts[slug]

    if (!post) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
                    <p className="text-gray-400 mb-8">
                        The blog post you're looking for doesn't exist or has been moved.
                    </p>
                    <a
                        href="/"
                        className="inline-block border border-purple-500 text-purple-500 px-6 py-3 rounded hover:bg-purple-950 hover:text-white transition-colors"
                    >
                        Return Home
                    </a>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <BlogPostClient post={post} slug={slug} />

            <Footer />
        </div>
    )
}