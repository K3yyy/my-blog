// components/FeaturedCard.tsx
import Image from "next/image";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Clock } from "lucide-react";
import type { FeaturedCardProps } from "@/types";

export function FeaturedCard({
                                 title,
                                 description,
                                 image,
                                 date,
                                 category,
                                 icon,
                                 slug = "",
                             }: FeaturedCardProps) {
    return (
        <Card className="bg-gray-900 border-gray-800 overflow-hidden hover:border-purple-500/50 transition-colors">
            <div className="relative h-48">
                <Image
                    src={image || "/placeholder.svg"}
                    alt={title}
                    fill
                    className="object-cover"
                />
            </div>
            <CardHeader>
                <div className="flex items-center gap-2 text-sm text-blue-500 mb-2">
                    {icon}
                    <span>{category}</span>
                </div>
                <CardTitle className="text-xl">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription className="text-gray-400">
                    {description}
                </CardDescription>
            </CardContent>
            <CardFooter className="flex justify-between text-sm text-gray-500">
                <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{date}</span>
                </div>
                <Link
                    href={`/blog/${slug}/`}
                    className="text-blue-500 hover:text-blue-400"
                >
                    Read more →
                </Link>
            </CardFooter>
        </Card>
    );
}