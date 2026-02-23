// components/NewsletterSection.tsx
import { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@supabase/supabase-js"; // or @supabase/ssr if using SSR
import type { NewsletterFormProps } from "@/types";

// Initialize Supabase client (better to do this once in a provider or lib)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const NewsletterSection = forwardRef<HTMLElement, NewsletterFormProps>(
    ({ email, setEmail, isSubmitting, handleSubscribe }, ref) => {

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();

            if (!email?.trim()) return;

            // Your existing handler (toast, etc.)
            if (handleSubscribe) handleSubscribe(e);

            // Insert to Supabase
            const { error } = await supabase
                .from("newsletter_subscribers")
                .insert({ email });

            if (error) {
                console.error("Subscribe error:", error);
            }

            setEmail(""); // clear input

        };

        return (
            <section
                ref={ref}
                id="newsletter"
                className="bg-gray-900 rounded-xl p-10 mb-5"
            >
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Stay Updated</h2>
                        <p className="text-gray-400">
                            Subscribe to our newsletter to receive the latest weird discoveries, strange facts, quirky stories, and unexpected joys.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            className="bg-black border-gray-800 focus-visible:ring-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isSubmitting}
                        />
                        <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
                            disabled={isSubmitting || !email.trim()}
                        >
                            {isSubmitting ? "Subscribing..." : "Subscribe"}
                        </Button>
                    </form>
                </div>
            </section>
        );
    }
);

NewsletterSection.displayName = "NewsletterSection";

export { NewsletterSection };