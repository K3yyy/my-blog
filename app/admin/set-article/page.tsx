"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Pencil, Search, Trash2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClients } from "@/lib/supabase/client"
import Image from "next/image"

type Article = {
    slug: string
    title: string
    date: string
    read_time: string
    hero_image_url: string | null
    topics: { title: string } | null
}

export default function AdminArticlesPage() {
    const router = useRouter()
    const [articles, setArticles] = useState<Article[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    const fetchArticles = async () => {
        const supabase = createClients()
        const { data, error } = await supabase
            .from("articles")
            .select(`
        slug,
        title,
        date,
        read_time,
        hero_image_url,
        topic_id,
        topics!inner (title)
      `)
            .eq("status", "published")
            .order("date", { ascending: false })

        if (error) {
            console.error("Failed to fetch articles:", error)
            alert("Failed to load articles")
        } else {
            setArticles((data || []) as unknown as Article[])
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchArticles()
    }, [])

    const handleDelete = async (slug: string, title: string) => {
        if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return

        const supabase = createClients()
        const { error } = await supabase.from("articles").delete().eq("slug", slug)

        if (error) {
            console.error("Delete error:", error)
            alert("Failed to delete article: " + error.message)
        } else {
            alert("Article deleted successfully!")
            fetchArticles()
        }
    }

    const filteredArticles = articles.filter((article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (loading) {
        return <div className="text-center py-20 text-gray-400">Loading articles...</div>
    }

    return (
        <div className="min-h-screen bg-black text-white py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
                    <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Manage Articles
                    </h1>
                    <Button asChild className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
                        <Link href="new-article">+ Create New Article</Link>
                    </Button>
                </div>

                {/* Card */}
                <Card className="bg-gray-950 border-gray-800">
                    <CardHeader>
                        <CardTitle className="text-xl sm:text-2xl">All Articles</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Search */}
                        <div className="relative mb-6">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                placeholder="Search by title..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 w-full"
                            />
                        </div>

                        {/* Empty state */}
                        {filteredArticles.length === 0 ? (
                            <div className="text-center py-10 text-gray-400">
                                {searchQuery ? "No articles match your search" : "No articles found"}
                            </div>
                        ) : (
                            /* Responsive table */
                            <div className="overflow-x-auto -mx-4 sm:-mx-0">
                                <table className="min-w-full divide-y divide-gray-800">
                                    <thead className="bg-gray-900">
                                    <tr>
                                        <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                                            Title
                                        </th>
                                        <th scope="col" className="hidden md:table-cell px-4 py-3 text-left text-sm font-semibold text-gray-300">
                                            Topic
                                        </th>
                                        <th scope="col" className="hidden sm:table-cell px-4 py-3 text-left text-sm font-semibold text-gray-300">
                                            Date
                                        </th>
                                        <th scope="col" className="hidden lg:table-cell px-4 py-3 text-left text-sm font-semibold text-gray-300">
                                            Read Time
                                        </th>
                                        <th scope="col" className="hidden sm:table-cell px-4 py-3 text-left text-sm font-semibold text-gray-300">
                                            Hero
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-right text-sm font-semibold text-gray-300">
                                            Actions
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800">
                                    {filteredArticles.map((article) => (
                                        <tr key={article.slug} className="hover:bg-gray-900 transition-colors">
                                            <td className="px-4 py-4 text-sm font-medium text-white">
                                                {article.title}
                                            </td>
                                            <td className="hidden md:table-cell px-4 py-4 text-sm text-gray-300">
                                                {article.topics?.title || "—"}
                                            </td>
                                            <td className="hidden sm:table-cell px-4 py-4 text-sm text-gray-400">
                                                {article.date ? new Date(article.date).toLocaleDateString() : "—"}
                                            </td>
                                            <td className="hidden lg:table-cell px-4 py-4 text-sm text-gray-400">
                                                {article.read_time}
                                            </td>
                                            <td className="hidden sm:table-cell px-4 py-4">
                                                {article.hero_image_url ? (
                                                    <div className="w-16 h-10 relative rounded overflow-hidden">
                                                        <Image
                                                            src={article.hero_image_url}
                                                            alt={article.title}
                                                            fill
                                                            className="object-cover"
                                                            sizes="64px"
                                                        />
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-600 text-sm">No image</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button asChild variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300">
                                                        <Link href={`edit-article/${article.slug}`}>
                                                            <Pencil className="h-4 w-4" />
                                                            <span className="sr-only md:not-sr-only ml-1">Edit</span>
                                                        </Link>
                                                    </Button>

                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-400 hover:text-red-300"
                                                        onClick={() => handleDelete(article.slug, article.title)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        <span className="sr-only md:not-sr-only ml-1">Delete</span>
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}