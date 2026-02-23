// app/page.tsx
"use client";

import { useState, useRef, type FormEvent } from "react";
import { useToast } from "@/components/ui/use-toast";

import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";

import { NewsletterSection } from "@/components/NewsletterSection";
import { Footer } from "@/components/Footer";
import {articles} from "@/lib/data";
import {ArticleCard} from "@/components/ArticleCard";

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
        // Simulate API call
        setTimeout(() => {
            toast({
                title: "Subscription successful!",
                description: "Thank you for subscribing.",
            });
            setEmail("");
            setIsSubmitting(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Header onSubscribeClick={scrollToNewsletter} />

            <main className="container mx-auto px-4 py-5">
                <HeroSection onNewsletterClick={scrollToNewsletter} />

               <div className="flex flex-col gap-y-16">
                   <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                       {[...articles]
                           .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                           .slice(0, 3)
                           .map((article) => (
                               <ArticleCard
                                   key={article.slug}
                                   title={article.title}
                                   description={article.description}
                                   category={article.category}
                                   date={article.date}
                                   slug={article.slug}
                                   image={article.image}
                               />
                           ))}

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