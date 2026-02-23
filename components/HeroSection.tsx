// components/HeroSection.tsx
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
    onNewsletterClick: () => void;
}

export function HeroSection({ onNewsletterClick }: HeroSectionProps) {
    return (
        <section className="mb-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                        Discover the <span className="text-blue-500">Weird</span>, Enjoy Life,
                        Learn Something Unexpected Every Day
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl">
                        Deep dives into strange facts, quirky discoveries, odd life moments, and
                        the joy of the unexpected.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Link href="/articles/">Latest Articles</Link>
                        </Button>
                        <Button
                            variant="outline"
                            className="border-gray-700 bg-blue-800 hover:bg-blue-700 hover:text-white "
                            onClick={onNewsletterClick}
                        >
                            Join Newsletter
                        </Button>
                    </div>
                </div>
                <div className="relative h-[400px] rounded-xl overflow-hidden border border-gray-800">
                    <Image
                        src="/img.png"
                        alt="Surreal weird scene full of strange and unexpected elements"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                </div>
            </div>
        </section>
    );
}