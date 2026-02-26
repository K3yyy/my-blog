"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useMemo } from "react";
import { ArticleCard } from "@/components/ArticleCard";
import { ArticleListItem } from "@/app/articles/page";

// Helper: Normalize topic string for comparison and URL
// - lowercase
// - spaces → single hyphen
// - remove special characters
const normalizeTopic = (str: string | null | undefined): string => {
    if (!str) return "";
    return str
        .trim()
        .toLowerCase()
        .replace(/[\s-]+/g, "-")          // spaces or multiple hyphens → one hyphen
        .replace(/[^a-z0-9-]/g, "");      // keep only letters, numbers, hyphens
};

export function ClientFilter({ initialArticles }: { initialArticles: ArticleListItem[] }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // Get current topic from URL and normalize it
    const rawTopic = searchParams.get("topic") || "all";
    const normalizedSelected = normalizeTopic(rawTopic);

    // Filter articles using normalized comparison
    const filteredArticles = useMemo(() => {
        if (normalizedSelected === "all") return initialArticles;

        return initialArticles.filter(article => {
            const articleTopic = article.topics?.title;
            return articleTopic && normalizeTopic(articleTopic) === normalizedSelected;
        });
    }, [initialArticles, normalizedSelected]);

    // Update URL when user changes topic (normalize before saving)
    const handleTopicChange = (newTopic: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (newTopic === "all") {
            params.delete("topic");
        } else {
            const normalized = normalizeTopic(newTopic);
            params.set("topic", normalized);
        }

        router.push(`${pathname}?${params.toString()}`);
    };

    // Get unique topics from data (show original title, but use normalized for value)
    const uniqueTopics = useMemo(() => {
        const topicMap = new Map<string, string>();

        initialArticles.forEach(article => {
            const raw = article.topics?.title;
            if (raw) {
                const norm = normalizeTopic(raw);
                if (!topicMap.has(norm)) {
                    topicMap.set(norm, raw); // store original nice title
                }
            }
        });

        return Array.from(topicMap.entries())
            .map(([norm, original]) => ({ normalized: norm, original }))
            .sort((a, b) => a.original.localeCompare(b.original));
    }, [initialArticles]);

    return (
        <>
            {/* Topic filter dropdown */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
                <label htmlFor="topic-filter" className="text-lg font-medium">
                    Filter by topic:
                </label>
                <select
                    id="topic-filter"
                    value={normalizedSelected}
                    onChange={(e) => handleTopicChange(e.target.value)}
                    className="bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                    <option value="all">All Topics</option>
                    {uniqueTopics.map(({ normalized, original }) => (
                        <option key={normalized} value={normalized}>
                            {original}
                        </option>
                    ))}
                </select>
            </div>

            {filteredArticles.length === 0 ? (
                <p className="text-center text-xl text-gray-400 py-16">
                    No articles found for "{rawTopic === "all" ? "All Topics" : rawTopic}".
                </p>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredArticles.map(article => (
                        <ArticleCard
                            key={article.slug}
                            slug={article.slug}
                            title={article.title}
                            excerpt={article.excerpt || "No preview available..."}
                            topics={article.topics}
                            date={article.date || ""}
                            read_time={article.read_time}
                            hero_image_url={article.hero_image_url}
                            priority={false}
                        />
                    ))}
                </div>
            )}
        </>
    );
}