import Image from 'next/image'
import Link from 'next/link'
import { BrainCircuit, Clock } from 'lucide-react'

export interface ArticleCardProps {
    slug: string
    title: string
    excerpt?: string
    topics?: {
        title: string
        slug?: string | null
    } | null                     // ← single object or null (NOT array)
    date: string
    read_time?: number | string | null
    hero_image_url?: string | null
    priority?: boolean
}

export function ArticleCard({
                                slug,
                                title,
                                excerpt,
                                topics,
                                date,
                                read_time,
                                hero_image_url,
                                priority = false,
                            }: ArticleCardProps) {
    // Safely extract category string – this prevents object-as-child error
    const category = topics?.title || 'Uncategorized'

    const imageSrc = hero_image_url || '/images/article-placeholder.jpg'

    const formattedDate = new Date(date).toLocaleDateString('km-KH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    const readTimeText = read_time ? `${read_time} Read` : null

    return (
        <Link
            href={`/blog/${slug}`}
            className="group block h-full focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-xl transition-transform hover:-translate-y-1"
            aria-label={` ${title}`}
        >
            <div className="flex flex-col h-full bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-purple-900/30 hover:border-purple-600/60 transition-all duration-300">
                {/* Image */}
                <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                        src={imageSrc}
                        alt={` ${title}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        quality={75}
                        priority={priority}
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/8QAFRABAQAAAAAAAAAAAAAAAAAAAAH/2gAMAwEAAhEDEQA/AA=="
                    />
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                    {/* Category – use STRING only */}
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-purple-400 mb-3">
                        <BrainCircuit className="h-4 w-4" />
                        <span>{category}</span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-100 group-hover:text-purple-300 transition-colors line-clamp-2 mb-3">
                        {title}
                    </h3>

                    <p className="text-sm text-gray-400 line-clamp-3 mb-4 flex-grow">
                        {excerpt}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mt-auto">
                        <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            <time dateTime={date}>{formattedDate}</time>
                        </div>

                        {readTimeText && <span>• {readTimeText}</span>}
                    </div>
                </div>
            </div>
        </Link>
    )
}