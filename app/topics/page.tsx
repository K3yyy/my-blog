"use client"

import {JSX, useEffect, useState} from "react"
import { useRouter } from "next/navigation"
import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"
import { TopicCard } from "@/components/TopicCard"
import { supabase } from "@/lib/supabase"
import {Brain, BrainCircuit, FlaskConical, HeartHandshake, Lightbulb, Sparkles} from "lucide-react";
import {articles} from "@/lib/data";
import {TopicsLoading} from "@/components/LoadingSkeleton";


// Map icon name from DB → real component
const iconMap: Record<string, JSX.Element> = {
    BrainCircuit: <BrainCircuit className="h-6 w-6" />,
    Sparkles: <Sparkles className="h-6 w-6" />,
    Lightbulb: <Lightbulb className="h-6 w-6" />,
    FlaskConical: <FlaskConical className="h-6 w-6" />,
    Brain: <Brain className="h-6 w-6" />,
    HeartHandshake:<HeartHandshake className="h-6 w-6" />,
    // keep fallback
    default: <Brain className="h-6 w-6" />,
}

export default function TopicsPage() {
    const router = useRouter()
    const [topics, setTopics] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function loadTopics() {
            try {
                const { data, error } = await supabase
                    .from("topics")
                    .select("slug, title, description, icon_name")
                    .order("title")

                if (error) throw error
                if (!data) throw new Error("No topics found")

                // Add icon component + real article count
                const topicsWithData = data.map(topic => {
                    const count = articles.filter(
                        article => article.category.toLowerCase().replace(/\s+/g, "-") === topic.slug
                    ).length

                    return {
                        ...topic,
                        icon: iconMap[topic.icon_name] || iconMap.default,
                        count,
                    }
                })

                setTopics(topicsWithData)
            } catch (err: any) {
                console.error("Failed to load topics:", err)
                setError(err.message || "Something went wrong loading topics")
            } finally {
                setLoading(false)
            }
        }

        loadTopics()
    }, [])

    const handleSubscribeClick = () => router.push("/#newsletter")

    if (loading) {
        return <TopicsLoading />
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <h2 className="text-2xl font-bold text-red-400 mb-4">Oops</h2>
                    <p className="text-gray-300 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg text-white"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <Header onSubscribeClick={handleSubscribeClick} />

            <main className="container mx-auto px-4 py-12">
                <h1 className="text-4xl md:text-4xl font-bold mb-8 text-start">
                    All topics
                </h1>

                {topics.length === 0 ? (
                    <p className="text-center text-gray-400 text-lg py-20">
                        No topics found yet... the universe is still organizing itself.
                    </p>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {topics.map((topic) => (
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
                )}
            </main>

            <Footer />
        </div>
    )
}