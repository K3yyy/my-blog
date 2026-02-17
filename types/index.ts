// types/index.ts
import type { LucideIcon } from "lucide-react";

export interface CardBaseProps {
    title: string;
    description: string;
    image?: string;
    date: string;
    category: string;
    slug?: string;
}

export interface FeaturedCardProps extends CardBaseProps {
    icon: React.ReactNode; // or LucideIcon if you want stricter typing
}

export interface ArticleCardProps extends CardBaseProps {
    // can add more specific fields later if needed
}

export interface NewsletterFormProps {
    email: string;
    setEmail: (value: string) => void;
    isSubmitting: boolean;
    handleSubscribe: (e: React.FormEvent) => Promise<void>;
}