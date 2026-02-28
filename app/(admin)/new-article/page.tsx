"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Trash2, Upload } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import {createClients} from "@/lib/supabase/client";


// Simple slugify
const slugify = (text: string) =>
    text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "")

// Convert plain text → nice HTML (double Enter = new paragraph)
const textToHtml = (text: string): string => {
    if (!text?.trim()) return "<p>No content available for this page.</p>"

    return text
        .trim()
        .split("\n\n")
        .map((para) => {
            const clean = para.trim()
            if (!clean) return ""
            return `<p>${clean.replace(/\n/g, "<br>")}</p>`
        })
        .filter(Boolean)
        .join("")
}

type Page = {
    id: string
    text: string
    imageFile: File | null
    imagePreview: string
}

export default function CreateArticlePage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const [title, setTitle] = useState("")
    const [slug, setSlug] = useState("")
    const [author] = useState("Keyy")
    const [date, setDate] = useState(new Date().toISOString().split("T")[0])
    const [readTime, setReadTime] = useState("5 min read")
    const [category, setCategory] = useState("")
    const [excerpt, setExcerpt] = useState("")

    const [heroFile, setHeroFile] = useState<File | null>(null)
    const [heroPreview, setHeroPreview] = useState("")

    const [pages, setPages] = useState<Page[]>([])

    // Auto generate slug from title
    useEffect(() => {
        if (title) setSlug(slugify(title))
    }, [title])

    const addPage = () => {
        setPages((prev) => [
            ...prev,
            { id: Date.now().toString(), text: "", imageFile: null, imagePreview: "" },
        ])
    }

    const removePage = (index: number) => {
        setPages((prev) => prev.filter((_, i) => i !== index))
    }

    const updatePageText = (index: number, text: string) => {
        setPages((prev) =>
            prev.map((p, i) => (i === index ? { ...p, text } : p))
        )
    }

    const handlePageImage = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setPages((prev) =>
            prev.map((p, i) =>
                i === index
                    ? {
                        ...p,
                        imageFile: file,
                        imagePreview: URL.createObjectURL(file),
                    }
                    : p
            )
        )
    }

    const handleHeroImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setHeroFile(file)
        setHeroPreview(URL.createObjectURL(file))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title || !slug || !category || pages.length === 0) {
            alert("Please fill title, category and at least one page")
            return
        }

        setLoading(true)
        const supabase = createClients()

        try {
            // 1. Get or create topic
            let topicId: string
            const { data: existing } = await supabase
                .from("topics")
                .select("id")
                .eq("title", category.trim())
                .maybeSingle()

            if (existing) {
                topicId = existing.id
            } else {
                const { data: newTopic } = await supabase
                    .from("topics")
                    .insert({ title: category.trim() })
                    .select("id")
                    .single()
                topicId = newTopic!.id
            }

            // 2. Upload hero image
            let heroUrl = "/images/placeholder-article.jpg"
            if (heroFile) {
                const fileExt = heroFile.name.split(".").pop()
                const fileName = `${slug}-hero-${Date.now()}.${fileExt}`
                await supabase.storage.from("article-images").upload(fileName, heroFile)
                const { data } = supabase.storage.from("article-images").getPublicUrl(fileName)
                heroUrl = data.publicUrl
            }

            // 3. Upload page images + convert text to HTML
            const htmlSections: string[] = []
            const imageUrls: (string | null)[] = []

            for (const page of pages) {
                htmlSections.push(textToHtml(page.text))

                let imgUrl: string | null = null
                if (page.imageFile) {
                    const fileExt = page.imageFile.name.split(".").pop()
                    const fileName = `${slug}-page-${htmlSections.length}-${Date.now()}.${fileExt}`
                    await supabase.storage.from("article-images").upload(fileName, page.imageFile)
                    const { data } = supabase.storage.from("article-images").getPublicUrl(fileName)
                    imgUrl = data.publicUrl
                }
                imageUrls.push(imgUrl)
            }

            // 4. Insert article
            const { error } = await supabase.from("articles").insert({
                slug,
                title,
                excerpt: excerpt || null,
                date: new Date(date).toISOString(),
                author,
                read_time: readTime,
                hero_image_url: heroUrl,
                image_urls: imageUrls,
                sections: htmlSections,
                topic_id: topicId,
                status: "published",
            })

            if (error) throw error

            alert("✅ Article created successfully!")
            router.push(`/blog/${slug}`)
            router.refresh()
        } catch (err: any) {
            console.error(err)
            alert("Failed to create article: " + err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-black text-white py-12">
            <div className="max-w-4xl mx-auto px-6">
                <Link
                    href="/articles"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-purple-400 mb-8"
                >
                    <ArrowLeft className="h-5 w-5" /> Back to articles
                </Link>

                <h1 className="text-5xl font-bold mb-10 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Create New Article
                </h1>

                <form onSubmit={handleSubmit} className="space-y-12">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label>Title</Label>
                            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
                        </div>
                        <div>
                            <Label>Slug</Label>
                            <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
                        </div>

                        <div>
                            <Label>Author</Label>
                            <Input value={author} disabled />
                        </div>
                        <div>
                            <Label>Date</Label>
                            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                        </div>

                        <div>
                            <Label>Read Time</Label>
                            <Input value={readTime} onChange={(e) => setReadTime(e.target.value)} />
                        </div>
                        <div>
                            <Label>Category / Topic</Label>
                            <Input
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder="e.g. Technology"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <Label>Excerpt (optional)</Label>
                        <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} />
                    </div>

                    {/* Hero Image */}
                    <div>
                        <Label>Hero / Cover Image (optional)</Label>
                        <div className="mt-2 flex items-center gap-4">
                            <label className="cursor-pointer bg-gray-900 hover:bg-gray-800 border border-gray-700 px-6 py-3 rounded-xl flex items-center gap-2">
                                <Upload className="h-5 w-5" />
                                Choose Hero Image
                                <input type="file" accept="image/*" onChange={handleHeroImage} className="hidden" />
                            </label>
                            {heroPreview && <img src={heroPreview} className="h-24 rounded-lg object-cover" />}
                        </div>
                    </div>

                    {/* Pages */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-semibold">Article Pages</h2>
                            <Button type="button" onClick={addPage} className="flex items-center gap-2">
                                <Plus className="h-5 w-5" /> Add Page
                            </Button>
                        </div>

                        <div className="space-y-10">
                            {pages.map((page, index) => (
                                <div key={page.id} className="border border-gray-800 bg-gray-950/50 p-8 rounded-2xl">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-medium">Page {index + 1}</h3>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removePage(index)}
                                            className="text-red-400 hover:text-red-500"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </Button>
                                    </div>

                                    {/* Page Image */}
                                    <div className="mb-6">
                                        <Label>Page Image (optional - big visual)</Label>
                                        <label className="mt-2 block cursor-pointer bg-gray-900 hover:bg-gray-800 border border-gray-700 px-6 py-4 rounded-xl text-center">
                                            <Upload className="h-6 w-6 mx-auto mb-2" />
                                            Click to upload image for this page
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handlePageImage(index, e)}
                                                className="hidden"
                                            />
                                        </label>
                                        {page.imagePreview && (
                                            <img src={page.imagePreview} className="mt-4 max-h-80 rounded-xl" />
                                        )}
                                    </div>

                                    {/* Page Text */}
                                    <div>
                                        <Label>
                                            Content for this page{" "}
                                            <span className="text-gray-500 text-sm">(double Enter = new paragraph)</span>
                                        </Label>
                                        <Textarea
                                            value={page.text}
                                            onChange={(e) => updatePageText(index, e.target.value)}
                                            rows={14}
                                            className="mt-2 font-mono text-sm"
                                            placeholder="Start typing here..."
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        size="lg"
                        className="w-full text-lg py-7 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                        {loading ? "Creating Article..." : "🚀 Publish Article"}
                    </Button>
                </form>
            </div>
        </div>
    )
}