// app/page.tsx
"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { NewsletterSection } from "@/components/NewsletterSection";
import { Footer } from "@/components/Footer";
import { ArticleCard } from "@/components/ArticleCard";
import {getSupabaseClient} from "@/lib/supabase/client";



export default function Home() {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const newsletterRef = useRef<HTMLElement>(null);

    const scrollToNewsletter = () => {
        newsletterRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSubscribe = async (e: FormEvent) => {
        e.preventDefault();
        if (!email || !email.includes("@")) {
            toast({
                title: "Invalid email",
                description: "Please enter a valid email address.",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);

        // Simulate API call (your original logic)
        setTimeout(() => {
            toast({
                title: "Subscription successful!",
                description: "Thank you for subscribing.",
            });
            setEmail("");
            setIsSubmitting(false);
        }, 1000);
    };

    // ───────────────────────────────────────────────
    // Fetch recent articles client-side (matches your schema)
    // ───────────────────────────────────────────────
    const [recentArticles, setRecentArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRecent() {
            try {
                const supabase =  getSupabaseClient();

                const { data, error } = await supabase
                    .from("articles")
                    .select(`
            slug,
            title,
            excerpt,
            date,
            read_time,
            hero_image_url,
            topics!topic_id (title)
          `)
                    .eq("status", "published")
                    .order("date", { ascending: false })
                    .limit(3);

                if (error) {
                    console.error("Error fetching recent articles:", error.message);
                    toast({
                        title: "Failed to load articles",
                        description: error.message,
                        variant: "destructive",
                    });
                    return;
                }

                setRecentArticles(data ?? []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchRecent();
    }, []);

    return (
        <div className="min-h-screen bg-black text-white">
            <Header onSubscribeClick={scrollToNewsletter} />

            <main className="container mx-auto px-4 py-5">
                <HeroSection onNewsletterClick={scrollToNewsletter} />

                <h4 className="text-sm font-medium text-gray-400 mb-3 tracking-wide uppercase">
                    Recently Posted
                </h4>

                <div className="flex flex-col gap-y-16">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loading ? (
                            <p className="col-span-full text-center text-gray-400 py-8">
                                Loading recent articles...
                            </p>
                        ) : recentArticles.length > 0 ? (
                            recentArticles.map((article) => (
                                <ArticleCard
                                    key={article.slug}
                                    slug={article.slug}
                                    title={article.title}
                                    excerpt={article.excerpt}
                                    topics={article.topics}           // { title: string }
                                    date={article.date}
                                    read_time={article.read_time}
                                    hero_image_url={article.hero_image_url}
                                />
                            ))
                        ) : (
                            <p className="col-span-full text-center text-gray-400 py-8">
                                No recent articles yet.
                            </p>
                        )}
                    </div>

                    {/*<FeaturedArticles />*/}
                    {/*<RecentArticles />*/}

                    <NewsletterSection
                        ref={newsletterRef}
                        email={email}
                        setEmail={setEmail}
                        isSubmitting={isSubmitting}
                        handleSubscribe={handleSubscribe}
                    />
                </div>
            </main>

            <Footer />
        </div>
    );
}