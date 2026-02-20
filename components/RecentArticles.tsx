// components/RecentArticles.tsx
import { ArticleCard } from "./ArticleCard";

export function RecentArticles() {
    return (
        <section className="mb-20">
            <h2 className="text-2xl font-bold mb-8">Recent Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Add your recent articles here – ideally from props or data fetching */}
                <ArticleCard
                    title="The World's Strangest Competitions and Festivals"
                    description="From cheese rolling to wife-carrying races – celebrating the most bizarre human traditions around the globe."
                    category="Weird Events"
                    date="July 5, 2023"
                    slug="strangest-competitions-festivals"
                    image="https://images.unsplash.com/photo-1633412802994-5c058f151b66?q=80&w=600&h=400&auto=format&fit=crop"
                />
                <ArticleCard
                    title="The World's Strangest Competitions and Festivals"
                    description="From cheese rolling to wife-carrying races – celebrating the most bizarre human traditions around the globe."
                    category="Weird Events"
                    date="July 5, 2023"
                    slug="strangest-competitions-festivals"
                    image="https://images.unsplash.com/photo-1633412802994-5c058f151b66?q=80&w=600&h=400&auto=format&fit=crop"
                />
            </div>
        </section>
    );
}