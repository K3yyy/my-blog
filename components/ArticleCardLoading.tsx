// components/ArticleCardLoading.tsx
export function ArticleCardLoading() {
    return (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden animate-pulse">
            {/* Image placeholder */}
            <div className="aspect-video w-full bg-gray-800 animate-shimmer" />

            <div className="p-5 flex flex-col gap-4">
                {/* Topics / date pill placeholders */}
                <div className="flex items-center justify-between">
                    <div className="h-6 w-24 bg-gray-800 rounded animate-shimmer" />
                    <div className="h-5 w-16 bg-gray-800 rounded animate-shimmer" />
                </div>

                {/* Title */}
                <div className="h-7 w-4/5 bg-gray-800 rounded animate-shimmer" />

                {/* Excerpt lines */}
                <div className="space-y-2.5">
                    <div className="h-4 w-full bg-gray-800 rounded animate-shimmer" />
                    <div className="h-4 w-5/6 bg-gray-800 rounded animate-shimmer" />
                    <div className="h-4 w-3/4 bg-gray-800 rounded animate-shimmer" />
                </div>

                {/* Read time + footer placeholder */}
                <div className="flex items-center justify-between mt-4">
                    <div className="h-5 w-20 bg-gray-800 rounded animate-shimmer" />
                    <div className="h-5 w-28 bg-gray-800 rounded animate-shimmer" />
                </div>
            </div>
        </div>
    );
}