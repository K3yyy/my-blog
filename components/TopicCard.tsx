import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface TopicCardProps {
    title: string
    description: string
    icon: React.ReactNode
    count: number
    slug: string
}

export function TopicCard({ title, description, icon, count, slug }: TopicCardProps) {
    return (
        <Link
            href={`/topics/${slug}`}   // ← Correct path: goes to the topic's filtered article page
            className="group block h-full"
        >
            <Card className="bg-gray-900 border-gray-800 hover:border-purple-500/50 transition-colors h-full flex flex-col">
                <CardHeader>
                    <div className="flex items-center justify-between gap-4">
                        <div className="bg-purple-500/10 p-3 rounded-lg text-purple-500">
                            {icon}
                        </div>
                        <div className="bg-gray-800 px-3 py-1 rounded-full text-sm text-gray-300">
                            {count} {count === 1 ? "article" : "articles"}
                        </div>
                    </div>
                    <CardTitle className="text-xl text-white mt-4 group-hover:text-purple-400 transition-colors">
                        {title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                    <CardDescription className="text-gray-400">
                        {description}
                    </CardDescription>
                </CardContent>
                <CardFooter>
          <span className="text-purple-500 text-sm font-medium group-hover:text-purple-400 transition-colors">
            View articles →
          </span>
                </CardFooter>
            </Card>
        </Link>
    )
}