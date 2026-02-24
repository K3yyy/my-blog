// app/admin/new-article/page.tsx
import ArticleForm from '@/components/ArticleForm'

export default function NewArticlePage() {
    return (
        <div className="min-h-screen bg-gray-950 text-white py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold mb-10 text-purple-400 text-center md:text-left">
                    Create New Article
                </h1>

                {/* No userId needed anymore */}
                <ArticleForm />
            </div>
        </div>
    )
}