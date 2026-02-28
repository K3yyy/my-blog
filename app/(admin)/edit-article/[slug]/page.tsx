"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Plus, Trash2, Upload } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClients } from "@/lib/supabase/client"

// Simple slugify
const slugify = (text: string) =>
    text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "")

// Plain text → HTML (double Enter = new paragraph)
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

type Topic = {
    id: string
    title: string
}

type Page = {
    id: string
    text: string
    imageFile: File | null
    imagePreview: string
}

export default function EditArticlePage() {
    const router = useRouter()
    const params = useParams()
    const slug = params.slug as string

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploadStatus, setUploadStatus] = useState("")

    const [topics, setTopics] = useState<Topic[]>([])
    const [topicsLoading, setTopicsLoading] = useState(true)
    const [topicsError, setTopicsError] = useState("")

    const [title, setTitle] = useState("")
    const [author] = useState("Keyy")
    const [date, setDate] = useState("")
    const [readTime, setReadTime] = useState("")
    const [category, setCategory] = useState("")
    const [excerpt, setExcerpt] = useState("")
    const [heroPreview, setHeroPreview] = useState("")
    const [heroFile, setHeroFile] = useState<File | null>(null)
    const [pages, setPages] = useState<Page[]>([])

    // Load article + topics
    useEffect(() => {
        async function loadData() {
            const supabase = createClients()

            // Load topics
            const { data: topicsData, error: topicsErr } = await supabase
                .from("topics")
                .select("id, title")
                .order("title")

            if (topicsErr) {
                setTopicsError("Failed to load topics: " + topicsErr.message)
            } else {
                // Fix TS2339 here - explicit type assertion
                setTopics((topicsData || []) as Topic[])
            }
            setTopicsLoading(false)

            // Load article
            const { data: article, error: articleErr } = await supabase
                .from("articles")
                .select(`
          title,
          date,
          read_time,
          excerpt,
          hero_image_url,
          sections,
          image_urls,
          topic_id,
          topics!inner (title)
        `)
                .eq("slug", slug)
                .single()

            if (articleErr || !article) {
                alert("Article not found")
                router.push("/admin/articles")
                return
            }

            setTitle(article.title || "")
            setDate(article.date ? new Date(article.date).toISOString().split("T")[0] : "")
            setReadTime(article.read_time || "5 min read")
            setExcerpt(article.excerpt || "")
            setHeroPreview(article.hero_image_url || "")
            // @ts-ignore
            setCategory(article.topics?.title || "")

            const sections = article.sections || []
            const imageUrls = article.image_urls || []

            const loadedPages: Page[] = []
            const max = Math.max(sections.length, imageUrls.length)

            for (let i = 0; i < max; i++) {
                loadedPages.push({
                    id: `page-${i}`,
                    text: sections[i] || "",
                    imageFile: null,
                    imagePreview: "",
                })
            }

            if (loadedPages.length === 0) {
                loadedPages.push({
                    id: "empty",
                    text: "",
                    imageFile: null,
                    imagePreview: "",
                })
            }

            setPages(loadedPages)
            setLoading(false)
        }

        loadData()
    }, [slug, router])

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

        if (file.size > 10 * 1024 * 1024) {
            alert("Image too large (max 10MB)")
            return
        }
        if (!file.type.startsWith("image/")) {
            alert("Please select an image file")
            return
        }

        setPages((prev) =>
            prev.map((p, i) =>
                i === index ? { ...p, imageFile: file, imagePreview: URL.createObjectURL(file) } : p
            )
        )
    }

    const handleHeroImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 10 * 1024 * 1024) {
            alert("Hero image too large (max 10MB)")
            return
        }
        if (!file.type.startsWith("image/")) {
            alert("Please select an image file")
            return
        }

        setHeroFile(file)
        setHeroPreview(URL.createObjectURL(file))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!title.trim() || !category.trim() || pages.length === 0) {
            alert("Title, topic, and at least one page required")
            return
        }

        setSaving(true)
        setUploadStatus("Updating...")
        const supabase = createClients()

        try {
            const { data: topic, error: topicErr } = await supabase
                .from("topics")
                .select("id")
                .eq("title", category.trim())
                .single()

            if (topicErr || !topic) throw new Error("Topic not found")

            const topicId = topic.id

            let heroUrl = heroPreview
            if (heroFile) {
                setUploadStatus("Uploading new hero image...")
                const fileExt = heroFile.name.split(".").pop()?.toLowerCase() || "jpg"
                const fileName = `bjsgsj_0/${slug}-hero-update-${Date.now()}.${fileExt}`

                const { error } = await supabase.storage
                    .from("blog-images")
                    .upload(fileName, heroFile, { upsert: true })

                if (error) throw error

                const { data } = supabase.storage.from("blog-images").getPublicUrl(fileName)
                heroUrl = data.publicUrl
            }

            const htmlSections: string[] = []
            const imageUrls: (string | null)[] = []

            for (let i = 0; i < pages.length; i++) {
                const page = pages[i]
                htmlSections.push(textToHtml(page.text))

                let imgUrl: string | null = null
                if (page.imageFile) {
                    setUploadStatus(`Uploading image for page ${i + 1}...`)
                    const fileExt = page.imageFile.name.split(".").pop()?.toLowerCase() || "jpg"
                    const fileName = `bjsgsj_0/${slug}-page-${i + 1}-${Date.now()}.${fileExt}`

                    const { error } = await supabase.storage
                        .from("blog-images")
                        .upload(fileName, page.imageFile, { upsert: true })

                    if (error) throw error

                    const { data } = supabase.storage.from("blog-images").getPublicUrl(fileName)
                    imgUrl = data.publicUrl
                }
                imageUrls.push(imgUrl)
            }

            setUploadStatus("Saving changes...")
            const { error: updateError } = await supabase
                .from("articles")
                .update({
                    title,
                    excerpt: excerpt.trim() || null,
                    date: new Date(date).toISOString(),
                    read_time: readTime,
                    hero_image_url: heroUrl,
                    image_urls: imageUrls,
                    sections: htmlSections,
                    topic_id: topicId,
                })
                .eq("slug", slug)

            if (updateError) throw updateError

            alert("✅ Article updated successfully!")
            router.push(`/blog/${slug}`)
            router.refresh()
        } catch (err: any) {
            console.error("Update error:", err)
            alert("Failed to update article:\n" + (err.message || "Unknown error"))
        } finally {
            setSaving(false)
            setUploadStatus("")
        }
    }

    if (loading) return <div className="text-center py-20 text-gray-400">Loading article...</div>

    return (
        <div className="min-h-screen bg-black text-white py-12">
            <div className="max-w-4xl mx-auto px-6">
                <Link
                    href="/admin/articles"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-purple-400 mb-8"
                >
                    <ArrowLeft className="h-5 w-5" />
                    Back to articles
                </Link>

                <h1 className="text-5xl font-bold mb-10 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Edit Article
                </h1>

                <form onSubmit={handleSubmit} className="space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label>Title</Label>
                            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
                        </div>
                        <div>
                            <Label>Slug (cannot change)</Label>
                            <Input value={slug} disabled />
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
                            {topicsLoading ? (
                                <div className="text-gray-400">Loading topics...</div>
                            ) : topicsError ? (
                                <div className="text-red-400">{topicsError}</div>
                            ) : (
                                <Select value={category} onValueChange={setCategory} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a topic" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {topics.map((topic) => (
                                            <SelectItem key={topic.id} value={topic.title}>
                                                {topic.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                    </div>

                    <div>
                        <Label>Excerpt (optional)</Label>
                        <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} />
                    </div>

                    <div>
                        <Label>Hero / Cover Image</Label>
                        <div className="mt-2 flex items-center gap-4">
                            <label className="cursor-pointer bg-gray-900 hover:bg-gray-800 border border-gray-700 px-6 py-3 rounded-xl flex items-center gap-2">
                                <Upload className="h-5 w-5" />
                                Replace Hero Image
                                <input type="file" accept="image/*" onChange={handleHeroImage} className="hidden" />
                            </label>
                            {heroPreview && <img src={heroPreview} alt="Current hero" className="h-24 rounded-lg object-cover" />}
                        </div>
                    </div>

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

                                    <div className="mb-6">
                                        <Label>Page Image</Label>
                                        <label className="mt-2 block cursor-pointer bg-gray-900 hover:bg-gray-800 border border-gray-700 px-6 py-4 rounded-xl text-center">
                                            <Upload className="h-6 w-6 mx-auto mb-2" />
                                            Click to upload/replace image
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handlePageImage(index, e)}
                                                className="hidden"
                                            />
                                        </label>
                                        {page.imagePreview && (
                                            <img src={page.imagePreview} alt={`Page ${index + 1}`} className="mt-4 max-h-80 rounded-xl" />
                                        )}
                                    </div>

                                    <div>
                                        <Label>Content</Label>
                                        <Textarea
                                            value={page.text}
                                            onChange={(e) => updatePageText(index, e.target.value)}
                                            rows={14}
                                            className="mt-2 font-mono text-sm"
                                            placeholder="Edit page content..."
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {uploadStatus && <div className="text-center text-purple-400 font-medium">{uploadStatus}</div>}

                    <Button
                        type="submit"
                        disabled={saving}
                        size="lg"
                        className="w-full text-lg py-7 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                        {saving ? "Updating..." : "💾 Save Changes"}
                    </Button>
                </form>
            </div>
        </div>
    )
}