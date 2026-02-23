// components/TopicsLoading.tsx
export function TopicsLoading() {
    return (
        <div className="min-h-screen bg-black text-white pb-12">
            {/* Optional: page title skeleton */}
            <div className="container mx-auto px-4 py-8">
                <div className="h-10 w-48 bg-gray-800 rounded animate-shimmer mb-8" />
            </div>

            {/* Grid of skeleton cards - same layout as TopicCard */}
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden animate-pulse"
                        >
                            <div className="p-6 flex flex-col h-full">
                                {/* Header: icon + count pill */}
                                <div className="flex items-center justify-between gap-4 mb-5">
                                    {/* Icon placeholder */}
                                    <div className="w-12 h-12 bg-gray-800 rounded-lg animate-shimmer" />

                                    {/* Count badge */}
                                    <div className="h-7 w-20 bg-gray-800 rounded-full animate-shimmer" />
                                </div>

                                {/* Title */}
                                <div className="h-7 w-4/5 bg-gray-800 rounded animate-shimmer mb-4" />

                                {/* Description */}
                                <div className="space-y-2.5 flex-grow">
                                    <div className="h-4 w-full bg-gray-800 rounded animate-shimmer" />
                                    <div className="h-4 w-5/6 bg-gray-800 rounded animate-shimmer" />
                                    <div className="h-4 w-4/6 bg-gray-800 rounded animate-shimmer" />
                                </div>

                                {/* Footer: "View articles →" */}
                                <div className="mt-6">
                                    <div className="h-5 w-32 bg-gray-800 rounded animate-shimmer" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}