import Image from 'next/image'
import Link from 'next/link'
import { BrainCircuit, Clock } from 'lucide-react'

export interface ArticleCardProps {
    title: string
    description: string
    category: string
    date: string
    slug: string
    image?: string
}

export function ArticleCard({
                                title,
                                description,
                                category,
                                date,
                                slug,
                                image,
                            }: ArticleCardProps) {
    return (
        <Link
            href={`/blog/${slug}`}
            className="group block h-full focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-xl transition-transform hover:-translate-y-1"
        >
            <div className="flex flex-col h-full bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-purple-900/30 hover:border-purple-600/60 transition-all duration-300">
                {/* Image */}
                <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                        src={image || '/placeholder.svg?height=360&width=640&text=Article'}
                        alt={`Cover image for ${title}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        quality={82}
                    />
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-purple-400 mb-3">
                        <BrainCircuit className="h-4 w-4" />
                        <span>{category}</span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-100 group-hover:text-purple-300 transition-colors line-clamp-2 mb-3">
                        {title}
                    </h3>

                    <p className="text-sm text-gray-400 line-clamp-3 mb-4 flex-grow">
                        {description}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-auto">
                        <Clock className="h-3.5 w-3.5" />
                        <time dateTime={date}>{date}</time>
                    </div>
                </div>
            </div>
        </Link>
    )
}