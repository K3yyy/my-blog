
import type { LucideIcon } from "lucide-react";

export interface CardBaseProps {
    title: string;
    description: string;
    image?: string;
    date: string;
    category: string;
    slug?: string;
}
export type ArticleCardProps = CardBaseProps

export interface FeaturedCardProps extends CardBaseProps {
    icon: LucideIcon; // or LucideIcon if you want stricter typing
}

export interface TopicCards  {
    title: string;
    description: string;
    icon: string;
    count: number;

}

export interface NewsletterFormProps {
    email: string;
    setEmail: (value: string) => void;
    isSubmitting: boolean;
    handleSubscribe: (e: React.FormEvent) => Promise<void>;
}



