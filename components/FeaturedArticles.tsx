// components/FeaturedArticles.tsx
import Link from "next/link";
import {BrainCircuit, Eye} from "lucide-react";
import { FeaturedCard } from "./FeaturedCard";

export function FeaturedArticles() {
    return (
        <section className="mb-20">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">Featured Articles</h2>
                <Link
                    href="/articles/"
                    className="text-purple-500 hover:text-purple-400 text-sm flex items-center gap-2"
                >
                    View all <Eye className="h-4 w-4" />
                </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
                {/* You can move data to a separate file or fetch from CMS later */}
                <FeaturedCard
                    title="The Strangest Animal Behaviors That Defy Logic"
                    description="From penguins proposing with pebbles to dolphins getting high on pufferfish – exploring the weirdest things animals do."
                    image="https://images.unsplash.com/photo-1617791160505-6f00504e3519?q=80&w=600&h=400&auto=format&fit=crop"
                    date="May 15, 2023"
                    category="Weird Nature"
                    icon={<BrainCircuit className="h-5 w-5" />}
                    slug="strangest-animal-behaviors"
                />
                {/* ... add the other two featured cards similarly ... */}
            </div>
        </section>
    );
}