// components/RecentArticles.tsx
import { ArticleCard } from "./ArticleCard";

export function RecentArticles() {
    return (
        <section className="mb-20">
            <h2 className="text-2xl font-bold mb-8">Recent Articles</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Example articles – replace with real data later */}
                <ArticleCard
                    title="The World's Strangest Competitions and Festivals"
                    excerpt="From cheese rolling to wife-carrying races – celebrating the most bizarre human traditions around the globe."
                    topics={{ title: "Weird Events" }} // ← changed to topics object
                    date="2023-07-05" // ISO format recommended
                    slug="strangest-competitions-festivals"
                    hero_image_url="https://images.unsplash.com/photo-1633412802994-5c058f151b66?q=80&w=600&h=400&auto=format&fit=crop"
                    read_time="6"
                    priority={false}
                />

                <ArticleCard
                    title="The World's Strangest Competitions and Festivals"
                    excerpt="From cheese rolling to wife-carrying races – celebrating the most bizarre human traditions around the globe."
                    topics={{ title: "Weird Events" }}
                    date="2023-07-05"
                    slug="strangest-competitions-festivals"
                    hero_image_url="https://images.unsplash.com/photo-1633412802994-5c058f151b66?q=80&w=600&h=400&auto=format&fit=crop"
                    read_time="6"
                    priority={false}
                />
            </div>
        </section>
    );
}