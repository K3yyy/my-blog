// app/topics/page.tsx
"use client"

import { useRouter } from "next/navigation"
import { BrainCircuit, Cpu, Eye } from "lucide-react"
import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"
import { TopicCard } from "@/components/TopicCard"
import {articles} from "@/lib/data";


// Base topic definitions (without hardcoded count)
 const topicDefinitions = [
    {
        title: "Life Experiments",
        description: "Personal stories, lessons, and reflections from real-life experiences that shape who we are.",
        icon: <BrainCircuit className="h-6 w-6" />,
        slug: "life-experiments",
    },
    {
        title: "The Weird & Wonderful",
        description: "Exploring strange ideas, unusual moments, and the beautiful weirdness hidden in everyday life.",
        icon: <Eye className="h-6 w-6" />,
        slug: "weird-and-wonderful",
    },
    {
        title: "Unexpected Lessons",
        description: "Things life teaches us when we least expect it — small moments with big meaning.",
        icon: <Cpu className="h-6 w-6" />,
        slug: "unexpected-lessons",
    },
    {
        title: "Mind & Curiosity",
        description: "Thoughts, deep questions, and curious discoveries that expand the way we see the world.",
        icon: <BrainCircuit className="h-6 w-6" />,
        slug: "mind-and-curiosity",
    },
]

// Compute real counts from articles
const topicsWithCounts = topicDefinitions.map((topic) => {
    const count = articles.filter(
        (article) => article.category.toLowerCase().replace(/\s+/g, "-") === topic.slug
    ).length

    return {
        ...topic,
        count,
    }
})

export default function TopicsPage() {
    const router = useRouter()
    const handleSubscribeClick = () => router.push("/#newsletter")

    return (
        <div className="min-h-screen bg-black text-white">
            <Header onSubscribeClick={handleSubscribeClick} />

            <main className="container mx-auto px-4 py-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center">Topics</h1>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {topicsWithCounts.map((topic) => (
                        <TopicCard
                            key={topic.slug}
                            title={topic.title}
                            description={topic.description}
                            icon={topic.icon}
                            count={topic.count}
                            slug={topic.slug}
                        />
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    )
}