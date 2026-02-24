"use client"

import { useState } from 'react'
import {createArticleAction} from "@/app/actions/create-article";


export default function ArticleForm() {
    const [title, setTitle] = useState('')
    const [slug, setSlug] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')
    const [date, setDate] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [status, setStatus] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setStatus('Creating...')
        setError(null)

        const formData = new FormData()
        formData.append('title', title)
        formData.append('slug', slug)
        formData.append('description', description)
        formData.append('category', category)
        formData.append('date', date || new Date().toISOString().split('T')[0])
        formData.append('image_url', imageUrl)

        try {
            const result = await createArticleAction(formData)
            setStatus('Article created! Redirecting...')
            window.location.href = `/blog/${result.slug}`  // go to the new article
        } catch (err: any) {
            setError(err.message || 'Failed to create')
            setStatus(null)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Slug (optional)</label>
                <input
                    type="text"
                    value={slug}
                    onChange={e => setSlug(e.target.value)}
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg"
                    placeholder="auto-generated-if-empty"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    required
                    rows={4}
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <input
                    type="text"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    required
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Image URL (optional)</label>
                <input
                    type="url"
                    value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)}
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg"
                />
            </div>

            <button
                type="submit"
                disabled={!!status}
                className="w-full bg-purple-600 py-3 rounded-lg font-medium text-white disabled:opacity-50"
            >
                {status || 'Create Article'}
            </button>

            {error && <p className="text-red-400 mt-4">{error}</p>}
            {status && <p className="text-green-400 mt-4">{status}</p>}
        </form>
    )
}