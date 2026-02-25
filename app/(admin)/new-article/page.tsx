// app/admin/new-article/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

type Topic = {
    id: string
    title: string
    slug: string
}

export default function NewArticlePage() {
    const router = useRouter()

    const [topics, setTopics] = useState<Topic[]>([])
    const [loadingTopics, setLoadingTopics] = useState(true)

    const [form, setForm] = useState({
        title: "",
        slug: "",
        excerpt: "",
        topic_id: "",
        author: "Keyy",
        read_time: "5 min read",
        date: new Date().toISOString().split("T")[0],
        status: "draft",
        hero_image_url: "",
        image_urls: "", // one URL per line (optional fallback)
        sections: "",
    })

    const [additionalImages, setAdditionalImages] = useState<File[]>([])
    const [uploading, setUploading] = useState(false)

    // Fetch all topics when page loads
    useEffect(() => {
        async function loadTopics() {
            const { data, error } = await supabase
                .from("topics")
                .select("id, title, slug")
                .order("title")

            if (error) {
                console.error("Failed to load topics:", error)
                toast({ variant: "destructive", title: "Error", description: "Cannot load topics" })
            } else {
                setTopics(data || [])
            }
            setLoadingTopics(false)
        }

        loadTopics()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleTopicChange = (value: string) => {
        setForm(prev => ({ ...prev, topic_id: value }))
    }

    const handleAdditionalImages = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setAdditionalImages(Array.from(e.target.files))
        }
    }

    // Upload files and get public URLs
    const uploadImages = async (files: File[]): Promise<string[]> => {
        const urls: string[] = []

        for (const file of files) {
            const fileExt = file.name.split('.').pop() || 'jpg'
            const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`
            const filePath = `articles/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('BLOG-IMAGES')  // ← uppercase!
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false,
                })

            if (uploadError) {
                console.error("Upload error:", uploadError)
                throw uploadError
            }

            const { data: urlData } = supabase.storage
                .from('BLOG-IMAGES')
                .getPublicUrl(filePath)

            urls.push(urlData.publicUrl)
        }

        return urls
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setUploading(true)

        try {
            let heroUrl = form.hero_image_url
            let extraImageUrls: string[] = []

            // Upload hero if file selected
            const heroInput = document.getElementById('hero_image') as HTMLInputElement
            if (heroInput?.files?.length) {
                const urls = await uploadImages(Array.from(heroInput.files))
                heroUrl = urls[0]
            }

            // Upload additional images
            if (additionalImages.length > 0) {
                extraImageUrls = await uploadImages(additionalImages)
            }

            // Split sections
            const sectionsArray = form.sections
                .split(/\n\s*\n|\n---\n/)
                .map(s => s.trim())
                .filter(Boolean)

            const payload = {
                title: form.title.trim(),
                slug: form.slug.trim() || form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                excerpt: form.excerpt.trim(),
                topic_id: form.topic_id || null,
                author: form.author.trim(),
                read_time: form.read_time.trim(),
                date: form.date,
                status: form.status,
                hero_image_url: heroUrl || null,
                image_urls: extraImageUrls.length > 0 ? extraImageUrls : null,
                sections: sectionsArray.length > 0 ? sectionsArray : null,
            }

            const { error } = await supabase.from("articles").insert([payload])

            if (error) throw error

            toast({ title: "Success", description: "Article created!" })
            router.push("/articles")
        } catch (err: any) {
            toast({ variant: "destructive", title: "Error", description: err.message })
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">Create New Article</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <Label htmlFor="title">Title *</Label>
                        <Input id="title" name="title" value={form.title} onChange={handleChange} required />
                    </div>

                    {/* Slug */}
                    <div>
                        <Label htmlFor="slug">Slug (auto-generated if empty)</Label>
                        <Input id="slug" name="slug" value={form.slug} onChange={handleChange} />
                    </div>

                    {/* Excerpt */}
                    <div>
                        <Label htmlFor="excerpt">Excerpt / Preview</Label>
                        <Textarea id="excerpt" name="excerpt" value={form.excerpt} onChange={handleChange} rows={3} />
                    </div>

                    {/* Topic Dropdown – easy selection */}
                    <div>
                        <Label>Topic *</Label>
                        {loadingTopics ? (
                            <p className="text-gray-400">Loading topics...</p>
                        ) : topics.length === 0 ? (
                            <p className="text-red-400">No topics found. Please add some in the database.</p>
                        ) : (
                            <Select value={form.topic_id} onValueChange={handleTopicChange} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a topic" />
                                </SelectTrigger>
                                <SelectContent>
                                    {topics.map(topic => (
                                        <SelectItem key={topic.id} value={topic.id}>
                                            {topic.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>

                    {/* Read Time */}
                    <div>
                        <Label htmlFor="read_time">Read Time</Label>
                        <Input id="read_time" name="read_time" value={form.read_time} onChange={handleChange} />
                    </div>

                    {/* Date */}
                    <div>
                        <Label htmlFor="date">Date</Label>
                        <Input id="date" name="date" type="date" value={form.date} onChange={handleChange} />
                    </div>

                    {/* Status */}
                    <div>
                        <Label>Status</Label>
                        <Select value={form.status} onValueChange={v => setForm(p => ({ ...p, status: v }))}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Hero Image Upload */}
                    <div>
                        <Label htmlFor="hero_image">Hero Image (upload from device)</Label>
                        <Input id="hero_image" type="file" accept="image/*" />
                        <p className="text-xs text-gray-500 mt-1">Optional: you can still paste URL below</p>
                        <Input
                            name="hero_image_url"
                            value={form.hero_image_url}
                            onChange={handleChange}
                            placeholder="https://.../hero.jpg (fallback)"
                            className="mt-2"
                        />
                    </div>

                    {/* Additional Images */}
                    <div>
                        <Label htmlFor="additional_images">Additional Images (multiple)</Label>
                        <Input id="additional_images" type="file" accept="image/*" multiple onChange={e => {
                            if (e.target.files) setAdditionalImages(Array.from(e.target.files))
                        }} />
                    </div>

                    {/* Sections */}
                    <div>
                        <Label htmlFor="sections">Content (one section per block, separate with --- or empty lines)</Label>
                        <Textarea
                            id="sections"
                            name="sections"
                            value={form.sections}
                            onChange={handleChange}
                            rows={12}
                            placeholder="Paste your HTML or Markdown here...\n\n---\n\nNext section..."
                            className="font-mono"
                        />
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={uploading}>
                            {uploading ? "Saving..." : "Create Article"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}