// components/NewsletterSection.tsx
import { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { NewsletterFormProps } from "@/types";

// Use forwardRef + HTMLSectionElement
const NewsletterSection = forwardRef<HTMLElement, NewsletterFormProps>(
    ({ email, setEmail, isSubmitting, handleSubscribe }, ref) => {
        return (
            <section
                ref={ref}                     // ← now ref is correctly typed and passed
                id="newsletter"
                className="bg-gray-900 rounded-xl p-8 mb-20"
            >
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Stay Updated</h2>
                        <p className="text-gray-400">
                            Subscribe to our newsletter to receive the latest weird discoveries,
                            strange facts, quirky stories, and unexpected joys.
                        </p>
                    </div>
                    <form onSubmit={handleSubscribe} className="flex gap-2">
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            className="bg-black border-gray-800 focus-visible:ring-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Subscribing..." : "Subscribe"}
                        </Button>
                    </form>
                </div>
            </section>
        );
    }
);

NewsletterSection.displayName = "NewsletterSection"; // good practice

export { NewsletterSection };