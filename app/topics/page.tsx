"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BrainCircuit, Cpu, Eye, Github, Linkedin, Mail, Rss, Twitter } from "lucide-react"
import { useRouter } from "next/navigation"
import {TopicCard} from "@/components/TopicCard";
import {Footer} from "@/components/Footer";

// Static topic data for GitHub Pages
const topics = [
    {
        title: "Life Experiments",
        description: "Personal stories, lessons, and reflections from real-life experiences that shape who we are.",
        icon: <BrainCircuit className="h-6 w-6" />,
        count: 12,
        slug: "life-experiments",
    },
    {
        title: "The Weird & Wonderful",
        description:
            "Exploring strange ideas, unusual moments, and the beautiful weirdness hidden in everyday life.",
        icon: <Eye className="h-6 w-6" />,
        count: 8,
        slug: "weird-and-wonderful",
    },
    {
        title: "Unexpected Lessons",
        description: "Things life teaches us when we least expect it — small moments with big meaning.",
        icon: <Cpu className="h-6 w-6" />,
        count: 15,
        slug: "unexpected-lessons",
    },
    {
        title: "Mind & Curiosity",
        description: "Thoughts, deep questions, and curious discoveries that expand the way we see the world.",
        icon: <BrainCircuit className="h-6 w-6" />,
        count: 6,
        slug: "mind-and-curiosity",
    },
]

export default function TopicsPage() {
    const router = useRouter()

    const handleSubscribeClick = () => {
        router.push("/#newsletter")
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <header className="container mx-auto py-6">
                <div className="flex items-center justify-between">
                    <Link href="/" className="text-xl font-bold tracking-tighter">
                        Neural<span className="text-purple-500">Pulse</span>
                    </Link>
                    <nav className="hidden md:flex items-center space-x-6 text-sm">
                        <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                            Home
                        </Link>
                        <Link href="/articles/" className="text-gray-400 hover:text-white transition-colors">
                            Articles
                        </Link>
                        <Link href="/topics/" className="text-white transition-colors border-b-2 border-purple-500 pb-1">
                            Topics
                        </Link>
                        <Link href="/about/" className="text-gray-400 hover:text-white transition-colors">
                            About
                        </Link>
                    </nav>
                    <Button
                        variant="outline"
                        className="border-purple-500 text-purple-500 hover:bg-purple-950 hover:text-white"
                        onClick={handleSubscribeClick}
                    >
                        Subscribe
                    </Button>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12">
                <section className="mb-12">
                    <h1 className="text-4xl font-bold mb-8">Topics</h1>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {topics.map((topic, index) => (
                            <TopicCard
                                key={index}
                                title={topic.title}
                                description={topic.description}
                                icon={topic.icon}
                                count={topic.count}
                                slug={topic.slug}
                            />
                        ))}
                    </div>
                </section>
            </main>

            <Footer/>
        </div>
    )
}


