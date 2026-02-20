"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BrainCircuit, Cpu, Eye, Github, Linkedin, Mail, Rss, Twitter } from "lucide-react"
import { useRouter } from "next/navigation"
import {TopicCard} from "@/components/TopicCard";
import {Footer} from "@/components/Footer";
import {Header} from "@/components/Header";

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
           <Header onSubscribeClick={handleSubscribeClick} />

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


