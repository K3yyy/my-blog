"use client"
import { useRouter } from "next/navigation"
import {Footer} from "@/components/Footer";
import {ArticleCard} from "@/components/ArticleCard";
import {Header} from "@/components/Header";
import {articles} from "@/lib/data";

// Static article data for GitHub Pages


export default function ArticlesPage() {
    const router = useRouter();

    const handleSubscribeClick = () => {
        router.push("/#newsletter")
    }

    return (
        <div className="min-h-screen bg-black text-white">
           <Header onSubscribeClick={handleSubscribeClick} />

            <main className="container mx-auto px-4 py-12">
                <section className="mb-12">
                    <h1 className="text-4xl font-bold mb-8">All Articles</h1>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {articles.map((article, index) => (
                            <ArticleCard
                                key={index}
                                title={article.title}
                                description={article.description}
                                category={article.category}
                                date={article.date}
                                slug={article.slug}
                                image={article.image}
                            />
                        ))}
                    </div>
                </section>
            </main>

            <Footer/>
        </div>
    )
}



