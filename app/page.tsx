// app/page.tsx
"use client";

import { useState, useRef, type FormEvent } from "react";
import { useToast } from "@/components/ui/use-toast";

import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { FeaturedArticles } from "@/components/FeaturedArticles";
import { RecentArticles } from "@/components/RecentArticles";
import { NewsletterSection } from "@/components/NewsletterSection";
import { Footer } from "@/components/Footer";

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

            <main className="container mx-auto px-4 py-12">
                <HeroSection onNewsletterClick={scrollToNewsletter} />
                <FeaturedArticles />
                <RecentArticles />

                <NewsletterSection
                    ref={newsletterRef}
                    email={email}
                    setEmail={setEmail}
                    isSubmitting={isSubmitting}
                    handleSubscribe={handleSubscribe}
                />
            </main>

            <Footer />
        </div>
    );
}